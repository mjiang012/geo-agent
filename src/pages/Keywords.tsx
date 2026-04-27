import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Sparkles, 
  TrendingUp, 
  TrendingDown,
  Minus,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { useBrandStore } from '../stores/brandStore';
import type { Keyword } from '../types';

const KeywordTable = ({ keywords }: { keywords: Keyword[] }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">关键词</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">类型</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">搜索量</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">AI可见度</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">转化相关性</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">优先级</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">状态</th>
          </tr>
        </thead>
        <tbody>
          {keywords.map((keyword) => (
            <tr key={keyword.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-3 px-4">
                <div>
                  <p className="font-medium text-gray-900">{keyword.keyword}</p>
                  {keyword.category && (
                    <span className="text-xs text-gray-500">{keyword.category}</span>
                  )}
                </div>
              </td>
              <td className="py-3 px-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  keyword.type === 'seed' 
                    ? 'bg-blue-100 text-blue-800'
                    : keyword.type === 'expanded'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-purple-100 text-purple-800'
                }`}>
                  {keyword.type === 'seed' ? '种子词' : keyword.type === 'expanded' ? '扩充词' : '意图词'}
                </span>
              </td>
              <td className="py-3 px-4">
                <span className="text-sm text-gray-900">
                  {keyword.searchVolume?.toLocaleString() || '-'}
                </span>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${keyword.aiVisibilityScore || 0}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-900">{keyword.aiVisibilityScore || 0}</span>
                </div>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${keyword.conversionScore || 0}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-900">{keyword.conversionScore || 0}</span>
                </div>
              </td>
              <td className="py-3 px-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  keyword.isHighPriority
                    ? 'bg-red-100 text-red-800'
                    : (keyword.priorityScore || 0) > 70
                    ? 'bg-orange-100 text-orange-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {keyword.isHighPriority ? '高优攻坚' : (keyword.priorityScore || 0) > 70 ? '高优先级' : '普通'}
                </span>
              </td>
              <td className="py-3 px-4">
                {keyword.isHighPriority ? (
                  <div className="flex items-center gap-1 text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">需优化</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-green-600">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-sm">正常</span>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default function Keywords() {
  const { currentBrand, keywords, fetchKeywords, isLoading } = useBrandStore();
  const [activeTab, setActiveTab] = useState<'all' | 'seed' | 'intent' | 'high-priority'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSeedModal, setShowSeedModal] = useState(false);
  const [seedInput, setSeedInput] = useState('');

  useEffect(() => {
    if (currentBrand) {
      fetchKeywords(currentBrand.id);
    }
  }, [currentBrand, fetchKeywords]);

  const filteredKeywords = keywords.filter(keyword => {
    const matchesTab = activeTab === 'all' 
      ? true 
      : activeTab === 'high-priority'
      ? keyword.isHighPriority
      : keyword.type === activeTab;
    
    const matchesSearch = keyword.keyword.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesTab && matchesSearch;
  });

  const handleAddSeed = () => {
    // TODO: Implement seed keyword addition
    console.log('Adding seed keywords:', seedInput);
    setShowSeedModal(false);
    setSeedInput('');
  };

  const tabs = [
    { id: 'all', label: '全部', count: keywords.length },
    { id: 'seed', label: '种子词', count: keywords.filter(k => k.type === 'seed').length },
    { id: 'intent', label: '意图词', count: keywords.filter(k => k.type === 'intent').length },
    { id: 'high-priority', label: '高优攻坚', count: keywords.filter(k => k.isHighPriority).length },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">热词管理</h2>
          <p className="text-gray-500 mt-1">
            管理品牌热词库，支持种子词输入、意图泛化和价值打分
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowSeedModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            添加种子词
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            导出词表
          </button>
        </div>
      </div>

      {/* Process Steps */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">热词建立流程</h3>
        <div className="flex items-center justify-between">
          {[
            { step: 1, title: '种子词输入', desc: '输入核心品牌词、产品词', status: 'completed' },
            { step: 2, title: '多源数据扩充', desc: '抓取微信、抖音等数据源', status: 'completed' },
            { step: 3, title: '意图泛化', desc: '生成用户可能提问的问题', status: 'completed' },
            { step: 4, title: '价值清洗打分', desc: '去重、打分、标记高优词', status: 'in_progress' },
          ].map((item, index) => (
            <div key={item.step} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  item.status === 'completed' 
                    ? 'bg-green-500 text-white'
                    : item.status === 'in_progress'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {item.status === 'completed' ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    item.step
                  )}
                </div>
                <p className="mt-2 font-medium text-gray-900 text-sm">{item.title}</p>
                <p className="text-xs text-gray-500 text-center max-w-[120px]">{item.desc}</p>
              </div>
              {index < 3 && (
                <div className="w-24 h-0.5 bg-gray-200 mx-4" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {tab.label}
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="搜索关键词..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
            <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
              <Filter className="w-4 h-4" />
              筛选
            </button>
          </div>
        </div>
      </div>

      {/* Keywords Table */}
      <div className="bg-white rounded-xl border border-gray-200">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">加载中...</div>
        ) : filteredKeywords.length > 0 ? (
          <KeywordTable keywords={filteredKeywords} />
        ) : (
          <div className="p-8 text-center text-gray-500">
            <p>暂无关键词数据</p>
            <button 
              onClick={() => setShowSeedModal(true)}
              className="mt-4 text-blue-600 hover:text-blue-700"
            >
              添加种子词开始
            </button>
          </div>
        )}
      </div>

      {/* Seed Modal */}
      {showSeedModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">添加种子词</h3>
            <p className="text-sm text-gray-500 mb-4">
              输入核心品牌词、产品词、竞品词等，多个词用逗号分隔
            </p>
            <textarea
              value={seedInput}
              onChange={(e) => setSeedInput(e.target.value)}
              placeholder="例如：理想汽车, 理想L9, 蔚来, 新能源SUV"
              className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowSeedModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                取消
              </button>
              <button
                onClick={handleAddSeed}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                开始扩充
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
