chrome = chrome || browser

var CommentSet = {
  timer: null,
  loopNum: 0,
  loopMax: 20,
  sep: '|!|',
  config: {
    emoji: null,
    addText: null,
  },
  loadTimer: null,
  loadPage: 1,
  comments: [],
  count: -1,
  comment_replys: new Array(),
  comment_reg: null,
}

var CommentElement = {
  comment_progress: document.createElement('div'),
  comment_progress_p: document.createElement('p'),
  comment_progress_span: document.createElement('span'),
  comment_replys_ul: document.createElement('ul'),
  comment_text: null,
  comment_checkbox_uname: null,
  comment_checkbox_message: null,
  comment_checkbox_sign: null,
}

$(document).ready(function () {
  if (
    /^(t)\.bilibili\.com$/.test(window.location.host) ||
    /^\/(p|d)?\/?$/.test(window.location.pathname)
  )
    return false

  $('body').on('click', '.emoji-list', function () {
    var doc = $(this)

    var data = doc.attr('data-emoji-text') + ',' + doc.html()

    reorder('emoji', data)
    createHTML()

    if (getEmojiLength() > 5) {
      setHistoryEmojiBgHeight()

      doc
        .parents('.comment')
        .find('.btools-history-emoji-box .btools-history-emoji-bg[isShow=true]')
        .show()
    }
  })

  CommontInit()
  window.onpopstate = function () {
    CommontInit()
  }

  $('body').on('click', '.comment-list .reply', function () {
    createDom({
      isReply: true,
      top: 70,
      left: 100,
    })
  })

  $.fn.extend({
    insertAtCaret: function (myValue) {
      var $t = $(this)[0]
      if (document.selection) {
        this.focus()
        var sel = document.selection.createRange()
        sel.text = myValue
        this.focus()
      } else if ($t.selectionStart || $t.selectionStart == '0') {
        var startPos = $t.selectionStart
        var endPos = $t.selectionEnd
        var scrollTop = $t.scrollTop
        $t.value =
          $t.value.substring(0, startPos) +
          myValue +
          $t.value.substring(endPos, $t.value.length)
        this.focus()
        $t.selectionStart = startPos + myValue.length
        $t.selectionEnd = startPos + myValue.length
        $t.scrollTop = scrollTop
      } else {
        this.value += myValue
        this.focus()
      }
    },
  })

  $('body').on('click', '.btools-history-emoji', function () {
    $(this)
      .parents('.textarea-container')
      .find('textarea')
      .insertAtCaret($(this).attr('data-emoji-text'))

    reorder('emoji', $(this).attr('data-emoji-text') + ',' + $(this).html())
    $(this).one('mouseout', function () {
      createHTML()
    })
  })

  $('body').on(
    'focus',
    '.bb-comment > .comment-send:eq(0) textarea',
    function () {
      reDisplayEmojiSaveList()
    }
  )

  // 切换表情
  $('body').on('click', '.emoji-container .emoji-tab-wrap a', function () {
    if ($('.emoji-box .emoji-title span').text() == '颜文字') {
      createAddTextHTML()
      if ($('#btoolsAddEmojiText').length > 0) {
        $('#btoolsAddEmojiText').show()
      } else {
        $('.emoji-box .emoji-title')
          .css({
            position: 'relative',
          })
          .append(
            '<input id="btoolsAddEmojiText" placeholder="输入颜文字/字符（回车添加）">'
          )
        $('#btoolsAddEmojiText').keydown(function (e) {
          if (e.keyCode === 13) {
            var val = $(this).val()
            if (val === '' || val.length > 20) return
            if (CommentSet.config.addText === null) {
              CommentSet.config.addText = val
            } else {
              var addText = CommentSet.config.addText.split(CommentSet.sep)
              if (addText.indexOf(val) === -1) {
                addText.push(val)
                CommentSet.config.addText = addText.join(CommentSet.sep)
              } else {
                return
              }
            }
            var html =
              '<a class="emoji-list emoji-text emoji-default btools-add-text" data-emoji-text="' +
              val +
              '">' +
              val +
              '</a>'
            $('.emoji-box .emoji-wrap a:first').before(html)
            $(this).val('')
            saveSet()
          }
        })
      }
    } else {
      if ($('#btoolsAddEmojiText').is(':hidden')) return
      $('#btoolsAddEmojiText').hide()
    }
  })

  $('body').on('mousedown', '.btools-history-emoji', function (e) {
    if (e.button === 1) {
      var val = $(this).attr('data-emoji-text') + ',' + $(this).html()
      e.preventDefault()

      deleteItem('emoji', val)

      setHistoryEmojiBgHeight()
    }
  })

  $('body').on('mousedown', '.btools-add-text', function (e) {
    var val = $(this).attr('data-emoji-text')
    if (e.button === 0) {
      reorder('addText', val)
      $(this).one('mouseup', function () {
        setTimeout(function () {
          createAddTextHTML()
        }, 100)
      })
    } else if (e.button === 1) {
      e.preventDefault()
      deleteItem('addText', val)
    }
  })

  // 定位按钮被点击
  $('body').on(
    'click',
    '#BtoolsSearchList .BtoolsCommentLocation',
    function () {
      if ($('#BtoolsPageJump').length > 0 || $(this).text() == '正在跳转')
        return
      var self = $(this)
      var text = self.text()
      self.text('正在跳转')
      var currentPage = $('.bb-comment .bottom-page .current').text()
      var page = self.attr('data-page')
      var location = parseInt(self.attr('data-location'))

      if (currentPage != page) {
        $('body').append(
          '<script id="BtoolsPageJump">$(".page-jump input").val("' +
            page +
            '").trigger($.Event("keydown", {keyCode: 13}))</script>'
        )
      }

      var findCommentTimer = setInterval(function () {
        var isTop = $('.comment-list .is-top').length
        var targetDom = $(
          '.comment-list .list-item:eq(' + (location + isTop) + ')'
        )
        if (targetDom.length > 0) {
          var scrollTop = targetDom.offset().top - 100

          targetDom.addClass('BtoolsFindComment')
          setTimeout(function () {
            targetDom.removeClass('BtoolsFindComment')
          }, 1500)

          self.text(text)
          $('html,body').animate({ scrollTop: scrollTop })
          $('#BtoolsPageJump').remove()
          clearInterval(findCommentTimer)
        }
      }, 500)
    }
  )

  $('body').on('click', '.btools-history-emoji-all-btn', function () {
    var data_click = $(this).attr('data-click')

    if (data_click == undefined || data_click == 'false') {
      $(this)
        .text('关闭')
        .attr('data-click', 'true')
        .siblings('.btools-history-emoji-scroll')
        .css({
          height: 'auto',
        })

      var scrollHeight = $(this)
        .siblings('.btools-history-emoji-scroll')
        .height()

      setHistoryEmojiBgHeight()

      $(this).siblings('.btools-history-emoji-bg').show().attr('isShow', 'true')
    } else {
      $(this)
        .text('全部')
        .attr('data-click', 'false')
        .siblings('.btools-history-emoji-scroll')
        .css({
          height: 31,
        })

      $(this)
        .siblings('.btools-history-emoji-bg')
        .hide()
        .attr('isShow', 'false')
    }
  })
})

function setHistoryEmojiBgHeight() {
  $('.btools-history-emoji-scroll').each(function () {
    if ($(this).height() != 31) {
      $('.btools-history-emoji-bg').css({
        height: $(this).height() + 20,
      })
    }
  })
}

function reDisplayEmojiSaveList() {
  if (
    $(
      '.bb-comment > .comment-send:eq(0) .textarea-container .btools-history-emoji-box'
    ).length === 0
  ) {
    CommontInit()
  }
}

function CommontInit() {
  CommentSet.timer = setInterval(function () {
    if ($('.bb-comment > .comment-send:eq(0) textarea').length > 0) {
      CommentSet.topTextarea = $('.bb-comment > .comment-send:eq(0) textarea')

      createDom()

      if ($('#commentBtoolsBtn').length === 0) {
        $('.bb-comment .comment-header:eq(0)').append(
          '<li class="commentBtoolsLogo"><a id="commentBtoolsBtn" href="javascript:void(0);">' +
            Btools.logo() +
            '</a></li>'
        )

        $('#commentBtoolsBtn').HKM([
          {
            key: 83,
            title: '搜索评论',
            action: function () {
              searchShow()
            },
          },
        ])
      }

      clearInterval(CommentSet.timer)
      CommentSet.timer = null
    }
  }, 500)
}

function reorder(id, key) {
  if (CommentSet.config[id] !== null) {
    var newEmoji = CommentSet.config[id].split(CommentSet.sep)
    var newArr = new Array()
    if (key !== newEmoji[0]) {
      newEmoji.forEach(function (item, index) {
        if (key != item) {
          newArr.push(item)
        }
      })
      CommentSet.config[id] = key + CommentSet.sep + newArr.join(CommentSet.sep)
    }
  } else {
    CommentSet.config[id] = key
  }
  saveSet()
}

function deleteItem(id, val) {
  var arr = CommentSet.config[id].split(CommentSet.sep)
  var index = 0
  if (arr.length === 1) {
    CommentSet.config[id] = null
  } else {
    index = arr.indexOf(val)
    arr.splice(index, 1)
    CommentSet.config[id] = arr.join(CommentSet.sep)
  }
  switch (id) {
    case 'emoji':
      $('.btools-history-emoji-box').each(function () {
        $(this)
          .find('.btools-history-emoji:eq(' + index + ')')
          .remove()
      })
      break
    case 'addText':
      $('.btools-add-text:eq(' + index + ')').remove()
      break
  }

  saveSet()

  if (getEmojiLength() > 5) {
    $('.btools-history-emoji-all-btn').show()
  } else {
    $('.btools-history-emoji-all-btn').hide()
    $('.btools-history-emoji-bg').hide()
  }
}

function createHTML() {
  if (CommentSet.config.emoji !== null) {
    var html = ''
    var emoji = CommentSet.config.emoji.split(CommentSet.sep)
    emoji.forEach(function (item, index) {
      var val = item.split(',')
      html +=
        '<li class="btools-history-emoji" data-emoji-text="' +
        val[0] +
        '">' +
        val[1] +
        '</li>'
    })
    $('.btools-history-emoji-scroll').html(html)

    setHistoryEmojiBgHeight()

    if (emoji.length > 5) {
      $('.btools-history-emoji-all-btn').show()
    } else {
      $('.btools-history-emoji-all-btn').hide()
      $('.btools-history-emoji-bg').hide()
    }
  }
}

function createAddTextHTML() {
  if (CommentSet.config.addText !== null) {
    $('.btools-add-text').remove()
    var text = CommentSet.config.addText.split(CommentSet.sep)
    if (text.length !== $('.btools-add-text').length) {
      var html = ''
      text.forEach(function (item, index) {
        html +=
          '<a class="emoji-list emoji-text emoji-default btools-add-text" data-emoji-text="' +
          item +
          '">' +
          item +
          '</a>'
      })
      $('.emoji-box .emoji-wrap a:first').before(html)
    }
  }
}

function createDom(f_info) {
  f_info = f_info || {
    isReply: false,
    top: 68,
    left: 100,
  }

  $('.textarea-container').each(function () {
    if ($(this).find('.btools-history-emoji-box').length == 0) {
      $(this)
        .css({
          position: 'relative',
        })
        .append(
          '<div class="btools-history-emoji-box"><ul class="btools-history-emoji-scroll"></ul><a href="javascript:void(0);" class="btools-history-emoji-all-btn">全部</a><div class="btools-history-emoji-bg"></div></div>'
        )

      $(this).find('.btools-history-emoji-box').css({
        top: f_info.top,
        left: f_info.left,
      })
    }
  })

  chrome.storage.sync.get(CommentSet.config, function (items) {
    CommentSet.config = items
    createHTML()
  })
}

function saveSet() {
  chrome.storage.sync.set(CommentSet.config, function () {})
}

function searchShow() {
  var comment_box = document.createElement('div')
  comment_box.setAttribute('class', 'btools_comment_box')
  comment_box.innerHTML = '<div class="btools_comment_background"></div>'

  CommentElement.comment_replys_ul.setAttribute(
    'class',
    'btools_comment_replys_ul'
  )

  var comment_options = document.createElement('ul')
  comment_options.setAttribute('class', 'btools_comment_options')
  comment_options.innerHTML = `
<li>
  <input type="text" class="btools_comment_text"> <input type="button" value="搜索" class="btools_comment_button">
</li>
<li class="comment_search_options">
  <p>搜索范围</p>
  <p><label><input type="checkbox" class="comment_checkbox_uname" checked> 用户名</label></p>
  <p><label><input type="checkbox" class="comment_checkbox_message" checked> 评论内容</label></p>
  <p><label><input type="checkbox" class="comment_checkbox_sign"> 用户签名</label></p>
</li>
`

  CommentElement.comment_progress.setAttribute(
    'class',
    'btools_comment_progress'
  )

  CommentElement.comment_progress.appendChild(CommentElement.comment_progress_p)
  CommentElement.comment_progress.appendChild(
    CommentElement.comment_progress_span
  )

  comment_box.append(CommentElement.comment_replys_ul)
  comment_box.append(comment_options)
  comment_box.append(CommentElement.comment_progress)

  document.body.appendChild(comment_box)

  CommentElement.comment_text = document.querySelector('.btools_comment_text')
  CommentElement.comment_checkbox_uname = document.querySelector(
    '.comment_checkbox_uname'
  )
  CommentElement.comment_checkbox_message = document.querySelector(
    '.comment_checkbox_message'
  )
  CommentElement.comment_checkbox_sign = document.querySelector(
    '.comment_checkbox_sign'
  )

  document
    .querySelector('.btools_comment_button')
    .addEventListener('click', comment_search)

  CommentElement.comment_text.addEventListener('keydown', function (e) {
    e = e || window.event
    if (e.keyCode === 13) {
      comment_search()
    }
  })

  comment_getReply(1)
}

function comment_search() {
  CommentSet.comment_reg = new RegExp(
    '(' + CommentElement.comment_text.value.replace(',', '|') + ')',
    'g'
  )
  CommentElement.comment_replys_ul.innerHTML = ''

  CommentSet.comment_replys.forEach(function (item) {
    if (
      (CommentSet.comment_reg.test(item.uname) &&
        CommentElement.comment_checkbox_uname.checked) ||
      (CommentSet.comment_reg.test(item.message) &&
        CommentElement.comment_checkbox_message.checked) ||
      (CommentSet.comment_reg.test(item.sign) &&
        CommentElement.comment_checkbox_sign.checked)
    ) {
      var comment_li = document.createElement('li')
      comment_li.innerHTML =
        '<img src="' +
        item.avatar +
        '"><span>' +
        comment_highlight(item.uname) +
        '</span><p>' +
        comment_highlight(item.message) +
        '</p>'

      comment_li.addEventListener('click', function () {
        window.open(
          'https://www.bilibili.com/video/av' +
            Btools.bilibili.av() +
            '#reply' +
            item.rpid
        )
      })
      CommentElement.comment_replys_ul.appendChild(comment_li)
    }
  })
}

function comment_highlight(str) {
  if (CommentSet.comment_reg === null) return str
  return str.replace(
    CommentSet.comment_reg,
    '<font style="font-weight:700;color:#000;background-color:#FF0;">$1</font>'
  )
}

function comment_getReply(page) {
  var url =
    'https://api.bilibili.com/x/v2/reply?jsonp=jsonp&type=1&sort=2&ps=40&pn=' +
    page +
    '&oid=' +
    Btools.bilibili.av()
  var xhr = new XMLHttpRequest()
  xhr.open('GET', url, true)
  xhr.withCredentials = true
  xhr.send()
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var json = JSON.parse(xhr.responseText)
      if (json.data.replies === null) {
        return
      }

      json.data.replies.forEach(function (item) {
        CommentSet.comment_replys.push({
          rpid: item.rpid,
          message: item.content.message,
          avatar: item.member.avatar,
          uname: item.member.uname,
          sign: item.member.sign,
        })
      })

      if (page * 40 <= json.data.page.count) {
        var progress = parseInt(((page * 40) / json.data.page.count) * 100)
        CommentElement.comment_progress_p.innerText = progress + '%'
        CommentElement.comment_progress_span.style.width = progress + '%'
        comment_getReply(++page)
      } else {
        CommentElement.comment_progress_p.innerText = '100%'
        CommentElement.comment_progress_span.style.width = '100%'
        CommentElement.comment_text.style.opacity = 1
        setTimeout(function () {
          console.log(CommentElement.comment_text)
          CommentElement.comment_text.focus()
          CommentElement.comment_progress.style.display = 'none'
        }, 500)
      }
    }
  }
}

function getEmojiLength() {
  return CommentSet.config.emoji !== null
    ? CommentSet.config.emoji.split(CommentSet.sep).length
    : 0
}

function searchComments(text) {
  var reg = new RegExp('(' + text + ')', 'ig')
  if (CommentSet.comments.length === 0) return false
  $('#BtoolsSearchList').html('')
  CommentSet.comments.forEach(function (item, index) {
    var isShow = false
    if (reg.test(item.content.message) || reg.test(item.member.uname)) {
      var message = item.content.message.replace(
        reg,
        '<span class="BtoolsCommentKeyword">$1</span>'
      )
      var userName = item.member.uname.replace(
        reg,
        '<span class="BtoolsCommentKeyword">$1</span>'
      )
      isShow = true
    }

    var vipName = item.member.vip.vipStatus === 1 ? 'BtoolsVipName' : ''
    var userFace = !/noface\.gif/.test(item.member.avatar)
      ? '@50w_50h.webp'
      : ''

    if (isShow) {
      var html =
        '<li><p class="BtoolsUserInfo"><img class="BtoolsUserHead" src="' +
        item.member.avatar +
        userFace +
        '"><a href="http://space.bilibili.com/' +
        item.member.mid +
        '" class="BtoolsUserNickname ' +
        vipName +
        '" target="_blank">' +
        userName +
        '</a><a href="javascript:void(0);" data-page="' +
        item.position.page +
        '" data-location="' +
        item.position.location +
        '" class="BtoolsCommentLocation">跳转' +
        item.position.page +
        '页' +
        (item.position.location + 1) +
        '条</a></p><p class="BtoolsUserComment">' +
        message +
        '</p></li>'
      $('#BtoolsSearchList').append(html)
    }
  })
}
