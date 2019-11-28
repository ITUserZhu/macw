// 引入生成二维码脚本
import QRcode from 'qrcode';

$(function () {
  const wxShareHtml = `
    <div class="wx-share" id="weixin_share">
      <div class="wx-share_box">
        <div class="wx-share_header">
          <span class="wx-share_close">×</span>
          <h3>分享到微信朋友圈</h3>
        </div>
        <div class="wx-share_body" id="wx-share_body">
          <img src="/assets/images/vip/wx-ewm.png">
        </div>
        <div class="wx-share_footer">
          <p>打开微信 “扫一扫” 即可将网页分享到我的朋友圈。</p>
        </div>
      </div>
    </div>`;
  // 图片数据
  const $contentInfo = $('#content-info');
  // 分享按钮
  const $shareWraps = $('#share-wraps');

  const docTitle = document.title,
    pageUrl = $contentInfo.data('url') || window.location.href,
    imgDesc = $contentInfo.data('desc'),
    imgSrc = $contentInfo.data('thumb');

  // 分享地址
  let qzone = 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=' + encodeURIComponent(pageUrl) + '&title=' + encodeURI(docTitle) + '&summary=' + encodeURI(imgDesc),
    xinlang = 'http://service.weibo.com/share/share.php?url=' + encodeURIComponent(pageUrl) + '&title=' + encodeURI(docTitle) + encodeURI(imgDesc),
    huaban = 'http://huaban.com/bookmarklet/?url=' + encodeURIComponent(pageUrl) + '&title=' + encodeURI(docTitle) + '&media=' + encodeURI(imgSrc) + '&description=' + encodeURI(imgDesc),
    winStyle = 'height=500, width=600, toolbar =no, menubar=no, scrollbars=no, resizable=no, location=no, status=no';

  $shareWraps.on('click', 'span', function (e) {
    let $target = $(e.target);
    switch ($target[0].className) {
      case 'icon-wx':
        if (!$('#weixin_share').length) {
          $('main').append(wxShareHtml);
          const $wxShare = $('#weixin_share');
          $wxShare.on('click', '.wx-share_close', function () {
            $wxShare.hide();
          });

          QRcode.toDataURL(pageUrl, {
            width: 200,
            margin: 1
          }).then(url => {
            $wxShare.find('img').attr('src', url)
          })
        } else {
          $('#weixin_share').show();
        }
        break;
      case 'icon-qzone':
        window.open(qzone, "_blank", winStyle);
        break;
      case 'icon-xinlang':
        window.open(xinlang, "_blank", winStyle);
        break;
      case 'icon-huaban':
        window.open(huaban, "_blank", winStyle);
        break;
      default:
        break;
    }
  });
});