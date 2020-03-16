$(() => {
  // 分类切换
  const $select = $("#select-btn");

  $select.on("click tap", function(e) {
    e.stopPropagation();
    $(this)
      .parent()
      .toggleClass("active");
  });

  $(document).on("click tap", () => $select.parent().removeClass("active"));
});
