var PKPoint;

document.addEventListener('DOMContentLoaded', function() {
  showSet();
});

function showSet()
{
  chrome.storage.sync.get({PKPoint: true}, function(items) {
    // PKPoint
		if(items.PKPoint) {
      var PKPointText = '显示';
    } else {
      var PKPointText = '隐藏';
    }
    PKPoint = items.PKPoint;
    $('#BtoolsLiveHelperPKPointHide span').text(PKPointText);
	});
}

$('#BtoolsSet p a').click(function(){

  switch($(this).attr('id'))
  {
    case 'BtoolsLiveHelperPKPointHide':
      PKPoint = !PKPoint;
    break;
  }

  chrome.storage.sync.set({PKPoint: PKPoint}, function() {
    // 注意新版的options页面alert不生效！
    // alert('保存成功！');
    showSet();
  });
});
