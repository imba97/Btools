var getUrlSet = {
  loopNum: 0,
  loopMax: 10,
  timer: null
}

getUrlInit();
var regexp = /.{0,2}(https?:\/\/(?:[\w\-]+\.)+[\w\-]+(?:[\/|\?][\w\u4e00-\u9fa5\-\.\/?\@\%\!\&=\+\~\:\#\;\,]*)?)/ig;
function getUrlInit()
{
  getUrlSet.timer = setInterval(function(){
    if($('.page-container .nav-tab-bar').length > 0)
    {
      $('.article-holder p').each(function() {
        var html = getRealUrl($(this).html());
        $(this).html(html);
      });
      clearInterval(getUrlSet.timer);
    }
  }, 200);
}

$(document).ready(function() {
  $('body').one('DOMNodeInserted', '#v_desc .info', function() {
    $('#v_desc .info').html(getRealUrl($('#v_desc .info').html()));
  })
});


function getRealUrl(html) {
  var n = 0;
  var realUrl = html;
  while(regUrl = regexp.exec(html)) {
    n++; if(n>100) break;
    if(regUrl) {
      if(!/^(=\")/.test(regUrl[0]) && !/^(\"\>)/.test(regUrl[0])) {
        realUrl = html.replace(regUrl[1], '<a href="' + regUrl[1] + '" class="BtoolsGetUrl" target="_blank">' + regUrl[1] + '</a>');
      }
    } else {
      break;
    }
  }
  return realUrl;
}
