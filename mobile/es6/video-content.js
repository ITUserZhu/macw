import "./common/index";

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

  // 添加统计
  const $contentInfo = $("#content-info");
  const MODE_ID = $contentInfo.data("model");
  const RES_ID = $contentInfo.data("id");

  $(window).one("scroll", () =>
    setTimeout(
      () =>
        $.ajax({
          url: `/api/stat/${MODE_ID}/${RES_ID}`,
          type: "GET"
        }),
      500
    )
  );
});
