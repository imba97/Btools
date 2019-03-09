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
  userAtArr: [],
  addUser: [],
  winArr: [],
  card: null,
  winnerNum: 0,
  upName: null,
  start: true,
  autoLoadOffset: 0,
  autoLoadTimer: null,
  autoLoadNum: 0,
  autoLoadMax: 20,
  Alleuropeans: 0,
  defaultAtNum: 0
}

chrome = chrome || browser;

$(document).ready(function() {

});

europeanSet.timerOnload = setInterval(function(){
  if($('.detail-card .card:eq(0)').length > 0) {
    europeanSet.cardW = $('.detail-card .card:eq(0)').outerWidth();
    if($('.content').children('.card').length === 0) europeanShow();

    clearInterval(europeanSet.timerOnload);
  } else {
    europeanSet.loopNumOnload++;
  }

  if(europeanSet.loopNumOnload > europeanSet.loopNumOnloadMax) clearInterval(europeanSet.timerOnload);
}, 500);

function europeanShow()
{
  var europeanShowHTML =`
    <div id="europeanPage">
      <a href="javascript:void(0);" class="BtoolsLogoBtn">${Btools.logo()}</a>
      <div class="europeanStartPage">
        <p class="europeanUserArrLength">人数：<span>--</span></p>
        <p class="europeanBtn">
          <a id="europeanStartBtn" href="javascript:void(0);">开始</a>
          <a id="europeanThisShitBtn" href="javascript:void(0);">就四李啦！</a>
          <a id="europeanEndBtn" href="javascript:void(0);">结束抽奖</a>
        </p>
        <p class="europeanAutoLoadProgressBar"></p>
        <div id="europeanUserArr"><p class="europeanUser"></p></div>
        <div class="europeanWinners"></div>
        <p class="europeanAtSet"><input type="number" value="0"></p>
        <p class="europeanAddUser"><input type="text" placeholder="手动添加"><a href="javascript:void(0);">添加</a></p>
        <div class="europeanAddUserArr"></div>
      </div>
      <div class="europeanPageBG"></div>
    </div>
    `;

  $('body').append(europeanShowHTML);

  rePosition();
  $(window).resize(function() {
    rePosition();
  });

  $('.BtoolsLogoBtn').HKM([
    {
      key: 82,
      title: '转发抽奖',
      action: () => {
        if($('.europeanStartPage').is(':hidden')) {
          $('.europeanStartPage,.europeanPageBG').show().css({
            'width': $(window).width(),
            'height': $(window).height()
          });

          if(europeanSet.autoLoadTimer === null) {
            europeanSet.autoLoadTimer = setInterval(function(){
              autoLoad();
              europeanSet.autoLoadNum++;

              if(europeanSet.autoLoadNum >= europeanSet.autoLoadMax) {
                clearInterval(europeanSet.autoLoadTimer);
                europeanSet.autoLoadTimer = null;
                europeanSet.start = false;
              }
            }, 500);
          }
        } else {
          $('.europeanStartPage,.europeanPageBG').hide();
        }

      }
    }
  ]);

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
    });
  });

  $('.europeanAddUser a').click(function(){
    if($('.europeanAddUser input').val() === '') return false;
    var addUserName = $('.europeanAddUser input').val();
    var uData = {
      uID: null,
  		uName: addUserName,
  		uFace: 'http://static.hdslb.com/images/member/noface.gif',
  		uSpace: 'javascript:;',
      uMsg: 'https://search.bilibili.com/upuser?keyword=' + addUserName
  	};
    if(addUserArrFunc('isAdd', addUserName)){
      europeanSet.addUser = uniqueArr(uData, europeanSet.addUser, true);
      $('.europeanAddUser input').val('');
      $('.europeanAddUserArr').append('<a href="javascript:void(0);">' + addUserName + '</a>');
    }

  });

  $('.europeanAddUser input').keydown(function(e){
    if(e.which === 13) $('.europeanAddUser a').click();
  });

  $('.europeanAddUserArr').on('click', 'a', function(){
    addUserArrFunc('del', $(this).text());
    $(this).remove();
  });

  $('#europeanStartBtn').click(function(){
    if(europeanSet.start) return false;
    europeanSet.start = true;
    btnCtrl(false, true, true);
    $('.europeanAddUserArr').hide();

    europeanSet.upName = $('.main-content:eq(0) .user-name:eq(0) a.c-pointer').text();
    addUserInArr(europeanSet.addUser);

    europeanSet.userArr.forEach((item, index) => {
      if(item.uAt >= europeanSet.defaultAtNum) {
        europeanSet.userAtArr.push(item);
      }
    });

    if(europeanSet.userAtArr.length === 0) {
      $('#europeanEndBtn').click();
      $('#europeanUserArr .europeanUser').html('<font class="europeanUserMsg">没有符合的用户</font>');
      return false;
    }

    europeanSet.timer = setInterval(function(){
      var user = europeanSet.userAtArr[europeanSet.loopNum];

      resetLoopNum();

      var europeanUserHTML = '<span style="background:transparent url(\'' + user.uFace + '\') no-repeat scroll 0 0 / 30px 30px;"></span><a class="europeanUName" href="javascript:void(0);">' + user.uName + '</a>';
      $('#europeanUserArr .europeanUser').html(europeanUserHTML);
      $('.europeanUserArrLength span').text(europeanSet.userAtArr.length);

      if(europeanSet.userAtArr.length === 1) {
        clearInterval(europeanSet.timer);
      }
    }, 100);
  });

  $('#europeanThisShitBtn').click(function(){
    if(!europeanSet.start || europeanSet.userAtArr.length === 0) return false;
    if(europeanSet.userAtArr.length === 1) {
      var lastUser = europeanSet.userAtArr[0];
      europeanSet.winArr.push(lastUser);
      europeanSet.userAtArr = [];
      $('.europeanUserArrLength span').text('0');
      if($('#europeanUserArr .europeanUser:first').css('top') == '0px') {
        var sTop = $('.europeanWinners').scrollTop();
        $('#europeanUserArr .europeanUser:first').animate({'top':$('.europeanWinners .europeanUser').length * 50 - sTop + 80}, function(){
          $('.europeanWinners').append(makeUserHTML(lastUser));
          $('.europeanWinners .europeanUser:last').css({
            'top': 50 * europeanSet.winnerNum
          });
          europeanSet.winnerNum++;
          $('.europeanWinners').scrollTop(europeanSet.winnerNum * 50);

          $(this).html('').css({'top':0});

          $('#europeanEndBtn').click();

        });
      }
      return false;
    }
    var rand = Math.round(Math.random() * (europeanSet.userAtArr.length - 1));
		var winU = europeanSet.userAtArr[rand];
		europeanSet.winArr.push(winU);
		europeanSet.userArr2 = [];
		$.each(europeanSet.userAtArr, function(k, v) {
			if (v.uName != winU.uName) {
				europeanSet.userArr2.push(v)
			}
		});
		europeanSet.userAtArr = europeanSet.userArr2;
    resetLoopNum();
    $('.europeanWinners').append(makeUserHTML(winU));
    $('.europeanWinners .europeanUser:last').css({
      'top': 50 * europeanSet.winnerNum
    });
    $('.europeanWinners').scrollTop(europeanSet.winnerNum * 50);
    europeanSet.winnerNum++;
  });

  $('#europeanEndBtn').click(function(){
    if(!europeanSet.start) return false;
    europeanSet.start = false;
    europeanSet.userAtArr = [];
    btnCtrl(true, false, false);

    $('.europeanAddUserArr').show();

    $('.europeanUserArrLength span').text('--');
    $('#europeanUserArr .europeanUser').html('');

    makeExcel();

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
  $('.europeanAtSet').css({
    'top': BtoolsBtnTop + 120,
    'left': BtoolsBtnLeft + 5
  });
  $('.europeanAddUser').css({
    'top': BtoolsBtnTop + 170,
    'left': BtoolsBtnLeft + 5
  });
  $('.europeanAddUserArr').css({
    'top': BtoolsBtnTop + 220,
    'left': BtoolsBtnLeft + 5
  });
}

function resetLoopNum()
{
  if(europeanSet.loopNum < europeanSet.userAtArr.length - 1) {
    europeanSet.loopNum++;
  } else {
    europeanSet.loopNum = 0;
  }
}

function autoLoad() {
  var dynamic_id = /t\.bilibili\.com\/(\d+)\??/i.exec(window.location.href)[1];
  $.ajax({
    url: `https://api.vc.bilibili.com/dynamic_repost/v1/dynamic_repost/view_repost`,
    type: 'GET',
    data: {
      dynamic_id: dynamic_id,
      offset: europeanSet.autoLoadOffset
    },
    dataType: 'json',
    success: function(json) {
      if(json && json.code === 0) {

        if(europeanSet.autoLoadOffset === 0) {
          europeanSet.autoLoadMax = json.data.total_count / 20 * 2;
          europeanSet.Alleuropeans = json.data.total_count;
        }

        $('.europeanAutoLoadProgressBar').css({
          'width': (europeanSet.autoLoadNum / europeanSet.autoLoadMax) * 100 + '%'
        });

        var com = json.data.comments;
        if(com.length > 0) {
          json.data.comments.forEach((item, index) => {
            var atNum = 0;
            var atArr = item.ctrl.split('},{');
            if(atArr.length > 0 && atArr[0] !== '[]') {
              atArr.forEach((v, k) => {
                if(/"data":"(\d+)","length":\d+,"location":\d+,"type":\d+/.exec(v).length > 1) {
                  atNum++;
                }
              });
            }

            if(atArr !== null) {
              var at = atArr.length - 1;
            }
            var uData = {
              uID: item.uid,
          		uName: item.uname,
          		uFace: item.face_url,
              uAt: atNum,
          		uSpace: `https://space.bilibili.com/${item.uid}`,
              uMsg: `https://message.bilibili.com/#/whisper/mid${item.uid}`
          	};
            europeanSet.userArr = uniqueArr(uData, europeanSet.userArr, true);
            $('body').append(`<img class="european-read-face" style="width:0" src="${uData.uFace}">`);
          });
        } else {
          return false;
        }

        if(com.length === 20) {
          europeanSet.autoLoadOffset += 20;
        }
      }
    },
    error: function(e) {
      console.log(e);
    }
  });
}

function makeUserHTML(u)
{
  if(u.uSpace === 'javascript:;') {
    var btnText = '搜索TA';
  } else {
    var btnText = '私信TA';
  }
  return '<p class="europeanUser"><span style="background:transparent url(\'' + u.uFace + '\') no-repeat scroll 0 0 / 30px 30px;"></span><a class="europeanUName" href="' + u.uSpace + '" target="_blank">' + u.uName + '</a><a class="europeanUMsg" href="' + u.uMsg + '" target="_blank">' + btnText + '</a></p>';
}

function addUserArrFunc(k, uName)
{
  switch(k){
    case 'isAdd':
      if(europeanSet.addUser.length === 0) return true;
      var isAdd = true;
      $.each(europeanSet.addUser, function(k, v){
        if(v.uName === uName){
          isAdd = false;
          return true;
        }
      });
      return isAdd;
    break;
    case 'del':
      if(europeanSet.addUser.length === 0) return false;
      var addUserArr2 = [];
      $.each(europeanSet.addUser, function(k, v){
        if(v.uName !== uName) addUserArr2.push(v);
      });
      europeanSet.addUser = addUserArr2;
    break;
  }
}

function uniqueArr(val, arr, isObj)
{
  if(arr.length === 0) {
    var un1 = isObj ? val.uName : val;
    if (un1 !== europeanSet.upName) arr.push(val);
  } else {
    var isAdd = true;
    $.each(arr, function(k, v){
      var un1 = isObj ? val.uName : val;
      var un2 = isObj ? v.uName : v;
      if (un1 === un2 || un1 === europeanSet.upName) {
        isAdd = false;
        return false;
      }
    });
    if(isAdd) {
      arr.push(val);
    }
  }
  return arr;
}

function addUserInArr(addUser)
{
  if(addUser.length > 0) {
    $.each(addUser, function(k, v){
      europeanSet.userAtArr = uniqueArr(v, europeanSet.userAtArr, true);
    });
  }
}

function makeExcel()
{
  if(europeanSet.winArr.length === 0) return false;
  var downloadBtn = '<p class="europeanUser"><span style="border-radius:0;" class="europeanExcelIcon"></span><a class="europeanUName" href="javascript:void(0);" target="_blank">中奖名单已保存到Excel表格</a><a id="europeanExcelDownload" class="europeanUMsg" href="javascript:void(0);" target="_blank">下载TA</a></p>';
  var table =
    '<table border="1" cellspacing="0" cellpadding="0">' +
      '<tr class="thead"><th colspan="4"><a href="' + window.location.href + '">' + europeanSet.upName + ' 的抽奖</a></th></tr>' +
      '<tr class="theadTitle"><th>排序</th><th>用户ID</th><th>用户名</th><th>空间链接</th><th>联系</th></tr>';
      $.each(europeanSet.winArr, function(k, v){
        if(v.uID === null) {
          var uID = '无(手动添加)';
          var spaceText = '无(手动添加)';
          var msgText = '点击搜索';
        } else {
          var uID = k.uID;
          var spaceText = '<a href="' + v.uSpace + '">打开空间</a>';
          var msgText = '点击私信';
        }
        table += `<tr class="theadContent"><td>${k+1}</td><td>${uID}</td><td>${v.uName}</td><td>${spaceText}</td><td><a href="${v.uMsg}">${msgText}</a></td></tr>`;
      });

  table += '</table>';
  var html = "<html><head><meta charset='utf-8' /><style>a{text-decoration:none;font-size:20px;font-weight:700;}th,td{text-align:center}.thead th,.thead th a{color:#999;} .theadTitle td{font-weight:700;font-size:26px;color:#666} .theadContent td,.theadContent td a{font-size:20px;color:#666}</style></head><body>" + table + "</body></html>";

  $('#europeanUserArr .europeanUser').html(downloadBtn);

  var blob = new Blob([html], { type: "application/vnd.ms-excel" });
  var a = document.getElementById('europeanExcelDownload');

  a.href = URL.createObjectURL(blob);

  a.download = europeanSet.upName + ' 的抽奖中奖名单.xls';
}

function btnCtrl(start, thisShit, end)
{
  $('#europeanStartBtn').css({
    'background-color': `#${start ? 'ff94b1' : '666'}`
  });
  $('#europeanThisShitBtn').css({
    'background-color': `#${thisShit ? 'ff94b1' : '666'}`
  });
  $('#europeanEndBtn').css({
    'background-color': `#${end ? 'ff94b1' : '666'}`
  });
}
