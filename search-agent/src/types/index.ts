// 配置类型
export interface CrawlConfig {
  concurrent: number;
  timeout: number;
  retryCount: number;
  userAgent: string;
  proxy?: string;
  delay: number;
}

export interface SourceConfig {
  enabled: boolean;
  baseUrl: string;
}

export interface OutputConfig {
  defaultPath: string;
  formats: ('json' | 'csv' | 'markdown')[];
}

export interface LoggingConfig {
  level: 'debug' | 'info' | 'warn' | 'error';
  file: string;
}

export interface Config {
  version: string;
  crawl: CrawlConfig;
  sources: {
    doubao: SourceConfig;
    qianwen: SourceConfig;
  };
  output: OutputConfig;
  logging: LoggingConfig;
}

// 搜索源数据类型
export interface SearchSource {
  id: string;
  platform: 'doubao' | 'qianwen';
  keyword: string;
  title: string;
  url: string;
  snippet: string;
  domain: string;
  position: number;
  fetchedAt: Date;
}

// 内容特征类型
export interface ContentFeatures {
  wordCount: number;
  paragraphCount: number;
  avgSentenceLength: number;
  headingCount: number;
  listCount: number;
  linkCount: number;
  imageCount: number;
}

// 关键词类型
export interface Keywords {
  primary: string[];
  secondary: string[];
  longTail: string[];
  density: Record<string, number>;
}

// 优化建议类型
export interface Suggestions {
  title: string[];
  structure: string[];
  content: string[];
  keywords: string[];
}

// GEO分析结果类型
export interface GEOAnalysis {
  id: string;
  sourceId: string;
  contentFeatures: ContentFeatures;
  keywords: Keywords;
  suggestions: Suggestions;
  score: number;
  analyzedAt: Date;
}

// 报告摘要类型
export interface ReportSummary {
  totalSources: number;
  avgScore: number;
  topKeywords: string[];
  commonPatterns: string[];
}

// 报告类型
export interface Report {
  id: string;
  keyword: string;
  sources: SearchSource[];
  analyses: GEOAnalysis[];
  summary: ReportSummary;
  generatedAt: Date;
}

// 抓取任务类型
export interface CrawlTask {
  id: string;
  keyword: string;
  platforms: string[];
  status: 'pending' | 'running' | 'completed' | 'failed';
  createdAt: Date;
  completedAt?: Date;
  error?: string;
}

// 错误码定义
export enum ErrorCode {
  CONFIG_NOT_FOUND = 'E001',
  CONFIG_INVALID = 'E002',
  NETWORK_ERROR = 'E003',
  CRAWL_RESTRICTED = 'E004',
  PARSE_ERROR = 'E005',
  STORAGE_ERROR = 'E006',
  INVALID_PARAMS = 'E007',
}

// Agent错误类型
export class AgentError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'AgentError';
  }
}
