// 关卡编辑器类型定义

import { TetrominoType } from './game';

// 自定义方块
export interface CustomTetromino {
  id: string;
  name: string;
  color: string;
  shapes: number[][][]; // 1-4种旋转状态
  weight: number; // 生成权重 1-10
}

// 速度曲线配置
export interface SpeedCurveConfig {
  type: 'linear' | 'exponential' | 'custom';
  baseInterval: number; // 初始下落间隔(ms)
  minInterval: number; // 最小下落间隔(ms)
  decrement: number; // 每级减少量
  keyframes?: { level: number; interval: number }[]; // 关键帧（自定义模式）
}

// 关卡参数
export interface LevelParams {
  boardWidth: number;
  boardHeight: number;
  startLevel: number;
  targetScore?: number; // 可选通关目标分数
  scoreMultipliers: Record<number, number>; // 消行得分倍率
}

// 完整关卡配置
export interface LevelConfig {
  id: string;
  name: string;
  description?: string;
  createdAt: number;
  modifiedAt: number;
  // 自定义方块库（为空则使用默认方块）
  customTetrominos: CustomTetromino[];
  // 速度曲线配置
  speedCurve: SpeedCurveConfig;
  // 关卡参数
  levelParams: LevelParams;
  // 是否启用自定义方块
  useCustomTetrominos: boolean;
}

// 编辑器状态
export interface EditorState {
  currentLevel: LevelConfig | null;
  isEditing: boolean;
  hasUnsavedChanges: boolean;
}

// 预设速度曲线
export const SPEED_CURVE_PRESETS: Record<string, SpeedCurveConfig> = {
  linear: {
    type: 'linear',
    baseInterval: 1000,
    minInterval: 100,
    decrement: 100,
  },
  exponential: {
    type: 'exponential',
    baseInterval: 1000,
    minInterval: 100,
    decrement: 50,
  },
  slow: {
    type: 'linear',
    baseInterval: 1500,
    minInterval: 200,
    decrement: 80,
  },
  fast: {
    type: 'linear',
    baseInterval: 800,
    minInterval: 50,
    decrement: 50,
  },
};

// 默认关卡配置
export const DEFAULT_LEVEL_CONFIG: LevelConfig = {
  id: '',
  name: 'New Level',
  description: '',
  createdAt: Date.now(),
  modifiedAt: Date.now(),
  customTetrominos: [],
  useCustomTetrominos: false,
  speedCurve: { ...SPEED_CURVE_PRESETS.linear },
  levelParams: {
    boardWidth: 10,
    boardHeight: 20,
    startLevel: 1,
    scoreMultipliers: {
      1: 1,
      2: 1,
      3: 1,
      4: 1,
    },
  },
};

// 默认方块颜色选项
export const COLOR_OPTIONS = [
  '#00f0f0', // 青色
  '#0000f0', // 蓝色
  '#f0a000', // 橙色
  '#f0f000', // 黄色
  '#00f000', // 绿色
  '#a000f0', // 紫色
  '#f00000', // 红色
  '#ff69b4', // 粉色
  '#00ced1', // 深青色
  '#ff8c00', // 深橙色
  '#9370db', // 中紫色
  '#32cd32', // 酸橙绿
];
