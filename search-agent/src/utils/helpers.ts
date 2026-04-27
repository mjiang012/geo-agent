import crypto from 'crypto';
import { URL } from 'url';

/**
 * 生成唯一ID
 */
export function generateId(prefix: string = ''): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}${timestamp}${random}`;
}

/**
 * 从URL中提取域名
 */
export function extractDomain(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

/**
 * 延迟函数
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 格式化日期
 */
export function formatDate(date: Date): string {
  return date.toISOString();
}

/**
 * 截断文本
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * 计算文本中的中文字数
 */
export function countChineseWords(text: string): number {
  const chineseMatches = text.match(/[\u4e00-\u9fa5]/g);
  return chineseMatches ? chineseMatches.length : 0;
}

/**
 * 计算文本中的总词数（中文+英文单词）
 */
export function countWords(text: string): number {
  const chineseCount = countChineseWords(text);
  const englishWords = text.match(/[a-zA-Z]+/g) || [];
  return chineseCount + englishWords.length;
}

/**
 * 分句
 */
export function splitSentences(text: string): string[] {
  // 匹配中文句号、问号、感叹号或英文句号、问号、感叹号
  return text
    .split(/[。！？.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);
}

/**
 * 计算平均句长
 */
export function calculateAvgSentenceLength(text: string): number {
  const sentences = splitSentences(text);
  if (sentences.length === 0) return 0;
  
  const totalWords = sentences.reduce((sum, sentence) => sum + countWords(sentence), 0);
  return Math.round(totalWords / sentences.length);
}

/**
 * 提取关键词（简单实现，基于词频）
 */
export function extractKeywords(text: string, topN: number = 10): string[] {
  // 移除标点符号和特殊字符
  const cleanText = text.replace(/[^\u4e00-\u9fa5a-zA-Z0-9\s]/g, ' ');
  
  // 分词（简单实现：中文按字，英文按空格）
  const words: string[] = [];
  const tokens = cleanText.split(/\s+/);
  
  for (const token of tokens) {
    if (/^[\u4e00-\u9fa5]+$/.test(token)) {
      // 中文：提取2-4字词组
      for (let i = 0; i < token.length - 1; i++) {
        for (let len = 2; len <= 4 && i + len <= token.length; len++) {
          words.push(token.substring(i, i + len));
        }
      }
    } else if (token.length > 2) {
      // 英文：只保留长度大于2的词
      words.push(token.toLowerCase());
    }
  }
  
  // 统计词频
  const frequency: Record<string, number> = {};
  for (const word of words) {
    frequency[word] = (frequency[word] || 0) + 1;
  }
  
  // 过滤停用词（简单列表）
  const stopWords = new Set(['的', '了', '在', '是', '我', '有', '和', '就', '不', '人', '都', '一', '一个', '上', '也', '很', '到', '说', '要', '去', '你', '会', '着', '没有', '看', '好', '自己', '这', '那', '这些', '那些', '这个', '那个', '之', '与', '及', '等', '或', '但', '而', '因为', '所以', '如果', '虽然', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by']);
  
  // 排序并返回前N个
  return Object.entries(frequency)
    .filter(([word]) => !stopWords.has(word) && word.length >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([word]) => word);
}

/**
 * 计算关键词密度
 */
export function calculateKeywordDensity(text: string, keywords: string[]): Record<string, number> {
  const totalWords = countWords(text);
  if (totalWords === 0) return {};
  
  const density: Record<string, number> = {};
  const lowerText = text.toLowerCase();
  
  for (const keyword of keywords) {
    const regex = new RegExp(keyword.toLowerCase(), 'g');
    const matches = lowerText.match(regex) || [];
    density[keyword] = parseFloat(((matches.length * keyword.length) / totalWords).toFixed(4));
  }
  
  return density;
}

/**
 * 安全解析JSON
 */
export function safeJsonParse<T>(json: string, defaultValue: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return defaultValue;
  }
}

/**
 * 深拷贝对象
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * 合并数组并去重
 */
export function mergeUnique<T>(...arrays: T[][]): T[] {
  return [...new Set(arrays.flat())];
}

/**
 * 按指定字段分组
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const groupKey = String(item[key]);
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}
