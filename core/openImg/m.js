/*

  openImg 获取封面图

*/
const openImgSet = {
  loopNum: 0,
  loopMax: 10,
  timer: null,
  timerOff: false,
  urlReg: /([^\@]*\.(?:webp|jpg|png|gif))(?:\@|\_).*\.(?:webp|jpg|png|gif)?/,
  bannerImgReg: /url\("((?:http|https):\/\/[^\@]*)(?:\@|\_)(?:.*\.(?:webp|jpg|png|gif))?"\)/,
  watchlaterUrlReg: /(?:http|https):\/\/www\.bilibili\.com\/watchlater\/.*/,
  liveRoomUrlReg: /(?:http|https):\/\/live\.bilibili\.com\/\d+\/.*/
}

openImgSet.timer = setInterval(function(){
  if($('#bofqi').length > 0) {
    var openImgBtnHTML =`
      <div class="BtoolsLogoBtn">
        <a href="javascript:void(0);">${Btools.logo()}</a>
      </div>
    `;
    var bofqiTop = $('#bofqi').offset().top + 22;
    var bofqiLeft = $('#bofqi').offset().left - 40;
    $('body').append(openImgBtnHTML).find('.BtoolsLogoBtn').css({
      'top': bofqiTop,
      'left': bofqiLeft
    });

    if(/[^\.]*\.bilibili\.com\/bangumi\//.test(window.location.href)) {
      $('.BtoolsLogoBtn a').HKM([
        {
          key: 70,
          title: '打开封面',
          action: () => {
            $('body').append('<script id="openImg">window.open(window.__INITIAL_STATE__.epInfo.cover);void(0);</script>').find('#openImg').remove();
          }
        },
        {
          key: 83,
          title: '打开海报',
          action: () => {
            $('body').append('<script id="openPosterImg">window.open(window.__INITIAL_STATE__.mediaInfo.cover);void(0);</script>').find('#openPosterImg').remove();
          }
        }
      ]);
    } else {
      $('.BtoolsLogoBtn a').HKM([
        {
          key: 70,
          title: '打开封面',
          action: () => {
            if(openImgSet.watchlaterUrlReg.test(window.location.href) && $('.bilibili-player-watchlater-item[data-state-play=true] img').length > 0) {
              window.open(openImgSet.urlReg.exec($('.bilibili-player-watchlater-item[data-state-play=true] img').attr('src'))[1]);
              return false;
            }
            $('body').append('<script id="openImg">window.open(window.__INITIAL_STATE__.videoData.pic);void(0);</script>').find('#openImg').remove();
          }
        }
      ]);
    }

    clearInterval(openImgSet.timer);

    // 直播封面获取
  } else if($('#BtoolsLiveHelper').length > 0) {
    $('#BtoolsHideCtrl').HKM([
      {
        key: 70,
        title: '打开封面',
        action: () => {
          $('body').append('<script id="openLiveRoomImg">if(window.__NEPTUNE_IS_MY_WAIFU__.baseInfoRes.data.user_cover !== \'\') window.open(window.__NEPTUNE_IS_MY_WAIFU__.baseInfoRes.data.user_cover);void(0);</script>').find('#openLiveRoomImg').remove();
        }
      }
    ]);

    clearInterval(openImgSet.timer);

    // 文章头图获取
  } else if($('.banner-img-holder').length > 0) {
    var openImgBtnHTML = '<a id="BtoolsOpenBannerImg" href="javascript:void(0);">获取头图</a>';

    var btnTop = $('.banner-img-holder').offset().top + 10;
    var btnLeft = $('.banner-img-holder').offset().left + $('.banner-img-holder').width() - 50;

    $('body').append(openImgBtnHTML).find('#BtoolsOpenBannerImg').css({
      'top': btnTop,
      'left': btnLeft
    });
    $('#BtoolsOpenBannerImg').click(function(){
      window.open(openImgSet.bannerImgReg.exec($('.banner-img-holder').css('background-image'))[1]);
    });

    clearInterval(openImgSet.timer);
  }
}, 200);
