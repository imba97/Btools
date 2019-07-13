# Btools

[![LICENSE](https://img.shields.io/github/license/imba97/Btools.svg)](https://github.com/imba97/Btools/blob/master/LICENSE)
[![chrome-web-store](https://img.shields.io/chrome-web-store/users/codgofkgobbmgglciccjabipdlgefnch.svg)](https://chrome.google.com/webstore/detail/btools/codgofkgobbmgglciccjabipdlgefnch)
[![Mozilla Add-on](https://img.shields.io/amo/users/Btools.svg)](https://addons.mozilla.org/zh-CN/firefox/addon/btools)
[![github-releases](https://img.shields.io/github/downloads/imba97/Btools/total.svg)](https://github.com/imba97/Btools/releases)
[![website](https://img.shields.io/website-up-down-green-red/https/shields.io.svg?label=website)](http://btools.cc)


#### 首先感谢：[【干货】Chrome插件(扩展)开发全攻略](https://www.cnblogs.com/liuxianan/p/chrome-plugin-develop.html)
#### 这个教程给了我很大帮助
#### （下次更新会把这个移动到页尾的感谢内）

## 前言
如果你想参观代码，请先看这里。
代码是纯jQuery项目，没其他框架，没用其他工具，目录结构、文件名、函数名我记几个儿随便瞎起的，所以观赏性极差，劝你做好心理准备。

## 介绍
Btools(逼砣)，本插件主要目的是以B站为主的网站页面优化，增强用户体验，有方便快捷的功能。

## 功能介绍

### 增强评论功能

#### `增强评论功能 > 历史表情`
保存最近发出的5个表情，下次发不用再点击“表情”按钮去翻页选择。
#### `增强评论功能 > 评论搜索`
在UP主名称和评论中搜索指定关键字
#### `增强评论功能 > 自定义颜文字`
当切换到颜文字界面，会出现输入框，输入自定义的表情或文字按回车即可添加

### 增强B站收藏夹
原“查看失效视频”功能，B站更新了收藏夹，页面数据中及后台请求数据中删除了视频封面和标题，因此原功能失效。改为增强B站收藏夹，你依然可以用这个功能查看失效视频的简介、分P名以及UP主，可能会帮你想起这个失效视频。没失效的视频则可以快速的打开封面、打开UP主空间、跳转哔哩哔哩唧唧。

### 直播助手

##### `直播助手 > 隐藏显示PK分数`
顾名思义，因为有时候PK分数窗口会挡住视频的精♂彩内容。

##### `直播助手 > 隐藏迷你播放器`
顾名思义×2，有时候迷你播放器有点烦。

##### `直播助手 > 自动关闭提示窗`
1秒后自动关闭领取提督上任奖励的弹出窗口，其他窗口暂时没测试，按说通用。

### 转发抽奖
至于为什么要做这个，如果想用B站的转发抽奖，首先你得是1万粉丝以上的认证用户。这个的话可以让所有人都能用，虽然功能方面不如官方的（目前完善的距离官方还差两步，一是Btools不能判断转发者是否关注了你，二是不支持人数太多，500以上可能加载的时候会出问题，大概吧）

### 获取专题文章中的URL
发布专栏文章时如果作者选了禁止转载，文章内的文字是不能被选中的，加上文章内的超链接只能链接B站站内的地址，所以外部链接不能选中又不能点击，打开这些链接就很困难。只能用“审查元素”这种办法，通过网页代码找到超链接打开。这个功能可以自动识别超链接并让其能点击打开。

### 获取视频封面
在视频页内获取视频封面，经改良现在可以获取普通视频封面、“稍后再看”列表视频封面、番剧封面、直播间封面和专题文章头图（本来想做获取文章内所有图片来着，然后发现文章内的图是可以右键打开的，但头图不行，就只做了这一个）。

### 微博评论自动加载功能
查看微博评论可以不用每次都点“查看更多”按钮，滚动条到最下面时自动加载。

## 更新介绍

### v1.0.7
* `2019-06-13`
   * 优化了历史表情功能，即使历史表情消失了点击输入框也会再次出现
* `2019-06-14`
   * 修复回复评论时自动跳转评论处历史表情重叠的BUG
* `2019-06-21`
   * 修复活动页面和番剧的评论搜索无法获取评论的BUG
* `2019-06-26`
   * 修复相册评论搜索无法获取评论的BUG
   * 新功能：直播助手 > 自动关闭提示窗
* `2019-07-10`
   * 转发抽奖保存的表格从Excel变更为CSV
* `2019-07-13`
   * 新功能：增强评论功能 > 自定义颜文字
   * 历史表情和自定义颜文字可以按鼠标中键删除
   * 视频简介中的网址会自动变成可以点击打开的

* #### [关于“快捷键菜单”](http://btools.cc/hot-key-menu/)

* #### [历史更新](http://btools.cc/tag/%E6%9B%B4%E6%96%B0/)

## 反馈
* 随时TJ的官网：[btools.cc](http://btools.cc)
* 魔改的用户群：[Lost Temple 97 & Btools](https://jq.qq.com/?_wv=1027&k=5WdaKxF)
* 演示视频下留言：[【程序猿日常】Btools Chrome插件开发](https://www.bilibili.com/video/av38950957/)

## LICENSE
[MIT](https://github.com/imba97/Btools/blob/master/LICENSE)
