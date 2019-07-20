const K = {
  /* 五十音 */
  /* A */ 65: ['あ', 'ア'], /* I */　73: ['い', 'イ'], /* U */　85: ['う', 'ウ'], /* E */　69: ['え', 'エ'], /* O */　79: ['お', 'オ'],
  /* K */ 75: { 65: ['か', 'カ'], 73: ['き', 'キ'], 85: ['く', 'ク'], 69: ['け', 'ケ'], 79: ['こ', 'コ'] },
  /* S */ 83: {
    /* A */ 65: ['さ', 'サ'], 73: ['し', 'シ'], 85: ['す', 'ス'], 69: ['せ', 'セ'], 79: ['そ', 'ソ'],
    /* Y */ 89: { 65: ['しゃ', 'シャ'], 73: ['ぎぃ', 'ギィ'], 85: ['ぎゅ', 'ギュ'], 69: ['ぎぇ', 'ギェ'], 79: ['ぎょ', 'ギョ'] },
    /* H */ 72: { 65: ['しゃ', 'シャ'], 73: ['し', 'シ'], 85: ['しゅ', 'シュ'], 69: ['しぇ', 'シェ'], 79: ['しょ', 'ショ'] }
  /*****/ },
  /* T */ 84: { 65: ['た', 'タ'], 73: ['ち', 'チ'], 85: ['つ', 'ツ'], 69: ['て', 'テ'], 79: ['と', 'ト'],
    /* S */ 83: { 85: ['つ', 'ツ'] },
  /*****/ },
  /* C */ 67: { 72: { 73: ['ち', 'チ'] } },
  /* N */ 78: {
    /* A */ 65: ['な', 'ナ'], 73: ['に', 'ニ'], 85: ['ぬ', 'ヌ'], 69: ['ね', 'ネ'], 79: ['の', 'ノ'],
    /* Y */ 89: { 65: ['にゃ', 'ニャ'], 73: ['にぃ', 'ニィ'], 85: ['にゅ', 'ニュ'], 69: ['にぇ', 'ニェ'], 79: ['にょ', 'ニョ'] },
    /* N */ 78: ['ん', 'ン']
  /*****/ },
  /* H */ 72: { 65: ['は', 'ハ'], 73: ['ひ', 'ヒ'], 85: ['ふ', 'フ'], 69: ['へ', 'ヘ'], 79: ['ほ', 'ホ'] },
  /* M */ 77: { 65: ['ま', 'マ'], 73: ['み', 'ミ'], 85: ['む', 'ム'], 69: ['め', 'メ'], 79: ['も', 'モ'] },
  /* Y */ 89: { 65: ['や', 'ヤ'], 85: ['ゆ', 'ユ'], 79: ['よ', 'ヨ'] },
  /* R */ 82: { 65: ['ら', 'ラ'], 73: ['り', 'リ'], 85: ['る', 'ル'], 69: ['れ', 'レ'], 79: ['ろ', 'ロ'] },
  /* W */ 87: { 65: ['わ', 'ワ'], 73: ['うぃ', 'ウィ'], 69: ['うぇ', 'ウェ'], 79: ['を', 'ヲ'] },

  /* 浊音 */
  /* G */ 71: {
    /* A */ 65: ['が', 'ガ'], 73: ['ぎ', 'ギ'], 85: ['ぐ', 'グ'], 69: ['げ', 'ゲ'], 79: ['ご', 'ゴ'],
    /* Y */ 89: { 65: ['ぎゃ', 'ギャ'], 73: ['ぎぃ', 'ギィ'], 85: ['ぎゅ', 'ギュ'], 69: ['ぎぇ', 'ギェ'], 79: ['ぎょ', 'ギョ'] }
  /*****/ },
  /* Z */ 90: { 65: ['ざ', 'ザ'], 73: ['じ', 'ジ'], 85: ['ず', 'ズ'], 69: ['ぜ', 'ゼ'], 79: ['ぞ', 'ゾ'] },
  /* D */ 68: { 65: ['だ', 'ダ'], 73: ['ぢ', 'ヂ'], 85: ['づ', 'ヅ'], 69: ['で', 'デ'], 79: ['ど', 'ド'] },
  /* B */ 66: { 65: ['ば', 'バ'], 73: ['び', 'ビ'], 85: ['ぶ', 'ブ'], 69: ['べ', 'ベ'], 79: ['ぼ', 'ボ'] },

  /* 半浊音 */
  /* P */ 80: {
    /* A */ 65: ['ぱ', 'パ'], 73: ['ぴ', 'ピ'], 85: ['ぷ', 'プ'], 69: ['ぺ', 'ペ'], 79: ['ぽ', 'ポ'],
    /* Y */ 89: { 65: ['ぴゃ', 'ピャ'], 73: ['ぴぃ', 'ピィ'], 85: ['ぴゅ', 'ピュ'], 69: ['ぴぇ', 'ピェ'], 79: ['ぴょ', 'ピョ'] }
  /*****/ },

  /* 拗音 */
  /* J */ 74: {
    /* A */ 65: ['じゃ', 'ジャ'], 73: ['じ', 'ジ'], 85: ['じゅ', 'ジュ'], 69: ['じぇ', 'ジェ'], 79: ['じょ', 'ジョ'],
    /* Y */ 89: { 65: ['じゃ', 'ジャ'], 73: ['じぃ', 'ジィ'], 85: ['じゅ', 'ジュ'], 69: ['じぇ', 'ジェ'], 79: ['じょ', 'ジョ'] }
  /*****/ },

  /* 外来语 */
  /* V */ 86: { 65: ['ゔぁ', 'ヴァ'], 73: ['ゔぃ', 'ヴィ'], 85: ['ゔ', 'ヴ'], 69: ['ゔぇ', 'ヴェ'], 79: ['ゔぉ', 'ヴォ'] },
  /* F */ 70: { 65: ['ふぁ', 'ファ'], 73: ['ふぃ', 'フィ'], 85: ['ふ', 'フ'], 69: ['ふぇ', 'フェ'], 79: ['ふぉ', 'フォ'] },

  /* 小字符 */
  /* L */ 76: { 65: ['ぁ', 'ァ'], 73: ['ぃ', 'ィ'], 85: ['ぅ', 'ゥ'], 69: ['ぇ', 'ェ'], 79: ['ぉ', 'ォ'] },

  /* 长音 */
  189: ['ー']
}

const nihongo = {
  on: false,
  text: null,
  key: K,
  keyList: [],
  val: '',
  arufa: '',
  hiragana: '',
  isKatagana: false,
  pos: 0,
  range: null,
  isComKey: false
}

$(document).ready(function(){
  $('body').on('keydown', 'textarea,:text',function(e) {
    e = e || window.event || arguments.callee.caller.arguments[0];
    if(e.keyCode >= 16 && e.keyCode <= 18) {
      nihongo.isComKey = true;
    }
    if(e.keyCode === 8) {
      nihongo.key = K;
      nihongo.arufa = '';
    }
  });
  $('body').on('keyup', 'textarea,:text',function(e) {
    e = e || window.event || arguments.callee.caller.arguments[0];
    nihongo.text = $(this);

    if(nihongo.isComKey && e.keyCode === 123) {
      nihongo.on = !nihongo.on;
      $('body .jpinputMsg').remove();
      var status = nihongo.on ? 'ON' : 'OFF';
      $('body').append('<div class="jpinputMsg">' + status + '</div>').find('.jpinputMsg').delay(500).fadeOut();
    }
    if(e.keyCode === 81 && nihongo.isComKey) {
      nihongo.isKatagana = !nihongo.isKatagana;
    }

    var el = nihongo.text.get(0);
    if ('selectionStart' in el) {
        nihongo.pos = el.selectionStart;
    }
    if(e.keyCode >= 16 && e.keyCode <= 18) {
      nihongo.isComKey = false;
    }
    if(nihongo.on && !nihongo.isComKey && ((e.keyCode >= 65 && e.keyCode <= 90) || e.keyCode === 189)) {
      nihongo.key = getKey(e.keyCode);
    }
  });
});

function getKey(e) {
  var char = String.fromCharCode(e).toLowerCase();
  var val = nihongo.text.val();
  if(nihongo.arufa.length > 0 && char !== 'n') {
    if(nihongo.arufa[nihongo.arufa.length - 1] === char) {
      nihongo.text.val(val.substring(0, nihongo.pos - 2) + (nihongo.isKatagana ? 'ッ' : 'っ') + char + val.substring(nihongo.pos, val.length));
      nihongo.text.get(0).setSelectionRange(nihongo.pos, nihongo.pos);
      nihongo.arufa = char;
      return K[e] || nihongo.key;
    }
  }
  nihongo.arufa += char;
  if(nihongo.key[e] !== undefined) {
    if(Array.isArray(nihongo.key[e])) {
      var hira = nihongo.isKatagana ? nihongo.key[e][1] || nihongo.key[e][0] : nihongo.key[e][0];
      var str_l = val.substring(0, nihongo.pos - nihongo.arufa.length);
      var str_r = val.substring(nihongo.pos, val.length);
      nihongo.hiragana = str_l + hira + str_r;

      nihongo.text.val(nihongo.hiragana);
      var pos = nihongo.pos + hira.length - nihongo.arufa.length;
      nihongo.text.get(0).setSelectionRange(pos, pos);
      nihongo.arufa = '';
      return K;
    }
    nihongo.keyList.push(e);
    return nihongo.key[e];
  } else {
    nihongo.arufa = nihongo.arufa.substring(nihongo.arufa.length - 1, nihongo.arufa.length);
    return K[e] || nihongo.key;
  }
}
