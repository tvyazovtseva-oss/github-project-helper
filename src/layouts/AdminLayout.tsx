import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Heart, Users, Mail, Workflow, BarChart3,
  BookOpen, Settings, CreditCard, Bell, Layers,
  LogOut, Menu, X, Stethoscope, MessageCircle
} from 'lucide-react';

const ADMIN_NAV = [
  { to: '/admin', end: true, icon: BarChart3, label: 'Аналитика' },
  { to: '/admin/tickets', icon: MessageCircle, label: 'Тикеты' },
  { to: '/admin/users', icon: Users, label: 'База мам' },
  { to: '/admin/broadcasts', icon: Mail, label: 'Рассылки' },
  { to: '/admin/funnels', icon: Workflow, label: 'Автоворонки' },
  { to: '/admin/lessons', icon: BookOpen, label: 'Редактор уроков' },
  { to: '/admin/access', icon: Settings, label: 'Настройка доступа' },
  { to: '/admin/notifications', icon: Bell, label: 'Уведомления' },
  { to: '/admin/content', icon: Layers, label: 'Фабрика контента' },
  { to: '/admin/payments', icon: CreditCard, label: 'Платежи' },
];

const DOCTOR_NAV = [
  { to: '/doctor', end: true, icon: Stethoscope, label: 'Тикеты' },
];

interface AdminLayoutProps {
  role?: 'admin' | 'doctor';
}

export default function AdminLayout({ role = 'admin' }: AdminLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = role === 'doctor' ? DOCTOR_NAV : ADMIN_NAV;
  const config = {
    title: role === 'doctor' ? 'Врач' : 'Admin',
    badge: role === 'doctor' ? 'MD' : 'PRO',
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-surface-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-ink-900 text-white flex flex-col transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-brand-500 fill-brand-500" />
            <span className="text-xl font-bold">Anna MAMA</span>
            <span className="text-[10px] font-bold bg-white/10 px-2 py-0.5 rounded-full text-white/60">{config.badge}</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 hover:bg-white/10 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto no-scrollbar">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm ${
                  isActive
                    ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20 font-bold'
                    : 'text-white/60 hover:bg-white/5 hover:text-white font-medium'
                }`
              }
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold text-sm">
              {user?.full_name?.[0] || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.full_name}</p>
              <p className="text-xs text-white/40 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-white/50 hover:text-white hover:bg-white/5 rounded-xl text-sm font-medium transition-all"
          >
            <LogOut className="w-4 h-4" />
            Выйти
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-surface-200 bg-white">
          <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-surface-100 rounded-xl">
            <Menu className="w-5 h-5 text-ink-900" />
          </button>
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-brand-500 fill-brand-500" />
            <span className="font-bold text-ink-900">Anna MAMA</span>
          </div>
          <div className="ml-auto w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold text-xs">
            {user?.full_name?.[0] || 'U'}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
