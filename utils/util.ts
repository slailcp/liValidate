/**
 * 检查元素或其任意父元素是否被隐藏(display: none)
 * @param element 要检查的DOM元素
 * @returns 如果元素或其任意父元素被隐藏则返回true
 */
export const isElementHidden = (element: HTMLElement): boolean => {
  // 检查元素本身
  if (window.getComputedStyle(element).display === 'none') {
    return true;
  }

  // 检查所有父元素
  let parent = element.parentElement;
  while (parent) {
    if (window.getComputedStyle(parent).display === 'none') {
      return true;
    }
    parent = parent.parentElement;
  }

  return false;
};