import { useState } from 'react';
import { Stethoscope, Search, Clock, User, ChevronRight, Send, Sparkles, FileText } from 'lucide-react';

const MOCK_TICKETS = [
  { id: 1, mamaName: 'Елена С.', childName: 'Артём, 8 мес', topic: 'Ночные пробуждения', status: 'open', lastMessage: '10 мин назад', unread: 2 },
  { id: 2, mamaName: 'Мария П.', childName: 'Даша, 1.5 года', topic: 'Аллергия на прикорм', status: 'open', lastMessage: '1 час назад', unread: 0 },
  { id: 3, mamaName: 'Анна И.', childName: 'Миша, 3 мес', topic: 'Колики и газики', status: 'closed', lastMessage: 'вчера', unread: 0 },
];

export default function DoctorTicketsPage() {
  const [tickets] = useState(MOCK_TICKETS);
  const [selectedTicket, setSelectedTicket] = useState<typeof MOCK_TICKETS[0] | null>(null);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');

  const filtered = tickets.filter(t => t.mamaName.toLowerCase().includes(search.toLowerCase()) || t.topic.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex h-full animate-fade-in">
      {/* Ticket list */}
      <div className="w-80 border-r border-surface-200 bg-white flex flex-col shrink-0">
        <div className="p-4 border-b border-surface-200">
          <div className="flex items-center gap-2 mb-3">
            <Stethoscope className="w-5 h-5 text-brand-500" />
            <h2 className="font-bold text-ink-900">Тикеты</h2>
            <span className="ml-auto text-xs font-bold bg-brand-50 text-brand-500 px-2 py-0.5 rounded-full">{tickets.filter(t => t.status === 'open').length}</span>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-ink-300" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Поиск..." className="w-full pl-8 pr-3 py-2 bg-surface-50 rounded-xl text-xs outline-none focus:bg-white focus:ring-2 focus:ring-brand-500/10 transition-all" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {filtered.map(t => (
            <button
              key={t.id}
              onClick={() => setSelectedTicket(t)}
              className={`w-full text-left p-4 border-b border-surface-100 transition-all ${selectedTicket?.id === t.id ? 'bg-brand-50' : 'hover:bg-surface-50'}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold text-ink-900">{t.mamaName}</span>
                {t.unread > 0 && <span className="w-5 h-5 bg-brand-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">{t.unread}</span>}
              </div>
              <p className="text-xs text-ink-500 truncate">{t.topic}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[10px] text-ink-300">{t.childName}</span>
                <span className="text-[10px] text-ink-300">{t.lastMessage}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {selectedTicket ? (
          <>
            <div className="px-6 py-4 border-b border-surface-200 bg-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-ink-900">{selectedTicket.mamaName} — {selectedTicket.topic}</h3>
                <p className="text-xs text-ink-400">{selectedTicket.childName}</p>
              </div>
              <div className="flex gap-2">
                <button className="flex items-center gap-1.5 px-3 py-2 bg-surface-50 rounded-xl text-xs font-bold text-ink-500 hover:bg-surface-100 transition-colors">
                  <Sparkles className="w-3 h-3 text-brand-500" /> AI-сводка
                </button>
                <button className="flex items-center gap-1.5 px-3 py-2 bg-surface-50 rounded-xl text-xs font-bold text-ink-500 hover:bg-surface-100 transition-colors">
                  <FileText className="w-3 h-3" /> Медкарта
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-3">
              <div className="flex justify-start">
                <div className="max-w-[70%] px-4 py-3 bg-surface-100 rounded-2xl rounded-bl-md text-sm text-ink-900">
                  Здравствуйте, доктор! Артём просыпается 5 раз за ночь, что делать?
                  <p className="text-[10px] text-ink-300 mt-1">10:30</p>
                </div>
              </div>
              <div className="flex justify-end">
                <div className="max-w-[70%] px-4 py-3 bg-brand-500 rounded-2xl rounded-br-md text-sm text-white">
                  Здравствуйте! Расскажите подробнее о режиме дня. Во сколько укладываете?
                  <p className="text-[10px] text-white/60 mt-1">10:32</p>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-surface-200 bg-white">
              <div className="flex items-center gap-3">
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Написать ответ..."
                  className="flex-1 px-4 py-3 bg-surface-50 rounded-2xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-brand-500/10 transition-all"
                />
                <button className="p-3 bg-brand-500 text-white rounded-full active:scale-90 transition-transform">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-ink-300">
              <Stethoscope className="w-12 h-12 mx-auto mb-3 text-ink-200" />
              <p className="font-bold">Выберите тикет</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
