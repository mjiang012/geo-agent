// Monitor Types
export interface MonitorQuery {
  keyword: string;
  sources?: string[];
  query_templates?: string[];
}

export interface MonitorResult {
  keyword: string;
  timestamp: string;
  sources: any[];
  total_references: number;
  sentiment_score: number;
  competitor_references: Record<string, number>;
}

// Analyze Types
export interface AnalyzeRequest {
  content: string;
  content_type?: string;
  analyze_features?: string[];
}

export interface ContentFeatures {
  word_count: number;
  paragraph_count: number;
  heading_count: number;
  list_count: number;
  link_count: number;
  avg_sentence_length: number;
  readability_score: number;
}

export interface KeywordAnalysis {
  primary_keywords: string[];
  secondary_keywords: string[];
  long_tail_keywords: string[];
  keyword_density: Record<string, number>;
}

export interface RAGInsights {
  rag_friendliness_score: number;
  potential_themes: string[];
  gap_analysis: string[];
  improvement_suggestions: string[];
}

export interface AnalyzeResponse {
  content_features: ContentFeatures;
  keyword_analysis: KeywordAnalysis;
  rag_insights: RAGInsights;
  eeat_score: number;
  analyzed_at: string;
}

// Optimize Types
export interface OptimizeRequest {
  content: string;
  target_keywords: string[];
  optimization_type?: string;
  content_templates?: string[];
}

export interface OptimizationSuggestion {
  type: string;
  original: string;
  suggested: string;
  confidence: number;
  reason: string;
}

export interface OptimizedContent {
  original_content: string;
  optimized_content: string;
  suggestions: OptimizationSuggestion[];
  rag_score_improvement: number;
  optimized_at: string;
}

// Generate Types
export interface GenerateRequest {
  topic: string;
  industry?: string;
  content_type?: string;
  target_length?: number;
  style?: string;
}

export interface GeneratedQuestion {
  question: string;
  intent: string;
  search_volume_estimate: number;
  competitor_coverage: number;
  priority_score: number;
}

export interface GeneratedQuestionsResponse {
  topic: string;
  questions: GeneratedQuestion[];
  generated_at: string;
}

export interface GeneratedContentResponse {
  topic: string;
  content: string;
  content_type: string;
  word_count: number;
  keywords: string[];
  rag_score: number;
  generated_at: string;
}
