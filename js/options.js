chrome = chrome || browser;

var defaultSet = {
  PKPoint: 0,
  miniPlayerShow: 0,
  playerShow: 0,
  vivFind: 0
};

var setText = {
  PKPoint: ['显示', '隐藏'],
  miniPlayerShow: ['显示', '隐藏'],
  vivFind: ['开启', '关闭']
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
        $('#'+k+' span').text(setText[k][v]);
      }
    });
	});
}

$('#BtoolsSet p a').click(function(){

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
    localCache: {}
  };
  chrome.storage.sync.set(BtoolsConfig, function() {
    $('#BtoolsBtn #clearVivCache').text('清空失效视频本地存储 (删除成功)');
    setTimeout(function() {
      $('#BtoolsBtn #clearVivCache').text('清空失效视频本地存储');
    }, 1000);
  });
});
