// 内容页公用
import "../common/index";
import Swiper from "swiper";

$(() => {
  const $contentInfo = $("#content-info");
  const MODE_ID = $contentInfo.data("model");
  const RES_ID = $contentInfo.data("id");

  // 介绍展开隐藏功能
  const $moreBtn = $(".show-off");
  const $content = $(".content-box");

  if ($moreBtn.length && $content.height() >= 500) {
    $moreBtn.show();

    $moreBtn.on("click tap", function() {
      if ($(this).hasClass("active")) {
        $(this)
          .removeClass("active")
          .find("em")
          .text("展开");
        $content.removeClass("active");
      } else {
        $(this)
          .addClass("active")
          .find("em")
          .text("收起");
        $content.addClass("active");
      }
    });
  }

  // 截图轮播功能
  const $swiperContainer = $(".swiper-container");
  if ($swiperContainer.length) {
    let effectType = "slide";
    if ($swiperContainer.hasClass("wallpaper")) {
      effectType = "fade";
    }
    new Swiper(".swiper-container", {
      navigation: {
        nextEl: ".swiper-next",
        prevEl: ".swiper-prev"
      },
      effect: effectType
    });
  }

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
