import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, BookOpen, Syringe, GraduationCap, CreditCard, Check } from 'lucide-react';

interface Notification {
  id: number;
  title: string;
  desc: string;
  time: string;
  read: boolean;
  source: 'course' | 'health' | 'library' | 'payment';
  link: string;
}

const ICON_MAP = {
  course: GraduationCap,
  health: Syringe,
  library: BookOpen,
  payment: CreditCard,
};

const COLOR_MAP = {
  course: '#5856D6',
  health: '#FF9500',
  library: '#34C759',
  payment: '#FF2D55',
};

const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: 1, title: 'Новый вебинар через час', desc: 'Подключайтесь к прямому эфиру с педиатром', time: 'Только что', read: false, source: 'course', link: '/mama/courses/club_main' },
  { id: 2, title: 'План вакцинации обновлен', desc: 'Добавлена дата прививки «Пентаксим»', time: '2 часа назад', read: false, source: 'health', link: '/mama/health' },
  { id: 3, title: 'Новый гайд: Сон без слёз', desc: 'Авторская методика в библиотеке', time: 'Вчера', read: false, source: 'library', link: '/mama/library' },
  { id: 4, title: 'Подписка истекает', desc: 'Клуб Аннамама — осталось 3 дня', time: '3 дня назад', read: true, source: 'payment', link: '/mama/profile' },
  { id: 5, title: 'Урок 5 доступен', desc: 'Курс «Сон малыша» — новый модуль', time: '4 дня назад', read: true, source: 'course', link: '/mama/courses/course_sleep' },
  { id: 6, title: 'Чекап: Стоматолог', desc: 'Рекомендован осмотр в 12 месяцев', time: '5 дней назад', read: true, source: 'health', link: '/mama/health' },
];

export default function MamaNotificationsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="pb-6 animate-fade-in">
      <div className="px-4 pt-5 pb-2 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink-900" style={{ lineHeight: '1.15' }}>Уведомления</h1>
          {unreadCount > 0 && <p className="text-sm text-ink-400 mt-1">{unreadCount} новых</p>}
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="flex items-center gap-1 text-xs font-bold text-brand-500 active:scale-95 transition-transform">
            <Check className="w-3.5 h-3.5" /> Прочитать все
          </button>
        )}
      </div>

      <div className="px-4 mt-3 space-y-2">
        {notifications.map(n => {
          const Icon = ICON_MAP[n.source];
          const color = COLOR_MAP[n.source];
          return (
            <button
              key={n.id}
              onClick={() => {
                setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x));
                navigate(n.link);
              }}
              className={`w-full flex items-start gap-3 p-4 rounded-2xl text-left active:scale-[0.98] transition-transform ${
                n.read ? 'bg-surface-50' : 'bg-surface-50 ring-1 ring-brand-200'
              }`}
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: color + '15' }}>
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-bold text-sm text-ink-900">{n.title}</p>
                  {!n.read && <span className="w-2 h-2 bg-brand-500 rounded-full shrink-0 mt-1.5" />}
                </div>
                <p className="text-xs text-ink-400 mt-0.5">{n.desc}</p>
                <p className="text-[10px] text-ink-300 mt-1">{n.time}</p>
              </div>
            </button>
          );
        })}

        {notifications.length === 0 && (
          <div className="text-center py-16">
            <Bell className="w-10 h-10 mx-auto mb-3 text-ink-200" />
            <p className="text-sm font-bold text-ink-400">Нет уведомлений</p>
          </div>
        )}
      </div>
    </div>
  );
}
