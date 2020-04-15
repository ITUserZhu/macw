$.fn.extend({
  hoverCheck() {
    $.packTimer = setTimeout(() => {
      // 初始声明
      const $imgsWrap = $(this).find(".img-array");
      const $imgs = $imgsWrap.children("img");
      const imgLen = $imgs.length;
      // 数量两个以上才做动画
      if (imgLen > 1) {
        let curIndex = 0,
          curZindex = 0;
        $imgs
          .first()
          .addClass("active")
          .siblings()
          .removeClass("active");
        // 循环判断加载更多图片
        $imgs.each((i, v) => {
          if (!$(v).attr("src")) {
            $(v).attr("src", $(v).data("src"));
          }
        });
        // 延迟消失 处理画面闪现问题
        $.packShowTimer = setTimeout(() => {
          $(this)
            .find(".img-cover")
            .fadeOut();
        }, 50);
        $imgsWrap.show();
        // 循环轮播
        $.packIntervalTimer = setInterval(() => {
          curIndex++;
          curZindex++;
          // 判断循环
          if (curIndex > imgLen - 1) {
            curIndex = 0;
          }
          // 通过类名控制展示隐藏
          $imgs
            .eq(curIndex)
            .addClass("active")
            .siblings()
            .removeClass("active");
          // 层级控制柔和切换效果
          $imgs.eq(curIndex).css({
            zIndex: curZindex
          });
        }, 1000);
      }
    }, 500);
  },

  leaveCheck() {
    // 鼠标清除计时器与定时器
    clearTimeout($.packTimer);
    clearTimeout($.packShowTimer);
    clearInterval($.packIntervalTimer);
    // 恢复封面展示
    $(this)
      .find(".img-cover")
      .fadeIn();
    $(this)
      .find(".img-array")
      .fadeOut();
  }
});
