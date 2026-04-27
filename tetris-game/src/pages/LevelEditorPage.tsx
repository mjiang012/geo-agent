import { useState } from 'react';
import { LevelConfig } from '../types/levelEditor';
import { LevelManager } from '../components/level-editor/LevelManager';
import { LevelEditor } from '../components/level-editor/LevelEditor';
import { ArrowLeft } from 'lucide-react';

interface LevelEditorPageProps {
  onBack: () => void;
  onPlayLevel: (level: LevelConfig) => void;
}

export function LevelEditorPage({ onBack, onPlayLevel }: LevelEditorPageProps) {
  const [view, setView] = useState<'list' | 'edit'>('list');
  const [editingLevel, setEditingLevel] = useState<LevelConfig | undefined>();

  const handleCreate = () => {
    setEditingLevel(undefined);
    setView('edit');
  };

  const handleEdit = (level: LevelConfig) => {
    setEditingLevel(level);
    setView('edit');
  };

  const handlePlay = (level: LevelConfig) => {
    onPlayLevel(level);
  };

  const handleSave = () => {
    setView('list');
    setEditingLevel(undefined);
  };

  const handleCancel = () => {
    setView('list');
    setEditingLevel(undefined);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        {/* 导航栏 */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>返回游戏</span>
          </button>
          <div className="flex-1" />
        </div>

        {/* 内容区域 */}
        {view === 'list' ? (
          <LevelManager
            onEdit={handleEdit}
            onPlay={handlePlay}
            onCreate={handleCreate}
          />
        ) : (
          <LevelEditor
            level={editingLevel}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        )}
      </div>
    </div>
  );
}
