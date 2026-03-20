import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Heart, Home, BookOpen, User, Bell, ChevronDown, X, Zap,
  Users, GraduationCap, PlusCircle, Stethoscope
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
  { id: 'club_main', name: 'Клуб Anna MAMA', color: '#FF2D55', type: 'subscription', expires: '24.04.2026' },
  { id: 'club_woman', name: 'Женская Среда', color: '#AF52DE', type: 'subscription', expires: '12.05.2026' },
  { id: 'course_first_aid', name: 'Первая Помощь', color: '#FF9500', type: 'course', progress: 65 },
  { id: 'course_sleep', name: 'Сон малыша', color: '#5856D6', type: 'course', progress: 30 },
];

const NAV_ITEMS = [
  { to: '/mama', end: true, icon: Home, label: 'Главная' },
  { to: '/mama/courses', icon: GraduationCap, label: 'Курсы' },
  { to: '/mama/health', icon: Stethoscope, label: '', isCenter: true },
  { to: '/mama/library', icon: BookOpen, label: 'Знания' },
  { to: '/mama/profile', icon: User, label: 'Профиль' },
];

export default function MamaLayout() {
  const navigate = useNavigate();
  const [activeProduct, setActiveProduct] = useState(PRODUCTS[0]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-white max-w-md mx-auto relative" style={{ ['--product-color' as string]: activeProduct.color }}>
      {/* Top header */}
      <header className="flex items-center justify-between px-4 py-3 bg-white/80 glass sticky top-0 z-30 border-b border-surface-200/50">
        <button onClick={() => setIsMenuOpen(true)} className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: activeProduct.color }} />
          <span className="text-sm font-bold text-ink-900">{activeProduct.name}</span>
          <ChevronDown className="w-3 h-3 text-ink-400" />
        </button>
        <button
          onClick={() => navigate('/mama/notifications')}
          className="p-2 -mr-2 relative rounded-full active:bg-black/5 transition-all"
        >
          <Bell className="w-5 h-5 text-ink-900" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-500 rounded-full" />
        </button>
      </header>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <Outlet />
      </div>

      {/* Bottom nav — 5 items with center accent */}
      <nav className="flex items-center justify-around px-2 py-2 border-t border-surface-200/50 bg-white/90 glass safe-bottom">
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

      {/* Product Picker */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div className="absolute inset-0 bg-black/30" onClick={() => setIsMenuOpen(false)} />
          <div className="relative w-full max-w-md mx-auto bg-white rounded-t-3xl p-6 animate-slide-up max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-brand-500 fill-brand-500" />
                <span className="font-bold text-ink-900">Мои продукты</span>
              </div>
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
            <button className="w-full py-4 mt-4 bg-ink-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg">
              <PlusCircle className="w-5 h-5" />
              Новые продукты
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
