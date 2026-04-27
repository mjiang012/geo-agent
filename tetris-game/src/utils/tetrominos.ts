import { Tetromino, TetrominoType, TETROMINO_COLORS } from '../types/game';

// 7种经典俄罗斯方块的形状定义（4种旋转状态）
export const TETROMINO_SHAPES: Record<TetrominoType, number[][][]> = {
  // I方块 - 长条
  I: [
    [[0, 0, 0, 0],
     [1, 1, 1, 1],
     [0, 0, 0, 0],
     [0, 0, 0, 0]],
    [[0, 0, 1, 0],
     [0, 0, 1, 0],
     [0, 0, 1, 0],
     [0, 0, 1, 0]],
    [[0, 0, 0, 0],
     [0, 0, 0, 0],
     [1, 1, 1, 1],
     [0, 0, 0, 0]],
    [[0, 1, 0, 0],
     [0, 1, 0, 0],
     [0, 1, 0, 0],
     [0, 1, 0, 0]],
  ],
  // J方块
  J: [
    [[1, 0, 0],
     [1, 1, 1],
     [0, 0, 0]],
    [[0, 1, 1],
     [0, 1, 0],
     [0, 1, 0]],
    [[0, 0, 0],
     [1, 1, 1],
     [0, 0, 1]],
    [[0, 1, 0],
     [0, 1, 0],
     [1, 1, 0]],
  ],
  // L方块
  L: [
    [[0, 0, 1],
     [1, 1, 1],
     [0, 0, 0]],
    [[0, 1, 0],
     [0, 1, 0],
     [0, 1, 1]],
    [[0, 0, 0],
     [1, 1, 1],
     [1, 0, 0]],
    [[1, 1, 0],
     [0, 1, 0],
     [0, 1, 0]],
  ],
  // O方块 - 正方形
  O: [
    [[0, 1, 1, 0],
     [0, 1, 1, 0],
     [0, 0, 0, 0]],
    [[0, 1, 1, 0],
     [0, 1, 1, 0],
     [0, 0, 0, 0]],
    [[0, 1, 1, 0],
     [0, 1, 1, 0],
     [0, 0, 0, 0]],
    [[0, 1, 1, 0],
     [0, 1, 1, 0],
     [0, 0, 0, 0]],
  ],
  // S方块
  S: [
    [[0, 1, 1],
     [1, 1, 0],
     [0, 0, 0]],
    [[0, 1, 0],
     [0, 1, 1],
     [0, 0, 1]],
    [[0, 0, 0],
     [0, 1, 1],
     [1, 1, 0]],
    [[1, 0, 0],
     [1, 1, 0],
     [0, 1, 0]],
  ],
  // T方块
  T: [
    [[0, 1, 0],
     [1, 1, 1],
     [0, 0, 0]],
    [[0, 1, 0],
     [0, 1, 1],
     [0, 1, 0]],
    [[0, 0, 0],
     [1, 1, 1],
     [0, 1, 0]],
    [[0, 1, 0],
     [1, 1, 0],
     [0, 1, 0]],
  ],
  // Z方块
  Z: [
    [[1, 1, 0],
     [0, 1, 1],
     [0, 0, 0]],
    [[0, 0, 1],
     [0, 1, 1],
     [0, 1, 0]],
    [[0, 0, 0],
     [1, 1, 0],
     [0, 1, 1]],
    [[0, 1, 0],
     [1, 1, 0],
     [1, 0, 0]],
  ],
};

// 获取随机方块类型
export function getRandomTetrominoType(): TetrominoType {
  const types: TetrominoType[] = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
  return types[Math.floor(Math.random() * types.length)];
}

// 创建新方块
export function createTetromino(type: TetrominoType, x: number = 3, y: number = 0): Tetromino {
  return {
    type,
    shape: TETROMINO_SHAPES[type][0],
    color: TETROMINO_COLORS[type],
    x,
    y,
  };
}

// 顺时针旋转
export function rotateClockwise(shape: number[][]): number[][] {
  const N = shape.length;
  const M = shape[0].length;
  const rotated: number[][] = Array(M).fill(null).map(() => Array(N).fill(0));
  
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < M; j++) {
      rotated[j][N - 1 - i] = shape[i][j];
    }
  }
  return rotated;
}

// 逆时针旋转
export function rotateCounterClockwise(shape: number[][]): number[][] {
  const N = shape.length;
  const M = shape[0].length;
  const rotated: number[][] = Array(M).fill(null).map(() => Array(N).fill(0));
  
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < M; j++) {
      rotated[M - 1 - j][i] = shape[i][j];
    }
  }
  return rotated;
}

// 获取方块的旋转状态索引
export function getRotationIndex(type: TetrominoType, shape: number[][]): number {
  const shapes = TETROMINO_SHAPES[type];
  for (let i = 0; i < shapes.length; i++) {
    if (JSON.stringify(shapes[i]) === JSON.stringify(shape)) {
      return i;
    }
  }
  return 0;
}

// 获取下一个旋转状态
export function getNextRotation(type: TetrominoType, currentShape: number[][], clockwise: boolean = true): number[][] {
  const currentIndex = getRotationIndex(type, currentShape);
  const shapes = TETROMINO_SHAPES[type];
  
  if (clockwise) {
    return shapes[(currentIndex + 1) % shapes.length];
  } else {
    return shapes[(currentIndex - 1 + shapes.length) % shapes.length];
  }
}
