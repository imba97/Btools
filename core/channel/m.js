var ChannelSet = {
  loopNum: 0,
  loopMax: 10,
  timer: null,
  completedTimer: null,
  watch: {
    key: 83,
    title: '订阅此频道',
    logoColor: '#13a813'
  },
  unwatch: {
    key: 67,
    title: '取消订阅此频道'
  }
}

var ChannelConfigTemp = {
  // 订阅的channelID
  channelShow: {},
  // 订阅中的信息 date：最后查询的日期时间戳 aids：已存在的视频AV号
  channelChecked: {}
}
var ChannelConfig = ChannelConfigTemp;

$(function() {

  ChannelSet.timer = setInterval(function() {

    if(!/space\.bilibili\.com\/\d+\/channel\/detail/.test(window.location.href)) return;

    if($('.page-head').length === 0 || $('#channelBtoolsBtn').length > 0) return;

    $('.page-head').append('<a id="channelBtoolsBtn" href="javascript:void(0);"></a>');

    getLocalConfig(channelBtnInit);

    // clearInterval(ChannelSet.timer);
    // ChannelSet.timer = null;

  }, 1000);

});


function channelBtnInit() {

  var ids = /space\.bilibili\.com\/(\d+)\/channel\/detail\?cid=(\d+)/.exec(window.location.href);
  if(ids === null) return;

  var uid = ids[1];
  var cid = ids[2];

  getLocalConfig(function() {

    // 已订阅则直接显示 取消订阅
    if(ChannelConfig.channelShow.hasOwnProperty(uid) && ChannelConfig.channelShow[uid].hasOwnProperty(cid)) {
      $('#channelBtoolsBtn').html(Btools.logo(ChannelSet.watch.logoColor)).HKM([
        {
          key: ChannelSet.unwatch.key,
          title: ChannelSet.unwatch.title,
          action: function() {
            channelUnwatch(uid, cid);
          }
        }
      ]);
    } else {
      $('#channelBtoolsBtn').html(Btools.logo()).HKM([
        {
          key: ChannelSet.watch.key,
          title: ChannelSet.watch.title,
          action: function() {
            channelWatch(uid, cid);
          }
        }
      ]);
    }
  });

  function channelUnwatch(uid, cid) {

    $('#channelBtoolsBtn').HKM('clear-' + ChannelSet.unwatch.key).HKM([
      {
        key: ChannelSet.watch.key,
        title: ChannelSet.watch.title,
        action: function() {
          channelWatch(uid, cid);
        }
      }
    ]);

    $('#channelBtoolsBtn').html(Btools.logo());

    getLocalConfig(function() {
      delete ChannelConfig.channelShow[uid][cid];
      if($.isEmptyObject(ChannelConfig.channelShow[uid])) {
        delete ChannelConfig.channelShow[uid];
      }
      delete ChannelConfig.channelChecked[cid];
      saveLocalConfig();

    });

  }

  function channelWatch(uid, cid) {

    if(ChannelSet.completedTimer !== null) return;

    // 清掉快捷键
    $('#channelBtoolsBtn').HKM('clear-' + ChannelSet.watch.key);
    // 按钮变灰
    $('#channelBtoolsBtn').html(Btools.logo('#666'));

    // 设置为未完成
    if(typeof ChannelConfig.channelChecked[cid] !== 'undefined') {
      ChannelConfig.channelChecked[cid].completed = false;
    }

    chrome.runtime.sendMessage({
      type: 'getChannelData',
      channelData: {
        uid: uid,
        cid: cid
      },
      isAuto: false
    });

    ChannelSet.completedTimer = setInterval(function() {

      getLocalConfig(function() {

        // 获取到数据后
        if(ChannelConfig.channelShow.hasOwnProperty(uid) && ChannelConfig.channelShow[uid].hasOwnProperty(cid) && ChannelConfig.channelChecked[cid].completed === true) {

          clearInterval(ChannelSet.completedTimer);
          ChannelSet.completedTimer = null;

          ChannelConfig.channelShow[uid][cid].upName = $('#h-name').text();
          ChannelConfig.channelShow[uid][cid].face = $('.h-avatar img').attr('src');

          saveLocalConfig();
          $('#channelBtoolsBtn').html(Btools.logo(ChannelSet.watch.logoColor));

          $('#channelBtoolsBtn').HKM([
            {
              key: ChannelSet.unwatch.key,
              title: ChannelSet.unwatch.title,
              action: function() {
                channelUnwatch(uid, cid);
              }
            }
          ]);

        } // else { console.log('loading...'); }


      });

    }, 500);
  }

}

function getLocalConfig(callback) {
  chrome.storage.sync.get(ChannelConfigTemp, function(items){
    ChannelConfig = items;
    if(typeof callback === 'function') callback();
  });
}

function saveLocalConfig() {
  chrome.storage.sync.set(ChannelConfig)
}
