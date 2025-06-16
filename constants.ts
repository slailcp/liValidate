export const DEFAULT_OPTIONS = {
  errorClass: 'li-invalid',
  popoverClass: 'li-popover',
  validateMode: 'single',
  tipDuration: 0,
  position: 'bottomLeft',
  scrollMargin: '20px',
  scrollMarginTop: '20px',
  scrollMarginRight: '20px',
  scrollMarginBottom: '20px',
  scrollMarginLeft: '20px',
  rules: {}
};

export const DEFAULT_RULES = {
  number: {
    pattern: /^[0-9]+$/,
    message: '请输入数字'
  },
  integer: {
    pattern: /^-?[0-9]\d*$/,
    message: '请输入整数'
  },
  decimal: {
    pattern: /^-?[0-9]\d*\.\d+$/,
    message: '请输入小数'
  },
  email: {
    pattern: /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/,
    message: '请输入有效的邮箱地址'
  },
  phone: {
    pattern: /^1[3-9]\d{9}$/,
    message: '请输入正确的手机号码'
  },
  url: {
    pattern: /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/,
    message: '请输入有效的网址'
  },
  idcard: {
    pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
    message: '请输入有效的身份证号码'
  },
  chinese: {
    pattern: /^[\u4e00-\u9fa5]+$/,
    message: '请输入中文字符'
  },
  english: {
    pattern: /^[a-zA-Z]+$/,
    message: '请输入英文字符'
  },
  zipcode: {
    pattern: /^\d{6}$/,
    message: '请输入6位邮政编码'
  },
  length: {
    pattern: /^.{6,8}$/,
    message: '请输入6-16位字符'
  }
};