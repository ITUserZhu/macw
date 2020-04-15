import "./components/common";
// 引入自定义方法
import { toggleActive, commonSearch } from "./util";
// 引入自定义jq方法
import "./jq-plugins/pack-check";

$(function() {
  // 搜索功能
  const $search = $(".banner-form").find("form");
  $search.on("submit", function(e) {
    e.preventDefault();
    let val = $(this)
      .find("input")
      .val();
    commonSearch(val);
  });
  // 推荐切换
  const $checkNav = $(".check-nav").children("h3");
  const $checkItem = $(".icon-items").children("ul");
  const $checkMore = $(".pack-more").children("a");

  // 点击切换
  $checkNav.on("click", function() {
    let _index = $(this).index();
    toggleActive([$(this), $checkItem.eq(_index), $checkMore.eq(_index)]);

    // 动态查询图片加载
    $checkItem
      .eq(_index)
      .children("li")
      .each((i, v) => {
        let $img = $(v).find(".img-cover");
        if (!$img.attr("src")) {
          $img.attr("src", $img.data("src"));
        }
      });
  });

  // 注册鼠标悬浮切换事件
  $checkItem
    .on("mouseenter", "li", function() {
      $(this).hoverCheck();
    })
    .on("mouseleave", "li", function() {
      $(this).leaveCheck();
    });
});
