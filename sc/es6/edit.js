/*
 * @Author: Liliang Zhu 
 * @Date: 2020-04-27 15:53:33 
 * @Last Modified by: Liliang Zhu
 * @Last Modified time: 2020-04-28 15:40:44
 * 图片编辑
 */

// 引入公用模块
import './components/common';
import TRANSLATIONS from './components/translations';
import FAMILY from './components/font-family';
import STICKERS from './components/stickers';

// 弹框提示
import {
  confirmBox,
  alertBox
} from './util';
// 接口
import {
  EDIT_API
} from './api';

setTimeout(function () {
  var spinner = document.querySelector('.global-spinner');
  if (spinner) spinner.style.display = 'flex';
}, 50);

$(() => {
  const param_name = window.location.search.substring(1, 7);
  const img_id = window.location.search.substring(8);
  const reg_num = /^[0-9]+.?[0-9]*$/;

  if (!reg_num.test(img_id) || param_name !== 'img_id') {
    confirmBox('请不要随意拼接路由参数', () => {
      window.location.href = '/';
    })

    return;
  }
  // 获取用户会员状态
  let pixie;

  $.ajax({
    url: EDIT_API,
    type: 'POST',
    data: {
      res_id: img_id
    }
  }).done(res => {
    if (res.code == 200) {
      if (res.url) {
        let newW, newH;
        if (res.width > 2400 || res.height > 2400) {
          if (res.width > res.height) {
            newW = 2400;
            newH = (res.height / res.width) * 2400;
          } else {
            newH = 2400;
            newW = (res.width / res.height) * 2400;
          }
        }

        pixie = new Pixie({
          crossOrigin: true,
          baseUrl: '/assets/edit',
          languages: {
            active: 'chinese',
            custom: {
              chinese: TRANSLATIONS,
            }
          },

          objectDefaults: {
            text: {
              fontFamily: '雅黑',
            }
          },

          tools: {
            export: {
              defaultFormat: 'png', //png, jpeg or json
              defaultName: 'macw', //default name for downloaded photo file
              defaultQuality: 1, //works with jpeg only, 0 to 1
            },
            // 贴图
            stickers: {
              replaceDefault: false,
              items: STICKERS
            },
            // 字体
            text: {
              replaceDefault: true,
              defaultCategory: 'display',
              defaultText: '双击编辑文本',
              items: FAMILY
            }
          },

          image: res.url,

          onLoad: function () {
            if (!!newW) {
              pixie.getTool('resize').apply(newW, newH);
              pixie.getTool('crop').apply({
                width: newW,
                height: newH,
                left: 0,
                top: 0
              });
            }
            window.postMessage('pixieLoaded', '*');
          },
        });
      }
    } else if (res.code == 501) {
      confirmBox('请您登录后再试！', () => {
        window.location.href = '/';
      }, {
        buttons: {
          cancel: {
            text: '返回',
            action: () => {
              window.history.back();
            },
          },
        }
      })
    } else if (res.code == 500) {
      confirmBox('您还是不会员，是否前往充值？', () => {
        window.location.href = 'https://www.macw.com/vip.html';
      }, {
        buttons: {
          cancel: {
            text: '返回',
            action: () => {
              window.history.back();
            }
          },
        }
      })
    } else {
      confirmBox('资源不存在，请返回重试！', () => {
        window.history.back();
      }, {
        buttons: {
          cancel: {
            text: '返回',
            action: () => {
              window.history.back();
            }
          },
        }
      })
    }
  }).fail(() => {
    alertBox('未知错误，请稍后再试');
  })
});