/*

  viv 失效视频显示工具

*/
const VivSet = {
  init: true,
  loopNum: 0,
  loopMax: 10,
  timer: null,
  timerOff: false,
  eqNum: 0,
  fidRex: /\/\d+\/favlist\?fid=(\d+)/i,
  fav: null,
  count: 0,
  pn: 1,
  isKey: false,
  order: 'mtime'
}

$(document).ready(function(){
  $('body').on('click', '.be-pager li.be-pager-item', function(){
    VivSet.fav = null;
    VivInitLoopStart();
  });
  // 头部 收藏夹 按钮
  $('body').on('click', '.n-tab-links a.n-favlist', function(){
    VivInitLoopStart();
  });
  $('body').on('click', '.fav-item a.text', function(){
    VivSet.order = 'mtime';
    VivSet.fav = null;
    VivInitLoopStart();
  });
  // 批量操作 等 按钮
  $('body').on('click', 'div.fav-filters,div.video-check-container,div.fav-action-fixtop', function(){
    VivInitLoopStart();
  });

  // 移动、复制按钮
  $('body').on('click', '.be-dropdown .be-dropdown-menu li', function() {
    VivInitLoopStart();
  });

  $('body').on('click', '.fav-filters .be-dropdown-menu:eq(1) .be-dropdown-item', function(){
    $('.fav-video-list li.small-item').each(function(){
      $(this).find('a').HKM('clear');
    });
    switch($(this).text()) {
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
    VivSet.fav = null;
    VivInitLoopStart();
  });

  // 上一页 下一页
  $('body').on('click', 'li.be-pager-prev,.be-pager-next', function(){
    VivSet.fav = null;
    VivInitLoopStart();
  });
  // 收藏夹链接
  $(document).on('click', '#page-index .fav .fav-item a', function() {
    VivSet.fav = null;
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
  if(VivSet.timerOff) {
    VivInitLoop();
  }
}

VivInitLoop();

function VivInitLoop()
{
  VivSet.timerOff = false;
  VivSet.timer = setInterval(function() {
    // console.log(VivSet.loopNum);
    VivInit();
    VivSet.loopNum++;
  }, 500);
}

function VivInit() {
  if(VivSet.fav === null) favJson();
  if($('.fav-video-list li.small-item').length > 0 && VivSet.fav !== null) {
    $('.fav-video-list li.small-item').each(function(index) {
      var upMid = VivSet.fav[index].upper.mid;
      var coverReg = /([^\@]*\.(?:webp|jpg|png|gif))(?:\@|\_).*\.(?:webp|jpg|png|gif)?/;
      $(this).find('a').HKM([
        {
          'key': 85,
          'title': '打开UP主空间',
          'action': () => {
            window.open(`http://space.bilibili.com/${upMid}`);
            void(0);
          }
        },
        {
          'key': 68,
          'title': '详情信息',
          'position': 'last',
          'action': () => {
            media_info(index);
          }
        }
      ]);

      if($(this).attr('class').indexOf('disabled') === -1) {
        var url = $(this).find('a.cover').attr('href');
        $(this).find('a').HKM([
          {
            'key': 67,
            'title': '打开封面',
            'position': 'first',
            'action': () => {
              window.open(coverReg.exec($(this).find('a:eq(0) img:eq(0)').attr('src'))[1]);
              void(0);
            }
          },
          {
            'key': 86,
            'title': '打开视频',
            'position': 'first',
            'action': () => {
              window.open(url);
              void(0);
            }
          }
        ]);
      } else {

      }

    });
  }

  if(VivSet.loopNum >= VivSet.loopMax) {
    VivSet.timerOff = true;
    VivSet.loopNum = 0;
    VivSet.eqNum = 0;
    clearInterval(VivSet.timer);
  }
}

function favJson(pn) {
  var fid = $('.fav-item[class~=cur]').attr('fid');
  if(fid === null) return false;

  if(!VivSet.isKey) VivSet.pn = Number($('.be-pager-item-active').text()); else VivSet.isKey = false;

  if(fid !== null) {
    $.getJSON(`https://api.bilibili.com/medialist/gateway/base/spaceDetail`, {
      media_id: fid,
      pn: VivSet.pn,
      ps: 20,
      order: VivSet.order,
      jsonp: 'jsonp'
    }, function(json){
      if(json && json.code === 0) {
        VivSet.fav = json.data.medias;
        console.log(json.data);
        VivSet.count = json.data.info.media_count;
      }
    });
  }
}

function media_info(mid) {
  if($('#vivWindow').length > 0) $('#vivWindow').remove();
  console.log(VivSet.fav[mid]);
  var f = VivSet.fav[mid];
  if(f.page > 1) {
    var pagesHTML = '';
    f.pages.forEach((item, index) => {
      pagesHTML += `<p><span>[P${item.page}]</span> ${item.title}</p>`;
    });
  } else if(f.pages[0].title !== '') {
    var pageName = `<p><span>[P1]</span> ${f.pages[0].title}</p>`;
  }
  var avNum = /video\/(\d+)/i.exec(f.link)[1];
  if(f.title === '已失效视频') {
    var videoName = f.page > 1 ? '已失效视频，希望通过分P名帮你想起来' : f.title;
    var bilibilijjText = '去哔哩哔哩唧唧看看有没有资源？';
  } else {
    var bilibilijjText = '跳转到哔哩哔哩唧唧下载？';
  }
  var html = `
    <div id="vivWindow">
      <p class="vivMediaInfoTitle">${videoName || f.title || ''}</p>

      <p class="vivMediaInfoContent">${f.intro}</p>

      <p class="vivMediaCount">共${f.page}P</p>
      <div class="vivP">
        ${pagesHTML || pageName || ''}
      </div>

      <p>收藏于 ${getTime(f.fav_time)}</p>

      <p class="vivBilibilijj"><a href="https://www.jijidown.com/video/av${avNum}" target="_blank">${bilibilijjText}</a></p>

      <a class="vivClose" href="javascript:void(0);">×</a>

      <div class="vivBG"></div>
    </div>
  `;
  $('body').append(html).find('#vivWindow').css({
    'top': $(document).scrollTop() + 50,
    'left': ($(document).width() / 2) - ($('#vivWindow').outerWidth() / 2)
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
