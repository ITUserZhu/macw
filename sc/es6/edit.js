/*
 * @Author: Liliang Zhu 
 * @Date: 2020-04-27 15:53:33 
 * @Last Modified by: Liliang Zhu
 * @Last Modified time: 2020-04-28 11:38:33
 * 图片编辑
 */

// 引入公用模块
import './components/common';
import translations from './components/translations';
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
              chinese: translations,
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
          },
        });
      } else {
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
    }
  }).fail(() => {
    alertBox('未知错误，请稍后再试');
  })
});