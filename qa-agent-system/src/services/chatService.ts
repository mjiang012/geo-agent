import { 
  Message, 
  ChatSession, 
  ChatRequest, 
  ChatResponse, 
  IntentType, 
  IntentResult,
  UserSettings,
  StreamEvent,
  GeneratedImage
} from '@/types';
import { classifyIntent } from './intentRecognition';
import { generateImagesForMessage } from './imageGeneration';
import { v4 as uuidv4 } from 'uuid';

// 模拟知识库响应
const knowledgeBase: Record<IntentType, string[]> = {
  [IntentType.FOOD]: [
    `## {subject}的做法

### 所需食材
- 主料：根据具体菜品准备
- 辅料：葱、姜、蒜、料酒、生抽、老抽
- 调料：盐、糖、胡椒粉、香油

### 制作步骤
1. **准备工作**：食材清洗、切配
2. **腌制处理**：用料酒、生抽腌制15分钟
3. **热锅凉油**：锅烧热后倒入适量食用油
4. **爆炒香料**：放入葱姜蒜爆香
5. **主料入锅**：大火快炒，保持食材鲜嫩
6. **调味收汁**：加入调料，小火慢炖入味
7. **出锅装盘**：撒上葱花，即可享用

### 小贴士
- 火候控制是关键，大火快炒锁住营养
- 调味料可根据个人口味适当调整
- 新鲜食材是美味的保证`,

    `## {subject}食材介绍

### 食材特点
{subject}是一种营养丰富的食材，含有丰富的蛋白质、维生素和矿物质。

### 选购技巧
1. **看外观**：选择色泽鲜艳、无损伤的
2. **闻气味**：新鲜的食材有自然的香味
3. **摸质地**：手感紧实，有弹性

### 营养价值
- 蛋白质：XX克/100克
- 维生素：富含维生素A、C
- 矿物质：钙、铁、锌含量丰富

### 储存方法
- 冷藏保存：2-4°C可保存3-5天
- 冷冻保存：-18°C可保存1-2个月
- 注意事项：避免与气味重的食物混放`
  ],

  [IntentType.SCIENCE]: [
    `## {subject}科普

### 基本概念
{subject}是自然界中一种 fascinating 的存在，具有独特的生物学特征和生态价值。

### 主要特征
1. **形态特征**：外观描述、大小尺寸、颜色纹理
2. **生活习性**：栖息环境、活动规律、食性特点
3. **生长繁殖**：生命周期、繁殖方式、成长过程

### 科学价值
- 生态意义：在生态系统中的作用
- 研究价值：对科学研究的贡献
- 保护现状：濒危程度和保护措施

### 趣闻知识
> {subject}有许多有趣的特性，比如...（这里可以添加具体的趣味知识）`,

    `## {subject}原理解析

### 科学原理
{subject}背后的科学原理涉及多个学科领域的知识。

### 工作机制
1. **物理过程**：力学、光学、热学等方面的原理
2. **化学变化**：物质转化、能量交换
3. **生物机制**：生命活动的调节和控制

### 实际应用
- 工业应用：生产制造中的使用
- 日常生活：与我们生活的关联
- 前沿科技：最新的研究进展

### 深入思考
为什么{subject}会这样？这涉及到更深层次的科学规律...`
  ],

  [IntentType.TUTORIAL]: [
    `## {subject}使用教程

### 准备工作
在开始之前，请确保您已经准备好以下内容：
- 必要的工具和设备
- 相关软件和账号
- 基础知识和前置条件

### 操作步骤

#### 第一步：基础设置
1. 打开{subject}主界面
2. 进入设置菜单
3. 配置基础参数
4. 保存设置

#### 第二步：核心操作
1. 选择功能模块
2. 导入或创建内容
3. 进行编辑处理
4. 预览效果

#### 第三步：导出分享
1. 确认最终效果
2. 选择导出格式
3. 设置导出参数
4. 完成导出

### 常见问题
**Q: 遇到错误提示怎么办？**
A: 首先检查网络连接，然后查看是否为最新版本。

**Q: 如何提高效率？**
A: 掌握快捷键，建立模板，定期整理素材。`,

    `## {subject}技巧指南

### 基础技巧
掌握这些基础技巧，让您快速上手{subject}：

1. **快捷操作**
   - 使用快捷键提高效率
   - 自定义工作区布局
   - 批量处理功能

2. **优化设置**
   - 性能优化配置
   - 个性化界面调整
   - 自动保存设置

### 进阶技巧
- 高级功能挖掘
- 组合使用技巧
- 效率提升秘诀

### 实用案例
通过实际案例学习{subject}的最佳实践...`
  ],

  [IntentType.MEDICAL]: [
    `## {subject}医学科普

### 基本介绍
{subject}是人体重要的组成部分，承担着关键的生理功能。

### 结构与功能
1. **解剖结构**
   - 外部形态和位置
   - 内部组织结构
   - 血管神经分布

2. **生理功能**
   - 主要功能作用
   - 工作原理机制
   - 与其他器官的协调

### 常见相关问题
- 常见症状表现
- 可能的影响因素
- 日常保健建议

> **⚠️ 免责声明**：以上内容仅供科普参考，不构成医疗建议。如有健康问题，请及时就医咨询专业医生。`,

    `## {subject}健康知识

### 健康维护
保持{subject}健康的日常注意事项：

1. **合理饮食**
   - 营养均衡搭配
   - 适量补充所需营养素
   - 避免不良饮食习惯

2. **适度运动**
   - 选择合适的运动方式
   - 控制运动强度
   - 保持规律运动习惯

3. **定期检查**
   - 建议的检查频率
   - 需要关注的指标
   - 异常情况识别

### 预防措施
- 生活方式调整
- 风险因素控制
- 早期筛查重要性

> **⚠️ 免责声明**：以上内容仅供健康教育参考，不能替代专业医疗诊断和治疗建议。`
  ],

  [IntentType.COMPARISON]: [
    `## {subject}对比分析

### 基本信息对比

| 对比维度 | {entityA} | {entityB} |
|---------|-----------|-----------|
| 定义 | 概念A的定义 | 概念B的定义 |
| 特点 | 主要特点描述 | 主要特点描述 |
| 适用场景 | 适用情况A | 适用情况B |
| 优势 | 优势A | 优势B |
| 劣势 | 劣势A | 劣势B |

### 详细对比

#### 核心差异
1. **本质区别**：两者最根本的不同在于...
2. **功能差异**：在使用功能上，{entityA}更注重...，而{entityB}更侧重...
3. **适用人群**：{entityA}适合...，{entityB}适合...

#### 选择建议
- 选择{entityA}的情况：...
- 选择{entityB}的情况：...
- 两者皆可的情况：...

### 总结
{entityA}和{entityB}各有优劣，关键是根据具体需求来选择。`,

    `## {subject}深度对比

### 多角度分析

#### 性能对比
- {entityA}：性能特点描述
- {entityB}：性能特点描述

#### 成本对比
- {entityA}：成本结构和性价比
- {entityB}：成本结构和性价比

#### 易用性对比
- {entityA}：上手难度和学习曲线
- {entityB}：上手难度和学习曲线

### 决策指南
根据您的具体需求，可以参考以下决策流程：

1. 明确核心需求
2. 评估预算范围
3. 考虑使用场景
4. 权衡利弊得失
5. 做出最终选择

### 推荐方案
- 预算充足且追求...：推荐选择{entityA}
- 注重性价比和...：推荐选择{entityB}`
  ],

  [IntentType.UNKNOWN]: [
    `## 关于{subject}

感谢您的提问！关于{subject}，我可以为您提供以下信息：

### 概述
{subject}是一个值得探讨的话题，涉及多个方面的知识。

### 主要内容
1. 基本概念和背景
2. 相关知识和原理
3. 实际应用和价值
4. 发展趋势和前景

如果您能提供更具体的问题或指定感兴趣的方面，我可以为您提供更有针对性的回答。`
  ]
};

// 模拟生成响应内容
function generateMockResponse(
  query: string,
  intent: IntentResult
): string {
  const templates = knowledgeBase[intent.type] || knowledgeBase[IntentType.UNKNOWN];
  const template = templates[Math.floor(Math.random() * templates.length)];
  
  // 提取主题
  let subject = query.slice(0, 15);
  if (intent.entities && intent.entities.length > 0) {
    subject = intent.entities[0];
  }
  
  // 替换模板变量
  let response = template.replace(/{subject}/g, subject);
  
  // 处理对比类的特殊变量
  if (intent.type === IntentType.COMPARISON && intent.entities && intent.entities.length >= 2) {
    response = response.replace(/{entityA}/g, intent.entities[0]);
    response = response.replace(/{entityB}/g, intent.entities[1]);
  } else if (intent.type === IntentType.COMPARISON) {
    // 从查询中提取对比实体
    const match = query.match(/(.+?)(?:和|与|跟|vs)(.+)/i);
    if (match) {
      response = response.replace(/{entityA}/g, match[1].trim());
      response = response.replace(/{entityB}/g, match[2].trim());
    } else {
      response = response.replace(/{entityA}/g, 'A');
      response = response.replace(/{entityB}/g, 'B');
    }
  }
  
  return response;
}

/**
 * 创建新会话
 */
export function createSession(title?: string): ChatSession {
  const now = new Date().toISOString();
  return {
    id: uuidv4(),
    title: title || '新对话',
    messageCount: 0,
    createdAt: now,
    updatedAt: now
  };
}

/**
 * 创建用户消息
 */
export function createUserMessage(sessionId: string, content: string): Message {
  return {
    id: uuidv4(),
    sessionId,
    role: 'user',
    content,
    createdAt: new Date().toISOString()
  };
}

/**
 * 创建AI消息
 */
export function createAssistantMessage(
  sessionId: string,
  content: string,
  intent?: IntentResult,
  images?: GeneratedImage[]
): Message {
  return {
    id: uuidv4(),
    sessionId,
    role: 'assistant',
    content,
    intent,
    images,
    createdAt: new Date().toISOString()
  };
}

/**
 * 处理聊天请求
 */
export async function processChatRequest(
  request: ChatRequest
): Promise<ChatResponse> {
  const { message, context = [], generateImage = true, settings } = request;
  
  // 1. 意图识别
  const intent = classifyIntent(message);
  
  // 2. 生成文本响应
  const content = generateMockResponse(message, intent);
  
  // 3. 生成配图（如果需要）
  let images: GeneratedImage[] | undefined;
  if (generateImage && settings?.enableImageGeneration !== false) {
    try {
      images = await generateImagesForMessage(
        content,
        intent.type,
        intent.entities,
        {
          maxImages: 2,
          style: settings?.defaultImageStyle,
          size: settings?.defaultImageSize
        }
      );
    } catch (error) {
      console.error('图片生成失败:', error);
      // 继续返回文本响应，图片生成失败不阻断流程
    }
  }
  
  return {
    messageId: uuidv4(),
    content,
    intent,
    images,
    isComplete: true
  };
}

/**
 * 流式处理聊天请求
 */
export async function* streamChatResponse(
  request: ChatRequest
): AsyncGenerator<StreamEvent, void, unknown> {
  const { message, settings } = request;
  
  // 1. 发送意图识别结果
  const intent = classifyIntent(message);
  yield {
    type: 'intent',
    data: intent
  };
  
  // 2. 模拟流式文本生成
  const content = generateMockResponse(message, intent);
  const chunks = content.split(/(?=[\n\s])/); // 按自然断点分割
  
  let accumulatedContent = '';
  for (const chunk of chunks) {
    accumulatedContent += chunk;
    yield {
      type: 'text',
      data: { chunk, accumulated: accumulatedContent }
    };
    // 模拟打字延迟
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  
  // 3. 生成图片
  if (settings?.enableImageGeneration !== false) {
    yield {
      type: 'image_start',
      data: { count: 1 }
    };
    
    try {
      const images = await generateImagesForMessage(
        content,
        intent.type,
        intent.entities,
        {
          maxImages: 2,
          style: settings?.defaultImageStyle,
          size: settings?.defaultImageSize
        }
      );
      
      for (const image of images) {
        yield {
          type: 'image_complete',
          data: image
        };
      }
    } catch (error) {
      console.error('图片生成失败:', error);
    }
  }
  
  // 4. 完成
  yield {
    type: 'done',
    data: {}
  };
}

/**
 * 获取会话历史
 */
export function getSessionMessages(sessionId: string): Message[] {
  // 实际应用中从数据库或缓存获取
  // 这里返回空数组作为示例
  return [];
}

/**
 * 保存消息
 */
export function saveMessage(message: Message): void {
  // 实际应用中保存到数据库
  console.log('保存消息:', message.id);
}

/**
 * 更新会话
 */
export function updateSession(session: ChatSession): void {
  // 实际应用中更新数据库
  console.log('更新会话:', session.id);
}

// 默认用户设置
export const defaultUserSettings: UserSettings = {
  defaultImageStyle: 'realistic' as const,
  defaultImageSize: '512x512',
  responseDetail: 'normal',
  language: 'zh',
  enableImageGeneration: true
};
