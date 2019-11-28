/*
 * @Author: Liliang Zhu 
 * @Date: 2019-11-21 11:34:12 
 * @Last Modified by:   Liliang Zhu 
 * @Last Modified time: 2019-11-21 11:34:12 
 * 分享弹框功能
 */

class SharePrize {
  constructor() {

  }

  init() {
    if (!$('#share-wrap').length) {
      var html = '<div class="share-wrap" id="share-wrap"><div class="share-box"><div class="top"><i class="close-share">X</i><p class="title"><span>分享有礼</span></p></div><div class="share-cont"><div class="prize"><div class="p-item fl"><p> 一重礼：</p> <span>邀请新用户注册成功即可获得50积分</span></div><div class="p-item fr"><p> 二重礼：</p> <span>邀请新用户成功注册并充值，可获得更多奖励</span></div></div><div class="share-copy-box"><div class="con"><div class="form"><input type="text" readonly="readonly" value=""><button>复制链接</button></div><p>复制上面的链接发送给好友、QQ群，或粘贴到微博、微信、论坛、个人网站等，可以更快获取奖励哦~</p></div></div><p class="share-link"><a href="/mac/pm#/share" target="_blank">查看已获得奖励</a><a href="/about.html#share" class="fr" target="_blank">更多奖励查看获得详情</a></p></div></div></div>';
      $('main').append(html);

      this.$dom = $('#share-wrap');

      this.initEvent();
    }

    this.showShareBox();
  }

  initEvent() {
    this.$dom
      .on('click', function () {
        $(this).fadeOut();
      })
      .on('click', '.share-box', function (e) {
        e.stopPropagation();
      })
      .on('click', '.close-share', this.closeShareBox.bind(this))
      .on('click', 'button', this.copy.bind(this))
  }

  copy() {
    this.$dom.find('input').select();
    document.execCommand("Copy", true);
    this.$dom.find('button').text('复制成功')
  }

  closeShareBox() {
    this.$dom.fadeOut();
    this.$dom.find('button').text('复制链接')
  }

  showShareBox() {
    this.$dom.fadeIn();

    var copyValue, curUrl = window.location.href;
    if (curUrl.match(/\?id=/)) {
      curUrl = curUrl.slice(0, curUrl.match(/\?id=/).index);
    };
    if (window.localStorage.reg_info) {
      copyValue = $('h1').text() + ' ' + curUrl + '?id=' + window.localStorage.reg_info
    };
    !this.$dom.find('input').val() && this.$dom.find('input').val(copyValue);
  }
}

export default SharePrize;