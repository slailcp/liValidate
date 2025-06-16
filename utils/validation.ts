// import { LiValidateOptions } from '../types';
// import { DEFAULT_RULES } from '../constants';
import {isElementHidden} from './util';
export const validateField = (
  field: HTMLInputElement,
  rules: Record<string, { pattern: RegExp, message: string }>
): { isValid: boolean; message?: string } => {
 // 跳过隐藏元素
 if (isElementHidden(field)) {
  return { isValid: true };
}
  
  const value = field.value.trim();
  const isRequired = field.hasAttribute('li-required') && field.getAttribute('li-required') === 'true';
  
  if (isRequired && !value) {
    return {
      isValid: false,
      message: field.getAttribute('li-message') || '此字段为必填项'
    };
  }

  if (!value && !isRequired) {
    return { isValid: true};
  }
  
  const messageAttr = field.getAttribute('li-message') || '';
  const messages = messageAttr?messageAttr.split(',').map(msg => msg.trim()):[];
  const failedMessages: string[] = [];
  
  // 检查预定义规则
  const ruleAttr = field.getAttribute('li-rule');
  if (ruleAttr && value) {
    const ruleNames = ruleAttr?ruleAttr.split(',').map(rule => rule.trim()):[];
    
    for (let i = 0; i < ruleNames.length; i++) {
      const ruleName = ruleNames[i];
      if (rules[ruleName]) {
        const regex = rules[ruleName].pattern;
        if (!regex.test(value)) {
          
          const message = (i < messages.length) ? messages[i] : rules[ruleName].message;
          failedMessages.push(message);
        }
      } else {
        console.warn(`未定义的规则: ${ruleName}`);
      }
    }
  }

  // 检查自定义正则表达式
  const regAttr = field.getAttribute('li-reg');
  if (regAttr && value) {
    try {
      const regexStrings = regAttr?regAttr.split(',').map(reg => reg.trim()):[];
      
      for (let i = 0; i < regexStrings.length; i++) {
        const regStr = regexStrings[i];
        const regexParts = regStr.match(/^\/(.*?)\/([gimuy]*)$/);
        let regex;

        if (regexParts) {
          regex = new RegExp(regexParts[1], regexParts[2]);
        } else {
          regex = new RegExp(regStr);
        }

        if (!regex.test(value)) {
          const message = (i < messages.length) ? messages[i] : '请输入符合格式要求的内容';
          failedMessages.push(message);
        }
      }
    } catch (e) {
      console.error('无效的正则表达式:', regAttr, e);
      failedMessages.push('表单配置错误：无效的正则表达式');
    }
  }

  if (failedMessages.length > 0) {
    return {
      isValid: false,
      message: failedMessages.join('<br>')
    };
  }

  return { isValid: true };
};

// export const setupGlobalValidation = (options: LiValidateOptions) => {
//   const mergedRules = { ...DEFAULT_RULES, ...(options.rules || {}) };
  
//   window.validate = (formId: string, validateOptions?: LiValidateOptions) => {
//     // 合并配置
//     const currentOptions = { ...options, ...(validateOptions || {}) };
//     const currentRules = { ...mergedRules, ...(validateOptions?.rules || {}) };
    
//     // 验证逻辑...
//     // 这里需要从core.ts导入validateForm函数
//     return true;
//   };

//   window.clearValidateErrors = (formId?: string) => {
//     // 清空错误逻辑...
//     // 这里需要从core.ts导入clearErrors函数
//   };
// };