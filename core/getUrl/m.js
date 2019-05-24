const getUrlSet = {
  loopNum: 0,
  loopMax: 10,
  timer: null
}

getUrlInit();
function getUrlInit()
{
  getUrlSet.timer = setInterval(function(){
    if($('.page-container .nav-tab-bar').length > 0)
    {
      var regexp = /.{2}(https?:\/\/(?:[\w\-]+\.)+[\w\-]+(?:[\/|\?][\w\u4e00-\u9fa5\-\.\/?\@\%\!\&=\+\~\:\#\;\,]*)?)/ig;
      $('.article-holder p').each(function() {
        var html = $(this).html();
        var n = 0;
        while(regUrl = regexp.exec(html)) {
          n++; if(n>100) break;
          if(regUrl) {
            if(!/(=\")[^"]*/.test(regUrl[0])) {
              $(this).html(html.replace(regUrl[1], `<a href="${regUrl[1]}" class="BtoolsGetUrl" target="_blank">${regUrl[1]}</a>`));
            }
          } else {
            break;
          }
        }
      });

      clearInterval(getUrlSet.timer);
    }
  }, 200);
}
