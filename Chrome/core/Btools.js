chrome = chrome || browser;

const BtoolsSet = {
  version: chrome.i18n.getMessage('version'),
  releaseVersion: Number(chrome.i18n.getMessage('releaseVersion'))
}

$(document).ready(() => {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
});
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-121985229-2']);

//监听加载状态改变
document.onreadystatechange = completeLoading;

//加载状态为complete时移除loading效果
function completeLoading() {
    if (document.readyState === 'complete') {
      const Btools = {
        info: '%c ____     __                   ___\n/\\  _`\\  /\\ \\__               /\\_ \\\n\\ \\ \\L\\ \\\\ \\ ,_\\   ___     ___\\//\\ \\     ____\n \\ \\  _ <\'\\ \\ \\/  / __`\\  / __`\\\\ \\ \\   /\',__\\\n  \\ \\ \\L\\ \\\\ \\ \\_/\\ \\L\\ \\/\\ \\L\\ \\\\_\\ \\_/\\__, `\\ \n   \\ \\____/ \\ \\__\\ \\____/\\ \\____//\\____\\/\\____/\n    \\/___/   \\/__/\\/___/  \\/___/ \\/____/\\/___/\n\n                  version ' + BtoolsSet.version + '  Powered By imba久期',
        infoColor: 'color:#00a1d6',
        Reg: {
          weibo: /(?:http|https)\:\/\/weibo\.com/i,
          weiboAutoLoadComment: /(?:http|https)\:\/\/([^\/\?]*)\/\d+\/[a-zA-Z0-9]+\?([a-zA-Z0-9=_&]*)?type=comment/i,
          mySpace: /https?\:\/\/space\.bilibili\.com\/2198461/i,
          BtoolsVerCheck: /http?\:\/\/btools\.cc\/check\-for\-updates/i
        }
      }
      console.log(Btools.info,Btools.infoColor);

      // 微博自动刷新评论工具
      setTimeout(function(){
        var url = window.location.href;

        if(Btools.Reg.weibo.test(url)) {
          $(window).scroll(() => {
            if(Btools.Reg.weiboAutoLoadComment.test(window.location.href) && $('.more_txt').length > 0) {
              var scrollH = document.documentElement.scrollHeight || document.body.scrollHeight;
              var clientH = document.documentElement.clientHeight || document.body.clientHeight;
              var imba97_hei = (scrollH - clientH) - 50;
              var scrolltop = document.documentElement.scrollTop || document.body.scrollTop;
              var count = clientH + scrolltop;
              if(scrolltop >= imba97_hei) {
                $('.more_txt').click();
              }
              if(scrollH === count) {
                $(window).scrollTop(scrolltop - 1);
              }
            }
          });
        }

        if($('#app div:last').length > 0 && Btools.Reg.mySpace.test(url)) {
          $('#app div:last').addClass('Btools');
        }

        if(Btools.Reg.BtoolsVerCheck.test(url)) {
          verCheck();
        }

      }, 2000);

      // 版本检查
      const verCheckSet = {
        timer: null,
        time: 0
      };

      function verCheck()
      {
        verCheckSet.timer = setInterval(() => {
          if($('#version').length > 0 && $('#msg').length > 0) {
            var v = $('#version').val();
            var rv = Number($('#version').attr('releaseVersion'));
            var url = $('#version').attr('data-url');
            $('#version').attr('data-complete', 'true');
            if(BtoolsSet.releaseVersion < rv) {
              $('#msg').html(`你的版本：${BtoolsSet.version}，最新版本：<strong><a href="${url}">${v}</a></strong>`);
            } else {
              $('#msg').html(`你的版本：<strong><a href="${url}">${v}</a></strong>，是最新版本。`);
            }

            clearInterval(verCheckSet.timer);
          }
          if(verCheckSet.time >= 10) {
            clearInterval(verCheckSet.timer);
          }
          verCheckSet.time++;
        },500);
      }

    }
}

$.fn.extend({
  // hotKeyMenu --- START
  'HKM': function(menu) {
    return {
      set: () => {
        if($(this).attr('data-mousedown') === 'true') return false;
        $(this).attr('data-mousedown', 'true');

        $(this).addClass('Btools-user-select-none').attr({
          'ondragstart': 'return false;'
        });
        $(this)[0].BtoolsHKM = menu;
        $(this)[0].BtoolsHKMKeys = [];
        $(this).bind('mousedown', (ev) => {
          ev = ev || window.event;
          if(ev.button !== 0) return true;

          var hotKeyMenu = $(this)[0].BtoolsHKM;
          var hotKeys = $(this)[0].BtoolsHKMKeys;

          var x = 0;
          var y = 0;

          if(ev.pageX || ev.pageY){
            x = ev.pageX;
            y = ev.pageY;
          } else {
            x = ev.clientX + document.body.scrollLeft - document.body.clientLeft;
            y = ev.clientY + document.body.scrollTop - document.body.clientTop;
          }

          var html = '<div id="hotKeyMenu"><p class="menuTitle">快捷键菜单</p>';

          hotKeyMenu.forEach((item, index) => {
            html += `<p style="top: ${(index+1) * 35 + 5}px" data-is-key="true" data-index="${index}" data-key="${item.key}"><span class="key">${String.fromCharCode(item.key)}</span><span class="title">${item.title}</span></p>`;
            if($.inArray(item.key, hotKeys) === -1) {
              hotKeys.push(item.key);
            }
          });

          $(this)[0].BtoolsHKMKeys = hotKeys;

          html += '<div class="bg"></div></div>';
          $('body').append(html).find('#hotKeyMenu').css({
            'width': 200,
            'height': hotKeyMenu.length * 40 + 60
          });
          $('#hotKeyMenu').css({
            'top': y - 65,
            'left': x - ($('#hotKeyMenu').outerWidth() / 2)
          });

          var mo = null;
          var isContinued = false;

          $('#hotKeyMenu p[data-is-key=true]').mouseover(function(){
            mo = Number($(this).attr('data-index'));
            $(this).find('.key').css({
              'color': '#FFF',
              'background-color': '#F66'
            });
          });
          $('#hotKeyMenu p[data-is-key=true]').mouseout(function(){
            mo = null;
            $(this).find('.key').css({
              'color': '#666',
              'background-color': '#FFF'
            });
          });

          $(document).one('mouseup', () => {
            $(document).unbind('keydown');
            $('#hotKeyMenu').remove();
            if(mo !== null && (!hotKeyMenu[mo].continued || !isContinued)) {
              hotKeyMenu[mo].action();
            }
          });
          $(document).bind('keydown', (ev) => {
            ev = ev || window.event;
            ev.preventDefault();
            var key = hotKeyMenu[Number($(`#hotKeyMenu p[data-key=${ev.keyCode}]`).attr('data-index'))];
            if(key !== undefined) {
              key.action();
              if(!key.continued) {
                $(document).unbind('mouseup keydown');
                $('#hotKeyMenu').remove();
              } else {
                isContinued = true;
              }
            }
          });

          // mousedown
        });
      },
      add: (where) => {
        var hotKeys = $(this)[0].BtoolsHKMKeys;
        menu.forEach((item, index) => {
          if($.inArray(item.key, hotKeys) >= 0) return false;
          $(this)[0].BtoolsHKMKeys.push(item.key);
          switch(where) {
            case 'first':
              $(this)[0].BtoolsHKM.unshift(item);
            break;
            case 'last':
            default:
              $(this)[0].BtoolsHKM.push(item);
            break;
          }
        });
      }
    }

  }
  // hotKeyMenu --- END
});
