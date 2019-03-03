/*

  viv 失效视频显示工具

*/
const VivSet = {
  init: true,
  loopNum: 0,
  loopMax: 10,
  timer: null,
  timerOff: false,
  eqNum: 0
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

  // 移动、复制按钮
  $('body').on('click', '.be-dropdown .be-dropdown-menu li', function() {
    VivInitLoopStart();
  });

  // 上一页 下一页
  $('body').on('click', 'li.be-pager-prev,.be-pager-next', function(){
    VivInitLoopStart();
  });
  // 页数按钮
  $('body').on('click', '#page-index .fav .fav-item a', function() {
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
    VivInitLoopStart();
  };

  // 键盘回车翻页
  $(document).on('keyup', '.be-pager .be-pager-options-elevator input', function(e) {
    if(e.which === 13) {
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
  if($('.fav-video-list li.small-item').length > 0) {
    $('.fav-video-list li.small-item').each(function() {
      var upNameText = $(this).find('.meta-mask .meta-info .author').text();
      var upName = upNameText.substring(4,upNameText.length);
      var coverReg = /([^\@]*\.(?:webp|jpg|png|gif))(?:\@|\_).*\.(?:webp|jpg|png|gif)?/;
      $(this).find('a').HKM([
        {
          'key': 67,
          'title': '打开封面',
          'action': () => {
            window.open(coverReg.exec($(this).find('a:eq(0) img:eq(0)').attr('src'))[1]);
            void(0);
          }
        },
        {
          'key': 85,
          'title': '搜索UP主',
          'action': () => {
            window.open(`https://search.bilibili.com/upuser?keyword=${upName}`);
            void(0);
          }
        }
      ]);

      if($(this).attr('class').indexOf('disabled') === -1) {
        var url = $(this).find('a.cover').attr('href');
        $(this).find('a').HKM([
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
        var keyword = $(this).find('a:eq(0) img:eq(0)').attr('alt');
        $(this).find('a.title').html('<span class=\'Btools-viv-video-name\'>' + keyword + '</span>');

        $(this).find('a').HKM([
          {
            'key': 83,
            'title': '搜索视频',
            'position': 'first',
            'action': () => {
              window.open(`https://www.baidu.com/s?ie=utf-8&wd=${keyword}`);
              void(0);
            }
          }
        ]);

        if ($(this).find('a.disabled').length > 0) {
          $(this).find('.disabled-cover').remove();
          $(this).find('a.disabled').attr('class', '').find('.length').remove();
        }
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
