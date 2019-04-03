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
      var regexp = /((?:http|https):\/\/(?:[\w\-]+\.)+[\w\-]+(?:[\/|\?][\w\u4e00-\u9fa5\-\.\/?\@\%\!\&=\+\~\:\#\;\,]*)?)/ig;
      $('.article-holder p').each(function() {
        var text = $(this).text();
        if(regexp.exec(text) !== null) {
          text = text.replace(regexp, '<a href="$1" class="BtoolsGetUrl" target="_blank">$1</a>');
          $(this).html(text);
        }
      });

      clearInterval(getUrlSet.timer);
    }
  }, 200);
}
