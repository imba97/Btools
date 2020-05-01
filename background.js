chrome = chrome || browser;

var BtoolsInfo = {
  version: '1.1.4',
  releaseVersion: 15,
  channelListenerTimer: null
}

// 安装完成后
chrome.runtime.onInstalled.addListener(function(details) {

});

chrome.runtime.onMessage.addListener(
function(request, sender, sendResponse) {
    switch(request.type) {
        case 'fetch':
            fetch(request.url, {
                headers: {
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.87 Safari/537.36'
                },
            })
            .then(function(response) { return response.json() })
            .then(function(json) { return sendResponse(json) })
            .catch(function(error) { return sendResponse(null) });
            return true;  // Will respond asynchronously.
            break;
        case 'getInfo':
            sendResponse(BtoolsInfo);
        break;
        case 'getChannelData':
          getChannelData(request.channelData, request.isAuto);
        break;
    }
});

// 检查关注频道的更新
var ChannelConfig = {
  channelUpdateTime: 3600,
  channelShow: {},
  channelChecked: {}
};
BtoolsInfo.channelListenerTimer = setInterval(function(){
  chrome.storage.sync.get(ChannelConfig, function(items) {
    ChannelConfig = items;

    // console.log(ChannelConfig);

  });
}, 10000);

var GetChannelDataConfig = {
  timer: null,
  page: 1
}

// 获取 isAuto true 是自动检测 如果 aids 中不存在 则视为 unread | false 是手动点击 不会存入 unread 数组
function getChannelData(channelData, isAuto) {

  GetChannelDataConfig.timer = setInterval(function() {

    var url = 'https://api.bilibili.com/x/space/channel/video?mid=' + channelData.uid + '&cid=' + channelData.cid + '&pn=' + GetChannelDataConfig.page + '&ps=30&order=0&jsonp=jsonp';

    fetch(url, {
        headers: {
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.87 Safari/537.36'
        },
    })
    .then(function(response) { return response.json() })
    .then(function(json) {

      if(json.code !== 0) return;

      if(!isAuto) {

        if(typeof ChannelConfig.channelShow[channelData.uid] === 'undefined') ChannelConfig.channelShow[channelData.uid] = {};
        if(typeof ChannelConfig.channelShow[channelData.uid][channelData.cid] === 'undefined') ChannelConfig.channelShow[channelData.uid][channelData.cid] = {
          name: json.data.list.name,
          unread: []
        }

      }

      if(json.data.list.archives.length > 0) {

        if(typeof ChannelConfig.channelChecked[channelData.cid] === 'undefined') {
          ChannelConfig.channelChecked[channelData.cid] = {
            date: parseInt(new Date().getTime() / 1000),
            aids: [],
            completed: false
          };
        } else {
          ChannelConfig.channelChecked[channelData.cid].completed = false;
        }

        // 循环数据 不在 ChannelConfig.channelChecked[uid] 里面的则添加
        json.data.list.archives.forEach(function(item, index) {
          if($.inArray(item.aid, ChannelConfig.channelChecked[channelData.cid].aids) === -1) {

            if(isAuto) {
              ChannelConfig.channelShow[channelData.uid][channelData.cid].unread.push(item.aid);
            }

            ChannelConfig.channelChecked[channelData.cid].aids.push(item.aid)
          }
        });

      } else {

        clearInterval(GetChannelDataConfig.timer);
        GetChannelDataConfig.page = 1;
        GetChannelDataConfig.timer = null;
        ChannelConfig.channelChecked[channelData.cid].completed = true;
        saveLocalConfig(ChannelConfig);

        return;

      }

      // 页数+1
      GetChannelDataConfig.page++;


    })
    .catch(function(error) { console.log(error); });


    }, 200);

}

function saveLocalConfig(config) {

  chrome.storage.sync.set(config, function(item) {
    ChannelConfig = config;
  });

}

/*
// 测试，拦截 webRequest

chrome.webRequest.onBeforeRequest.addListener(function(details) {
    console.log(details);

    if(/\/space\.a84a968bc3cac8988be7a3b7178c97c237b9a2b8\.js/.test(details.url)) {
        console.log(details.url);
        console.log(chrome.extension.getURL("overrides/space.js"));
        return {redirectUrl: chrome.extension.getURL("overrides/space.js")};
    }

}, {

    urls: ["*://*.hdslb.com/*"],
    types: ["script"]

}, ["blocking"]);

*/

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
