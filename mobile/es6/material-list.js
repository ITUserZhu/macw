import "./common/index";
import "./plugins/towaterfall";
import waterfallAjax from "./material/waterfall-ajax";

$(() => {
  const $form = $(".header-search");

  $form.on("submit", e => {
    e.preventDefault();
    const $target = $(e.target);
    const searchType = $target.data("type");
    const searchCate = $target.data("cate");
    const searchVal = $target
      .find("input")
      .val()
      .trim();

    if (searchVal.length) {
      window.location.href = `/search/sc_${searchVal}_${searchCate}_${searchType}.html`;
    }
  });

  const $materialWrap = $(".material-waterfall_list");
  const $dataInfo = $("#material-infos");
  const dataTotal = $dataInfo.data("total");
  const dataType = $dataInfo.data("type");

  let ajaxData = {
    cate_id: $dataInfo.data("id"),
    format_type: $dataInfo.data("format"),
    keyword: $dataInfo.data("keyword"),
    type: dataType
  };

  $materialWrap.toWaterfall({
    ajaxData: function(success) {
      waterfallAjax(ajaxData, (res, str) => {
        if (res.code == 200 && res.data) {
          success(str, res.next);
        } else {
          success("", 500);
        }
      });
    }
  });
});
