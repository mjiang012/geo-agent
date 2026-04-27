import { useState } from 'react';
import { Share2, Link2, CheckCircle2, XCircle, Clock, ExternalLink, Plus } from 'lucide-react';

const platforms = [
  { id: 'zhihu', name: '知乎', icon: '知', connected: true, color: 'bg-blue-600' },
  { id: 'toutiao', name: '今日头条', icon: '头', connected: true, color: 'bg-red-500' },
  { id: 'baijiahao', name: '百家号', icon: '百', connected: false, color: 'bg-blue-500' },
  { id: 'sohu', name: '搜狐号', icon: '搜', connected: false, color: 'bg-yellow-500' },
  { id: 'netease', name: '网易号', icon: '网', connected: false, color: 'bg-red-600' },
  { id: 'wechat', name: '公众号', icon: '微', connected: true, color: 'bg-green-500' },
];

const mockDistributions = [
  {
    id: '1',
    contentTitle: '理想L9 vs 蔚来ES8：谁是40万级新能源SUV之王？',
    platform: '知乎',
    status: 'published',
    externalUrl: 'https://zhihu.com/xxx',
    publishTime: '2024-01-05 14:30',
    metrics: { views: 1250, likes: 45, shares: 12 },
  },
  {
    id: '2',
    contentTitle: '理想L9 vs 蔚来ES8：谁是40万级新能源SUV之王？',
    platform: '今日头条',
    status: 'pending',
    publishTime: null,
    metrics: null,
  },
  {
    id: '3',
    contentTitle: '理想汽车增程式技术解析',
    platform: '知乎',
    status: 'failed',
    errorMessage: '内容审核未通过',
    publishTime: null,
    metrics: null,
  },
];

export default function Distribution() {
  const [showConnectModal, setShowConnectModal] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
            <CheckCircle2 className="w-3 h-3" />
            已发布
          </span>
        );
      case 'pending':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">
            <Clock className="w-3 h-3" />
            发布中
          </span>
        );
      case 'failed':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">
            <XCircle className="w-3 h-3" />
            失败
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">分发网络</h2>
          <p className="text-gray-500 mt-1">
            一键分发内容到各大高权重平台
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Share2 className="w-4 h-4" />
          创建分发任务
        </button>
      </div>

      {/* Platform Accounts */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">平台账号</h3>
          <button 
            onClick={() => setShowConnectModal(true)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            绑定新账号
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {platforms.map(platform => (
            <div 
              key={platform.id} 
              className={`p-4 rounded-xl border transition-colors ${
                platform.connected 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 ${platform.color} rounded-lg flex items-center justify-center text-white font-bold`}>
                  {platform.icon}
                </div>
                {platform.connected ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : (
                  <button className="text-sm text-blue-600 hover:text-blue-700">绑定</button>
                )}
              </div>
              <p className="font-medium text-gray-900">{platform.name}</p>
              <p className="text-xs text-gray-500">
                {platform.connected ? '已连接' : '未连接'}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Distribution List */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">分发记录</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {mockDistributions.map(dist => (
            <div key={dist.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-medium text-gray-900">{dist.contentTitle}</h4>
                    {getStatusBadge(dist.status)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>平台: {dist.platform}</span>
                    {dist.publishTime && <span>发布时间: {dist.publishTime}</span>}
                    {dist.errorMessage && (
                      <span className="text-red-500">错误: {dist.errorMessage}</span>
                    )}
                  </div>
                  {dist.metrics && (
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <span className="text-gray-600">阅读量: {dist.metrics.views}</span>
                      <span className="text-gray-600">点赞: {dist.metrics.likes}</span>
                      <span className="text-gray-600">分享: {dist.metrics.shares}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {dist.externalUrl && (
                    <a 
                      href={dist.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <ExternalLink className="w-4 h-4" />
                      查看
                    </a>
                  )}
                  {dist.status === 'failed' && (
                    <button className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg">
                      重试
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Connect Modal */}
      {showConnectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">绑定平台账号</h3>
            <div className="space-y-3">
              {platforms.filter(p => !p.connected).map(platform => (
                <button
                  key={platform.id}
                  className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                >
                  <div className={`w-10 h-10 ${platform.color} rounded-lg flex items-center justify-center text-white font-bold`}>
                    {platform.icon}
                  </div>
                  <span className="font-medium text-gray-900">{platform.name}</span>
                </button>
              ))}
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowConnectModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
