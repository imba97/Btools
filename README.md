# Btools

[![LICENSE](https://img.shields.io/github/license/imba97/Btools.svg)](https://github.com/imba97/Btools/blob/master/LICENSE)
[![chrome-web-store](https://img.shields.io/chrome-web-store/users/codgofkgobbmgglciccjabipdlgefnch.svg)](https://chrome.google.com/webstore/detail/btools/codgofkgobbmgglciccjabipdlgefnch)
[![Mozilla Add-on](https://img.shields.io/amo/users/Btools.svg)](https://addons.mozilla.org/zh-CN/firefox/addon/btools)
[![github-releases](https://img.shields.io/github/downloads/imba97/Btools/total.svg)](https://github.com/imba97/Btools/releases)
[![website](https://img.shields.io/website-up-down-green-red/https/shields.io.svg?label=website)](http://btools.cc)

## 前言

如果你想参观代码（**屎山**），请先看这里。
代码是纯 jQuery 项目，没其他框架，没用其他工具，目录结构、文件名、函数名我记几个儿随便瞎起的，所以观赏性极差，劝你做好心理准备。

## 介绍

Btools(逼砣)，本插件主要目的是以 B 站为主的网站页面优化，增强用户体验，有方便快捷的功能。

## 功能介绍

### 订阅频道

订阅某个 UP 的频道，周期性检查频道的视频，如果有新的则会提醒。

[《新功能介绍 – 订阅频道》](https://btools.cc/new-function-3/)

### 增强评论功能

#### `增强评论功能 > 历史表情`

保存最近发出的 5 个表情，下次发不用再点击“表情”按钮去翻页选择。

#### `增强评论功能 > 评论搜索`

在 UP 主名称和评论中搜索指定关键字，并可以快速跳转到评论

#### `增强评论功能 > 自定义颜文字`

当切换到颜文字界面，会出现输入框，输入自定义的表情或文字按回车即可添加

### 直播助手

##### `直播助手 > 隐藏显示PK分数`

顾名思义，因为有时候 PK 分数窗口会挡住视频的精 ♂ 彩内容。

##### `直播助手 > 隐藏迷你播放器`

顾名思义 ×2，有时候迷你播放器有点烦。

### 专栏助手

##### `专栏助手 > 网址链接转换`

文章中的网址直接可以左键打开

##### `专栏助手 > 查看原图`

在图片上左键后会弹出未被处理过的大图，方便查看

##### `专栏助手 > 新窗口打开原图`

在新窗口打开未被处理过的大图

### 增强 B 站收藏夹

原“查看失效视频”功能，B 站更新了收藏夹，页面数据中及后台请求数据中删除了视频封面和标题，因此原功能失效。改为增强 B 站收藏夹，你依然可以用这个功能查看失效视频的简介、分 P 名以及 UP 主，可能会帮你想起这个失效视频。没失效的视频则可以快速的打开封面、打开 UP 主空间、跳转哔哩哔哩唧唧。

**并且有几率找会失效视频**

### 转发抽奖

至于为什么要做这个，如果想用 B 站的转发抽奖，首先你得是 1 万粉丝以上的认证用户。这个的话可以让所有人都能用，虽然功能方面不如官方的（目前完善的距离官方还差两步，一是 Btools 不能判断转发者是否关注了你，二是不支持人数太多，500 以上可能加载的时候会出问题，大概吧）

### 获取视频封面

在视频页内获取视频封面，经改良现在可以获取普通视频封面、“稍后再看”列表视频封面、番剧封面、直播间封面和专题文章头图（本来想做获取文章内所有图片来着，然后发现文章内的图是可以右键打开的，但头图不行，就只做了这一个）。

### 微博评论自动加载功能

查看微博评论可以不用每次都点“查看更多”按钮，滚动条到最下面时自动加载。

## 更新介绍

### v1.1.5

- `2020-10-04`

  - 修复打开封面按钮不显示的问题
  - 优化搜索评论功能

- #### [关于查看失效视频半全恢复说明](https://btools.cc/announcement-2019-11-04/)

- #### [历史更新](https://btools.cc/tag/update/)

## 感谢

- [【干货】Chrome 插件(扩展)开发全攻略](https://www.cnblogs.com/liuxianan/p/chrome-plugin-develop.html)

## 反馈

- 随时 TJ 的官网：[btools.cc](http://btools.cc)
- 魔改的用户群：[Lost Temple 97 & Btools](https://jq.qq.com/?_wv=1027&k=5WdaKxF)
- 演示视频下留言：[【程序猿日常】Btools Chrome 插件开发](https://www.bilibili.com/video/av38950957/)

## 其他

[关于“快捷键菜单”](http://btools.cc/hot-key-menu/)

## LICENSE

[MIT](https://github.com/imba97/Btools/blob/master/LICENSE)
