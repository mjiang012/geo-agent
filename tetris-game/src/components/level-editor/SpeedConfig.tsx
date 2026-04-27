import { SpeedCurveConfig, SPEED_CURVE_PRESETS } from '../../types/levelEditor';

interface SpeedConfigProps {
  config: SpeedCurveConfig;
  onChange: (config: SpeedCurveConfig) => void;
}

export function SpeedConfig({ config, onChange }: SpeedConfigProps) {
  const handlePresetChange = (presetKey: string) => {
    const preset = SPEED_CURVE_PRESETS[presetKey];
    if (preset) {
      onChange({ ...preset });
    }
  };

  const handleCustomChange = (updates: Partial<SpeedCurveConfig>) => {
    onChange({ ...config, ...updates, type: 'custom' });
  };

  // 计算预览数据
  const getPreviewData = () => {
    const data = [];
    for (let level = 1; level <= 20; level++) {
      let interval;
      if (config.type === 'exponential') {
        interval = Math.max(
          config.minInterval,
          config.baseInterval * Math.pow(0.9, level - 1)
        );
      } else {
        interval = Math.max(
          config.minInterval,
          config.baseInterval - (level - 1) * config.decrement
        );
      }
      data.push({ level, interval: Math.round(interval) });
    }
    return data;
  };

  const previewData = getPreviewData();
  const maxInterval = Math.max(...previewData.map(d => d.interval));

  return (
    <div className="space-y-6">
      {/* 预设选择 */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">
          速度预设
        </label>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(SPEED_CURVE_PRESETS).map(([key, preset]) => (
            <button
              key={key}
              onClick={() => handlePresetChange(key)}
              className={`
                px-4 py-3 rounded-lg text-left transition-colors
                ${config.baseInterval === preset.baseInterval && config.decrement === preset.decrement
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}
              `}
            >
              <div className="font-medium capitalize">{key === 'linear' ? '线性' : key === 'exponential' ? '指数' : key === 'slow' ? '慢速' : '快速'}</div>
              <div className="text-xs opacity-75">
                {preset.baseInterval}ms → {preset.minInterval}ms
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 自定义参数 */}
      <div className="bg-gray-800 rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-white">自定义设置</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">
              基础间隔 (ms)
            </label>
            <input
              type="number"
              min="100"
              max="5000"
              step="50"
              value={config.baseInterval}
              onChange={(e) => handleCustomChange({ baseInterval: parseInt(e.target.value) || 1000 })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
            />
          </div>
          
          <div>
            <label className="block text-xs text-gray-400 mb-1">
              最小间隔 (ms)
            </label>
            <input
              type="number"
              min="50"
              max="1000"
              step="10"
              value={config.minInterval}
              onChange={(e) => handleCustomChange({ minInterval: parseInt(e.target.value) || 100 })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
            />
          </div>
          
          <div>
            <label className="block text-xs text-gray-400 mb-1">
              每级减少量 (ms)
            </label>
            <input
              type="number"
              min="10"
              max="500"
              step="10"
              value={config.decrement}
              onChange={(e) => handleCustomChange({ decrement: parseInt(e.target.value) || 100 })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
            />
          </div>
        </div>
      </div>

      {/* 速度曲线预览 */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">
          速度曲线预览
        </label>
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="h-40 flex items-end gap-1">
            {previewData.map((data) => {
              const height = (data.interval / maxInterval) * 100;
              return (
                <div
                  key={data.level}
                  className="flex-1 flex flex-col items-center gap-1"
                >
                  <div
                    className="w-full bg-blue-500/80 rounded-t transition-all hover:bg-blue-400"
                    style={{ height: `${height}%` }}
                    title={`等级 ${data.level}: ${data.interval}ms`}
                  />
                  {data.level % 5 === 1 && (
                    <span className="text-xs text-gray-500">{data.level}</span>
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>等级 1: {config.baseInterval}ms</span>
            <span>等级 20: {previewData[19].interval}ms</span>
          </div>
        </div>
      </div>

      {/* 说明 */}
      <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-4 text-sm">
        <p className="text-blue-200">
          <span className="font-medium">提示:</span> 间隔越小意味着下落速度越快。
          速度曲线决定了随着等级提升，游戏加速的快慢。
        </p>
      </div>
    </div>
  );
}
