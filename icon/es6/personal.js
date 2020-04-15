import "./components/common";
import "./jq-plugins/serialize";
import QRcode from "qrcode";
import * as util from "./util";
import { PERSONAL_API, SHOPPING_API, VIP_RECHARGE, SIGN_API } from "./api";
import Lottery from "./components/lottery";

(() => {
  class Personal {
    constructor() {}

    init() {
      this.initDoms();
      this.initHtml();
      this.initAjaxFilter();
    }

    initDoms() {
      // 公用
      this.pubHooks = {
        $sign: $("#sign-btn"),
        $nickName: $(".nickname")
      };
      // 菜单与容器元素
      this.navCheckHooks = {
        $asideNav: $(".user-menu").find("ul"),
        $articleContents: $(".user-article")
      };
      // 个人中心
      this.adminHook = {
        $renew: $("#renew"),
        $renewBox: $("#renew-box"),
        $aliImg: $("#renew-box").find(".alipay img"),
        $wxImg: $("#renew-box").find(".wxpay img")
      };
      // 个人资料
      this.infoHook = {
        $form: $("#per-info")
      };
      // 下载历史
      this.downloadHooks = {
        $ulWrap: $("#download-history"),
        $pagi: $("#download-pagi"),
        $select: $("#donload-select")
      };
      // 我的收藏
      this.collectHooks = {
        $nav: $("#col-nav-wrap"),
        $ulWrap: $("#collect-wrap"),
        $pagi: $("#collect-pagi"),
        $curNum: $("#collect-nums em"),
        $editFolder: $(".collect-edit"),
        $delFolder: $(".collect-del")
      };
      // 充值记录
      this.rechargeHooks = {
        $table: $("#recharge-table"),
        $pagi: $("#recharge-pagi"),
        $select: $("#recharge-select")
      };
      // 优惠券
      this.couponHooks = {
        $ulWrap: $("#coupon-wrap"),
        $pagi: $("#coupon-pagi"),
        $select: $("#coupon-select")
      };
      // 系统消息
      this.sysInfoHooks = {
        $table: $("#sys-info"),
        $pagi: $("#sysinfo-pagi")
      };
      // 问题反馈
      this.reportHooks = {
        $form: $("#news-support"),
        $tips: $("#news-support").find(".news-tips")
      };
      // 翻页按钮
      this.pagiHooks = {
        $dom: $(".ajax-pagination")
      };
      // 初始按钮事件
      this.initPagiEvent();
      // 初始签到功能
      this.initSignEvent();
    }

    initAjaxFilter() {
      this.defaultVars = {
        page: 1,
        curFolderId: 0,
        defaultId: 0
      };
      this.downloadAjax = {
        page: 1,
        add_time: "all"
      };

      this.rechargeAjax = {
        page: 1,
        time: "all"
      };

      this.couponAjax = {
        page: 1,
        status: "-1"
      };
    }

    initHtml() {
      this.iconHtml = `<li data-id="{ id }">
                <a href="{ url }">
                    <div class="img"><img src="{ src }" alt="{ title }"></div>
                    <div class="mask">
                        <i class="icon-vip2 { isVip }"></i>
                        <div class="operate">
                            <span class="collect operate-btn">
                                <lord-icon class="addshop" animation="loop" src="/assets/json/shop1.json"></lord-icon>
                                <lord-icon class="delshop" animation="loop" src="/assets/json/removeshop.json"></lord-icon>
                            </span>
                            <span class="download operate-btn">
                                <lord-icon animation="auto" src="/assets/json/download2.json"></lord-icon>
                            </span>
                        </div>
                    </div>
                </a>
            </li>`;

      this.colIconHtml = `<li data-id="{ id }">
                <a href="{ url }" title="{ title }">
                    <div class="img"><img src="{ thumb }"></div>
                    <div class="mask">
                        <i class="icon-vip2 { is_vip }"></i>
                        <div class="operate">
                            <i class="icon-del"></i>
                        </div>
                    </div>
                </a>
            </li>`;

      this.rechargeHtml = `<tr>
                <td>{ time }</td>
                <td>{ content }</td>
                <td>{ type }</td>
                <td>{ money }元</td>
            </tr>`;

      this.couponHtml = `<li class="{ is_over }">
                <div class="over-text">已过期</div>
                <div class="coupon-info fl">
                    <p>VIP优惠券</p>
                    <p class="min-price">满{ min_price }元可使用</p>
                    <span>{ time }前有效</span>
                </div>
                <div class="coupon-price fr">
                    <em>￥</em>
                    <span>{ price }</span>
                </div>
            </li>`;

      this.sysInfoHtml = `<tr>
                <td class="{ has_read }"><i class="icon-letter"></i><i class="icon-letter2"></i></td>
                <td>{ time }</td>
                <td>系统消息</td>
                <td>{ content }</td>
            </tr>`;

      this.noIconsHtml = `<p class="no-data">暂无数据</p>`;
      this.noTableHtml =
        '<tr class="no-data"><td colspan="5">暂无数据</td></tr>';
    }

    // hash变更切换展示
    hashChange(hash) {
      let hashs = this.navCheckHooks.$asideNav.children("li").map((i, v) => {
        return v.className.split(" ")[0].replace("nav-", "");
      });

      let newHash = hash.split("-")[0],
        hashNum = hash.split("-")[1] || 0;

      hashs = Array.from(hashs);

      if (!hashs.includes(newHash)) {
        window.location.hash = "#/" + hashs[0] + "-1";
        return;
      }
      util.toggleActive([
        this.navCheckHooks.$asideNav.find(".nav-" + newHash),
        this.navCheckHooks.$asideNav
          .find(".nav-" + newHash)
          .find(".child-nav")
          .children()
          .not("span")
          .eq(hashNum),
        this.navCheckHooks.$articleContents.find(".sec-" + newHash),
        this.navCheckHooks.$articleContents
          .find(".sec-" + newHash)
          .children()
          .eq(hashNum)
      ]);

      this.changeNavGetData(hash);
    }

    changeNavGetData(hash) {
      switch (hash) {
        case "admin":
          if (!this.hasInitAdmin) {
            this.initAdminEvent();
            this.hasInitAdmin = true;
          }
          break;
        case "admin-1":
          if (!this.hasInitUserInfo) {
            this.initUserInfoEvent();
            this.hasInitUserInfo = true;
          }
          break;
        case "collect":
          if (!this.hasInitCollect) {
            this.initCollect();
            this.hasInitCollect = true;
          }
          break;
        case "download":
          if (!this.hasGetDownload) {
            this.initDownloadEvent();
            this.getDownloadData();
            this.hasGetDownload = true;
          }
          break;
        case "center":
          if (!this.hasGetRecharge) {
            this.initRechargeEvent();
            this.getRechargeData();
            this.hasGetRecharge = true;
          }
          break;
        case "center-1":
          if (!this.hasGetCoupon) {
            this.initCouponEvent();
            this.getCouponData();
            this.hasGetCoupon = true;
          }
          break;
        case "info":
          if (!this.hasGetSysInfo) {
            this.getsysInfo();
            this.hasGetSysInfo = true;
          }
          break;
        case "info-1":
          if (!this.hasInitReport) {
            this.initReportEvent();
            this.hasInitReport = true;
          }
          break;
        default:
          break;
      }
    }
    // 签到事件
    initSignEvent() {
      this.pubHooks.$sign.on("click", () => {
        if ($("#lottery").length) {
          $("#lottery").show();
        } else {
          this.getSignPrizeAjax();
        }
      });
    }
    getSignPrizeAjax() {
      $.ajax({
        url: SIGN_API.data,
        type: "POST"
      }).done(res => {
        if (res.code == 200) {
          const letter = new Lottery(
            () => {
              return new Promise((resolve, reject) => {
                $.ajax({
                  url: SIGN_API.sign,
                  type: "POST",
                  success: function(res) {
                    if (res.code == 200) {
                      resolve(res.id);
                    } else {
                      reject(res.msg);
                    }
                  }
                });
              });
            },
            {
              speed: 200,
              cycle: 10
            }
          );

          letter.init(res.data, res.is_sign);
        } else {
          alert(res.msg);
        }
      });
    }
    // 注册续费事件
    initAdminEvent() {
      this.adminHook.$renew.on("click", () => {
        this.adminHook.$renewBox.show();
        this.getPayOk();
        this.getPayEwm();
      });
      this.adminHook.$renewBox.on("click", ".close-renew", () => {
        clearInterval(this.isPayOkInterval);
        this.adminHook.$renewBox.hide();
      });
    }
    // 获取充值二维码
    getPayEwm() {
      const pay_id = this.adminHook.$renewBox.find(".renew-price").data("id");
      for (let index = 0; index < 2; index++) {
        let dom = index ? this.adminHook.$wxImg : this.adminHook.$aliImg;

        $.ajax({
          url: index ? VIP_RECHARGE.wx_pay : VIP_RECHARGE.ali_pay,
          type: "POST",
          data: {
            id: pay_id,
            coupon_relation_id: 0,
            point_type: 2
          }
        }).done(res => {
          if (res.code == 200) {
            QRcode.toDataURL(res.msg, {
              width: 128,
              margin: 1
            }).then(url => {
              dom.attr("src", url);
            });
          } else {
            alert(res.msg);
          }
        });
      }
    }

    getPayOk() {
      this.isPayOkInterval = setInterval(function() {
        $.ajax({
          url: VIP_RECHARGE.pay_ok,
          type: "GET",
          success: function(msg) {
            if (msg.code == 200) {
              $("body").append(
                '<div id="payok" style="width: 400px; z-index: 9999; height: 250px; padding: 25px; box-sizing: border-box; background: #fff; border-radius: 10px; position: fixed; top: 0; left: 0; right: 0; bottom: 0; margin: auto; text-align: center; font-size: 16px; box-shadow: 0 0 20px 0 rgba(0,0,0,.2)"><img src="/assets/images/payok.png" width="70"><p style="font-size: 20px; margin: 20px 0 25px;">充值成功</p><a href="/" style="display: inline-block; margin: 0 15px; width: 145px; height: 40px; line-height: 40px; border-radius: 5px; border: 1px solid #4fbafe; box-sizing: border-box;">返回首页</a><a href="javascript: window.location.reload();" style="display: inline-block; margin: 0 15px; width: 145px; height: 40px; line-height: 40px; border-radius: 5px; background: #4fbafe; color: #fff;">确定</a></div>'
              );
              setTimeout(function() {
                window.location.reload();
              }, 5000);
            }
            return;
          }
        });
      }, 10000);
    }

    // 初始所有翻页功能按钮
    initPagiEvent() {
      this.pagiHooks.$dom.on("click", e => {
        let $target = $(e.target).closest("div");
        if (!$(e.target).hasClass("active")) {
          let $active = $target.find(".active"),
            curNum = Number($active.text()),
            context = "#" + $target.attr("id"),
            total = $target.data("total");
          switch ($(e.target)[0].className) {
            case "prev":
              if (curNum == 1) return;
              this.checkPage(curNum - 1, context);
              break;
            case "next":
              if (curNum == total) return;
              this.checkPage(curNum + 1, context);
              break;
            case "num":
              this.checkPage($(e.target).text(), context);
              break;
            default:
              break;
          }
        }
      });
    }
    // 翻页获取数据
    checkPage(num, context) {
      const $target = $(".num", context).filter(v => {
        return $(v).text() == num;
      });
      switch (context) {
        case "#collect-pagi":
          this.defaultVars.page = num;
          this.getFolderIcons();
          break;
        case "#download-pagi":
          this.downloadAjax.page = num;
          this.getDownloadData();
          break;
        case "#recharge-pagi":
          this.rechargeAjax.page = num;
          this.getRechargeData();
          break;
        case "#coupon-pagi":
          this.couponAjax.page = num;
          this.getCouponData();
          break;
        case "#sysinfo-pagi":
          this.getsysInfo(num);
          break;
        default:
          break;
      }

      util.toggleActive($target);
    }
    // 初始个人信息事件功能
    initUserInfoEvent() {
      this.infoHook.$form
        .change(function() {
          $(this)
            .find("button")
            .removeClass("disabeld");
        })
        .on("submit", this.editInfo.bind(this));
    }
    // 修改个人信息资料提交
    editInfo(e) {
      e.preventDefault();
      if (
        !$(e.target)
          .find("button")
          .hasClass("disabeld")
      ) {
        const data = $(e.target).serializeObject();
        data.autograph = util.htmlFormat(data.autograph);
        $.ajax({
          url: PERSONAL_API.edit,
          type: "POST",
          data
        }).done(res => {
          if (res.code == 200) {
            alert("修改成功");
            this.pubHooks.$nickName.add(".user-name span").text(data.nickname);
            $(e.target)
              .find("button")
              .addClass("disabeld");
          }
        });
      }
    }
    // 初始化收藏
    initCollect() {
      this.getShopFolder();
      this.initCollectEvent();
    }
    // 收藏功能事件
    initCollectEvent() {
      // 切换购物车文件夹
      this.collectHooks.$nav.on("click", "span", e => {
        let $target = $(e.target).closest("span");
        if ($target.hasClass("active")) return;
        if ($target.hasClass("collect-add")) {
          this.addFolder();
        } else {
          let id = $target.data("id");
          this.getFolderIcons(id, 1);
        }
      });
      // 删除图标
      this.collectHooks.$ulWrap.on("click", "li", this.removeIcon.bind(this));
      // 编辑文件夹
      this.collectHooks.$editFolder.on("click", this.renameFolder.bind(this));
      // 删除文件夹
      this.collectHooks.$delFolder.on("click", this.removeFolder.bind(this));
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
        this.removeIconAjax(
          {
            icon_id: id,
            favorites_id: this.defaultVars.curFolderId
          },
          $target
        );
      }
    }
    // 移除请求
    removeIconAjax(data, $dom = null) {
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
            this.folderAllNum--;
            this.collectHooks.$curNum.text(
              this.collectHooks.$curNum.text() - 1
            );
          }
          this.changeNumAnimate(1);
        }
      });
    }
    // 添加文件夹
    addFolder() {
      let _this = this;
      util.confirmBox(
        `<form class="shop-form">
                    <div class="form-group">
                        <label>输入文件名</label>
                        <input type="text" placeholder="文件名" value="文件夹标题" class="name form-control" required />
                    </div>
                </form>
                `,
        function() {
          let val = this.$content.find(".name").val();
          if (!val) {
            util.alertBox("请填写文件名！");
            return false;
          }
          if (_this.collectHooks.$nav.children().length >= 6) {
            util.alertBox("最多拥有5个文件夹");
            return false;
          }
          _this.editFolderName({
            title: val
          });
        },
        {
          title: "添加文件夹",
          buttons: {
            sure: {
              text: "提交",
              btnClass: "btn-blue"
            }
          },
          onContentReady: function() {
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
      let curName = _this.collectHooks.$nav.find(".active").text();
      util.confirmBox(
        `<form class="shop-form">
                    <div class="form-group">
                        <label>输入文件名</label>
                        <input type="text" placeholder="文件名" value="${curName}" class="name form-control" required />
                    </div>
                </form>
                `,
        function() {
          let val = this.$content.find(".name").val();
          if (!val) {
            util.alertBox("请填写文件名！");
            return false;
          }
          _this.editFolderName({
            title: val,
            favorites_id: _this.defaultVars.curFolderId
          });
        },
        {
          title: "修改文件名",
          buttons: {
            sure: {
              btnClass: "btn-blue"
            }
          },
          onContentReady: function() {
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
            this.defaultVars.page = 1;
            this.collectHooks.$nav.prepend(
              `<span data-id="${res.data.id}"><i class="icon-file"></i>${res.data.title}</span>`
            );
            this.getFolderIcons(res.data.id);
          } else {
            this.collectHooks.$nav
              .find(".active")
              .html('<i class="icon-file"></i>' + data.title);
          }
        } else {
          util.alertBox(res.msg);
        }
      });
    }
    // 删除文件夹
    removeFolder() {
      util.confirmBox("确定删除当前文件夹？", () => {
        $.ajax({
          url: SHOPPING_API.del_folder,
          type: "POST",
          data: {
            favorites_id: this.defaultVars.curFolderId
          }
        }).done(res => {
          if (res.code == 200) {
            this.getShopFolder();
            this.changeNumAnimate(this.folderAllNum);
          } else {
            util.alertBox(res.msg);
          }
        });
      });
    }
    // 获取收藏文件夹
    getShopFolder() {
      $.ajax({
        url: SHOPPING_API.get_folder,
        type: "POST"
      }).done(res => {
        if (res.code == 200) {
          this.renderFolder(res.data);
        } else {
          util.alertBox(res.msg);
        }
      });
    }

    // 渲染购物车包目录
    renderFolder(data) {
      let html = "";
      data.forEach(v => {
        if (v.is_default) {
          this.defaultVars.defaultId = v.id;
        }
        html += `<span data-id="${v.id}"><i class="icon-file"></i>${v.title}</span>`;
      });
      this.defaultVars.curFolderId = this.defaultVars.defaultId;
      this.defaultVars.page = 1;
      this.collectHooks.$nav
        .find("span")
        .not(".collect-add")
        .remove()
        .end()
        .parent()
        .prepend(html);
      this.getFolderIcons();
    }
    // 获取包内容
    getFolderIcons(
      id = this.defaultVars.defaultId,
      page = this.defaultVars.page
    ) {
      this.defaultVars.curFolderId = id;
      this.defaultVars.page = page;
      this.collectHooks.$nav.children().each((i, v) => {
        if ($(v).data("id") == id) {
          util.toggleActive($(v));
        }
      });
      $.ajax({
        url: SHOPPING_API.get_foler_icons,
        type: "POST",
        data: {
          favorites_id: id,
          page_num: page
        }
      }).done(res => {
        if (res.code == 200 && res.data.length) {
          this.renderIcons(res);
          let totalPage = Math.ceil(res.icon_total / 36);
          totalPage >= 1 &&
            this.createPagi(totalPage, page, this.collectHooks.$pagi) &&
            this.collectHooks.$pagi.attr("data-total", totalPage);
        } else {
          this.collectHooks.$ulWrap
            .children()
            .not(".none")
            .remove()
            .end()
            .parent()
            .prepend(this.noIconsHtml);
          this.collectHooks.$pagi.empty();
          this.collectHooks.$curNum.text(0);
        }
      });
    }
    // 渲染包内容图标
    renderIcons(res) {
      let html = "";
      this.curFolderIconsIdData = [];
      this.folderAllNum = res.icon_total;
      this.collectHooks.$curNum.text(this.folderAllNum);

      res.data.forEach(el => {
        this.curFolderIconsIdData.push(el.icon_id);
        html += this.colIconHtml
          .replace("{ id }", el.icon_id)
          .replace("{ url }", el.url)
          .replace("{ thumb }", el.thumb)
          .replace("{ title }", el.title)
          .replace("{ is_vip }", el.premium == 1 ? "vip" : "");
      });
      this.collectHooks.$ulWrap
        .children()
        .not(".none")
        .remove()
        .end()
        .parent()
        .prepend(html);
    }
    changeNumAnimate(num) {
      let allnum =
        $(".other-shoping")
          .find(".shop-num")
          .text() - num;
      $(".other-shoping")
        .find(".shop-num")
        .text(allnum)
        .addClass("animate");
      setTimeout(() => {
        $(".other-shoping")
          .find(".shop-num")
          .removeClass("animate");
      }, 400);
    }
    // 初始下载筛选事件
    initDownloadEvent() {
      this.downloadHooks.$select.on("change", e => {
        this.downloadAjax.add_time = $(e.target).val();
        this.downloadAjax.page = 1;
        this.getDownloadData();
      });
    }

    // 获取下载历史
    getDownloadData(data = this.downloadAjax) {
      $.ajax({
        url: PERSONAL_API.download_history,
        type: "POST",
        data: data
      }).done(res => {
        if (res.code == 200 && res.down_list.length) {
          this.downloadHooks.$ulWrap
            .find("li")
            .not(".none")
            .remove()
            .end()
            .closest("ul")
            .prepend(this.dealIconsList(res.down_list));
          let totalPage = Math.ceil(res.down_num / 36);
          totalPage > 1 &&
            this.createPagi(totalPage, page, this.downloadHooks.$pagi) &&
            this.downloadHooks.$pagi.attr("data-total", totalPage);
        } else {
          this.downloadHooks.$ulWrap.empty().prepend(this.noIconsHtml);
          this.downloadHooks.$pagi.empty();
        }
      });
    }
    // 初始充值事件
    initRechargeEvent() {
      this.rechargeHooks.$select.on("change", e => {
        this.rechargeAjax.time = $(e.target).val();
        this.rechargeAjax.page = 1;
        this.getRechargeData();
      });
    }
    // 获取充值记录
    getRechargeData(data = this.rechargeAjax) {
      $.ajax({
        url: PERSONAL_API.pay_history,
        type: "POST",
        data: data
      }).done(res => {
        if (res.code == 200 && res.pay_account_info.length) {
          this.rechargeHooks.$table.html(
            this.dealrechargeList(res.pay_account_info)
          );
          let totalPage = Math.ceil(res.pay_account_num / 10);
          totalPage > 1 &&
            this.createPagi(totalPage, page, this.rechargeHooks.$pagi) &&
            this.rechargeHooks.$pagi.attr("data-total", totalPage);
        } else {
          this.rechargeHooks.$table.empty().prepend(this.noTableHtml);
          this.rechargeHooks.$pagi.empty();
        }
      });
    }
    // 初始优惠券筛选功能
    initCouponEvent() {
      this.couponHooks.$select.on("change", e => {
        this.couponAjax.status = $(e.target).val();
        this.couponAjax.page = 1;
        this.getCouponData();
      });
    }

    // 获取优惠券
    getCouponData(data = this.couponAjax) {
      $.ajax({
        url: PERSONAL_API.coupon,
        type: "POST",
        data
      }).done(res => {
        if (res.code == 200 && res.coupon_info.length) {
          this.couponHooks.$ulWrap
            .empty()
            .append(this.dealCouponList(res.coupon_info));
          let totalPage = Math.ceil(res.total / 9);
          totalPage > 1 &&
            this.createPagi(totalPage, data.page, this.couponHooks.$pagi) &&
            this.couponHooks.$pagi.attr("data-total", totalPage);
        } else {
          this.couponHooks.$ulWrap.empty().prepend(this.noIconsHtml);
          this.couponHooks.$pagi.empty();
        }
      });
    }

    // 初始问题反馈功能
    initReportEvent() {
      this.reportHooks.$form.on("submit", e => {
        e.preventDefault();
        let data = $(e.target).serializeObject();

        if (!data.error_type) {
          this.reportHooks.$tips.text("请选择问题类型！");
          return;
        }

        if (data.error_type != "其他" && !util.urlReg(data.url)) {
          this.reportHooks.$tips.text("请填写本站正确的网址！");
          return;
        }

        if (data.content.trim() === "") {
          this.reportHooks.$tips.text("请填写问题描述！");
          return;
        }

        data.content = util.htmlFormat(data.content);
        this.reportHooks.$tips.text("");

        this.sendReport(data);
      });
    }

    // 发送问题反馈
    sendReport(data) {
      $.ajax({
        url: PERSONAL_API.report,
        type: "POST",
        data,
        dataType: "json"
      }).done(res => {
        if (res.code == 200) {
          alert("问题提交成功");
          this.reportHooks.$form
            .find(":input")
            .not(":radio")
            .val("")
            .end()
            .closest("form")
            .find(":radio")
            .removeAttr("checked");
        }
      });
    }

    // 获取系统消息
    getsysInfo(page = 1) {
      $.ajax({
        url: PERSONAL_API.sys_info,
        type: "POST",
        data: {
          page
        }
      }).done(res => {
        if (res.code == 200 && res.data.length) {
          this.sysInfoHooks.$table.html(this.dealsysList(res.data));
          let totalPage = Math.ceil(res.total / 10);
          totalPage > 1 &&
            this.createPagi(totalPage, page, this.sysInfoHooks.$pagi) &&
            this.sysInfoHooks.$pagi.attr("data-total", totalPage);
        } else {
          this.sysInfoHooks.$table.empty().prepend(this.noTableHtml);
          this.sysInfoHooks.$pagi.empty();
        }
      });
    }

    // 处理图标数据
    dealIconsList(data) {
      let html = "";
      $.each(data, (i, ele) => {
        html += this.iconHtml
          .replace("{ url }", ele.url)
          .replace("{ src }", ele.thumb)
          .replace("{ title }", ele.title)
          .replace("{ id }", ele.id)
          .replace("{ isVip }", ele.premium == 1 ? "vip" : "");
      });

      return html;
    }

    // 处理充值数据
    dealrechargeList(data) {
      let html = "";
      $.each(data, (i, ele) => {
        html += this.rechargeHtml
          .replace(
            "{ type }",
            ele.pay_id == 1 ? "微信" : ele.pay_id == 2 ? "支付宝" : "其他充值"
          )
          .replace("{ content }", ele.contact_name)
          .replace("{ money }", ele.money)
          .replace("{ time }", ele.add_time);
      });

      return html;
    }
    // 处理优惠券
    dealCouponList(data) {
      let html = "";
      $.each(data, (i, ele) => {
        html += this.couponHtml
          .replace("{ is_over }", ele.status != 0 ? "over" : "")
          .replace("{ time }", ele.end_time)
          .replace("{ price }", ele.coupon_point / 1)
          .replace("{ min_price }", ele.min_consume / 1);
      });

      return html;
    }

    // 处理系统消息
    dealsysList(data) {
      let html = "";
      $.each(data, (i, ele) => {
        html += this.sysInfoHtml
          .replace(
            "{ type }",
            ele.pay_id == 1 ? "微信" : ele.pay_id == 2 ? "支付宝" : "其他充值"
          )
          .replace("{ content }", ele.content)
          .replace("{ time }", ele.send_time)
          .replace("{ has_read }", ele.has_read ? "active" : "");
      });

      return html;
    }

    // 创建翻页
    createPagi(totalPage, pageNum, hook) {
      let prevTemplate = '<a class="prev" target="_self">&lt;&lt;</a>',
        nextTemplate = '<a class="next" target="_self">&gt;&gt;</a>';

      let pagiNumHtml = "",
        i,
        numActive;
      if (totalPage <= 10 || (totalPage > 10 && pageNum < 10)) {
        for (i = 1; i <= Math.min(totalPage, 10); i++) {
          i == pageNum ? (numActive = "num active") : (numActive = "num");
          let _numTemp =
            '<a class="' +
            numActive +
            '" value="' +
            i +
            '" target="_self">' +
            i +
            "</a>";

          pagiNumHtml += _numTemp;
        }
      } else {
        let numFloor = Math.floor(pageNum / 10) * 10,
          numCeil = Math.min(numFloor + 10, totalPage);

        for (i = numFloor; i <= numCeil; i++) {
          i == pageNum ? (numActive = "num active") : (numActive = "num");
          let _numTemp =
            '<a class="' +
            numActive +
            '" value="' +
            i +
            '" target="_self">' +
            i +
            "</a>";

          pagiNumHtml += _numTemp;
        }
      }
      hook.empty();
      if (totalPage > 1) {
        hook.append(prevTemplate, pagiNumHtml, nextTemplate);
      }
      return true;
    }
  }

  let operate = new Personal();

  operate.init();
  // 获取当前hash值
  let urlChange = () => {
    let href = window.location.href,
      curHash,
      lastHashIndex = href.lastIndexOf("#/");

    if (lastHashIndex < 0 || href.length === lastHashIndex + 2) {
      window.location.hash = "#/admin";
      return "admin";
    } else {
      curHash = href.substring(lastHashIndex + 2);
    }
    return curHash;
  };

  operate.hashChange(urlChange());

  $(window).on("hashchange", () => {
    operate.hashChange(urlChange());
  });
})();
