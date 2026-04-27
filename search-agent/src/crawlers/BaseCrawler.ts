import { HttpClient } from '../utils/httpClient.js';
import { Logger } from '../utils/logger.js';
import { Config, SearchSource, AgentError, ErrorCode } from '../types/index.js';
import { generateId, extractDomain, sleep } from '../utils/helpers.js';

export interface CrawlOptions {
  keyword: string;
  maxResults?: number;
}

export interface CrawlResult {
  sources: SearchSource[];
  total: number;
  platform: string;
}

export abstract class BaseCrawler {
  protected config: Config;
  protected httpClient: HttpClient;
  protected logger: Logger;
  protected name: string;

  constructor(config: Config, httpClient: HttpClient, logger: Logger, name: string) {
    this.config = config;
    this.httpClient = httpClient;
    this.logger = logger;
    this.name = name;
  }

  /**
   * 执行抓取
   */
  abstract crawl(options: CrawlOptions): Promise<CrawlResult>;

  /**
   * 获取抓取器名称
   */
  getName(): string {
    return this.name;
  }

  /**
   * 检查是否启用
   */
  isEnabled(): boolean {
    const sourceConfig = this.config.sources[this.name as keyof typeof this.config.sources];
    return sourceConfig?.enabled ?? false;
  }

  /**
   * 创建搜索源对象
   */
  protected createSearchSource(
    platform: 'doubao' | 'qianwen',
    keyword: string,
    title: string,
    url: string,
    snippet: string,
    position: number
  ): SearchSource {
    return {
      id: generateId('src_'),
      platform,
      keyword,
      title: this.cleanText(title),
      url: this.normalizeUrl(url),
      snippet: this.cleanText(snippet),
      domain: extractDomain(url),
      position,
      fetchedAt: new Date(),
    };
  }

  /**
   * 清理文本
   */
  protected cleanText(text: string): string {
    if (!text) return '';
    return text
      .replace(/\s+/g, ' ')
      .replace(/[\n\r\t]/g, ' ')
      .trim();
  }

  /**
   * 标准化URL
   */
  protected normalizeUrl(url: string): string {
    if (!url) return '';
    
    // 移除跟踪参数
    const urlObj = new URL(url);
    const trackingParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'ref', 'source'];
    trackingParams.forEach(param => urlObj.searchParams.delete(param));
    
    return urlObj.toString();
  }

  /**
   * 延迟
   */
  protected async delay(): Promise<void> {
    await sleep(this.config.crawl.delay);
  }

  /**
   * 处理错误
   */
  protected handleError(error: unknown, message: string): never {
    this.logger.error(message, error);
    
    if (error instanceof AgentError) {
      throw error;
    }

    const errorMessage = error instanceof Error ? error.message : String(error);
    
    // 判断错误类型
    if (errorMessage.includes('timeout')) {
      throw new AgentError(ErrorCode.NETWORK_ERROR, `Request timeout: ${message}`, error);
    }
    
    if (errorMessage.includes('ECONNREFUSED') || errorMessage.includes('ENOTFOUND')) {
      throw new AgentError(ErrorCode.NETWORK_ERROR, `Connection failed: ${message}`, error);
    }
    
    if (errorMessage.includes('429') || errorMessage.includes('rate limit')) {
      throw new AgentError(ErrorCode.CRAWL_RESTRICTED, `Rate limited: ${message}`, error);
    }

    throw new AgentError(ErrorCode.PARSE_ERROR, `${message}: ${errorMessage}`, error);
  }
}
