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

var BtoolsConfig = {
  PKPoint: 0,
  miniPlayerShow: 0
}


// live助手初始化
function liveHelperInit() {
  var liveHelperHTML =
    '<div id="BtoolsLiveHelper">' +
      '<a id="BtoolsHideCtrl" href="javascript:;" target="_self"></a>' +
      '<div id="BtoolsLiveHelperOptions">' +
        '<p class="BtoolsText BtoolsCenter BtoolsFirst">这么辣鸡的界面对不起</p>' +
        '<p class="BtoolsOption"><a id="BtoolsLiveHelperPKPointHide" href="javascript:;" target="_self"><span>隐藏</span>PK分数值</a></p>' +
        '<p id="BtoolsLiveHelperMsg"></p>' +
      '</div>' +
    '</div>'
  $('#gift-control-vm .gift-control-panel').append(liveHelperHTML);
  console.log('liveHelper 运行');

  $('#BtoolsLiveHelper #BtoolsHideCtrl').click(function(){
    if($('#BtoolsLiveHelperOptions').is(':hidden')) {
      $('#BtoolsLiveHelperOptions').css({
        'left': 60,
        'opacity': 0
      }).show().animate({
        'left': 50,
        'opacity': 1
      });
    } else {
      $('#BtoolsLiveHelperOptions').animate({
        'left': 60,
        'opacity': 0
      }, function(){
        $(this).hide();
      });
    }

  });

  chrome.storage.sync.get(BtoolsConfig, function(items){
    BtoolsConfig = items;
    liveHelperHideTimer(items.PKPoint);
  });

  $('#BtoolsLiveHelperPKPointHide').click(function(){
    if($('.process-box').length !== 0){
      if($('.process-box').is(':hidden')){
        liveHelperHide(1);
      }else{
        liveHelperHide(0);
      }
    } else {
      BtoolsLiveHelperMsg(false, '未检测到PK分数窗口');
    }
  });
}

// 用于第一次进入页面的默认隐藏或显示
function liveHelperHideTimer(k)
{
  if(!LiveHelperSet.hideTimerOff) return false;
  LiveHelperSet.hideTimerOff = false;
  LiveHelperSet.hideTimer = setInterval(function() {
    console.log('hide:'+LiveHelperSet.hideLoopNum);
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
    if(BtoolsConfig.miniPlayerShow === 1) $('.player-section .live-player-ctnr').addClass('miniPlayerHide');
  }, 500); // fuck you!!!
}

function liveHelperHide(k)
{
  if(k === 1){
    $('#BtoolsLiveHelperPKPointHide span').text('隐藏');
    $('.process-box,.pk-result,.player-area:first').show();
  } else {
    $('#BtoolsLiveHelperPKPointHide span').text('显示');
    $('.process-box,.pk-result,.player-area:first').hide();
  }
}

// 信息显示
function BtoolsLiveHelperMsg(k,text)
{
  var aClass = k ? 'BtoolsLiveHelperSuccessA' : 'BtoolsLiveHelperErrorA';
  $('#BtoolsLiveHelperMsg').append('<a href="javascript:;" target="_self" class="' + aClass + '">' + text + '</a>');
  $('#BtoolsLiveHelperMsg .'+aClass+':last').animate({'opacity': 0}, 2000, function(){
    $(this).remove();
  });
}

LiveHelperSet.timer = setInterval(function() {
  console.log(LiveHelperSet.loopNum);
  if(LiveHelperSet.loopNum >= LiveHelperSet.loopMax) clearInterval(LiveHelperSet.timer);
  if($('#gift-control-vm .gift-control-panel').length === 0) {
    LiveHelperSet.loopNum++;
  } else {
    liveHelperInit();
    LiveHelperSet.loopNum = 0;
    clearInterval(LiveHelperSet.timer);
  }
}, 500);
