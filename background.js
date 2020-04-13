chrome = chrome || browser;

var BtoolsInfo = {
  version: '1.1.3',
  releaseVersion: 14
}

// 安装完成后
chrome.runtime.onInstalled.addListener(function(details) {
    // 1.1.3 清除本地缓存
    chrome.storage.sync.set({
      localCache: {}
    });
});

chrome.runtime.onMessage.addListener(
function(request, sender, sendResponse) {
    switch(request.type) {
        case 'fetch':
            fetch(request.url)
            .then(function(response) { return response.json() })
            .then(function(json) { return sendResponse(json) })
            .catch(function(error) { return sendResponse(null) });
            return true;  // Will respond asynchronously.
            break;
        case 'getInfo':
            sendResponse(BtoolsInfo);
        break;
    }
});

/*
// 以图搜漫
chrome.contextMenus.create({
  contexts: ['image'],
  title: "以图搜漫",
  onclick: function(params) {
    var img = document.createElement("img");
    img.src = params.srcUrl;
    var timeout = 10;
    var timer = setInterval(function() {
      if(timeout === 0) {
        timeout = 10;
        clearInterval(timer);
      }
      if(img.naturalWidth !== 0 && img.naturalHeight !== 0) {
        var canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        fetch('https://trace.moe/api/search', {
          method: 'POST',
          body: JSON.stringify({image: canvas.toDataURL('image/jpeg', 0.8)}),
          headers: { 'Content-Type': 'application/json' }
        })
        .then(function(res) { return res.json() })
        .then(function(result) { console.log(result) });

        timeout = 10;
        clearInterval(timer);
      }

      timeout--;
    }, 100);
  }
});
*/
