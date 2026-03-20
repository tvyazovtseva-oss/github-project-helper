import { useState } from 'react';
import { Syringe, TestTube, Stethoscope, Ruler, StickyNote, Plus, CheckCircle2, Clock, Calendar } from 'lucide-react';
import GrowthChart from '@/components/GrowthChart';

const TABS = [
  { key: 'vaccines', label: 'Прививки', icon: Syringe },
  { key: 'tests', label: 'Анализы', icon: TestTube },
  { key: 'checkups', label: 'Чекапы', icon: Stethoscope },
  { key: 'growth', label: 'Замеры', icon: Ruler },
  { key: 'notes', label: 'Заметки', icon: StickyNote },
];

const VACCINES = [
  { id: 1, name: 'БЦЖ', age: 'При рождении', status: 'done' as const, date: '15.01.2024' },
  { id: 2, name: 'Гепатит B (1)', age: 'При рождении', status: 'done' as const, date: '15.01.2024' },
  { id: 3, name: 'Гепатит B (2)', age: '1 мес', status: 'done' as const, date: '15.02.2024' },
  { id: 4, name: 'Пентаксим (1)', age: '3 мес', status: 'done' as const, date: '15.04.2024' },
  { id: 5, name: 'Пентаксим (2)', age: '4.5 мес', status: 'done' as const, date: '01.06.2024' },
  { id: 6, name: 'Пентаксим (3)', age: '6 мес', status: 'done' as const, date: '15.07.2024' },
  { id: 7, name: 'Корь/Краснуха/Паротит', age: '12 мес', status: 'done' as const, date: '20.01.2025' },
  { id: 8, name: 'Ревакцинация Пентаксим', age: '18 мес', status: 'done' as const, date: '18.07.2025' },
  { id: 9, name: 'Полиомиелит (ОПВ)', age: '20 мес', status: 'planned' as const, date: '15.09.2025' },
  { id: 10, name: 'Гепатит B (3)', age: '6 мес', status: 'planned' as const, date: '' },
  { id: 11, name: 'Пневмококк (ревакц.)', age: '15 мес', status: 'missed' as const, date: '' },
  { id: 12, name: 'АКДС (ревакц.)', age: '6 лет', status: 'upcoming' as const, date: '' },
];

const TESTS = [
  { id: 1, name: 'Общий анализ крови', frequency: 'Каждые 6 мес', status: 'done' as const, date: '10.01.2025', result: 'Норма' },
  { id: 2, name: 'Общий анализ мочи', frequency: 'Каждые 6 мес', status: 'done' as const, date: '10.01.2025', result: 'Норма' },
  { id: 3, name: 'Витамин D', frequency: 'Раз в год', status: 'planned' as const, date: '15.04.2025', result: '' },
  { id: 4, name: 'Аллергопанель', frequency: 'По назначению', status: 'planned' as const, date: '', result: '' },
];

const CHECKUPS = [
  { id: 1, name: 'Педиатр', age: '1 мес', status: 'done' as const },
  { id: 2, name: 'Невролог', age: '1 мес', status: 'done' as const },
  { id: 3, name: 'Ортопед', age: '3 мес', status: 'done' as const },
  { id: 4, name: 'Окулист', age: '6 мес', status: 'done' as const },
  { id: 5, name: 'Педиатр', age: '12 мес', status: 'done' as const },
  { id: 6, name: 'Стоматолог', age: '12 мес', status: 'planned' as const },
  { id: 7, name: 'ЛОР', age: '12 мес', status: 'planned' as const },
];

const MEASUREMENTS = [
  { measured_at: '2024-01-15', weight: '3.2', height: '50' },
  { measured_at: '2024-02-15', weight: '4.1', height: '54' },
  { measured_at: '2024-04-15', weight: '5.8', height: '60' },
  { measured_at: '2024-07-15', weight: '7.3', height: '66' },
  { measured_at: '2024-10-15', weight: '8.5', height: '72' },
  { measured_at: '2025-01-15', weight: '9.6', height: '76' },
];

const NOTES = [
  { id: 1, text: 'София начала ползать в 7 месяцев. Первый зуб появился в 5.5 мес.', tags: ['Развитие', 'Зубы'], date: '2024-08-10' },
  { id: 2, text: 'Аллергия на коровье молоко — исключить до 2 лет. Яйца — проба в 1.5 года.', tags: ['Аллергии', 'Питание'], date: '2024-06-20' },
  { id: 3, text: 'Группа крови A(II) Rh+. Определена в роддоме.', tags: ['Медицина'], date: '2024-01-15' },
];

const STATUS_STYLE = {
  done: { bg: '#34C75915', color: '#34C759', label: 'Сделано', icon: CheckCircle2 },
  planned: { bg: '#007AFF15', color: '#007AFF', label: 'Запланировано', icon: Calendar },
  missed: { bg: '#FF3B3015', color: '#FF3B30', label: 'Пропущена', icon: Clock },
  upcoming: { bg: '#FF950015', color: '#FF9500', label: 'Будущая', icon: Clock },
};

export default function MamaHealthPage() {
  const [activeTab, setActiveTab] = useState('vaccines');
  const [chartType, setChartType] = useState<'weight' | 'height'>('weight');

  return (
    <div className="pb-6 animate-fade-in">
      <div className="px-4 pt-5 pb-2">
        <h1 className="text-2xl font-bold text-ink-900" style={{ lineHeight: '1.15' }}>Медкарта</h1>
        <p className="text-sm text-ink-400 mt-1">София · 1 год 2 мес</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 px-4 mt-3 mb-4 overflow-x-auto no-scrollbar">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === tab.key ? 'bg-ink-900 text-white' : 'bg-surface-100 text-ink-400'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="px-4">
        {/* Vaccines */}
        {activeTab === 'vaccines' && (
          <div className="space-y-2 animate-fade-in">
            {VACCINES.map(v => {
              const st = STATUS_STYLE[v.status];
              return (
                <div key={v.id} className="flex items-center gap-3 p-3.5 bg-surface-50 rounded-2xl">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: st.bg }}>
                    <st.icon className="w-4 h-4" style={{ color: st.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-ink-900 truncate">{v.name}</p>
                    <p className="text-[10px] text-ink-400">{v.age}{v.date ? ` · ${v.date}` : ''}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: st.bg, color: st.color }}>
                    {st.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Tests */}
        {activeTab === 'tests' && (
          <div className="space-y-2 animate-fade-in">
            {TESTS.map(t => {
              const st = STATUS_STYLE[t.status];
              return (
                <div key={t.id} className="flex items-center gap-3 p-3.5 bg-surface-50 rounded-2xl">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: st.bg }}>
                    <st.icon className="w-4 h-4" style={{ color: st.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-ink-900 truncate">{t.name}</p>
                    <p className="text-[10px] text-ink-400">{t.frequency}{t.date ? ` · ${t.date}` : ''}</p>
                    {t.result && <p className="text-[10px] font-bold text-ink-500 mt-0.5">Результат: {t.result}</p>}
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: st.bg, color: st.color }}>
                    {st.label}
                  </span>
                </div>
              );
            })}
            <button className="w-full flex items-center justify-center gap-2 p-3 bg-surface-100 rounded-2xl text-sm font-bold text-ink-400 active:scale-[0.98] transition-transform">
              <Plus className="w-4 h-4" /> Добавить анализ
            </button>
          </div>
        )}

        {/* Checkups */}
        {activeTab === 'checkups' && (
          <div className="space-y-2 animate-fade-in">
            {CHECKUPS.map(c => {
              const st = STATUS_STYLE[c.status];
              return (
                <div key={c.id} className="flex items-center gap-3 p-3.5 bg-surface-50 rounded-2xl">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: st.bg }}>
                    <st.icon className="w-4 h-4" style={{ color: st.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-ink-900">{c.name}</p>
                    <p className="text-[10px] text-ink-400">{c.age}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: st.bg, color: st.color }}>
                    {st.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Growth */}
        {activeTab === 'growth' && (
          <div className="animate-fade-in">
            <div className="flex gap-2 mb-4">
              {(['weight', 'height'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setChartType(type)}
                  className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${
                    chartType === type ? 'bg-ink-900 text-white' : 'bg-surface-100 text-ink-400'
                  }`}
                >
                  {type === 'weight' ? 'Вес' : 'Рост'}
                </button>
              ))}
            </div>
            <div className="bg-surface-50 rounded-2xl p-4">
              <GrowthChart
                history={MEASUREMENTS}
                gender="girl"
                chartType={chartType}
                birthdate="2024-01-15"
                color="#F43F5E"
              />
            </div>
            <div className="mt-4 space-y-2">
              {MEASUREMENTS.slice().reverse().map((m, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-surface-50 rounded-xl">
                  <span className="text-xs text-ink-400">{new Date(m.measured_at).toLocaleDateString('ru')}</span>
                  <span className="text-xs font-bold text-ink-700">{m.weight} кг / {m.height} см</span>
                </div>
              ))}
            </div>
            <button className="w-full flex items-center justify-center gap-2 p-3 mt-3 bg-surface-100 rounded-2xl text-sm font-bold text-ink-400 active:scale-[0.98] transition-transform">
              <Plus className="w-4 h-4" /> Добавить замер
            </button>
          </div>
        )}

        {/* Notes */}
        {activeTab === 'notes' && (
          <div className="animate-fade-in space-y-3">
            {NOTES.map(note => (
              <div key={note.id} className="p-4 bg-surface-50 rounded-2xl">
                <p className="text-sm text-ink-900">{note.text}</p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  {note.tags.map(tag => (
                    <span key={tag} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-50 text-brand-500">{tag}</span>
                  ))}
                  <span className="text-[10px] text-ink-300 ml-auto">{new Date(note.date).toLocaleDateString('ru')}</span>
                </div>
              </div>
            ))}
            <button className="w-full flex items-center justify-center gap-2 p-3 bg-surface-100 rounded-2xl text-sm font-bold text-ink-400 active:scale-[0.98] transition-transform">
              <Plus className="w-4 h-4" /> Добавить заметку
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
