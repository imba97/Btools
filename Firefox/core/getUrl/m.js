const getUrlSet = {
  loopNum: 0,
  loopMax: 10,
  timer: null,
  timerOff: false
}

getUrlInit();
function getUrlInit()
{
  getUrlSet.timer = setInterval(function(){
    if($('.page-container .nav-tab-bar').length > 0)
    {
      var regexp = /([^'"])((?:http|https):\/\/(?:[\w\-]+\.)+[\w\-]+(?:[\/|\?][\w\u4e00-\u9fa5\-\.\/?\@\%\!\&=\+\~\:\#\;\,]*)?)/ig;
      $('.article-holder p').each(function() {
        var html = $(this).html();
        html = html.replace(regexp, '$1<a href="$2" class="BtoolsGetUrl" target="_blank">$2</a>');
        $(this).html(html);
      });

      clearInterval(getUrlSet.timer);
    }
  }, 200);
}
