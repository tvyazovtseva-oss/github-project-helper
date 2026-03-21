import { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Home, BookOpen, User, Bell, X, Zap,
  Users, GraduationCap, Stethoscope, LogOut
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  color: string;
  type: 'subscription' | 'course';
  expires?: string;
  progress?: number;
}

const PRODUCTS: Product[] = [
  { id: 'club_main', name: 'Клуб Аннамама', color: '#FF2D55', type: 'subscription', expires: '24.04.2026' },
  { id: 'club_woman', name: 'Женская Среда', color: '#AF52DE', type: 'subscription', expires: '12.05.2026' },
  { id: 'course_first_aid', name: 'Первая Помощь', color: '#FF9500', type: 'course', progress: 65 },
  { id: 'course_sleep', name: 'Сон малыша', color: '#5856D6', type: 'course', progress: 30 },
];

const NAV_ITEMS = [
  { to: '/mama', end: true, icon: Home, label: 'Главная' },
  { to: '/mama/courses', icon: GraduationCap, label: 'Курсы' },
  { to: '/mama/health', icon: Stethoscope, label: 'Медкарта', isCenter: true },
  { to: '/mama/library', icon: BookOpen, label: 'Знания' },
];

export default function MamaLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeProduct, setActiveProduct] = useState(PRODUCTS[0]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div
      className="flex flex-col lg:flex-row h-screen bg-white relative"
      style={{ ['--product-color' as string]: activeProduct.color }}
    >
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 xl:w-72 border-r border-surface-200/50 bg-surface-50 shrink-0">
        {/* Logo */}
        <div className="p-5 border-b border-surface-200/50">
          <button onClick={() => navigate('/mama')} className="flex items-center gap-2 w-full">
            <span className="text-xl font-bold text-brand-500">Аннамама</span>
          </button>
        </div>

        {/* Sidebar nav */}
        <nav className="flex-1 py-4 px-3 space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-white shadow-sm text-ink-900'
                    : 'text-ink-400 hover:text-ink-600 hover:bg-white/50'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className="w-5 h-5"
                    style={{ color: isActive ? activeProduct.color : undefined }}
                  />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User footer */}
        <div className="p-4 border-t border-surface-200/50">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/mama/profile')}
              className="flex items-center gap-3 flex-1 min-w-0 rounded-xl p-1.5 -m-1.5 hover:bg-white/60 transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-brand-500" />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-bold text-ink-900 truncate">{user?.full_name}</p>
                <p className="text-[10px] text-ink-400 truncate">{user?.email}</p>
              </div>
            </button>
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl text-ink-300 hover:text-ink-600 hover:bg-white/60 transition-colors shrink-0"
              title="Выйти"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top header */}
        <header className="flex items-center justify-between px-4 lg:px-6 py-3 bg-white/80 glass sticky top-0 z-30 border-b border-surface-200/50">
          {/* Mobile: brand */}
          <button onClick={() => navigate('/mama')} className="flex items-center gap-1.5 lg:hidden">
            <span className="text-lg font-bold text-brand-500">Аннамама</span>
          </button>

          {/* Desktop: page title */}
          <div className="hidden lg:block">
            <h1 className="text-lg font-bold text-ink-900">
              {NAV_ITEMS.find(n => {
                if (n.end) return location.pathname === n.to;
                return location.pathname.startsWith(n.to);
              })?.label || 'Аннамама'}
            </h1>
          </div>

          <button
            onClick={() => navigate('/mama/notifications')}
            className="p-2 -mr-2 relative rounded-full active:bg-black/5 transition-all"
          >
            <Bell className="w-5 h-5 text-ink-900" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-500 rounded-full" />
          </button>
        </header>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          <div className="max-w-2xl mx-auto lg:py-2">
            <Outlet />
          </div>
        </div>

        {/* Bottom nav — mobile only */}
        <nav className="flex lg:hidden items-center justify-around px-2 py-2 border-t border-surface-200/50 bg-white/90 glass safe-bottom">
          {NAV_ITEMS.map((item, i) => {
            if (item.isCenter) {
              return (
                <NavLink
                  key={i}
                  to={item.to}
                  className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform"
                  style={{ backgroundColor: activeProduct.color }}
                >
                  <Zap className="w-6 h-6 text-white fill-white" />
                </NavLink>
              );
            }
            return (
              <NavLink
                key={i}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 px-3 py-1 transition-all active:scale-90 ${isActive ? '' : 'opacity-50'}`
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon
                      className="w-6 h-6 transition-all duration-300"
                      style={{ color: isActive ? activeProduct.color : '#86868B' }}
                    />
                    <span
                      className="text-[10px] font-semibold"
                      style={{ color: isActive ? activeProduct.color : '#86868B' }}
                    >
                      {item.label}
                    </span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Product Picker (shared mobile+desktop) */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex items-end lg:items-center lg:justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setIsMenuOpen(false)} />
          <div className="relative w-full max-w-md mx-auto bg-white rounded-t-3xl lg:rounded-3xl p-6 animate-slide-up max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <span className="font-bold text-ink-900">Мои продукты</span>
              <button onClick={() => setIsMenuOpen(false)} className="p-2 bg-surface-100 rounded-full">
                <X className="w-4 h-4 text-ink-400" />
              </button>
            </div>
            <div className="space-y-3">
              {PRODUCTS.map(item => (
                <button
                  key={item.id}
                  onClick={() => { setActiveProduct(item); setIsMenuOpen(false); }}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${activeProduct.id === item.id ? 'bg-surface-50' : 'active:scale-[0.98]'}`}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: item.color + '15' }}>
                    {item.type === 'subscription' ? <Users className="w-5 h-5" style={{ color: item.color }} /> : <GraduationCap className="w-5 h-5" style={{ color: item.color }} />}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-bold text-ink-900 text-sm">{item.name}</p>
                    <p className="text-xs text-ink-400">
                      {item.expires ? `Доступ до: ${item.expires}` : `Прогресс: ${item.progress}%`}
                    </p>
                  </div>
                  {activeProduct.id === item.id && (
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
