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
      var version = '1.0.1';
      const Btools = {
        'info': '%c ____     __                   ___\n/\\  _`\\  /\\ \\__               /\\_ \\\n\\ \\ \\L\\ \\\\ \\ ,_\\   ___     ___\\//\\ \\     ____\n \\ \\  _ <\'\\ \\ \\/  / __`\\  / __`\\\\ \\ \\   /\',__\\\n  \\ \\ \\L\\ \\\\ \\ \\_/\\ \\L\\ \\/\\ \\L\\ \\\\_\\ \\_/\\__, `\\ \n   \\ \\____/ \\ \\__\\ \\____/\\ \\____//\\____\\/\\____/\n    \\/___/   \\/__/\\/___/  \\/___/ \\/____/\\/___/\n\n                  version ' + version + '  Powered By imba久期',
        'infoColor': 'color:#00a1d6',
        'Reg': {
          'weiboAutoLoadComment' : /(?:http|https)\:\/\/([^\/\?]*)\/\d+\/[a-zA-Z0-9]+\?([a-zA-Z0-9=_&]*)?type=comment/i,
          'mySpace' : /https?\:\/\/space\.bilibili\.com\/2198461/i
        }
      }
      console.log(Btools.info,Btools.infoColor);

      // 微博自动刷新评论工具
      setTimeout(function(){
        var url = window.location.href;
        if(Btools.Reg.weiboAutoLoadComment.test(url)) {
          // console.log('开启自动加载评论');
          $(window).scroll(() => {
            if($('.more_txt').length > 0) {
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
      }, 2000);

      // 其他

    }
}

$.fn.extend({
  // hotKeyMenu --- START
  'HKM': function(menu) {
    if($(this).attr('data-mousedown') === 'true') return false;
    $(this).attr('data-mousedown', 'true')
    $(this).addClass('Btools-user-select-none').attr({
      'ondragstart': 'return false;'
    });
    $(this)[0].BtoolsHKM = [];
    $(this)[0].BtoolsHKM = $(this)[0].BtoolsHKM.concat(menu);
    $(this).bind('mousedown', (ev) => {
      ev = ev || window.event;
      if(ev.button !== 0) return true;

      var hotKeyMenu = $(this)[0].BtoolsHKM;

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
      });

      console.log(hotKeyMenu.length);

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
        if(mo !== null) {
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
          }
        }
      });

      // mousedown
    });
  }
  // hotKeyMenu --- END
});
