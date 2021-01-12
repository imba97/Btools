chrome = chrome || browser;

var defaultSet = {
  liveHelperPKPoint: 0,
  liveHelperMiniPlayer: 0,
  vivFind: 0,
  channelUpdateTime: 666,
  f__kSpace: 0
};

var setText = {
  liveHelperPKPoint: ['显示', '隐藏'],
  liveHelperMiniPlayer: ['显示', '隐藏'],
  vivFind: ['开启', '关闭'],
  channelUpdateTime: {
    600: '每10分钟',
    1800: '每30分钟',
    3600: '每小时',
    0: '自定义 { number:3600["min":300,"max":10800] } 秒'
  },
  f__kSpace: ['不F**k', 'F**k']
}

var tips = {

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

      if(typeof setText[k] !== 'undefined') {

        if(typeof setText[k][v] === 'undefined') {
          var tempVal = v;
          v = 0;
        }

        var tip = $('#' + k + ' label');
        if(tip.length > 0 && tip.text() !== '?') {
          tips[k] = tip.text();
          tip.text('?').addClass('tips').on('mouseover', function() {
            $('.tips-box').text(tips[k]).css({
              top: $(this).offset().top - 50
            }).show();
          }).on('mouseout', function() {
            $('.tips-box').hide();
          })
        }

        var regCode = /\{\s?([^\:]*)\:([^\[\]]*)\[(.*?)\]\s?\}/;
        var code = regCode.exec(setText[k][v]);

        if(code !== null && code[1] !== '' && code[2] !== '' && code[3] !== '') {

          var html = '<input data-id="' + k + '" data-type="' + code[1] + '" value="' + (tempVal || code[2]) + '" >';
          var setTextValue = setText[k][v].replace(regCode, html);
          var condition = JSON.parse('{' + code[3] + '}');

          $('#'+k+' span').html(setTextValue);

          var dom = $('input[data-id='+k+']');

          // 循环添加监听事件
          $.each(condition, function(index, item) {

            if(dom.attr('listener-'+index) !== undefined) return true;

            dom.attr('listener-'+index, item);

            /*
            switch (index) {
              case 'min':
                dom.on('blur', function() {
                  if(parseInt($(this).val()) < item) {
                    $(this).val(item);
                  }
                });
              break;
              case 'max':
                dom.on('blur', function() {
                  if(parseInt($(this).val()) > item) {
                    $(this).val(item);
                  }
                });
              break;
            }
            */

          });

          dom.click(function(e) {
            e.stopPropagation();
          });

          dom.on('blur', function() {

            var min = parseInt($(this).attr('listener-min'));
            var max = parseInt($(this).attr('listener-max'));
            var val = parseInt($(this).val());

            if(typeof min !== 'undefined') {
              if(val < min) {
                val = min;
              }
            }
            if(typeof max !== 'undefined') {
              if(val > max) {
                val = max;
              }
            }

            $(this).val(val);
            defaultSet.channelUpdateTime = val;
            saveLocalConfig(defaultSet);

          });

        } else {

          $('#'+k+' span').html(setText[k][v]);

        }


      }

    });
	});
}

var isCtrl = false;
$(document).keydown(function(e) {
  isCtrl = e.keyCode === 17 ? true : false;
});

$('body').on('keyup', 'input', function() {

  var id = $(this).attr('data-id');
  var type = $(this).attr('data-type');


  switch (type) {
    case 'number':
      var value = $(this).val();
      $(this).val(value.replace(/[^\d]/g, ''));
    break;
  }

  console.log(233);
});

$('#BtoolsSet p a').click(function() {

  var setID = $(this).attr('id');

  if(Array.isArray(setText[setID])) {
    var max = setText[setID].length - 1;
    if(defaultSet[setID] < max) ++defaultSet[setID];
    else defaultSet[setID] = 0;
  } else {
    // 获取对象的key的数组
    var index = Object.getOwnPropertyNames(setText[setID]);
    var max = index.length - 1;
    // 设置的值，转成字符串，用于indexOf
    var val = defaultSet[setID].toString();
    // 此值在设置中的位置
    var current = $.inArray(val, index);

    console.log(current);

    if(current < max) {
      var plus = current === -1 ? 1 : 0;
      defaultSet[setID] = parseInt(index[current + 1 + plus]);
    } else {
      defaultSet[setID] = parseInt(index[0]);
    }

  }


  chrome.storage.sync.set(defaultSet, function() {
    // 注意新版的options页面alert不生效！
    // alert('保存成功！');
    showSet();
  });
});

$('#BtoolsBtn #clearVivCache').click(function() {
  var BtoolsConfig = {
    vivLocalCache: {}
  };
  chrome.storage.sync.set(BtoolsConfig, function() {
    $('#BtoolsBtn #clearVivCache').text('清空失效视频本地存储 (删除成功)');
    setTimeout(function() {
      $('#BtoolsBtn #clearVivCache').text('清空失效视频本地存储');
    }, 1000);
  });
});

function saveLocalConfig(config) {
  chrome.storage.sync.set(config);
}
