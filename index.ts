import { App, Plugin } from 'vue';
import { createLiValidate } from './core';
import { LiValidateOptions } from './types';

// 定义函数类型
export type LiValidateFunction = (formId: string, options?: LiValidateOptions) => boolean;
export type ClearValidateErrorsFunction = (formId?: string) => void;
export type ShowCustomPopoverFunction = (
  element: HTMLElement,
  message: string,
  popoverClass?: string,
  tipDuration?: number
) => void;

// 创建实例并导出函数
export const liValidate: LiValidateFunction = (formId, options) => {
  const instance = createLiValidate(options);
  return instance.liValidate(formId, options);
};

export const clearValidateErrors: ClearValidateErrorsFunction = (formId) => {
  const instance = createLiValidate({});
  return instance.clearErrors(formId);
};

export const showCustomPopover: ShowCustomPopoverFunction = (element, message, popoverClass, tipDuration) => {
  const instance = createLiValidate({});
  return instance.showCustomPopover(element, message, popoverClass, tipDuration);
};


// declare global {
//   interface Window {
//     liValidate: (formId: string, options?: LiValidateOptions) => boolean;
//     clearValidateErrors: (formId?: string) => void;
//     showCustomPopover: (
//       element: HTMLElement,
//       message: string,
//       popoverClass?: string,
//       tipDuration?: number
//     ) => void;
//   }
// }

// 保留原有的插件安装逻辑
export const LiValidate: Plugin = {
  install(app: App, options: LiValidateOptions = {}) {
    const instance = createLiValidate(options);
    // window.liValidate = instance.liValidate;
    // window.clearValidateErrors = instance.clearErrors;
    // window.showCustomPopover = instance.showCustomPopover;
  }
};

export default LiValidate;