import * as cheerio from 'cheerio';
import { BaseCrawler, CrawlOptions, CrawlResult } from './BaseCrawler.js';
import { SearchSource, AgentError, ErrorCode, Config } from '../types/index.js';
import { HttpClient } from '../utils/httpClient.js';
import { Logger } from '../utils/logger.js';

export class DoubaoCrawler extends BaseCrawler {
  constructor(config: Config, httpClient: HttpClient, logger: Logger) {
    super(config, httpClient, logger, 'doubao');
  }

  async crawl(options: CrawlOptions): Promise<CrawlResult> {
    const { keyword, maxResults = 10 } = options;
    
    this.logger.info(`Starting Doubao crawl for keyword: "${keyword}"`);

    if (!this.isEnabled()) {
      this.logger.warn('Doubao crawler is disabled');
      return { sources: [], total: 0, platform: 'doubao' };
    }

    try {
      // 豆包搜索URL
      const searchUrl = `https://www.doubao.com/search?q=${encodeURIComponent(keyword)}`;
      
      this.logger.debug(`Fetching: ${searchUrl}`);
      
      // 获取搜索页面
      const html = await this.httpClient.get<string>(searchUrl, {
        headers: {
          'Referer': 'https://www.doubao.com/',
        },
      });

      // 解析搜索结果
      const sources = this.parseSearchResults(html, keyword, maxResults);
      
      this.logger.info(`Doubao crawl completed: ${sources.length} sources found`);

      await this.delay();

      return {
        sources,
        total: sources.length,
        platform: 'doubao',
      };
    } catch (error) {
      this.handleError(error, `Failed to crawl Doubao for "${keyword}"`);
    }
  }

  /**
   * 解析搜索结果
   */
  private parseSearchResults(html: string, keyword: string, maxResults: number): SearchSource[] {
    const sources: SearchSource[] = [];
    
    try {
      const $ = cheerio.load(html);
      
      // 豆包搜索结果选择器（基于常见结构）
      // 注意：实际选择器可能需要根据页面结构调整
      const resultSelectors = [
        '.search-result-item',
        '.result-item',
        '[data-testid="search-result"]',
        '.web-bingul',  // 可能的搜索结果容器
        '.result',
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
          
          if (title && url && !url.includes('doubao.com')) {
            const snippet = $el.parent().find('p, .snippet, .description').text() || '';
            
            sources.push(this.createSearchSource(
              'doubao',
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
            $el.find('h3, h2, .title, a[data-testid="result-title"]').first().text() ||
            $el.find('a').first().text() ||
            '';

          // 尝试多种URL选择器
          const url = 
            $el.find('a').first().attr('href') ||
            $el.find('cite, .url').first().text() ||
            '';

          // 尝试多种摘要选择器
          const snippet = 
            $el.find('p, .snippet, .description, .content').first().text() ||
            '';

          if (title && url) {
            sources.push(this.createSearchSource(
              'doubao',
              keyword,
              title,
              url,
              snippet,
              index + 1
            ));
          }
        });
      }

      this.logger.debug(`Parsed ${sources.length} valid sources from Doubao`);
      
    } catch (error) {
      this.logger.error('Error parsing Doubao results:', error);
      throw new AgentError(
        ErrorCode.PARSE_ERROR,
        `Failed to parse Doubao search results: ${error instanceof Error ? error.message : String(error)}`
      );
    }

    return sources.slice(0, maxResults);
  }

  /**
   * 模拟搜索结果（用于测试）
   */
  mockCrawl(keyword: string, maxResults: number = 10): SearchSource[] {
    this.logger.info(`Using mock data for Doubao: "${keyword}"`);
    
    const mockSources: SearchSource[] = [
      {
        id: `src_doubao_${Date.now()}_1`,
        platform: 'doubao',
        keyword,
        title: `${keyword} - 最新资讯与详细介绍`,
        url: 'https://example.com/article1',
        snippet: `本文详细介绍了${keyword}的相关信息，包括最新动态、使用方法以及常见问题解答。`,
        domain: 'example.com',
        position: 1,
        fetchedAt: new Date(),
      },
      {
        id: `src_doubao_${Date.now()}_2`,
        platform: 'doubao',
        keyword,
        title: `${keyword}使用指南：从入门到精通`,
        url: 'https://example.com/guide',
        snippet: `一份完整的${keyword}使用教程，帮助您快速掌握核心功能和高级技巧。`,
        domain: 'example.com',
        position: 2,
        fetchedAt: new Date(),
      },
      {
        id: `src_doubao_${Date.now()}_3`,
        platform: 'doubao',
        keyword,
        title: `2024年${keyword}行业分析报告`,
        url: 'https://example.com/report',
        snippet: `深度解析${keyword}行业发展趋势，包含市场数据、竞争格局和未来预测。`,
        domain: 'example.com',
        position: 3,
        fetchedAt: new Date(),
      },
    ];

    return mockSources.slice(0, maxResults);
  }
}
