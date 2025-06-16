import { LiValidateOptions } from './types';
import { DEFAULT_OPTIONS, DEFAULT_RULES } from './constants';
import { validateField } from './utils/validation';
import { showPopover, showCustomPopover as showCustomPopoverUtil, clearAllPopovers, getActivePopovers, setActivePopovers } from './utils/popover';
import { setupFieldEvents, setupMutationObserver } from './utils/events';
import { isElementHidden } from './utils/util';
export const createLiValidate = (options: LiValidateOptions = {}) => {
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
  const mergedRules = { ...DEFAULT_RULES, ...(options.rules || {}) };

  const { errorClass, popoverClass, validateMode, tipDuration, position } = mergedOptions;

  // 添加全局CSS
  const addGlobalStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
      .${errorClass} {
        border: 1px solid red !important;
        background-color: rgba(255, 0, 0, 0.05);
      }
      
      .${popoverClass} {
        position: absolute;
        background-color: #f44336;
        color: white;
        padding: 6px 10px;
        border-radius: 4px;
        font-size: 12px;
        z-index: 1000;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        animation: fadeIn 0.3s;
        white-space: nowrap;
      }
      
      /* 根据位置调整箭头 */
      .${popoverClass}[data-position="topLeft"]::before,
      .${popoverClass}[data-position="topRight"]::before {
        content: '';
        position: absolute;
        bottom: -5px;
        width: 0;
        height: 0;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-top: 5px solid #f44336;
      }
      
      .${popoverClass}[data-position="topLeft"]::before {
        left: 10px;
      }
      
      .${popoverClass}[data-position="topRight"]::before {
        right: 10px;
      }
      
      .${popoverClass}[data-position="bottomLeft"]::before,
      .${popoverClass}[data-position="bottomRight"]::before {
        content: '';
        position: absolute;
        top: -5px;
        width: 0;
        height: 0;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-bottom: 5px solid #f44336;
      }
      
      .${popoverClass}[data-position="bottomLeft"]::before {
        left: 10px;
      }
      
      .${popoverClass}[data-position="bottomRight"]::before {
        right: 10px;
      }
      
      /* 左右侧提示框箭头样式 */
      .${popoverClass}[data-position="left"]::before,
      .${popoverClass}[data-position="right"]::before {
        content: '';
        position: absolute;
        top: 50%;
        width: 0;
        height: 0;
        border-top: 5px solid transparent;
        border-bottom: 5px solid transparent;
        transform: translateY(-50%);
      }
      
      .${popoverClass}[data-position="left"]::before {
        right: -5px;
        border-left: 5px solid #f44336;
      }
      
      .${popoverClass}[data-position="right"]::before {
        left: -5px;
        border-right: 5px solid #f44336;
      }
    `;
    document.head.appendChild(style);
  };



  function observeScrollEnd(element: Element, callback: Function) {
    const ratio = 0.1
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && entries[0].intersectionRatio >= ratio) {
        console.log('滚动完成' + entries[0].intersectionRatio);
        callback();
        observer.disconnect();
      }
    }, { threshold: ratio }); // 百分之ratio时候可见时触发，
    observer.observe(element);
  }


  // 清除所有错误样式
  const clearAllErrorStyles = () => {
    document.querySelectorAll(`.${errorClass}`).forEach(element => {
      element.classList.remove(errorClass);
    });
  };

  // 验证表单
  const validateForm = (formId: string, validateOptions?: LiValidateOptions): boolean => {
    const currentOptions = { ...mergedOptions, ...(validateOptions || {}) };
    const currentRules = { ...mergedRules, ...(validateOptions?.rules || {}) };

    clearAllPopovers();
    clearAllErrorStyles();

    const formContainer = document.querySelector(`[li-form="${formId}"]`);
    if (!formContainer) {
      console.error(`找不到ID为${formId}的表单容器`);
      return false;
    }

    const fields = formContainer.querySelectorAll(`[li-form="${formId}"] [li-required="true"], 
      [li-form="${formId}"] [li-rule], 
      [li-form="${formId}"] [li-reg]`);

    // 过滤掉隐藏元素
    const visibleFields = Array.from(fields).filter(field =>
      !isElementHidden(field as HTMLElement)
    );


    let isValid = true;
    let firstInvalidElement: Element | null = null;
    let firstErrorMessage: string | null = null;
    const invalidFields: Array<{ element: HTMLElement, message: string }> = [];

    if (currentOptions.validateMode === 'single') {
      for (let i = 0; i < visibleFields.length; i++) {
        const field = visibleFields[i] as HTMLInputElement;
        const result = validateField(field, currentRules);

        if (!result.isValid) {
          field.classList.add(currentOptions.errorClass || errorClass);
          isValid = false;
          firstInvalidElement = field;
          firstErrorMessage = result.message || null;
          break;
        }
      }
    } else {
      fields.forEach(field => {
        const inputField = field as HTMLInputElement;
        const result = validateField(inputField, currentRules);

        if (!result.isValid) {
          field.classList.add(currentOptions.errorClass || errorClass);
          isValid = false;

          if (!firstInvalidElement) {
            firstInvalidElement = field;
            firstErrorMessage = result.message || null;
          }

          if (result.message) {
            invalidFields.push({
              element: inputField,
              message: result.message
            });
          }
        }
      });
    }

    if (firstInvalidElement) {
      (firstInvalidElement as HTMLElement).style.scrollMargin = currentOptions.scrollMargin;
      (firstInvalidElement as HTMLElement).style.scrollMarginTop = currentOptions.scrollMarginTop;
      (firstInvalidElement as HTMLElement).style.scrollMarginRight = currentOptions.scrollMarginRight;
      (firstInvalidElement as HTMLElement).style.scrollMarginBottom = currentOptions.scrollMarginBottom;
      (firstInvalidElement as HTMLElement).style.scrollMarginLeft = currentOptions.scrollMarginLeft;
      firstInvalidElement.scrollIntoView({ behavior: 'smooth', block: 'start' });

      observeScrollEnd(firstInvalidElement, () => {
        const element = firstInvalidElement as HTMLElement;
        element.focus();

        if (currentOptions.validateMode === 'single' || currentOptions.validateMode === 'default') {
          if (firstErrorMessage) {
            showPopover(
              element,
              (firstErrorMessage || "").replace(/,/, '<br/>'),
              currentOptions.popoverClass || popoverClass,
              currentOptions.tipDuration,
              currentOptions.position // 传递position参数
            );
          }
        } else if (currentOptions.validateMode === 'all') {
          setTimeout(() => {
            invalidFields.forEach((item, index) => {
              setTimeout(() => {
                showPopover(
                  item.element,
                  (item.message || "").replace(/,/, '<br/>'),
                  currentOptions.popoverClass || popoverClass,
                  currentOptions.tipDuration,
                  currentOptions.position // 传递position参数
                );
              }, index * 50);
            });
          }, 100);
        }
      });
    }

    return isValid;
  };

  // 清空错误
  const clearErrors = (formId?: string) => {
    if (formId) {
      const formContainer = document.querySelector(`[li-form="${formId}"]`);
      if (formContainer) {
        formContainer.querySelectorAll(`.${errorClass}`).forEach(element => {
          element.classList.remove(errorClass);
        });


        const activePopovers = getActivePopovers().filter(popover => {
          if (formContainer.contains(popover.parentElement)) {
            if (popover.parentNode) {
              popover.parentNode.removeChild(popover);
            }
            return false;
          }
          return true;
        });
        setActivePopovers(activePopovers)
      }
    } else {
      clearAllPopovers();
      clearAllErrorStyles();
    }
  };

  // 初始化
  const init = () => {
    addGlobalStyles();

    if (validateMode === 'default') {
      const setupEvents = () => setupFieldEvents(errorClass, popoverClass, tipDuration);

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupEvents);
      } else {
        setupEvents();
      }

      setupMutationObserver(setupEvents);
    }
  };

  const showCustomPopover = (element: HTMLElement,
    message: string,
    popoverClass: string = 'li-popover',
    tipDuration?: number,
    _position?: string // 添加position参数
  ) => {
    showCustomPopoverUtil(element, message, popoverClass, tipDuration, _position || position)
  }

  init();

  return {
    liValidate: validateForm,
    clearErrors,
    showCustomPopover,
  };
};