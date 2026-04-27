import { useState, useCallback, useEffect } from 'react';
import { LevelConfig, CustomTetromino, DEFAULT_LEVEL_CONFIG } from '../../types/levelEditor';
import { TetrominoEditor } from './TetrominoEditor';
import { SpeedConfig } from './SpeedConfig';
import { saveLevel } from '../../utils/levelStorage';
import { 
  Save, 
  X, 
  Plus, 
  Blocks, 
  Gauge, 
  Settings,
  ChevronDown,
  ChevronUp,
  Trash2,
  RotateCcw,
  AlertCircle
} from 'lucide-react';

interface LevelEditorProps {
  level?: LevelConfig;
  onSave: () => void;
  onCancel: () => void;
}

export function LevelEditor({ level, onSave, onCancel }: LevelEditorProps) {
  const initialConfig = level || { ...DEFAULT_LEVEL_CONFIG, id: `${Date.now()}` };
  const [config, setConfig] = useState<LevelConfig>(initialConfig);
  const [activeTab, setActiveTab] = useState<'blocks' | 'speed' | 'params'>('blocks');
  const [editingTetromino, setEditingTetromino] = useState<CustomTetromino | undefined>();
  const [expandedSections, setExpandedSections] = useState({
    blocks: true,
    speed: true,
    params: true,
  });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // 检测是否有未保存的更改
  useEffect(() => {
    const isDifferent = JSON.stringify(config) !== JSON.stringify(initialConfig);
    setHasUnsavedChanges(isDifferent);
  }, [config, initialConfig]);

  // 页面关闭前提示未保存
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const handleSave = () => {
    if (!config.name.trim()) {
      alert('请输入关卡名称');
      return;
    }
    saveLevel(config);
    onSave();
  };

  const handleAddTetromino = () => {
    setEditingTetromino(undefined);
  };

  const handleEditTetromino = (tetromino: CustomTetromino) => {
    setEditingTetromino(tetromino);
  };

  const handleSaveTetromino = (tetromino: CustomTetromino) => {
    setConfig(prev => {
      const existingIndex = prev.customTetrominos.findIndex(t => t.id === tetromino.id);
      let newTetrominos;
      if (existingIndex >= 0) {
        newTetrominos = [...prev.customTetrominos];
        newTetrominos[existingIndex] = tetromino;
      } else {
        newTetrominos = [...prev.customTetrominos, tetromino];
      }
      return { ...prev, customTetrominos: newTetrominos };
    });
    setEditingTetromino(undefined);
  };

  const handleDeleteTetromino = (id: string) => {
    if (confirm('确定要删除这个自定义方块吗？')) {
      setConfig(prev => ({
        ...prev,
        customTetrominos: prev.customTetrominos.filter(t => t.id !== id),
      }));
    }
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleResetToDefault = () => {
    if (confirm('确定要重置为默认配置吗？这将清除所有自定义方块并恢复默认参数。')) {
      setConfig({
        ...DEFAULT_LEVEL_CONFIG,
        id: config.id,
        name: config.name,
        description: config.description,
        createdAt: config.createdAt,
        modifiedAt: Date.now(),
      });
      setEditingTetromino(undefined);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* 头部 */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-white">
            {level ? '编辑关卡' : '创建新关卡'}
          </h2>
          {hasUnsavedChanges && (
            <span className="flex items-center gap-1 text-amber-400 text-sm">
              <AlertCircle className="w-4 h-4" />
              未保存的更改
            </span>
          )}
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleResetToDefault}
            className="flex items-center gap-2 px-4 py-2 text-yellow-400 hover:text-yellow-300 transition-colors"
            title="重置为默认配置"
          >
            <RotateCcw className="w-4 h-4" />
            重置
          </button>
          <button
            onClick={() => {
              if (hasUnsavedChanges) {
                if (confirm('您有未保存的更改，确定要放弃吗？')) {
                  onCancel();
                }
              } else {
                onCancel();
              }
            }}
            className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
            取消
          </button>
          <button
            onClick={handleSave}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${
              hasUnsavedChanges
                ? 'bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-600/30'
                : 'bg-gray-600 text-gray-300 cursor-not-allowed'
            }`}
            disabled={!hasUnsavedChanges}
          >
            <Save className="w-4 h-4" />
            保存关卡
          </button>
        </div>
      </div>

      {/* 基本信息 */}
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-700 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              关卡名称 *
            </label>
            <input
              type="text"
              value={config.name}
              onChange={(e) => setConfig(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              placeholder="输入关卡名称"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              描述（可选）
            </label>
            <input
              type="text"
              value={config.description || ''}
              onChange={(e) => setConfig(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              placeholder="输入描述"
            />
          </div>
        </div>
      </div>

      {/* 自定义方块部分 */}
      <div className="bg-gray-900 rounded-xl border border-gray-700 mb-6 overflow-hidden">
        <button
          onClick={() => toggleSection('blocks')}
          className="w-full flex items-center justify-between p-4 bg-gray-800 hover:bg-gray-750 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Blocks className="w-5 h-5 text-purple-400" />
            <span className="font-semibold text-white">自定义方块</span>
            <span className="text-sm text-gray-400">
              ({config.customTetrominos.length})
            </span>
          </div>
          {expandedSections.blocks ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>

        {expandedSections.blocks && (
          <div className="p-4 space-y-4">
            {/* 启用自定义方块 */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={config.useCustomTetrominos}
                onChange={(e) => setConfig(prev => ({ 
                  ...prev, 
                  useCustomTetrominos: e.target.checked 
                }))}
                className="w-5 h-5 rounded border-gray-600 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-300">
                使用自定义方块替代默认方块
              </span>
            </label>

            {/* 方块列表 */}
            {config.customTetrominos.length > 0 && (
              <div className="grid gap-3">
                {config.customTetrominos.map((tetromino) => (
                  <div
                    key={tetromino.id}
                    className="flex items-center justify-between p-3 bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded"
                        style={{ backgroundColor: tetromino.color }}
                      />
                      <div>
                        <div className="font-medium text-white">{tetromino.name}</div>
                        <div className="text-xs text-gray-400">
                          权重: {tetromino.weight} • {tetromino.shapes.length} 种旋转
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditTetromino(tetromino)}
                        className="px-3 py-1 text-sm bg-blue-600/80 hover:bg-blue-600 text-white rounded transition-colors"
                      >
                        编辑
                      </button>
                      <button
                        onClick={() => handleDeleteTetromino(tetromino.id)}
                        className="p-1 text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 添加方块按钮 */}
            {!editingTetromino && (
              <button
                onClick={handleAddTetromino}
                className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-600 rounded-lg text-gray-400 hover:border-gray-500 hover:text-gray-300 transition-colors"
              >
                <Plus className="w-5 h-5" />
                添加自定义方块
              </button>
            )}

            {/* 方块编辑器 */}
            {editingTetromino !== undefined && (
              <TetrominoEditor
                tetromino={editingTetromino}
                onSave={handleSaveTetromino}
                onCancel={() => setEditingTetromino(undefined)}
              />
            )}
          </div>
        )}
      </div>

      {/* 速度配置部分 */}
      <div className="bg-gray-900 rounded-xl border border-gray-700 mb-6 overflow-hidden">
        <button
          onClick={() => toggleSection('speed')}
          className="w-full flex items-center justify-between p-4 bg-gray-800 hover:bg-gray-750 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Gauge className="w-5 h-5 text-green-400" />
            <span className="font-semibold text-white">速度设置</span>
          </div>
          {expandedSections.speed ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>

        {expandedSections.speed && (
          <div className="p-4">
            <SpeedConfig
              config={config.speedCurve}
              onChange={(speedCurve) => setConfig(prev => ({ ...prev, speedCurve }))}
            />
          </div>
        )}
      </div>

      {/* 关卡参数部分 */}
      <div className="bg-gray-900 rounded-xl border border-gray-700 overflow-hidden">
        <button
          onClick={() => toggleSection('params')}
          className="w-full flex items-center justify-between p-4 bg-gray-800 hover:bg-gray-750 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-blue-400" />
            <span className="font-semibold text-white">关卡参数</span>
          </div>
          {expandedSections.params ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>

        {expandedSections.params && (
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  游戏板宽度
                </label>
                <input
                  type="number"
                  min="6"
                  max="20"
                  value={config.levelParams.boardWidth}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    levelParams: {
                      ...prev.levelParams,
                      boardWidth: parseInt(e.target.value) || 10,
                    },
                  }))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  游戏板高度
                </label>
                <input
                  type="number"
                  min="10"
                  max="30"
                  value={config.levelParams.boardHeight}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    levelParams: {
                      ...prev.levelParams,
                      boardHeight: parseInt(e.target.value) || 20,
                    },
                  }))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  起始等级
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={config.levelParams.startLevel}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    levelParams: {
                      ...prev.levelParams,
                      startLevel: parseInt(e.target.value) || 1,
                    },
                  }))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  目标分数（可选）
                </label>
                <input
                  type="number"
                  min="0"
                  value={config.levelParams.targetScore || ''}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    levelParams: {
                      ...prev.levelParams,
                      targetScore: e.target.value ? parseInt(e.target.value) : undefined,
                    },
                  }))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
                  placeholder="无目标"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
