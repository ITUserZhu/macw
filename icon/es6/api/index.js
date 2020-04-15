// 注册登录
export const LOGIN_REG = {
  is_login: "/is_login", // 判断登录
  login_go: "/login", // 登录
  login_out: "/login_out", // 退出
  reg: "/register", // 手机邮箱注册-发送验证码
  reg_check: "/register_check", // 手机邮箱注册-提交注册
  forgot: "/forgot_password", // 忘记密码-发送验证码
  forgot_check: "/forgot_password_check", // 忘记密码-提交新密码
  wx_gzh: "/get_temp", // 微信公众号关注登录
  qq_login: "/qq_login", // QQ登录
  wx_login: "/wechat_login" // 微信登录
};

// 图标功能
export const ICON_API = {
  status: "/member_and_icon_status", // 图标与用户状态
  edit: "/member_edit_icon"
};

// vip充值接口
export const VIP_RECHARGE = {
  wx_pay: "/pay_wx", // 请求微信充值
  ali_pay: "/pay_ali_qr", // 请求支付宝充值
  pay_ok: "/tools/get_pay_ok", // 轮询充值成功
  coupon: "/coupon", // 获取优惠券
  paypal: "/createpayment" // 贝宝支付
};

// 个人中心
export const PERSONAL_API = {
  info: "/per_set", // 获取个人信息
  edit: "/edit_per", // 修改个人信息
  collect: "/get_collection_icon", // 获取收藏夹内容
  del_collect: "/del_collection_icon", // 删除收藏图标
  move_collect: "/move_collection_icon", // 移动收藏夹图标
  get_collect_folder: "/get_collection_folder", // 获取收藏夹
  add_col_folder: "/collection_folder", // 修改添加收藏夹
  del_col_folder: "/del_collection_folder", // 删除收藏夹
  download_history: "/icon_download_record", // 图标下载历史
  pay_history: "/pay_record", // 充值记录
  report: "/error_report", // 提交反馈
  send_msg: "/send_msg", // 发送消息
  phone_note: "/phone_note", // 发送手机绑定验证码
  email_note: "/email_checked", // 发送邮箱绑定验证码
  bind_phone: "/note_verification", // 确定绑定手机
  bind_email: "/check_email", // 确定绑定邮箱
  phone_change: "/phone_change", // 修改手机绑定获取验证码
  email_change: "/email_change", // 修改邮箱绑定获取验证码
  change_bind_phone: "/check_change_phone", // 确定更改手机
  change_bind_email: "/check_email_change", // 确定更改邮箱
  coupon: "/coupon", // 获取优惠券
  sys_info: "/member_notify_list" // 获取系统消息
};

// 收藏购物车
export const SHOPPING_API = {
  del_icon: "/del_collection_icon", // 删除当前图标
  get_folder: "/get_collection_folder", // 获取购物车包
  change_folder: "/collection_folder", // 修改购物车包名称
  del_folder: "/del_collection_folder", // 删除购物车包
  get_foler_icons: "/get_collection_icon", // 获取当前包图标
  add_icon: "/collection_icon", // 添加购物车图标
  get_icons: "/get_collection_icon", // 获取所有已收藏图标id
  pay_package: "/pay_package_icon" // 下载当前购物车
};

// 下载
export const DOWNLOAD_API = {
  time_left: "/remind_pay_package",
  download: "/pay_package_icon"
};

// 签到抽奖
export const SIGN_API = {
  data: "/sign",
  sign: "/sign_prize"
};