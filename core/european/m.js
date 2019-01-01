const europeanSet = {
  loopNumOnload: 0,
  loopNumOnloadMax: 20,
  timerOnload: null,
  cardW: 0,
  loopNum: 0,
  timer: null,
  timerOff: false,
  userArr: [],
  userArr2: [],
  winArr: [],
  card: null,
  winnerNum: 0,
  upName: null,
  start: false,
  autoLoadTimer: null,
  autoLoadFlag: true,
  autoLoadTimerOff: true,
  Alleuropeans: 0,
  defaultAtNum: 0,
  atNumArr: [],
  atNumReg: eval(/<?a href="\/\/space\.bilibili\.com\/\d+\/dynamic"[^<>]*>\@([^<>@]*)<\/a>/ig)
}


europeanSet.timerOnload = setInterval(function(){
  if($('.detail-card .card:eq(0)').length > 0) {
    europeanSet.cardW = $('.detail-card .card:eq(0)').outerWidth();
    if($('.content').children('.card').length === 0) europeanShow();
    europeanSet.Alleuropeans = Number($('.button-bar span:eq(0) span:eq(0)').text());
    // console.log(europeanSet.Alleuropeans);
    clearInterval(europeanSet.timerOnload);
  } else {
    europeanSet.loopNumOnload++;
  }

  if(europeanSet.loopNumOnload > europeanSet.loopNumOnloadMax) clearInterval(europeanSet.timerOnload);
}, 500);

function europeanShow()
{
  var europeanShowHTML =
  '<div id="europeanPage">' +
    '<a href="#javascript:;" target="_self" class="BtoolsLogoBtn"></a>' +
    '<div class="BtoolsBtnAll">' +
      '<a id="BtoolsEuropeanBtn" href="#javascript:;" target="_self">抽奖</a>' +
    '</div>' +
    '<div class="europeanStartPage">' +
      '<p class="europeanUserArrLength">人数：<span>--</span></p>' +
      '<p class="europeanBtn">' +
        '<a id="europeanStartBtn" href="#javascript:;" target="_self">开始</a>' +
        '<a id="europeanThisShitBtn" href="#javascript:;" target="_self">就四李啦！</a>' +
        '<a id="europeanEndBtn" href="#javascript:;" target="_self">结束抽奖</a>' +
      '</p>' +
      '<p class="europeanAutoLoadProgressBar"></p>' +
      '<div id="europeanUserArr"><p class="europeanUser"></p></div>' +
      '<div class="europeanWinners"></div>' +
      '<p class="europeanAtSet"><input type="number" value="0"></p>' +
      '<a href="#javascript:;" target="_self" class="europeanAutoLoad">自动加载</a>' +
    '</div>' +
    '<div class="europeanPageBG"></div>' +
  '</div>';

  $('body').append(europeanShowHTML);

  rePosition();
  $(window).resize(function() {
    rePosition();
  });

  chrome.storage.sync.get({defaultAtNum: 0}, function(items) {
    europeanSet.defaultAtNum = items.defaultAtNum;
    $('.europeanAtSet input').val(items.defaultAtNum);
  });

  $('.europeanAtSet input').bind('input propertychange', function(){
    var num = $(this).val();
    if(num >= 0 && num <= 9) {
      europeanSet.defaultAtNum = num;
    } else {
      $(this).val(europeanSet.defaultAtNum);
      return false;
    }
    $(this).val(europeanSet.defaultAtNum);
    chrome.storage.sync.set({defaultAtNum: europeanSet.defaultAtNum}, function() {
      // console.log('set ✔');
    });
  });

  $('#BtoolsEuropeanBtn').click(function(){
    if($('.europeanStartPage').is(':hidden')) {
      $('.europeanStartPage,.europeanPageBG').show().css({
        'width': $(window).width(),
        'height': $(window).height()
      })
    } else {
      $('.europeanStartPage,.europeanPageBG').hide();
    }
  });

  $('.europeanAutoLoad').click(function(){
    autoLoad();
    return false;
  });

  $('#europeanStartBtn').click(function(){
    if(europeanSet.start) return false;
    // console.log('start:'+europeanSet.start);
    europeanSet.start = true;
    $('#europeanStartBtn').css({
      'background-color': '#666'
    });
    $('#europeanThisShitBtn').css({
      'background-color': '#ff94b1'
    });
    $('#europeanEndBtn').css({
      'background-color': '#ff94b1'
    });

    europeanSet.upName = $('.main-content:eq(0) .user-name:eq(0) a.c-pointer').text();
    $('.forw-list .dynamic-list-item-wrap').each(function() {
      europeanInArr($(this));
    });
    if(europeanSet.userArr.length === 0) {
      $('#europeanEndBtn').click();
      $('#europeanUserArr .europeanUser').html('<font class="europeanUserMsg">没有符合的用户</font>');
      return false;
    }
    europeanSet.timer = setInterval(function(){
      if(europeanSet.loopNum < europeanSet.userArr.length) {
        var user = europeanSet.userArr[europeanSet.loopNum];
        europeanSet.loopNum++;
      } else {
        europeanSet.loopNum = 0;
        var user = europeanSet.userArr[europeanSet.loopNum];
      }

      var europeanUserHTML = '<span style="background:transparent url(\'' + user.uFace + '\') no-repeat scroll 0 0 / 30px 30px;"></span><a class="europeanUName" href="#javascript:;">' + user.uName + '</a>';
      $('#europeanUserArr .europeanUser').html(europeanUserHTML);
      $('.europeanUserArrLength span').text(europeanSet.userArr.length);

      if(europeanSet.userArr.length === 1) {
        clearInterval(europeanSet.timer);
      }
    }, 100);
  });

  $('#europeanThisShitBtn').click(function(){
    if(!europeanSet.start || europeanSet.userArr.length === 0) return false;
    if(europeanSet.userArr.length === 1) {
      var lastUser = europeanSet.userArr[0];
      europeanSet.userArr = [];
      $('.europeanUserArrLength span').text('0');
      if($('#europeanUserArr .europeanUser:first').css('top') == '0px') {
        var sTop = $('.europeanWinners').scrollTop();
        $('#europeanUserArr .europeanUser:first').animate({'top':$('.europeanWinners .europeanUser').length * 50 - sTop + 80}, function(){
          $('.europeanWinners').append(makeUserHTML(lastUser));
          $('.europeanWinners .europeanUser:last').css({
            'top': 50 * europeanSet.winnerNum
          });
          europeanSet.winnerNum++;

          $(this).html('').css({'top':0});

        });
      }
      return false;
    }
    var rand = Math.round(Math.random() * (europeanSet.userArr.length - 1));
		var winU = europeanSet.userArr[rand];
		europeanSet.winArr.push(winU);
		europeanSet.userArr2 = [];
		$.each(europeanSet.userArr, function(k, v) {
			if (v.uName != winU.uName) {
				europeanSet.userArr2.push(v)
			}
		});
		europeanSet.userArr = europeanSet.userArr2;
    $('.europeanWinners').append(makeUserHTML(winU));
    $('.europeanWinners .europeanUser:last').css({
      'top': 50 * europeanSet.winnerNum
    });
    europeanSet.winnerNum++;
  });

  $('#europeanEndBtn').click(function(){
    if(!europeanSet.start) return false;
    europeanSet.start = false;
    europeanSet.userArr.length = [];
    $('#europeanStartBtn').css({
      'background-color': '#ff94b1'
    });
    $('#europeanThisShitBtn').css({
      'background-color': '#666'
    });
    $('#europeanEndBtn').css({
      'background-color': '#666'
    });
    $('.europeanUserArrLength span').text('--');
    $('#europeanUserArr .europeanUser').html('');
    clearInterval(europeanSet.timer);
  });
}

function rePosition()
{
  var BtoolsBtnTop = $(window).height() * 0.3;
  var BtoolsBtnLeft = ($(window).width() / 2) - (europeanSet.cardW / 2) - 70;

  $('.BtoolsLogoBtn').css({
    'top': BtoolsBtnTop,
    'left': BtoolsBtnLeft
  });
  $('.BtoolsBtnAll').css({
    'top': BtoolsBtnTop + 50,
    'left': BtoolsBtnLeft + 5
  });
  $('.europeanAtSet').css({
    'top': BtoolsBtnTop + 120,
    'left': BtoolsBtnLeft + 5
  });
}

function europeanInArr(ud) {
  if(europeanSet.defaultAtNum > 0) {
    var uText = ud.find('.item-detail:eq(0) .text:eq(0)').html();
    var uTextArr = uText.split('//<');
    europeanSet.atNumArr = [];
    if(uTextArr.length > 1) {
      var text = uTextArr[0];
    } else {
      var text = uTextArr[0];
    }
    var atNumFlag = text.match(europeanSet.atNumReg);
    // console.log(atNumFlag);
    if(atNumFlag !== null) {
      for(i = 0; i < atNumFlag.length; i++) {
        uniqueArr(atNumFlag[i], europeanSet.atNumArr)
      }
    }

    if(europeanSet.atNumArr.length < europeanSet.defaultAtNum) return false;

    // if(europeanSet.atNumArr.length < europeanSet.defaultAtNum) {
    //   var a = '不符合要求';
    // } else {
    //   var a = '符合要求';
    // }
    // console.log('['+ud.find('.item-detail:eq(0) .item-user:eq(0) a.user-name:eq(0)').text() + '] At了 ' + europeanSet.atNumArr.length + '人，' + a);
  }

	var uData = {
		uName: ud.find('.item-detail:eq(0) .item-user:eq(0) a.user-name:eq(0)').text(),
		uFace: ud.find('.forw-face:eq(0) .c-pointer:eq(0) .forw-head:eq(0)').attr('src'),
		uSpace: ud.find('.forw-face:eq(0) .c-pointer:eq(0)').attr('href')
	};
	if (europeanSet.userArr.length > 0) {
		$.each(europeanSet.userArr, function(k, v) {
			if (v.uName !== uData.uName && uData.uName !== europeanSet.upName) {
        if(k === europeanSet.userArr.length - 1) europeanSet.userArr.push(uData);
      }
		})
	} else {
		if (uData.uName != europeanSet.upName) europeanSet.userArr.push(uData)
	}
}

function autoLoad() {
  if(!europeanSet.autoLoadFlag) return false;
  if(europeanSet.autoLoadTimerOff) {
    europeanSet.autoLoadTimerOff = false;
    $('.europeanAutoLoad').text('取消');
    europeanSet.autoLoadTimer = setInterval(function(){
      var progressBarNum = Math.floor($('.forw-list .dynamic-list-item-wrap').length / europeanSet.Alleuropeans * 100);
      $('.europeanAutoLoadProgressBar').css({'width': progressBarNum + '%'});
      $('.europeanAutoLoad').text(progressBarNum + '% 点击暂停');
      if($('.forw-more .nomore').length !== 0)
      {
        europeanSet.autoLoadFlag = false;
        $('.europeanAutoLoad').text('加载完成');
        $('html,body').scrollTop('0');
        clearInterval(europeanSet.autoLoadTimer);
      } else {
        if($('.more').length > 0) $('.more')[0].click();
      }
    }, 500)
  } else {
    europeanSet.autoLoadTimerOff = true;
    $('.europeanAutoLoad').text('继续加载');
    clearInterval(europeanSet.autoLoadTimer);
  }
}

function makeUserHTML(u)
{
  var mid = /com\/(\d*)\//g.exec(u.uSpace);
  var msgUrl = 'http://message.bilibili.com/#/whisper/mid' + mid[1];
  return '<p class="europeanUser"><span style="background:transparent url(\'' + u.uFace + '\') no-repeat scroll 0 0 / 30px 30px;"></span><a class="europeanUName" href="' + u.uSpace + '" target="_blank">' + u.uName + '</a><a class="europeanUMsg" href="' + msgUrl + '" target="_blank">私信TA</a></p>';
}

function uniqueArr(val, arr)
{
  if(arr.length === 0) {
    if (val != europeanSet.upName) arr.push(val);
  } else {
    $.each(arr, function(k, v){
      if (val != v && val != europeanSet.upName) {
        if(k === arr.length - 1) arr.push(val);
      }
    });
  }
}
