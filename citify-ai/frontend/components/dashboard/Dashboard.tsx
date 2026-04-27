'use client';

import React, { useState } from "react";
import { TrendingUp, Users, Zap, Eye, BarChart3, FileText } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Mock data
const mockData = [
  { month: "1月", citations: 400, aiTraffic: 240 },
  { month: "2月", citations: 300, aiTraffic: 139 },
  { month: "3月", citations: 500, aiTraffic: 380 },
  { month: "4月", citations: 450, aiTraffic: 290 },
  { month: "5月", citations: 600, aiTraffic: 490 },
  { month: "6月", citations: 700, aiTraffic: 590 },
];

export function Dashboard() {
  const [selectedKeyword, setSelectedKeyword] = useState<string>("");

  const stats = [
    { name: "总引用量", value: "1,247", change: "+12.5%", icon: TrendingUp },
    { name: "AI 流量占比", value: "24.3%", change: "+8.2%", icon: Users },
    { name: "活跃关键词", value: "48", change: "+3", icon: Zap },
    { name: "平均 RAG 评分", value: "82.5", change: "+5.1", icon: Eye },
  ];

  const recentKeywords = [
    { keyword: "AI 内容优化", citations: 123, score: 88, trend: "up" },
    { keyword: "生成式 AI 最佳实践", citations: 98, score: 76, trend: "up" },
    { keyword: "2024 内容营销趋势", citations: 76, score: 92, trend: "down" },
    { keyword: "AI 搜索引擎 SEO", citations: 65, score: 81, trend: "up" },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-1">{stat.change}</p>
                </div>
                <div className="p-3 bg-primary-50 rounded-lg">
                  <Icon className="w-6 h-6 text-primary-600" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">引用量趋势</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Line type="monotone" dataKey="citations" stroke="#0ea5e9" strokeWidth={2} />
                <Line type="monotone" dataKey="aiTraffic" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">表现最佳关键词</h3>
          <div className="space-y-4">
            {recentKeywords.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{item.keyword}</p>
                  <p className="text-sm text-gray-500">{item.citations} 次引用</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="font-semibold text-primary-600">{item.score}</p>
                    <p className="text-xs text-gray-500">RAG 评分</p>
                  </div>
                  {item.trend === "up" ? (
                    <TrendingUp className="w-5 h-5 text-green-500" />
                  ) : (
                    <TrendingUp className="w-5 h-5 text-red-500 transform rotate-180" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">快速操作</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="btn-primary flex items-center justify-center space-x-2">
            <Zap className="w-5 h-5" />
            <span>添加新关键词</span>
          </button>
          <button className="btn-secondary flex items-center justify-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>分析内容</span>
          </button>
          <button className="btn-secondary flex items-center justify-center space-x-2">
            <BarChart3 className="w-5 h-5" />
            <span>查看报告</span>
          </button>
        </div>
      </div>
    </div>
  );
}
