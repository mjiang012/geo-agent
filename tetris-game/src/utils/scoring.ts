import { SCORE_TABLE, INITIAL_DROP_INTERVAL } from '../types/game';

// 计算得分
export function calculateScore(linesCleared: number, level: number): number {
  const baseScore = SCORE_TABLE[linesCleared] || 0;
  return baseScore * level;
}

// 计算等级（每10行升一级）
export function calculateLevel(lines: number): number {
  return Math.floor(lines / 10) + 1;
}

// 获取下落间隔（毫秒）- 等级越高，下落越快
export function getDropInterval(level: number): number {
  // 等级1: 1000ms, 等级2: 900ms, ... 最低100ms
  return Math.max(100, INITIAL_DROP_INTERVAL - (level - 1) * 100);
}

// 计算软降得分（每格1分）
export function calculateSoftDropScore(cells: number): number {
  return cells;
}

// 计算硬降得分（每格2分）
export function calculateHardDropScore(cells: number): number {
  return cells * 2;
}
