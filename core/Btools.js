
//监听加载状态改变
document.onreadystatechange = completeLoading;

//加载状态为complete时移除loading效果
function completeLoading() {
    if (document.readyState === 'complete') {
      const Btools = {
        'info': '%c ____     __                   ___\n/\\  _`\\  /\\ \\__               /\\_ \\\n\\ \\ \\L\\ \\\\ \\ ,_\\   ___     ___\\//\\ \\     ____\n \\ \\  _ <\'\\ \\ \\/  / __`\\  / __`\\\\ \\ \\   /\',__\\\n  \\ \\ \\L\\ \\\\ \\ \\_/\\ \\L\\ \\/\\ \\L\\ \\\\_\\ \\_/\\__, `\\ \n   \\ \\____/ \\ \\__\\ \\____/\\ \\____//\\____\\/\\____/\n    \\/___/   \\/__/\\/___/  \\/___/ \\/____/\\/___/\n\n                  version 0.0.1  Power By imba久期',
        'infoColor': 'color:#00a1d6',
        'Reg': {
          'weiboAutoLoadComment' : /(?:http|https)\:\/\/([^\/\?]*)\/\d+\/[a-zA-Z0-9]+\?([a-zA-Z0-9=_&]*)?type=comment/i
        }
      }
      console.log(Btools.info,Btools.infoColor);

      var url = window.location.href;

      // 微博自动刷新评论工具
      setTimeout(function(){
        if(Btools.Reg.weiboAutoLoadComment.test(url)) {
          console.log('开启自动加载评论');
          window.onscroll = function() {
            if ($('.more_txt').length > 0) {
              var scrollH = document.documentElement.scrollHeight || document.body.scrollHeight;
            	var clientH = document.documentElement.clientHeight || document.body.clientHeight;
            	var imba97_hei = (scrollH - clientH) - 50;
            	var scrolltop = document.documentElement.scrollTop || document.body.scrollTop;
              var count = clientH + scrolltop;
            	if (scrolltop >= imba97_hei) {
            		$('.more_txt').click();
            	}
              if(scrollH === count) {
                $(window).scrollTop(scrolltop - 1);
              }
            }
          }
        }
      }, 1000);

      // 其他

    }
}
