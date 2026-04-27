'use client';

import React, { useState } from "react";
import { Sparkles, FileText, Lightbulb, Download } from "lucide-react";

export function Generate() {
  const [topic, setTopic] = useState<string>("");
  const [contentType, setContentType] = useState<string>("article");
  const [generating, setGenerating] = useState<boolean>(false);
  const [generatedContent, setGeneratedContent] = useState<any>(null);

  const handleGenerate = async () => {
    setGenerating(true);
    // Simulate API call
    setTimeout(() => {
      setGeneratedContent({
        title: `理解 ${topic}：完整指南`,
        content: `[关于 ${topic} 的生成文章，带有优化的 RAG 结构...]`,
        questions: [
          `什么是 ${topic}，为什么重要？`,
          `如何在我的业务中实现 ${topic}？`,
          `关于 ${topic} 的最佳实践有哪些？`,
          `${topic} 与其他替代方案相比如何？`,
        ],
        keywords: [topic, "优化", "最佳实践", "指南"],
        ragScore: Math.floor(Math.random() * 20) + 80,
      });
      setGenerating(false);
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">内容生成</h1>
        <p className="text-gray-600 mt-2">为您的主题生成优化的内容和长尾问题</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Panel */}
        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">生成设置</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">主题</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="输入您的主题..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">内容类型</label>
                <select
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="article">文章</option>
                  <option value="blog-post">博客文章</option>
                  <option value="faq">FAQ 页面</option>
                  <option value="guide">操作指南</option>
                  <option value="whitepaper">白皮书</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">行业（可选）</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                  <option value="">选择行业</option>
                  <option value="technology">科技</option>
                  <option value="marketing">营销</option>
                  <option value="healthcare">医疗</option>
                  <option value="finance">金融</option>
                  <option value="education">教育</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">目标长度</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                  <option value="500">短篇（500 字）</option>
                  <option value="1000">中篇（1000 字）</option>
                  <option value="2000">长篇（2000 字）</option>
                  <option value="3000">全面（3000+ 字）</option>
                </select>
              </div>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!topic || generating}
            className="w-full btn-primary flex items-center justify-center space-x-2"
          >
            {generating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                <span>生成中...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>生成内容</span>
              </>
            )}
          </button>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-6">
          {generatedContent ? (
            <div className="space-y-6">
              {/* Generated Content */}
              <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-6 h-6 text-primary-600" />
                    <h3 className="text-lg font-semibold text-gray-900">{generatedContent.title}</h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                      RAG 评分：{generatedContent.ragScore}
                    </span>
                    <button className="btn-secondary flex items-center space-x-2">
                      <Download className="w-4 h-4" />
                      <span>导出</span>
                    </button>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-wrap">{generatedContent.content}</p>
                </div>
              </div>

              {/* Keywords */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">目标关键词</h3>
                <div className="flex flex-wrap gap-2">
                  {generatedContent.keywords.map((keyword: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              {/* Generated Questions */}
              <div className="card p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Lightbulb className="w-6 h-6 text-amber-500" />
                  <h3 className="text-lg font-semibold text-gray-900">长尾问题</h3>
                </div>
                <div className="space-y-3">
                  {generatedContent.questions.map((question: string, index: number) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-900 font-medium">{question}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span>搜索量：中等</span>
                        <span>•</span>
                        <span>竞争度：低</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="card p-12 text-center">
              <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">输入一个主题并点击「生成内容」开始</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
