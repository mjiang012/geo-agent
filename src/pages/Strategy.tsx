import { useEffect, useState } from 'react';
import { useBrandStore } from '../stores/brandStore';
import { Target, CheckCircle2, Clock, AlertCircle, TrendingUp, Calendar } from 'lucide-react';

export default function Strategy() {
  const { currentBrand, strategies, fetchStrategies } = useBrandStore();
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null);

  useEffect(() => {
    if (currentBrand) {
      fetchStrategies(currentBrand.id);
    }
  }, [currentBrand, fetchStrategies]);

  useEffect(() => {
    if (strategies.length > 0 && !selectedStrategy) {
      setSelectedStrategy(strategies[0].id);
    }
  }, [strategies, selectedStrategy]);

  const activeStrategy = strategies.find(s => s.id === selectedStrategy);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-blue-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">专属优化策略</h2>
          <p className="text-gray-500 mt-1">
            基于诊断数据自动生成定制化的GEO优化路径
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Target className="w-4 h-4" />
          生成新策略
        </button>
      </div>

      {/* Strategy List */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">策略列表</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {strategies.map(strategy => (
            <button
              key={strategy.id}
              onClick={() => setSelectedStrategy(strategy.id)}
              className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors ${
                selectedStrategy === strategy.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  strategy.status === 'active' ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  <Target className={`w-5 h-5 ${
                    strategy.status === 'active' ? 'text-green-600' : 'text-gray-600'
                  }`} />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">{strategy.name}</p>
                  <p className="text-sm text-gray-500">{strategy.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  strategy.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {strategy.status === 'active' ? '进行中' : '已暂停'}
                </span>
                <span className="text-sm text-gray-500">
                  预期ROI: {strategy.expectedRoi}x
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Strategy Details */}
      {activeStrategy && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Platform Allocation */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">平台投放比重</h3>
            <div className="space-y-4">
              {activeStrategy.platformAllocation.map((allocation) => (
                <div key={allocation.platform}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-900">{allocation.platform}</span>
                    <span className="text-gray-600">{allocation.percentage}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${allocation.percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{allocation.reason}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Content Focus */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">内容侧重点</h3>
            <div className="space-y-3">
              {activeStrategy.contentFocus.map((focus) => (
                <div key={focus.type} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    focus.priority === 1 
                      ? 'bg-red-100 text-red-700' 
                      : focus.priority === 2 
                      ? 'bg-orange-100 text-orange-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {focus.priority}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">{focus.type}</p>
                    <p className="text-sm text-gray-500">{focus.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Priority Keywords */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">高优攻坚词</h3>
            <div className="space-y-2">
              {activeStrategy.priorityKeywords.map((keyword, index) => (
                <div key={index} className="flex items-center gap-2 p-3 bg-red-50 rounded-lg border border-red-100">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-red-900">{keyword}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-blue-900">预期ROI</span>
              </div>
              <p className="text-2xl font-bold text-blue-700">{activeStrategy.expectedRoi}x</p>
            </div>
          </div>
        </div>
      )}

      {/* Task List */}
      {activeStrategy && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">任务清单</h3>
          <div className="space-y-3">
            {activeStrategy.tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {getStatusIcon(task.status)}
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{task.title}</p>
                  <p className="text-sm text-gray-500">{task.description}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                    {task.priority === 'high' ? '高优先级' : task.priority === 'medium' ? '中优先级' : '低优先级'}
                  </span>
                  {task.dueDate && (
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      {task.dueDate}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
