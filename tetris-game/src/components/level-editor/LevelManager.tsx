import { useState, useCallback } from 'react';
import { LevelConfig } from '../../types/levelEditor';
import { 
  loadLevels, 
  deleteLevel, 
  importLevelFromFile,
  duplicateLevel,
  createNewLevel
} from '../../utils/levelStorage';
import { 
  exportLevelWithPicker, 
  exportLevelsToDirectory,
  isFileSystemAccessSupported 
} from '../../utils/fileSystemExport';
import { Download, Upload, Copy, Trash2, Edit, Play, Plus, FolderDown } from 'lucide-react';

interface LevelManagerProps {
  onEdit: (level: LevelConfig) => void;
  onPlay: (level: LevelConfig) => void;
  onCreate: () => void;
}

export function LevelManager({ onEdit, onPlay, onCreate }: LevelManagerProps) {
  const [levels, setLevels] = useState<LevelConfig[]>(loadLevels());
  const [importError, setImportError] = useState<string | null>(null);

  const refreshLevels = useCallback(() => {
    setLevels(loadLevels());
  }, []);

  const handleDelete = useCallback((levelId: string) => {
    if (confirm('确定要删除这个关卡吗？')) {
      deleteLevel(levelId);
      refreshLevels();
    }
  }, [refreshLevels]);

  const handleDuplicate = useCallback(async (level: LevelConfig) => {
    const newLevel = duplicateLevel(level);
    // Save the duplicated level
    const { saveLevel } = await import('../../utils/levelStorage');
    saveLevel(newLevel);
    refreshLevels();
  }, [refreshLevels]);

  const handleExport = useCallback(async (level: LevelConfig) => {
    try {
      await exportLevelWithPicker(level);
    } catch (error) {
      alert(error instanceof Error ? error.message : '导出失败');
    }
  }, []);

  const handleExportAll = useCallback(async () => {
    if (levels.length === 0) {
      alert('没有可导出的关卡');
      return;
    }
    
    try {
      const result = await exportLevelsToDirectory(levels);
      if (result.success > 0) {
        alert(`成功导出 ${result.success} 个关卡${result.failed > 0 ? `，${result.failed} 个失败` : ''}`);
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : '导出失败');
    }
  }, [levels]);

  const handleImport = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setImportError(null);
      const level = await importLevelFromFile(file);
      const { saveLevel } = await import('../../utils/levelStorage');
      saveLevel(level);
      refreshLevels();
    } catch (error) {
      setImportError(error instanceof Error ? error.message : '导入关卡失败');
    }

    // Reset input
    e.target.value = '';
  }, [refreshLevels]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* 头部操作栏 */}
      <div className="flex flex-wrap gap-3 justify-between items-center">
        <h2 className="text-2xl font-bold text-white">我的关卡</h2>
        <div className="flex gap-3">
          {isFileSystemAccessSupported() && levels.length > 0 && (
            <button
              onClick={handleExportAll}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors"
              title="导出所有关卡到指定目录"
            >
              <FolderDown className="w-4 h-4" />
              <span>全部导出</span>
            </button>
          )}
          <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg cursor-pointer transition-colors">
            <Upload className="w-4 h-4" />
            <span>导入</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>
          <button
            onClick={onCreate}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>创建新关卡</span>
          </button>
        </div>
      </div>

      {/* 导入错误提示 */}
      {importError && (
        <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg">
          {importError}
        </div>
      )}

      {/* 关卡列表 */}
      {levels.length === 0 ? (
        <div className="text-center py-12 bg-gray-800/50 rounded-xl border border-gray-700 border-dashed">
          <p className="text-gray-400 mb-4">还没有自定义关卡</p>
          <button
            onClick={onCreate}
            className="text-blue-400 hover:text-blue-300 font-medium"
          >
            创建你的第一个关卡 →
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {levels.map((level) => (
            <div
              key={level.id}
              className="bg-gray-800 rounded-xl p-5 border border-gray-700 hover:border-gray-600 transition-colors"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1 min-w-[200px]">
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {level.name}
                  </h3>
                  {level.description && (
                    <p className="text-gray-400 text-sm mb-2">{level.description}</p>
                  )}
                  <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                    <span>修改时间: {formatDate(level.modifiedAt)}</span>
                    <span>•</span>
                    <span>{level.levelParams.boardWidth}×{level.levelParams.boardHeight}</span>
                    <span>•</span>
                    <span>起始等级: {level.levelParams.startLevel}</span>
                    {level.useCustomTetrominos && (
                      <>
                        <span>•</span>
                        <span className="text-purple-400">
                          {level.customTetrominos.length} 个自定义方块
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => onPlay(level)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-green-600/80 hover:bg-green-600 text-white rounded-lg text-sm transition-colors"
                    title="试玩"
                  >
                    <Play className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onEdit(level)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-600/80 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors"
                    title="编辑"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDuplicate(level)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
                    title="复制"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleExport(level)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
                    title={isFileSystemAccessSupported() ? "导出到指定位置" : "导出到下载文件夹"}
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(level.id)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-red-600/80 hover:bg-red-600 text-white rounded-lg text-sm transition-colors"
                    title="删除"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
