chrome = chrome || browser;

var CommontSet = {
  timer: null,
  loopNum: 0,
  loopMax: 20,
  config: {
    emoji: null
  },
  textarea: null
}

// clearSet();

$(document).ready(function(){
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

  $('body').on('focus', '.bb-comment .comment-send:eq(0) .textarea-container textarea', function(){
    CommontSet.textarea = $(this);
    createDom();
  });

  $('body').on('focus', '.con .comment-send .textarea-container textarea', function(){
    $('.btools-history-emoji-box').remove();
    CommontSet.textarea = $(this);
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
      CommontSet.textarea.insertAtCaret($(this).attr('data-emoji-text'));
      reorder(`${$(this).attr('data-emoji-text')},${$(this).html()}`);
      $(this).one('mouseout' ,function(){
        createHTML();
      });
    });
});

function reorder(key) {
  if(CommontSet.config.emoji !== null) {
    var newEmoji = CommontSet.config.emoji.split('|');
    var newArr = new Array;
    if(key !== newEmoji[0]) {
      newEmoji.forEach((item, index) => {
        if(key != item) {
          if(newArr.length < 4) {
            newArr.push(item);
          }
        }
      });
      CommontSet.config.emoji = `${key}|${newArr.join('|')}`;
      return CommontSet.config.emoji;
      saveSet();
    }
  }
}

function createHTML() {
  if(CommontSet.config.emoji !== null) {
    var html = '';
    var emoji = CommontSet.config.emoji.split('|');
    emoji.forEach((item, index) => {
      var val = item.split(',');
      html += `<li class='btools-history-emoji' data-emoji-text='${val[0]}'>${val[1]}</li>`;
    });
    $('.btools-history-emoji-scroll').html(html);
  }
}

function createDom(f_info) {
  $('.btools-history-emoji-box').remove();

  f_info = f_info || {
    isReply: false,
    top: 63,
    left: 80
  }

  if(!f_info.isReply) {
    switch(window.location.host) {
      case 'h.bilibili.com':
        f_info.top = 123;
      break;
      case 'bilibili.com':
      case 'www.bilibili.com':
        if(window.location.pathname.indexOf('watchlater') === 1) {
          f_info.top = 63;
        }
      break;
    }
  }

  CommontSet.textarea.parent('.textarea-container').css({
    'position': 'relative'
  }).append(`
    <div class="btools-history-emoji-box">
      <ul class="btools-history-emoji-scroll"></ul>
    </div>
  `);

  $('.btools-history-emoji-box').css({
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
  chrome.storage.sync.set({emoji: null}, function() {
  });
}
