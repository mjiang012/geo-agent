// 方块类型
export type TetrominoType = 'I' | 'J' | 'L' | 'O' | 'S' | 'T' | 'Z';

// 方块形状定义
export interface Tetromino {
  type: TetrominoType;
  shape: number[][];
  color: string;
  x: number;
  y: number;
}

// 游戏状态
export interface GameState {
  board: number[][];           // 10x20游戏板，0为空，其他为方块类型
  currentPiece: Tetromino | null;
  nextPiece: TetrominoType;
  score: number;
  lines: number;
  level: number;
  isPlaying: boolean;
  isPaused: boolean;
  isGameOver: boolean;
  dropInterval: number;        // 下落间隔（毫秒）
}

// 键盘控制
export enum GameAction {
  MOVE_LEFT = 'MOVE_LEFT',
  MOVE_RIGHT = 'MOVE_RIGHT',
  MOVE_DOWN = 'MOVE_DOWN',
  ROTATE = 'ROTATE',
  HARD_DROP = 'HARD_DROP',
  PAUSE = 'PAUSE',
  START = 'START',
  RESET = 'RESET'
}

// 游戏配置常量
export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;
export const CELL_SIZE = 30;
export const PREVIEW_SIZE = 4;

// 计分表
export const SCORE_TABLE: Record<number, number> = {
  1: 100,   // 单行
  2: 300,   // 双行
  3: 500,   // 三行
  4: 800,   // 四行（Tetris）
};

// 方块颜色
export const TETROMINO_COLORS: Record<TetrominoType, string> = {
  I: '#00f0f0',  // 青色
  J: '#0000f0',  // 蓝色
  L: '#f0a000',  // 橙色
  O: '#f0f000',  // 黄色
  S: '#00f000',  // 绿色
  T: '#a000f0',  // 紫色
  Z: '#f00000',  // 红色
};

// 初始下落间隔（毫秒）
export const INITIAL_DROP_INTERVAL = 1000;
