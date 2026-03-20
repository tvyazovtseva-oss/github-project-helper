import { useState } from 'react';
import { Bell, Plus, Clock, Mail, MessageCircle, Smartphone, Trash2, ChevronDown } from 'lucide-react';

interface NotificationStep {
  id: string;
  delay: string;
  channel: string;
  title: string;
  message: string;
}

const INITIAL_CHAIN: NotificationStep[] = [
  { id: '1', delay: '0 мин', channel: 'push', title: 'Добро пожаловать!', message: 'Спасибо за регистрацию в Anna MAMA' },
  { id: '2', delay: '1 час', channel: 'email', title: 'Как начать?', message: 'Пройдите первый урок бесплатно' },
  { id: '3', delay: '1 день', channel: 'telegram', title: 'Не забудьте!', message: 'У вас есть 3 дня бесплатного доступа' },
  { id: '4', delay: '3 дня', channel: 'push', title: 'Скидка -20%', message: 'Специальное предложение истекает сегодня' },
];

const CHANNEL_ICONS: Record<string, typeof Mail> = { email: Mail, telegram: MessageCircle, push: Smartphone };
const CHANNEL_COLORS: Record<string, string> = { email: 'text-amber-500 bg-amber-50', telegram: 'text-blue-500 bg-blue-50', push: 'text-ink-500 bg-surface-100' };

export default function AdminNotificationsPage() {
  const [chain, setChain] = useState(INITIAL_CHAIN);

  const handleAdd = () => {
    setChain([...chain, { id: Date.now().toString(), delay: '1 час', channel: 'push', title: 'Новое уведомление', message: '' }]);
  };

  const handleUpdate = (id: string, updates: Partial<NotificationStep>) => {
    setChain(chain.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const handleDelete = (id: string) => setChain(chain.filter(s => s.id !== id));

  return (
    <div className="p-6 lg:p-8 max-w-4xl animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-ink-900">Уведомления</h1>
            <Bell className="w-5 h-5 text-brand-500" />
          </div>
          <p className="text-sm text-ink-400 mt-1">Цепочка автоматических уведомлений</p>
        </div>
        <button onClick={handleAdd} className="flex items-center gap-2 px-5 py-3 bg-ink-900 text-white rounded-2xl text-sm font-bold active:scale-[0.97] transition-transform">
          <Plus className="w-4 h-4" /> Добавить шаг
        </button>
      </div>

      {/* Timeline */}
      <div className="space-y-0">
        {chain.map((step, i) => {
          const Icon = CHANNEL_ICONS[step.channel] || Smartphone;
          const colorClass = CHANNEL_COLORS[step.channel] || CHANNEL_COLORS.push;
          return (
            <div key={step.id} className="relative pl-8">
              {/* Timeline line */}
              {i < chain.length - 1 && (
                <div className="absolute left-[15px] top-10 bottom-0 w-[2px] bg-surface-200" />
              )}
              {/* Dot */}
              <div className={`absolute left-0 top-3 w-8 h-8 rounded-full flex items-center justify-center ${colorClass}`}>
                <Icon className="w-4 h-4" />
              </div>

              <div className="bg-white rounded-2xl border border-surface-200 p-5 mb-4 ml-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3 text-ink-300" />
                    <select value={step.delay} onChange={(e) => handleUpdate(step.id, { delay: e.target.value })} className="text-xs font-bold text-ink-500 bg-surface-50 border-none rounded-lg px-2 py-1 outline-none">
                      <option>0 мин</option><option>30 мин</option><option>1 час</option><option>6 часов</option><option>1 день</option><option>3 дня</option><option>7 дней</option>
                    </select>
                    <select value={step.channel} onChange={(e) => handleUpdate(step.id, { channel: e.target.value })} className="text-xs font-bold text-ink-500 bg-surface-50 border-none rounded-lg px-2 py-1 outline-none">
                      <option value="push">Push</option><option value="email">Email</option><option value="telegram">Telegram</option>
                    </select>
                  </div>
                  <button onClick={() => handleDelete(step.id)} className="p-1.5 text-ink-300 hover:text-destructive rounded-lg transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <input
                  value={step.title}
                  onChange={(e) => handleUpdate(step.id, { title: e.target.value })}
                  className="w-full text-sm font-bold text-ink-900 mb-2 outline-none bg-transparent"
                  placeholder="Заголовок"
                />
                <textarea
                  value={step.message}
                  onChange={(e) => handleUpdate(step.id, { message: e.target.value })}
                  className="w-full text-sm text-ink-500 outline-none bg-transparent resize-none"
                  placeholder="Текст сообщения..."
                  rows={2}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
