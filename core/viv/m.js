/*

  viv 失效视频显示工具

*/
const VivSet = {
  init: true,
  loopNum: 0,
  loopMax: 10,
  timer: null,
  timerOff: false,
  eqNum: 0,
  fidRex: /\/\d+\/favlist\?fid=(\d+)/i,
  fav: null,
  count: 0,
  pn: 1,
  isKey: false
}

$(document).ready(function(){
  $('body').on('click', '.be-pager li.be-pager-item', function(){
    VivSet.fav = null;
    VivInitLoopStart();
  });
  // 头部 收藏夹 按钮
  $('body').on('click', '.n-tab-links a.n-favlist', function(){
    VivInitLoopStart();
  });
  $('body').on('click', '.fav-item a.text', function(){
    VivSet.fav = null;
    VivInitLoopStart();
  });
  // 批量操作 等 按钮
  $('body').on('click', 'div.fav-filters,div.video-check-container,div.fav-action-fixtop', function(){
    VivInitLoopStart();
  });

  // 移动、复制按钮
  $('body').on('click', '.be-dropdown .be-dropdown-menu li', function() {
    VivInitLoopStart();
  });

  $('body').on('click', '.fav-filters .be-dropdown-menu:eq(1) .be-dropdown-item', function(){
    VivSet.fav = null;
    VivInitLoopStart();
  });

  // 上一页 下一页
  $('body').on('click', 'li.be-pager-prev,.be-pager-next', function(){
    VivSet.fav = null;
    VivInitLoopStart();
  });
  // 收藏夹链接
  $(document).on('click', '#page-index .fav .fav-item a', function() {
    VivSet.fav = null;
    enterKey();
    VivInitLoopStart();
  });
  $('body').on('click', 'input.be-switch-input', function() {
    VivInitLoopStart();
  });
  $('body').on('click', '.btn-container .default', function() {
    VivInitLoopStart();
  });

  $('body').on('click', '.modal-header-close,.icon-close', function() {
    VivInitLoopStart();
  });

  // 拖拽排序
  $('body').on('mouseup mousedown', '.fav-list .icon-cursor', function() {
    VivInitLoopStart();
  });

  window.onpopstate = function(event) {
    VivSet.fav = null;
    VivInitLoopStart();
  };

  // 键盘回车翻页
  enterKey();
});

function VivInitLoopStart() {
  VivSet.eqNum = 0;
  VivSet.loopNum = 0;
  if(VivSet.timerOff) {
    VivInitLoop();
  }
}

VivInitLoop();

function VivInitLoop()
{
  VivSet.timerOff = false;
  VivSet.timer = setInterval(function() {
    // console.log(VivSet.loopNum);
    VivInit();
    VivSet.loopNum++;
  }, 500);
}

function VivInit() {
  if(VivSet.fav === null) favJson();
  if($('.fav-video-list li.small-item').length > 0) {
    $('.fav-video-list li.small-item').each(function(index) {
      var upNameText = $(this).find('.meta-mask .meta-info .author').text();
      var upName = upNameText.substring(4,upNameText.length);
      var coverReg = /([^\@]*\.(?:webp|jpg|png|gif))(?:\@|\_).*\.(?:webp|jpg|png|gif)?/;
      $(this).find('a').HKM([
        {
          'key': 67,
          'title': '打开封面',
          'action': () => {
            window.open(coverReg.exec($(this).find('a:eq(0) img:eq(0)').attr('src'))[1]);
            void(0);
          }
        },
        {
          'key': 85,
          'title': '搜索UP主',
          'action': () => {
            window.open(`https://search.bilibili.com/upuser?keyword=${upName}`);
            void(0);
          }
        },
        {
          'key': 79,
          'title': '详情信息',
          'position': 'last',
          'action': () => {
            media_info(index);
          }
        }
      ]);

      if($(this).attr('class').indexOf('disabled') === -1) {
        var url = $(this).find('a.cover').attr('href');
        $(this).find('a').HKM([
          {
            'key': 86,
            'title': '打开视频',
            'position': 'first',
            'action': () => {
              window.open(url);
              void(0);
            }
          }
        ]);
      } else {
        var keyword = $(this).find('a:eq(0) img:eq(0)').attr('alt');
        $(this).find('a.title').html('<span class=\'Btools-viv-video-name\'>' + keyword + '</span>');

        $(this).find('a').HKM([
          {
            'key': 83,
            'title': '搜索视频',
            'position': 'first',
            'action': () => {
              window.open(`https://www.baidu.com/s?ie=utf-8&wd=${keyword}`);
              void(0);
            }
          }
        ]);
      }

    });
  }
  if(VivSet.loopNum >= VivSet.loopMax) {
    VivSet.timerOff = true;
    VivSet.loopNum = 0;
    VivSet.eqNum = 0;
    clearInterval(VivSet.timer);
  }
}

function favJson(pn) {
  var fid = $('.fav-item[class~=cur]').attr('fid');
  if(fid === null) return false;

  if(!VivSet.isKey) VivSet.pn = Number($('.be-pager-item-active').text()); else VivSet.isKey = false;

  if(fid !== null) {
    $.getJSON(`http://api.bilibili.com/medialist/gateway/base/spaceDetail`, {
      media_id: fid,
      pn: VivSet.pn,
      ps: 20,
      order: 'mtime'
    }, function(json){
      if(json) {
        VivSet.fav = json.data.medias;
        console.log(json.data);
        VivSet.count = json.data.info.media_count;
        console.log(VivSet.count);
      }
    });
  }
}

function media_info(mid) {
  console.log(VivSet.fav[mid]);
  var html = `
    <div id="vivWindow"></div>
  `;
}

var html = `
  <div id="vivWindow">
    <p class="vivMediaInfoTitle">视频名称</p>
    <div class="vivP">
      <p>分P 1P</p>
      <p>分P 2P</p>
    </div>
  </div>
`;
$('body').append(html);

function enterKey() {
  $(document).on('keydown', '.be-pager .be-pager-options-elevator input', function(e) {
    if(e.which === 13) {
      VivSet.fav = null;

      var max_pn = Math.ceil(VivSet.count / 20);
      VivSet.pn = Number($(this).val());
      if(VivSet.pn <= max_pn) {
        VivSet.pn = $(this).val();
      } else {
        VivSet.pn = max_pn;
      }

      VivSet.isKey = true;

      VivInitLoopStart();
    }
  });
}
