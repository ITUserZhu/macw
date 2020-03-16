// 内容公共板块
import "./modules/content-operate";
import "./plugins/jquery.event.move";

$(() => {
  const $imgHandle = $("#img-handle");
  const $img1 = $(".imgs-before");
  const $img2 = $(".imgs-after");

  let curX;

  $imgHandle
    .on("movestart", e => {
      $imgHandle.trigger("click");
      if (e.targetTouches && e.targetTouches.length > 1) {
        e.preventDefault();
        return;
      }

      if (e.target == e.currentTarget) {
        curX = parseInt($imgHandle.css("left"));
      }

      $imgHandle.parent().addClass("active");
    })
    .on("move", e => {
      let mLen = curX + e.distX;

      if (mLen <= 0) {
        mLen = 0;
      } else if (mLen >= 1000) {
        mLen = 1000;
      }

      $imgHandle.css({
        left: mLen
      });

      $img1.css({
        clip: `rect(0px, ${mLen}px, 563px, 0)`
      });

      $img2.css({
        clip: `rect(0px, 1000px, 563px, ${mLen}px)`
      });
    })
    .on("moveend", () => {
      $imgHandle.parent().removeClass("active");
    });
});
