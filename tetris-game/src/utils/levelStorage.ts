import { LevelConfig } from '../types/levelEditor';

const STORAGE_KEY = 'tetris-levels';
const STORAGE_VERSION = '1.0';

interface StorageData {
  version: string;
  levels: LevelConfig[];
}

// 生成唯一ID
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// 从 localStorage 加载关卡列表
export function loadLevels(): LevelConfig[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];

    const parsed: StorageData = JSON.parse(data);
    
    // 版本检查
    if (parsed.version !== STORAGE_VERSION) {
      console.warn('Level storage version mismatch, migrating...');
      // 可以在这里添加数据迁移逻辑
    }

    return parsed.levels || [];
  } catch (error) {
    console.error('Failed to load levels:', error);
    return [];
  }
}

// 保存关卡列表到 localStorage
export function saveLevels(levels: LevelConfig[]): boolean {
  try {
    const data: StorageData = {
      version: STORAGE_VERSION,
      levels,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Failed to save levels:', error);
    return false;
  }
}

// 保存单个关卡
export function saveLevel(level: LevelConfig): boolean {
  const levels = loadLevels();
  const existingIndex = levels.findIndex(l => l.id === level.id);
  
  const updatedLevel = {
    ...level,
    modifiedAt: Date.now(),
  };

  if (existingIndex >= 0) {
    levels[existingIndex] = updatedLevel;
  } else {
    levels.push(updatedLevel);
  }

  return saveLevels(levels);
}

// 删除关卡
export function deleteLevel(levelId: string): boolean {
  const levels = loadLevels();
  const filtered = levels.filter(l => l.id !== levelId);
  return saveLevels(filtered);
}

// 获取单个关卡
export function getLevel(levelId: string): LevelConfig | null {
  const levels = loadLevels();
  return levels.find(l => l.id === levelId) || null;
}

// 导出关卡为 JSON 文件
export function exportLevelToFile(level: LevelConfig): void {
  const dataStr = JSON.stringify(level, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `tetris-level-${level.name.replace(/\s+/g, '-').toLowerCase()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// 从文件导入关卡
export function importLevelFromFile(file: File): Promise<LevelConfig> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const level: LevelConfig = JSON.parse(content);
        
        // 验证必要字段
        if (!level.name || !level.levelParams) {
          reject(new Error('Invalid level file format'));
          return;
        }

        // 分配新ID避免冲突
        resolve({
          ...level,
          id: generateId(),
          createdAt: Date.now(),
          modifiedAt: Date.now(),
        });
      } catch (error) {
        reject(new Error('Failed to parse level file'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file);
  });
}

// 创建新关卡
export function createNewLevel(): LevelConfig {
  return {
    id: generateId(),
    name: `Level ${Date.now()}`,
    description: '',
    createdAt: Date.now(),
    modifiedAt: Date.now(),
    customTetrominos: [],
    useCustomTetrominos: false,
    speedCurve: {
      type: 'linear',
      baseInterval: 1000,
      minInterval: 100,
      decrement: 100,
    },
    levelParams: {
      boardWidth: 10,
      boardHeight: 20,
      startLevel: 1,
      scoreMultipliers: {
        1: 1,
        2: 1,
        3: 1,
        4: 1,
      },
    },
  };
}

// 复制关卡
export function duplicateLevel(level: LevelConfig): LevelConfig {
  return {
    ...level,
    id: generateId(),
    name: `${level.name} (Copy)`,
    createdAt: Date.now(),
    modifiedAt: Date.now(),
  };
}
