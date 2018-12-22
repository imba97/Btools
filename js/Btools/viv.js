/*

  viv 失效视频显示工具

*/

const VivSet = {
  init: true,
  isReset: true,
  reLoadNum: 0,
  reLoadMax: 5
}

VivReset();

function VivReset(){
  if(VivSet.isReset) {
    if($('li.small-item').length === 0) {
      setTimeout("VivReset()", 100);
    } else {
      VivSet.isReset = false;
      VivInit();
      $('.be-pager li a,.fav-list li a').on('click', function() {
        VivReload();
      });
    }
  }
}

function VivReload() {
  if(VivSet.reLoadNum < VivSet.reLoadMax) {
    setTimeout("VivReload()", 100);
  }
  VivInit();
}

function VivInit() {

  $('li.disabled').each(function() {
    if ($(this).find('a.disabled').length > 0) {
      var keyword = $(this).find('a.disabled img').attr('alt');
      $(this).find('a.title').html('<span style=\'color:#F66\'>' + keyword + '</span>');
      $(this).find('a').each(function() {
        if ($(this).attr('href') == 'javascript:;') {
          $(this).attr({
            'href': 'https://www.baidu.com/s?ie=utf-8&wd=' + keyword,
            'target': '_blank'
          })
        }
      });
      $(this).find('.disabled-cover').remove();
      $(this).find('a.disabled').attr('class', '').find('.length').remove()
    }
  });
}
