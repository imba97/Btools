var defaultConfig = {
  PKPoint: true
};

document.addEventListener('DOMContentLoaded', function() {
  showSet();
});

function showSet()
{
  chrome.storage.sync.get(defaultConfig, function(items) {
    // PKPoint
		if(items.PKPoint) {
      var PKPointText = '显示';
    } else {
      var PKPointText = '隐藏';
    }
    defaultConfig.PKPoint = items.PKPoint;
    $('#BtoolsLiveHelperPKPointHide span').text(PKPointText);
	});
}

// $(document).on('click', '#BtoolsSet p a', function(){
//
// });
$('#BtoolsSet p a').click(function(){

  switch($(this).attr('id'))
  {
    case 'BtoolsLiveHelperPKPointHide':
      if(defaultConfig.PKPoint)
        defaultConfig.PKPoint = false;
      else
        defaultConfig.PKPoint = true;
    break;
  }

  chrome.storage.sync.set(defaultConfig, function() {
    // 注意新版的options页面alert不生效！
    // alert('保存成功！');
    showSet();
  });
});
