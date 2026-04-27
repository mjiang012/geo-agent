import { useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  ThumbsUp, 
  Award, 
  MessageSquare,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { useBrandStore } from '../stores/brandStore';
import { Link } from 'react-router-dom';

const MetricCard = ({ 
  title, 
  value, 
  trend, 
  trendValue, 
  icon: Icon,
  color
}: { 
  title: string; 
  value: string | number; 
  trend: 'up' | 'down' | 'stable';
  trendValue: string;
  icon: React.ElementType;
  color: string;
}) => (
  <div className="bg-white rounded-xl p-6 border border-gray-200">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
    <div className="flex items-center gap-2 mt-4">
      {trend === 'up' ? (
        <TrendingUp className="w-4 h-4 text-green-500" />
      ) : trend === 'down' ? (
        <TrendingDown className="w-4 h-4 text-red-500" />
      ) : null}
      <span className={`text-sm font-medium ${
        trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'
      }`}>
        {trendValue}
      </span>
      <span className="text-sm text-gray-400">较上周</span>
    </div>
  </div>
);

export default function Dashboard() {
  const { 
    currentBrand, 
    diagnosisOverview, 
    keywords,
    strategies,
    fetchDiagnosisOverview, 
    fetchKeywords,
    fetchStrategies
  } = useBrandStore();

  useEffect(() => {
    if (currentBrand) {
      fetchDiagnosisOverview(currentBrand.id);
      fetchKeywords(currentBrand.id);
      fetchStrategies(currentBrand.id);
    }
  }, [currentBrand, fetchDiagnosisOverview, fetchKeywords, fetchStrategies]);

  const highPriorityKeywords = keywords.filter(k => k.isHighPriority);
  const activeStrategy = strategies.find(s => s.status === 'active');

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            欢迎回来，{currentBrand?.name || '品牌'}优化师
          </h2>
          <p className="text-gray-500 mt-1">
            以下是您的品牌AI搜索表现概览
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">数据更新于：2024-01-07 14:30</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="AI可见率"
          value={`${diagnosisOverview?.aiVisibilityRate || 0}%`}
          trend="up"
          trendValue="+5.2%"
          icon={Eye}
          color="bg-blue-500"
        />
        <MetricCard
          title="推荐率"
          value={`${diagnosisOverview?.recommendationRate || 0}%`}
          trend="up"
          trendValue="+3.8%"
          icon={ThumbsUp}
          color="bg-green-500"
        />
        <MetricCard
          title="平均排名"
          value={diagnosisOverview?.avgRank || 0}
          trend="up"
          trendValue="-0.3"
          icon={Award}
          color="bg-purple-500"
        />
        <MetricCard
          title="情感健康度"
          value={`${diagnosisOverview?.sentimentHealth || 0}%`}
          trend="stable"
          trendValue="0%"
          icon={MessageSquare}
          color="bg-orange-500"
        />
      </div>

      {/* Alerts & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alerts */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">重要提醒</h3>
            <Link to="/monitoring" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
              查看全部 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="space-y-3">
            {highPriorityKeywords.length > 0 ? (
              <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg border border-red-100">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                <div>
                  <p className="font-medium text-red-900">发现 {highPriorityKeywords.length} 个高优攻坚词</p>
                  <p className="text-sm text-red-700 mt-1">
                    这些关键词在AI回答中完全没有品牌信息，建议立即优化
                  </p>
                  <Link 
                    to="/keywords" 
                    className="inline-flex items-center gap-1 text-sm text-red-600 hover:text-red-700 mt-2"
                  >
                    立即处理 <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ) : null}
            
            <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
              <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-900">本周内容发布计划待完成</p>
                <p className="text-sm text-yellow-700 mt-1">
                  还有3篇优化内容待发布，建议在本周内完成
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">快捷操作</h3>
          <div className="space-y-3">
            <Link
              to="/keywords"
              className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-medium">+</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">添加种子词</p>
                <p className="text-sm text-gray-500">扩充品牌热词库</p>
              </div>
            </Link>
            
            <Link
              to="/content"
              className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 font-medium">AI</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">生成优化内容</p>
                <p className="text-sm text-gray-500">批量创建GEO文章</p>
              </div>
            </Link>
            
            <Link
              to="/ai-analysis"
              className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 font-medium">分析</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">AI偏好分析</p>
                <p className="text-sm text-gray-500">了解各平台内容偏好</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Active Strategy */}
      {activeStrategy && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">当前优化策略</h3>
            <Link to="/strategy" className="text-sm text-blue-600 hover:text-blue-700">
              查看详情
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-500">策略名称</p>
              <p className="font-medium text-gray-900 mt-1">{activeStrategy.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">预期ROI</p>
              <p className="font-medium text-green-600 mt-1">{activeStrategy.expectedRoi}x</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">进行中任务</p>
              <p className="font-medium text-gray-900 mt-1">
                {activeStrategy.tasks.filter(t => t.status === 'in_progress').length} / {activeStrategy.tasks.length}
              </p>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-gray-500">任务进度</span>
              <span className="text-sm font-medium text-gray-900">
                {Math.round((activeStrategy.tasks.filter(t => t.status === 'completed').length / activeStrategy.tasks.length) * 100)}%
              </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 rounded-full transition-all"
                style={{ 
                  width: `${(activeStrategy.tasks.filter(t => t.status === 'completed').length / activeStrategy.tasks.length) * 100}%` 
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Platform Performance */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">各平台表现</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['豆包', '元宝', 'DeepSeek'].map((platform, index) => {
            const mockData = [
              { visibility: 75, sentiment: 82, rank: 2.5 },
              { visibility: 68, sentiment: 78, rank: 3.1 },
              { visibility: 82, sentiment: 85, rank: 2.1 }
            ][index];
            
            return (
              <div key={platform} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <span className="font-semibold text-gray-700">{platform.charAt(0)}</span>
                  </div>
                  <span className="font-medium text-gray-900">{platform}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">可见率</span>
                    <span className="font-medium text-gray-900">{mockData.visibility}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">情感得分</span>
                    <span className="font-medium text-gray-900">{mockData.sentiment}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">平均排名</span>
                    <span className="font-medium text-gray-900">第{mockData.rank}位</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
