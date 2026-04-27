import { useEffect, useState } from 'react';
import { useBrandStore } from '../stores/brandStore';
import { Brain, Globe, FileText, BarChart3, ExternalLink } from 'lucide-react';

const platforms = [
  { id: 'doubao', name: '豆包', icon: 'D', color: 'bg-blue-500' },
  { id: 'yuanbao', name: '元宝', icon: 'Y', color: 'bg-green-500' },
  { id: 'deepseek', name: 'DeepSeek', icon: 'DS', color: 'bg-purple-500' },
  { id: 'qianwen', name: '通义千问', icon: 'Q', color: 'bg-orange-500' },
  { id: 'wenxin', name: '文心一言', icon: 'W', color: 'bg-red-500' },
];

export default function AIAnalysis() {
  const { currentBrand, aiAnalysis, fetchAiAnalysis } = useBrandStore();
  const [selectedPlatform, setSelectedPlatform] = useState('doubao');

  useEffect(() => {
    if (currentBrand) {
      fetchAiAnalysis(currentBrand.id);
    }
  }, [currentBrand, fetchAiAnalysis]);

  const platformData = aiAnalysis.find(a => 
    platforms.find(p => p.id === selectedPlatform)?.name === a.platform
  );

  // Mock content source data
  const contentSources = [
    { domain: 'zhihu.com', frequency: 45, type: '问答社区' },
    { domain: 'toutiao.com', frequency: 32, type: '资讯平台' },
    { domain: 'weibo.com', frequency: 28, type: '社交媒体' },
    { domain: '36kr.com', frequency: 18, type: '科技媒体' },
    { domain: 'sohu.com', frequency: 15, type: '门户网站' },
  ];

  // Mock content features
  const contentFeatures = [
    { feature: '结构化标题', importance: 95, description: '使用H2/H3标题层级，便于AI抓取' },
    { feature: '关键信息前置', importance: 88, description: '核心内容放在文章前30%' },
    { feature: '数据支撑', importance: 82, description: '包含具体数字和统计' },
    { feature: '权威引用', importance: 78, description: '引用权威来源和专家观点' },
    { feature: '问答格式', importance: 75, description: '采用问答形式组织内容' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">AI偏好逆向分析</h2>
        <p className="text-gray-500 mt-1">
          逆向拆解各AI模型对内容的偏好逻辑与引用机制
        </p>
      </div>

      {/* Platform Selector */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center gap-3">
          {platforms.map(platform => (
            <button
              key={platform.id}
              onClick={() => setSelectedPlatform(platform.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                selectedPlatform === platform.id
                  ? 'bg-blue-50 border-2 border-blue-500'
                  : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
              }`}
            >
              <div className={`w-8 h-8 ${platform.color} rounded-lg flex items-center justify-center text-white font-semibold text-xs`}>
                {platform.icon}
              </div>
              <span className={`font-medium ${
                selectedPlatform === platform.id ? 'text-blue-700' : 'text-gray-700'
              }`}>
                {platform.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Analysis Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sentiment & Coverage */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">回复深度解析</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500">情感倾向</span>
                <span className="font-medium text-gray-900">
                  {platformData ? (platformData.sentimentScore * 100).toFixed(0) : 0}%
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: `${platformData ? platformData.sentimentScore * 100 : 0}%` }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500">品牌覆盖率</span>
                <span className="font-medium text-gray-900">
                  {platformData?.coverageRate || 0}%
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${platformData?.coverageRate || 0}%` }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500">平均排名</span>
                <span className="font-medium text-gray-900">
                  第{platformData?.avgRank || 0}位
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-purple-500 rounded-full"
                  style={{ width: `${100 - ((platformData?.avgRank || 0) / 10) * 100}%` }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500">提及次数</span>
                <span className="font-medium text-gray-900">
                  {platformData?.mentionCount || 0}次
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Sources */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">内容源偏好</h3>
          </div>
          
          <div className="space-y-3">
            {contentSources.map((source, index) => (
              <div key={source.domain} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">{source.domain}</p>
                    <p className="text-xs text-gray-500">{source.type}</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-900">{source.frequency}次</span>
              </div>
            ))}
          </div>
        </div>

        {/* Content Features */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">内容特征偏好</h3>
          </div>
          
          <div className="space-y-4">
            {contentFeatures.map((feature) => (
              <div key={feature.feature}>
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{feature.feature}</p>
                    <p className="text-xs text-gray-500">{feature.description}</p>
                  </div>
                  <span className="text-sm font-medium text-blue-600">{feature.importance}%</span>
                </div>
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${feature.importance}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Platform Comparison */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <BarChart3 className="w-5 h-5 text-orange-600" />
          <h3 className="text-lg font-semibold text-gray-900">平台对比分析</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">平台</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">情感得分</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">覆盖率</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">平均排名</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">提及次数</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">操作</th>
              </tr>
            </thead>
            <tbody>
              {aiAnalysis.map((analysis) => (
                <tr key={analysis.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <span className="font-medium text-gray-900">{analysis.platform}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500 rounded-full"
                          style={{ width: `${analysis.sentimentScore * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-900">{(analysis.sentimentScore * 100).toFixed(0)}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-900">{analysis.coverageRate}%</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-900">第{analysis.avgRank}位</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-900">{analysis.mentionCount}次</span>
                  </td>
                  <td className="py-3 px-4">
                    <button className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700">
                      查看详情 <ExternalLink className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Optimization Suggestions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">优化建议</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <p className="font-medium text-blue-900">针对{platforms.find(p => p.id === selectedPlatform)?.name}的优化策略</p>
            <ul className="mt-2 space-y-2 text-sm text-blue-700">
              <li>• 增加知乎、头条等平台的内容投放</li>
              <li>• 优化文章结构，使用清晰的标题层级</li>
              <li>• 在文章前30%放置核心品牌信息</li>
              <li>• 增加数据支撑和权威引用</li>
            </ul>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-100">
            <p className="font-medium text-green-900">内容格式建议</p>
            <ul className="mt-2 space-y-2 text-sm text-green-700">
              <li>• 采用"总-分-总"结构组织内容</li>
              <li>• 使用问答形式回答用户问题</li>
              <li>• 添加3-5个相关关键词</li>
              <li>• 文章长度控制在800-1500字</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
