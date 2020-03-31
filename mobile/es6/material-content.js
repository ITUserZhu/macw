import "./common/index";
import "./plugins/towaterfall";

$(() => {
  const $materialWrap = $(".material-waterfall_list");
  $materialWrap.toWaterfall();

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
