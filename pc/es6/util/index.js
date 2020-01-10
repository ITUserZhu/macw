/*
 * @Author: Liliang Zhu 
 * @Date: 2019-11-12 17:45:53 
 * @Last Modified by: Liliang Zhu
 * @Last Modified time: 2019-11-28 14:25:42
 */
// 引入confirm插件
import 'jquery-confirm'

/** 
 * 同级元素类名切换
 * @param { String || Array } ele - 需要切换的当前dom元素类名，或者类名集合数组 
 * @param  { String } act - 当前切换的类名，默认'active'
 */
export const toggleActive = (ele, act = 'active') => {
  if (typeof ele === 'object') {
    $(ele).each(function (i, e) {
      $(e).addClass(act).siblings().removeClass(act);
    });
  } else {
    $(ele).addClass(act).siblings().removeClass(act);
  }
};

/**
 * 格式化时间
 * @param { Number } time 传入的时间戳，单位必须是毫秒
 * @param { String } format 传入格式，Y-m-d
 * @returns { String }
 */
export const formatDate = (time, format) => {
  let date = new Date(time),
    y = date.getFullYear(),
    m = date.getMonth() + 1,
    d = date.getDate(),
    h = date.getHours(),
    min = date.getMinutes();
  m = m > 9 ? m : '0' + m;
  d = d > 9 ? d : '0' + d;
  h = h > 9 ? h : '0' + h;
  min = min > 9 ? min : '0' + min;
  return format ? format.replace('Y', y).replace('m', m).replace('d', d).replace('h', h).replace('m', m) : y + '-' + m + '-' + d + ' ' + h + ':' + min;
}

/**
 * 处理html字符串。过滤<>转译成编码
 * @param { String } str 传入字符串
 * @returns { String }
 */
export const htmlFormat = (str) => {
  if (typeof str != 'string') {
    return str;
  }

  let reg = /[<>]/gi;
  return str.replace(reg, function (match) {
    switch (match) {
      case '<':
        return '&lt;'
      case '>':
        return '&gt;'
      default:
        break;
    }
  });
}

/**
 * 网址验证
 * @param { String } val 传入字符串
 * @returns { Boolean }
 */
export const urlReg = (val) => {
  const ret = /((http|https):\/\/www.)*iconeps.com/;
  return ret.test(val)
}

/**
 * 手机号验证
 * @param { String } val 传入字符串
 * @returns { Boolean }
 */
export const phoneReg = (val) => {
  const ret = /^1[3456789]\d{9}$/;
  return ret.test(val)
}

/**
 * 验证码验证
 * @param { String } val 传入字符串
 * @returns { Boolean }
 */
export const codeReg = (val) => {
  const ret = /^\d{6}$/;
  return ret.test(val)
}

/**
 * 自定义confirm方法
 * @param { String } msg 提示文本
 * @param { Function } fn 确定后回调
 * @param { Object } obj 参数覆盖 参考（ http://craftpip.github.io/jquery-confirm/ ）
 * @returns { Boolean }
 */
export const confirmBox = (msg, fn, obj = {}) => {
  let newObj = $.extend(true, {}, {
    title: '警告',
    content: msg,
    boxWidth: '30%',
    useBootstrap: false,
    buttons: {
      cancel: {
        text: '取消',
      },
      sure: {
        text: '确定',
        btnClass: 'btn-red',
        action: fn,
      },
    }
  }, obj);
  $.confirm(newObj);
};

// alert 方法， 同上
export const alertBox = (msg, obj = {}) => {
  let newObj = $.extend({}, {
    title: '提示',
    content: msg,
    boxWidth: '30%',
    useBootstrap: false,
  }, obj)

  $.alert(newObj);
}

// 搜索过滤字符
export const commonSearch = (str, type = 'all') => {
  const reg1 = new RegExp(/[`~!@#$%^*()_\=<>?:"{}|\/;'\\[\]·~！@#￥%……*（）——\={}|《》？：“”【】、；‘’，。、|]/g),
    reg2 = new RegExp(/^,|,$/);
  let newVal = str.replace(reg1, '').replace(reg2, '').trim().replace(/\s+/g, ' ').replace(/\+/g, '%2b');

  if (newVal) {
    window.location.href = '/search/' + type + '/' + newVal + '/0_1.html';
  }
}