# GEO Agent 技术架构文档

## 1. 系统架构概述

### 1.1 架构图

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              前端层 (React + TypeScript)                      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐            │
│  │ 诊断中心  │ │AI偏好分析│ │ 优化策略 │ │ 内容生产 │ │ 效果监控 │            │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘            │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           API网关层 (Express.js)                             │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │  认证中间件  │ │  路由分发   │ │  限流控制   │ │  日志记录   │           │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘           │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           服务层 (Service Layer)                             │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐       │
│  │  热词服务    │ │  诊断服务    │ │  内容服务    │ │  分发服务    │       │
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘       │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐       │
│  │  AI分析服务  │ │  策略服务    │ │  监控服务    │ │  用户服务    │       │
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘       │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           数据层 (Data Layer)                                │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐       │
│  │  PostgreSQL  │ │    Redis     │ │ Elasticsearch│ │   对象存储   │       │
│  │  (主数据库)  │ │   (缓存)     │ │  (搜索引擎)  │ │  (文件存储)  │       │
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘       │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           外部服务集成 (External Services)                    │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐            │
│  │ OpenAI   │ │ Claude   │ │ 文心一言 │ │ 通义千问 │ │ 豆包API  │            │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘            │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐            │
│  │ 微信指数 │ │ 抖音热榜 │ │ 搜索引擎 │ │ 分发平台 │ │ 爬虫服务 │            │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘            │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 技术栈选型

| 层级 | 技术选型 | 选型理由 |
|------|----------|----------|
| 前端框架 | React 18 + TypeScript | 组件化开发，类型安全，生态丰富 |
| 状态管理 | Zustand | 轻量级，TypeScript友好，易于使用 |
| UI组件库 | Ant Design + Tailwind CSS | 企业级组件库 + 原子化CSS |
| 图表库 | Recharts + ECharts | 数据可视化需求丰富 |
| 后端框架 | Express.js + TypeScript | 轻量灵活，中间件丰富 |
| 数据库 | PostgreSQL | 关系型数据，支持复杂查询 |
| 缓存 | Redis | 高性能缓存，支持发布订阅 |
| 搜索引擎 | Elasticsearch | 全文检索，日志分析 |
| 消息队列 | Redis/Bull | 异步任务处理 |
| AI服务 | 多模型API集成 | 支持多种大模型能力 |

---

## 2. 数据模型设计

### 2.1 核心实体关系图

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│    User     │───────│   Brand     │───────│  Keyword    │
│   (用户)    │  1:N  │   (品牌)    │  1:N  │   (热词)    │
└─────────────┘       └─────────────┘       └─────────────┘
                              │
                              │ 1:N
                              ▼
                       ┌─────────────┐
                       │  Content    │
                       │  (内容)     │
                       └─────────────┘
                              │
                              │ 1:N
                              ▼
                       ┌─────────────┐
                       │Distribution │
                       │  (分发记录) │
                       └─────────────┘
```

### 2.2 数据库表结构

#### users 表
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(50) DEFAULT 'optimizer', -- admin, optimizer, viewer
    avatar_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### brands 表
```sql
CREATE TABLE brands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    industry VARCHAR(100),
    logo_url VARCHAR(500),
    website VARCHAR(500),
    competitors JSONB, -- 竞品列表
    settings JSONB, -- 品牌配置
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### keywords 表
```sql
CREATE TABLE keywords (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID REFERENCES brands(id),
    keyword VARCHAR(500) NOT NULL,
    type VARCHAR(50), -- seed, expanded, intent
    category VARCHAR(100),
    search_volume INTEGER,
    ai_visibility_score DECIMAL(5,2),
    conversion_score DECIMAL(5,2),
    priority_score DECIMAL(5,2),
    is_high_priority BOOLEAN DEFAULT FALSE,
    sources JSONB, -- 数据来源
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### ai_analysis 表
```sql
CREATE TABLE ai_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID REFERENCES brands(id),
    platform VARCHAR(100) NOT NULL, -- doubao, yuanbao, deepseek, etc.
    keyword VARCHAR(500),
    sentiment_score DECIMAL(5,2),
    coverage_rate DECIMAL(5,2),
    avg_rank INTEGER,
    mention_count INTEGER,
    response_content TEXT,
    cited_sources JSONB,
    analysis_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### contents 表
```sql
CREATE TABLE contents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID REFERENCES brands(id),
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    type VARCHAR(100), -- product, comparison, knowledge, case
    keywords JSONB,
    geo_score DECIMAL(5,2),
    readability_score DECIMAL(5,2),
    status VARCHAR(50) DEFAULT 'draft', -- draft, published, archived
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### distributions 表
```sql
CREATE TABLE distributions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID REFERENCES contents(id),
    platform VARCHAR(100) NOT NULL,
    platform_account_id VARCHAR(200),
    external_url VARCHAR(1000),
    status VARCHAR(50) DEFAULT 'pending', -- pending, publishing, published, failed
    publish_time TIMESTAMP,
    error_message TEXT,
    metrics JSONB, -- 阅读量、点赞数等
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### monitoring_metrics 表
```sql
CREATE TABLE monitoring_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID REFERENCES brands(id),
    metric_type VARCHAR(100) NOT NULL, -- visibility, sentiment, ranking
    platform VARCHAR(100),
    value DECIMAL(10,4),
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### strategies 表
```sql
CREATE TABLE strategies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID REFERENCES brands(id),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    platform_allocation JSONB, -- 平台投放比重
    content_focus JSONB, -- 内容侧重点
    priority_keywords JSONB, -- 高优攻坚词
    expected_roi DECIMAL(10,2),
    tasks JSONB, -- 任务清单
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 3. API接口设计

### 3.1 接口规范

- 基础路径: `/api/v1`
- 认证方式: JWT Token
- 响应格式: JSON
- 分页参数: `page`, `pageSize`

### 3.2 核心接口列表

#### 认证模块
```
POST   /auth/login              # 登录
POST   /auth/register           # 注册
POST   /auth/refresh            # 刷新Token
POST   /auth/logout             # 登出
```

#### 品牌管理
```
GET    /brands                  # 获取品牌列表
POST   /brands                  # 创建品牌
GET    /brands/:id              # 获取品牌详情
PUT    /brands/:id              # 更新品牌
DELETE /brands/:id              # 删除品牌
```

#### 热词管理
```
GET    /brands/:id/keywords              # 获取热词列表
POST   /brands/:id/keywords/seed         # 输入种子词
POST   /brands/:id/keywords/expand       # 数据扩充任务
GET    /brands/:id/keywords/expand/:taskId/status  # 查询扩充进度
POST   /brands/:id/keywords/generalize   # 意图泛化
POST   /brands/:id/keywords/score        # 价值打分
GET    /brands/:id/keywords/export       # 导出词表
```

#### 诊断分析
```
GET    /brands/:id/diagnosis/overview    # 诊断概览
GET    /brands/:id/diagnosis/sentiment   # 情感分析
GET    /brands/:id/diagnosis/coverage    # 覆盖率分析
GET    /brands/:id/diagnosis/ranking     # 排名分析
GET    /brands/:id/diagnosis/dashboard   # 效果看板数据
```

#### AI偏好分析
```
GET    /brands/:id/ai-analysis/platforms         # 平台列表
GET    /brands/:id/ai-analysis/:platform         # 平台分析详情
GET    /brands/:id/ai-analysis/sources           # 内容源偏好
GET    /brands/:id/ai-analysis/content-features  # 内容特征分析
POST   /brands/:id/ai-analysis/run               # 执行分析任务
```

#### 优化策略
```
GET    /brands/:id/strategies          # 策略列表
POST   /brands/:id/strategies/generate # 生成策略
GET    /brands/:id/strategies/:id      # 策略详情
PUT    /brands/:id/strategies/:id      # 更新策略
POST   /brands/:id/strategies/:id/execute  # 执行策略
```

#### 内容生产
```
GET    /contents                       # 内容列表
POST   /contents                       # 创建内容
GET    /contents/:id                   # 内容详情
PUT    /contents/:id                   # 更新内容
DELETE /contents/:id                   # 删除内容
POST   /contents/generate-outline      # AI生成大纲
POST   /contents/generate-batch        # 批量生成
POST   /contents/:id/optimize          # 优化内容
GET    /contents/templates             # 模板列表
```

#### 分发网络
```
GET    /platforms                      # 平台列表
GET    /platforms/accounts             # 账号列表
POST   /platforms/accounts/bind        # 绑定账号
DELETE /platforms/accounts/:id         # 解绑账号
POST   /distributions                  # 创建分发任务
GET    /distributions                  # 分发记录
GET    /distributions/:id              # 分发详情
POST   /distributions/:id/retry        # 重试失败任务
```

#### 效果监控
```
GET    /brands/:id/monitoring/overview     # 监控概览
GET    /brands/:id/monitoring/trends       # 趋势数据
GET    /brands/:id/monitoring/alerts       # 预警列表
POST   /brands/:id/monitoring/alerts/settings  # 设置预警
GET    /brands/:id/monitoring/competitors  # 竞品监控
GET    /brands/:id/monitoring/reports      # 生成报告
```

---

## 4. 核心服务设计

### 4.1 热词服务 (KeywordService)

```typescript
interface KeywordService {
  // 种子词管理
  createSeedKeywords(brandId: string, keywords: string[]): Promise<Keyword[]>;
  
  // 数据扩充
  expandKeywords(taskId: string): Promise<void>;
  getExpansionStatus(taskId: string): Promise<ExpansionStatus>;
  
  // 意图泛化
  generalizeIntents(keywords: string[]): Promise<IntentQuestion[]>;
  
  // 价值打分
  calculatePriorityScore(keyword: Keyword): Promise<number>;
  batchScoreKeywords(keywords: Keyword[]): Promise<Keyword[]>;
}
```

### 4.2 诊断服务 (DiagnosisService)

```typescript
interface DiagnosisService {
  // 情感分析
  analyzeSentiment(brandId: string, platform?: string): Promise<SentimentResult>;
  
  // 覆盖率分析
  analyzeCoverage(brandId: string): Promise<CoverageResult>;
  
  // 排名分析
  analyzeRanking(brandId: string): Promise<RankingResult>;
  
  // 生成诊断报告
  generateReport(brandId: string): Promise<DiagnosisReport>;
}
```

### 4.3 AI分析服务 (AIAnalysisService)

```typescript
interface AIAnalysisService {
  // 查询AI平台
  queryAIPlatform(platform: string, keyword: string): Promise<AIResponse>;
  
  // 解析回复
  parseResponse(response: AIResponse): Promise<ParsedAnalysis>;
  
  // 分析内容源
  analyzeContentSources(platform: string): Promise<SourceAnalysis>;
  
  // 批量分析
  batchAnalyze(brandId: string, keywords: string[]): Promise<AnalysisResult[]>;
}
```

### 4.4 内容服务 (ContentService)

```typescript
interface ContentService {
  // 生成大纲
  generateOutline(keyword: string, type: ContentType): Promise<Outline>;
  
  // 生成内容
  generateContent(outline: Outline, options: GenerateOptions): Promise<Content>;
  
  // 批量生成
  batchGenerate(keywords: string[], template: Template): Promise<Content[]>;
  
  // 质量检测
  checkQuality(content: Content): Promise<QualityReport>;
  
  // 优化内容
  optimizeContent(contentId: string): Promise<Content>;
}
```

### 4.5 分发服务 (DistributionService)

```typescript
interface DistributionService {
  // 发布内容
  publish(contentId: string, platforms: string[]): Promise<Distribution[]>;
  
  // 查询发布状态
  getStatus(distributionId: string): Promise<DistributionStatus>;
  
  // 回收链接
  collectLinks(distributionId: string): Promise<string[]>;
  
  // 重试失败任务
  retryFailed(distributionId: string): Promise<void>;
}
```

### 4.6 监控服务 (MonitoringService)

```typescript
interface MonitoringService {
  // 收集指标
  collectMetrics(brandId: string): Promise<Metrics>;
  
  // 趋势分析
  analyzeTrends(brandId: string, period: DateRange): Promise<TrendData>;
  
  // 检查预警
  checkAlerts(brandId: string): Promise<Alert[]>;
  
  // 竞品监控
  monitorCompetitors(brandId: string): Promise<CompetitorData>;
  
  // 生成报告
  generateReport(brandId: string, period: DateRange): Promise<Report>;
}
```

---

## 5. 异步任务设计

### 5.1 任务队列

使用 Bull + Redis 实现任务队列：

```typescript
// 任务类型
enum TaskType {
  KEYWORD_EXPANSION = 'keyword_expansion',
  AI_ANALYSIS = 'ai_analysis',
  CONTENT_GENERATION = 'content_generation',
  BATCH_PUBLISH = 'batch_publish',
  METRICS_COLLECTION = 'metrics_collection',
}

// 任务优先级
enum TaskPriority {
  HIGH = 1,
  NORMAL = 2,
  LOW = 3,
}
```

### 5.2 关键异步任务

| 任务 | 描述 | 优先级 | 超时时间 |
|------|------|--------|----------|
| 热词扩充 | 多源数据抓取和扩充 | Normal | 10分钟 |
| AI分析 | 查询各AI平台并解析 | High | 5分钟 |
| 内容生成 | AI批量生成文章 | Normal | 30分钟 |
| 批量发布 | 多平台内容分发 | Normal | 20分钟 |
| 指标采集 | 定时采集监控数据 | Low | 5分钟 |

---

## 6. 安全设计

### 6.1 认证与授权

- JWT Token认证，有效期2小时
- Refresh Token机制，有效期7天
- 角色权限控制（RBAC）
- 品牌数据隔离（多租户）

### 6.2 数据安全

- 敏感数据加密存储（AES-256）
- 数据库连接SSL
- API请求HTTPS
- 密码bcrypt加密

### 6.3 防护措施

- 接口限流（Rate Limiting）
- SQL注入防护（参数化查询）
- XSS防护（输入过滤）
- CSRF防护

---

## 7. 部署架构

### 7.1 容器化部署

```yaml
# docker-compose.yml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports:
      - "80:80"
  
  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://...
      - REDIS_URL=redis://...
  
  postgres:
    image: postgres:15
    volumes:
      - postgres_data:/var/lib/postgresql/data
  
  redis:
    image: redis:7-alpine
  
  elasticsearch:
    image: elasticsearch:8.8.0
```

### 7.2 环境配置

| 环境 | 配置 |
|------|------|
| 开发 | 本地Docker，单实例 |
| 测试 | 云服务器，双实例 |
| 生产 | K8s集群，多实例+负载均衡 |

---

## 8. 监控与日志

### 8.1 应用监控

- 接口响应时间监控
- 错误率监控
- 业务指标监控
- 资源使用监控

### 8.2 日志规范

```typescript
// 日志格式
interface LogEntry {
  timestamp: string;
  level: 'debug' | 'info' | 'warn' | 'error';
  service: string;
  traceId: string;
  userId?: string;
  brandId?: string;
  message: string;
  metadata?: Record<string, any>;
}
```

### 8.3 告警规则

- 错误率 > 5% 触发告警
- 接口响应时间 > 2s 触发告警
- 服务不可用触发告警
- 业务指标异常触发告警

---

## 9. 开发规范

### 9.1 代码规范

- ESLint + Prettier 统一代码风格
- TypeScript 严格模式
- 组件文件不超过300行
- 函数复杂度不超过10

### 9.2 Git规范

- 分支模型: Git Flow
- Commit规范: Conventional Commits
- PR必须经过Code Review
- 自动化测试通过才能合并

### 9.3 测试策略

- 单元测试覆盖率 > 80%
- 集成测试关键路径
- E2E测试核心流程
- 性能测试基准

---

## 10. 扩展性设计

### 10.1 新增AI平台

1. 在 `ai_platforms` 表添加平台配置
2. 实现 `AIPlatformAdapter` 接口
3. 注册到 `AIAnalysisService`

### 10.2 新增分发平台

1. 在 `platforms` 表添加平台配置
2. 实现 `DistributionAdapter` 接口
3. 注册到 `DistributionService`

### 10.3 新增内容模板

1. 在 `templates` 表添加模板
2. 定义模板变量和渲染逻辑
3. 在编辑器中注册模板
