import { useState } from 'react';
import { Search, Filter, Users } from 'lucide-react';

const MOCK_USERS = [
  { id: 1, name: 'Елена Смирнова', email: 'elena.s@mail.ru', phone: '+7 (999) 123-45-67', ltv: 15400, clubStatus: 'active', clubExpiry: '2026-04-15', tags: ['vip', 'гайд_сон'] },
  { id: 2, name: 'Анна Иванова', email: 'anna.iv@gmail.com', phone: '+7 (903) 987-65-43', ltv: 3200, clubStatus: 'inactive', clubExpiry: '2025-12-01', tags: ['вебинар_прикорм'] },
  { id: 3, name: 'Мария Петрова', email: 'mashap@yandex.ru', phone: '+7 (916) 555-44-33', ltv: 8900, clubStatus: 'active', clubExpiry: '2026-08-20', tags: ['курс_базовый'] },
  { id: 4, name: 'Ольга Сидорова', email: 'olya.sid@mail.ru', phone: '+7 (926) 111-22-33', ltv: 0, clubStatus: 'none', clubExpiry: null, tags: ['лид_инста'] },
];

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = MOCK_USERS.filter(u => 
    `${u.name} ${u.email}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <header className="bg-card border-b border-border px-8 py-5 shrink-0">
        <h2 className="text-2xl font-bold">База пользователей</h2>
      </header>

      <div className="flex-1 overflow-auto p-8">
        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-border bg-muted/50 flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Поиск по базе..."
                className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted font-medium">
              <Filter className="w-4 h-4" /> Фильтры
            </button>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="bg-muted/50 text-muted-foreground text-[11px] uppercase tracking-wider border-b border-border">
                <th className="p-4 font-bold">Имя / Email</th>
                <th className="p-4 font-bold">Телефон</th>
                <th className="p-4 font-bold">Клуб</th>
                <th className="p-4 font-bold">LTV</th>
                <th className="p-4 font-bold">Теги</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {filtered.map(user => (
                <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-4">
                    <div className="font-bold">{user.name}</div>
                    <div className="text-muted-foreground text-xs">{user.email}</div>
                  </td>
                  <td className="p-4 text-muted-foreground text-xs">{user.phone}</td>
                  <td className="p-4">
                    {user.clubStatus === 'active' ? (
                      <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100 font-medium">До {user.clubExpiry}</span>
                    ) : <span className="text-muted-foreground text-xs">—</span>}
                  </td>
                  <td className="p-4 font-bold">{user.ltv.toLocaleString()} ₽</td>
                  <td className="p-4">
                    <div className="flex gap-1 flex-wrap">
                      {user.tags.map(t => <span key={t} className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded">{t}</span>)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
