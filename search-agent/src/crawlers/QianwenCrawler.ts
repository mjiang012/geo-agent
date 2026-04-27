import * as cheerio from 'cheerio';
import { BaseCrawler, CrawlOptions, CrawlResult } from './BaseCrawler.js';
import { SearchSource, AgentError, ErrorCode, Config } from '../types/index.js';
import { HttpClient } from '../utils/httpClient.js';
import { Logger } from '../utils/logger.js';

export class QianwenCrawler extends BaseCrawler {
  constructor(config: Config, httpClient: HttpClient, logger: Logger) {
    super(config, httpClient, logger, 'qianwen');
  }

  async crawl(options: CrawlOptions): Promise<CrawlResult> {
    const { keyword, maxResults = 10 } = options;
    
    this.logger.info(`Starting Qianwen crawl for keyword: "${keyword}"`);

    if (!this.isEnabled()) {
      this.logger.warn('Qianwen crawler is disabled');
      return { sources: [], total: 0, platform: 'qianwen' };
    }

    try {
      // 千问/通义千问搜索URL
      const searchUrl = `https://tongyi.aliyun.com/search?q=${encodeURIComponent(keyword)}`;
      
      this.logger.debug(`Fetching: ${searchUrl}`);
      
      // 获取搜索页面
      const html = await this.httpClient.get<string>(searchUrl, {
        headers: {
          'Referer': 'https://tongyi.aliyun.com/',
        },
      });

      // 解析搜索结果
      const sources = this.parseSearchResults(html, keyword, maxResults);
      
      this.logger.info(`Qianwen crawl completed: ${sources.length} sources found`);

      await this.delay();

      return {
        sources,
        total: sources.length,
        platform: 'qianwen',
      };
    } catch (error) {
      this.handleError(error, `Failed to crawl Qianwen for "${keyword}"`);
    }
  }

  /**
   * 解析搜索结果
   */
  private parseSearchResults(html: string, keyword: string, maxResults: number): SearchSource[] {
    const sources: SearchSource[] = [];
    
    try {
      const $ = cheerio.load(html);
      
      // 千问搜索结果选择器（基于常见结构）
      // 注意：实际选择器可能需要根据页面结构调整
      const resultSelectors = [
        '.search-result-item',
        '.result-item',
        '[data-testid="search-result"]',
        '.search-item',
        '.result',
        '.reference-item',  // 千问可能使用的引用样式
      ];

      let results: ReturnType<typeof $> | null = null;
      
      // 尝试不同的选择器
      for (const selector of resultSelectors) {
        results = $(selector);
        if (results.length > 0) {
          this.logger.debug(`Found ${results.length} results with selector: ${selector}`);
          break;
        }
      }

      // 如果没有找到标准结果，尝试更通用的选择
      if (!results || results.length === 0) {
        // 尝试查找包含链接和标题的元素
        $('a[href^="http"]').each((_: number, element: any) => {
          const $el = $(element);
          const title = $el.text() || $el.find('h3, h2, .title').text();
          const url = $el.attr('href') || '';
          
          if (title && url && !url.includes('aliyun.com') && !url.includes('tongyi')) {
            const snippet = $el.parent().find('p, .snippet, .description, .summary').text() || '';
            
            sources.push(this.createSearchSource(
              'qianwen',
              keyword,
              title,
              url,
              snippet,
              sources.length + 1
            ));
          }
        });
      } else {
        // 使用找到的选择器解析
        results.each((index: number, element: any) => {
          if (sources.length >= maxResults) return false;

          const $el = $(element);
          
          // 尝试多种标题选择器
          const title = 
            $el.find('h3, h2, .title, .result-title').first().text() ||
            $el.find('a').first().text() ||
            '';

          // 尝试多种URL选择器
          const url = 
            $el.find('a').first().attr('href') ||
            $el.find('cite, .url, .link').first().text() ||
            '';

          // 尝试多种摘要选择器
          const snippet = 
            $el.find('p, .snippet, .description, .content, .summary, .abstract').first().text() ||
            '';

          if (title && url) {
            sources.push(this.createSearchSource(
              'qianwen',
              keyword,
              title,
              url,
              snippet,
              index + 1
            ));
          }
        });
      }

      this.logger.debug(`Parsed ${sources.length} valid sources from Qianwen`);
      
    } catch (error) {
      this.logger.error('Error parsing Qianwen results:', error);
      throw new AgentError(
        ErrorCode.PARSE_ERROR,
        `Failed to parse Qianwen search results: ${error instanceof Error ? error.message : String(error)}`
      );
    }

    return sources.slice(0, maxResults);
  }

  /**
   * 模拟搜索结果（用于测试）
   */
  mockCrawl(keyword: string, maxResults: number = 10): SearchSource[] {
    this.logger.info(`Using mock data for Qianwen: "${keyword}"`);
    
    const mockSources: SearchSource[] = [
      {
        id: `src_qianwen_${Date.now()}_1`,
        platform: 'qianwen',
        keyword,
        title: `${keyword}是什么？一文读懂核心概念`,
        url: 'https://tech.example.com/intro',
        snippet: `${keyword}是当前热门的技术/话题，本文将从定义、原理、应用场景等多个维度进行全面解读。`,
        domain: 'tech.example.com',
        position: 1,
        fetchedAt: new Date(),
      },
      {
        id: `src_qianwen_${Date.now()}_2`,
        platform: 'qianwen',
        keyword,
        title: `${keyword}实战案例分享`,
        url: 'https://case.example.com/demo',
        snippet: `通过真实案例深入了解${keyword}的实际应用，包含详细的操作步骤和效果分析。`,
        domain: 'case.example.com',
        position: 2,
        fetchedAt: new Date(),
      },
      {
        id: `src_qianwen_${Date.now()}_3`,
        platform: 'qianwen',
        keyword,
        title: `${keyword}常见问题FAQ`,
        url: 'https://faq.example.com/questions',
        snippet: `汇总关于${keyword}的最常见问题及专业解答，帮助您快速解决疑惑。`,
        domain: 'faq.example.com',
        position: 3,
        fetchedAt: new Date(),
      },
      {
        id: `src_qianwen_${Date.now()}_4`,
        platform: 'qianwen',
        keyword,
        title: `${keyword}与其他方案的对比评测`,
        url: 'https://compare.example.com/vs',
        snippet: `客观对比${keyword}与同类产品的优劣势，为您的选择提供参考依据。`,
        domain: 'compare.example.com',
        position: 4,
        fetchedAt: new Date(),
      },
    ];

    return mockSources.slice(0, maxResults);
  }
}
