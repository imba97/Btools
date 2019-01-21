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

if(VivSet.init === true) {
  VivSet.init = false;
  _gaq.push(['_trackEvent', 'page', 'view', 'viv']);
}

$(document).ready(function(){
  $('body').on('click', '.be-scrollbar .fav-list .fav-item a.text', function(){
    VivInitLoopStart();
  });
  $('body').on('click', '.be-pager li.be-pager-item', function(){
    VivInitLoopStart();
  });
  $('body').on('click', 'li.be-pager-prev,.be-pager-next', function(){
    VivInitLoopStart();
  });
  $('body').on('click', '.n-tab-links a.n-favlist', function(){
    VivInitLoopStart();
  });
  $('body').on('click', '#fav-list-container .fav-item a', function(){
    VivInitLoopStart();
  });
  $('body').on('click', 'div.fav-filters,div.video-check-container,div.fav-action-fixtop', function(){
    VivInitLoopStart();
  });
  window.onpopstate = function(event) {
    VivInitLoopStart();
  };
  $(document).on('keyup', '.be-pager .be-pager-options-elevator input', function(e){
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
  if($('.fav-video-list li.disabled').length > 0) {
    $('.fav-video-list li.disabled').each(function() {
      var keyword = $(this).find('a:eq(0) img:eq(0)').attr('alt');
      $(this).find('a.title').html('<span class=\'Btools-viv-video-name\'>' + keyword + '</span>');

      if(VivSet.loopNum === 1) {
        var upNameText = $(this).find('.meta-mask .meta-info .author').text();
        var upName = upNameText.substring(4,upNameText.length);
        $(this).HKM({
          83: {
            'title': '搜索视频',
            'url': 'https://www.baidu.com/s?ie=utf-8&wd=' + keyword
          },
          85: {
            'title': '搜索UP主',
            'url': 'https://search.bilibili.com/upuser?keyword=' + upName
          }
        });
      }

      if ($(this).find('a.disabled').length > 0) {
        $(this).find('.disabled-cover').remove();
        $(this).find('a.disabled').attr('class', '').find('.length').remove();
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
