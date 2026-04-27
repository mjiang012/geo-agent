import { BOARD_WIDTH, BOARD_HEIGHT } from '../types/game';

// 碰撞检测
export function checkCollision(
  shape: number[][], 
  x: number, 
  y: number, 
  board: number[][]
): boolean {
  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col] !== 0) {
        const newX = x + col;
        const newY = y + row;
        
        // 边界检测
        if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
          return true;
        }
        
        // 方块堆叠检测（注意newY可能为负数，此时在顶部上方）
        if (newY >= 0 && board[newY][newX] !== 0) {
          return true;
        }
      }
    }
  }
  return false;
}

// 踢墙检测（Wall Kick）
export function tryWallKick(
  shape: number[][], 
  x: number, 
  y: number, 
  board: number[][]
): { x: number; y: number } | null {
  const kicks = [
    { x: 0, y: 0 },   // 原始位置
    { x: -1, y: 0 },  // 左移1格
    { x: 1, y: 0 },   // 右移1格
    { x: 0, y: -1 },  // 上移1格
    { x: -2, y: 0 },  // 左移2格（I方块）
    { x: 2, y: 0 },   // 右移2格（I方块）
  ];
  
  for (const kick of kicks) {
    const newX = x + kick.x;
    const newY = y + kick.y;
    if (!checkCollision(shape, newX, newY, board)) {
      return kick;
    }
  }
  return null;
}
