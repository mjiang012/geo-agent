import { useState, useCallback } from 'react';

interface PixelGridProps {
  size?: number;
  grid: number[][];
  onChange: (grid: number[][]) => void;
  color: string;
  readOnly?: boolean;
}

export function PixelGrid({ 
  size = 4, 
  grid, 
  onChange, 
  color,
  readOnly = false 
}: PixelGridProps) {
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawValue, setDrawValue] = useState(0);

  const handleCellClick = useCallback((row: number, col: number) => {
    if (readOnly) return;
    
    const newGrid = grid.map(r => [...r]);
    newGrid[row][col] = newGrid[row][col] ? 0 : 1;
    onChange(newGrid);
  }, [grid, onChange, readOnly]);

  const handleMouseDown = useCallback((row: number, col: number) => {
    if (readOnly) return;
    
    setIsDrawing(true);
    const newValue = grid[row][col] ? 0 : 1;
    setDrawValue(newValue);
    
    const newGrid = grid.map(r => [...r]);
    newGrid[row][col] = newValue;
    onChange(newGrid);
  }, [grid, onChange, readOnly]);

  const handleMouseEnter = useCallback((row: number, col: number) => {
    if (!isDrawing || readOnly) return;
    
    const newGrid = grid.map(r => [...r]);
    newGrid[row][col] = drawValue;
    onChange(newGrid);
  }, [isDrawing, drawValue, grid, onChange, readOnly]);

  const handleMouseUp = useCallback(() => {
    setIsDrawing(false);
  }, []);

  // 确保网格大小正确
  const normalizedGrid = grid.length === size 
    ? grid 
    : Array(size).fill(null).map((_, i) => 
        Array(size).fill(null).map((_, j) => 
          grid[i]?.[j] || 0
        )
      );

  return (
    <div 
      className="inline-block"
      onMouseLeave={handleMouseUp}
      onMouseUp={handleMouseUp}
    >
      <div 
        className="grid gap-0.5 p-2 bg-gray-800 rounded-lg"
        style={{ 
          gridTemplateColumns: `repeat(${size}, 1fr)`,
          cursor: readOnly ? 'default' : 'crosshair'
        }}
      >
        {normalizedGrid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <button
              key={`${rowIndex}-${colIndex}`}
              className={`
                w-8 h-8 rounded-sm transition-all duration-100
                ${cell ? 'shadow-inner' : 'hover:bg-gray-600'}
                ${readOnly ? 'cursor-default' : 'cursor-pointer'}
              `}
              style={{
                backgroundColor: cell ? color : '#374151',
                boxShadow: cell 
                  ? `inset 0 0 4px rgba(0,0,0,0.5), 0 0 4px ${color}40`
                  : 'inset 0 0 4px rgba(0,0,0,0.3)'
              }}
              onClick={() => handleCellClick(rowIndex, colIndex)}
              onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
              onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
              disabled={readOnly}
            />
          ))
        )}
      </div>
    </div>
  );
}
