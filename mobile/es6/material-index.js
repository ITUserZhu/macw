import "./common/index";
import Swiper from "swiper";

$(() => {
  // 首页头部轮播
  new Swiper(".swiper-container", {
    initialSlide: 1,
    slidesPerView: 2,
    slidesOffsetBefore: 87.5,
    loop: true,
    pagination: {
      el: ".swiper-pagination"
    }
  });
});
