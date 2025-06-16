import { validateField } from './validation';
import { showPopover } from './popover';
import {isElementHidden} from './util';
export const setupFieldEvents = (
  errorClass: string,
  popoverClass: string,
  tipDuration?: number
) => {
  document.querySelectorAll('[li-required="true"], [li-rule], [li-reg]').forEach(field => {
    const inputField = field as HTMLInputElement;
    // 跳过隐藏元素
    if (isElementHidden(inputField)) {
      return;
    }
    
    if (inputField.getAttribute('li-event-setup') === 'true') {
      return;
    }

    inputField.addEventListener('blur', (event) => {
      event.stopPropagation();

      setTimeout(() => {
        const result = validateField(inputField, {});
        if (!result.isValid) {
          inputField.classList.add(errorClass);
          if (result.message) {
            // showPopover(inputField, result.message, popoverClass, tipDuration);
          }
        } else {
          inputField.classList.remove(errorClass);
        }
      }, 50);
    });

    inputField.setAttribute('li-event-setup', 'true');
  });
};

export const setupMutationObserver = (
  setupFieldEvents: () => void
) => {
  const observer = new MutationObserver(mutations => {
    let hasNewFields = false;

    mutations.forEach(mutation => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1) {
            const element = node as Element;
            if (element.querySelector('[li-required="true"], [li-rule], [li-reg]') ||
              (element.hasAttribute && (
                element.hasAttribute('li-required') ||
                element.hasAttribute('li-rule') ||
                element.hasAttribute('li-reg')
              ))) {
              hasNewFields = true;
            }
          }
        });
      }
    });

    if (hasNewFields) {
      setupFieldEvents();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['li-required', 'li-message', 'li-rule', 'li-reg']
  });

  return observer;
};