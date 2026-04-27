// GEO Agent 类型定义

// 用户相关
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'optimizer' | 'viewer';
  avatarUrl?: string;
  createdAt: string;
}

// 品牌相关
export interface Brand {
  id: string;
  userId: string;
  name: string;
  description?: string;
  industry?: string;
  logoUrl?: string;
  website?: string;
  competitors: string[];
  settings: BrandSettings;
  createdAt: string;
  updatedAt: string;
}

export interface BrandSettings {
  defaultPlatforms: string[];
  alertThresholds: AlertThresholds;
}

export interface AlertThresholds {
  sentimentDrop: number;
  rankingDrop: number;
  visibilityDrop: number;
}

// 热词相关
export interface Keyword {
  id: string;
  brandId: string;
  keyword: string;
  type: 'seed' | 'expanded' | 'intent';
  category?: string;
  searchVolume?: number;
  aiVisibilityScore?: number;
  conversionScore?: number;
  priorityScore?: number;
  isHighPriority: boolean;
  sources?: KeywordSource[];
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface KeywordSource {
  platform: string;
  volume: number;
  trend: 'up' | 'down' | 'stable';
}

export interface IntentQuestion {
  id: string;
  keywordId: string;
  question: string;
  category: string;
  scenario: string;
}

// AI分析相关
export interface AIAnalysis {
  id: string;
  brandId: string;
  platform: string;
  keyword: string;
  sentimentScore: number;
  coverageRate: number;
  avgRank: number;
  mentionCount: number;
  responseContent?: string;
  citedSources?: CitedSource[];
  analysisDate: string;
}

export interface CitedSource {
  domain: string;
  url: string;
  title: string;
  frequency: number;
}

export interface PlatformPreference {
  platform: string;
  topDomains: string[];
  contentFeatures: ContentFeature[];
  avgResponseLength: number;
}

export interface ContentFeature {
  feature: string;
  importance: number;
  description: string;
}

// 诊断相关
export interface DiagnosisOverview {
  brandId: string;
  aiVisibilityRate: number;
  recommendationRate: number;
  avgRank: number;
  sentimentHealth: number;
  trendData: TrendDataPoint[];
}

export interface TrendDataPoint {
  date: string;
  visibilityRate: number;
  sentimentScore: number;
  mentionCount: number;
}

export interface SentimentAnalysis {
  positive: number;
  neutral: number;
  negative: number;
  trend: 'improving' | 'stable' | 'declining';
  topPositiveKeywords: string[];
  topNegativeKeywords: string[];
}

export interface CoverageAnalysis {
  overallCoverage: number;
  platformCoverage: PlatformCoverage[];
  gapAreas: string[];
}

export interface PlatformCoverage {
  platform: string;
  coverage: number;
  mentionCount: number;
}

// 策略相关
export interface Strategy {
  id: string;
  brandId: string;
  name: string;
  description: string;
  platformAllocation: PlatformAllocation[];
  contentFocus: ContentFocus[];
  priorityKeywords: string[];
  expectedRoi: number;
  tasks: StrategyTask[];
  status: 'active' | 'paused' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface PlatformAllocation {
  platform: string;
  percentage: number;
  reason: string;
}

export interface ContentFocus {
  type: string;
  priority: number;
  description: string;
}

export interface StrategyTask {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed';
  dueDate?: string;
}

// 内容相关
export interface Content {
  id: string;
  brandId: string;
  title: string;
  content: string;
  type: 'product' | 'comparison' | 'knowledge' | 'case';
  keywords: string[];
  geoScore?: number;
  readabilityScore?: number;
  status: 'draft' | 'published' | 'archived';
  metadata?: ContentMetadata;
  createdAt: string;
  updatedAt: string;
}

export interface ContentMetadata {
  wordCount: number;
  readingTime: number;
  outline?: Outline;
  references?: string[];
}

export interface Outline {
  sections: OutlineSection[];
}

export interface OutlineSection {
  title: string;
  subsections: string[];
}

export interface ContentTemplate {
  id: string;
  name: string;
  type: string;
  description: string;
  structure: string;
  example?: string;
}

// 分发相关
export interface Distribution {
  id: string;
  contentId: string;
  platform: string;
  platformAccountId?: string;
  externalUrl?: string;
  status: 'pending' | 'publishing' | 'published' | 'failed';
  publishTime?: string;
  errorMessage?: string;
  metrics?: DistributionMetrics;
  createdAt: string;
  updatedAt: string;
}

export interface DistributionMetrics {
  views: number;
  likes: number;
  shares: number;
  comments: number;
}

export interface Platform {
  id: string;
  name: string;
  icon: string;
  description: string;
  isConnected: boolean;
  accountInfo?: PlatformAccount;
}

export interface PlatformAccount {
  id: string;
  username: string;
  avatarUrl?: string;
  followers?: number;
}

// 监控相关
export interface MonitoringMetrics {
  brandId: string;
  date: string;
  visibilityRate: number;
  sentimentScore: number;
  avgRank: number;
  mentionCount: number;
  platformMetrics: PlatformMetric[];
}

export interface PlatformMetric {
  platform: string;
  visibilityRate: number;
  mentionCount: number;
  avgSentiment: number;
}

export interface Alert {
  id: string;
  brandId: string;
  type: 'sentiment_drop' | 'ranking_drop' | 'visibility_drop' | 'competitor_surge';
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  metricValue: number;
  threshold: number;
  isRead: boolean;
  createdAt: string;
}

export interface CompetitorMonitor {
  competitorName: string;
  visibilityRate: number;
  mentionCount: number;
  avgRank: number;
  trend: 'up' | 'down' | 'stable';
}

// 通用
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
