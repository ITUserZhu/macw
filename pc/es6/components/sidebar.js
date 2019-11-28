/*
 * @Author: Liliang Zhu 
 * @Date: 2019-11-15 10:19:34 
 * @Last Modified by: Liliang Zhu
 * @Last Modified time: 2019-11-21 15:19:26
 * 侧边导航构造函数
 * params:
 * @SideBar 侧边导航构造函数
    * opts {object} 必填 true
        * /^item\d/ : 构成侧边元素 false {obj}
            * selector: 跳转地址
            * iconClass: 字体图标
            * cellText: title名称
            * img: 悬浮图片
            * iconStyle: 独立自定义字体图标样式
            * imgStyle: 独立自定义图片样式

        * commonIconStyle: 图标自定义样式 false 
        * commonImgStyle: 悬浮展示图片自定义样式 false
        * scrollSpeed: 返回顶部速度 false
        * goTopIconShow: 距离顶部高度显示 false

    * 接受参数 dom {dom 对象, false} 默认生成 #siderbar 元素加入页面
 */

class SideBar {
  constructor(opts, dom = '<div id="siderbar"></div>') {
    this._init(opts, dom);
  }

  _init(opts, dom) {
    this.opts = {};
    $.extend(this.opts, opts, true);
    this.sildeDom = dom;
    // this.elementTopArray = [];


    if (this.sildeDom === '<div id="siderbar"></div>') {
      this.sildeDom = $(this.sildeDom);
      $('main').append(this.sildeDom);
    }

    this.createBarItems();
    this.opts.goTopIcon && this.createGoTopIcon();

  }

  createBarItems() {
    var self = this;
    for (var key in this.opts) {
      if (/item\d*/.test(key)) {
        var item = this.opts[key];
        var $iconSpan,
          $textSpan = '',
          $aLink,
          $cellWrapper = $('<div class="cell-wrapper">'),
          $sidebar_cell = $('<div class="sidebar_cell">');

        $iconSpan = this.createIcons(item, $iconSpan);
        $textSpan = this.createTexts(item, $textSpan);
        $aLink = this.createALink(item, $aLink);

        $cellWrapper.append($aLink.append($iconSpan), $textSpan).appendTo($sidebar_cell);

        $sidebar_cell.mouseover(function (e) {
          if ($(this).find('img').length) {
            $(this).find('.cell-img').show();
          }
        }).mouseout(function () {
          if ($(this).find('img').length) {
            $(this).find('.cell-img').hide();
          }
        }).click(function (e) {
          if (!$(this).find('a').attr('href')) {
            e.preventDefault();
            return;
          }

        });

        this.sildeDom.append($sidebar_cell);

        // this.aksSoft();
      }
    }
  }

  createIcons(obj, iconSpan) {
    var opts = this.opts;
    obj.iconClass && (iconSpan = $('<span class="cell-item cell-icon">').addClass(obj.iconClass));

    var _iconStyle = {};
    opts.commonIconStyle && $.extend(_iconStyle, opts.commonIconStyle);
    obj.iconStyle && $.extend(_iconStyle, obj.iconStyle);
    Object.keys(_iconStyle).length && iconSpan.css(_iconStyle);

    return iconSpan;
  }

  createTexts(obj, textSpan) {
    var opts = this.opts;

    if (obj.img) {
      if (typeof obj.img === 'object') {
        var html = '';
        $.each(obj.img, (i, v) => {
          html += `<div class="cell-img-wrap"><img src="${ v.src }"><p>${ v.title }</p></div>`
        })
        textSpan = $('<div class="cell-item cell-img">').html(html)
      } else {
        textSpan = $('<div class="cell-item cell-img">').html(`<img src="${obj.img}">`)
      }
    }

    var _imgStyle = {};
    opts.commonImgStyle && $.extend(_imgStyle, opts.commonImgStyle);
    obj.imgStyle && $.extend(_imgStyle, obj.imgStyle);

    if (!!textSpan) {
      textSpan.css(_imgStyle);
    }
    return textSpan;
  }

  createALink(obj, aLink) {
    var _href = obj.selector || obj.href || '';
    aLink = $(`<a href="${_href}" target="_blank" title="${obj.cellText}">`);

    return aLink;
  }

  createGoTopIcon() {
    var opts = this.opts,
      goTopObj = opts.goTopIcon,
      _speed = opts.scrollSpeed || 300;
    var _goTopIconShow = opts.goTopIconShow || 400;

    var $sideBarCell = $('<div class="sidebar_cell">'),
      $cellWrapper = $('<div class="cell-wrapper">'),
      $icon = $('<span class="cell-item">'),
      $aLink = $(`<a  title="${goTopObj.cellText}">`);

    var _iconStyle = {};
    opts.commonIconStyle && $.extend(_iconStyle, opts.commonIconStyle);
    goTopObj.iconClass && $icon.addClass(goTopObj.iconClass);
    goTopObj.iconStyle && $.extend(_iconStyle, goTopObj.iconStyle);

    $icon.css(_iconStyle);

    $cellWrapper.append($aLink.append($icon)).appendTo($sideBarCell);

    $sideBarCell.on('click', function (e) {
      e.preventDefault();
      $('html, body').animate({
        scrollTop: 0
      }, _speed);
      return false;
    });

    $(window).on('load scroll', function () {
      var winTop = $(window).scrollTop();
      winTop < _goTopIconShow ? $sideBarCell.fadeOut() : $sideBarCell.fadeIn();
    });

    this.sildeDom.append($sideBarCell);

    return this;
  }

  aksSoft() {
    $('#siderbar').on('click', '.asksoft', () => {
      if ($('.logined').children().length) {
        this.initAsk()
      } else {
        $('#to-login').trigger('click');
      }

    })
  }

  initAsk() {
    if (!$('.ask-soft').length) {
      const askBookHtml = `<div class="ask-soft">
                <div class="ask-box">
                    <div class="ask-close">X</div>
                    <p class="ask-title">——— <span>求软件</span> ———</p>
                    <form>
                        <textarea name="content" placeholder="请留下软件名、软件版本号"></textarea>
                        <input type="text" name="contact_info" placeholder="请填写你的联系方式（QQ、邮箱、手机号）">
                        <button>提交</button>
                    </form>
                </div>
            </div>`;
      $('main').append(askBookHtml);
      this.initEvent();
    } else {
      $('.ask-soft').show().find('textarea').val('').end().find('input').val('');
    }
  }

  initEvent() {
    $('.ask-soft')
      .on('click', function () {
        $(this).hide();
      })
      .on('click', '.ask-box', function (e) {
        if (!$(e.target).is('.ask-close')) {
          e.stopPropagation();
        }
      })
      .on('submit', 'form', function (e) {
        e.preventDefault();
        let data = $(this).serializeObject();
        for (let k in data) {
          if (!data[k]) {
            alert('输入不能为空！')
            return;
          }
        }
        $.ajax({
            url: '/api/apply_soft',
            type: 'POST',
            data,
          })
          .done(function (res) {
            if (res.code == 200) {
              alert('提交成功，请等候更新');
              setTimeout(() => {
                $('.ask-soft').hide();
              }, 1000)
            } else if (res.code == 400 || res.code == 501) {
              $('#to-login').trigger('click');
            } else {
              alert(res.msg)
            }
          })
          .fail(function (error) {
            console.log(error);
          })

      })
  }

  // watchScroll () {
  //     var currentIndex = 0,
  //         topArray = this.elementTopArray;
  //     $(window).on('load scroll', function () {
  //         var winTop = $(window).scrollTop();
  //         for (var i = 0; i < topArray.length; i++) {
  //             var height_1 = topArray[i],
  //                 height_2 = topArray[i + 1];
  //             if (height_1 > winTop) {
  //                 break;
  //             }
  //             if (!height_2 || height_1 <= winTop && height_2 > winTop) {
  //                 currentIndex = i;
  //                 break;
  //             }
  //         }
  //         var $sidebarCell = $('#go-top').find('.sidebar_cell');
  //         $sidebarCell.eq(currentIndex).addClass('active').siblings().removeClass('active');
  //     });
  // }

  // moveToElement (ele) {
  //     var elapse = this.opts.scrollSpeed || 200;

  //     var _top = $(ele).offset().top;

  //     $('html, body').animate({ scrollTop: _top }, elapse);
  // }
};

export default SideBar;