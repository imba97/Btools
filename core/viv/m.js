/*

  增强B站收藏夹

*/

chrome = chrome || browser;

var VivSet = {
  init: true,
  loopNum: 0,
  loopMax: 10,
  timer: null,
  timerOff: false,
  eqNum: 0,
  fav: null,
  expiredTimer: null,
  expired: null, // 存储失效视频
  expiredIndex: 0, // 当前正在获取信息的失效视频
  count: 0,
  pn: 1,
  isKey: false,
  order: 'mtime',
  tid: 0
}

var BtoolsConfig = {
  vivFind: 0,
  localCache: {}
}

$(document).ready(function(){

  $('body').on('click', '.be-pager li.be-pager-item', function(){
    VivInitLoopStart();
  });
  // 头部 收藏夹 按钮
  $('body').on('click', '.n-tab-links a.n-favlist', function(){
    VivInitLoopStart();
  });
  $('body').on('click', '.fav-item a.text', function(){
    VivInitLoopStart();
  });
  // 批量操作 等 按钮
  $('body').on('click', 'div.fav-filters,div.video-check-container,div.fav-action-fixtop', function(){
    VivInitLoopStart();
  });

  // 移动、复制按钮、分区按钮
  $('body').on('click', '.be-dropdown .be-dropdown-menu li', function() {
    VivInitLoopStart();
  });

  $('body').on('click', '.fav-filters .be-dropdown-menu:eq(1) .be-dropdown-item', function(){
    VivInitLoopStart();
  });

  // 上一页 下一页
  $('body').on('click', 'li.be-pager-prev,.be-pager-next', function(){
    VivInitLoopStart();
  });
  // 收藏夹链接
  $(document).on('click', '#page-index .fav .fav-item a', function() {
    VivInitLoopStart();
  });
  $('body').on('click', 'input.be-switch-input', function() {
    VivInitLoopStart();
  });
  $('body').on('click', '.btn-container .default', function() {
    VivInitLoopStart();
  });

  $('body').on('click', '.modal-header-close,.icon-close', function() {
    VivInitLoopStart();
  });

  // 拖拽排序
  $('body').on('mouseup mousedown', '.fav-list .icon-cursor', function() {
    VivInitLoopStart();
  });

  window.onpopstate = function(event) {
    VivSet.order = 'mtime';
    VivSet.fav = null;
    VivInitLoopStart();
  };

  $('body').on('keydown', '.search .search-input input', function(e) {

  });

  // 键盘回车翻页
  $('body').on('keydown', '.be-pager .be-pager-options-elevator input', function(e) {
    if(e.which === 13) {
      if(VivSet.pn == $(this).val()) return false;
      VivSet.fav = null;

      var max_pn = Math.ceil(VivSet.count / 20);
      VivSet.pn = Number($(this).val());
      if(VivSet.pn <= max_pn) {
        VivSet.pn = $(this).val();
      } else {
        VivSet.pn = max_pn;
      }

      VivSet.isKey = true;
      $('.be-pager .be-pager-options-elevator input').attr('data-viv-enter', false);

      VivInitLoopStart();
    }
  });
});

function VivInitLoopStart() {
  VivSet.eqNum = 0;
  VivSet.loopNum = 0;
  VivSet.fav = null;
  VivSet.expiredIndex = 0;
  $('.BtoolsVivFinded').removeClass('BtoolsVivFinded');
  if(VivSet.timerOff) {
    VivInitLoop();
  }
}

VivInitLoop();

function VivInitLoop()
{
  VivSet.timerOff = false;
  VivSet.timer = setInterval(function() {
    VivInit();
    VivSet.loopNum++;
  }, 500);
}

function VivInit() {
  favJson();
  $('.fav-video-list li.small-item').each(function(index) {
    var coverReg = /([^\@]*\.(?:webp|jpg|png|gif))(?:\@|\_).*\.(?:webp|jpg|png|gif)?/;
    var upNameText = $(this).find('.meta-mask .meta-info .author').text();
    var upName = upNameText.substring(4,upNameText.length);
    var title = $(this).find('.title').text();
    var liClass = $(this).attr('class');

    if(VivSet.fav !== null) {
      $(this).find('a:eq(1),.meta-mask,a.disabled').HKM('clear');
      var upMid = VivSet.fav[index].upper.mid;
      $(this).find('a:eq(1),.meta-mask,a.disabled').HKM([
        {
          'key': 85,
          'title': '打开UP主空间',
          'action': function() {
            window.open('http://space.bilibili.com/' + upMid);
            void(0);
          }
        },
        {
          'key': 68,
          'title': '详情信息',
          'position': 'last',
          'action': function() {
            media_info(index);
          },
          'parent': '.small-item'
        }
      ]);
    } else {
      $(this).find('a:eq(1),.meta-mask,a.disabled').HKM([
        {
          'key': 85,
          'title': '搜索UP主',
          'action': function() {
            window.open('https://search.bilibili.com/upuser?keyword=' + upName);
            void(0);
          },
          'parent': '.small-item'
        }
      ]);
    }

    if($(this).attr('class').indexOf('disabled') === -1) {
      var url = $(this).find('a.cover').attr('href');
      var self = this;
      $(this).find('a:eq(1),.meta-mask,a.disabled').HKM([
        {
          'key': 67,
          'title': '打开封面',
          'position': 'first',
          'action': function() {
            window.open(coverReg.exec($(self).find('img:eq(0)').attr('src'))[1]);
            void(0);
          }
        },
        {
          'key': 86,
          'title': '打开视频',
          'position': 'first',
          'action': function() {
            window.open(url);
            void(0);
          }
        }
      ]);
    } else {

    }

    // 失效视频 搜索视频
    if(liClass !== undefined && liClass.indexOf('disabled') !== -1 && title != '缓存失效' && title !='已失效视频') {
      $(this).find('a:eq(1),.meta-mask,a.disabled').HKM([
        {
          'key': 83,
          'title': '搜索标题',
          'position': 'first',
          'action': function() {
            window.open('https://www.baidu.com/s?wd=' + title);
            void(0);
          }
        }
      ]);
    }

  });

  if(VivSet.loopNum >= VivSet.loopMax) {
    VivSet.timerOff = true;
    VivSet.loopNum = 0;
    VivSet.eqNum = 0;
    clearInterval(VivSet.timer);
  }
}

function favJson() {
  var fid = $('.fav-item[class~=cur]').attr('fid');
  if(fid === null) return false;

  if(!VivSet.isKey) VivSet.pn = Number($('.be-pager-item-active').text()); else VivSet.isKey = false;

  switch($('.fav-info .fav-filters div:eq(1) span:eq(0)').text().trim()) {
    case '全部分区': VivSet.tid = 0; break;
    case '动画': VivSet.tid = 1; break;
    case '音乐': VivSet.tid = 3; break;
    case '游戏': VivSet.tid = 4; break;
    case '娱乐': VivSet.tid = 5; break;
    case '电视剧': VivSet.tid = 11; break;
    case '番剧': VivSet.tid = 13; break;
    case '电影': VivSet.tid = 23; break;
    case '科技': VivSet.tid = 36; break;
    case '鬼畜': VivSet.tid = 119; break;
    case '舞蹈': VivSet.tid = 129; break;
    case '生活': VivSet.tid = 160; break;
    case '纪录片': VivSet.tid = 177; break;
    case '影视': VivSet.tid = 181; break;
    case '数码': VivSet.tid = 188; break;
    default: VivSet.tid = 0;
  };

  switch($('.fav-info .fav-filters div:eq(2) span:eq(0)').text().trim()) {
    case '最近收藏':
      VivSet.order = 'mtime';
    break;
    case '最新投稿':
      VivSet.order = 'pubtime';
    break;
    case '最多播放':
      VivSet.order = 'view';
    break;
    default:
      VivSet.order = 'mtime';
    break;
  }

  var data = 'media_id=' + fid + '&pn=' + VivSet.pn + '&ps=20&order=' + VivSet.order + '&tid=' + VivSet.tid + '&type=0&jsonp=jsonp';
  var url = 'https://api.bilibili.com/medialist/gateway/base/spaceDetail?' + data;

  chrome.runtime.sendMessage({
    type: 'fetch',
    url: url
  },
  function(json) {
    if(json === null) {
      VivSet.fav = null;
      VivSet.expired = null;
      return false;
    }

    if(json.code === 0) {
      VivSet.fav = json.data.medias;
      VivSet.count = json.data.info.media_count;

      // 失效视频
      chrome.storage.sync.get(BtoolsConfig, function(items){
        BtoolsConfig = items;
        // 如果设置开启
        if(items.vivFind === 0) {
          VivSet.expiredIndex = 0;
          VivSet.expired = new Array;
          if(VivSet.fav !== null) {
            VivSet.fav.forEach(function(item, index) {

              if(item.title === '已失效视频') {
                // 如果本地有缓存
                if(BtoolsConfig.localCache.hasOwnProperty(item.id)) {
                  var videoInfo = BtoolsConfig.localCache[item.id];
                  var liDisabled = $('.fav-video-list li[data-aid=' + item.id + ']');

                  liDisabled.addClass('BtoolsVivFinded');

                  liDisabled.find('.disabled-cover').remove();
                  liDisabled.find('.cover img').attr({
                    'src': videoInfo.pic + '@380w_240h_100Q_1c.webp',
                    'alt': '图片文件失效'
                  }).css({
                    '-webkit-filter': 'none'
                  });

                  liDisabled.find('.title').text(videoInfo.title).css({
                    'color': '#F66',
                    'font-weight': '700'
                  });

                } else {
                  // 否则查询
                  VivSet.expired.push(item);
                }
              }
            });
          }
        }
      });
    }
  });

  if(VivSet.expired !== null && VivSet.expiredTimer === null) {
    if($('.fav-video-list li.disabled').length == $('.fav-video-list li.BtoolsVivFinded').length) {
      if(VivSet.expiredTimer !== null) {
        clearInterval(VivSet.expiredTimer);
        VivSet.expired = null;
        VivSet.expiredTimer = null;
      }
      return;
    }
    VivSet.expiredTimer = setInterval(function() {
      var video = VivSet.expired[VivSet.expiredIndex];
      if(video === undefined || !video.hasOwnProperty('id')) return;
      var url = 'https://www.biliplus.com/api/view?id=' + video.id;
      chrome.runtime.sendMessage({
        type: 'fetch',
        url: url
      },
      function(json) {
        if(json !== null) {
          var isPic = json.hasOwnProperty("pic");
          var isTitle = json.hasOwnProperty("title");
          var isCode = json.hasOwnProperty("code");
          var liDisabled = $('.fav-video-list li[data-aid=' + video.id + ']');

          if($('.BtoolsVivLoaddingBG').length === 0) {
            liDisabled.css({
              'position': 'relative'
            }).append('<div class="BtoolsVivLoaddingBG"></div><div class="BtoolsVivLoadding">' + Btools.logo() + '<p class="BtoolsVivLoaddingText">正在查找···</p></div>');
            $('.BtoolsVivLoaddingBG').css({
              'width': liDisabled.outerWidth(),
              'height': liDisabled.outerHeight()
            });
            $('.BtoolsVivLoadding').css({
              'left': (liDisabled.outerWidth() / 2) - ($('.BtoolsVivLoadding').outerWidth() / 2)
            });
          }

          if(isPic) {
            liDisabled.find('.disabled-cover').remove();
            liDisabled.find('.cover img').attr({
              'src': json.pic + '@380w_240h_100Q_1c.webp',
              'alt': '图片文件失效'
            }).css({
              '-webkit-filter': 'none'
            });
          }
          if(isTitle) {
            liDisabled.find('.title').text(json.title).css({
              'color': '#F66',
              'font-weight': '700'
            });

            // 失效视频 搜索视频
            liDisabled.find('a:eq(1),.meta-mask,a.disabled').HKM([
              {
                'key': 83,
                'title': '搜索标题',
                'position': 'first',
                'action': function() {
                  window.open('https://www.baidu.com/s?wd=' + json.title);
                  void(0);
                }
              }
            ]);
          }
          if(isCode && json.code === -404) {
            liDisabled.find('.title').text('缓存失效').css({
              'color': '#F66',
              'font-weight': '700'
            });
          }
          if(isPic || isTitle || (isCode && json.code !== -503)) {
            setTimeout(function() {
              liDisabled.find('.BtoolsVivLoadding,.BtoolsVivLoaddingBG').remove();
            }, 1000);
            liDisabled.addClass('BtoolsVivFinded');

            // 添加到插件本地存储
            addLocalCache(video.id, {
              title: isTitle ? json.title : '缓存失效',
              pic: isPic ? json.pic : ''
            });

            VivSet.expiredIndex++;
          }
          if(VivSet.expiredIndex == $('.fav-video-list li.disabled').length) {

            clearInterval(VivSet.expiredTimer);
            VivSet.expiredTimer = null;
          }
        }
      });
    }, 2000);
  }
}

function addLocalCache(avNum, videoInfo) {
  chrome.storage.sync.get(BtoolsConfig.localCache, function(items) {
    BtoolsConfig.localCache = items;
  });
  BtoolsConfig.localCache[avNum] = videoInfo;
  chrome.storage.sync.set(BtoolsConfig);
}



function media_info(mid) {
  if(VivSet.fav === null) return false;
  if($('#vivWindow').length > 0) $('#vivWindow').remove();
  var f = VivSet.fav[mid];
  if(f.page > 1) {
    var pagesHTML = '';
    f.pages.forEach(function(item, index) {
      pagesHTML += '<p><span>[P' + item.page + ']</span> ' + item.title + '</p>';
    });
  } else if(f.pages[0].title !== '') {
    var pageName = '<p><span>[P1]</span> ' + f.pages[0].title + '</p>';
  }

  // https://www.biliplus.com/api/view?id=12656941
  var avNum = /video\/(\d+)/i.exec(f.link)[1];
  var avTextNum = 'av' + avNum;

  var content = pagesHTML || pageName || '';
  var title = avTextNum || f.title || '';
  var html =
    '<div id="vivWindow">'+
      '<p class="vivMediaInfoTitle">' + title + '</p>'+

      '<p class="vivMediaInfoContent">' + f.intro + '</p>'+

      '<p class="vivMediaCount">共' + f.page + 'P</p>'+
      '<div class="vivP">'+
        content+
      '</div>'+

      '<p>收藏于 ' + getTime(f.fav_time) + '</p>'+

      '<p class="vivBilibiliCache">缓存：<a href="https://www.jijidown.com/video/av' + avNum + '" target="_blank">哔哩哔哩唧唧</a>、<a href="https://www.biliplus.com/video/av' + avNum + '" target="_blank">biliplus</a></p>'+

      '<a class="vivClose" href="javascript:void(0);">×</a>'+

      '<div class="vivBG"></div>'+
    '</div>';

  $('body').append(html).find('#vivWindow').css({
    'top': ($(window).height() / 2) - ($('#vivWindow').outerHeight() / 2),
    'left': ($(window).width() / 2) - ($('#vivWindow').outerWidth() / 2)
  });
  $('#vivWindow .vivClose').click(function(){
    $('#vivWindow').remove();
  });
}

function getTime(timeStamp) {
  var date = new Date();
  date.setTime(timeStamp * 1000);
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? ('0' + m) : m;
  var d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  var h = date.getHours();
  h = h < 10 ? ('0' + h) : h;
  var minute = date.getMinutes();
  var second = date.getSeconds();
  minute = minute < 10 ? ('0' + minute) : minute;
  second = second < 10 ? ('0' + second) : second;
  return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;
}
