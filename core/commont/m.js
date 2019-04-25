chrome = chrome || browser;

var CommontSet = {
  timer: null,
  loopNum: 0,
  loopMax: 20,
  sep: '|!|',
  config: {
    emoji: null
  },
  textarea: null,
  topTextarea: null,
  loadTimer: null,
  loadPage: 1,
  comments: [],
  count: -1
}

$(document).ready(function(){
  if(/^(t)\.bilibili\.com$/.test(window.location.host) || /^\/(p|d)?\/?$/.test(window.location.pathname)) return false;

  $('body').on('click', '.emoji-list', function(){
    var doc = $(this);

    var data = `${doc.attr('data-emoji-text')},${doc.html()}`;

    if(CommontSet.config.emoji === null) {
      CommontSet.config.emoji = data;
      saveSet();
      createHTML();
    } else {
      reorder(data);
      saveSet();
      createHTML();
    }
  });

  CommontInit();
  window.onpopstate = function() {
    CommontInit();
  }

  $('body').on('click', '.comment-list .reply', function() {
    CommontSet.textarea = $(this).parents('.con').find('.textarea-container textarea');
    createDom({
      isReply: true,
      top: 65,
      left: 80
    });
  });

  $.fn.extend({
      insertAtCaret : function (myValue) {
        var $t = $(this)[0];
        if (document.selection) {
          this.focus();
          var sel = document.selection.createRange();
          sel.text = myValue;
          this.focus();
        } else
          if ($t.selectionStart || $t.selectionStart == '0') {
            var startPos = $t.selectionStart;
            var endPos = $t.selectionEnd;
            var scrollTop = $t.scrollTop;
            $t.value = $t.value.substring(0, startPos) + myValue + $t.value.substring(endPos, $t.value.length);
            this.focus();
            $t.selectionStart = startPos + myValue.length;
            $t.selectionEnd = startPos + myValue.length;
            $t.scrollTop = scrollTop;
          } else {
            this.value += myValue;
            this.focus();
        }
      }
    });

    $('body').on('click', '.btools-history-emoji', function() {
      if($(this).parent().parent().attr('class') === 'btools-history-emoji-box') {
        CommontSet.topTextarea.insertAtCaret($(this).attr('data-emoji-text'));
      } else {
        CommontSet.textarea.insertAtCaret($(this).attr('data-emoji-text'));
      }
      reorder(`${$(this).attr('data-emoji-text')},${$(this).html()}`);
      $(this).one('mouseout' ,function(){
        createHTML();
      });
    });

    $('body').on('click', '.bb-comment .comment-send:eq(0) textarea', function(){
      CommontInit();
    });
});

function CommontInit() {
  CommontSet.timer = setInterval(function() {
    if($('.bb-comment .comment-send:eq(0) textarea').length > 0) {
      CommontSet.topTextarea = $('.bb-comment .comment-send:eq(0) textarea');
      CommontSet.textarea = CommontSet.textarea || $('.bb-comment .comment-send:eq(0) textarea');
      createDom();

      if($('#commentBtoolsBtn').length === 0) {
        $('.bb-comment .comment-header:eq(0)').append(`
          <li class="commentBtoolsLogo"><a id="commentBtoolsBtn" href="javascript:void(0);">${Btools.logo()}</a></li>
        `);

        $('#commentBtoolsBtn').HKM([
          {
            key: 83,
            title: '搜索评论',
            action: () => {
              searchShow();
            }
          }
        ]);
      }

      clearInterval(CommontSet.timer);
      CommontSet.timer = null;
    }
  }, 500);
}

function reorder(key) {
  if(CommontSet.config.emoji !== null) {
    var newEmoji = CommontSet.config.emoji.split(CommontSet.sep);
    var newArr = new Array;
    if(key !== newEmoji[0]) {
      newEmoji.forEach((item, index) => {
        if(key != item) {
          if(newArr.length < 4) {
            newArr.push(item);
          }
        }
      });
      CommontSet.config.emoji = key + CommontSet.sep + newArr.join(CommontSet.sep);
      saveSet();
    }
  }
}

function createHTML() {
  if(CommontSet.config.emoji !== null) {
    var html = '';
    var emoji = CommontSet.config.emoji.split(CommontSet.sep);
    emoji.forEach((item, index) => {
      var val = item.split(',');
      html += `<li class='btools-history-emoji' data-emoji-text='${val[0]}'>${val[1]}</li>`;
    });
    $('.btools-history-emoji-scroll').html(html);
  }
}

function createDom(f_info) {

  f_info = f_info || {
    isReply: false,
    top: 63,
    left: 80
  }

  var reply = f_info.isReply ? 'reply' : 'box';

  if($(`.btools-history-emoji-${reply}`).length > 0) return false;

  CommontSet.textarea.parent('.textarea-container').css({
    'position': 'relative'
  }).append(`
    <div class="btools-history-emoji-${reply}">
      <ul class="btools-history-emoji-scroll"></ul>
    </div>
  `);

  $(`.btools-history-emoji-${reply}`).css({
    'top': f_info.top,
    'left': f_info.left
  });

  chrome.storage.sync.get(CommontSet.config, function(items){
    CommontSet.config = items;
    createHTML();
  });
}

function saveSet() {
  chrome.storage.sync.set(CommontSet.config, function() {
  });
}

function clearSet() {
  $('body').append(`
    <a id="clearSet" href="javascript:void(0);" style="position: fixed; top: 50px; left: 50px; font-size: 50px; z-index: 9999999999;">一键清空</a>
  `).find('#clearSet').click(function() {
    chrome.storage.sync.set({emoji: null}, function() {
    });
  });
}

// clearSet();

function searchShow() {
  if($('#BtoolsSearchComments').length !== 0) return false;
  $('body').append(`
    <div id="BtoolsSearchComments">
      <a id="BtoolsSearchClose" href="javascript:void(0);">×</a>
      <input type="text" id="BtoolsSearchText" placeholder="请输入关键词按下回车键" autocomplete="off" >
      <div class="BtoolsSearchListBox">
        <ul id="BtoolsSearchList">

        </ul>
      </div>
      <div class="BtoolsBg"></div>
    </div>
  `);
  $('#BtoolsSearchClose').click(function() {
    $('#BtoolsSearchComments').remove();
  });
  $('#BtoolsSearchText').keydown(e => {
    if(e.keyCode === 13 && $('#BtoolsSearchText').attr('readonly') !== '' && $('#BtoolsSearchText').val() !== '') {
      searchComments($('#BtoolsSearchText').val());
    }
  }).focus();
  $('#BtoolsSearchComments').css({
    'top': $(window).height() / 2 - $('#BtoolsSearchComments').outerHeight() / 2,
    'left': $(window).width() / 2 - $('#BtoolsSearchComments').outerWidth() / 2
  });

  if(CommontSet.loadTimer === null && CommontSet.comments.length !== CommontSet.count) {
    CommontSet.loadTimer = setInterval(function() {
      chrome.runtime.sendMessage({
        type: 'fetch',
        url: `https://api.bilibili.com/x/v2/reply?pn=${CommontSet.loadPage}&type=1&oid=${Btools.av}&sort=0`
      },
      json => {
        if(json.code === 0) {
          CommontSet.loadPage++;

          if(CommontSet.count === -1) {
            CommontSet.count = json.data.page.count;
          }
          json.data.replies.forEach((item, index) => {
            CommontSet.comments.push(item);
          });

          $('#BtoolsSearchText').css({'color': '#999'}).attr('readonly', '').val(`加载评论中...${Math.floor(CommontSet.comments.length / CommontSet.count * 100)}%`);

          if(json.data.replies.length < 20) {
            $('#BtoolsSearchText').css({'color': '#FFF'}).removeAttr('readonly').val('');
            CommontSet.loadPage = 1;
            clearInterval(CommontSet.loadTimer);
            CommontSet.loadTimer = null;
          }
        }
      });
    }, 500);
  }
}

function searchComments(text) {
  var reg = new RegExp(`(${text})`, 'ig');
  if(CommontSet.comments.length === 0) return false;
  $('#BtoolsSearchList').html('');
  CommontSet.comments.forEach((item, index) => {
    var isShow = false;
    if(reg.test(item.content.message) || reg.test(item.member.uname)) {
      var message = item.content.message.replace(reg, '<span class="BtoolsCommentKeyword">$1</span>');
      var userName = item.member.uname.replace(reg, '<span class="BtoolsCommentKeyword">$1</span>');
      isShow = true;
    }

    if(isShow) {
      var html = `
        <li>
          <p class="BtoolsUserInfo"><img class="BtoolsUserHead" src="${item.member.avatar}${!/noface\.gif/.test(item.member.avatar) ? '@50w_50h.webp':''}"><a href="http://space.bilibili.com/${item.member.mid}" class="BtoolsUserNickname ${item.member.vip.vipStatus === 1 ? 'BtoolsVipName' : ''}" target="_blank">${userName}</a><a href="javascript:void(0);" class="BtoolsFloor">#${item.floor}</a></p>
          <p class="BtoolsUserComment">${message}</p>
        </li>
      `;
      $('#BtoolsSearchList').append(html);
    }
  });
}
