chrome = chrome || browser;

var defaultSet = {
  liveHelperPKPoint: 0,
  liveHelperMiniPlayer: 0,
  vivFind: 0,
  channelUpdateTime: 3600
};

var setText = {
  liveHelperPKPoint: ['显示', '隐藏'],
  liveHelperMiniPlayer: ['显示', '隐藏'],
  vivFind: ['开启', '关闭'],
  channelUpdateTime: ['每10分钟', '每30分钟', '每小时', '自定义 { number:3600[min=60] }']
}

document.addEventListener('DOMContentLoaded', function() {
  showSet();
});

function showSet()
{
  chrome.storage.sync.get(defaultSet, function(items) {
    defaultSet = items;
    // $('.whatTheFuck').text(defaultSet.playerShow);
    $.each(items, function(k, v){
      if(setText[k] !== undefined) {
        console.log(k);
        $('#'+k+' span').html(setText[k][v]);
      }
    });
	});
}

var isCtrl = false;
$(document).keydown(function(e) {
  isCtrl = e.keyCode === 17 ? true : false;
});

$('#BtoolsSet p a').click(function() {

  var setID = $(this).attr('id');
  var max = Number($(this).attr('data-max'));

  if(defaultSet[setID] < max) ++defaultSet[setID];
  else defaultSet[setID] = 0;

  chrome.storage.sync.set(defaultSet, function() {
    // 注意新版的options页面alert不生效！
    // alert('保存成功！');
    showSet();
  });
});

$('#BtoolsBtn #clearVivCache').click(function() {
  var BtoolsConfig = {
    vivlocalCache: {}
  };
  chrome.storage.sync.set(BtoolsConfig, function() {
    $('#BtoolsBtn #clearVivCache').text('清空失效视频本地存储 (删除成功)');
    setTimeout(function() {
      $('#BtoolsBtn #clearVivCache').text('清空失效视频本地存储');
    }, 1000);
  });
});
