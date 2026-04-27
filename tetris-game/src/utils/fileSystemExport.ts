import { LevelConfig } from '../types/levelEditor';

// 检查浏览器是否支持 File System Access API
export function isFileSystemAccessSupported(): boolean {
  return 'showSaveFilePicker' in window;
}

// 使用 File System Access API 导出关卡到指定位置
export async function exportLevelWithPicker(level: LevelConfig): Promise<boolean> {
  try {
    const dataStr = JSON.stringify(level, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    
    // 创建文件句柄选项
    const fileHandle = await (window as any).showSaveFilePicker({
      suggestedName: `tetris-level-${level.name.replace(/\s+/g, '-').toLowerCase()}.json`,
      types: [
        {
          description: 'Tetris Level Files',
          accept: { 'application/json': ['.json'] },
        },
      ],
    });

    // 写入文件
    const writable = await fileHandle.createWritable();
    await writable.write(blob);
    await writable.close();

    return true;
  } catch (error: any) {
    // 用户取消选择时不报错
    if (error.name === 'AbortError') {
      return false;
    }
    console.error('Failed to export level:', error);
    throw new Error('Failed to save file');
  }
}

// 使用 File System Access API 批量导出多个关卡到指定目录
export async function exportLevelsToDirectory(levels: LevelConfig[]): Promise<{ success: number; failed: number }> {
  const result = { success: 0, failed: 0 };
  
  try {
    // 请求选择目录
    const dirHandle = await (window as any).showDirectoryPicker();
    
    for (const level of levels) {
      try {
        const dataStr = JSON.stringify(level, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const fileName = `tetris-level-${level.name.replace(/\s+/g, '-').toLowerCase()}.json`;
        
        // 在目录中创建文件
        const fileHandle = await dirHandle.getFileHandle(fileName, { create: true });
        const writable = await fileHandle.createWritable();
        await writable.write(blob);
        await writable.close();
        
        result.success++;
      } catch (error) {
        console.error(`Failed to export level "${level.name}":`, error);
        result.failed++;
      }
    }
    
    return result;
  } catch (error: any) {
    if (error.name === 'AbortError') {
      return result;
    }
    throw error;
  }
}

// 智能导出：优先使用 File System Access API，回退到传统下载
export async function exportLevelSmart(level: LevelConfig): Promise<void> {
  if (isFileSystemAccessSupported()) {
    try {
      await exportLevelWithPicker(level);
      return;
    } catch (error) {
      console.warn('File System Access API failed, falling back to download');
    }
  }
  
  // 回退到传统下载方式
  fallbackExport(level);
}

// 传统下载方式（自动保存到下载文件夹）
function fallbackExport(level: LevelConfig): void {
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
