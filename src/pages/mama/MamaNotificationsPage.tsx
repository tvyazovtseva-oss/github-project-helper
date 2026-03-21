import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, BookOpen, Syringe, GraduationCap, CreditCard, Check, Trash2, Archive } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';

interface Notification {
  id: number;
  title: string;
  desc: string;
  time: string;
  read: boolean;
  archived: boolean;
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
  { id: 1, title: 'Новый вебинар через час', desc: 'Подключайтесь к прямому эфиру с педиатром', time: 'Только что', read: false, archived: false, source: 'course', link: '/mama/courses/club_main' },
  { id: 2, title: 'План вакцинации обновлен', desc: 'Добавлена дата прививки «Пентаксим»', time: '2 часа назад', read: false, archived: false, source: 'health', link: '/mama/health' },
  { id: 3, title: 'Новый гайд: Сон без слёз', desc: 'Авторская методика в библиотеке', time: 'Вчера', read: false, archived: false, source: 'library', link: '/mama/library' },
  { id: 4, title: 'Подписка истекает', desc: 'Клуб Аннамама — осталось 3 дня', time: '3 дня назад', read: true, archived: false, source: 'payment', link: '/mama/profile' },
  { id: 5, title: 'Урок 5 доступен', desc: 'Курс «Сон малыша» — новый модуль', time: '4 дня назад', read: true, archived: false, source: 'course', link: '/mama/courses/course_sleep' },
  { id: 6, title: 'Чекап: Стоматолог', desc: 'Рекомендован осмотр в 12 месяцев', time: '5 дней назад', read: true, archived: false, source: 'health', link: '/mama/health' },
];

type Tab = 'new' | 'archive';

export default function MamaNotificationsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState<Tab>('new');
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  const unreadCount = notifications.filter(n => !n.read && !n.archived).length;

  const visibleNotifs = useMemo(() => {
    if (activeTab === 'new') return notifications.filter(n => !n.archived);
    return notifications.filter(n => n.archived);
  }, [notifications, activeTab]);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const archiveNotif = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, archived: true, read: true } : n));
  };

  const confirmDelete = () => {
    if (deleteTarget !== null) {
      setNotifications(prev => prev.filter(n => n.id !== deleteTarget));
      setDeleteTarget(null);
    }
  };

  return (
    <div className="pb-6 animate-fade-in">
      {/* Header */}
      <div className="px-4 pt-5 pb-2 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink-900" style={{ lineHeight: '1.15' }}>Уведомления</h1>
          {unreadCount > 0 && <p className="text-sm text-ink-400 mt-1">{unreadCount} новых</p>}
        </div>
        {unreadCount > 0 && activeTab === 'new' && (
          <button onClick={markAllRead} className="flex items-center gap-1 text-xs font-bold text-brand-500 active:scale-95 transition-transform">
            <Check className="w-3.5 h-3.5" /> Прочитать все
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-4 mb-4">
        <button
          onClick={() => setActiveTab('new')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${activeTab === 'new' ? 'bg-ink-900 text-white' : 'bg-surface-100 text-ink-400'}`}
        >
          Новые {unreadCount > 0 && (
            <span className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full bg-brand-500 text-white text-[9px] font-bold">
              {unreadCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('archive')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${activeTab === 'archive' ? 'bg-ink-900 text-white' : 'bg-surface-100 text-ink-400'}`}
        >
          Архив
        </button>
      </div>

      {/* List */}
      <div className="px-4 space-y-2">
        {visibleNotifs.map(n => {
          const Icon = ICON_MAP[n.source];
          const color = COLOR_MAP[n.source];
          return (
            <div
              key={n.id}
              className={`flex items-start gap-3 p-4 rounded-2xl transition-all ${
                n.read ? 'bg-surface-50' : 'bg-surface-50 ring-1 ring-brand-200'
              }`}
            >
              <button
                onClick={() => { markRead(n.id); navigate(n.link); }}
                className="flex items-start gap-3 flex-1 min-w-0 text-left"
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

              {/* Actions */}
              <div className="flex flex-col gap-1 shrink-0 mt-0.5">
                {!n.archived && (
                  <button
                    onClick={() => archiveNotif(n.id)}
                    className="p-1.5 rounded-lg hover:bg-surface-200 transition-colors"
                    title="В архив"
                  >
                    <Archive className="w-3.5 h-3.5 text-ink-300" />
                  </button>
                )}
                <button
                  onClick={() => setDeleteTarget(n.id)}
                  className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors"
                  title="Удалить"
                >
                  <Trash2 className="w-3.5 h-3.5 text-ink-300" />
                </button>
              </div>
            </div>
          );
        })}

        {visibleNotifs.length === 0 && (
          <div className="text-center py-16">
            {activeTab === 'new' ? (
              <>
                <Bell className="w-10 h-10 mx-auto mb-3 text-ink-200" />
                <p className="text-sm font-bold text-ink-400">Нет новых уведомлений</p>
              </>
            ) : (
              <>
                <Archive className="w-10 h-10 mx-auto mb-3 text-ink-200" />
                <p className="text-sm font-bold text-ink-400">Архив пуст</p>
              </>
            )}
          </div>
        )}
      </div>

      {/* Delete confirmation dialog */}
      <Dialog open={deleteTarget !== null} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
        <DialogContent className="sm:max-w-xs rounded-3xl text-center">
          <DialogHeader>
            <DialogTitle className="text-center">Удалить уведомление?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-ink-400 -mt-2">Это действие нельзя отменить.</p>
          <DialogFooter className="flex-row justify-center gap-3 pt-2">
            <DialogClose asChild>
              <button className="flex-1 px-4 py-2.5 text-sm font-bold text-ink-400 bg-surface-100 rounded-xl">
                Отмена
              </button>
            </DialogClose>
            <button
              onClick={confirmDelete}
              className="flex-1 px-4 py-2.5 bg-destructive text-white text-sm font-bold rounded-xl active:scale-95 transition-transform"
            >
              Удалить
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
