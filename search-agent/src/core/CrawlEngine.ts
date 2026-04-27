import { ConfigManager } from './ConfigManager.js';
import { HttpClient } from '../utils/httpClient.js';
import { Logger } from '../utils/logger.js';
import { BaseCrawler, CrawlOptions, CrawlResult } from '../crawlers/BaseCrawler.js';
import { DoubaoCrawler } from '../crawlers/DoubaoCrawler.js';
import { QianwenCrawler } from '../crawlers/QianwenCrawler.js';
import { SearchSource, CrawlTask, AgentError, ErrorCode } from '../types/index.js';
import { generateId, sleep } from '../utils/helpers.js';

export interface CrawlEngineOptions {
  keyword: string;
  sources?: ('doubao' | 'qianwen' | 'all')[];
  maxResults?: number;
  useMock?: boolean;
}

export class CrawlEngine {
  private configManager: ConfigManager;
  private httpClient: HttpClient;
  private logger: Logger;
  private crawlers: Map<string, BaseCrawler>;

  constructor(configManager: ConfigManager, httpClient: HttpClient, logger: Logger) {
    this.configManager = configManager;
    this.httpClient = httpClient;
    this.logger = logger;
    this.crawlers = new Map();

    this.registerCrawlers();
  }

  /**
   * 注册抓取器
   */
  private registerCrawlers(): void {
    const config = this.configManager.getConfig();
    
    this.crawlers.set('doubao', new DoubaoCrawler(config, this.httpClient, this.logger));
    this.crawlers.set('qianwen', new QianwenCrawler(config, this.httpClient, this.logger));
    
    this.logger.info(`Registered ${this.crawlers.size} crawlers`);
  }

  /**
   * 执行抓取任务
   */
  async crawl(options: CrawlEngineOptions): Promise<{ task: CrawlTask; sources: SearchSource[] }> {
    const { keyword, sources = ['all'], maxResults = 10, useMock = false } = options;
    
    this.logger.info(`Starting crawl task for keyword: "${keyword}"`);

    // 创建任务
    const task: CrawlTask = {
      id: generateId('task_'),
      keyword,
      platforms: sources.includes('all') ? ['doubao', 'qianwen'] : sources as string[],
      status: 'running',
      createdAt: new Date(),
    };

    try {
      const allSources: SearchSource[] = [];
      const platformsToCrawl = sources.includes('all') 
        ? ['doubao', 'qianwen'] 
        : sources as string[];

      // 串行执行抓取（避免触发反爬）
      for (const platform of platformsToCrawl) {
        const crawler = this.crawlers.get(platform);
        
        if (!crawler) {
          this.logger.warn(`Crawler not found for platform: ${platform}`);
          continue;
        }

        if (!crawler.isEnabled()) {
          this.logger.warn(`Crawler disabled for platform: ${platform}`);
          continue;
        }

        try {
          let result: CrawlResult;

          if (useMock) {
            // 使用模拟数据
            if (platform === 'doubao') {
              const doubaoCrawler = crawler as DoubaoCrawler;
              result = {
                sources: doubaoCrawler.mockCrawl(keyword, maxResults),
                total: maxResults,
                platform: 'doubao',
              };
            } else if (platform === 'qianwen') {
              const qianwenCrawler = crawler as QianwenCrawler;
              result = {
                sources: qianwenCrawler.mockCrawl(keyword, maxResults),
                total: maxResults,
                platform: 'qianwen',
              };
            } else {
              result = { sources: [], total: 0, platform };
            }
          } else {
            // 执行真实抓取
            result = await crawler.crawl({ keyword, maxResults });
          }

          allSources.push(...result.sources);
          
          this.logger.info(`Crawled ${result.sources.length} sources from ${platform}`);

          // 平台间延迟
          if (platform !== platformsToCrawl[platformsToCrawl.length - 1]) {
            await sleep(this.configManager.get('crawl.delay'));
          }
        } catch (error) {
          this.logger.error(`Failed to crawl ${platform}:`, error);
          // 继续处理其他平台
        }
      }

      // 更新任务状态
      task.status = 'completed';
      task.completedAt = new Date();

      this.logger.info(`Crawl task completed: ${allSources.length} total sources`);

      return { task, sources: allSources };
    } catch (error) {
      task.status = 'failed';
      task.error = error instanceof Error ? error.message : String(error);
      task.completedAt = new Date();

      this.logger.error('Crawl task failed:', error);
      throw error;
    }
  }

  /**
   * 获取已注册的抓取器
   */
  getCrawler(name: string): BaseCrawler | undefined {
    return this.crawlers.get(name);
  }

  /**
   * 获取所有抓取器名称
   */
  getCrawlerNames(): string[] {
    return Array.from(this.crawlers.keys());
  }

  /**
   * 检查抓取器是否启用
   */
  isCrawlerEnabled(name: string): boolean {
    const crawler = this.crawlers.get(name);
    return crawler ? crawler.isEnabled() : false;
  }
}
