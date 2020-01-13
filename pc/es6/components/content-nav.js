/*
 * @Author: Liliang Zhu 
 * @Date: 2019-11-15 09:39:58 
 * @Last Modified by: Liliang Zhu
 * @Last Modified time: 2019-12-26 13:37:09
 * 内容目录导航
 * @params:
 * wrap 整个内容容器 dom对象
 * title 所有需要定位的标题  dom对象
 * opts 标题导航参数 object
 ** float 导航悬浮位置： 'left', 'right'
 ** top 导航距离顶部位置： 百分比或 *px
 ** showTop 导航滚动高度展示： Number
 */

import {
  toggleActive
} from '../util';

class ContentFixNav {
  constructor(wrap, title, opts) {
    this.wrapDoms = wrap;
    this.titleDoms = title;
    this.init(opts);
  }

  init(opts) {
    this.options = {
      float: 'left',
      top: '60%',
      showTop: 300,
      scrollT: 0,
    };
    this.options = $.extend({}, this.options, opts);
    this.hHeightArr = [];
    this.render();
  }

  render() {
    $('main').append($(`<div id="content-nav" class="${this.options.float}" style="top: ${this.options.top};"></div>`));
    this.contentNav = $('#content-nav');

    let _this = this;

    this.titleDoms.each(function (index, el) {
      let textArr = $(this).text().trim().replace(/\s+/g, ' ').split(' '),
        _text = textArr[textArr.length - 1],
        newText = _text.replace(/\s|\w|:|\(|\)/g, '');

      newText.length < 4 ? newText = _text.replace(/\s|:|\(|\)/g, '') : newText = newText.substr(newText.length - 4);

      let $span = $('<span>').text(newText);

      _this.contentNav.append($span);

    });

    this.getHeightArr();
  }

  getHeightArr() {
    let imgs = this.wrapDoms.find('img'),
      len = imgs.length,
      promiseAll = [],
      _this = this;

    for (let i = 0; i < len; i++) {
      promiseAll[i] = new Promise((resolve, reject) => {
        if (imgs[i].complete) {
          resolve(imgs[i])
        } else {
          imgs[i].onload = function () {
            resolve(imgs[i])
          }
        }

      })
    }

    Promise.all(promiseAll).then(() => {
      _this.titleDoms.each(function (index, el) {
        _this.hHeightArr.push(Math.ceil($(el).offset().top) - _this.options.scrollT);
      });
      _this.hideTop = _this.wrapDoms.closest('section').next().length && _this.wrapDoms.closest('section').next().offset().top || 10000;
      _this.initEvent();
    })

  }

  initEvent() {
    this.contentNav.on('click', 'span', this.scrollToHeight.bind(this));

    $(window).on('scroll', this.watchScroll.bind(this));
  }

  scrollToHeight(e) {
    let _index = $(e.target).index(),
      _this = this;

    $('body, html').animate({
      scrollTop: _this.hHeightArr[_index]
    }, 300);
  }

  watchScroll(e) {
    let navs = this.contentNav.children('span'),
      scrollTop = $(e.target).scrollTop(),
      _index,
      _this = this;

    if (scrollTop >= this.options.showTop && scrollTop < this.hideTop) {
      _this.contentNav.show();
    } else {
      _this.contentNav.hide();
    };

    for (let i = 0; i < _this.hHeightArr.length; i++) {
      let height_0 = _this.hHeightArr[0],
        height_1 = _this.hHeightArr[i],
        height_2 = _this.hHeightArr[i + 1];
      if (height_0 > scrollTop) {
        _index = -1;
        break;
      } else if (!height_2 || (height_1 <= scrollTop && height_2 > scrollTop)) {
        _index = i;
        break;
      }
    }

    _index >= 0 ? toggleActive(navs.eq(_index)) : navs.removeClass('active');
  }
}

export default ContentFixNav