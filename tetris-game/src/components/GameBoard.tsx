import { useEffect, useRef, useCallback } from 'react';
import { Tetromino, BOARD_WIDTH, BOARD_HEIGHT, CELL_SIZE, TETROMINO_COLORS } from '../types/game';

interface GameBoardProps {
  board: number[][];
  currentPiece: Tetromino | null;
  isGameOver: boolean;
}

export function GameBoard({ board, currentPiece, isGameOver }: GameBoardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 绘制单个格子
  const drawCell = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, color: string, ghost: boolean = false) => {
    const pixelX = x * CELL_SIZE;
    const pixelY = y * CELL_SIZE;

    if (ghost) {
      // 绘制幽灵方块（半透明）
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.strokeRect(pixelX + 2, pixelY + 2, CELL_SIZE - 4, CELL_SIZE - 4);
    } else {
      // 绘制实心方块
      ctx.fillStyle = color;
      ctx.fillRect(pixelX, pixelY, CELL_SIZE, CELL_SIZE);
      
      // 绘制高光效果
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fillRect(pixelX, pixelY, CELL_SIZE, 4);
      ctx.fillRect(pixelX, pixelY, 4, CELL_SIZE);
      
      // 绘制阴影效果
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.fillRect(pixelX + CELL_SIZE - 4, pixelY, 4, CELL_SIZE);
      ctx.fillRect(pixelX, pixelY + CELL_SIZE - 4, CELL_SIZE, 4);
    }
  }, []);

  // 绘制游戏板
  const drawBoard = useCallback((ctx: CanvasRenderingContext2D) => {
    // 清空画布
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, BOARD_WIDTH * CELL_SIZE, BOARD_HEIGHT * CELL_SIZE);

    // 绘制网格线
    ctx.strokeStyle = '#2a2a4e';
    ctx.lineWidth = 1;
    for (let i = 0; i <= BOARD_WIDTH; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, BOARD_HEIGHT * CELL_SIZE);
      ctx.stroke();
    }
    for (let i = 0; i <= BOARD_HEIGHT; i++) {
      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(BOARD_WIDTH * CELL_SIZE, i * CELL_SIZE);
      ctx.stroke();
    }

    // 绘制已固定的方块
    for (let row = 0; row < BOARD_HEIGHT; row++) {
      for (let col = 0; col < BOARD_WIDTH; col++) {
        if (board[row][col] !== 0) {
          // 根据方块类型获取颜色
          const typeKeys = Object.keys(TETROMINO_COLORS) as Array<keyof typeof TETROMINO_COLORS>;
          const color = typeKeys[board[row][col] - 1] 
            ? TETROMINO_COLORS[typeKeys[board[row][col] - 1]] 
            : '#888';
          drawCell(ctx, col, row, color);
        }
      }
    }
  }, [board, drawCell]);

  // 绘制当前方块
  const drawCurrentPiece = useCallback((ctx: CanvasRenderingContext2D) => {
    if (!currentPiece) return;

    // 绘制幽灵方块（预览落点）
    let ghostY = currentPiece.y;
    while (ghostY < BOARD_HEIGHT) {
      let collision = false;
      for (let row = 0; row < currentPiece.shape.length; row++) {
        for (let col = 0; col < currentPiece.shape[row].length; col++) {
          if (currentPiece.shape[row][col] !== 0) {
            const newY = ghostY + row + 1;
            const newX = currentPiece.x + col;
            if (newY >= BOARD_HEIGHT || (newY >= 0 && board[newY][newX] !== 0)) {
              collision = true;
              break;
            }
          }
        }
        if (collision) break;
      }
      if (collision) break;
      ghostY++;
    }

    // 绘制幽灵方块
    for (let row = 0; row < currentPiece.shape.length; row++) {
      for (let col = 0; col < currentPiece.shape[row].length; col++) {
        if (currentPiece.shape[row][col] !== 0) {
          const boardY = ghostY + row;
          const boardX = currentPiece.x + col;
          if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
            drawCell(ctx, boardX, boardY, currentPiece.color, true);
          }
        }
      }
    }

    // 绘制当前方块
    for (let row = 0; row < currentPiece.shape.length; row++) {
      for (let col = 0; col < currentPiece.shape[row].length; col++) {
        if (currentPiece.shape[row][col] !== 0) {
          const boardY = currentPiece.y + row;
          const boardX = currentPiece.x + col;
          if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
            drawCell(ctx, boardX, boardY, currentPiece.color);
          }
        }
      }
    }
  }, [currentPiece, board, drawCell]);

  // 渲染游戏画面
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    drawBoard(ctx);
    drawCurrentPiece(ctx);

    // 游戏结束时添加红色遮罩
    if (isGameOver) {
      ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
      ctx.fillRect(0, 0, BOARD_WIDTH * CELL_SIZE, BOARD_HEIGHT * CELL_SIZE);
    }
  }, [board, currentPiece, isGameOver, drawBoard, drawCurrentPiece]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={BOARD_WIDTH * CELL_SIZE}
        height={BOARD_HEIGHT * CELL_SIZE}
        className="border-4 border-white/20 rounded-lg shadow-2xl"
        style={{
          boxShadow: '0 0 20px rgba(255, 255, 255, 0.1), inset 0 0 20px rgba(0, 0, 0, 0.5)',
        }}
      />
      {isGameOver && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl font-bold text-red-500 mb-2 animate-pulse">游戏结束</div>
          </div>
        </div>
      )}
    </div>
  );
}
