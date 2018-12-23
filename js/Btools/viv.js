/*

  viv 失效视频显示工具

*/
const VivSet = {
  init: true,
  loopNum: 0,
  loopMax: 10,
  timer: null
}

$(document).on('click', '.fav-list li a', function(){
  VivInitLoop();
});
$(document).on('click', '.be-pager li a', function(){
  VivInitLoop();
});
$(document).on('click', '.n-tab-lin ks .n-favlist', function(){
  VivInitLoop();
});
$(document).on('keyup', '.be-pager .be-pager-options-elevator input', function(e){
  VivInitLoop();
  if(e.which === 13) {
    VivInitLoop();
  }
});

VivInitLoop();

function VivInitLoop()
{
    VivSet.timer = setInterval(function(){
      VivInit();
      VivSet.loopNum++;
    }, 100);
}

function VivInit() {
  console.log(VivSet.loopNum);
  if($('li.disabled').length > 0) {
    $('li.disabled').each(function() {
      if ($(this).find('a.disabled').length > 0) {
        var keyword = $(this).find('a.disabled img').attr('alt');
        $(this).find('a.title').html('<span style=\'color:#F66\'>' + keyword + '</span>');
        $(this).find('a').each(function() {
          if ($(this).attr('href') == 'javascript:;') {
            $(this).attr({
              'href': 'https://www.baidu.com/s?ie=utf-8&wd=' + keyword,
              'target': '_blank'
            })
          }
        });
        $(this).find('.disabled-cover').remove();
        $(this).find('a.disabled').attr('class', '').find('.length').remove();
      }
    });

    VivSet.loopNum=0;
    clearInterval(VivSet.timer);
  }
}
