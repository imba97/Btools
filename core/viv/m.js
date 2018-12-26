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
  $(document).on('click', '#fav-list-container a.text', function(){
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
  $('body').on('click', '#page-index .fav .fav-item a', function(){
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
    console.log(VivSet.loopNum);
    VivInit();
    VivSet.loopNum++;
  }, 500);
}

function VivInit() {
  if($('.fav-video-list li.disabled').length > 0) {
    $('.fav-video-list li.disabled').each(function() {
      var keyword = $(this).find('a:eq(0) img:eq(0)').attr('alt');
      $(this).find('a.title').html('<span class=\'Btools-viv-video-name\'>' + keyword + '</span>');
      $(this).find('a').each(function() {
        if ($(this).attr('href') == 'javascript:;') {
          $(this).attr({
            'href': 'https://www.baidu.com/s?ie=utf-8&wd=' + keyword,
            'target': '_blank'
          })
        }
      });
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
