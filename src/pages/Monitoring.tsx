import { useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { AlertTriangle, TrendingUp, TrendingDown, Bell, Eye, MessageSquare } from 'lucide-react';

const trendData = [
  { date: '01-01', visibility: 60, sentiment: 75, mentions: 120 },
  { date: '01-02', visibility: 62, sentiment: 76, mentions: 135 },
  { date: '01-03', visibility: 65, sentiment: 78, mentions: 142 },
  { date: '01-04', visibility: 64, sentiment: 77, mentions: 138 },
  { date: '01-05', visibility: 66, sentiment: 79, mentions: 145 },
  { date: '01-06', visibility: 67, sentiment: 80, mentions: 150 },
  { date: '01-07', visibility: 68, sentiment: 82, mentions: 158 },
];

const alerts = [
  {
    id: 1,
    type: 'sentiment_drop',
    severity: 'warning',
    title: '情感得分下降',
    description: '品牌在豆包平台的情感得分下降5%，建议关注近期舆情',
    time: '2小时前',
  },
  {
    id: 2,
    type: 'ranking_drop',
    severity: 'critical',
    title: '排名显著下降',
    description: '关键词"新能源SUV"在元宝平台排名从第2位下降至第5位',
    time: '5小时前',
  },
  {
    id: 3,
    type: 'competitor_surge',
    severity: 'info',
    title: '竞品动态',
    description: '竞品蔚来在DeepSeek平台提及次数增长30%',
    time: '1天前',
  },
];

const competitors = [
  { name: '特斯拉', visibility: 85, sentiment: 78, trend: 'up' },
  { name: '蔚来', visibility: 72, sentiment: 82, trend: 'up' },
  { name: '小鹏', visibility: 58, sentiment: 75, trend: 'stable' },
  { name: '比亚迪', visibility: 80, sentiment: 85, trend: 'up' },
];

export default function Monitoring() {
  const [timeRange, setTimeRange] = useState('7d');

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">效果监控与闭环</h2>
          <p className="text-gray-500 mt-1">
            实时追踪品牌AI可见度指数，量化优化效果
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="24h">最近24小时</option>
            <option value="7d">最近7天</option>
            <option value="30d">最近30天</option>
            <option value="90d">最近90天</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Eye className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-gray-500">今日可见率</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">68.5%</p>
          <div className="flex items-center gap-2 mt-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-sm text-green-600">+2.3%</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <MessageSquare className="w-5 h-5 text-green-600" />
            <span className="text-sm text-gray-500">今日提及</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">158</p>
          <div className="flex items-center gap-2 mt-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-sm text-green-600">+12</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Bell className="w-5 h-5 text-orange-600" />
            <span className="text-sm text-gray-500">待处理预警</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">2</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm text-gray-500">1个紧急</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            <span className="text-sm text-gray-500">优化效果</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">+15.2%</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm text-gray-500">较上月</span>
          </div>
        </div>
      </div>

      {/* Trend Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">趋势监控</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="colorVisibility" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorSentiment" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="visibility" 
                stroke="#3B82F6" 
                fillOpacity={1} 
                fill="url(#colorVisibility)" 
                name="可见率(%)"
              />
              <Area 
                type="monotone" 
                dataKey="sentiment" 
                stroke="#10B981" 
                fillOpacity={1} 
                fill="url(#colorSentiment)" 
                name="情感得分"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alerts */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">智能预警</h3>
            <button className="text-sm text-blue-600 hover:text-blue-700">
              设置预警规则
            </button>
          </div>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div 
                key={alert.id} 
                className={`p-4 rounded-lg border ${getSeverityColor(alert.severity)}`}
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{alert.title}</p>
                      <span className="text-xs opacity-75">{alert.time}</span>
                    </div>
                    <p className="text-sm mt-1 opacity-90">{alert.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Competitor Monitor */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">竞品监控</h3>
          <div className="space-y-4">
            {competitors.map((competitor) => (
              <div key={competitor.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                    {competitor.name.charAt(0)}
                  </div>
                  <span className="font-medium text-gray-900">{competitor.name}</span>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-center">
                    <p className="text-gray-500">可见率</p>
                    <p className="font-medium text-gray-900">{competitor.visibility}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-500">情感得分</p>
                    <p className="font-medium text-gray-900">{competitor.sentiment}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {competitor.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : competitor.trend === 'down' ? (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
