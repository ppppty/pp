import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Calendar, FileText, CheckSquare, Settings, BarChart3, Shield, LogOut, MapPin } from 'lucide-react';

export default function Layout() {
  const { isAdmin, logout } = useStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { to: '/', icon: Calendar, label: '排期日历' },
    { to: '/submit', icon: FileText, label: '排期提报' },
    { to: '/review', icon: CheckSquare, label: '审核管理', admin: true },
    { to: '/config', icon: Settings, label: '配置管理', admin: true },
    { to: '/dashboard', icon: BarChart3, label: '数据看板' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top navbar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <MapPin size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-900">景点频道页资源位排期</h1>
              <p className="text-[10px] text-gray-400 -mt-0.5">可视化排期管理系统</p>
            </div>
          </div>
          <div>
            {isAdmin ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
              >
                <LogOut size={14} /> 退出
              </button>
            ) : (
              <button
                onClick={() => navigate('/review')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-brand-600 bg-brand-50 rounded-lg hover:bg-brand-100 transition-colors"
              >
                <Shield size={14} /> 管理员模式
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-4 flex gap-4">
        {/* Sidebar */}
        <nav className="w-48 shrink-0">
          <div className="bg-white rounded-xl border border-gray-200 p-2 sticky top-20">
            {navItems.map((item) => {
              const Icon = item.icon;
              if (item.admin && !isAdmin) return null;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mb-0.5 last:mb-0 ${
                      isActive
                        ? 'bg-brand-50 text-brand-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`
                  }
                >
                  <Icon size={16} />
                  {item.label}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
