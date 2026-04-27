import { useState } from 'react';
import { FileText, Plus, Sparkles, Copy, Check, Edit3, LayoutTemplate } from 'lucide-react';

const templates = [
  { id: 'product', name: '产品介绍', description: '突出产品特点和优势' },
  { id: 'comparison', name: '对比评测', description: '与竞品进行客观对比' },
  { id: 'knowledge', name: '行业知识', description: '分享行业专业知识' },
  { id: 'case', name: '用户案例', description: '真实用户使用体验' },
];

const mockContents = [
  {
    id: '1',
    title: '理想L9 vs 蔚来ES8：谁是40万级新能源SUV之王？',
    type: 'comparison',
    geoScore: 85,
    readabilityScore: 78,
    status: 'published',
    createdAt: '2024-01-05',
  },
  {
    id: '2',
    title: '理想汽车增程式技术解析：为什么能解决续航焦虑？',
    type: 'knowledge',
    geoScore: 92,
    readabilityScore: 82,
    status: 'draft',
    createdAt: '2024-01-06',
  },
  {
    id: '3',
    title: '一位理想L9车主的真实用车体验分享',
    type: 'case',
    geoScore: 76,
    readabilityScore: 85,
    status: 'draft',
    createdAt: '2024-01-07',
  },
];

export default function Content() {
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('comparison');
  const [keyword, setKeyword] = useState('');

  const getTypeLabel = (type: string) => {
    const template = templates.find(t => t.id === type);
    return template?.name || type;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">已发布</span>;
      case 'draft':
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">草稿</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">结构化内容生产</h2>
          <p className="text-gray-500 mt-1">
            批量生成符合AI抓取偏好的高质量GEO优化内容
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowGenerateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            AI生成内容
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <Plus className="w-4 h-4" />
            手动创建
          </button>
        </div>
      </div>

      {/* Templates */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {templates.map(template => (
          <div key={template.id} className="p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
              <LayoutTemplate className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">{template.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{template.description}</p>
          </div>
        ))}
      </div>

      {/* Content List */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">内容列表</h3>
          <div className="flex items-center gap-2">
            <select className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm">
              <option value="all">全部状态</option>
              <option value="draft">草稿</option>
              <option value="published">已发布</option>
            </select>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          {mockContents.map(content => (
            <div key={content.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-medium text-gray-900">{content.title}</h4>
                    {getStatusBadge(content.status)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>类型: {getTypeLabel(content.type)}</span>
                    <span>GEO评分: {content.geoScore}</span>
                    <span>可读性: {content.readabilityScore}</span>
                    <span>创建时间: {content.createdAt}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Generate Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">AI生成内容</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">选择模板</label>
                <div className="grid grid-cols-2 gap-3">
                  {templates.map(template => (
                    <button
                      key={template.id}
                      onClick={() => setSelectedTemplate(template.id)}
                      className={`p-3 rounded-lg border text-left transition-colors ${
                        selectedTemplate === template.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <p className="font-medium text-gray-900">{template.name}</p>
                      <p className="text-xs text-gray-500">{template.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">目标关键词</label>
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="输入要优化的关键词"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">生成数量</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="1">1篇</option>
                  <option value="5">5篇</option>
                  <option value="10">10篇</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowGenerateModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                取消
              </button>
              <button
                onClick={() => {
                  console.log('Generating content...', { template: selectedTemplate, keyword });
                  setShowGenerateModal(false);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Sparkles className="w-4 h-4" />
                开始生成
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
