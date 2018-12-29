/*

  openImg 获取封面图

*/
const openImgSet = {
  loopNum: 0,
  loopMax: 10,
  timer: null,
  timerOff: false
}

openImgSet.timer = setInterval(function(){
  if($('#bofqi').length > 0) {
    var openImgBtnHTML =
      '<div class="BtoolsLogoBtn">' +
        '<a href="javascript:;"></a>' +
      '</div>' +
      '<div class="BtoolsBtnAll">' +
        '<a id="BtoolsOpenImg" watchlater="true" href="javascript:;">获取封面</a>' +
      '</div>';
    var bofqiTop = $('#bofqi').offset().top + 22;
    var bofqiLeft = $('#bofqi').offset().left - 40;
    $('body').append(openImgBtnHTML).find('.BtoolsLogoBtn').css({
      'top': bofqiTop,
      'left': bofqiLeft
    });
    $('.BtoolsBtnAll').css({
      'top': bofqiTop + 40,
      'left': bofqiLeft - 3
    });

    $('#BtoolsOpenImg[watchlater=true]').click(function(){
      if($('.bilibili-player-watchlater-item[data-state-play=true] img').length > 0) {
        var reg = /(.*)\@(?:[0-9a-z_].webp)?/;
        window.open(reg.exec($('.bilibili-player-watchlater-item[data-state-play=true] img').attr('src'))[1]);
      } else {
        $('#BtoolsOpenImg').attr({
          'watchlater': 'false',
          'href': 'javascript:window.open(/(https|http):\\/\\/www\\.bilibili\\.com\\/bangumi\/ig.test(window.location.href)?window.__INITIAL_STATE__.mediaInfo.cover:window.__INITIAL_STATE__.videoData.pic);'
        }).unbind('click').click();
      }
    });


    clearInterval(openImgSet.timer);
  }
}, 200);
