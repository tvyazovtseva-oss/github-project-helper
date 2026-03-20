import { useState } from 'react';
import {
  Mail, Send, Search, Eye, Clock, CheckCircle2,
  MessageSquare, Bell, Info, X
} from 'lucide-react';

const MOCK_HISTORY = [
  { id: 18612116, productName: 'Клуб Anna MAMA', title: 'Блоггинг - тлг', transport: 'Telegram', status: 'viewed', sentAt: '17.03.2024, 12:00', user: { name: 'Мария Иванова', email: 'masha@mail.ru' }, fullText: 'Привет, Мария! Сегодня начинаем модуль по блоггингу.' },
  { id: 18612115, productName: 'Клуб Anna MAMA', title: 'Блоггинг - почта', transport: 'Email', status: 'delivered', sentAt: '17.03.2024, 11:30', user: { name: 'Елена Кузнецова', email: 'elena@gmail.com' }, fullText: 'Подтверждаем вашу регистрацию на интенсив.' },
  { id: 18368591, productName: 'Закаливание 2024', title: 'Окончание доступа', transport: 'Push', status: 'viewed', sentAt: '16.03.2024, 10:00', user: { name: 'Ольга Смирнова', email: 'olga_s@ya.ru' }, fullText: 'Доступ к курсу заканчивается через 3 дня.' },
];

export default function BroadcastsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<any>(null);

  const filtered = MOCK_HISTORY.filter(item =>
    `${item.id} ${item.user.name} ${item.title}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <header className="bg-card border-b border-border px-8 py-5 flex items-center justify-between shrink-0">
        <h2 className="text-2xl font-bold">Рассылки и мониторинг</h2>
        <button className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors">
          <Send className="w-4 h-4" /> Новая рассылка
        </button>
      </header>

      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Search */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Поиск по ID, имени, теме..." className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium" />
            </div>
          </div>

          {/* History */}
          <div className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border">
              <h3 className="font-black text-lg">История отправок</h3>
            </div>
            <div className="divide-y divide-border">
              {filtered.map(item => (
                <div key={item.id} onClick={() => setSelectedMessage(item)} className="p-6 flex items-center justify-between hover:bg-muted/30 transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.status === 'viewed' ? 'bg-green-50 text-green-500' : 'bg-blue-50 text-blue-500'}`}>
                      {item.transport === 'Email' ? <Mail className="w-5 h-5" /> : item.transport === 'Telegram' ? <MessageSquare className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-bold text-sm">{item.title}</p>
                      <p className="text-[10px] text-muted-foreground">{item.user.name} • {item.productName} • {item.transport}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">{item.sentAt}</p>
                    <span className={`text-[10px] font-bold uppercase ${item.status === 'viewed' ? 'text-green-600' : 'text-blue-600'}`}>
                      {item.status === 'viewed' ? 'Прочитано' : 'Доставлено'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Message detail modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-secondary/60 backdrop-blur-sm" onClick={() => setSelectedMessage(null)} />
          <div className="bg-card w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-8 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600"><Info className="w-6 h-6" /></div>
                <div>
                  <h2 className="text-xl font-black leading-none">Детали #{selectedMessage.id}</h2>
                  <p className="text-xs text-muted-foreground mt-1 uppercase font-black tracking-widest">{selectedMessage.title}</p>
                </div>
              </div>
              <button onClick={() => setSelectedMessage(null)} className="p-3 bg-muted rounded-full text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-8 overflow-y-auto space-y-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-2xl border border-border">
                  <div className="text-[10px] text-muted-foreground font-black uppercase mb-2">Статус</div>
                  <div className="flex items-center gap-2 font-bold text-sm">
                    {selectedMessage.status === 'viewed' ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Clock className="w-4 h-4 text-blue-500" />}
                    {selectedMessage.status === 'viewed' ? 'Просмотрено' : 'Доставлено'}
                  </div>
                </div>
                <div className="p-4 bg-muted rounded-2xl border border-border">
                  <div className="text-[10px] text-muted-foreground font-black uppercase mb-2">Канал</div>
                  <div className="font-bold text-sm">{selectedMessage.transport}</div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Текст</div>
                <div className="p-6 bg-blue-50/30 rounded-3xl border border-blue-50 text-sm leading-relaxed italic">«{selectedMessage.fullText}»</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
