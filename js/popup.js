chrome = chrome || browser;

var ChannelConfig = {
  // 订阅的channelID
  channelShow: {},
  // 订阅中的信息 date：最后查询的日期时间戳 aids：已存在的视频AV号
  channelChecked: {}
}

channelListInit();

function channelListInit() {

  getLocalConfig(function() {

    var html = '';

    // 循环 up 主
    $.each(ChannelConfig.channelShow, function(uid, item) {

      html += '<div class="channelChecked">';

      var isAddUpName = true;

      // 循环频道信息
      $.each(item, function(cid, channelItem) {

        // upName 只添加一次
        if(isAddUpName) {
          console.log(channelItem.upName);
          html += '<p class="upName">' + channelItem.upName + '</p>';
          isAddUpName = false;
        }

        html += '<div class="content">';

        html += '<p class="channelName"><a href="https://space.bilibili.com/' + uid + '/channel/detail?cid=' + cid + '" target="_blank">' + channelItem.name + '</a></p>';

        html += '<ul>';

        if(channelItem.unread.length === 0) {

          html += '<p>无</p>';

        } else {

          channelItem.unread.forEach(function(unreadItem, unreadIndex) {

            var title = unreadItem.title.length > 6 ? unreadItem.title.substr(0, 10) + '...' : unreadItem.title;

            html += '<li style="background-image: url(' + unreadItem.pic + ')"><a href="https://b23.tv/av' + unreadItem.aid + '" target="_blank" class="videoLink" data-uid="' + uid + '" data-cid="' + cid + '" data-index="' + unreadIndex + '"></a><span class="clean">清除</span><p>' + title + '</p></li>';

          });

        }


        html += '</ul></div>';

      });

      html += '</div>';

    });

    $('body').html(html);

  });


}

$('body').on('click', '.videoLink', function() {

  var uid = $(this).attr('data-uid');
  var cid = $(this).attr('data-cid');
  var index = $(this).attr('data-index');

  getLocalConfig(function() {

    deleteItem(uid, cid, index);

  });
});

$('body').on('click', '.clean', function() {

  var uid = $(this).prev().attr('data-uid');
  var cid = $(this).prev().attr('data-cid');
  var index = $(this).prev().attr('data-index');

  deleteItem(uid, cid, index);

});

function deleteItem(uid, cid, index) {

  ChannelConfig.channelShow[uid][cid].unread.splice(index, 1);

  saveLocalConfig();
  channelListInit();
}

function getLocalConfig(callback) {
  chrome.storage.sync.get(ChannelConfig, function(items){
    ChannelConfig = items;
    if(typeof callback === 'function') callback();
  });
}

function saveLocalConfig() {
  chrome.storage.sync.set(ChannelConfig, function() {

  })
}
