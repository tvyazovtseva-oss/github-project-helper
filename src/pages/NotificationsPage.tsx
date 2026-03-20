import { useState } from 'react';
import {
  Settings, Save, Plus, Trash2, Bell, Mail, Send,
  Smartphone, Clock, Calendar, Edit3,
  Image as ImageIcon, PlayCircle, Paperclip, Smile, Info
} from 'lucide-react';

const defaultNotifications = [
  { id: 'notif_1', label: 'Напоминание 1', active: true, channels: ['email'], offset: 7, unit: 'days', sendTime: '10:00', text: 'Здравствуйте, {name}! Напоминаем, что до конца доступа к "{product}" осталось {offset} дней.', media: null },
  { id: 'notif_2', label: 'Напоминание 2', active: true, channels: ['telegram', 'email'], offset: 3, unit: 'days', sendTime: '10:00', text: 'Привет, {name}! ⚡️ Всего {offset} дня осталось до закрытия доступа к "{product}".', media: { type: 'image', url: 'reminder_3days.jpg' } },
  { id: 'notif_3', label: 'Напоминание 3', active: true, channels: ['telegram', 'push'], offset: 1, unit: 'days', sendTime: '10:00', text: '{name}, внимание! Доступ к "{product}" истекает завтра ({expiry_date}).', media: null },
  { id: 'notif_4', label: 'В день окончания', active: true, channels: ['telegram', 'push', 'email'], offset: 0, unit: 'days', sendTime: '10:00', text: 'Сегодня последний день участия в "{product}".', media: null },
  { id: 'notif_5', label: 'Финальный час', active: true, channels: ['push', 'telegram'], offset: 1, unit: 'hours', sendTime: 'immediate', text: '⚠️ Финальный отсчет! Доступ к "{product}" закроется через 1 час.', media: { type: 'video_note', url: 'last_chance.mp4' } }
];

export default function NotificationsPage() {
  const [selectedProductId, setSelectedProductId] = useState(1);
  const [products, setProducts] = useState([
    { id: 1, name: 'Клуб Anna MAMA', color: '#f43f5e', notifications: JSON.parse(JSON.stringify(defaultNotifications)) },
    { id: 2, name: 'Курс "Первый прикорм"', color: '#10b981', notifications: JSON.parse(JSON.stringify(defaultNotifications)).map((n: any) => ({ ...n, active: n.offset <= 1 })) }
  ]);

  const activeProduct = products.find(p => p.id === selectedProductId) || products[0];

  const updateNotification = (notifId: string, updates: any) => {
    setProducts(prev => prev.map(p => {
      if (p.id === selectedProductId) {
        return { ...p, notifications: p.notifications.map((n: any) => n.id === notifId ? { ...n, ...updates } : n) };
      }
      return p;
    }));
  };

  const toggleChannel = (notifId: string, channel: string) => {
    const notif = activeProduct.notifications.find((n: any) => n.id === notifId);
    if (!notif) return;
    const newChannels = notif.channels.includes(channel) ? notif.channels.filter((c: string) => c !== channel) : [...notif.channels, channel];
    updateNotification(notifId, { channels: newChannels });
  };

  const variableDocs = [
    { tag: '{name}', desc: 'Имя пользователя' },
    { tag: '{product}', desc: 'Название продукта' },
    { tag: '{offset}', desc: 'Кол-во дней/часов' },
    { tag: '{price}', desc: 'Сумма к оплате' },
    { tag: '{expiry_date}', desc: 'Дата окончания' },
    { tag: '{pay_link}', desc: 'Ссылка на оплату' },
  ];

  return (
    <>
      <header className="bg-card border-b border-border px-8 py-5 flex items-center justify-between shrink-0">
        <h2 className="text-2xl font-bold">Уведомления</h2>
        <button className="p-3 bg-foreground text-card rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all">
          <Save className="w-5 h-5" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
        {/* Product selector */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {products.map(p => (
            <button
              key={p.id}
              onClick={() => setSelectedProductId(p.id)}
              className={`px-4 py-3 rounded-2xl border text-xs font-black transition-all whitespace-nowrap flex items-center gap-2 ${selectedProductId === p.id ? 'bg-foreground border-foreground text-card shadow-md' : 'bg-muted border-border text-muted-foreground hover:border-foreground/30'}`}
            >
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
              {p.name}
            </button>
          ))}
        </div>

        {/* Variables reference */}
        <section className="bg-gray-900 rounded-[2rem] p-6 text-white shadow-2xl">
          <div className="flex items-center gap-2 mb-4 text-blue-400">
            <Info className="w-4 h-4" />
            <h3 className="text-[10px] font-black uppercase tracking-widest">Переменные для шаблонов</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2">
            {variableDocs.map(v => (
              <div key={v.tag} className="flex items-center justify-between border-b border-white/10 pb-1">
                <code className="text-blue-300 font-mono text-[9px] font-bold">{v.tag}</code>
                <span className="text-[9px] text-gray-400 font-medium truncate ml-2">{v.desc}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Notification cards */}
        <section className="space-y-6 pb-20">
          <h2 className="text-sm font-black uppercase tracking-tighter px-2 flex items-center gap-2">
            <Bell className="w-4 h-4" /> Уведомления: {activeProduct.name}
          </h2>

          {activeProduct.notifications.map((n: any) => (
            <div key={n.id} className={`p-6 bg-card rounded-[2.5rem] border transition-all ${n.active ? 'border-border shadow-sm' : 'border-dashed border-border opacity-60'}`}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${n.active ? 'bg-foreground text-card shadow-lg rotate-3' : 'bg-muted text-muted-foreground'}`}>
                    {n.unit === 'days' ? <Calendar className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                  </div>
                  <div>
                    <span className="font-black text-sm block tracking-tight">
                      {n.offset === 0 ? 'В день завершения' : `За ${n.offset} ${n.unit === 'days' ? 'дн.' : 'час.'}`}
                    </span>
                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Сценарий отправки</span>
                  </div>
                </div>
                <button onClick={() => updateNotification(n.id, { active: !n.active })} className={`w-12 h-6 rounded-full relative transition-all ${n.active ? 'bg-green-500' : 'bg-muted-foreground/30'}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${n.active ? 'left-7' : 'left-1'}`} />
                </button>
              </div>

              {n.active && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-2xl border border-border">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Срок ({n.unit === 'days' ? 'дн' : 'час'})
                      </label>
                      <input type="number" value={n.offset} onChange={(e) => updateNotification(n.id, { offset: parseInt(e.target.value) || 0 })} className="w-full bg-card border border-border rounded-xl px-3 py-2 text-xs font-black focus:ring-2 ring-foreground outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Время отправки
                      </label>
                      <input type="time" disabled={n.sendTime === 'immediate'} value={n.sendTime === 'immediate' ? '' : n.sendTime} onChange={(e) => updateNotification(n.id, { sendTime: e.target.value })} className="w-full bg-card border border-border rounded-xl px-3 py-2 text-xs font-black focus:ring-2 ring-foreground outline-none transition-all disabled:opacity-50" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Текст сообщения</label>
                    <textarea value={n.text} onChange={(e) => updateNotification(n.id, { text: e.target.value })} className="admin-input min-h-[110px] text-xs font-bold leading-relaxed shadow-inner" />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Медиа</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button className="flex flex-col items-center justify-center p-4 border border-border rounded-2xl hover:bg-muted transition-all gap-2 group">
                        <ImageIcon className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                        <span className="text-[8px] font-black text-muted-foreground group-hover:text-foreground uppercase">Баннер</span>
                      </button>
                      <button className="flex flex-col items-center justify-center p-4 border border-border rounded-2xl hover:bg-muted transition-all gap-2 group">
                        <PlayCircle className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                        <span className="text-[8px] font-black text-muted-foreground group-hover:text-foreground uppercase">Видео</span>
                      </button>
                    </div>
                    {n.media && (
                      <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Paperclip className="w-3 h-3 text-blue-500" />
                          <span className="text-[10px] font-bold text-blue-700">{n.media.url}</span>
                        </div>
                        <Trash2 onClick={() => updateNotification(n.id, { media: null })} className="w-4 h-4 text-red-300 hover:text-red-500 cursor-pointer transition-colors" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Каналы</label>
                    <div className="flex gap-2">
                      {[
                        { id: 'telegram', icon: Send, label: 'Telegram' },
                        { id: 'email', icon: Mail, label: 'Email' },
                        { id: 'push', icon: Smartphone, label: 'Push' }
                      ].map(channel => (
                        <button
                          key={channel.id}
                          onClick={() => toggleChannel(n.id, channel.id)}
                          className={`flex-1 py-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${n.channels.includes(channel.id) ? 'bg-foreground border-foreground text-card shadow-lg scale-105' : 'bg-card border-border text-muted-foreground'}`}
                        >
                          <channel.icon className="w-3 h-3" />
                          <span className="text-[9px] font-black">{channel.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </section>
      </div>
    </>
  );
}
