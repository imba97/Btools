const getUrlSet = {
  loopNum: 0,
  loopMax: 10,
  timer: null,
  timerOff: false
}

getUrlInit();
function getUrlInit()
{
  getUrlSet.timer = setInterval(function(){
    if($('.page-container .nav-tab-bar').length > 0)
    {
      var BtoolsBtnHTML =`<a id="BtoolsBtn" href="javascript:;" target="_self" class="tab-item">${BtoolsSet.logo}<span>Btools</span></a>`;

      var BtoolsAllBtnHTML =
        '<div id="BtoolsAllBtn">' +
          '<p><a id="BtoolsGetUrlBtn" href="javascript:;" target="_self"><span>获取</span>文章内的超链接</a></p>' +
        '</div>';
      $('.page-container .nav-tab-bar').append(BtoolsBtnHTML);
      var BtnTop = $('#BtoolsBtn').offset().top + 50;
      var BtnLeft = $('#BtoolsBtn').offset().left - 70;
      $('body').append(BtoolsAllBtnHTML).find('#BtoolsAllBtn').css({
        'top': BtnTop,
        'left': BtnLeft
      });
      $('#BtoolsBtn').click(function(){
        if($('#BtoolsAllBtn').is(':hidden')) {
          $('#BtoolsAllBtn').show().css({
            'opacity': 0,
            'top': BtnTop - 10
          }).animate({
            'opacity': 1,
            'top': BtnTop
          });
        } else {
          $('#BtoolsAllBtn').animate({
            'opacity': 0,
            'top': BtnTop - 10
          }, function(){
            $(this).hide();
          });
        }

      });
      $('#BtoolsGetUrlBtn').click(function(){
        if($('#BtoolsGetUrlWindow').length > 0) {
          if($('#BtoolsGetUrlWindow').is(':hidden')) {
            $('#BtoolsGetUrlBtn span').text('隐藏');
            $('#BtoolsGetUrlWindow').fadeIn();
          } else {
            $('#BtoolsGetUrlBtn span').text('显示');
            $('#BtoolsGetUrlWindow').fadeOut();
          }
        } else {
          $('#BtoolsGetUrlBtn span').text('隐藏');
          var I_getUrl = {
            imba97_url_arr: [],
            imba97_num: 0
          };
          var c_html = '<div id=\'BtoolsGetUrlWindow\'>';
          var regexp = /((?:http|https):\/\/([\w\-]+\.)+[\w\-]+([\/|\?][\w\u4e00-\u9fa5\-\.\/?\@\%\!\&=\+\~\:\#\;\,]*)?)/ig;
          $('.article-holder p').each(function() {
          	var html = $(this).text();
          	var url = html.match(regexp);
          	for (val in url) {
          		var newUrl = url[val].toString();
          		I_getUrl.imba97_url_arr[I_getUrl.imba97_num] = newUrl;
          		I_getUrl.imba97_num++;
          	}
          });
          if(I_getUrl.imba97_url_arr.length === 0) {
            $('#BtoolsGetUrlBtn').text('本文无链接').attr('id','');
          }
          $.uniqueSort(I_getUrl.imba97_url_arr);
          for (val2 in I_getUrl.imba97_url_arr) {
          	c_html += '<p class=\'I_getUrl\'><a target=\'_blank\' href=\'' + I_getUrl.imba97_url_arr[val2] + '\'>打开</a>' + I_getUrl.imba97_url_arr[val2] + '</p>'
          };
          c_html += '</div>';
          $('body').append(c_html);
          var animate_n = 0;
          $('.I_getUrl').each(function() {
          	$(this).show().delay(animate_n * 100).css({
          		'top': animate_n * 40
          	}).animate({
          		'top': animate_n * 40 + 50,
          		'opacity': 1
          	}, 500);
          	animate_n++;
          });
        }
      });
      clearInterval(getUrlSet.timer);
    }
  }, 200);
}
