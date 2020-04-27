import "jquery-colpick";
import "../jq-plugins/svg-toggle";
import {
  ICON_API,
  DOWNLOAD_API
} from "../api";
import Recharge from "./recharge-box";
import {
  toggleActive,
  alertBox
} from "../util";

let editIconHtml = `<div class="icon-edit-overlay">
        <div class="edit-wraaper">
            <div class="icon-mask">
                <p><em></em> 
                    <span class="edit-close close-icon">X</span> 
                </p>
            </div>
            <div class="edit-head">编辑图标
                <span class="edit-close">X</span>
            </div>
            <div class="edit-content">
                <div class="clearfix">
                    <div class="icon-show-path fl">
                        <span class="icon-back">还原</span>
                        <div class="svg-wra"></div>
                        <div class="size-check" id="icon-size-sel">
                            <span class="size-title">选择下载尺寸：</span>
                            <div class="select-wrap">
                                <input type="number" value="512" min="1" max="1024"></input>
                                <div class="size-wrap">
                                    <p data-size="16">16</p>
                                    <p data-size="24">24</p><p data-size="32">32</p>
                                    <p data-size="64">64</p>
                                    <p data-size="128">128</p>
                                    <p data-size="256">256</p>
                                    <p data-size="512" class="active">512</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="icon-edit-path fr">
                        <div class="sel-color-path color-choose">
                            <p>选择一个色块</p>
                            <ul class="color-path"><li></li></ul>
                        </div>
                        <div class="col-pick" id="col-pick"></div>
                        <div class="last-color-sel color-choose">
                            <p>颜色选择记录</p>
                            <ul class="icon-last-color"></ul>
                        </div>
                        <div class="original-color color-choose">
                            <p>图标原始颜色</p>
                            <ul class="icon-original-color"><li></li></ul>
                        </div>
                    </div>
                </div>
                <div class="down-wra">
                    <button data-type="svg">SVG下载</button>
                    <button data-type="png">PNG下载</button>
                    <button data-type="eps">EPS下载</button>
                    <button data-type="ico">ICO下载</button>
                    <button data-type="base64" class="base64">&lt;/&gt;代码</button>
                </div>
            </div>
        </div>
    </div>`;

class IconEdit {
  constructor(opt) {
    this.init(opt);
  }
  init(opt) {
    this.opt = {};
    $.extend(this.opt, opt, true);
    this.initHtml();
    this.oldColor = [];
    this.cannotEdit = false;
  }

  initHtml() {
    this.getIconAjax({
      icon_id: this.opt.icon_id
    });
  }

  initColorPick(color, curChangeColor = color) {
    let self = this;
    self.__getByFillColor(color).addSvgClass("active-path");
    self
      .__getByFillColorLi(color)
      .addClass("active")
      .siblings()
      .removeClass("active");
    $("#col-pick")
      .colpick({
        flat: true,
        layout: "hex",
        submit: 0,
        height: 200,
        color: curChangeColor,
        onChange: function (has, hex) {
          self.changeSvgColor(hex);
          self.initOldColors();
        }
      })
      .on("mouseup", ".colpick_color, .colpick_hue", function (e) {
        let color = $(this)
          .parent()
          .find(".colpick_hex_field input")
          .val();

        if (self.oldColor.length >= 10) {
          self.oldColor.pop();
        }
        self.oldColor.unshift("#" + color);
      });
  }

  initOldColors() {
    let self = this,
      html =
      '<li data-original="{ color }" style="background-color: { color }"></li>',
      newHtml = "";
    if (self.oldColor.length <= 0) return;
    self.oldColor.forEach(function (v, i) {
      newHtml += html.replace(/{ color }/g, v);
    });
    $(".icon-edit-overlay")
      .find(".icon-last-color")
      .empty()
      .append(newHtml);
  }

  changeSvgColor(color) {
    $(".icon-edit-overlay")
      .find(".active-path")
      .each(function (index, el) {
        if ($(el).css("fill") == "none") {
          $(el).css("stroke", "#" + color);
        } else {
          $(el).css("fill", "#" + color);
        }
      });
    $(".icon-edit-overlay")
      .find(".color-path .active")
      .attr("style", "background-color: #" + color + ";");
  }

  getIconAjax(data) {
    var self = this;
    $.ajax({
        url: ICON_API.edit,
        type: "POST",
        data: data
      })
      .done(function (res) {
        if (res.code == 200) {
          $(".icon-edit-overlay").remove();
          $("main").append(editIconHtml);
          let html;
          if (res.img_type == 1) {
            html = '<img src="' + res.data + '"/>';
            self.isImg = true;
          } else {
            let newH = atob(res.data);

            html = atob(newH);
            self.isImg = false;
          }
          $(".icon-edit-overlay")
            .find(".svg-wra")
            .append(html);
          self.initSvg();
        }
      })
      .fail(function (error) {});
  }
  initSvg() {
    let isGradient =
      $(".icon-edit-overlay").find("svg linearGradient").length > 0;
    if (this.isImg || !this.opt.isVip || isGradient) {
      $(".icon-edit-overlay")
        .find(".icon-mask")
        .show();
      $("#col-pick").colpick({
        flat: true,
        layout: "hex",
        submit: 0,
        height: 200,
        color: "#000000"
      });
      if (isGradient) {
        $(".icon-edit-overlay")
          .find(".icon-mask p em")
          .text("当前图标含有渐变色，无法提供编辑功能");
      } else {
        var ht =
          '编辑图标功能仅适用于会员用户，是否需要 <a href="https://www.macw.com/vip.html"> 升级会员</a>';
        $(".icon-edit-overlay")
          .find(".icon-mask p em")
          .html(ht);
      }
      $(".icon-edit-overlay").on("click", ".edit-close", function (e) {
        $(".icon-edit-overlay").remove();
      });
      return;
    }
    var self = this,
      svgPaths = $(".icon-edit-overlay")
      .find("svg")
      .find("path, circle, ellipse, polygon, line, rect, polyline");

    this.colors = [];
    svgPaths.each(function (index, el) {
      var color = "";
      if ($(el).css("fill") != "none") {
        color = $(el).css("fill");
      } else {
        color = $(el).css("stroke");
      }

      if (
        self.__formatColor(color) == "" &&
        !isGradient &&
        color.indexOf("url") == -1
      ) {
        $(el).remove();
      }
      color = color[0] == "#" ? color : self.__formatColor(color);
      self.colors.push(color);
      $(el).attr("data-original", color);
    });
    self.colors = self.colors.reduce(function (accum, cur) {
      if (accum.indexOf(cur) === -1 && cur != "") accum.push(cur);
      return accum;
    }, []);
    var svgColorsHtml = this.initColorPath(this.colors);
    $(".icon-edit-overlay")
      .find(".color-path")
      .empty()
      .append(svgColorsHtml);
    $(".icon-edit-overlay")
      .find(".icon-original-color")
      .empty()
      .append(svgColorsHtml);
    $(".icon-edit-overlay")
      .find(".icon-last-color")
      .empty()
      .append("<p>暂无颜色选择记录</p>");
    if (this.opt.color) {
      this.initColorPick(self.colors[0], this.opt.color);
      this.changeSvgColor(this.opt.color);
    } else {
      this.initColorPick(self.colors[0]);
    }

    this.initEvents();
  }

  initEvents() {
    $(".icon-edit-overlay")
      .on("mouseover mouseout", this.iconMouseOver.bind(this))
      .on("click", this.iconPathClick.bind(this))
      .on("click", ".size-check", this.checkSize.bind(this))
      .on("change", ".size-check input", this.watchChange.bind(this));
  }

  checkSize(e) {
    e.stopPropagation();
    var $target = $(e.target);
    if ($target.is("p")) {
      toggleActive($target.closest("p"));
      $target
        .closest(".size-check")
        .find("input")
        .val($target.closest("p").data("size"));
      $target
        .closest(".size-check")
        .find(".size-wrap")
        .removeClass("active");
      return;
    }
    $target
      .closest(".size-check")
      .find(".size-wrap")
      .toggleClass("active");
  }

  watchChange(e) {
    var $target = $(e.target);
    if ($target.val() <= 0) {
      $target.val(1);
    } else if ($target.val() > 1024) {
      $target.val(1024);
    }
  }

  iconMouseOver(e) {
    var self = this,
      $target = $(e.target);
    if (
      e.target.matches(
        "path, circle, ellipse, rect, polygon, line, polyline"
      ) ||
      e.target.matches(".color-path li")
    ) {
      if (e.type == "mouseover") {
        if (e.target.matches(".color-path li")) {
          $target
            .closest(".icon-edit-overlay")
            .find("svg")
            .addSvgClass("hovered");
          self
            .__getByFillColor($target.attr("data-original"))
            .addSvgClass("hovered-path");
        } else {
          $target
            .closest(".icon-edit-overlay")
            .find("svg")
            .addSvgClass("hovered");

          $target.addSvgClass("hovered-path");
        }

      } else {
        $target
          .closest(".icon-edit-overlay")
          .find("svg")
          .removeSvgClass("hovered");
        self
          .__getByFillColor($target.attr("data-original"))
          .removeSvgClass("hovered-path");
      }
    }
  }

  iconPathClick(e) {
    var self = this,
      $target = $(e.target);
    $("#icon-size-sel .size-wrap").removeClass("active");
    if (
      e.target.matches(
        "path, circle, ellipse, rect, polygon, line, polyline"
      ) ||
      e.target.matches(".color-path li")
    ) {
      $(".icon-edit-overlay")
        .find(".active-path")
        .removeSvgClass("active-path");



      if (e.target.matches(".color-path li")) {
        self
          .__getByFillColor($target.attr("data-original"))
          .addSvgClass("active-path");
        self
          .__getByFillColorLi($target.attr("data-original"))
          .addClass("active")
          .siblings()
          .removeClass("active");
      } else {
        self
          .__getByFillColorLi($target.attr("data-original"))
          .removeClass("active");

        $target.addSvgClass("active-path");
      }


      var color;

      if ($target.is("li")) {
        color = $target.css("backgroundColor");
      } else {
        if ($target.css("fill") == "none") {
          color = $target.css("stroke");
        } else {
          color = $target.css("fill");
        }
      }

      color = color[0] == "#" ? color : self.__formatColor(color);
      $("#col-pick").colpickSetColor(color);
    }

    if (e.target.matches(".icon-last-color li, .icon-original-color li")) {
      var curColor = $target
        .attr("style")
        .replace(/fill:|;|background-color: /g, "");
      self.changeSvgColor(curColor);
      $("#col-pick").colpickSetColor(curColor);
    }

    if ($target.is(".edit-close")) {
      $(".icon-edit-overlay").unbind("click mouseout mouseover change");
      $(".icon-edit-overlay").remove();
    }

    if ($target.is("button")) {
      var format_type = $target.closest("button").data("type"),
        ids = JSON.stringify([this.opt.icon_id]),
        size = $("#icon-size-sel")
        .find("input")
        .val(),
        file = $(".icon-edit-overlay")
        .find(".svg-wra")
        .html();
      file = btoa(file);
      this.downloadIcons({
        ids: ids,
        size: size,
        format_type: format_type,
        svg_file: file
      });
    }

    if ($target.is(".icon-back")) {
      if (this.oldColor.length == 0) return;
      $(".icon-edit-overlay")
        .find("[data-original]")
        .each(function (index, el) {
          var styleColor = $(el).data("original");
          if ($(el).css("fill") == "none") {
            $(el).css("stroke", styleColor);
          } else {
            $(el).css("fill", styleColor);
          }
        });
      var curColor = $(".icon-edit-overlay")
        .find(".color-path li.active")
        .data("original");
      !!curColor && $("#col-pick").colpickSetColor(curColor);
    }
  }

  downloadIcons(data) {
    $.ajax({
        url: DOWNLOAD_API.download,
        type: "POST",
        data: data
      })
      .done(res => {
        if (res.code == 200) {
          if (data.format_type == "base64") {
            $.dialog({
              title: "base64&svg",
              boxWidth: "30%",
              type: "dark",
              useBootstrap: false,
              content: `<div class="base64-box">
								<p>base64</p>
								<textarea class="base-area"></textarea>
								<p>svg代码</p>
								<textarea class="svg-area"></textarea>
							</div>`,
              onContentReady: function () {
                let self = this;
                self.$content.find(".base-area").val(res.data);
                self.$content.find(".svg-area").val(atob(res.data));
                self.$content.find("textarea").on("click", function () {
                  $(this).select();
                  document.execCommand("Copy", true);
                  alertBox("已复制到剪贴板");
                });
              }
            });
            return;
          }
          window.location.href = res.url;
        } else if (res.code == 10005) {
          if (!this.recharge) {
            this.recharge = new Recharge(res);
          }
          this.recharge.init();
        } else {
          alertBox(res.msg);
        }
      })
      .fail(function (error) {
        console.log(error);
      });
  }

  initColorPath(data) {
    var self = this,
      newHtml = "",
      html =
      '<li class="{ isactive }" data-original="{ color }" style="background-color: { color }"></li>',
      ActiveName = "";
    data.forEach(function (v, i) {
      if (self.__isLight(v)) {
        ActiveName = "light";
      } else {
        ActiveName = "";
      }
      if (i == 0) {
        newHtml += html
          .replace(/{ color }/g, v)
          .replace("{ isactive }", ActiveName + "active");
      } else {
        newHtml += html
          .replace(/{ color }/g, v)
          .replace("{ isactive }", ActiveName);
      }
    });
    return newHtml;
  }

  __isLight(c) {
    if (!c) return false;
    var r = parseInt(c.substr(1, 2), 16);
    var g = parseInt(c.substr(3, 2), 16);
    var b = parseInt(c.substr(5, 2), 16);
    return r * 299 + g * 587 + b * 114 >= 225000;
  }

  __formatColor(c) {
    if (c.substr(0, 1) != "#" && c.substr(0, 3) != "rgb") return "";
    if (c.indexOf("rgb") != -1) {
      c = rgbToHex(
        c.split(",").map(function (c) {
          return ~~c.replace(/\D+/g, "");
        })
      );
    }
    c = c.toUpperCase();
    return c;

    function componentToHex(c) {
      var hex = c.toString(16);
      return hex.length == 1 ? "0" + hex : hex;
    }

    function rgbToHex(c) {
      return (
        "#" + componentToHex(c[0]) + componentToHex(c[1]) + componentToHex(c[2])
      );
    }
  }

  __getByFillColor(c) {
    return $(".icon-edit-overlay svg").find('[data-original="' + c + '"]');
  }

  __getByFillColorLi(c) {
    return $(".icon-edit-overlay .color-path").find(
      '[data-original="' + c + '"]'
    );
  }
}

export default IconEdit;