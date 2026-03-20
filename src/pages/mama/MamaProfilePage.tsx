import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { User, Baby, Ruler, Weight, Edit3, ChevronRight, Calendar, FileText, ShoppingBag } from 'lucide-react';
import GrowthChart from '@/components/GrowthChart';

const MOCK_CHILD = {
  name: 'София',
  birthdate: '2024-01-15',
  gender: 'girl' as const,
  allergies: 'Молоко, яйца',
  bloodType: 'A(II) Rh+',
};

const MOCK_MEASUREMENTS = [
  { measured_at: '2024-01-15', weight: '3.2', height: '50' },
  { measured_at: '2024-02-15', weight: '4.1', height: '54' },
  { measured_at: '2024-04-15', weight: '5.8', height: '60' },
  { measured_at: '2024-07-15', weight: '7.3', height: '66' },
  { measured_at: '2024-10-15', weight: '8.5', height: '72' },
  { measured_at: '2025-01-15', weight: '9.6', height: '76' },
];

const TABS = ['Профиль', 'Медкарта', 'Рост', 'Покупки', 'Заметки'];

export default function MamaProfilePage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('Профиль');
  const [chartType, setChartType] = useState<'weight' | 'height'>('weight');

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
              activeTab === tab
                ? 'bg-ink-900 text-white'
                : 'bg-surface-100 text-ink-400'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="px-4">
        {activeTab === 'Профиль' && (
          <div className="space-y-3 animate-fade-in">
            <ProfileCard icon={User} label="Имя" value={user?.full_name || ''} />
            <ProfileCard icon={Baby} label="Ребёнок" value={MOCK_CHILD.name} />
            <ProfileCard icon={Calendar} label="Дата рождения" value={new Date(MOCK_CHILD.birthdate).toLocaleDateString('ru')} />
            <button
              onClick={logout}
              className="w-full mt-6 py-3 text-destructive font-bold text-sm bg-destructive/5 rounded-2xl active:scale-[0.97] transition-transform"
            >
              Выйти из аккаунта
            </button>
          </div>
        )}

        {activeTab === 'Медкарта' && (
          <div className="space-y-3 animate-fade-in">
            <ProfileCard icon={Baby} label="Имя ребёнка" value={MOCK_CHILD.name} />
            <ProfileCard icon={FileText} label="Аллергии" value={MOCK_CHILD.allergies} />
            <ProfileCard icon={FileText} label="Группа крови" value={MOCK_CHILD.bloodType} />
          </div>
        )}

        {activeTab === 'Рост' && (
          <div className="animate-fade-in">
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setChartType('weight')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${
                  chartType === 'weight' ? 'bg-ink-900 text-white' : 'bg-surface-100 text-ink-400'
                }`}
              >
                <Weight className="w-4 h-4" />
                Вес
              </button>
              <button
                onClick={() => setChartType('height')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${
                  chartType === 'height' ? 'bg-ink-900 text-white' : 'bg-surface-100 text-ink-400'
                }`}
              >
                <Ruler className="w-4 h-4" />
                Рост
              </button>
            </div>
            <div className="bg-surface-50 rounded-2xl p-4">
              <GrowthChart
                history={MOCK_MEASUREMENTS}
                gender={MOCK_CHILD.gender}
                chartType={chartType}
                birthdate={MOCK_CHILD.birthdate}
                color="#F43F5E"
              />
            </div>
            <div className="mt-4 space-y-2">
              {MOCK_MEASUREMENTS.slice().reverse().map((m, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-surface-50 rounded-xl">
                  <span className="text-xs text-ink-400">{new Date(m.measured_at).toLocaleDateString('ru')}</span>
                  <span className="text-xs font-bold text-ink-700">{m.weight} кг / {m.height} см</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'Покупки' && (
          <div className="text-center py-12 animate-fade-in">
            <ShoppingBag className="w-10 h-10 mx-auto mb-3 text-ink-200" />
            <p className="text-sm font-bold text-ink-400">История покупок пуста</p>
          </div>
        )}

        {activeTab === 'Заметки' && (
          <div className="animate-fade-in">
            <textarea
              placeholder="Ваши заметки о малыше..."
              className="w-full h-40 p-4 bg-surface-50 rounded-2xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-brand-500/10 resize-none transition-all"
              defaultValue="София начала ползать в 7 месяцев. Первый зуб появился в 5.5 мес."
            />
          </div>
        )}
      </div>
    </div>
  );
}

function ProfileCard({ icon: Icon, label, value }: { icon: typeof User; label: string; value: string }) {
  return (
    <div className="flex items-center gap-4 p-4 bg-surface-50 rounded-2xl">
      <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-brand-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-ink-300 uppercase font-bold tracking-wider">{label}</p>
        <p className="text-sm font-bold text-ink-900 truncate">{value}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-ink-200" />
    </div>
  );
}
