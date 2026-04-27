'use client';

import React, { useState } from "react";
import { Upload, FileText, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";

export function Analyze() {
  const [content, setContent] = useState<string>("");
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [results, setResults] = useState<any>(null);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    // Simulate API call
    setTimeout(() => {
      setResults({
        wordCount: content.split(" ").length,
        paragraphCount: content.split("\n\n").length,
        ragScore: Math.floor(Math.random() * 40) + 50,
        keywords: ["AI", "内容", "优化", "GEO", "RAG"],
        suggestions: [
          "添加更多数据和统计信息",
          "改善标题结构",
          "添加专家引用",
          "自然增加关键词密度",
        ],
      });
      setAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">内容分析</h1>
        <p className="text-gray-600 mt-2">分析您的内容，提升 RAG 友好度和 GEO 优化潜力</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">您的内容</h3>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="在此粘贴您要分析的内容..."
              className="w-full h-80 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            />
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-4">
                <button className="btn-secondary flex items-center space-x-2">
                  <Upload className="w-4 h-4" />
                  <span>上传文件</span>
                </button>
                <button className="btn-secondary flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>选择模板</span>
                </button>
              </div>
              <button
                onClick={handleAnalyze}
                disabled={!content || analyzing}
                className="btn-primary flex items-center space-x-2"
              >
                {analyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    <span>分析中...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>分析内容</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {results ? (
            <div className="space-y-6">
              {/* RAG Score */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">RAG 评分</h3>
                <div className="flex items-center justify-center">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full border-8 border-primary-100 flex items-center justify-center">
                      <span className="text-4xl font-bold text-primary-600">{results.ragScore}</span>
                    </div>
                  </div>
                </div>
                <p className="text-center text-gray-600 mt-4">
                  {results.ragScore >= 80
                    ? "优秀！您的内容 RAG 优化得很好"
                    : results.ragScore >= 60
                    ? "还有提升空间"
                    : "需要大幅优化"}
                </p>
              </div>

              {/* Content Metrics */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">内容统计</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">字数</p>
                    <p className="text-2xl font-bold text-gray-900">{results.wordCount}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">段落数</p>
                    <p className="text-2xl font-bold text-gray-900">{results.paragraphCount}</p>
                  </div>
                </div>
              </div>

              {/* Keywords */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">检测到的关键词</h3>
                <div className="flex flex-wrap gap-2">
                  {results.keywords.map((keyword: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              {/* Suggestions */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">优化建议</h3>
                <div className="space-y-3">
                  {results.suggestions.map((suggestion: string, index: number) => (
                    <div key={index} className="flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-700">{suggestion}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="card p-12 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">添加内容并点击「分析内容」查看结果</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
