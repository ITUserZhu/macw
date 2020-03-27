import "./common/index";
import "./plugins/waterfall";

$(() => {
  // 查询设备尺寸定义瀑布流宽度与间距
  const colW = (window.outerWidth - window.outerWidth * 0.1) * 0.485;
  const colM = (window.outerWidth - window.outerWidth * 0.1) * 0.03;

  $(".material-waterfall_list").waterfall({
    itemCls: "item",
    minCol: 2,
    colWidth: colW,
    gutterWidth: colM,
    gutterHeight: colM,
    loadingMsg: ""
  });
});
