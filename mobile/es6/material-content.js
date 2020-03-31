import "./common/index";
import "./plugins/towaterfall";

$(() => {
  // 下载按钮复制当前链接
  const $download = $(".download");

  let copyDownload = () => {
    const curUrl = window.location.href;
    let $ipt = $(`<input type="text" value="${curUrl}" style="opacity: 0;">`);
    $("main").append($ipt);
    $ipt.select();
    document.execCommand("Copy");
    $ipt.remove();
    $ipt = null;
  };

  $download.on("click", copyDownload.bind(this));

  // 相似图瀑布流
  const $materialWrap = $(".material-waterfall_list");
  $materialWrap.toWaterfall();
});
