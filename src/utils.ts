function addSpaceBetweenChineseAndOther(text: string): string {
  return text
    // 在中文和英文之间添加空格
    .replace(/([\u4e00-\u9fa5])([a-zA-Z])/g, '$1 $2')
    .replace(/([a-zA-Z])([\u4e00-\u9fa5])/g, '$1 $2')
    // 在中文和数字之间添加空格
    .replace(/([\u4e00-\u9fa5])(\d)/g, '$1 $2')
    .replace(/(\d)([\u4e00-\u9fa5])/g, '$1 $2')
    // 修复可能出现的多余空格
    .replace(/\s+/g, ' ');
}

export { addSpaceBetweenChineseAndOther };
