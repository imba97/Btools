const europeanSet = {
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
  autoLoadTimerOff: true
}
setTimeout(function() {
  if($('.content').children('.card').length === 0) europeanShow();
}, 1000);

function europeanShow()
{
  var europeanShowHTML =
  '<div id="europeanPage">' +
    '<a href="#" target="_self" class="BtoolsLogoBtn"></a>' +
    '<div class="BtoolsBtnAll">' +
      '<a id="BtoolsEuropeanBtn" href="#" target="_self">抽奖</a>' +
    '</div>' +
    '<div class="europeanStartPage">' +
      '<p class="europeanUserArrLength">人数：<span>--</span></p>' +
      '<p class="europeanBtn">' +
        '<a id="europeanStartBtn" href="#" target="_self">开始</a>' +
        '<a id="europeanThisShitBtn" href="#" target="_self">就四李啦！</a>' +
        '<a id="europeanEndBtn" href="#" target="_self">结束抽奖</a>' +
      '</p>' +
      '<a href="#" target="_self" class="europeanAutoLoad">自动加载</a>' +
      '<div id="europeanUserArr"><p class="europeanUser"></p></div>' +
      '<div class="europeanWinners"></div>' +
    '</div>' +
    '<div class="europeanPageBG"></div>' +
  '</div>';

  $('body').append(europeanShowHTML);

  var cardW = $('.detail-card .card:eq(0)').outerWidth();

  var BtoolsBtnTop = $(window).height() * 0.3;
  var BtoolsBtnLeft = ($(window).width() / 2) - (cardW / 2) - 70;

  $('.BtoolsLogoBtn').css({
    'top': BtoolsBtnTop,
    'left': BtoolsBtnLeft
  });
  $('.BtoolsBtnAll').css({
    'top': BtoolsBtnTop + 50,
    'left': BtoolsBtnLeft + 5
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
    console.log('start:'+europeanSet.start);
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
    if(europeanSet.userArr.length === 0) return false;
    europeanSet.timer = setInterval(function(){
      console.log('timer');
      if(europeanSet.loopNum < europeanSet.userArr.length) {
        var user = europeanSet.userArr[europeanSet.loopNum];
        europeanSet.loopNum++;
      } else {
        europeanSet.loopNum = 0;
        var user = europeanSet.userArr[europeanSet.loopNum];
      }

      var europeanUserHTML = '<span style="background:transparent url(\'' + user.uFace + '\') no-repeat scroll 0 0 / 30px 30px;"></span><a class="europeanUName" href="#">' + user.uName + '</a>';
      $('#europeanUserArr .europeanUser').html(europeanUserHTML);
      $('.europeanUserArrLength span').text(europeanSet.userArr.length);

      if(europeanSet.userArr.length === 1) {
        clearInterval(europeanSet.timer);
      }
    }, 100);
  });

  $('#europeanThisShitBtn').click(function(){
    if(!europeanSet.start) return false;
    if(europeanSet.userArr.length === 1) {
      var lastUser = europeanSet.userArr[0];
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

  console.log('european start');
}

function europeanInArr(ud) {
	var uData = {
		uName: ud.find('.item-detail:eq(0) .item-user:eq(0) a.user-name:eq(0)').text(),
		uFace: ud.find('.forw-face:eq(0) .c-pointer:eq(0) .forw-head:eq(0)').attr('src'),
		uSpace: ud.find('.forw-face:eq(0) .c-pointer:eq(0)').attr('href')
	};
	if (europeanSet.userArr.length > 0) {
		$.each(europeanSet.userArr, function(k, v) {
			if (v.uName != uData.uName && uData.uName != europeanSet.upName && k == europeanSet.userArr.length - 1) europeanSet.userArr.push(uData)
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
      console.log($('.forw-more .nomore').length);
      if($('.forw-more .nomore').length !== 0)
      {
        europeanSet.autoLoadFlag = false;
        $('.europeanAutoLoad').text('加载完成');
        $('html,body').scrollTop('0');
        clearInterval(europeanSet.autoLoadTimer);
      }
      $('html,body').scrollTop($(document).height());
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
