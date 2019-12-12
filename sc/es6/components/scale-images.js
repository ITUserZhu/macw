/*
 * @Author: Liliang Zhu 
 * @Date: 2019-12-03 13:15:09 
 * @Last Modified by: Liliang Zhu
 * @Last Modified time: 2019-12-12 17:45:38
 * 视频or图片鼠标悬浮展示功能
 */

class ScaleImages {
  constructor(wrap, opts) {
    this.wrap = $(wrap);
    this.opts = $.extend(true, {}, {
      item: '.item',
      checkbtn: '',
      fade: false,
      followScroll: true,
      fadeTime: 500,
      original: 'src',
      oftX: 0,
      oftXPosition: 'right',
      oftYPosition: 'center', // 'top', 'bottom'
      conCallback: false
    }, opts);
    this.items = this.wrap.children(this.opts.item);
    this.isShown = false;
    this.timer;
    this.checkShow = false;
    this.init();
  }

  init() {
    this.getSize()
    this.initEvent()
  }

  initEvent() {
    this.wrap
      .on('mouseenter', this.opts.item, this.timeInterval.bind(this))
      .on('mouseleave', this.opts.item, this.unbindScale.bind(this));
    $(window).on('resize', this.getSize.bind(this));
    $(window).on('scroll', this.changeScrollTop.bind(this));
    if (!!this.opts.checkbtn) {
      $(this.opts.checkbtn).on('click', (e) => {
        this.checkShowFn();
      })
    }

  }

  getSize() {
    this.winH = $(window).height();
    this.winW = $(window).width();
  }

  initTool(e) {
    let html = '<div class="scaleTool"><p class="water-marker">__host.com</p><div class="tool-content">{ inner }</div><div class="video-load"><span class="bounce1"></span><span class="bounce2"></span></div></div>',
      str = '',
      src = $(e.target).closest(this.opts.item).data(this.opts.original) || $(e.target).closest(this.opts.item).find('img').attr('src');
    if (!src || src == 'undefined') return false;

    if (!this.opts.conCallback) {
      str = '<img src="' + src + '" />'
    } else {
      str = this.opts.conCallback(src)
    };

    if ($('.scaleTool').length) {
      this.toolDom = $('.scaleTool');
      this.toolDom.find('.tool-content').html(str);
    } else {
      html = html.replace('{ inner }', str);
      $('main').append(html);
      this.toolDom = $('.scaleTool');

      this.toolDom.on('mouseenter', () => {
        this.toolDom.show();
        this.isShown = true;
      }).on('mouseleave', () => {
        this.toolDom.hide();
        this.isShown = false;
      });
    }

    return true;

  }

  checkShowFn() {
    this.checkShow = !this.checkShow;
    if (this.checkShow) {
      $(this.opts.checkbtn).addClass('active')
    } else {
      $(this.opts.checkbtn).removeClass('active');
      this.toolDom.remove();
    }
  }

  unbindScale() {
    clearTimeout(this.timer);
    this.intervalTimer && clearInterval(this.intervalTimer);
    if (this.toolDom && (this.checkShow || !this.opts.checkbtn)) {
      this.opts.conCallback && this.toolDom.find('video')[0].pause();
      this.toolDom.hide();
      this.isShown = false
    }
  }

  timeInterval(event) {
    if (this.checkShow || !this.opts.checkbtn) {
      this.timer = setTimeout(() => {
        this.showScale(event);
      }, this.opts.fadeTime)
    }
  }

  showScale(e) {
    clearTimeout(this.timer);
    if (this.isShown || this.winW < 1200) return;

    if (!this.initTool(e)) return;

    let itemW = this.toolDom.width(),
      itemH = this.toolDom.height(),
      curX, curY,
      $curBox = $(e.target).closest(this.opts.item);

    let box = $curBox.get(0).getBoundingClientRect();

    if (box[this.opts.oftXPosition] > this.winW / 2) {
      curX = box.left - itemW - this.opts.oftX
    } else {
      curX = box.right + this.opts.oftX
    }

    curX < 0 && (curX = 0);

    if (this.opts.oftYPosition === 'top') {
      if (box.top < itemH) {
        if (box.top < 0) {
          curY = 0
        } else {
          curY = box.top
        }
      } else {
        curY = box.top - itemH
      }
    } else if (this.opts.oftYPosition === 'bottom') {
      if (this.winH - box.bottom > itemH) {
        curY = box.bottom
      } else {
        curY = this.winH - itemH
      }
    } else {
      if ((box.top + $curBox.outerHeight() / 2) < itemH / 2) {
        if (box.top < 0) {
          curY = 0
        } else {
          curY = box.top
        }

      } else {
        if ((box.bottom - $curBox.outerHeight() / 2) > (this.winH - itemH / 2)) {
          curY = this.winH - itemH
        } else {
          curY = box.top + $curBox.outerHeight() / 2 - itemH / 2
        }

      }
    }

    curY < 0 && (curY = 0);

    this.scrollH = $(window).scrollTop();

    this.toolDom.css({
      left: curX,
      top: curY
    });

    this.toolT = curY;

    if (this.opts.fade) {
      this.toolDom.fadeIn()
    } else {
      this.toolDom.show()
    };

    !this.opts.checkbtn && this.playVideo()

    this.isShown = true
  }

  changeScrollTop(e) {
    let scrollT = $(e.target).scrollTop(),
      reScrollT = this.scrollH,
      itemT = this.toolT,
      newScrollT;
    if (this.opts.followScroll && this.isShown) {
      newScrollT = reScrollT - scrollT;
      this.toolDom.css({
        top: itemT + newScrollT,
      });
    }
  }

  playVideo() {
    this.toolDom.find('.video-load').show();
    this.intervalTimer = setInterval(() => {
      if (this.toolDom.find('video')[0].readyState == 4) {
        clearInterval(this.intervalTimer);
        setTimeout(() => {
          this.toolDom.find('.video-load').hide();
          this.opts.conCallback && this.toolDom.find('video')
            .css('opacity', 1)
            .get(0).play();
        }, 100)
      }
    }, 400)
  }
}

export default ScaleImages;