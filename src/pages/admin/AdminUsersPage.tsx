import { useState, useMemo } from 'react';
import { Users, Search, Filter, Tag, ChevronRight, X, Mail, Phone } from 'lucide-react';

const MOCK_USERS = [
  { id: 1, name: 'Елена Смирнова', email: 'elena@mail.ru', phone: '+7 912 345-67-89', products: ['Клуб'], tags: ['VIP'], joined: '2024-01-15', lastActive: '2 часа назад', status: 'active' },
  { id: 2, name: 'Мария Петрова', email: 'maria@gmail.com', phone: '+7 900 111-22-33', products: ['Клуб', 'Курс: Сон'], tags: [], joined: '2024-02-20', lastActive: 'вчера', status: 'active' },
  { id: 3, name: 'Анна Иванова', email: 'anna@ya.ru', phone: '+7 905 222-33-44', products: ['Гайд'], tags: ['Холодная'], joined: '2023-11-10', lastActive: '2 нед. назад', status: 'inactive' },
  { id: 4, name: 'Ольга Сидорова', email: 'olga@mail.ru', phone: '+7 916 444-55-66', products: ['Клуб'], tags: ['VIP', 'Амбассадор'], joined: '2023-09-01', lastActive: 'сейчас', status: 'active' },
];

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<typeof MOCK_USERS[0] | null>(null);

  const filtered = useMemo(() => {
    return MOCK_USERS.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));
  }, [search]);

  return (
    <div className="p-6 lg:p-8 max-w-6xl animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">База мам</h1>
          <p className="text-sm text-ink-400 mt-1">CRM-панель пользователей</p>
        </div>
        <span className="text-sm font-bold text-ink-300">{filtered.length} мам</span>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-300" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск по имени или email..."
          className="w-full pl-11 pr-4 py-3.5 bg-white border border-surface-200 rounded-2xl text-sm font-medium outline-none focus:border-ink-900 focus:ring-4 focus:ring-black/5 transition-all"
        />
      </div>

      <div className="bg-white rounded-2xl border border-surface-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-ink-400 border-b border-surface-200">
              <th className="text-left px-6 py-3 font-bold text-xs">Мама</th>
              <th className="text-left px-6 py-3 font-bold text-xs hidden md:table-cell">Продукты</th>
              <th className="text-left px-6 py-3 font-bold text-xs hidden lg:table-cell">Теги</th>
              <th className="text-left px-6 py-3 font-bold text-xs hidden md:table-cell">Активность</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id} onClick={() => setSelectedUser(u)} className="border-t border-surface-100 hover:bg-surface-50/50 cursor-pointer transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold text-sm shrink-0">
                      {u.name[0]}
                    </div>
                    <div>
                      <p className="font-bold text-ink-900">{u.name}</p>
                      <p className="text-xs text-ink-300">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 hidden md:table-cell">
                  <div className="flex gap-1 flex-wrap">
                    {u.products.map(p => (
                      <span key={p} className="text-[10px] font-bold bg-surface-100 text-ink-500 px-2 py-0.5 rounded-full">{p}</span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 hidden lg:table-cell">
                  <div className="flex gap-1">
                    {u.tags.map(t => (
                      <span key={t} className="text-[10px] font-bold bg-brand-50 text-brand-600 px-2 py-0.5 rounded-full">{t}</span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 hidden md:table-cell">
                  <span className={`text-xs font-medium ${u.status === 'active' ? 'text-emerald-500' : 'text-ink-300'}`}>{u.lastActive}</span>
                </td>
                <td className="px-6 py-4">
                  <ChevronRight className="w-4 h-4 text-ink-200" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* User detail slide-over */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/30" onClick={() => setSelectedUser(null)} />
          <div className="relative w-full max-w-md bg-white h-full overflow-y-auto animate-slide-up shadow-2xl">
            <div className="sticky top-0 bg-white/90 glass px-6 py-4 border-b border-surface-200 flex items-center justify-between z-10">
              <h2 className="font-bold text-ink-900">Карточка мамы</h2>
              <button onClick={() => setSelectedUser(null)} className="p-2 hover:bg-surface-100 rounded-xl">
                <X className="w-5 h-5 text-ink-400" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-brand-100 flex items-center justify-center mx-auto mb-3 text-brand-600 font-bold text-xl">
                  {selectedUser.name[0]}
                </div>
                <h3 className="text-lg font-bold text-ink-900">{selectedUser.name}</h3>
                <p className="text-sm text-ink-400">{selectedUser.email}</p>
              </div>
              <div className="space-y-3">
                <InfoRow icon={Mail} label="Email" value={selectedUser.email} />
                <InfoRow icon={Phone} label="Телефон" value={selectedUser.phone} />
                <InfoRow icon={Users} label="Продукты" value={selectedUser.products.join(', ')} />
                <InfoRow icon={Tag} label="Теги" value={selectedUser.tags.join(', ') || 'нет'} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: typeof Mail; label: string; value: string }) {
  return (
    <div className="flex items-center gap-4 p-3 bg-surface-50 rounded-xl">
      <Icon className="w-4 h-4 text-ink-300 shrink-0" />
      <div>
        <p className="text-[10px] text-ink-300 font-bold uppercase">{label}</p>
        <p className="text-sm font-medium text-ink-700">{value}</p>
      </div>
    </div>
  );
}
