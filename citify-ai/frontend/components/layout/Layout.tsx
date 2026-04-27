'use client';

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, FileText, Zap, Sparkles, Settings, Table } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: "仪表板", href: "/dashboard", icon: BarChart3 },
  { name: "数据展示", href: "/data", icon: Table },
  { name: "内容分析", href: "/analyze", icon: FileText },
  { name: "内容优化", href: "/optimize", icon: Zap },
  { name: "内容生成", href: "/generate", icon: Sparkles },
];

export function Layout({ children }: LayoutProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="flex">
        <div className="w-64 min-h-screen bg-white border-r border-gray-200">
          <div className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Citify AI</h1>
            </div>
          </div>
          
          <nav className="px-4">
            <ul className="space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? "bg-primary-50 text-primary-700"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1">
          {/* Header */}
          <header className="bg-white border-b border-gray-200 px-8 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {navigation.find((item) => item.href === pathname)?.name || "仪表板"}
              </h2>
              <button className="btn-secondary">
                <Settings className="w-5 h-5 inline mr-2" />
                设置
              </button>
            </div>
          </header>

          {/* Page content */}
          <main className="p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
