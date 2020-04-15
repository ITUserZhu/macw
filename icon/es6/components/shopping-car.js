import {
  SHOPPING_API
} from "../api";
import {
  toggleActive,
  confirmBox,
  alertBox
} from "../util";
import Recharge from "./recharge-box";

const shoppingCarHtml = `<aside class="shopping-car" id="shopping-car">
    <section class="shopping-box">
        <div class="shop-out left">
            <lord-icon animation="auto" src="/assets/json/back1.json"></lord-icon>
        </div>
        <div class="shop-out right">X</div>
        <div class="shop-container">
            <div class="shop-top">
                <div class="shop-out">
                    <lord-icon animation="loop" src="/assets/json/back3.json"></lord-icon>
                    <span>退出全屏</span>
                </div>
                <div class="shop-delete">删除文件夹</div>
                <div class="shop-add">添加文件夹</div>
                <div class="shop-rename">修改文件名</div>
            </div>
            <nav class="shop-nav">
                <div class="shop-nav-wrap"></div>
            </nav>
            <div class="shop-wraps">
                <ul>
                    <li class="none"></li>
                    <li class="none"></li>
                    <li class="none"></li>
                    <li class="none"></li>
                    <li class="none"></li>
                    <li class="none"></li>
                    <li class="none"></li>
                    <li class="none"></li>
                    <li class="none"></li>
                    <li class="none"></li>
                    <li class="none"></li>
                    <li class="none"></li>
                    <li class="none"></li>
                    <li class="none"></li>
                    <li class="none"></li>
                    <li class="none"></li>
                    <li class="none"></li>
                </ul>
                <div class="no-shop-content">暂无数据，赶紧去添加吧！</div>
            </div>
        </div>
    </section>
    <section class="shopping-bot">
        <div class="shop-operate">
            <button class="shop-empty"><i class="icon-del"></i>清空购物车</button>
            <div class="fr shop-down">
                <span>共计：<em>0</em> 个图标</span>
                <button class="shop-download">立即下载</button>
            </div>
        </div>
    </section>
</aside>`;

let iconHtml = `<li data-id="{ id }">
    <a href="{ url }" title="{ title }" class="pjax-item">
        <div class="img"><img src="{ thumb }"></div>
        <div class="mask">
            <i class="icon-vip2 { is_vip }"></i>
            <div class="operate">
                <i class="icon-del"></i>
            </div>
        </div>
    </a>
</li>`;

// 侧边购物车功能
class ShoppingCar {
  constructor() {}

  init() {
    if (!$("#shopping-car").length) {
      this.initShopBox();
      this.initVars();
      this.getShopFolder();
      this.initEvents();
    } else {
      this.showShoppingCar();
    }
  }

  initVars() {
    this.defaultVars = {
      curFolderId: 0,
      defaultId: 0
    };

    // 当前收藏夹内容数据
    this.curFolderIconsIdData = [];

    this.shoppingHooks = {
      $container: $("#shopping-car"),
      $out: $(".shop-out"),
      $nav: $(".shop-nav-wrap"),
      $wrap: $(".shop-wraps").find("ul"),
      $curNum: $(".shop-down").find("em"),
      $download: $(".shop-download"),
      $empty: $(".shop-empty"),
      $delFolder: $(".shop-delete"),
      $addFolder: $(".shop-add"),
      $renameFolder: $(".shop-rename")
    };
  }

  initShopBox() {
    $("main").append(shoppingCarHtml);
    $(window).scrollTop(0);
    setTimeout(() => {
      $("#shopping-car").addClass("active");
      $("body").addClass("ovh");
    }, 0);
  }
  // 初始事件
  initEvents() {
    // 关闭窗口
    this.shoppingHooks.$out.on("click", this.hideShoppingCar.bind(this));
    // 切换购物车文件夹
    this.shoppingHooks.$nav.on("click", "span", e => {
      let $target = $(e.target).closest("span");
      if ($target.hasClass("active")) return;
      let id = $target.data("id");
      this.getFolderIcons(id);
    });
    // 删除购物车图标
    this.shoppingHooks.$wrap.on("click", "li", this.removeIcon.bind(this));
    // 清空当前购物车
    this.shoppingHooks.$empty.on("click", this.clearCurShopCar.bind(this));
    // 删除文件夹
    this.shoppingHooks.$delFolder.on("click", this.removeFolder.bind(this));
    // 添加文件夹
    this.shoppingHooks.$addFolder.on("click", this.addFolder.bind(this));
    // 改名文件夹
    this.shoppingHooks.$renameFolder.on("click", this.renameFolder.bind(this));
    // 下载文件夹
    this.shoppingHooks.$download.on("click", this.downloadPackage.bind(this));
  }
  // 清空当前购物车数据
  clearCurShopCar() {
    if (!this.curFolderIconsIdData.length) return;
    let ids = JSON.stringify(this.curFolderIconsIdData);
    confirmBox("确定清空当前购物车？", () => {
      $.ajax({
        url: SHOPPING_API.del_icon,
        type: "POST",
        data: {
          icon_id: ids,
          favorites_id: this.defaultVars.curFolderId
        }
      }).done(res => {
        if (res.code == 200) {
          this.shoppingHooks.$wrap
            .hide()
            .next()
            .show();
          this.toRemoveActive();
          this.allLenNum -= this.curFolderIconsIdData.length;
          this.changeNumAnimate();
        } else {
          alertBox(res.msg);
        }
      });
    });
  }
  // 删除文件夹
  removeFolder() {
    confirmBox("确定删除当前文件夹？", () => {
      $.ajax({
        url: SHOPPING_API.del_folder,
        type: "POST",
        data: {
          favorites_id: this.defaultVars.curFolderId
        }
      }).done(res => {
        if (res.code == 200) {
          this.toRemoveActive();
          this.getShopFolder(true);
          this.allLenNum -= this.curFolderIconsIdData.length;
          this.changeNumAnimate();
        } else {
          alertBox(res.msg);
        }
      });
    });
  }
  // 添加文件夹
  addFolder() {
    let _this = this;
    confirmBox(
      `<form class="shop-form">
                <div class="form-group">
                    <label>输入文件名</label>
                    <input type="text" placeholder="文件名" value="文件夹标题" class="name form-control" required />
                </div>
            </form>
            `,
      function () {
        let val = this.$content.find(".name").val();
        if (!val) {
          alertBox("请填写文件名！");
          return false;
        }
        if (_this.shoppingHooks.$nav.children().length >= 5) {
          alertBox("最多拥有5个文件夹");
          return false;
        }
        _this.editFolderName({
          title: val
        });
      }, {
        title: "添加文件夹",
        buttons: {
          sure: {
            text: "提交",
            btnClass: "btn-blue"
          }
        },
        onContentReady: function () {
          let self = this;
          self.$content.find("form input").focus();
          self.$content.find("form").on("submit", e => {
            e.preventDefault();
            self.$$sure.trigger("click");
          });
        }
      }
    );
  }
  // 修改文件名
  renameFolder() {
    let _this = this;
    let curName = _this.shoppingHooks.$nav.find(".active").text();
    confirmBox(
      `<form class="shop-form">
                <div class="form-group">
                    <label>输入文件名</label>
                    <input type="text" placeholder="文件名" value="${curName}" class="name form-control" required />
                </div>
            </form>
            `,
      function () {
        let val = this.$content.find(".name").val();
        if (!val) {
          alertBox("请填写文件名！");
          return false;
        }
        _this.editFolderName({
          title: val,
          favorites_id: _this.defaultVars.curFolderId
        });
      }, {
        title: "修改文件名",
        buttons: {
          sure: {
            btnClass: "btn-blue"
          }
        },
        onContentReady: function () {
          let self = this;
          self.$content.find("form input").focus();
          self.$content.find("form").on("submit", e => {
            e.preventDefault();
            self.$$sure.trigger("click");
          });
        }
      }
    );
  }
  editFolderName(data) {
    $.ajax({
      url: SHOPPING_API.change_folder,
      type: "POST",
      data
    }).done(res => {
      if (res.code == 200) {
        if (!data.favorites_id) {
          this.defaultVars.curFolderId = res.data.id;
          this.shoppingHooks.$nav.append(
            `<span data-id="${res.data.id}">${res.data.title}</span>`
          );
          this.getFolderIcons(res.data.id);
        } else {
          this.shoppingHooks.$nav.find(".active").text(data.title);
        }
      } else {
        alertBox(res.msg);
      }
    });
  }
  // 移除图标
  removeIcon(e) {
    if (
      $(e.target)
      .closest(".operate")
      .is(".operate")
    ) {
      e.preventDefault();
      const $target = $(e.target).closest("li");
      let id = $target.data("id");
      this.removeIconAjax({
          icon_id: id,
          favorites_id: this.defaultVars.curFolderId
        },
        $target
      );
    }
  }
  // 移除请求
  removeIconAjax(data, $dom = null, $el = null) {
    $.ajax({
      url: SHOPPING_API.del_icon,
      type: "POST",
      data
    }).done(res => {
      if (res.code == 200) {
        if (data.favorites_id) {
          !!$dom && $dom.remove();
          this.curFolderIconsIdData.splice(
            $.inArray(data.icon_id, this.curFolderIconsIdData),
            1
          );
          this.shoppingHooks.$curNum.text(
            this.shoppingHooks.$curNum.text() - 1
          );
          this.toRemoveActive([data.icon_id]);
        } else {
          !!$el && $el.removeClass("active");
          this.hasChangeShopping = true;
        }
        this.allLenNum--;
        this.changeNumAnimate();
      }
    });
  }
  // 添加购物车请求
  addIconAjax(data, $el) {
    if (this.defaultVars) {
      data.favorites_id = this.defaultVars.curFolderId;
    }
    $.ajax({
      url: SHOPPING_API.add_icon,
      type: "POST",
      data
    }).done(res => {
      if (res.code == 200) {
        $el.addClass("active");
        this.hasChangeShopping = true;
        this.allLenNum++;
        this.changeNumAnimate();
      } else if (res.code == 400 || res.code == 500) {
        $(".login-login").trigger("click");
      } else {
        if (res.msg == "该图标您已经收藏") {
          $el.addClass("active");
          return;
        }
        alert(res.msg);
      }
    });
  }
  // 获取购物车包目录
  getShopFolder(flag = false) {
    if (!this.shoppingHooks.$nav.children().length || flag) {
      $.ajax({
        url: SHOPPING_API.get_folder,
        type: "POST"
      }).done(res => {
        if (res.code == 200) {
          this.renderFolder(res.data);
        }
      });
    }
  }
  // 渲染购物车包目录
  renderFolder(data) {
    let html = "";
    data.forEach(v => {
      if (v.is_default) {
        this.defaultVars.defaultId = v.id;
      }
      html += `<span class="${
        v.id == this.defaultVars.defaultId ? "active" : ""
      }" data-id="${v.id}">${v.title}</span>`;
    });
    this.defaultVars.curFolderId = this.defaultVars.defaultId;
    this.shoppingHooks.$nav.empty().append(html);
    this.getFolderIcons();
  }
  // 获取包内容
  getFolderIcons(id = this.defaultVars.defaultId) {
    this.defaultVars.curFolderId = id;
    this.shoppingHooks.$nav.children().each((i, v) => {
      if ($(v).data("id") == id) {
        toggleActive($(v));
      }
    });
    $.ajax({
      url: SHOPPING_API.get_foler_icons,
      type: "POST",
      data: {
        favorites_id: id,
        page_size: 500
      }
    }).done(res => {
      if (res.code == 200) {
        this.renderIcons(res);
      }
    });
  }
  // 渲染包内容图标
  renderIcons(res) {
    let html = "";
    this.curFolderIconsIdData = [];
    this.shoppingHooks.$curNum.text(res.icon_total);
    if (res.icon_total == 0) {
      this.shoppingHooks.$wrap
        .hide()
        .next()
        .show();
      return;
    }
    res.data.forEach(el => {
      this.curFolderIconsIdData.push(el.icon_id);
      html += iconHtml
        .replace("{ id }", el.icon_id)
        .replace("{ url }", el.url)
        .replace("{ thumb }", el.thumb)
        .replace("{ title }", el.title)
        .replace("{ is_vip }", el.premium == 1 ? "vip" : "");
    });
    this.shoppingHooks.$wrap
      .children("li")
      .not(".none")
      .remove()
      .end()
      .parent()
      .prepend(html)
      .show()
      .next()
      .hide();
  }
  // 获取所有收藏数据id
  getAllShoppingIds(dom) {
    $.ajax({
      url: SHOPPING_API.get_icons,
      type: "POST"
    }).done(res => {
      if (res.code == 200) {
        this.allShoppingIconsId = res.data;
        this.allLenNum = res.data.length;
        !!dom && this.toAddActive(dom);
        this.changeNumAnimate();
      }
    });
  }
  // 页面添加选中状态
  toAddActive($dom = null) {
    if (
      $("#con-shop").length &&
      this.allShoppingIconsId.indexOf($("#con-shop").data("id")) != -1
    ) {
      $("#con-shop").addClass("active");
    }
    if ($dom.length) {
      $dom.each((i, v) => {
        if (this.allShoppingIconsId.indexOf($(v).data("id")) != -1) {
          $(v).addClass("active");
        }
      });
    }
  }
  // 页面去除选中状态
  toRemoveActive(arr = this.curFolderIconsIdData) {
    if ($("#con-shop").length && arr.indexOf($("#con-shop").data("id"))) {
      $("#con-shop").removeClass("active");
    }
    $(".hasicons")
      .children("li")
      .not(".none")
      .each((i, v) => {
        if (arr.indexOf($(v).data("id")) != -1) {
          $(v).removeClass("active");
        }
      });
  }
  changeNumAnimate() {
    $(".other-shoping")
      .find(".shop-num")
      .text(this.allLenNum)
      .addClass("animate");
    setTimeout(() => {
      $(".other-shoping")
        .find(".shop-num")
        .removeClass("animate");
    }, 400);
  }
  // 下载
  downloadPackage() {
    let _this = this;
    confirmBox(
      `<div class="shop-type-choose">
            <form>
                <label for="radio-all" class="active"><input type="radio" name="type" value="all" id="radio-all" checked>所有格式</label>
                <label for="radio-png"><input type="radio" name="type" value="png" id="radio-png"> PNG</label>
                <label for="radio-svg"><input type="radio" name="type" value="svg" id="radio-svg"> SVG</label>
                <label for="radio-eps"><input type="radio" name="type" value="eps" id="radio-eps"> EPS</label>
                <label for="radio-ico"><input type="radio" name="type" value="ico" id="radio-ico"> ICO</label>
                <label for="radio-psd"><input type="radio" name="type" value="psd" id="radio-psd"> PSD</label>                
            </form>
        </div>`,
      function () {
        let $form = this.$content.find("form");
        let type = $form.find("input[type='radio']:checked").val();
        _this.downIconAjax(type);
      }, {
        title: "下载格式选择",
        boxWidth: "350px",
        buttons: {
          sure: {
            text: "下载",
            btnClass: "btn-blue"
          }
        },
        onContentReady: function () {
          let self = this;
          let $label = self.$content.find("label");
          $label.on("click", function () {
            toggleActive($(this));
          });
        }
      }
    );
  }
  // 下载请求
  downIconAjax(type) {
    let ids = JSON.stringify(this.curFolderIconsIdData);
    $.ajax({
      url: SHOPPING_API.pay_package,
      type: "POST",
      data: {
        ids,
        format_type: type
      }
    }).done(res => {
      if (res.code == 200) {
        window.location.href = res.url;
      } else if (res.code == 10005) {
        if (!this.shopRecharge) {
          this.shopRecharge = new Recharge(res);
        }
        this.shopRecharge.init();
      } else {
        alertBox(res.msg);
      }
    });
  }
  // 隐藏购物车
  hideShoppingCar() {
    $("body").removeClass("ovh");
    this.shoppingHooks.$container.removeClass("active");
    this.hasChangeShopping = false;
  }
  // 展开购物车
  showShoppingCar() {
    $(window).scrollTop(0);
    this.shoppingHooks.$container.addClass("active");
    $("body").addClass("ovh");
    if (this.hasChangeShopping && this.defaultVars) {
      this.getFolderIcons(this.defaultVars.curFolderId);
    }
  }
}

const shoppingCar = new ShoppingCar();

export default shoppingCar;