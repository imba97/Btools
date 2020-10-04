/*

  openImg 获取封面图

*/
var openImgSet = {
  loopNum: 0,
  loopMax: 10,
  timer: null,
  timerOff: false,
  isReadImg: true,
  urlReg: /([^\@]*\.(?:webp|jpg|jpeg|png|gif))(?:\@|\_)?.*\.?(?:webp|jpg|jpeg|png|gif)?/,
  bannerImgReg: /url\("((?:http|https):\/\/[^\@]*)(?:\@|\_)(?:.*\.(?:webp|jpg|png|gif))?"\)/,
  watchlaterUrlReg: /(?:http|https):\/\/www\.bilibili\.com\/watchlater\/.*/,
  readUrlReg: /(?:http|https):\/\/www\.bilibili\.com\/read\/.*/,
  liveRoomUrlReg: /(?:http|https):\/\/live\.bilibili\.com\/\d+\/.*/,
}

openImgSet.timer = setInterval(function () {
  if ($('.bilibili-player').length > 0) {
    var openImgBtnHTML =
      '<div class="BtoolsLogoBtn"><a href="javascript:void(0);">' +
      Btools.logo() +
      '</a></div>'
    var bofqiTop = $('.bilibili-player').offset().top + 22
    var bofqiLeft = $('.bilibili-player').offset().left - 40
    $('body').append(openImgBtnHTML).find('.BtoolsLogoBtn').css({
      top: bofqiTop,
      left: bofqiLeft,
    })

    if (/[^\.]*\.bilibili\.com\/bangumi\//.test(window.location.href)) {
      $('.BtoolsLogoBtn a').HKM([
        {
          key: 70,
          title: '打开封面',
          action: function () {
            $('body')
              .append(
                '<script id="openImg">window.open(window.__INITIAL_STATE__.epInfo.cover);void(0);</script>'
              )
              .find('#openImg')
              .remove()
          },
        },
        {
          key: 83,
          title: '打开海报',
          action: function () {
            $('body')
              .append(
                '<script id="openPosterImg">window.open(window.__INITIAL_STATE__.mediaInfo.cover);void(0);</script>'
              )
              .find('#openPosterImg')
              .remove()
          },
        },
      ])
    } else {
      $('.BtoolsLogoBtn a').HKM([
        {
          key: 70,
          title: '打开封面',
          action: function () {
            if (
              openImgSet.watchlaterUrlReg.test(window.location.href) &&
              $('.bilibili-player-watchlater-item[data-state-play=true] img')
                .length > 0
            ) {
              window.open(
                openImgSet.urlReg.exec(
                  $(
                    '.bilibili-player-watchlater-item[data-state-play=true] img'
                  ).attr('src')
                )[1]
              )
              return false
            }
            $('body')
              .append(
                '<script id="openImg">window.open(window.__INITIAL_STATE__.videoData.pic);void(0);</script>'
              )
              .find('#openImg')
              .remove()
          },
        },
      ])
    }

    $(window).resize(function () {
      var bofqiTop = $('.bilibili-player').offset().top + 22
      var bofqiLeft = $('.bilibili-player').offset().left - 40
      $('.BtoolsLogoBtn').css({
        top: bofqiTop,
        left: bofqiLeft,
      })
    })

    clearInterval(openImgSet.timer)

    // 直播封面获取
  } else if ($('#BtoolsLiveHelper').length > 0) {
    $('#BtoolsHideCtrl').HKM([
      {
        key: 70,
        title: '打开封面',
        action: function () {
          $('body')
            .append(
              '<script id="openLiveRoomImg">if(window.__NEPTUNE_IS_MY_WAIFU__.baseInfoRes.data.user_cover !== \'\') window.open(window.__NEPTUNE_IS_MY_WAIFU__.baseInfoRes.data.user_cover);void(0);</script>'
            )
            .find('#openLiveRoomImg')
            .remove()
        },
      },
    ])

    clearInterval(openImgSet.timer)

    // 文章头图获取
  } else if (openImgSet.readUrlReg.test(window.location.href)) {
    if (openImgSet.isReadImg && $('.banner-img-holder').length > 0) {
      var openImgBtnHTML =
        '<a id="BtoolsOpenBannerImg" href="javascript:void(0);">获取头图</a>'

      var btnTop = $('.banner-img-holder').offset().top + 10
      var btnLeft =
        $('.banner-img-holder').offset().left +
        $('.banner-img-holder').width() -
        50

      $('body').append(openImgBtnHTML).find('#BtoolsOpenBannerImg').css({
        top: btnTop,
        left: btnLeft,
      })
      $('#BtoolsOpenBannerImg').click(function () {
        window.open(
          openImgSet.bannerImgReg.exec(
            $('.banner-img-holder').css('background-image')
          )[1]
        )
      })

      openImgSet.isReadImg = false
    }

    $('body').on('mouseover', '.img-box img', function () {
      if ($(this).attr('isOpenImg') !== 'true') {
        var imageReg = openImgSet.urlReg.exec($(this).attr('data-src'))
        if (imageReg !== null) {
          $(this).HKM([
            {
              key: 67,
              title: '查看原图',
              action: function () {
                if ($('#BtoolsImageView').length > 0) {
                  $('#BtoolsImageView').remove()
                }
                var imageViewHTML =
                  '<div id="BtoolsImageView">' +
                  '<img src="' +
                  imageReg[1] +
                  '">' +
                  '</div>' +
                  '<div class="BtoolsImageViewBg"></div>'
                $('body').append(imageViewHTML)
                var imageTimerNum = 0
                var imageTimer = setInterval(function () {
                  var imageViewHeight = $('#BtoolsImageView').outerHeight()
                  var imageViewWidth = $('#BtoolsImageView').outerWidth()
                  var imageHeight = $('#BtoolsImageView img').outerHeight()
                  var imageWidth = $('#BtoolsImageView img').outerWidth()
                  if (imageHeight !== 0 && imageWidth !== 0) {
                    var imageTop =
                      imageHeight < imageViewHeight
                        ? imageViewHeight / 2 - imageHeight / 2
                        : 0
                    var imageLeft =
                      imageWidth < imageViewWidth
                        ? imageViewWidth / 2 - imageWidth / 2
                        : 0
                    $('#BtoolsImageView img').css({
                      top: imageTop,
                      left: imageLeft,
                      opacity: 1,
                    })
                    clearInterval(imageTimer)
                  }
                  if (imageTimerNum > 20) {
                    imageTimerNum = 0
                    clearInterval(imageTimer)
                  } else {
                    imageTimerNum++
                  }
                }, 100)

                $('#BtoolsImageView').click(function () {
                  $('#BtoolsImageView,.BtoolsImageViewBg').remove()
                })
              },
            },
            {
              key: 86,
              title: '新窗口打开原图',
              action: function () {
                window.open(imageReg[1])
              },
            },
          ])

          $(this).attr('isOpenImg', 'true')
        }
      }
    })

    // $('body').on('click', '.img-box', function() {
    //   var src = $(this).find('img').attr('src');
    //   var findSrc = src !== undefined ? openImgSet.urlReg.exec(src)[1] : '' ;
    //   $(this).HKM([
    //     {
    //       key: 86,
    //       title: '打开大图',
    //       action: function() {
    //         window.open(findSrc);
    //       }
    //     }
    //   ]);
    // });

    openImgSet.loopNum++

    if (openImgSet.loopNum > openImgSet.loopMax) {
      clearInterval(openImgSet.timer)
    }
  }
}, 200)
