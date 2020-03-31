import "./common/index";
import listLoad from "./list/index";

$(() => {
  // 滚动加载
  const $dataInfo = $("#material-infos");
  const dataTotal = $dataInfo.data("total");
  const dataType = $dataInfo.data("type");

  let ajaxData = {
    page: 1,
    cate_id: $dataInfo.data("id"),
    type: dataType
  };

  const $dom = $(".atlas-wrap"),
    $wrap = $dom.find("ul");

  // 滚动加载功能调用
  listLoad($dom, $wrap, ajaxData, dataType);
});
