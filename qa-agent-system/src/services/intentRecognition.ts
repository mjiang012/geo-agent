import { IntentType, IntentResult, DomainConfig } from '@/types';

// 领域配置
export const domainConfigs: DomainConfig[] = [
  {
    type: IntentType.FOOD,
    name: '美食',
    nameEn: 'Food',
    color: '#F97316',
    bgColor: '#FFF7ED',
    icon: 'UtensilsCrossed',
    keywords: [
      '食谱', '做法', '食材', '烹饪', '美食', '菜谱', '怎么做', '如何做',
      '料理', '烘焙', '炒菜', '煮', '蒸', '烤', '炸', '炖', '红烧', '清蒸',
      '西餐', '中餐', '日料', '韩餐', '甜点', '面包', '蛋糕', '小吃',
      '餐厅', '美食推荐', '特色菜', '招牌菜', '家常菜', '下饭菜'
    ],
    description: '美食制作教程、食材介绍、烹饪技巧'
  },
  {
    type: IntentType.SCIENCE,
    name: '科普',
    nameEn: 'Science',
    color: '#10B981',
    bgColor: '#ECFDF5',
    icon: 'Microscope',
    keywords: [
      '是什么', '为什么', '原理', '怎么来的', '是什么东西',
      '动物', '植物', '生物', '鸟类', '昆虫', '鱼类', '哺乳动物',
      '地理', '地球', '山脉', '河流', '海洋', '气候', '天气',
      '物理', '化学', '数学', '天文', '宇宙', '星球', '黑洞',
      '人体', '身体', '器官', '细胞', '基因', 'DNA',
      '科学', '科普', '知识', '自然', '现象'
    ],
    description: '动植物、地理、物理、化学等科学知识'
  },
  {
    type: IntentType.TUTORIAL,
    name: '教程',
    nameEn: 'Tutorial',
    color: '#8B5CF6',
    bgColor: '#F5F3FF',
    icon: 'BookOpen',
    keywords: [
      '如何使用', '教程', '步骤', '操作', '设置', '配置',
      '软件', '应用', 'APP', '程序', '工具', '设备',
      '技巧', '方法', '攻略', '指南', '说明', '教学',
      '生活技巧', 'DIY', '手工', '制作', '修理', '维护',
      '化妆', '穿搭', '护肤', '健身', '运动', '学习'
    ],
    description: '软件操作、生活技巧、时尚教程'
  },
  {
    type: IntentType.MEDICAL,
    name: '医疗',
    nameEn: 'Medical',
    color: '#0EA5E9',
    bgColor: '#F0F9FF',
    icon: 'Heart',
    keywords: [
      '症状', '疾病', '病症', '病', '疼', '痛', '不舒服',
      '器官', '心脏', '肝脏', '肺部', '胃部', '肾脏', '大脑',
      '健康', '养生', '保健', '预防', '治疗', '药物',
      '医院', '医生', '检查', '诊断', '手术', '康复',
      '营养', '饮食健康', '运动健康', '心理健康'
    ],
    description: '人体结构、疾病知识、健康建议'
  },
  {
    type: IntentType.COMPARISON,
    name: '对比',
    nameEn: 'Comparison',
    color: '#F59E0B',
    bgColor: '#FFFBEB',
    icon: 'GitCompare',
    keywords: [
      '区别', '对比', 'vs', '比较', '哪个更好', '哪个好',
      '差异', '不同', '差别', '优劣', '好坏', '强弱',
      '和', '与', '跟', '还是', '或者', '相比',
      '有什么不一样', '有什么不同', '哪个更', '如何选择'
    ],
    description: '实体对比、差异分析、选择建议'
  }
];

// 子类型映射
const subTypeMap: Record<string, string[]> = {
  [IntentType.FOOD]: ['recipe', 'ingredient', 'cooking', 'restaurant', 'cuisine'],
  [IntentType.SCIENCE]: ['animal', 'plant', 'geography', 'physics', 'chemistry', 'astronomy', 'human'],
  [IntentType.TUTORIAL]: ['software', 'device', 'life', 'fashion', 'diy'],
  [IntentType.MEDICAL]: ['anatomy', 'disease', 'symptom', 'health', 'treatment'],
  [IntentType.COMPARISON]: ['feature', 'pros_cons', 'selection']
};

/**
 * 基于关键词匹配的意图识别
 */
function keywordBasedClassification(query: string): IntentResult {
  const lowerQuery = query.toLowerCase();
  const scores: Record<string, number> = {};
  const matchedKeywords: Record<string, string[]> = {};

  // 计算每个领域的匹配分数
  domainConfigs.forEach(config => {
    let score = 0;
    matchedKeywords[config.type] = [];

    config.keywords.forEach(keyword => {
      const lowerKeyword = keyword.toLowerCase();
      // 完全匹配得分更高
      if (lowerQuery.includes(lowerKeyword)) {
        if (lowerQuery === lowerKeyword || 
            lowerQuery.startsWith(lowerKeyword + ' ') ||
            lowerQuery.endsWith(' ' + lowerKeyword) ||
            lowerQuery.includes(' ' + lowerKeyword + ' ')) {
          score += 3;
        } else {
          score += 1;
        }
        matchedKeywords[config.type].push(keyword);
      }
    });

    scores[config.type] = score;
  });

  // 找出得分最高的领域
  let maxScore = 0;
  let bestIntent = IntentType.UNKNOWN;

  Object.entries(scores).forEach(([type, score]) => {
    if (score > maxScore) {
      maxScore = score;
      bestIntent = type as IntentType;
    }
  });

  // 计算置信度
  const confidence = Math.min(maxScore / 5, 0.95);

  // 识别子类型
  const subType = detectSubType(bestIntent, lowerQuery);

  // 提取实体
  const entities = extractEntities(lowerQuery, bestIntent);

  return {
    type: bestIntent,
    confidence,
    subType,
    entities,
    reason: `关键词匹配: ${matchedKeywords[bestIntent]?.slice(0, 3).join(', ')}`
  };
}

/**
 * 检测子类型
 */
function detectSubType(intentType: IntentType, query: string): string | undefined {
  const subTypes = subTypeMap[intentType];
  if (!subTypes) return undefined;

  // 根据关键词检测子类型
  const subTypeKeywords: Record<string, string[]> = {
    'recipe': ['做法', '食谱', '菜谱', '怎么做', '烹饪'],
    'ingredient': ['食材', '原料', '配料', '材料'],
    'cooking': ['炒', '煮', '蒸', '烤', '炸', '炖', '技巧'],
    'restaurant': ['餐厅', '饭店', '推荐', '哪里吃'],
    'cuisine': ['菜系', '西餐', '中餐', '日料', '韩餐'],
    'animal': ['动物', '鸟', '鱼', '昆虫', '兽'],
    'plant': ['植物', '花', '树', '草', '菌'],
    'geography': ['地理', '地球', '山', '河', '海', '气候'],
    'physics': ['物理', '力', '运动', '能量', '光', '电'],
    'chemistry': ['化学', '反应', '元素', '分子', '化合物'],
    'astronomy': ['天文', '宇宙', '星', '太阳', '月亮', '黑洞'],
    'human': ['人体', '器官', '细胞', '基因'],
    'software': ['软件', '应用', 'APP', '程序', '设置'],
    'device': ['设备', '仪器', '工具', '使用'],
    'life': ['生活', '技巧', '方法', 'DIY'],
    'fashion': ['化妆', '穿搭', '护肤', '时尚'],
    'diy': ['手工', '制作', 'DIY', '修理'],
    'anatomy': ['器官', '结构', '解剖', '人体'],
    'disease': ['病', '症', '炎', '癌', '感染'],
    'symptom': ['症状', '疼', '痛', '不舒服'],
    'health': ['健康', '养生', '保健', '预防'],
    'treatment': ['治疗', '药物', '手术', '康复'],
    'feature': ['区别', '不同', '特点', '功能'],
    'pros_cons': ['优劣', '好坏', '利弊', '优缺点'],
    'selection': ['选择', '选购', '推荐', '建议']
  };

  for (const subType of subTypes) {
    const keywords = subTypeKeywords[subType] || [];
    for (const keyword of keywords) {
      if (query.includes(keyword)) {
        return subType;
      }
    }
  }

  return undefined;
}

/**
 * 提取实体
 */
function extractEntities(query: string, intentType: IntentType): string[] {
  const entities: string[] = [];
  
  // 常见实体模式
  const patterns = [
    // 引号中的内容
    /[""]([^""]+)[""]/g,
    // 书名号中的内容
    /《([^》]+)》/g,
    // "XX的" 模式
    /([\u4e00-\u9fa5]{2,8})的/g,
    // 英文术语
    /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b/g
  ];

  patterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(query)) !== null) {
      const entity = match[1].trim();
      if (entity.length >= 2 && entity.length <= 20) {
        entities.push(entity);
      }
    }
  });

  // 根据意图类型提取特定实体
  if (intentType === IntentType.FOOD) {
    // 提取菜品名称（常见模式）
    const foodPatterns = [
      /([\u4e00-\u9fa5]{2,6})(?:做法|食谱|怎么)/,
      /(?:做|炒|煮|蒸|烤)([\u4e00-\u9fa5]{2,6})/,
      /([\u4e00-\u9fa5]{2,6})(?:好吃|美味|推荐)/
    ];
    foodPatterns.forEach(pattern => {
      const match = query.match(pattern);
      if (match && match[1]) {
        entities.push(match[1]);
      }
    });
  }

  // 去重
  return [...new Set(entities)].slice(0, 5);
}

/**
 * 基于规则的意图识别（处理特殊情况）
 */
function ruleBasedClassification(query: string): IntentResult | null {
  const lowerQuery = query.toLowerCase();

  // 对比类特殊规则
  const comparisonPatterns = [
    /(.+?)和(.+?)(?:有?什么)?区别/,
    /(.+?)与(.+?)(?:有?什么)?不同/,
    /(.+?)跟(.+?)(?:有?什么)?差别/,
    /(.+?)vs(.+)/i,
    /(.+?)和(.+?)哪个更好/,
    /(.+?)还是(.+?)(?:好|比较好)/,
    /(?:比较|对比)(.+?)和(.+)/,
    /(.+?)(?:和|与|跟)(.+?)(?:的)?(?:差异|差别|不同)/
  ];

  for (const pattern of comparisonPatterns) {
    const match = lowerQuery.match(pattern);
    if (match) {
      const entities = [match[1], match[2]]
        .filter(Boolean)
        .map(e => e.trim())
        .filter(e => e.length >= 1 && e.length <= 10);

      return {
        type: IntentType.COMPARISON,
        confidence: 0.95,
        subType: 'feature',
        entities,
        reason: '对比模式匹配'
      };
    }
  }

  // 医疗类特殊规则（需要谨慎）
  const medicalPatterns = [
    /(?:我|身体|感觉)(?:不舒服|难受|疼|痛)/,
    /(?:症状|病情|病症)(?:是|有)?什么/,
    /(?:得了|患了|有)(?:什么)?病/
  ];

  for (const pattern of medicalPatterns) {
    if (pattern.test(lowerQuery)) {
      return {
        type: IntentType.MEDICAL,
        confidence: 0.85,
        subType: 'symptom',
        reason: '医疗症状模式匹配'
      };
    }
  }

  return null;
}

/**
 * 融合多种方法的意图识别
 */
export function classifyIntent(query: string): IntentResult {
  // 1. 首先尝试规则匹配（处理明确的模式）
  const ruleResult = ruleBasedClassification(query);
  if (ruleResult && ruleResult.confidence > 0.9) {
    return ruleResult;
  }

  // 2. 关键词匹配
  const keywordResult = keywordBasedClassification(query);

  // 3. 如果规则匹配结果存在且置信度较高，融合结果
  if (ruleResult && ruleResult.confidence > 0.8) {
    // 如果两者识别为同一类型，提高置信度
    if (ruleResult.type === keywordResult.type) {
      return {
        ...ruleResult,
        confidence: Math.min(ruleResult.confidence + 0.05, 0.99),
        entities: keywordResult.entities || ruleResult.entities
      };
    }
    // 否则使用规则结果（通常更准确）
    return ruleResult;
  }

  // 4. 如果关键词匹配置信度太低，返回UNKNOWN
  if (keywordResult.confidence < 0.3) {
    return {
      type: IntentType.UNKNOWN,
      confidence: 1 - keywordResult.confidence,
      reason: '无法确定意图类型'
    };
  }

  return keywordResult;
}

/**
 * 批量分类（用于测试准确率）
 */
export function batchClassify(queries: string[]): IntentResult[] {
  return queries.map(query => classifyIntent(query));
}

/**
 * 获取领域配置
 */
export function getDomainConfig(intentType: IntentType): DomainConfig | undefined {
  return domainConfigs.find(config => config.type === intentType);
}

/**
 * 获取所有领域配置
 */
export function getAllDomainConfigs(): DomainConfig[] {
  return domainConfigs;
}

/**
 * 计算意图识别准确率（用于测试）
 */
export function calculateAccuracy(
  testCases: { query: string; expected: IntentType }[]
): { accuracy: number; total: number; correct: number; details: Array<{ query: string; expected: string; actual: string; correct: boolean }> } {
  let correct = 0;
  const details: Array<{ query: string; expected: string; actual: string; correct: boolean }> = [];

  testCases.forEach(({ query, expected }) => {
    const result = classifyIntent(query);
    const isCorrect = result.type === expected;
    if (isCorrect) correct++;
    
    details.push({
      query,
      expected,
      actual: result.type,
      correct: isCorrect
    });
  });

  return {
    accuracy: correct / testCases.length,
    total: testCases.length,
    correct,
    details
  };
}
