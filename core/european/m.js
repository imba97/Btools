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
  start: false
}
setTimeout(function() {
  europeanShow();
}, 1000);

function europeanShow()
{
  var europeanShowHTML =
  '<div id="europeanPage">' +
    '<div class="europeanStartPage">' +
      '<p class="europeanUserArrLength">人数：<span>--</span></p>' +
      '<p class="europeanBtn">' +
        '<a id="europeanStartBtn" href="#" target="_self">开始</a>' +
        '<a id="europeanThisShitBtn" href="#" target="_self">就四李啦！</a>' +
        '<a id="europeanEndBtn" href="#" target="_self">结束抽奖</a>' +
      '</p>' +
      '<div id="europeanUserArr"><p class="europeanUser"></p></div>' +
      '<div class="europeanWinners"></div>' +
    '</div>' +
    '<div class="europeanPageBG"></div>' +
  '</div>';

  $('body').append(europeanShowHTML);


  $('#europeanStartBtn').click(function(){
    if(europeanSet.start) return false;
    console.log('start:'+europeanSet.start);
    europeanSet.start = true;
    europeanSet.upName = $('.main-content:eq(0) .user-name:eq(0) a.c-pointer').text();
    $('.forw-list .dynamic-list-item-wrap').each(function() {
      europeanInArr($(this));
    });
    europeanSet.timer = setInterval(function(){
      console.log('timer');
      if(europeanSet.loopNum < europeanSet.userArr.length) {
        var user = europeanSet.userArr[europeanSet.loopNum];
        europeanSet.loopNum++;
      } else {
        europeanSet.loopNum = 0;
        var user = europeanSet.userArr[europeanSet.loopNum];
      }

      var europeanUserHTML = '<span style="background:transparent url(\'' + user.uFace + '\') no-repeat scroll 0 0 / 30px 30px;"></span><a href="' + user.uSpace + '">' + user.uName + '</a>';
      $('#europeanUserArr .europeanUser').html(europeanUserHTML);
      $('.europeanUserArrLength span').text(europeanSet.userArr.length);

      if(europeanSet.userArr.length === 1) {
        clearInterval(europeanSet.timer);
      }
    }, 100);
  });

  $('#europeanThisShitBtn').click(function(){
    if(europeanSet.userArr.length === 1) {
      $('.europeanUserArrLength span').text('0');
      if($('#europeanUserArr .europeanUser:first').css('top') == '0px') {
        $('#europeanUserArr .europeanUser:first').animate({'top':$('.europeanWinners .europeanUser').length * 50 + 80}, function(){
          $('.europeanWinners').append($(this).prop('outerHTML'));
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
    var europeanUserHTML = '<p class="europeanUser"><span style="background:transparent url(\'' + winU.uFace + '\') no-repeat scroll 0 0 / 30px 30px;"></span><a href="' + winU.uSpace + '">' + winU.uName + '</a></p>';
    $('.europeanWinners').append(europeanUserHTML);
    $('.europeanWinners .europeanUser:last').css({
      'top': 50 * europeanSet.winnerNum
    });
    europeanSet.winnerNum++;
  });

  $('#europeanEndBtn').click(function(){
    europeanSet.start = false;
    europeanSet.userArr.length = [];
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
