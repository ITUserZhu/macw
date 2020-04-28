/*
 * @Author: Liliang Zhu 
 * @Date: 2019-11-15 09:58:52 
 * @Last Modified by: Liliang Zhu
 * @Last Modified time: 2020-04-27 16:28:39
 */

// 软件内容页接口：
export const CONENT_APIS = {
  check_vip: '/tools/check_vip_show', // 判断vip状态
  stat: '/api/stat/', // 添加足迹
  support: '/api/res_support', //点赞
  collect: '/api/collection', // 收藏
};

// 下载与充值
export const VIP_APIS = {
  download: '/api/download', //下载接口
  download_pic: '/api/download_pic', // 下载图片素材
  member_history: '/api/member_pay_account_yesterday', // 其他用户下载记录
  wx_pay: '/api/pay_wx', // 请求微信充值
  ali_pay: '/api/pay_ali_qr', // 请求支付宝充值
  pay_ok: '/api/get_pay_ok', // 轮询充值成功
  coupon: '/api/coupon_info', // 获取优惠券
  paypal: '/api/createpayment' // 贝宝支付
};

// 登录
export const LOGIN_APIS = {
  login_go: '/login_go',
  wx_login: '/wechat_login?type=2',
  qq_login: '/qq_login?type=2',
  reg: '/register',
  code_img: '/api/code_img',
  phone_reg: '/phone_register',
  send_note: '/api/password_retrieval',
  rset_code: '/api/password_code',
}

// 用户状态与退出
export const LOGIN_STATUS = {
  is_login: '/api/user_management_top',
  login_out: '/login_out',
}

// 抽奖接口
export const LOTTERY_APIS = {
  sign: '/api/sign_prize',
  prize: '/api/get_reward_info'
}

// 素材购物车
export const SHOPPING_APIS = {
  get: '/get_shopping_cart', //获取购物车
  add: '/add_shopping_cart', // 添加
  del: '/del_shopping_cart', // 删除
  type: '/shopping_specifications', // 获取图片格式
}

// 图片编辑
export const EDIT_API = '/api/img_edit';