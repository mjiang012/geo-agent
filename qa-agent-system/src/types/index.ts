// 意图类型枚举
export enum IntentType {
  FOOD = 'food',
  SCIENCE = 'science',
  TUTORIAL = 'tutorial',
  MEDICAL = 'medical',
  COMPARISON = 'comparison',
  UNKNOWN = 'unknown'
}

// 意图识别结果
export interface IntentResult {
  type: IntentType;
  confidence: number;
  subType?: string;
  entities?: string[];
  reason?: string;
}

// 图片风格
export enum ImageStyle {
  REALISTIC = 'realistic',
  ILLUSTRATION = 'illustration',
  DIAGRAM = 'diagram',
  PHOTO = 'photo'
}

// 生成的图片
export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  style: ImageStyle;
  size: '256x256' | '512x512' | '1024x1024';
  alt?: string;
}

// 消息类型
export interface Message {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  intent?: IntentResult;
  images?: GeneratedImage[];
  createdAt: string;
  isStreaming?: boolean;
}

// 聊天会话
export interface ChatSession {
  id: string;
  userId?: string;
  title: string;
  intentType?: IntentType;
  messageCount: number;
  createdAt: string;
  updatedAt: string;
}

// 用户设置
export interface UserSettings {
  userId?: string;
  defaultImageStyle: ImageStyle;
  defaultImageSize: '256x256' | '512x512' | '1024x1024';
  responseDetail: 'concise' | 'normal' | 'detailed';
  language: 'zh' | 'en';
  enableImageGeneration: boolean;
}

// 领域配置
export interface DomainConfig {
  type: IntentType;
  name: string;
  nameEn: string;
  color: string;
  bgColor: string;
  icon: string;
  keywords: string[];
  description: string;
}

// 聊天请求
export interface ChatRequest {
  sessionId: string;
  message: string;
  context?: Message[];
  generateImage?: boolean;
  settings?: Partial<UserSettings>;
}

// 聊天响应
export interface ChatResponse {
  messageId: string;
  content: string;
  intent: IntentResult;
  images?: GeneratedImage[];
  isComplete: boolean;
}

// 流式响应事件
export type StreamEventType = 
  | 'intent'
  | 'text'
  | 'image_start'
  | 'image_complete'
  | 'error'
  | 'done';

export interface StreamEvent {
  type: StreamEventType;
  data: Record<string, unknown>;
}

// 图片生成请求
export interface ImageGenerationRequest {
  prompt: string;
  style?: ImageStyle;
  size?: '256x256' | '512x512' | '1024x1024';
  intentType?: IntentType;
}

// 示例问题
export interface ExampleQuestion {
  id: string;
  text: string;
  intentType: IntentType;
  icon: string;
}
