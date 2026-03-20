import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  User, Baby, Edit3, ChevronRight, Calendar, Settings, Bell, BellOff,
  CreditCard, Plus, Crown, Check, Ruler, Weight
} from 'lucide-react';
import GrowthChart from '@/components/GrowthChart';

const CHILDREN = [
  { id: 'child_1', name: 'София', birthdate: '2024-01-15', gender: 'girl' as const, active: true },
  { id: 'child_2', name: 'Даниил', birthdate: '2022-06-10', gender: 'boy' as const, active: false },
];

const NOTIFICATION_SETTINGS = [
  { key: 'courses', label: 'Обновления курсов', push: true, email: true },
  { key: 'health', label: 'Медицинские напоминания', push: true, email: false },
  { key: 'webinars', label: 'Вебинары и эфиры', push: true, email: true },
  { key: 'promo', label: 'Акции и предложения', push: false, email: false },
];

const SUBSCRIPTIONS = [
  { id: 'club_main', name: 'Клуб Anna MAMA', status: 'active' as const, expires: '24.04.2026', price: '2 990 ₽/мес', color: '#FF2D55' },
  { id: 'club_woman', name: 'Женская Среда', status: 'active' as const, expires: '12.05.2026', price: '1 990 ₽/мес', color: '#AF52DE' },
  { id: 'course_first_aid', name: 'Первая Помощь', status: 'lifetime' as const, expires: '', price: 'Навсегда', color: '#FF9500' },
  { id: 'course_sleep', name: 'Сон малыша', status: 'active' as const, expires: '01.03.2026', price: '4 990 ₽', color: '#5856D6' },
];

const TABS = ['Профиль', 'Дети', 'Уведомления', 'Подписки'];

export default function MamaProfilePage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('Профиль');
  const [notifSettings, setNotifSettings] = useState(NOTIFICATION_SETTINGS);
  const [selectedChild, setSelectedChild] = useState(CHILDREN[0]);

  const toggleNotif = (key: string, type: 'push' | 'email') => {
    setNotifSettings(prev => prev.map(n =>
      n.key === key ? { ...n, [type]: !n[type] } : n
    ));
  };

  return (
    <div className="pb-6 animate-fade-in">
      {/* User header */}
      <div className="px-4 pt-6 pb-4 text-center">
        <div className="w-20 h-20 rounded-full bg-brand-100 flex items-center justify-center mx-auto mb-3">
          <User className="w-8 h-8 text-brand-500" />
        </div>
        <h2 className="text-lg font-bold text-ink-900">{user?.full_name}</h2>
        <p className="text-sm text-ink-400">{user?.email}</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-4 mb-4 overflow-x-auto no-scrollbar">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === tab ? 'bg-ink-900 text-white' : 'bg-surface-100 text-ink-400'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="px-4">
        {/* Profile tab */}
        {activeTab === 'Профиль' && (
          <div className="space-y-3 animate-fade-in">
            <ProfileCard icon={User} label="Имя" value={user?.full_name || ''} editable />
            <ProfileCard icon={Settings} label="Email" value={user?.email || ''} />
            <ProfileCard icon={Calendar} label="Дата регистрации" value="15 января 2024" />
            <button
              onClick={logout}
              className="w-full mt-6 py-3 text-destructive font-bold text-sm bg-destructive/5 rounded-2xl active:scale-[0.97] transition-transform"
            >
              Выйти из аккаунта
            </button>
          </div>
        )}

        {/* Children tab */}
        {activeTab === 'Дети' && (
          <div className="animate-fade-in">
            <div className="space-y-2 mb-4">
              {CHILDREN.map(child => (
                <button
                  key={child.id}
                  onClick={() => setSelectedChild(child)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all active:scale-[0.98] ${
                    selectedChild.id === child.id ? 'bg-brand-50 ring-1 ring-brand-200' : 'bg-surface-50'
                  }`}
                >
                  <div className="w-11 h-11 rounded-full bg-brand-100 flex items-center justify-center shrink-0">
                    <Baby className="w-5 h-5 text-brand-500" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-bold text-sm text-ink-900">{child.name}</p>
                    <p className="text-xs text-ink-400">{new Date(child.birthdate).toLocaleDateString('ru')} · {child.gender === 'girl' ? 'Девочка' : 'Мальчик'}</p>
                  </div>
                  {selectedChild.id === child.id && <Check className="w-5 h-5 text-brand-500" />}
                </button>
              ))}
            </div>
            <button className="w-full flex items-center justify-center gap-2 p-3 bg-surface-100 rounded-2xl text-sm font-bold text-ink-400 active:scale-[0.98] transition-transform">
              <Plus className="w-4 h-4" /> Добавить ребёнка
            </button>
          </div>
        )}

        {/* Notifications tab */}
        {activeTab === 'Уведомления' && (
          <div className="space-y-3 animate-fade-in">
            {notifSettings.map(n => (
              <div key={n.key} className="p-4 bg-surface-50 rounded-2xl">
                <p className="font-bold text-sm text-ink-900 mb-3">{n.label}</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => toggleNotif(n.key, 'push')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      n.push ? 'bg-ink-900 text-white' : 'bg-surface-200 text-ink-400'
                    }`}
                  >
                    {n.push ? <Bell className="w-3.5 h-3.5" /> : <BellOff className="w-3.5 h-3.5" />}
                    Push
                  </button>
                  <button
                    onClick={() => toggleNotif(n.key, 'email')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      n.email ? 'bg-ink-900 text-white' : 'bg-surface-200 text-ink-400'
                    }`}
                  >
                    {n.email ? <Bell className="w-3.5 h-3.5" /> : <BellOff className="w-3.5 h-3.5" />}
                    Email
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Subscriptions tab */}
        {activeTab === 'Подписки' && (
          <div className="space-y-3 animate-fade-in">
            {SUBSCRIPTIONS.map(sub => (
              <div key={sub.id} className="p-4 bg-surface-50 rounded-2xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: sub.color + '15' }}>
                    <Crown className="w-4 h-4" style={{ color: sub.color }} />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm text-ink-900">{sub.name}</p>
                    <p className="text-[10px] text-ink-400">
                      {sub.status === 'lifetime' ? 'Бессрочная' : `До ${sub.expires}`}
                    </p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    sub.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {sub.status === 'active' ? 'Активна' : 'Навсегда'}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-surface-200">
                  <span className="text-xs font-bold text-ink-500">{sub.price}</span>
                  {sub.status === 'active' && (
                    <button className="text-xs font-bold text-brand-500 active:scale-95 transition-transform">
                      Продлить
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProfileCard({ icon: Icon, label, value, editable }: { icon: typeof User; label: string; value: string; editable?: boolean }) {
  return (
    <div className="flex items-center gap-4 p-4 bg-surface-50 rounded-2xl">
      <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-brand-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-ink-300 uppercase font-bold tracking-wider">{label}</p>
        <p className="text-sm font-bold text-ink-900 truncate">{value}</p>
      </div>
      {editable ? <Edit3 className="w-4 h-4 text-ink-200" /> : <ChevronRight className="w-4 h-4 text-ink-200" />}
    </div>
  );
}
