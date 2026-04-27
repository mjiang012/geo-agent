import { useEffect } from 'react';
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
  Plus
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

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 fixed h-full z-10">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">GEO</span>
            </div>
            <span className="font-semibold text-gray-900">Agent</span>
          </div>
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
                <span className="font-medium text-gray-900 text-sm">
                  {currentBrand?.name || '选择品牌'}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
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
                    <span className="text-sm text-gray-700">{brand.name}</span>
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
        <nav className="p-4 space-y-1">
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
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <h1 className="text-xl font-semibold text-gray-900">
            {menuItems.find(item => item.path === location.pathname)?.label || '仪表盘'}
          </h1>
          
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-gray-600 font-medium text-sm">U</span>
              </div>
              <span className="text-sm font-medium text-gray-700">用户</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
