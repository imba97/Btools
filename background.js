var isChrome = !!chrome;
chrome = chrome || browser;

if(isChrome) {
  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = 'https://ssl.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();
  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-121985229-2']);
  _gaq.push(['_trackPageview']);
}

// 安装完成后
chrome.runtime.onInstalled.addListener(function(details) {

});

chrome.runtime.onMessage.addListener(
function(request, sender, sendResponse) {
  if (request.type == 'fetch') {
    fetch(request.url)
      .then(response => response.text())
      .then(text => sendResponse(text))
      .catch(error => console.log(error))
    return true;  // Will respond asynchronously.
  }
});
