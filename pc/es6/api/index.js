/*
 * @Author: Liliang Zhu 
 * @Date: 2019-11-15 09:58:52 
 * @Last Modified by: Liliang Zhu
 * @Last Modified time: 2019-11-22 15:59:59
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
  wx_login: '/wechat_login?type=1',
  qq_login: '/qq_login?type=1',
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

// 个人中心 
export const USER_APIS = {
  // 编辑用户信息
  editUrl: '/api/edit_user_info',

  // 发送短信
  sendPhoneUrl: '/phone_note',

  // 更改绑定发送短信
  sendChangeUrl: '/chang_phone',

  // 图形验证码接口
  imgCodeUrl: '/api/code_img',

  // 提交手机绑定
  bindPhoneUrl: '/note_verification',

  // 提供更改手机绑定
  changeBindUrl: '/v_new_phone',

  // 收藏接口
  collectionsUrl: '/api/member_favorite',
  //删除收藏
  delCollectionsUrl: '/api/del_favorite',

  // 下载记录接口
  downloadUrl: '/api/member_download',
  // 删除下载
  delDownloadUrl: '/',

  // 足迹接口
  historyUrl: '/api/get_footprint',
  // 删除足迹
  delHistoryUrl: '/api/footprint_del',

  // 充值记录接口
  rechargeUrl: '/api/member_pay_account',
  // 消费记录
  consumeUrl: '/api/pay_spend',
  // 分享记录
  shareUrl: '/api/get_share_info',
  // 优惠券记录
  couponUrl: '/api/coupon_info',
  // 系统消息
  sysInfo: '/api/member_notify_list',
  // 已提交报错
  hasReportUrl: '/api/error_report_list',
  // 报错提交
  reportUrl: '/api/error_report',
}