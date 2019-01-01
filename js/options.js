var defaultSet = {
  PKPoint: 0,
  miniPlayerShow: 0,
  playerShow: 0
};

var setText = {
  PKPoint: ['显示', '隐藏'],
  miniPlayerShow: ['显示', '隐藏'],
  playerShow: ['关闭盲人模式', '盲人模式']
}

document.addEventListener('DOMContentLoaded', function() {
  showSet();
});

function showSet()
{
  chrome.storage.sync.get(defaultSet, function(items) {
    defaultSet = items;
    $('.whatTheFuck').text(defaultSet.playerShow);
    $.each(items, function(k, v){
      $('#'+k+' span').text(setText[k][v]);
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
