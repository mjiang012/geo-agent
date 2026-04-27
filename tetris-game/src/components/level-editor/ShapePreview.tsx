import { useMemo } from 'react';
import { rotateClockwise } from '../../utils/tetrominos';

interface ShapePreviewProps {
  shape: number[][];
  color: string;
  size?: number;
  showRotations?: boolean;
}

const CELL_SIZE = 20;

export function ShapePreview({ 
  shape, 
  color, 
  size = 4,
  showRotations = false 
}: ShapePreviewProps) {
  // 计算所有旋转状态
  const rotations = useMemo(() => {
    if (!showRotations) return [shape];
    
    const rots = [shape];
    let current = shape;
    for (let i = 0; i < 3; i++) {
      current = rotateClockwise(current);
      rots.push(current);
    }
    return rots;
  }, [shape, showRotations]);

  const renderShape = (grid: number[][], index: number) => {
    // 找到形状的边界
    let minRow = grid.length, maxRow = -1;
    let minCol = grid[0].length, maxCol = -1;
    
    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid[r].length; c++) {
        if (grid[r][c]) {
          minRow = Math.min(minRow, r);
          maxRow = Math.max(maxRow, r);
          minCol = Math.min(minCol, c);
          maxCol = Math.max(maxCol, c);
        }
      }
    }
    
    // 如果没有方块，显示空
    if (maxRow === -1) {
      return (
        <div 
          key={index}
          className="w-16 h-16 bg-gray-800 rounded flex items-center justify-center"
        >
          <span className="text-gray-500 text-xs">Empty</span>
        </div>
      );
    }
    
    const shapeHeight = maxRow - minRow + 1;
    const shapeWidth = maxCol - minCol + 1;
    
    return (
      <div 
        key={index}
        className="bg-gray-800 rounded p-2"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${shapeWidth}, ${CELL_SIZE}px)`,
          gridTemplateRows: `repeat(${shapeHeight}, ${CELL_SIZE}px)`,
          gap: '2px'
        }}
      >
        {Array.from({ length: shapeHeight }, (_, r) =>
          Array.from({ length: shapeWidth }, (_, c) => {
            const hasCell = grid[minRow + r]?.[minCol + c] === 1;
            return (
              <div
                key={`${r}-${c}`}
                className="rounded-sm"
                style={{
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                  backgroundColor: hasCell ? color : 'transparent',
                  boxShadow: hasCell 
                    ? `inset 0 0 3px rgba(0,0,0,0.5), 0 0 3px ${color}60`
                    : 'none'
                }}
              />
            );
          })
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-wrap gap-3">
      {rotations.map((rot, index) => (
        <div key={index} className="flex flex-col items-center gap-1">
          {renderShape(rot, index)}
          {showRotations && (
            <span className="text-xs text-gray-500">
              {index === 0 ? '0°' : `${index * 90}°`}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
