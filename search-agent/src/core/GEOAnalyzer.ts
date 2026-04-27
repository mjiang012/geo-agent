import { Logger } from '../utils/logger.js';
import { 
  SearchSource, 
  GEOAnalysis, 
  ContentFeatures, 
  Keywords, 
  Suggestions,
  Report,
  ReportSummary 
} from '../types/index.js';
import { 
  generateId, 
  countWords, 
  calculateAvgSentenceLength, 
  extractKeywords,
  calculateKeywordDensity,
  splitSentences,
  groupBy,
  mergeUnique
} from '../utils/helpers.js';

export interface AnalyzeOptions {
  keyword: string;
  sources: SearchSource[];
}

export class GEOAnalyzer {
  private logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  /**
   * 分析搜索源并生成GEO报告
   */
  async analyze(options: AnalyzeOptions): Promise<Report> {
    const { keyword, sources } = options;
    
    this.logger.info(`Starting GEO analysis for "${keyword}" with ${sources.length} sources`);

    const analyses: GEOAnalysis[] = [];

    for (const source of sources) {
      try {
        const analysis = await this.analyzeSource(source);
        analyses.push(analysis);
      } catch (error) {
        this.logger.error(`Failed to analyze source ${source.id}:`, error);
      }
    }

    const summary = this.generateSummary(analyses, sources);

    const report: Report = {
      id: generateId('report_'),
      keyword,
      sources,
      analyses,
      summary,
      generatedAt: new Date(),
    };

    this.logger.info(`GEO analysis completed: ${analyses.length} analyses generated`);

    return report;
  }

  /**
   * 分析单个搜索源
   */
  private async analyzeSource(source: SearchSource): Promise<GEOAnalysis> {
    const content = `${source.title} ${source.snippet}`;
    
    const contentFeatures = this.extractContentFeatures(content);
    const keywords = this.extractKeywordsFromContent(content);
    const suggestions = this.generateSuggestions(contentFeatures, keywords, source);
    const score = this.calculateScore(contentFeatures, keywords);

    return {
      id: generateId('ana_'),
      sourceId: source.id,
      contentFeatures,
      keywords,
      suggestions,
      score,
      analyzedAt: new Date(),
    };
  }

  /**
   * 提取内容特征
   */
  private extractContentFeatures(content: string): ContentFeatures {
    const sentences = splitSentences(content);
    const paragraphs = content.split(/\n\n+/).filter(p => p.trim().length > 0);
    
    // 统计标题层级（基于标题标记）
    const headingMatches = content.match(/#{1,6}\s/g) || [];
    const headingCount = headingMatches.length;
    
    // 统计列表数量
    const listMatches = content.match(/(^|\n)[\s]*[-*+][\s]/g) || [];
    const listCount = listMatches.length;
    
    // 统计链接数量（简化统计）
    const linkMatches = content.match(/https?:\/\//g) || [];
    const linkCount = linkMatches.length;
    
    // 统计图片数量（简化统计）
    const imageMatches = content.match(/!\[.*?\]\(.*?\)/g) || [];
    const imageCount = imageMatches.length;

    return {
      wordCount: countWords(content),
      paragraphCount: paragraphs.length,
      avgSentenceLength: calculateAvgSentenceLength(content),
      headingCount,
      listCount,
      linkCount,
      imageCount,
    };
  }

  /**
   * 从内容中提取关键词
   */
  private extractKeywordsFromContent(content: string): Keywords {
    const allKeywords = extractKeywords(content, 20);
    
    // 分类关键词
    const primary: string[] = [];
    const secondary: string[] = [];
    const longTail: string[] = [];

    for (const keyword of allKeywords) {
      if (keyword.length >= 4 && keyword.length <= 8) {
        primary.push(keyword);
      } else if (keyword.length >= 2 && keyword.length < 4) {
        secondary.push(keyword);
      } else if (keyword.length > 8) {
        longTail.push(keyword);
      }
    }

    // 计算关键词密度
    const density = calculateKeywordDensity(content, allKeywords.slice(0, 10));

    return {
      primary: primary.slice(0, 5),
      secondary: secondary.slice(0, 8),
      longTail: longTail.slice(0, 5),
      density,
    };
  }

  /**
   * 生成优化建议
   */
  private generateSuggestions(
    features: ContentFeatures, 
    keywords: Keywords,
    source: SearchSource
  ): Suggestions {
    const title: string[] = [];
    const structure: string[] = [];
    const content: string[] = [];
    const keywordSuggestions: string[] = [];

    // 标题优化建议
    if (source.title.length < 20) {
      title.push('标题较短，建议增加核心关键词以提高相关性');
    }
    if (source.title.length > 60) {
      title.push('标题较长，建议精简以提升可读性');
    }
    if (!keywords.primary.some(kw => source.title.toLowerCase().includes(kw.toLowerCase()))) {
      title.push('标题中缺少核心关键词，建议添加');
    }

    // 结构优化建议
    if (features.headingCount < 2) {
      structure.push('缺少标题层级，建议增加H2/H3标题提升结构清晰度');
    }
    if (features.listCount < 1) {
      structure.push('缺少列表形式的内容，建议添加要点列表提升可读性');
    }
    if (features.paragraphCount > 10 && features.headingCount < 3) {
      structure.push('段落较多但标题层级不足，建议增加更多小标题');
    }

    // 内容优化建议
    if (features.wordCount < 300) {
      content.push('内容较短，建议扩充至500字以上以提升信息丰富度');
    }
    if (features.avgSentenceLength > 50) {
      content.push('句子较长，建议适当拆分以提升可读性');
    }
    if (features.linkCount < 1) {
      content.push('缺少外部链接，建议添加相关引用提升权威性');
    }

    // 关键词优化建议
    const avgDensity = Object.values(keywords.density).reduce((a, b) => a + b, 0) / Object.values(keywords.density).length || 0;
    if (avgDensity < 0.01) {
      keywordSuggestions.push('关键词密度较低，建议适当增加关键词出现频率');
    }
    if (avgDensity > 0.05) {
      keywordSuggestions.push('关键词密度过高，存在堆砌风险，建议自然分布');
    }
    if (keywords.longTail.length < 2) {
      keywordSuggestions.push('长尾关键词较少，建议挖掘更多长尾词覆盖');
    }

    return {
      title,
      structure,
      content,
      keywords: keywordSuggestions,
    };
  }

  /**
   * 计算GEO得分
   */
  private calculateScore(features: ContentFeatures, keywords: Keywords): number {
    let score = 50; // 基础分

    // 内容长度得分 (0-20)
    if (features.wordCount >= 800) score += 20;
    else if (features.wordCount >= 500) score += 15;
    else if (features.wordCount >= 300) score += 10;
    else if (features.wordCount >= 100) score += 5;

    // 结构得分 (0-15)
    if (features.headingCount >= 3) score += 5;
    if (features.listCount >= 2) score += 5;
    if (features.paragraphCount >= 3 && features.paragraphCount <= 15) score += 5;

    // 可读性得分 (0-10)
    if (features.avgSentenceLength >= 15 && features.avgSentenceLength <= 35) score += 10;
    else if (features.avgSentenceLength >= 10 && features.avgSentenceLength <= 50) score += 5;

    // 关键词得分 (0-15)
    if (keywords.primary.length >= 3) score += 5;
    if (keywords.secondary.length >= 5) score += 5;
    if (keywords.longTail.length >= 2) score += 5;

    // 丰富度得分 (0-10)
    if (features.linkCount >= 1) score += 5;
    if (features.imageCount >= 1) score += 5;

    return Math.min(100, Math.max(0, score));
  }

  /**
   * 生成报告摘要
   */
  private generateSummary(analyses: GEOAnalysis[], sources: SearchSource[]): ReportSummary {
    const totalSources = sources.length;
    
    // 计算平均得分
    const avgScore = analyses.length > 0
      ? analyses.reduce((sum, a) => sum + a.score, 0) / analyses.length
      : 0;

    // 统计热门关键词
    const allKeywords: string[] = [];
    analyses.forEach(a => {
      allKeywords.push(...a.keywords.primary, ...a.keywords.secondary);
    });
    
    const keywordCounts: Record<string, number> = {};
    allKeywords.forEach(kw => {
      keywordCounts[kw] = (keywordCounts[kw] || 0) + 1;
    });
    
    const topKeywords = Object.entries(keywordCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([kw]) => kw);

    // 识别常见模式
    const commonPatterns: string[] = [];
    
    const avgWordCount = analyses.length > 0
      ? analyses.reduce((sum, a) => sum + a.contentFeatures.wordCount, 0) / analyses.length
      : 0;
    
    if (avgWordCount > 500) {
      commonPatterns.push('长文内容');
    } else if (avgWordCount < 200) {
      commonPatterns.push('短文内容');
    }

    const avgHeadings = analyses.length > 0
      ? analyses.reduce((sum, a) => sum + a.contentFeatures.headingCount, 0) / analyses.length
      : 0;
    
    if (avgHeadings >= 3) {
      commonPatterns.push('结构化标题');
    }

    const sourcesWithLists = analyses.filter(a => a.contentFeatures.listCount > 0).length;
    if (sourcesWithLists / analyses.length > 0.5) {
      commonPatterns.push('列表形式');
    }

    return {
      totalSources,
      avgScore: Math.round(avgScore * 10) / 10,
      topKeywords,
      commonPatterns,
    };
  }

  /**
   * 批量分析（从文件加载）
   */
  async analyzeFromFile(filePath: string, keyword: string): Promise<Report> {
    const fs = await import('fs-extra');
    const data = await fs.readJson(filePath);
    const sources: SearchSource[] = data.sources || data;
    
    return this.analyze({ keyword, sources });
  }
}
