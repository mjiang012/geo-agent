import { useState, useCallback } from 'react';
import { CustomTetromino, COLOR_OPTIONS } from '../../types/levelEditor';
import { PixelGrid } from './PixelGrid';
import { ShapePreview } from './ShapePreview';
import { rotateClockwise } from '../../utils/tetrominos';
import { Plus, Trash2, RotateCw, Save, X } from 'lucide-react';

interface TetrominoEditorProps {
  tetromino?: CustomTetromino;
  onSave: (tetromino: CustomTetromino) => void;
  onCancel: () => void;
}

const GRID_SIZE = 4;

const createEmptyGrid = (size: number = GRID_SIZE): number[][] => {
  return Array(size).fill(null).map(() => Array(size).fill(0));
};

export function TetrominoEditor({ tetromino, onSave, onCancel }: TetrominoEditorProps) {
  const [name, setName] = useState(tetromino?.name || '新方块');
  const [color, setColor] = useState(tetromino?.color || COLOR_OPTIONS[0]);
  const [weight, setWeight] = useState(tetromino?.weight || 5);
  const [shapes, setShapes] = useState<number[][][]>(
    tetromino?.shapes?.length 
      ? tetromino.shapes 
      : [createEmptyGrid()]
  );
  const [activeRotation, setActiveRotation] = useState(0);

  const handleGridChange = useCallback((newGrid: number[][]) => {
    setShapes(prev => {
      const updated = [...prev];
      updated[activeRotation] = newGrid;
      return updated;
    });
  }, [activeRotation]);

  const addRotation = useCallback(() => {
    if (shapes.length >= 4) return;
    setShapes(prev => [...prev, createEmptyGrid()]);
    setActiveRotation(shapes.length);
  }, [shapes.length]);

  const removeRotation = useCallback((index: number) => {
    if (shapes.length <= 1) return;
    setShapes(prev => prev.filter((_, i) => i !== index));
    if (activeRotation >= index && activeRotation > 0) {
      setActiveRotation(activeRotation - 1);
    }
  }, [shapes.length, activeRotation]);

  const autoGenerateRotations = useCallback(() => {
    const baseShape = shapes[0];
    const newShapes = [baseShape];
    let current = baseShape;
    
    for (let i = 0; i < 3; i++) {
      current = rotateClockwise(current);
      newShapes.push(current);
    }
    
    setShapes(newShapes);
  }, [shapes]);

  const handleSave = () => {
    // 验证至少有一个方块
    const hasAnyBlock = shapes.some(shape => 
      shape.some(row => row.some(cell => cell === 1))
    );
    
    if (!hasAnyBlock) {
      alert('请至少绘制一个方块');
      return;
    }

    onSave({
      id: tetromino?.id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: name.trim() || '未命名方块',
      color,
      shapes: shapes.map(shape => shape.map(row => [...row])),
      weight,
    });
  };

  const clearGrid = () => {
    handleGridChange(createEmptyGrid());
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white">
          {tetromino ? '编辑方块' : '创建新方块'}
        </h3>
        <button
          onClick={onCancel}
          className="p-2 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左侧：编辑器 */}
        <div className="space-y-4">
          {/* 名称输入 */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              方块名称
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              placeholder="输入方块名称"
            />
          </div>

          {/* 颜色选择 */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              颜色
            </label>
            <div className="flex flex-wrap gap-2">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`
                    w-8 h-8 rounded-lg transition-all
                    ${color === c ? 'ring-2 ring-white scale-110' : 'hover:scale-105'}
                  `}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* 权重设置 */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              生成权重: {weight}
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={weight}
              onChange={(e) => setWeight(parseInt(e.target.value))}
              className="w-full accent-blue-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>稀有</span>
              <span>常见</span>
            </div>
          </div>

          {/* 旋转状态标签 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-300">
                旋转状态 ({shapes.length}/4)
              </label>
              <div className="flex gap-2">
                {shapes.length < 4 && (
                  <button
                    onClick={addRotation}
                    className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-600 hover:bg-blue-500 text-white rounded"
                  >
                    <Plus className="w-3 h-3" />
                    添加
                  </button>
                )}
                <button
                  onClick={autoGenerateRotations}
                  className="flex items-center gap-1 px-2 py-1 text-xs bg-purple-600 hover:bg-purple-500 text-white rounded"
                >
                  <RotateCw className="w-3 h-3" />
                  自动
                </button>
              </div>
            </div>
            <div className="flex gap-2">
              {shapes.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveRotation(index)}
                  className={`
                    px-3 py-1 rounded text-sm font-medium transition-colors
                    ${activeRotation === index 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}
                  `}
                >
                  {index * 90}°
                  {shapes.length > 1 && (
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        removeRotation(index);
                      }}
                      className="ml-2 text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-3 h-3 inline" />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* 像素网格编辑器 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-300">
                形状编辑器 (点击绘制)
              </label>
              <button
                onClick={clearGrid}
                className="text-xs text-red-400 hover:text-red-300"
              >
                清空
              </button>
            </div>
            <PixelGrid
              size={GRID_SIZE}
              grid={shapes[activeRotation]}
              onChange={handleGridChange}
              color={color}
            />
          </div>
        </div>

        {/* 右侧：预览 */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-300">
            预览 (所有旋转)
          </label>
          <div className="bg-gray-800 rounded-lg p-4">
            <ShapePreview
              shape={shapes[activeRotation]}
              color={color}
              showRotations={true}
            />
          </div>

          {/* 提示信息 */}
          <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-4 text-sm text-blue-200">
            <p className="font-medium mb-2">提示:</p>
            <ul className="list-disc list-inside space-y-1 text-blue-300">
              <li>点击网格单元格绘制方块形状</li>
              <li>添加多个旋转状态以增加多样性</li>
              <li>使用"自动"按钮自动生成旋转</li>
              <li>生成权重影响该方块出现的频率</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 底部按钮 */}
      <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-700">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
        >
          取消
        </button>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-medium transition-colors"
        >
          <Save className="w-4 h-4" />
          保存方块
        </button>
      </div>
    </div>
  );
}
