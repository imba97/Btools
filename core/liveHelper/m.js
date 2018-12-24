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
  PKPoint: true
}

function liveHelperInit() {
  $('#gift-control-vm .gift-control-panel').append('<div id="BtoolsLiveHelper"><a id="BtoolsHideCtrl" href="javascript:;" target="_self"></a><div id="BtoolsLiveHelperOptions"><p class="BtoolsText BtoolsCenter BtoolsFirst">这么辣鸡的界面对不起</p><p class="BtoolsOption"><a id="BtoolsLiveHelperPKPointHide" href="javascript:;" target="_self"><span>隐藏</span>PK分数值</a></p><p id="BtoolsLiveHelperError"></p></div></div>');
  console.log('运行');

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
    BtoolsConfig.PKPoint = items.PKPoint;
    console.log(items.PKPoint);
    liveHelperHideTimer(items.PKPoint);
  });

  $('#BtoolsLiveHelperPKPointHide').click(function(){
    if($('.process-box').length !== 0){
      if($('.process-box').is(':hidden')){
        liveHelperHide(true);
      }else{
        liveHelperHide(false);
      }
    } else {
      BtoolsLiveHelperError('未检测到PK分数窗口');
    }
  });
}

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
  }, 500); // fuck you!!!
}

function liveHelperHide(k)
{
  if(k){
    $('#BtoolsLiveHelperPKPointHide span').text('隐藏');
    $('.process-box,.pk-result,.player-area:first').show();
  } else {
    $('#BtoolsLiveHelperPKPointHide span').text('显示');
    $('.process-box,.pk-result,.player-area:first').hide();
  }
}

function BtoolsLiveHelperError(text)
{
  $('#BtoolsLiveHelperError').append('<a href="javascript:;" target="_self" class="BtoolsLiveHelperErrorA">' + text + '</a>');
  $('#BtoolsLiveHelperError .BtoolsLiveHelperErrorA:last').animate({'opacity': 0}, 2000, function(){
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
