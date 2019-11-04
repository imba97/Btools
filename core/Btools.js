chrome = chrome || browser;

var Btools = {
  info: 'Btools',
  infoColor: 'color:#00a1d6',
  Reg: {
    weibo: /https?\:\/\/weibo\.com/i,
    weiboAutoLoadComment: /(?:http|https)\:\/\/([^\/\?]*)\/\d+\/[a-zA-Z0-9]+\?([a-zA-Z0-9=_&]*)?type=comment/i,
    mySpace: /https?\:\/\/space\.bilibili\.com\/2198461/i,
    BtoolsVerCheck: /https?\:\/\/btools\.cc\/check\-for\-updates/i
  },
  bilibili: {
    getApiType: function() { return /^\/([^\/]*)\//.exec(window.location.pathname) !== null ? /^\/([^\/]*)\//.exec(window.location.pathname)[1] : null },
    av:         function() { return /video\/av(\d+)/.exec(window.location.pathname) !== null ? /video\/av(\d+)/.exec(window.location.pathname)[1] : null },
    bangumiID:  function() { return /AV(\d+)/.exec($('.pub-wrapper .av-link').text()) !== null ? /AV(\d+)/.exec($('.pub-wrapper .av-link').text())[1] : null },
    readID:     function() { return /read\/cv(\d+)/.exec(window.location.pathname) !== null ? /read\/cv(\d+)/.exec(window.location.pathname)[1] : null },
    activeID:   function() { return /\/activity(\d+)\//.exec($('script[crossorigin=anonymous]:last').attr('src')) !== null ? /\/activity(\d+)\//.exec($('script[crossorigin=anonymous]:last').attr('src'))[1] : null },
    albumID:    function() { return /h\.bilibili\.com\/(\d+)/.exec(window.location.href) !== null ? /h\.bilibili\.com\/(\d+)/.exec(window.location.href)[1] : null }
  },
  logo: function(color) {
    var c = color || '#029bcd';
    return '<svg id="BtoolsLOGO" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 579.25 616.13"><defs><style>.cls-1{fill:none;}.cls-2{clip-path:url(#clip-path);}.cls-3{fill:' + c + ';}.cls-4{clip-path:url(#clip-path-2);}</style><clipPath id="clip-path" transform="translate(-16 -88.67)"><rect class="cls-1" x="16" y="88" width="579.84" height="617.76"/></clipPath><clipPath id="clip-path-2" transform="translate(-16 -88.67)"><rect class="cls-1" x="156.89" y="330.23" width="298.11" height="236.52"/></clipPath></defs><title>Btools</title><g class="cls-2"><path class="cls-3" d="M231.62,234.68q-21-11.38-42-22.87l-69.77-37.95c-9.44-5.15-13.33-13-8-22.76s14.31-10.52,23.55-5.45C189.88,175.32,244.47,204.9,298.86,235c13.92,7.69,39,3.11,47.87-9.92Q388.48,164.46,430,103.8c1-1.45,1.94-2.91,2.91-4.28,7.89-11,16.94-13.91,25.11-7.49,9.44,7.49,7.88,16.35,1.75,25.3-11.28,16.45-22.57,33-33.76,49.43-15.57,22.87-31.14,45.73-48.56,71.13H573.55c18.29,0,21.11,2.92,21.21,21.21q.3,188.14.49,376.18c0,17.9-3.21,21-21.5,21.11-4.77,0-9.64.49-14.31-.09-17.32-1.95-30-.3-36,21.11-5.45,19.27-26,29.09-44.47,27.15-21.41-2.24-35.51-14.89-41-34.84-3.31-12.06-9-13.72-19.85-13.62-75.22.49-150.34.29-225.56.1-8.66,0-13.71.77-16.25,11.29-5.44,22.57-24,36.87-44.56,37.26-21.31.39-39.79-13.52-46-37-2.63-9.83-7-12.07-16.06-11.58-11.67.68-23.45.29-35.22.1C21.64,656,16,650.75,16,638.2q.15-191.21.58-382.6c0-13.23,5.35-17.61,20.05-17.61q90.63-.15,181.18,0h12.65c.39-1.07.77-2.14,1.16-3.31Zm334,392.23V266.5H46.94V626.91ZM148.92,657.27H113.21c2.43,10.22,7.39,17.42,16.93,18,10.6.78,15.66-7.1,18.78-18Zm315.55-.1c3.6,10.9,8.47,18.88,19.17,18.1,9.63-.68,14.11-8.17,17-18.1Zm0,0" transform="translate(-16 -88.67)"/></g><path class="cls-3" d="M306.74,602.1H98.22c-20.24,0-23.45-3.21-23.45-23.45q.15-130.78.39-261.65c0-18.39,3.8-22.19,22.09-22.19H515.66c18.58,0,22.37,3.7,22.47,21.9q.43,131.51.59,262.91c0,18.78-3.9,22.38-23.26,22.48Zm200.54-30.85V326H105.81v245.3Zm0,0" transform="translate(-16 -88.67)"/><path class="cls-3" d="M226.57,378.4" transform="translate(-16 -88.67)"/><g class="cls-4"><path class="cls-3" d="M329.69,463.19h-9.14a9.94,9.94,0,0,1-8.92-6.57l-4.75-11.51a9.91,9.91,0,0,1,1.62-10.93L315,427.7a6,6,0,0,0,0-8.47l-11-11a6,6,0,0,0-8.46,0L289,414.72a9.87,9.87,0,0,1-10.93,1.62l-11.51-4.74a10,10,0,0,1-6.57-8.92v-9.15a6,6,0,0,0-6-6H238.48a6,6,0,0,0-6,6v9.15a9.94,9.94,0,0,1-6.56,8.92l-11.52,4.74a9.82,9.82,0,0,1-10.91-1.62L197,408.24a6,6,0,0,0-8.46,0l-11,11a6,6,0,0,0,0,8.46l6.48,6.49a9.84,9.84,0,0,1,1.62,10.93l-4.74,11.52A9.94,9.94,0,0,1,172,463.2h-9.15a6,6,0,0,0-6,6v15.54a6,6,0,0,0,6,6H172a10,10,0,0,1,8.91,6.57l4.75,11.52A9.88,9.88,0,0,1,184,519.74l-6.49,6.48a6,6,0,0,0,0,8.48l11,11a6,6,0,0,0,8.46,0l6.5-6.48a9.77,9.77,0,0,1,10.89-1.6l11.55,4.74a9.94,9.94,0,0,1,6.56,8.92v9.12a6,6,0,0,0,6,6H254a6,6,0,0,0,6-6v-9.12a10,10,0,0,1,6.56-8.92l11.53-4.74a9.85,9.85,0,0,1,10.94,1.6l6.46,6.47a6,6,0,0,0,8.47,0l11-11a6,6,0,0,0,0-8.47l-6.49-6.48a9.9,9.9,0,0,1-1.62-10.93l4.75-11.52a10,10,0,0,1,8.92-6.56h9.14a6,6,0,0,0,6-6V469.19a6,6,0,0,0-6-6Zm-83.41,48.14A34.39,34.39,0,1,1,280.67,477a34.37,34.37,0,0,1-34.39,34.38ZM453.34,386.7a4.32,4.32,0,0,0-3.06-1.27h-6.63a7.21,7.21,0,0,1-6.46-4.76l-3.44-8.35a7.16,7.16,0,0,1,1.17-7.91l4.7-4.7a4.28,4.28,0,0,0,1.28-3.06,4.35,4.35,0,0,0-1.28-3.08l-8-8a4.33,4.33,0,0,0-6.13,0l-4.71,4.7a7.13,7.13,0,0,1-7.92,1.17l-8.33-3.43a7.22,7.22,0,0,1-4.76-6.47V335a4.34,4.34,0,0,0-4.34-4.34H384.2a4.34,4.34,0,0,0-4.34,4.34v6.63a7.2,7.2,0,0,1-4.75,6.47l-8.35,3.43a7.12,7.12,0,0,1-7.91-1.17l-4.72-4.7a4.36,4.36,0,0,0-6.13,0l-8,8a4.4,4.4,0,0,0-1.27,3.07A4.31,4.31,0,0,0,340,359.7l4.7,4.71a7.12,7.12,0,0,1,1.17,7.91l-3.44,8.35a7.19,7.19,0,0,1-6.46,4.76h-6.63a4.28,4.28,0,0,0-3.06,1.27,4.33,4.33,0,0,0-1.28,3.07V401a4.35,4.35,0,0,0,4.34,4.34H336a7.22,7.22,0,0,1,6.46,4.76l3.44,8.34a7.18,7.18,0,0,1-1.17,7.93L340,431.09a4.35,4.35,0,0,0,0,6.14l8,8a4.36,4.36,0,0,0,6.13,0l4.71-4.7a7.07,7.07,0,0,1,7.89-1.16l8.36,3.44a7.19,7.19,0,0,1,4.76,6.46v6.61a4.34,4.34,0,0,0,4.34,4.33h11.26a4.34,4.34,0,0,0,4.34-4.33v-6.61a7.21,7.21,0,0,1,4.76-6.46l8.35-3.44a7.12,7.12,0,0,1,7.92,1.16l4.68,4.69a4.33,4.33,0,0,0,6.14,0l8-8a4.32,4.32,0,0,0,0-6.14l-4.7-4.69a7.17,7.17,0,0,1-1.17-7.92l3.44-8.35a7.22,7.22,0,0,1,6.46-4.75h6.63a4.35,4.35,0,0,0,4.33-4.34V389.77a4.32,4.32,0,0,0-1.27-3.07Zm-63.49,33.6a24.91,24.91,0,1,1,24.91-24.91,24.9,24.9,0,0,1-24.91,24.91Zm0,0" transform="translate(-16 -88.67)"/></g></svg>';
  }
}

chrome.runtime.sendMessage({ type: 'getInfo' }, function(info) {
  Btools.version = info.version;
  Btools.releaseVersion = info.releaseVersion;
  Btools.info = '%c ____     __                   ___\n/\\  _`\\  /\\ \\__               /\\_ \\\n\\ \\ \\L\\ \\\\ \\ ,_\\   ___     ___\\//\\ \\     ____\n \\ \\  _ <\'\\ \\ \\/  / __`\\  / __`\\\\ \\ \\   /\',__\\\n  \\ \\ \\L\\ \\\\ \\ \\_/\\ \\L\\ \\/\\ \\L\\ \\\\_\\ \\_/\\__, `\\ \n   \\ \\____/ \\ \\__\\ \\____/\\ \\____//\\____\\/\\____/\n    \\/___/   \\/__/\\/___/  \\/___/ \\/____/\\/___/\n\n                                     version ' + info.version;
});

// 监听加载状态改变
document.onreadystatechange = function() {
    if (document.readyState === 'complete') {
      console.log(Btools.info,Btools.infoColor);

      // 微博自动刷新评论工具
      setTimeout(function(){
        var url = window.location.href;

        if(Btools.Reg.weibo.test(url)) {
          $(window).scroll(function() {
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
          $('#app div:last').addClass('Btools').html(Btools.logo);
        }
      }, 2000);
    }
}

if(Btools.Reg.BtoolsVerCheck.test(window.location.href)) {
  // 版本检查
  var verCheckSet = {
    timer: null,
    time: 0
  };
  verCheck();
}

$.fn.extend({
  // hotKeyMenu --- START
  'HKM': function(menu) {
    var hkm = $(this);

    if(menu === 'clear') {
      hkm[0].BtoolsHKM = undefined;
      hkm[0].BtoolsHKMKeys = undefined;
      return false;
    }

    if(hkm[0].BtoolsHKM !== undefined) {
      console.log(hkm[0].BtoolsHKM);
      var hotKeys = hkm[0].BtoolsHKMKeys;
      menu.forEach(function(item, index) {
        if($.inArray(item.key, hotKeys) >= 0) return false;
        hkm[0].BtoolsHKMKeys.push(item.key);
        switch(item.position) {
          case 'first':
            hkm[0].BtoolsHKM.unshift(item);
          break;
          case 'last':
          default:
            hkm[0].BtoolsHKM.push(item);
          break;
        }
      });
    } else {
      hkm[0].BtoolsHKM = menu;
      var hotKeys = [];
      menu.forEach(function(item, index) {
        if($.inArray(item.key, hotKeys) === -1) {
          hotKeys.push(item.key);
        }
        if(item.parent) {
          var attrClass = hkm.parent(item.parent).attr('class') || '';
          if(attrClass.indexOf('Btools-user-select-none') === -1) {
            hkm.parent(item.parent).addClass('Btools-user-select-none').attr({
              'ondragstart': 'return false;'
            });
          }
        } else {
          var attrClass = hkm.attr('class') || '';
          if(attrClass.indexOf('Btools-user-select-none') === -1) {
            hkm.addClass('Btools-user-select-none').attr({
              'ondragstart': 'return false;'
            });
          }
        }
      });
      hkm[0].BtoolsHKMKeys = hotKeys;
    }

    if(hkm.attr('data-mousedown') === 'true') return false;
    hkm.attr('data-mousedown', 'true');

    hkm.bind('mousedown', function(ev) {
      ev = ev || window.event;
      if(ev.button !== 0) return true;

      if(hkm[0].BtoolsHKM === undefined) return false;

      var hotKeyMenu = hkm[0].BtoolsHKM;
      var hotKeys = hkm[0].BtoolsHKMKeys;

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

      hotKeyMenu.forEach(function(item, index) {
        var top = (index+1) * 35 + 5;
        html += '<p style="top: '+ top +'px; cursor:default;" data-is-key="true" data-index="' + index + '" data-key="' + item.key + '"><span class="key">' + String.fromCharCode(item.key) + '</span><span class="title">' + item.title + '</span></p>';
      });

      hkm[0].BtoolsHKMKeys = hotKeys;

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

      $(document).one('mouseup', function() {
        $(document).unbind('keydown');
        $('#hotKeyMenu').remove();
        if(mo !== null && (!hotKeyMenu[mo].continued || !isContinued)) {
          hotKeyMenu[mo].action();
        }
      });
      $(document).bind('keydown', function(ev) {
        ev = ev || window.event;
        ev.preventDefault();
        var key = hotKeyMenu[Number($('#hotKeyMenu p[data-key=' + ev.keyCode + ']').attr('data-index'))];
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
  }
  // hotKeyMenu --- END
});

function verCheck() {
  verCheckSet.timer = setInterval(function() {
    if($('#version').length > 0 && $('#msg').length > 0) {
      var v = $('#version').val();
      var rv = Number($('#version').attr('releaseVersion'));
      var url = $('#version').attr('data-url');
      $('#version').attr('data-complete', 'true');
      if(Btools.releaseVersion < rv) {
        $('#msg').html('你的版本：' + Btools.version + '，最新版本：<strong><a href="' + url + '">' + v + '</a></strong>');
      } else {
        $('#msg').html('你的版本：<strong><a href="' + url + '">' + v + '</a></strong>，是最新版本。');
      }

      clearInterval(verCheckSet.timer);
    }
    if(verCheckSet.time >= 10) {
      clearInterval(verCheckSet.timer);
    }
    verCheckSet.time++;
  },500);
}
