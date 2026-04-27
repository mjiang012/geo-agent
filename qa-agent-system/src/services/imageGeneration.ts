import { IntentType, ImageStyle, GeneratedImage, ImageGenerationRequest } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// 图片生成提示词模板
const promptTemplates: Record<IntentType, string[]> = {
  [IntentType.FOOD]: [
    '专业美食摄影，{subject}，俯拍角度，自然光线，高清细节，食欲感，木质桌面背景，暖色调',
    '美食摄影，{subject}，45度侧拍，蒸汽袅袅，新鲜食材搭配，餐厅级摆盘，柔和光线',
    '专业食物摄影，{subject}特写，微距镜头，质感细腻，色彩鲜艳，白色瓷盘，浅景深'
  ],
  [IntentType.SCIENCE]: [
    '科学插画风格，{subject}，标注关键部位，教育用途，清晰简洁，白色背景，矢量风格',
    '科学示意图，{subject}，剖面图展示内部结构，专业标注，蓝白配色，教学用图',
    '自然科学插画，{subject}，写实风格，细节丰富，百科全书式，中性背景'
  ],
  [IntentType.TUTORIAL]: [
    '步骤分解图，{subject}，编号标注，清晰直观，扁平化设计，浅色背景，操作指引风格',
    '教程示意图，{subject}，界面截图风格，高亮操作区域，箭头指示，简洁明了',
    '操作指南图，{subject}，前后对比展示，标注关键步骤，信息图风格，易读性强'
  ],
  [IntentType.MEDICAL]: [
    '医学插画，{subject}，解剖示意图，专业准确，标注结构名称，教育用途，蓝灰色调',
    '医学示意图，{subject}，剖面展示，病理变化标注，专业医学风格，清晰严谨',
    '人体解剖图，{subject}，3D渲染风格，结构清晰，医学教育用途，科学准确'
  ],
  [IntentType.COMPARISON]: [
    '并排对比图，{subject}，左右分栏，相同视角，标注差异点，信息图风格，清晰直观',
    '对比分析图，{subject}，特征对比展示，颜色区分，表格化呈现，专业设计',
    '差异展示图，{subject}，镜像对比布局，关键差异高亮，简洁现代风格'
  ],
  [IntentType.UNKNOWN]: [
    '高质量插图，{subject}，清晰美观，专业摄影风格，中性背景'
  ]
};

// 图片风格修饰词
const styleModifiers: Record<ImageStyle, string> = {
  [ImageStyle.REALISTIC]: '超写实，照片级真实感，8K高清，专业摄影',
  [ImageStyle.ILLUSTRATION]: '插画风格，手绘质感，艺术化处理，精美细腻',
  [ImageStyle.DIAGRAM]: '示意图风格，简洁明了，标注清晰，教育用途',
  [ImageStyle.PHOTO]: '真实摄影，自然光线，生活化场景，真实感'
};

// 尺寸映射
const sizeMap: Record<string, { width: number; height: number }> = {
  '256x256': { width: 256, height: 256 },
  '512x512': { width: 512, height: 512 },
  '1024x1024': { width: 1024, height: 1024 }
};

/**
 * 生成图片提示词
 */
export function generateImagePrompt(
  subject: string,
  intentType: IntentType,
  style: ImageStyle = ImageStyle.REALISTIC,
  subType?: string
): string {
  // 选择基础模板
  const templates = promptTemplates[intentType] || promptTemplates[IntentType.UNKNOWN];
  const baseTemplate = templates[Math.floor(Math.random() * templates.length)];
  
  // 替换主题
  let prompt = baseTemplate.replace('{subject}', subject);
  
  // 添加风格修饰
  const styleModifier = styleModifiers[style];
  prompt += `，${styleModifier}`;
  
  // 根据子类型添加特定修饰
  if (subType) {
    const subTypeModifiers: Record<string, string> = {
      'recipe': '成品展示，精美摆盘',
      'ingredient': '新鲜食材，自然状态',
      'cooking': '烹饪过程，动态感',
      'animal': '生物形态，自然栖息环境',
      'plant': '植物全貌，生长状态',
      'anatomy': '解剖视角，内部结构',
      'disease': '病理特征，医学标注',
      'software': '界面截图，UI设计',
      'feature': '特征对比，差异标注'
    };
    if (subTypeModifiers[subType]) {
      prompt += `，${subTypeModifiers[subType]}`;
    }
  }
  
  // 添加通用质量要求
  prompt += '，高分辨率，无水印，无文字，专业品质';
  
  return prompt;
}

/**
 * 生成多张图片提示词（用于不同角度展示）
 */
export function generateMultiplePrompts(
  subject: string,
  intentType: IntentType,
  count: number = 2,
  style: ImageStyle = ImageStyle.REALISTIC
): string[] {
  const templates = promptTemplates[intentType] || promptTemplates[IntentType.UNKNOWN];
  const prompts: string[] = [];
  
  for (let i = 0; i < Math.min(count, templates.length); i++) {
    let prompt = templates[i].replace('{subject}', subject);
    prompt += `，${styleModifiers[style]}`;
    
    // 添加不同角度描述
    const angles = ['主视图', '侧视图', '俯视图', '细节特写', '全景展示'];
    if (i > 0 && intentType !== IntentType.COMPARISON) {
      prompt += `，${angles[i % angles.length]}`;
    }
    
    prompt += '，高分辨率，无水印，无文字，专业品质';
    prompts.push(prompt);
  }
  
  return prompts;
}

/**
 * 调用AI图片生成API
 * 使用字节跳动的图片生成服务
 */
async function callImageGenerationAPI(
  prompt: string,
  size: '256x256' | '512x512' | '1024x1024' = '512x512'
): Promise<string> {
  // 使用字节跳动的图片生成服务
  // 构建URL编码的prompt
  const encodedPrompt = encodeURIComponent(prompt);
  
  // 根据尺寸选择比例
  let imageSize = 'square';
  if (size === '256x256') imageSize = 'square';
  else if (size === '512x512') imageSize = 'square_hd';
  else if (size === '1024x1024') imageSize = 'square_hd';
  
  // 返回生成的图片URL
  const imageUrl = `https://copilot-cn.bytedance.net/api/ide/v1/text_to_image?prompt=${encodedPrompt}&image_size=${imageSize}`;
  
  // 模拟API调用延迟
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return imageUrl;
}

/**
 * 生成单张图片
 */
export async function generateImage(
  request: ImageGenerationRequest
): Promise<GeneratedImage> {
  const { prompt, style = ImageStyle.REALISTIC, size = '512x512', intentType = IntentType.UNKNOWN } = request;
  
  // 生成最终提示词
  const finalPrompt = generateImagePrompt(prompt, intentType, style);
  
  // 调用API生成图片
  const imageUrl = await callImageGenerationAPI(finalPrompt, size);
  
  return {
    id: uuidv4(),
    url: imageUrl,
    prompt: finalPrompt,
    style,
    size,
    alt: prompt
  };
}

/**
 * 生成多张图片
 */
export async function generateMultipleImages(
  subject: string,
  intentType: IntentType,
  options: {
    count?: number;
    style?: ImageStyle;
    size?: '256x256' | '512x512' | '1024x1024';
    subType?: string;
  } = {}
): Promise<GeneratedImage[]> {
  const { count = 2, style = ImageStyle.REALISTIC, size = '512x512', subType } = options;
  
  // 生成多个提示词
  const prompts = generateMultiplePrompts(subject, intentType, count, style);
  
  // 并行生成图片
  const imagePromises = prompts.map(async (prompt, index) => {
    // 添加延迟避免并发问题
    await new Promise(resolve => setTimeout(resolve, index * 500));
    
    const imageUrl = await callImageGenerationAPI(prompt, size);
    
    return {
      id: uuidv4(),
      url: imageUrl,
      prompt,
      style,
      size,
      alt: `${subject} - 图${index + 1}`
    };
  });
  
  return Promise.all(imagePromises);
}

/**
 * 根据消息内容生成配图
 */
export async function generateImagesForMessage(
  content: string,
  intentType: IntentType,
  entities: string[] = [],
  options: {
    maxImages?: number;
    style?: ImageStyle;
    size?: '256x256' | '512x512' | '1024x1024';
  } = {}
): Promise<GeneratedImage[]> {
  const { maxImages = 2, style = ImageStyle.REALISTIC, size = '512x512' } = options;
  
  // 提取主题
  let subject = '';
  if (entities.length > 0) {
    subject = entities[0];
  } else {
    // 从内容中提取主题（简化处理）
    const lines = content.split('\n');
    const firstLine = lines[0];
    // 移除Markdown标记
    subject = firstLine.replace(/[#*`]/g, '').trim().slice(0, 20);
  }
  
  if (!subject) {
    subject = '相关主题';
  }
  
  // 根据意图类型决定生成图片数量
  let imageCount = 1;
  if (intentType === IntentType.FOOD) imageCount = Math.min(2, maxImages);
  else if (intentType === IntentType.COMPARISON) imageCount = Math.min(2, maxImages);
  else if (intentType === IntentType.TUTORIAL) imageCount = Math.min(2, maxImages);
  
  // 生成图片
  return generateMultipleImages(subject, intentType, {
    count: imageCount,
    style,
    size
  });
}

/**
 * 重新生成单张图片
 */
export async function regenerateImage(
  originalImage: GeneratedImage,
  variation: 'style' | 'angle' | 'lighting' = 'style'
): Promise<GeneratedImage> {
  let modifiedPrompt = originalImage.prompt;
  
  // 根据变化类型修改提示词
  switch (variation) {
    case 'style':
      modifiedPrompt = modifiedPrompt.replace('写实', '艺术化');
      modifiedPrompt += '，不同艺术风格';
      break;
    case 'angle':
      modifiedPrompt += '，不同拍摄角度';
      break;
    case 'lighting':
      modifiedPrompt += '，不同光线条件';
      break;
  }
  
  const imageUrl = await callImageGenerationAPI(modifiedPrompt, originalImage.size);
  
  return {
    id: uuidv4(),
    url: imageUrl,
    prompt: modifiedPrompt,
    style: originalImage.style,
    size: originalImage.size,
    alt: originalImage.alt
  };
}

/**
 * 预加载图片
 */
export function preloadImage(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = url;
  });
}

/**
 * 批量预加载图片
 */
export async function preloadImages(urls: string[]): Promise<void> {
  await Promise.all(urls.map(url => preloadImage(url).catch(() => {})));
}
