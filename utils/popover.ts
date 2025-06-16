import { DEFAULT_OPTIONS } from '../constants';
export let activePopovers: HTMLElement[] = [];
let autoHideTimers: number[] = [];


export const getActivePopovers = () => activePopovers
export const setActivePopovers = (val: HTMLElement[]) => { activePopovers = val }


const getScrollParent = (element: HTMLElement): HTMLElement => {
  let parent = element.parentElement;
  while (parent) {
    const style = window.getComputedStyle(parent);
    if (style.overflow === 'auto' || style.overflowY === 'auto' || 
        style.overflow === 'scroll' || style.overflowY === 'scroll') {
      return parent;
    }
    parent = parent.parentElement;
  }
  return document.documentElement;
};
// 公共方法：创建并定位气泡
const createAndPositionPopover = (
  element: HTMLElement,
  message: string,
  popoverClass: string,
  position: string = DEFAULT_OPTIONS.position // 默认右下角
): HTMLElement => {
  
  const popover = document.createElement('div');
  popover.className = popoverClass;
  popover.innerHTML = message;
  popover.style.zIndex = '10000';
  popover.dataset.position = position; // 存储位置配置

  const rect = element.getBoundingClientRect();
  const scrollContainer = getScrollParent(element);
  const isInScrollContainer = scrollContainer !== document.documentElement && 
    (scrollContainer.scrollHeight > scrollContainer.clientHeight || 
     scrollContainer.scrollWidth > scrollContainer.clientWidth);

  if (isInScrollContainer) {
    const containerRect = scrollContainer.getBoundingClientRect();
    const scrollLeft = scrollContainer.scrollLeft;
    const scrollTop = scrollContainer.scrollTop;
    
    popover.style.position = 'absolute';
    
    // 根据位置配置设置不同定位
    switch(position) {
      case 'topLeft':
        popover.style.left = `${rect.left - containerRect.left + scrollLeft}px`;
        popover.style.top = `${rect.top - containerRect.top + scrollTop - 5}px`;
        popover.style.transform = 'translateY(-100%)';
        break;
      case 'topRight':
        popover.style.left = `${rect.right - containerRect.left + scrollLeft}px`;
        popover.style.top = `${rect.top - containerRect.top + scrollTop - 5}px`;
        popover.style.transform = 'translateY(-100%) translateX(-100%)';
        break;
      case 'bottomLeft':
        popover.style.left = `${rect.left - containerRect.left + scrollLeft}px`;
        popover.style.top = `${rect.bottom - containerRect.top + scrollTop + 5}px`;
        break;
      case 'bottomRight':
        popover.style.left = `${rect.right - containerRect.left + scrollLeft}px`;
        popover.style.top = `${rect.bottom - containerRect.top + scrollTop + 5}px`;
        popover.style.transform = 'translateX(-100%)';
        break;
      case 'left':
        popover.style.left = `${rect.left - containerRect.left + scrollLeft - 5}px`;
        popover.style.top = `${rect.top - containerRect.top + scrollTop + rect.height/2}px`;
        popover.style.transform = 'translateX(-100%) translateY(-50%)';
        break;
      case 'right':
        popover.style.left = `${rect.right - containerRect.left + scrollLeft + 5}px`;
        popover.style.top = `${rect.top - containerRect.top + scrollTop + rect.height/2}px`;
        popover.style.transform = 'translateY(-50%)';
        break;
      default:
        popover.style.left = `${rect.left - containerRect.left + scrollLeft}px`;
        popover.style.top = `${rect.bottom - containerRect.top + scrollTop + 5}px`;
    }

    if (window.getComputedStyle(scrollContainer).position === 'static') {
      scrollContainer.style.position = 'relative';
    }
    scrollContainer.appendChild(popover);
  } else {
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    popover.style.position = 'absolute';
    
    // 根据位置配置设置不同定位
    switch(position) {
      case 'topLeft':
        popover.style.left = `${rect.left + scrollLeft}px`;
        popover.style.top = `${rect.top + scrollTop - 5}px`;
        popover.style.transform = 'translateY(-100%)';
        break;
      case 'topRight':
        popover.style.left = `${rect.right + scrollLeft}px`;
        popover.style.top = `${rect.top + scrollTop - 5}px`;
        popover.style.transform = 'translateY(-100%) translateX(-100%)';
        break;
      case 'bottomLeft':
        popover.style.left = `${rect.left + scrollLeft}px`;
        popover.style.top = `${rect.bottom + scrollTop + 5}px`;
        break;
      case 'bottomRight':
        popover.style.left = `${rect.right + scrollLeft}px`;
        popover.style.top = `${rect.bottom + scrollTop + 5}px`;
        popover.style.transform = 'translateX(-100%)';
        break;
      case 'left':
        popover.style.left = `${rect.left + scrollLeft - 5}px`;
        popover.style.top = `${rect.top + scrollTop + rect.height/2}px`;
        popover.style.transform = 'translateX(-100%) translateY(-50%)';
        break;
      case 'right':
        popover.style.left = `${rect.right + scrollLeft + 5}px`;
        popover.style.top = `${rect.top + scrollTop + rect.height/2}px`;
        popover.style.transform = 'translateY(-50%)';
        break;
      default:
        popover.style.left = `${rect.left + scrollLeft}px`;
        popover.style.top = `${rect.bottom + scrollTop + 5}px`;
    }
    document.body.appendChild(popover);
  }

  return popover;
};

// 公共方法：设置气泡自动消失
const setupAutoHide = (popover: HTMLElement, tipDuration?: number) => {
  if (tipDuration && tipDuration > 0) {
    const timer = window.setTimeout(() => {
      removePopoverElement(popover);
    }, tipDuration);
    autoHideTimers.push(timer);
  }
};

export const showPopover = (
  element: HTMLElement,
  message: string,
  popoverClass: string,
  tipDuration?: number,
  position?: string // 添加position参数
) => {
  const popover = createAndPositionPopover(element, message, popoverClass, position); // 传递position参数
  activePopovers.push(popover);

  popover.addEventListener('click', (e) => e.stopPropagation());
  document.addEventListener('click', function removePopover(e) {
    if (e.target !== element && !popover.contains(e.target as Node)) {
      removePopoverElement(popover);
      document.removeEventListener('click', removePopover);
    }
  });

  setupAutoHide(popover, tipDuration);
};

export const showCustomPopover = (
  element: HTMLElement,
  message: string,
  popoverClass: string = 'li-popover',
  tipDuration?: number,
  position?: string // 添加position参数
) => {
  if (!element) {
    console.error(`请传入element`);
    return false;
  }
  clearPopoversForElement(element);
  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  
  const popover = createAndPositionPopover(element, message, popoverClass===null?'li-popover':'',position);
  activePopovers.push(popover);
  setupAutoHide(popover, tipDuration);
};


export const clearPopoversForElement = (element: HTMLElement) => {
  const elementId = element.id || '';
  activePopovers = activePopovers.filter(popover => {
    if (popover.dataset.targetElement === elementId ||
      popover.parentElement?.contains(element)) {
      if (popover.dataset.timerId) {
        window.clearTimeout(Number(popover.dataset.timerId));
      }
      if (popover.parentNode) {
        popover.parentNode.removeChild(popover);
      }
      return false;
    }
    return true;
  });
};

export const clearAllPopovers = () => {
  autoHideTimers.forEach(timer => window.clearTimeout(timer));
  autoHideTimers = [];

  activePopovers.forEach(popover => {
    // 移除滚动监听
    if (popover.dataset.scrollListener === 'true') {
      const scrollContainer = popover.parentElement;
      const updateFn = new Function('return ' + popover.dataset.updateFn)();
      scrollContainer?.removeEventListener('scroll', updateFn);
    }

    if (popover?.parentNode) {
      popover.parentNode.removeChild(popover);
    }
  });
  activePopovers = [];
};

const removePopoverElement = (popover: HTMLElement) => {
  if (popover.parentNode) {
    popover.parentNode.removeChild(popover);
  }
  const index = activePopovers.indexOf(popover);
  if (index > -1) {
    activePopovers.splice(index, 1);
  }
};


