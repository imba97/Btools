chrome = chrome || browser;

var CommontSet = {
  timer: null,
  loopNum: 0,
  loopMax: 20,
  config: {
    emoji: null
  }
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

  CommontSet.timer = setInterval(() => {
    if($('.list-item').length > 0) {

      $('body').append(`
        <div id="btools-history-emoji-box">
          <ul id="btools-history-emoji-scroll"></ul>
        </div>
      `);

      $('#btools-history-emoji-box').css({
        'top': $('.comment-emoji').offset().top - 5,
        'left': $('.comment-emoji').offset().left + 80,
      });

      $(window).resize(function(){
        $('#btools-history-emoji-box').css({
          'top': $('.comment-emoji').offset().top - 5,
          'left': $('.comment-emoji').offset().left + 80,
        });
      });

      chrome.storage.sync.get(CommontSet.config, function(items){
        CommontSet.config = items;

        createHTML();

        $('#btools-history-emoji-scroll').on('click', '.btools-history-emoji', function() {
          $('.textarea-container textarea').insertAtCaret($(this).attr('data-emoji-text'));
          reorder(`${$(this).attr('data-emoji-text')},${$(this).html()}`);
          $(this).one('mouseout', function() {
            createHTML();
          });
        });

        clearInterval(CommontSet.timer);
        CommontSet.timer = null;
      });
    }
  }, 500);

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
    $('#btools-history-emoji-scroll').html(html);
  }
}

function saveSet() {
  chrome.storage.sync.set(CommontSet.config, function() {
  });
}

function clearSet() {
  chrome.storage.sync.set({emoji: null}, function() {
  });
}
