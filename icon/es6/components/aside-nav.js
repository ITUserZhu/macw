class AsideNav {
  constructor(id) {
    this.id = id;
    this.getNavData();
  }

  getNavData() {
    let _this = this;
    $.ajax({
        url: "/icon_tag_tree",
        type: "POST"
      })
      .done(function (res) {
        if (res.code == 200) {
          _this.data = res.data;
          _this.initData(res.data, _this.id);
          _this.initEvent();
        }
      })
      .fail(function (error) {
        console.log(error);
      });
  }

  initData(datas, id) {
    let _this = this;
    if (!id) return;
    datas.forEach(function (v, i) {
      if (v.id == id) {
        v.active = true;
        if (v.parent_id) {
          _this.initData(_this.data, v.parent_id);
        }
      } else {
        if (v.child && v.child.length) {
          _this.initData(v.child, id);
        }
      }
    });
  }

  forData(data) {
    let _this = this,
      html = "";
    data.forEach(function (v, i) {
      if (v.child && v.child.length) {
        html +=
          '<li data-id="' +
          v.id +
          '" ' +
          ((!!v.active && 'class="active"') || "") +
          '><a href="' +
          v.url +
          '">' +
          v.keyword +
          "<span><i></i></span></a><ul>" +
          _this.forData(v.child) +
          "</ul></li>";
      } else {
        html +=
          '<li data-id="' +
          v.id +
          '" ' +
          ((!!v.active && 'class="active"') || "") +
          '><a href="' +
          v.url +
          '">' +
          v.keyword +
          "</a></li>";
      }
    });
    return html;
  }

  initEvent() {
    if (!$(".list-map").length) return;

    this.navDom = $(".list-map");
    // if(window.localStorage.navshow == 1 || !window.localStorage.navshow) {
    //     this.navDom.addClass('show');
    //     $('main').addClass('aside-show');
    // } else {
    //     this.navDom.removeClass('show');
    //     $('main').removeClass('aside-show');
    // }

    this.navDom.find("ul").append(this.forData(this.data));
    let isHigh = "100%";
    if ($("main").height() <= $(window).height()) {
      this.navDom.height($("main").height() - 70).css("paddingBottom", "30px");
      isHigh = this.navDom.height() + 50;
    }
    let _this = this;

    this.navDom.find("li.active").each(function (index, el) {
      if ($(el).data("id") == _this.id) {
        let winH = $(window).height(),
          offsetTop = $(el).offset().top - $(window).scrollTop();
        if (offsetTop > winH / 2) {
          _this.navDom.find("ul").scrollTop(offsetTop - winH / 2);
        }
      }
    });

    this.navDom.on("click", "span", this.toggleShow.bind(this));

    const headerHight = $("header").height();
    const footToTop = $("footer").offset().top - 50;
    const winH = window.innerHeight;
    if (window.scrollY >= headerHight) {
      this.navDom.addClass("top0");
    }
    $(window).on("scroll", e => {
      let scrollT = $(e.target).scrollTop();
      if (scrollT < headerHight) {
        let offtop = headerHight - scrollT;
        let nh = 0;
        if (offtop == 130) {
          setTimeout(() => {
            this.navDom.removeClass("top0");
            this.navDom.attr("style", "height: calc(100% - " + nh + "px);");
          }, 0);
        } else {
          this.navDom.css({
            top: offtop,
            paddingBottom: isHigh != "100%" ? "30px" : "100px"
          });
        }
        if (scrollT >= footToTop - winH) {
          nh = scrollT - footToTop + winH + 30;
          this.navDom.css({
            height: "calc(100% - " + nh + "px)"
          });
        }
      } else {
        if (scrollT >= footToTop - winH) {
          let nh = scrollT - footToTop + winH;
          this.navDom.css({
            height: "calc(100% - " + nh + "px)"
          });
        } else {
          this.navDom.attr("style", "");
        }
        this.navDom.addClass("top0");
      }
    });
  }

  // toggleAside (e) {
  //     $(e.target).closest('.list-map').toggleClass('show');
  //     $('main').toggleClass('aside-show');
  //     if($('main').hasClass('aside-show')) {
  //         window.localStorage.navshow = 1;
  //     } else {
  //         window.localStorage.navshow = 0;
  //     }

  // }

  toggleShow(e) {
    e.preventDefault();
    e.stopPropagation();
    let $target = $(e.target).closest("span"),
      $li = $target.closest("li");
    $li
      .toggleClass("active")
      .siblings()
      .removeClass("active");
  }
}

export default AsideNav;