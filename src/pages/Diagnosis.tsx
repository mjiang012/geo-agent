import { useEffect } from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { useBrandStore } from '../stores/brandStore';
import { AlertCircle, CheckCircle2, TrendingUp, TrendingDown } from 'lucide-react';

const COLORS = ['#10B981', '#F59E0B', '#EF4444'];

export default function Diagnosis() {
  const { currentBrand, diagnosisOverview, fetchDiagnosisOverview } = useBrandStore();

  useEffect(() => {
    if (currentBrand) {
      fetchDiagnosisOverview(currentBrand.id);
    }
  }, [currentBrand, fetchDiagnosisOverview]);

  // Mock sentiment data
  const sentimentData = [
    { name: '正面', value: 65, color: '#10B981' },
    { name: '中性', value: 25, color: '#F59E0B' },
    { name: '负面', value: 10, color: '#EF4444' },
  ];

  // Mock platform coverage data
  const platformCoverageData = [
    { platform: '豆包', coverage: 75, mentionCount: 45 },
    { platform: '元宝', coverage: 68, mentionCount: 38 },
    { platform: 'DeepSeek', coverage: 82, mentionCount: 52 },
    { platform: '通义千问', coverage: 58, mentionCount: 32 },
    { platform: '文心一言', coverage: 62, mentionCount: 35 },
  ];

  const trendData = diagnosisOverview?.trendData || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">品牌信息诊断中心</h2>
        <p className="text-gray-500 mt-1">
          深度扫描品牌在各大AI平台的认知状态，收集全维度数据画像
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">AI可见率</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {diagnosisOverview?.aiVisibilityRate || 0}%
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <CheckCircle2 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-sm text-green-600">+5.2%</span>
            <span className="text-sm text-gray-400">较上周</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">推荐率</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {diagnosisOverview?.recommendationRate || 0}%
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-sm text-green-600">+3.8%</span>
            <span className="text-sm text-gray-400">较上周</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">平均排名</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {diagnosisOverview?.avgRank || 0}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <CheckCircle2 className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-sm text-green-600">-0.3</span>
            <span className="text-sm text-gray-400">较上周</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">情感健康度</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {diagnosisOverview?.sentimentHealth || 0}%
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <AlertCircle className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <TrendingDown className="w-4 h-4 text-red-500" />
            <span className="text-sm text-red-600">-1.2%</span>
            <span className="text-sm text-gray-400">较上周</span>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sentiment Analysis */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">情感倾向分析</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            {sentimentData.map((item) => (
              <div key={item.name} className="text-center">
                <p className="text-2xl font-bold" style={{ color: item.color }}>
                  {item.value}%
                </p>
                <p className="text-sm text-gray-500">{item.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Coverage */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">各平台覆盖率</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={platformCoverageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="platform" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="coverage" fill="#3B82F6" name="覆盖率(%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Trend Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">趋势分析</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line 
                yAxisId="left" 
                type="monotone" 
                dataKey="visibilityRate" 
                stroke="#3B82F6" 
                name="可见率(%)"
                strokeWidth={2}
              />
              <Line 
                yAxisId="left" 
                type="monotone" 
                dataKey="sentimentScore" 
                stroke="#10B981" 
                name="情感得分"
                strokeWidth={2}
              />
              <Line 
                yAxisId="right" 
                type="monotone" 
                dataKey="mentionCount" 
                stroke="#F59E0B" 
                name="提及次数"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gap Analysis */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">覆盖缺口分析</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 bg-red-50 rounded-lg border border-red-100">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-red-900">高优攻坚词覆盖不足</p>
              <p className="text-sm text-red-700 mt-1">
                发现2个高价值意图词在AI回答中完全没有品牌信息，建议立即优化
              </p>
              <div className="flex gap-2 mt-3">
                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                  20万预算买哪款新能源SUV底盘最好？
                </span>
                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                  新能源SUV续航焦虑怎么解决？
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
            <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-yellow-900">部分平台覆盖率偏低</p>
              <p className="text-sm text-yellow-700 mt-1">
                通义千问和文心一言平台的品牌覆盖率低于平均水平，建议加强内容投放
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
