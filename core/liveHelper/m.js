const LiveHelperSet = {
  loopNum: 0,
  loopMax: 10,
  timer: null,
  timerOff: false,
  hideTimer: null,
  hideLoopNum: 0,
  hideLoopMax: 10,
  hideTimerOff: true
}

chrome = chrome || browser;

var BtoolsConfig = {
  PKPoint: 0,
  miniPlayerShow: 0
}


// live助手初始化
function liveHelperInit() {
  var liveHelperHTML =
    `<div id="BtoolsLiveHelper" class="item pointer">
      <a id="BtoolsHideCtrl" href="javascript:;" target="_self">${Btools.logo()}</a>
    </div>
    `;
  $('.supporting-info .live-skin-coloration-area:eq(0)').prepend(liveHelperHTML);
  // console.log('liveHelper 运行');

  $('#BtoolsLiveHelper #BtoolsHideCtrl').HKM([
    {
      key: 86,
      continued: true,
      title: 'PK分数显示隐藏',
      action: () => {
        if($('.process-box').length !== 0){
          if($('.process-box').is(':hidden')){
            liveHelperHide(0);
          }else{
            liveHelperHide(1);
          }
        }
      }
    }
  ]);

  $('#BtoolsLiveHelperPKPointHide').click(function(){
    if($('.process-box').length !== 0){
      if($('.process-box').is(':hidden')){
        liveHelperHide(0);
      }else{
        liveHelperHide(1);
      }
    } else {
      BtoolsLiveHelperMsg(false, '未检测到PK分数窗口');
    }
  });

  chrome.storage.sync.get(BtoolsConfig, function(items){
    BtoolsConfig = items;
    if(items.PKPoint !== 0) liveHelperHideTimer(1);
  });
}

// 用于第一次进入页面的默认隐藏或显示
function liveHelperHideTimer(k)
{
  if(!LiveHelperSet.hideTimerOff) return false;
  LiveHelperSet.hideTimerOff = false;
  LiveHelperSet.hideTimer = setInterval(function() {
    if(LiveHelperSet.hideLoopNum >= LiveHelperSet.hideLoopMax) {
      LiveHelperSet.hideLoopNum = 0;
      LiveHelperSet.hideTimerOff = true;
      clearInterval(LiveHelperSet.hideTimer);
    }
    if($('.process-box').length > 0) {
      liveHelperHide(k);
      LiveHelperSet.hideLoopNum = 0;
      LiveHelperSet.hideTimerOff = true;
      clearInterval(LiveHelperSet.hideTimer);
    } else {
      LiveHelperSet.hideLoopNum++;
    }

    // 隐藏迷你播放器
    if(BtoolsConfig.miniPlayerShow === 1) $('.player-section .live-player-ctnr').addClass('miniPlayerHide');
  }, 500); // fuck you!!!
}

function liveHelperHide(k)
{
  if(k === 0){
    $('.process-box,.pk-result,.player-area:first').show();
  } else {
    $('.process-box,.pk-result,.player-area:first').hide();
  }
}

LiveHelperSet.timer = setInterval(function() {
  if(LiveHelperSet.loopNum >= LiveHelperSet.loopMax) clearInterval(LiveHelperSet.timer);
  if($('.supporting-info').length === 0) {
    LiveHelperSet.loopNum++;
  } else {
    liveHelperInit();
    LiveHelperSet.loopNum = 0;
    clearInterval(LiveHelperSet.timer);
  }
}, 500);
