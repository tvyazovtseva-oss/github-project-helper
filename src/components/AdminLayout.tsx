import { NavLink, Outlet } from 'react-router-dom';
import {
  Users, Mail, Package, BarChart3, Workflow, Heart,
  Settings, CreditCard, Bell, BookOpen, Sparkles
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/products', icon: CreditCard, label: 'Продукты' },
  { to: '/notifications', icon: Bell, label: 'Уведомления' },
  { to: '/broadcasts', icon: Mail, label: 'Рассылки' },
  { to: '/users', icon: Users, label: 'Пользователи' },
  { to: '/funnels', icon: Workflow, label: 'Автоворонки' },
  { to: '/analytics', icon: BarChart3, label: 'Аналитика' },
  { to: '/lms', icon: BookOpen, label: 'Уроки (LMS)' },
  { to: '/content-gen', icon: Sparkles, label: 'Контент-генератор' },
];

export default function AdminLayout() {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-secondary text-sidebar-foreground flex flex-col shrink-0 z-10">
        <div className="p-6 border-b border-sidebar-border">
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span className="bg-gradient-to-br from-pink-500 to-rose-500 text-transparent bg-clip-text">Anna MAMA</span>
            <span className="text-sm font-normal bg-sidebar-accent px-2 py-0.5 rounded-full text-sidebar-foreground">PRO</span>
          </h1>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto no-scrollbar">
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                    : 'hover:bg-sidebar-accent hover:text-white'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium text-sm">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-sidebar-border text-sm flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">А</div>
          <div className="overflow-hidden">
            <p className="text-white font-medium truncate">Администратор</p>
            <p className="text-sidebar-foreground text-xs truncate">admin@annamama.ru</p>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-background">
        <Outlet />
      </main>
    </div>
  );
}
