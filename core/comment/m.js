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
  loadTimer: null,
  loadPage: 1,
  comments: [],
  count: -1
}

$(document).ready(function(){
  if(/^(t)\.bilibili\.com$/.test(window.location.host) || /^\/(p|d)?\/?$/.test(window.location.pathname)) return false;

  $('body').on('click', '.emoji-list', function(){

    var doc = $(this);

    var data = doc.attr('data-emoji-text') + ',' + doc.html();

    reorder('emoji', data);
    createHTML();

    if(getEmojiLength() > 5) {

      setHistoryEmojiBgHeight()

      doc.parents('.comment').find('.btools-history-emoji-box .btools-history-emoji-bg[isShow=true]').show();
    }

  });

  CommontInit();
  window.onpopstate = function() {
    CommontInit();
  }

  $('body').on('click', '.comment-list .reply', function() {
    createDom({
      isReply: true,
      top: 70,
      left: 100
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

      $(this).parents('.textarea-container').find('textarea').insertAtCaret($(this).attr('data-emoji-text'));

      reorder('emoji', $(this).attr('data-emoji-text') + ',' + $(this).html());
      $(this).one('mouseout' ,function(){
        createHTML();
      });
    });

    $('body').on('focus', '.bb-comment > .comment-send:eq(0) textarea', function(){
      reDisplayEmojiSaveList();
    });

    // 切换表情
    $('body').on('click', '.emoji-container .emoji-tab-wrap a', function(){
      if($('.emoji-box .emoji-title span').text() == '颜文字') {
        createAddTextHTML();
        if($('#btoolsAddEmojiText').length > 0) {
          $('#btoolsAddEmojiText').show();
        } else {
          $('.emoji-box .emoji-title').css({
            'position': 'relative'
          }).append('<input id="btoolsAddEmojiText" placeholder="输入颜文字/字符（回车添加）">');
          $('#btoolsAddEmojiText').keydown(function(e) {
            if(e.keyCode === 13) {
              var val = $(this).val();
              if(val === '' || val.length > 20) return;
              if(CommentSet.config.addText === null) {
                CommentSet.config.addText = val;
              } else {
                var addText = CommentSet.config.addText.split(CommentSet.sep);
                if(addText.indexOf(val) === -1) {
                  addText.push(val);
                  CommentSet.config.addText = addText.join(CommentSet.sep);
                } else {
                  return;
                }
              }
              var html = '<a class="emoji-list emoji-text emoji-default btools-add-text" data-emoji-text="' + val + '">' + val + '</a>';
              $('.emoji-box .emoji-wrap a:first').before(html);
              $(this).val('');
              saveSet();
            }
          });
        }
      } else {
        if($('#btoolsAddEmojiText').is(':hidden')) return;
        $('#btoolsAddEmojiText').hide();
      }

    });

    $('body').on('mousedown', '.btools-history-emoji', function(e) {
      if(e.button === 1) {
        var val = $(this).attr('data-emoji-text') + ',' + $(this).html();
        e.preventDefault();

        deleteItem('emoji', val);

        setHistoryEmojiBgHeight();
      }
    });

    $('body').on('mousedown', '.btools-add-text', function(e) {
      var val = $(this).attr('data-emoji-text');
      if(e.button === 0) {
        reorder('addText', val);
        $(this).one('mouseup', function() {
          setTimeout(function() {
            createAddTextHTML();
          }, 100);
        });
      } else if(e.button === 1) {
        e.preventDefault();
        deleteItem('addText', val);
      }
    });

    // 定位按钮被点击
    $('body').on('click', '#BtoolsSearchList .BtoolsCommentLocation', function() {
      if($('#BtoolsPageJump').length > 0 || $(this).text() == '正在跳转') return;
      var self = $(this);
      var text = self.text();
      self.text('正在跳转');
      var currentPage = $('.bb-comment .bottom-page .current').text();
      var page = self.attr('data-page');
      var location = parseInt(self.attr('data-location'));

      if(currentPage != page) {
        $('body').append('<script id="BtoolsPageJump">$(".page-jump input").val("' + page + '").trigger($.Event("keydown", {keyCode: 13}))</script>');
      }

      var findCommentTimer = setInterval(function() {
        var isTop = $('.comment-list .is-top').length;
        var targetDom = $('.comment-list .list-item:eq(' + (location + isTop) + ')');
        if(targetDom.length > 0) {
          var scrollTop = targetDom.offset().top - 100;

          targetDom.addClass('BtoolsFindComment');
          setTimeout(function() {
            targetDom.removeClass('BtoolsFindComment');
          }, 1500);

          self.text(text);
          $("html,body").animate({scrollTop:scrollTop});
          $('#BtoolsPageJump').remove();
          clearInterval(findCommentTimer);
        }
      }, 500);
    });

    $('body').on('click', '.btools-history-emoji-all-btn', function() {

        var data_click = $(this).attr('data-click');

        if(data_click == undefined || data_click == 'false') {
            $(this).text('关闭').attr('data-click', 'true').siblings('.btools-history-emoji-scroll').css({
                'height': 'auto'
            });

            var scrollHeight = $(this).siblings('.btools-history-emoji-scroll').height();

            setHistoryEmojiBgHeight();

            $(this).siblings('.btools-history-emoji-bg').show().attr('isShow', 'true');

        } else {
            $(this).text('全部').attr('data-click', 'false').siblings('.btools-history-emoji-scroll').css({
                'height': 31
            });

            $(this).siblings('.btools-history-emoji-bg').hide().attr('isShow', 'false');
        }

    })
});

function setHistoryEmojiBgHeight() {

    $('.btools-history-emoji-scroll').each(function() {
        if($(this).height() != 31) {
            $('.btools-history-emoji-bg').css({
                'height': $(this).height() + 20
            });
        }
    });
}

function reDisplayEmojiSaveList() {
  if($('.bb-comment > .comment-send:eq(0) .textarea-container .btools-history-emoji-box').length === 0) {
    CommontInit();
  }
}

function CommontInit() {
  CommentSet.timer = setInterval(function() {
    if($('.bb-comment > .comment-send:eq(0) textarea').length > 0) {
      CommentSet.topTextarea = $('.bb-comment > .comment-send:eq(0) textarea');

      createDom();

      if($('#commentBtoolsBtn').length === 0) {
        $('.bb-comment .comment-header:eq(0)').append('<li class="commentBtoolsLogo"><a id="commentBtoolsBtn" href="javascript:void(0);">' + Btools.logo() + '</a></li>');

        $('#commentBtoolsBtn').HKM([
          {
            key: 83,
            title: '搜索评论',
            action: function() {
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

function reorder(id, key) {
  if(CommentSet.config[id] !== null) {
    var newEmoji = CommentSet.config[id].split(CommentSet.sep);
    var newArr = new Array;
    if(key !== newEmoji[0]) {
      newEmoji.forEach(function(item, index) {
        if(key != item) {
          newArr.push(item);
        }
      });
      CommentSet.config[id] = key + CommentSet.sep + newArr.join(CommentSet.sep);
    }
  } else {
    CommentSet.config[id] = key;
  }
  saveSet();
}

function deleteItem(id, val) {
  var arr = CommentSet.config[id].split(CommentSet.sep);
  var index = 0;
  if(arr.length === 1) {
    CommentSet.config[id] = null;
  } else {
    index = arr.indexOf(val);
    arr.splice(index, 1);
    CommentSet.config[id] = arr.join(CommentSet.sep);
  }
  switch(id) {
    case 'emoji':
      $('.btools-history-emoji-box').each(function() {
          $(this).find('.btools-history-emoji:eq(' + index + ')').remove();
      });
    break;
    case 'addText':
      $('.btools-add-text:eq(' + index + ')').remove();
    break;
  }

  saveSet();

  if(getEmojiLength() > 5) {
      $('.btools-history-emoji-all-btn').show();
  } else {
      $('.btools-history-emoji-all-btn').hide();
      $('.btools-history-emoji-bg').hide();
  }

}

function createHTML() {
  if(CommentSet.config.emoji !== null) {
    var html = '';
    var emoji = CommentSet.config.emoji.split(CommentSet.sep);
    emoji.forEach(function(item, index) {
      var val = item.split(',');
      html += '<li class="btools-history-emoji" data-emoji-text="' + val[0] + '">' + val[1] + '</li>';
    });
    $('.btools-history-emoji-scroll').html(html);

    setHistoryEmojiBgHeight();

    if(emoji.length > 5) {
        $('.btools-history-emoji-all-btn').show();
    } else {
        $('.btools-history-emoji-all-btn').hide();
        $('.btools-history-emoji-bg').hide();
    }

  }
}

function createAddTextHTML() {
  if(CommentSet.config.addText !== null) {
    $('.btools-add-text').remove();
    var text = CommentSet.config.addText.split(CommentSet.sep);
    if(text.length !== $('.btools-add-text').length) {
      var html = '';
      text.forEach(function(item, index) {
        html += '<a class="emoji-list emoji-text emoji-default btools-add-text" data-emoji-text="' + item + '">' + item + '</a>';
      });
      $('.emoji-box .emoji-wrap a:first').before(html);
    }
  }
}

function createDom(f_info) {

    f_info = f_info || {
        isReply: false,
        top: 68,
        left: 100
    }

    $('.textarea-container').each(function() {
        if($(this).find('.btools-history-emoji-box').length == 0) {
            $(this).css({
                'position': 'relative'
            }).append('<div class="btools-history-emoji-box"><ul class="btools-history-emoji-scroll"></ul><a href="javascript:void(0);" class="btools-history-emoji-all-btn">全部</a><div class="btools-history-emoji-bg"></div></div>');

            $(this).find('.btools-history-emoji-box').css({
                'top': f_info.top,
                'left': f_info.left
            });
        }
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

function searchShow() {
  if($('#BtoolsSearchComments').length !== 0) return false;
  $('body').append('<div id="BtoolsSearchComments"><a id="BtoolsSearchClose" href="javascript:void(0);">×</a><input type="text" id="BtoolsSearchText" autocomplete="off" readonly><div class="BtoolsSearchListBox"><ul id="BtoolsSearchList"></ul></div><div class="BtoolsBg"></div></div>');
  $('#BtoolsSearchClose').click(function() {
    $('#BtoolsSearchComments').remove();
    if(CommentSet.loadTimer !== null) {
      clearInterval(CommentSet.loadTimer);
      CommentSet.loadTimer = null;
    }
    CommentSet.loadPage = 1;
    CommentSet.comments = [];
    // 如果跳转页数出问题 通过关闭搜索框重置
    if($('#BtoolsPageJump').length > 0) {
      $('#BtoolsPageJump').remove();
    }
  });
  $('#BtoolsSearchText').keydown(function(e) {
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

  // 不同排序类型
  var sort = 2;
  if($('.bb-comment .comment-header .clearfix li.on').text() === '按时间排序') {
    sort = 0;
  }

  if(oid === null) {
    $('#BtoolsSearchText').css({'color': '#F66'}).attr('readonly', '').val('加载失败，请关闭该窗口，重新尝试');
    return;
  }

  if(CommentSet.loadTimer === null && CommentSet.comments.length !== CommentSet.count) {
    CommentSet.loadTimer = setInterval(function() {
      chrome.runtime.sendMessage({
        type: 'fetch',
        url: 'https://api.bilibili.com/x/v2/reply?pn=' + CommentSet.loadPage + '&type=' + apiType + '&oid=' + oid + '&sort=' + sort
      },
      function(json) {
        if(json.code === 0) {
          CommentSet.loadPage++;

          if(CommentSet.count === -1) {
            CommentSet.count = json.data.page.count;
          }

          if(typeof json.data.replies == 'undefined') {
              $('#BtoolsSearchText').css({'color': '#F66'}).attr('readonly', '').val('获取评论失败');
              return;
          }

          $.each(json.data.replies, function(index, item) {
              // 定位用，page是页码，location是当页位置
              item.position = {
                page: Math.floor(CommentSet.comments.length / 20) + 1,
                location: index
              }
              CommentSet.comments.push(item);
          });

          $('#BtoolsSearchText').css({'color': '#999'}).attr('readonly', '').val('加载评论中...' + Math.floor(CommentSet.comments.length / CommentSet.count * 100) + '%');

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

function getEmojiLength() {
    return CommentSet.config.emoji !== null ? CommentSet.config.emoji.split(CommentSet.sep).length : 0;
}

function searchComments(text) {
  var reg = new RegExp('(' + text + ')', 'ig');
  if(CommentSet.comments.length === 0) return false;
  $('#BtoolsSearchList').html('');
  CommentSet.comments.forEach(function(item, index) {
    var isShow = false;
    if(reg.test(item.content.message) || reg.test(item.member.uname)) {
      var message = item.content.message.replace(reg, '<span class="BtoolsCommentKeyword">$1</span>');
      var userName = item.member.uname.replace(reg, '<span class="BtoolsCommentKeyword">$1</span>');
      isShow = true;
    }

    var vipName = item.member.vip.vipStatus === 1 ? 'BtoolsVipName' : '';
    var userFace = !/noface\.gif/.test(item.member.avatar) ? '@50w_50h.webp':'';

    if(isShow) {
      var html = '<li><p class="BtoolsUserInfo"><img class="BtoolsUserHead" src="' + item.member.avatar + userFace + '"><a href="http://space.bilibili.com/' + item.member.mid + '" class="BtoolsUserNickname ' + vipName + '" target="_blank">' + userName + '</a><a href="javascript:void(0);" data-page="' + item.position.page + '" data-location="' + item.position.location + '" class="BtoolsCommentLocation">跳转' + item.position.page + '页' + (item.position.location + 1) + '条</a></p><p class="BtoolsUserComment">' + message + '</p></li>';
      $('#BtoolsSearchList').append(html);
    }
  });
}
