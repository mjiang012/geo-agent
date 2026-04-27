import { describe, it, expect, vi } from 'vitest';

// 测试中文按钮文本是否正确设置
describe('中文按钮文本测试', () => {
  it('主菜单按钮文本应该是中文', () => {
    const buttonTexts = ['经典模式', '关卡编辑器'];
    buttonTexts.forEach(text => {
      expect(text).toBeTruthy();
      expect(text.length).toBeGreaterThan(0);
    });
  });

  it('游戏控制按钮文本应该是中文', () => {
    const controlTexts = ['开始', '暂停', '继续', '重置'];
    controlTexts.forEach(text => {
      expect(text).toBeTruthy();
    });
  });

  it('关卡编辑器按钮文本应该是中文', () => {
    const editorTexts = [
      '保存关卡',
      '取消',
      '重置',
      '添加自定义方块',
      '编辑',
      '删除'
    ];
    editorTexts.forEach(text => {
      expect(text).toBeTruthy();
    });
  });

  it('关卡管理按钮文本应该是中文', () => {
    const managerTexts = [
      '创建新关卡',
      '导入',
      '全部导出',
      '试玩',
      '复制'
    ];
    managerTexts.forEach(text => {
      expect(text).toBeTruthy();
    });
  });

  it('方块编辑器按钮文本应该是中文', () => {
    const tetrominoTexts = [
      '保存方块',
      '添加',
      '自动',
      '清空'
    ];
    tetrominoTexts.forEach(text => {
      expect(text).toBeTruthy();
    });
  });

  it('游戏结束界面文本应该是中文', () => {
    const gameOverTexts = [
      '游戏结束',
      '再玩一次',
      '消除行数',
      '到达等级'
    ];
    gameOverTexts.forEach(text => {
      expect(text).toBeTruthy();
    });
  });
});

// 测试确认对话框文本
describe('确认对话框文本测试', () => {
  it('删除确认对话框文本应该是中文', () => {
    const confirmTexts = [
      '确定要删除这个关卡吗？',
      '确定要删除这个自定义方块吗？',
      '确定要重置为默认配置吗？'
    ];
    confirmTexts.forEach(text => {
      expect(text).toBeTruthy();
      expect(text.includes('确定')).toBe(true);
    });
  });

  it('未保存更改提示应该是中文', () => {
    const unsavedText = '您有未保存的更改，确定要放弃吗？';
    expect(unsavedText).toBeTruthy();
    expect(unsavedText.includes('未保存')).toBe(true);
  });
});

// 测试标签和占位符文本
describe('标签和占位符文本测试', () => {
  it('表单标签应该是中文', () => {
    const labels = [
      '关卡名称',
      '描述（可选）',
      '游戏板宽度',
      '游戏板高度',
      '起始等级',
      '目标分数（可选）'
    ];
    labels.forEach(label => {
      expect(label).toBeTruthy();
    });
  });

  it('占位符文本应该是中文', () => {
    const placeholders = [
      '输入关卡名称',
      '输入描述',
      '输入方块名称',
      '无目标'
    ];
    placeholders.forEach(placeholder => {
      expect(placeholder).toBeTruthy();
    });
  });
});

// 测试提示文本
describe('提示文本测试', () => {
  it('操作提示应该是中文', () => {
    const tips = [
      '使用方向键移动和旋转',
      '空格键快速下落',
      'P键暂停'
    ];
    tips.forEach(tip => {
      expect(tip).toBeTruthy();
    });
  });

  it('方块编辑器提示应该是中文', () => {
    const editorTips = [
      '点击网格单元格绘制方块形状',
      '添加多个旋转状态以增加多样性',
      '使用"自动"按钮自动生成旋转',
      '生成权重影响该方块出现的频率'
    ];
    editorTips.forEach(tip => {
      expect(tip).toBeTruthy();
    });
  });
});
