import { useEffect, useRef, useCallback } from 'react';
import { TetrominoType, PREVIEW_SIZE, TETROMINO_COLORS } from '../types/game';
import { TETROMINO_SHAPES } from '../utils/tetrominos';

interface PreviewPanelProps {
  nextPiece: TetrominoType;
}

const PREVIEW_CELL_SIZE = 25;

export function PreviewPanel({ nextPiece }: PreviewPanelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawPreview = useCallback((ctx: CanvasRenderingContext2D) => {
    // 清空画布
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, PREVIEW_SIZE * PREVIEW_CELL_SIZE, PREVIEW_SIZE * PREVIEW_CELL_SIZE);

    // 绘制边框
    ctx.strokeStyle = '#2a2a4e';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, PREVIEW_SIZE * PREVIEW_CELL_SIZE, PREVIEW_SIZE * PREVIEW_CELL_SIZE);

    // 获取下一个方块的形状
    const shape = TETROMINO_SHAPES[nextPiece][0];
    const color = TETROMINO_COLORS[nextPiece];

    // 计算居中偏移
    const offsetX = Math.floor((PREVIEW_SIZE - shape[0].length) / 2);
    const offsetY = Math.floor((PREVIEW_SIZE - shape.length) / 2);

    // 绘制方块
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col] !== 0) {
          const x = (offsetX + col) * PREVIEW_CELL_SIZE;
          const y = (offsetY + row) * PREVIEW_CELL_SIZE;

          // 绘制方块
          ctx.fillStyle = color;
          ctx.fillRect(x, y, PREVIEW_CELL_SIZE, PREVIEW_CELL_SIZE);

          // 绘制高光效果
          ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
          ctx.fillRect(x, y, PREVIEW_CELL_SIZE, 3);
          ctx.fillRect(x, y, 3, PREVIEW_CELL_SIZE);

          // 绘制阴影效果
          ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
          ctx.fillRect(x + PREVIEW_CELL_SIZE - 3, y, 3, PREVIEW_CELL_SIZE);
          ctx.fillRect(x, y + PREVIEW_CELL_SIZE - 3, PREVIEW_CELL_SIZE, 3);
        }
      }
    }
  }, [nextPiece]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    drawPreview(ctx);
  }, [drawPreview]);

  return (
    <div className="bg-black/50 rounded-lg p-4 border border-white/10">
      <h3 className="text-white/80 text-sm font-semibold mb-2 text-center">下一个</h3>
      <canvas
        ref={canvasRef}
        width={PREVIEW_SIZE * PREVIEW_CELL_SIZE}
        height={PREVIEW_SIZE * PREVIEW_CELL_SIZE}
        className="rounded"
      />
    </div>
  );
}
