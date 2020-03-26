import "./common/index";
import Swiper from "swiper";

$(() => {
  // 首页头部轮播
  new Swiper(".swiper-container", {
    loop: true,
    pagination: {
      el: ".swiper-pagination"
    }
  });
});
