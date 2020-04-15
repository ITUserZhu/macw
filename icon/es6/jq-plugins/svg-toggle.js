$.fn.addSvgClass = function(className) {
  return this.each(function() {
    var attr = $(this).attr("class");
    if (attr) {
      if (attr.indexOf(className) < 0) {
        $(this).attr("class", attr + " " + className);
      }
    } else {
      $(this).attr("class", className);
    }
  });
};

$.fn.removeSvgClass = function(className) {
  return this.each(function() {
    var attr = $(this).attr("class");
    $(this).attr("class", attr.replace(className, ""));
  });
};
