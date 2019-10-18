# B站API整理

整理一些B站的API，不过毕竟不是专门探索API的，所以肯定不会很全面，这里的API只是Btools用的或者将来可能添加的。

# 格式

### 说明/作用
其他说明
* `请求网址` `GET/POST`
   * `必须参数` [参数作用/说明] [实例值/说明|实例值2/说明2]
   * 可选参数 [参数作用/说明] [实例值/说明|实例值2/说明2]
* 请求示例

# 正式开始

### 评论
* `https://api.bilibili.com/x/v2/reply` `GET`
   * `type` [类型] [1/视频、番剧评论|4/活动页评论|11/动态、相册评论|12/专栏评论]
   * `oid` [AV号] [40905080]
   * pn [页数] [1]
   * ps [每页显示个数] [20]
   * sort [排序方式] [0/按时间排序|2/按热度排序] [2]
* [https://api.bilibili.com/x/v2/reply?pn=1&type=11&oid=11041156](https://api.bilibili.com/x/v2/reply?pn=1&type=1&oid=40905080)
* [https://api.bilibili.com/x/v2/reply?pn=1&type=11&oid=11041156](https://api.bilibili.com/x/v2/reply?pn=1&type=11&oid=11041156)

### 评论楼中楼
* `https://api.bilibili.com/x/v2/reply/reply` `GET`
   * `type` [类型] [1|4|11|12/同上]
   * `oid` [AV号] [40905080]
   * `root` [主楼ID] [1273276036] [这个是获取评论中返回的rpid]
   * pn [页数] [1]
   * ps [每页显示个数] [20]
   * sort [?]
* [https://api.bilibili.com/x/v2/reply/reply?pn=1&type=11&oid=11041156&ps=10&root=1273276036](https://api.bilibili.com/x/v2/reply/reply?pn=1&type=11&oid=11041156&ps=10&root=1273276036)

### 转发信息
* `http://api.vc.bilibili.com/dynamic_repost/v1/dynamic_repost/view_repost` `GET`
   * `dynamic_id` [动态ID] [1] [同上]
   * pn [页数] [1]
   * ps [每页显示个数] [20]
* [http://api.vc.bilibili.com/dynamic_repost/v1/dynamic_repost/view_repost?dynamic_id=227011488571075494](http://api.vc.bilibili.com/dynamic_repost/v1/dynamic_repost/view_repost?dynamic_id=227011488571075494)

### 用户card信息
* https://api.bilibili.com/x/web-interface/card
   * `mid` [用户ID] [2198461]
* https://api.bilibili.com/x/web-interface/card?mid=2198461
