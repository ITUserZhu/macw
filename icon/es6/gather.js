import "./components/common";
import "./jq-plugins/pack-check";

$(function() {
  const $packList = $(".icons-list");

  // 鼠标悬浮离开调用自定义方法
  $packList
    .on("mouseenter", "li", function() {
      $(this).hoverCheck();
    })
    .on("mouseleave", "li", function() {
      $(this).leaveCheck();
    });
});
