import "./common/index";
import "./plugins/towaterfall";
import waterfallAjax from "./material/waterfall-ajax";

$(() => {
  const $materialWrap = $(".material-waterfall_list");
  const $dataInfo = $("#material-infos");
  const dataTotal = $dataInfo.data("total");
  const dataType = $dataInfo.data("type");

  let ajaxData = {
    id: $dataInfo.data("id"),
    type: dataType
  };

  $materialWrap.toWaterfall({
    ajaxData: success => {
      waterfallAjax(ajaxData, (res, str) => {
        if (res.code === 200 && res.data) {
          success(str, res.next);
        } else {
          success("", 500);
        }
      });
    }
  });
});
