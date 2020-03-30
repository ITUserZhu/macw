import "./common/index";
import "./components/list-nav";
import listLoad from "./list/index";

$(() => {
  // 滚动加载
  const $dataInfo = $("#topic-infos");
  const dataTotal = $dataInfo.data("total");
  const dataType = $dataInfo.data("type");

  let ajaxData = {
    page: 1,
    cate_id: $dataInfo.data("id"),
    type: dataType
  };

  const $dom = $(".list-wrap"),
    $wrap = $dom.find("ul");

  // 滚动加载功能调用
  listLoad($dom, $wrap, ajaxData, dataType);
});
