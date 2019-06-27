chrome = chrome || browser;

var CommentSet = {
  timer: null,
  loopNum: 0,
  loopMax: 20,
  sep: '|!|',
  config: {
    emoji: null,
    addText: null
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

    reorder(data);
    createHTML();
  });

  CommontInit();
  window.onpopstate = function() {
    CommontInit();
  }

  $('body').on('click', '.comment-list .reply', function() {
    CommentSet.textarea = $(this).parents('.con').find('.textarea-container textarea');
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
        CommentSet.topTextarea.insertAtCaret($(this).attr('data-emoji-text'));
      } else {
        CommentSet.textarea.insertAtCaret($(this).attr('data-emoji-text'));
      }
      reorder(`${$(this).attr('data-emoji-text')},${$(this).html()}`);
      $(this).one('mouseout' ,function(){
        createHTML();
      });
    });

    $('body').on('focus', '.bb-comment > .comment-send:eq(0) textarea', function(){
      reDisplayEmojiSaveList();
    });

    $('body').on('click', '.emoji-container .emoji-tab-wrap a', function(){
      if($(this).attr('data-index') == 1) {
        if($('#btoolsAddEmojiText').length > 0) {
          $('#btoolsAddEmojiText').show();
        } else {
          $('.emoji-box .emoji-title').css({
            'position': 'relative'
          }).append('<input id="btoolsAddEmojiText" placeholder="输入颜文字/字符（回车添加）">');
          $('#btoolsAddEmojiText').keydown(function(e) {
            if(e.keyCode === 13) {
              var val = $(this).val();
              var html = `<a class="emoji-list emoji-text emoji-default" data-emoji-text="${val}" data-index="1">${val}</a>`;
              $(this).val('');
            }
          });
        }
      } else {
        if($('#btoolsAddEmojiText').is(':hidden')) return;
        $('#btoolsAddEmojiText').hide();
      }

    });
});

function reDisplayEmojiSaveList() {
  if($('.bb-comment > .comment-send:eq(0) .textarea-container .btools-history-emoji-box').length === 0) {
    CommentSet.textarea = null;
    CommontInit();
  }
}

function CommontInit() {
  CommentSet.timer = setInterval(function() {
    if($('.bb-comment > .comment-send:eq(0) textarea').length > 0) {
      CommentSet.topTextarea = $('.bb-comment > .comment-send:eq(0) textarea');

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

      clearInterval(CommentSet.timer);
      CommentSet.timer = null;
    }
  }, 500);
}

function reorder(key) {
  if(CommentSet.config.emoji !== null) {
    var newEmoji = CommentSet.config.emoji.split(CommentSet.sep);
    var newArr = new Array;
    if(key !== newEmoji[0]) {
      newEmoji.forEach((item, index) => {
        if(key != item) {
          if(newArr.length < 4) {
            newArr.push(item);
          }
        }
      });
      CommentSet.config.emoji = key + CommentSet.sep + newArr.join(CommentSet.sep);
    }
  } else {
    CommentSet.config.emoji = key;
  }
  saveSet();
}

function createHTML() {
  if(CommentSet.config.emoji !== null) {
    var html = '';
    var emoji = CommentSet.config.emoji.split(CommentSet.sep);
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

  CommentSet.textarea = CommentSet.textarea !== null ? CommentSet.textarea : CommentSet.topTextarea;

  CommentSet.textarea.parent('.textarea-container').css({
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

  chrome.storage.sync.get(CommentSet.config, function(items){
    CommentSet.config = items;
    createHTML();
  });
}

function saveSet() {
  chrome.storage.sync.set(CommentSet.config, function() {
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
    CommentSet.comments = [];
    $('#BtoolsSearchComments').remove();
    if(CommentSet.loadTimer !== null) {
      clearInterval(CommentSet.loadTimer);
      CommentSet.loadTimer = null;
    }
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

  var apiType = '1';
  var oid = Btools.bilibili.av();

  if(/h\.bilibili\.com/.test(window.location.href)) {
    oid = Btools.bilibili.albumID();
    apiType = '11';
  } else {
    switch(Btools.bilibili.getApiType()) {
      case 'bangumi':
        oid = Btools.bilibili.bangumiID();
      break;
      case 'read':
        oid = Btools.bilibili.readID();
        apiType = '12';
      break;
      case 'blackboard':
        oid = Btools.bilibili.activeID();
        apiType = '4';
      break;
    }
  }

  if(oid === null) {
    $('#BtoolsSearchText').css({'color': '#F66'}).attr('readonly', '').val('加载失败，请关闭该窗口，重新尝试');
    return;
  }

  // 未完待续
  console.log(`https://api.bilibili.com/x/v2/reply?pn=${CommentSet.loadPage}&type=${apiType}&oid=${oid}&sort=0`);

  if(CommentSet.loadTimer === null && CommentSet.comments.length !== CommentSet.count) {
    CommentSet.loadTimer = setInterval(function() {
      chrome.runtime.sendMessage({
        type: 'fetch',
        url: `https://api.bilibili.com/x/v2/reply?pn=${CommentSet.loadPage}&type=${apiType}&oid=${oid}&sort=0`
      },
      json => {
        if(json.code === 0) {
          CommentSet.loadPage++;

          if(CommentSet.count === -1) {
            CommentSet.count = json.data.page.count;
          }
          json.data.replies.forEach((item, index) => {
            CommentSet.comments.push(item);
          });

          $('#BtoolsSearchText').css({'color': '#999'}).attr('readonly', '').val(`加载评论中...${Math.floor(CommentSet.comments.length / CommentSet.count * 100)}%`);

          if(json.data.replies.length < 20) {
            $('#BtoolsSearchText').css({'color': '#FFF'}).removeAttr('readonly').val('');
            CommentSet.loadPage = 1;
            clearInterval(CommentSet.loadTimer);
            CommentSet.loadTimer = null;
          }
        }
      });
    }, 500);
  }
}

function searchComments(text) {
  var reg = new RegExp(`(${text})`, 'ig');
  if(CommentSet.comments.length === 0) return false;
  $('#BtoolsSearchList').html('');
  CommentSet.comments.forEach((item, index) => {
    var isShow = false;
    if(reg.test(item.content.message) || reg.test(item.member.uname)) {
      var message = item.content.message.replace(reg, '<span class="BtoolsCommentKeyword">$1</span>');
      var userName = item.member.uname.replace(reg, '<span class="BtoolsCommentKeyword">$1</span>');
      isShow = true;
    }

    if(isShow) {
      var html = `
        <li>
          <p class="BtoolsUserInfo"><img class="BtoolsUserHead" src="${item.member.avatar}${!/noface\.gif/.test(item.member.avatar) ? '@50w_50h.webp':''}"><a href="http://space.bilibili.com/${item.member.mid}" class="BtoolsUserNickname ${item.member.vip.vipStatus === 1 ? 'BtoolsVipName' : ''}" target="_blank">${userName}</a></p>
          <p class="BtoolsUserComment">${message}</p>
        </li>
      `;
      $('#BtoolsSearchList').append(html);
    }
  });
}
