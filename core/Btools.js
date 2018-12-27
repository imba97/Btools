
//监听加载状态改变
document.onreadystatechange = completeLoading;

//加载状态为complete时移除loading效果
function completeLoading() {
    if (document.readyState === 'complete') {
      const Btools = {
        'info': '%c ____     __                   ___\n/\\  _`\\  /\\ \\__               /\\_ \\\n\\ \\ \\L\\ \\\\ \\ ,_\\   ___     ___\\//\\ \\     ____\n \\ \\  _ <\'\\ \\ \\/  / __`\\  / __`\\\\ \\ \\   /\',__\\\n  \\ \\ \\L\\ \\\\ \\ \\_/\\ \\L\\ \\/\\ \\L\\ \\\\_\\ \\_/\\__, `\\ \n   \\ \\____/ \\ \\__\\ \\____/\\ \\____//\\____\\/\\____/\n    \\/___/   \\/__/\\/___/  \\/___/ \\/____/\\/___/\n\n                  version 0.0.1  Power By imba久期',
        'infoColor': 'color:#00a1d6',
        'Reg': {
          'favlist' : '/(?:http|https):\/\/space\.bilibili\.com\/\d*\/favlist\??/i'
        }
      }
      console.log(Btools.info,Btools.infoColor);

      var url = window.location.href;

      // 微博自动刷新评论工具
      if(/(?:http|https)\:\/\/([^\/\?]*)\/\d+\/[a-zA-Z0-9]+\?type=comment/i.test(url)) {
        console.log('开启自动加载评论');
        window.onscroll = function() {
          if (document.getElementsByClassName("more_txt")[0] != undefined) {
            var scrollH = document.documentElement.scrollHeight || document.body.scrollHeight;
          	var clientH = document.documentElement.clientHeight || document.body.clientHeight;
          	var imba97_hei = (scrollH - clientH) - 100;
          	var scrolltop = document.documentElement.scrollTop || document.body.scrollTop;
          	if (scrolltop >= imba97_hei) {
          		if (document.getElementsByClassName("more_txt")[0] != undefined) document.getElementsByClassName("more_txt")[0].click();
          	}
          }
        }
      }

      // 其他

    }
}
