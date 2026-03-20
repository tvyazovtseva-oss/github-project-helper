import { useState } from 'react';
import { Send, Plus, Mail, Smartphone, BarChart2, ArrowRight, Trash2, Users, AlertCircle, X } from 'lucide-react';

const INITIAL_BROADCASTS = [
  { id: 1, title: 'Анонс вебинара по прикорму', date: '15.04.2024 10:00', status: 'sent' as const, sent: 1240, openRate: '42%', clickRate: '15%', channels: ['email', 'telegram'] },
  { id: 2, title: 'Скидка на гайд: Сон', date: '01.05.2024 12:00', status: 'draft' as const, sent: 0, openRate: '-', clickRate: '-', channels: ['push'] },
];

export default function AdminBroadcastsPage() {
  const [broadcasts, setBroadcasts] = useState(INITIAL_BROADCASTS);
  const [isAdding, setIsAdding] = useState(false);
  const [newBroadcast, setNewBroadcast] = useState({ title: '', channels: [] as string[] });

  const toggleChannel = (ch: string) => {
    setNewBroadcast(prev => ({
      ...prev,
      channels: prev.channels.includes(ch) ? prev.channels.filter(c => c !== ch) : [...prev.channels, ch],
    }));
  };

  const handleCreate = () => {
    if (!newBroadcast.title.trim()) return;
    setBroadcasts([{ id: Date.now(), title: newBroadcast.title, date: new Date().toLocaleDateString('ru'), status: 'draft', sent: 0, openRate: '-', clickRate: '-', channels: newBroadcast.channels }, ...broadcasts]);
    setNewBroadcast({ title: '', channels: [] });
    setIsAdding(false);
  };

  const handleDelete = (id: number) => setBroadcasts(broadcasts.filter(b => b.id !== id));

  return (
    <div className="p-6 lg:p-8 max-w-6xl animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-ink-900">Рассылки</h1>
            <Send className="w-5 h-5 text-brand-500" />
          </div>
          <p className="text-sm text-ink-400 mt-1">Разовые массовые уведомления по всем каналам</p>
        </div>
        <button onClick={() => setIsAdding(true)} className="flex items-center gap-2 px-6 py-3 bg-ink-900 text-white rounded-2xl text-sm font-bold shadow-lg hover:bg-black transition-all active:scale-[0.97]">
          <Plus className="w-4 h-4" /> Создать рассылку
        </button>
      </div>

      {/* New broadcast modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" onClick={() => setIsAdding(false)} />
          <div className="relative bg-white rounded-3xl p-6 w-full max-w-md animate-scale-in">
            <h3 className="text-lg font-bold text-ink-900 mb-4">Новая рассылка</h3>
            <input
              value={newBroadcast.title}
              onChange={(e) => setNewBroadcast({ ...newBroadcast, title: e.target.value })}
              placeholder="Заголовок рассылки"
              className="admin-input mb-4"
            />
            <p className="text-xs font-bold text-ink-400 mb-2">Каналы</p>
            <div className="flex gap-2 mb-6">
              {[
                { id: 'email', icon: Mail, label: 'Email' },
                { id: 'telegram', icon: Send, label: 'TG' },
                { id: 'push', icon: Smartphone, label: 'Push' },
              ].map(ch => (
                <button
                  key={ch.id}
                  onClick={() => toggleChannel(ch.id)}
                  className={`flex-1 flex flex-col items-center p-3 rounded-xl border transition-all ${
                    newBroadcast.channels.includes(ch.id) ? 'bg-brand-50 border-brand-500 text-brand-500' : 'bg-surface-50 border-surface-200 text-ink-400'
                  }`}
                >
                  <ch.icon className="w-4 h-4 mb-1" />
                  <span className="text-[10px] font-bold">{ch.label}</span>
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setIsAdding(false)} className="flex-1 py-3 text-sm font-bold text-ink-400 bg-surface-100 rounded-2xl">Отмена</button>
              <button onClick={handleCreate} className="flex-1 py-3 text-sm font-bold text-white bg-ink-900 rounded-2xl">Создать</button>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-surface-200 p-5">
          <div className="flex items-center gap-2 mb-2 text-ink-400">
            <BarChart2 className="w-4 h-4" />
            <span className="text-xs font-bold">Отправлено за месяц</span>
          </div>
          <p className="text-2xl font-bold text-ink-900">14 500</p>
          <p className="text-xs text-emerald-500 font-bold flex items-center gap-1 mt-1"><ArrowRight className="w-3 h-3 -rotate-45" /> +12% к марту</p>
        </div>
        <div className="bg-white rounded-2xl border border-surface-200 p-5">
          <p className="text-xs font-bold text-ink-400 mb-3">Сводная база (подписы)</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between"><span className="flex items-center gap-2 text-xs text-ink-500"><Smartphone className="w-3 h-3" /> Push</span><span className="text-xs font-bold">8 400</span></div>
            <div className="flex items-center justify-between"><span className="flex items-center gap-2 text-xs text-blue-500"><Send className="w-3 h-3" /> Telegram</span><span className="text-xs font-bold">4 200</span></div>
            <div className="flex items-center justify-between"><span className="flex items-center gap-2 text-xs text-amber-500"><Mail className="w-3 h-3" /> Email</span><span className="text-xs font-bold">11 100</span></div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-ink-900 to-ink-800 rounded-2xl p-5 text-white relative overflow-hidden">
          <h4 className="font-bold text-sm mb-1">Обновите базу подписчиков</h4>
          <p className="text-xs text-white/60 mb-3">Экспортируйте сегмент из CRM</p>
          <button className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-xl text-xs font-bold hover:bg-white/20 transition-colors">
            <Users className="w-3 h-3" /> Сегменты
          </button>
          <AlertCircle className="w-24 h-24 absolute -right-4 -bottom-4 text-white/5" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-surface-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-surface-200">
          <h3 className="font-bold text-ink-900">История рассылок</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-ink-400 border-b border-surface-200">
              <th className="text-left px-6 py-3 font-bold text-xs">Название</th>
              <th className="text-left px-6 py-3 font-bold text-xs hidden md:table-cell">Каналы</th>
              <th className="text-right px-6 py-3 font-bold text-xs hidden md:table-cell">OR / CR</th>
              <th className="text-right px-6 py-3 font-bold text-xs">Статус</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {broadcasts.map(b => (
              <tr key={b.id} className="border-t border-surface-100 hover:bg-surface-50/50">
                <td className="px-6 py-4 font-bold text-ink-900">{b.title}</td>
                <td className="px-6 py-4 hidden md:table-cell">
                  <div className="flex gap-1">
                    {b.channels.map(ch => <span key={ch} className="text-[10px] bg-surface-100 px-2 py-0.5 rounded-full font-bold text-ink-400">{ch}</span>)}
                  </div>
                </td>
                <td className="px-6 py-4 text-right text-xs text-ink-500 hidden md:table-cell">{b.openRate} / {b.clickRate}</td>
                <td className="px-6 py-4 text-right">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${b.status === 'sent' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                    {b.status === 'sent' ? 'Отправлено' : 'Черновик'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button onClick={() => handleDelete(b.id)} className="p-2 text-ink-300 hover:text-destructive hover:bg-destructive/5 rounded-xl transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
