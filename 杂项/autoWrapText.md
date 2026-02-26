```js
/**
 * 将一段文字的字符串分行，得到一个数组，处理中英文混合，支持自定义字体加载
 * @param {HTMLElement} container - 容器元素，用于获取各种样式
 * @param {string} text - 原始文本
 * @param {object} options - 配置选项
 * @return {string[]} - 分好行的数组
 */
export default function autoWrapText(container, text, options = {}) {
  const {
    preserveWords = true, // 是否尽量保持单词完整
  } = options;

  // 从容器获取计算样式
  const computedStyle = window.getComputedStyle(container);
  const fontSize = computedStyle.fontSize;
  const fontFamily = computedStyle.fontFamily;
  const fontWeight = computedStyle.fontWeight;
  const fontStyle = computedStyle.fontStyle;
  const containerWidth = container.getBoundingClientRect().width || container.clientWidth;

  // 创建测量容器，添加上容器元素的样式，用于计算文本宽度与容器宽度对比
  const measureDiv = document.createElement("div");
  measureDiv.style.position = "absolute";
  measureDiv.style.visibility = "hidden";
  measureDiv.style.whiteSpace = "nowrap";
  measureDiv.style.fontFamily = fontFamily;
  measureDiv.style.fontSize = fontSize;
  measureDiv.style.fontWeight = fontWeight;
  measureDiv.style.fontStyle = fontStyle;
  document.body.appendChild(measureDiv);

  let lines = [];

  // 如果有换行符，根据换行符分割文本为段落
  const paragraphs = text.split(/(?:\n|<br\s*\/?>)/i);

  // 处理每个段落
  for (let p = 0; p < paragraphs.length; p++) {
    const paragraph = paragraphs[p];

    // 如果段落为空，添加空行
    if (paragraph === "") {
      lines.push("");
      continue;
    }

    let startIndex = 0;

    /**
     * 递归分割段落内的文本
     * @param {number} startIdx - 文本开始下标
     */
    function splitParagraphText(startIdx) {
      if (startIdx >= paragraph.length) return;

      let left = startIdx;
      let right = paragraph.length;
      let lastFitIdx = startIdx;

      // 二分查找找到合适的断点
      while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        const testText = paragraph.substring(startIdx, mid);

        measureDiv.textContent = testText;
        const width = measureDiv.offsetWidth;
        if (width <= containerWidth) {
          lastFitIdx = mid;
          left = mid + 1;
        } else {
          right = mid - 1;
        }
      }

      // 如果没有找到合适的断点（单个字符就超宽）
      if (lastFitIdx === startIdx) {
        lastFitIdx = startIdx + 1;
      }

      // 尽量不在单词中间断开（针对英文）
      if (preserveWords && lastFitIdx < paragraph.length) {
        const charAtBreak = paragraph[lastFitIdx];
        const prevChar = paragraph[lastFitIdx - 1];

        // 如果是英文字母或数字，向前找到单词边界
        if (/\w/.test(charAtBreak) && /\w/.test(prevChar)) {
          let wordStart = lastFitIdx;
          while (
            wordStart > startIdx &&
            /\w/.test(paragraph[wordStart - 1])
          ) {
            wordStart--;
          }

          if (wordStart > startIdx) {
            lastFitIdx = wordStart;
          }
        }
      }

      // 添加行
      let lineText = paragraph.substring(startIdx, lastFitIdx);
      if (lineText || startIdx === 0) {
        // 确保至少添加一次，即使为空字符串
        //处理一行只有一个标点符号的问题，将上一行的最后一个字拿下来放在最前面，同时去掉上一行的最后一个字
        if(![null,undefined,''].includes(lines.at(-1)) && isPunctuationOnly(lineText)){
          let last = lines.at(-1);
          let lastWord = last.substring(last.length - 1);
          lineText = lastWord + lineText
          lines[lines.length - 1] = last.substring(0,last.length - 1)
        }
        lines.push(lineText);
      }

      // 继续处理剩余文本
      if (lastFitIdx < paragraph.length) {
        splitParagraphText(lastFitIdx);
      }
    }

    // 处理当前段落
    splitParagraphText(startIndex);
  }
  /**
   * 判断是否这一行都是标点符号，用于处理一行只有个标点符号的情况
   * @param {string} str - 文本
   * @returns {boolean}
   */
  function isPunctuationOnly(str) {
    // 排除空字符串
    if (!str) return false;
    
    // 检查是否每一个字符都是标点符号（排除中文、英文字母、数字）
    for (let i = 0; i < str.length; i++) {
      const char = str[i];
      // 如果字符是中文、英文字母或数字，则不是纯标点符号
      if (/[\u4e00-\u9fff]|[a-zA-Z]|[0-9]/.test(char)) {
        return false;
      }
    }
    
    // 再检查是否至少有一个字符是标点符号或特殊符号
    return /[^\w\s]/.test(str);
  }
  // 清理
  document.body.removeChild(measureDiv);

  return lines;
}
```

