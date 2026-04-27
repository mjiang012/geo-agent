'use client';

import React, { useState } from 'react';
import { Zap, Database, BookOpen, CheckCircle2 } from 'lucide-react';

export function Optimize() {
  const [content, setContent] = useState('');
  const [optimizing, setOptimizing] = useState(false);
  const [optimizedContent, setOptimizedContent] = useState('');
  const [selectedOptions, setSelectedOptions] = useState({
    addData: true,
    addQuotes: true,
    improveStructure: true,
  });

  const handleOptimize = async () => {
    setOptimizing(true);
    setTimeout(() => {
      setOptimizedContent(content + '\n\n[优化后的内容将出现在这里，包含增强数据、引用和更好的结构]');
      setOptimizing(false);
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">内容优化</h1>
        <p className="text-gray-600 mt-2">使用数据、引用和更好的结构优化您的内容</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">优化选项</h3>
            <div className="space-y-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedOptions.addData}
                  onChange={(e) => setSelectedOptions({ ...selectedOptions, addData: e.target.checked })}
                  className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                />
                <div className="flex items-center space-x-2">
                  <Database className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">添加行业数据</p>
                    <p className="text-sm text-gray-500">插入相关统计数据和信息</p>
                  </div>
                </div>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedOptions.addQuotes}
                  onChange={(e) => setSelectedOptions({ ...selectedOptions, addQuotes: e.target.checked })}
                  className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                />
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">添加专家引用</p>
                    <p className="text-sm text-gray-500">插入来自专家的引用</p>
                  </div>
                </div>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedOptions.improveStructure}
                  onChange={(e) => setSelectedOptions({ ...selectedOptions, improveStructure: e.target.checked })}
                  className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                />
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">改善结构</p>
                    <p className="text-sm text-gray-500">优化标题和格式</p>
                  </div>
                </div>
              </label>
            </div>
          </div>

          <button
            onClick={handleOptimize}
            disabled={!content || optimizing}
            className="w-full btn-primary flex items-center justify-center space-x-2"
          >
            {optimizing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                <span>优化中...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>优化内容</span>
              </>
            )}
          </button>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">原始内容</h3>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="在此粘贴您要优化的内容..."
                className="w-full h-96 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">优化后的内容</h3>
              <div className="w-full h-96 p-4 border border-gray-300 rounded-lg bg-gray-50 overflow-auto">
                {optimizedContent ? (
                  <p className="text-gray-700 whitespace-pre-wrap">{optimizedContent}</p>
                ) : (
                  <p className="text-gray-400 text-center mt-16">优化后的内容将出现在这里...</p>
                )}
              </div>
              {optimizedContent && (
                <div className="flex justify-end space-x-3 mt-4">
                  <button className="btn-secondary">预览</button>
                  <button className="btn-primary">导出</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}