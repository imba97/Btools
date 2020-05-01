var channelSet = {
  loopNum: 0,
  loopMax: 10,
  timer: null,
  completedTimer: null,
  watch: {
    key: 83,
    title: '订阅此频道'
  },
  unwatch: {
    key: 67,
    title: '取消订阅此频道'
  }
}

var ChannelConfig = {
  // 订阅的channelID
  channelShow: {},
  // 订阅中的信息 date：最后查询的日期时间戳 aids：已存在的视频AV号
  channelChecked: {}
}

$(function() {

  channelSet.timer = setInterval(function() {
    if($('.page-head').length === 0) return false;

    $('.page-head').append('<a id="channelBtoolsBtn" href="javascript:void(0);">' + Btools.logo() + '</a>');

    getLocalConfig(channelInit);


    clearInterval(channelSet.timer);
    channelSet.timer = null;

  }, 1000);

});

function channelInit() {

  var ids = /space\.bilibili\.com\/(\d+)\/channel\/detail\?cid=(\d+)/.exec(window.location.href);
  if(ids === null) return;

  var uid = ids[1];
  var cid = ids[2];

  getLocalConfig(function() {
    // 已订阅则直接显示 取消订阅
    if(ChannelConfig.channelChecked.hasOwnProperty(cid)) {
      $('#channelBtoolsBtn').HKM([
        {
          key: channelSet.unwatch.key,
          title: channelSet.unwatch.title,
          action: function() {
            channelUnwatch(uid, cid);
          }
        }
      ]);
    } else {
      $('#channelBtoolsBtn').HKM([
        {
          key: channelSet.watch.key,
          title: channelSet.watch.title,
          action: function() {
            channelWatch(uid, cid);
          }
        }
      ]);
    }
  });

  function channelUnwatch(uid, cid) {

    $('#channelBtoolsBtn').HKM('clear-' + channelSet.unwatch.key).HKM([
      {
        key: channelSet.watch.key,
        title: channelSet.watch.title,
        action: function() {
          channelWatch(uid, cid);
        }
      }
    ]);

    delete ChannelConfig.channelChecked[cid];
    saveLocalConfig();

  }

  function channelWatch(uid, cid) {

    if(channelSet.completedTimer !== null) return;

    $('#channelBtoolsBtn').HKM('clear-' + channelSet.watch.key);

    chrome.runtime.sendMessage({
      type: 'getChannelData',
      channelData: {
        uid: uid,
        cid: cid
      },
      isAuto: false
    });

    channelSet.completedTimer = setInterval(function() {

      getLocalConfig(null);

      // 获取到数据后
      if(ChannelConfig.channelChecked.hasOwnProperty(cid) && ChannelConfig.channelChecked[cid].completed === true) {

        clearInterval(channelSet.completedTimer);
        channelSet.completedTimer = null;

        $('#channelBtoolsBtn').HKM([
          {
            key: channelSet.unwatch.key,
            title: channelSet.unwatch.title,
            action: function() {
              channelUnwatch(uid, cid);
            }
          }
        ]);

      } else {

        // 进度条

      }

    }, 500);
  }

}

function getLocalConfig(callback) {
  chrome.storage.sync.get(ChannelConfig, function(items){
    ChannelConfig = items;
    if(typeof callback === 'function') callback();
  });
}

function saveLocalConfig() {
  chrome.storage.sync.set(ChannelConfig)
}
