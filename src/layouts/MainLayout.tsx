import { useEffect, useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Search, 
  Brain, 
  Target, 
  FileText, 
  Share2, 
  BarChart3, 
  Settings,
  Bell,
  ChevronDown,
  Plus,
  Menu,
  X
} from 'lucide-react';
import { useBrandStore } from '../stores/brandStore';

const menuItems = [
  { path: '/', icon: LayoutDashboard, label: '仪表盘' },
  { path: '/keywords', icon: Search, label: '热词管理' },
  { path: '/diagnosis', icon: BarChart3, label: '诊断中心' },
  { path: '/ai-analysis', icon: Brain, label: 'AI偏好分析' },
  { path: '/strategy', icon: Target, label: '优化策略' },
  { path: '/content', icon: FileText, label: '内容生产' },
  { path: '/distribution', icon: Share2, label: '分发网络' },
  { path: '/monitoring', icon: BarChart3, label: '效果监控' },
  { path: '/settings', icon: Settings, label: '设置' },
];

export default function MainLayout() {
  const location = useLocation();
  const { brands, currentBrand, fetchBrands, setCurrentBrand } = useBrandStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-white border-r border-gray-200 h-full
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 lg:px-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">GEO</span>
            </div>
            <span className="font-semibold text-gray-900">Agent</span>
          </div>
          {/* Close button for mobile */}
          <button 
            className="lg:hidden p-2 text-gray-400 hover:text-gray-600"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Brand Selector */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-medium text-xs">
                    {currentBrand?.name?.charAt(0) || 'B'}
                  </span>
                </div>
                <span className="font-medium text-gray-900 text-sm truncate max-w-[120px]">
                  {currentBrand?.name || '选择品牌'}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
            </button>
            
            {/* Dropdown */}
            {brands.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 hidden group-hover:block">
                {brands.map(brand => (
                  <button
                    key={brand.id}
                    onClick={() => setCurrentBrand(brand)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 text-left"
                  >
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-medium text-xs">
                        {brand.name.charAt(0)}
                      </span>
                    </div>
                    <span className="text-sm text-gray-700 truncate">{brand.name}</span>
                  </button>
                ))}
                <div className="border-t border-gray-100 p-2">
                  <button className="w-full flex items-center gap-2 p-2 text-sm text-blue-600 hover:bg-blue-50 rounded">
                    <Plus className="w-4 h-4" />
                    添加品牌
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-200px)]">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0 lg:ml-0">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <button 
              className="lg:hidden p-2 -ml-2 text-gray-600 hover:text-gray-900"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-lg lg:text-xl font-semibold text-gray-900 truncate">
              {menuItems.find(item => item.path === location.pathname)?.label || '仪表盘'}
            </h1>
          </div>
          
          <div className="flex items-center gap-2 lg:gap-4">
            {/* Notifications */}
            <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User */}
            <div className="flex items-center gap-2 lg:gap-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-gray-600 font-medium text-sm">U</span>
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:block">用户</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
