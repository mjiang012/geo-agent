import { create } from 'zustand';
import type { Brand, DiagnosisOverview, Keyword, AIAnalysis, Strategy } from '../types';

interface BrandState {
  currentBrand: Brand | null;
  brands: Brand[];
  diagnosisOverview: DiagnosisOverview | null;
  keywords: Keyword[];
  aiAnalysis: AIAnalysis[];
  strategies: Strategy[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setCurrentBrand: (brand: Brand | null) => void;
  setBrands: (brands: Brand[]) => void;
  setDiagnosisOverview: (overview: DiagnosisOverview | null) => void;
  setKeywords: (keywords: Keyword[]) => void;
  setAiAnalysis: (analysis: AIAnalysis[]) => void;
  setStrategies: (strategies: Strategy[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Async actions
  fetchBrands: () => Promise<void>;
  fetchDiagnosisOverview: (brandId: string) => Promise<void>;
  fetchKeywords: (brandId: string) => Promise<void>;
  fetchAiAnalysis: (brandId: string) => Promise<void>;
  fetchStrategies: (brandId: string) => Promise<void>;
}

// Mock data for development
const mockBrands: Brand[] = [
  {
    id: '1',
    userId: '1',
    name: '理想汽车',
    description: '中国新能源汽车品牌',
    industry: '汽车',
    logoUrl: 'https://via.placeholder.com/100',
    website: 'https://www.lixiang.com',
    competitors: ['特斯拉', '蔚来', '小鹏'],
    settings: {
      defaultPlatforms: ['doubao', 'yuanbao', 'deepseek'],
      alertThresholds: {
        sentimentDrop: 0.2,
        rankingDrop: 3,
        visibilityDrop: 0.15
      }
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    userId: '1',
    name: '比亚迪',
    description: '全球新能源汽车领导者',
    industry: '汽车',
    logoUrl: 'https://via.placeholder.com/100',
    website: 'https://www.byd.com',
    competitors: ['特斯拉', '理想', '蔚来'],
    settings: {
      defaultPlatforms: ['doubao', 'yuanbao', 'deepseek'],
      alertThresholds: {
        sentimentDrop: 0.2,
        rankingDrop: 3,
        visibilityDrop: 0.15
      }
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

const mockDiagnosisOverview: DiagnosisOverview = {
  brandId: '1',
  aiVisibilityRate: 68.5,
  recommendationRate: 45.2,
  avgRank: 3.2,
  sentimentHealth: 82.3,
  trendData: [
    { date: '2024-01-01', visibilityRate: 60, sentimentScore: 75, mentionCount: 120 },
    { date: '2024-01-02', visibilityRate: 62, sentimentScore: 76, mentionCount: 135 },
    { date: '2024-01-03', visibilityRate: 65, sentimentScore: 78, mentionCount: 142 },
    { date: '2024-01-04', visibilityRate: 64, sentimentScore: 77, mentionCount: 138 },
    { date: '2024-01-05', visibilityRate: 66, sentimentScore: 79, mentionCount: 145 },
    { date: '2024-01-06', visibilityRate: 67, sentimentScore: 80, mentionCount: 150 },
    { date: '2024-01-07', visibilityRate: 68.5, sentimentScore: 82.3, mentionCount: 158 }
  ]
};

const mockKeywords: Keyword[] = [
  {
    id: '1',
    brandId: '1',
    keyword: '理想汽车',
    type: 'seed',
    category: '品牌词',
    searchVolume: 50000,
    aiVisibilityScore: 85,
    conversionScore: 90,
    priorityScore: 88,
    isHighPriority: false,
    sources: [
      { platform: '微信指数', volume: 25000, trend: 'up' },
      { platform: '抖音热榜', volume: 15000, trend: 'stable' }
    ],
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    brandId: '1',
    keyword: '理想L9',
    type: 'seed',
    category: '产品词',
    searchVolume: 35000,
    aiVisibilityScore: 72,
    conversionScore: 85,
    priorityScore: 78,
    isHighPriority: false,
    sources: [
      { platform: '微信指数', volume: 18000, trend: 'up' },
      { platform: '抖音热榜', volume: 12000, trend: 'up' }
    ],
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    brandId: '1',
    keyword: '20万预算买哪款新能源SUV底盘最好？',
    type: 'intent',
    category: '对比类',
    searchVolume: 8000,
    aiVisibilityScore: 35,
    conversionScore: 95,
    priorityScore: 65,
    isHighPriority: true,
    sources: [
      { platform: '微信指数', volume: 4000, trend: 'up' }
    ],
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    brandId: '1',
    keyword: '新能源SUV续航焦虑怎么解决？',
    type: 'intent',
    category: '咨询类',
    searchVolume: 6000,
    aiVisibilityScore: 42,
    conversionScore: 88,
    priorityScore: 65,
    isHighPriority: true,
    sources: [
      { platform: '抖音热榜', volume: 3500, trend: 'up' }
    ],
    createdAt: '2024-01-01T00:00:00Z'
  }
];

const mockAiAnalysis: AIAnalysis[] = [
  {
    id: '1',
    brandId: '1',
    platform: '豆包',
    keyword: '理想汽车',
    sentimentScore: 0.82,
    coverageRate: 75,
    avgRank: 2.5,
    mentionCount: 45,
    citedSources: [
      { domain: 'zhihu.com', url: 'https://zhihu.com/xxx', title: '理想汽车评测', frequency: 12 },
      { domain: 'weibo.com', url: 'https://weibo.com/xxx', title: '理想汽车讨论', frequency: 8 }
    ],
    analysisDate: '2024-01-07T00:00:00Z'
  },
  {
    id: '2',
    brandId: '1',
    platform: '元宝',
    keyword: '理想汽车',
    sentimentScore: 0.78,
    coverageRate: 68,
    avgRank: 3.1,
    mentionCount: 38,
    citedSources: [
      { domain: 'toutiao.com', url: 'https://toutiao.com/xxx', title: '理想汽车新闻', frequency: 10 },
      { domain: 'sohu.com', url: 'https://sohu.com/xxx', title: '理想汽车报道', frequency: 6 }
    ],
    analysisDate: '2024-01-07T00:00:00Z'
  },
  {
    id: '3',
    brandId: '1',
    platform: 'DeepSeek',
    keyword: '理想汽车',
    sentimentScore: 0.85,
    coverageRate: 82,
    avgRank: 2.1,
    mentionCount: 52,
    citedSources: [
      { domain: 'zhihu.com', url: 'https://zhihu.com/xxx', title: '理想汽车深度分析', frequency: 15 },
      { domain: '36kr.com', url: 'https://36kr.com/xxx', title: '理想汽车商业分析', frequency: 9 }
    ],
    analysisDate: '2024-01-07T00:00:00Z'
  }
];

const mockStrategies: Strategy[] = [
  {
    id: '1',
    brandId: '1',
    name: 'Q1 GEO优化策略',
    description: '针对理想汽车Q1季度的GEO优化整体策略',
    platformAllocation: [
      { platform: '豆包', percentage: 35, reason: '用户活跃度高，汽车类内容需求大' },
      { platform: '元宝', percentage: 25, reason: '商务人群集中，转化率高' },
      { platform: 'DeepSeek', percentage: 25, reason: '深度内容偏好，适合技术解析' },
      { platform: '其他', percentage: 15, reason: '补充覆盖' }
    ],
    contentFocus: [
      { type: '产品对比', priority: 1, description: '重点突出理想L9/L8/L7与竞品对比优势' },
      { type: '技术解析', priority: 2, description: '增程式技术、智能驾驶等技术内容' },
      { type: '用户案例', priority: 3, description: '真实车主使用体验和口碑' }
    ],
    priorityKeywords: ['20万预算买哪款新能源SUV底盘最好？', '新能源SUV续航焦虑怎么解决？'],
    expectedRoi: 3.5,
    tasks: [
      {
        id: '1',
        title: '完善高优攻坚词内容',
        description: '针对2个高优攻坚词生成20篇优化内容',
        priority: 'high',
        status: 'in_progress',
        dueDate: '2024-01-15'
      },
      {
        id: '2',
        title: '豆包平台内容投放',
        description: '在豆包平台发布15篇优化文章',
        priority: 'high',
        status: 'pending',
        dueDate: '2024-01-20'
      }
    ],
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

export const useBrandStore = create<BrandState>((set, get) => ({
  currentBrand: null,
  brands: [],
  diagnosisOverview: null,
  keywords: [],
  aiAnalysis: [],
  strategies: [],
  isLoading: false,
  error: null,

  setCurrentBrand: (brand) => set({ currentBrand: brand }),
  setBrands: (brands) => set({ brands }),
  setDiagnosisOverview: (overview) => set({ diagnosisOverview: overview }),
  setKeywords: (keywords) => set({ keywords }),
  setAiAnalysis: (analysis) => set({ aiAnalysis: analysis }),
  setStrategies: (strategies) => set({ strategies }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  fetchBrands: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ brands: mockBrands, isLoading: false });
      if (!get().currentBrand && mockBrands.length > 0) {
        set({ currentBrand: mockBrands[0] });
      }
    } catch (error) {
      set({ error: 'Failed to fetch brands', isLoading: false });
    }
  },

  fetchDiagnosisOverview: async (brandId: string) => {
    set({ isLoading: true, error: null });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ diagnosisOverview: mockDiagnosisOverview, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch diagnosis overview', isLoading: false });
    }
  },

  fetchKeywords: async (brandId: string) => {
    set({ isLoading: true, error: null });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ keywords: mockKeywords, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch keywords', isLoading: false });
    }
  },

  fetchAiAnalysis: async (brandId: string) => {
    set({ isLoading: true, error: null });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ aiAnalysis: mockAiAnalysis, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch AI analysis', isLoading: false });
    }
  },

  fetchStrategies: async (brandId: string) => {
    set({ isLoading: true, error: null });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ strategies: mockStrategies, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch strategies', isLoading: false });
    }
  }
}));
