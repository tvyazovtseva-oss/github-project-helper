import { useState, useMemo } from 'react';
import { Workflow, Plus, Play, Pause, Search, Sparkles, Trash2, X, Wand2 } from 'lucide-react';

const MOCK_FUNNELS = [
  { id: 1, name: 'Welcome-цепочка: Клуб', trigger: 'Регистрация', status: 'active', steps: 4, conversion: '12%', activeUsers: 145 },
  { id: 2, name: 'Брошенная корзина: Гайд Сон', trigger: 'Отказ от оплаты', status: 'paused', steps: 2, conversion: '8%', activeUsers: 34 },
  { id: 3, name: 'Прогрев к вебинару', trigger: 'Подписка на ТГ-бот', status: 'active', steps: 6, conversion: '24%', activeUsers: 890 },
];

export default function AdminFunnelsPage() {
  const [funnels, setFunnels] = useState(MOCK_FUNNELS);
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => funnels.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase())), [funnels, searchQuery]);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setShowAiModal(false);
      setFunnels([{ id: Date.now(), name: 'Новая AI-воронка', trigger: 'Произвольное событие', status: 'paused', steps: 3, conversion: '0%', activeUsers: 0 }, ...funnels]);
    }, 2000);
  };

  const handleDelete = (id: number) => setFunnels(funnels.filter(f => f.id !== id));

  return (
    <div className="p-6 lg:p-8 max-w-6xl animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-ink-900">Автоворонки</h1>
            <Workflow className="w-5 h-5 text-brand-500" />
          </div>
          <p className="text-sm text-ink-400 mt-1">Автоматические сценарии прогрева и продаж</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-300" />
          <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Поиск воронок..." className="w-full pl-11 pr-4 py-3 bg-white border border-surface-200 rounded-2xl text-sm outline-none focus:border-ink-900 transition-all" />
        </div>
        <button onClick={() => setShowAiModal(true)} className="flex items-center gap-2 px-4 py-3 text-brand-500 bg-brand-50 rounded-2xl text-sm font-bold hover:bg-brand-100 border border-brand-200 transition-all">
          <Sparkles className="w-4 h-4" /> AI Генератор
        </button>
        <button onClick={() => { const name = prompt('Название воронки:'); if (name) setFunnels([{ id: Date.now(), name, trigger: 'Регистрация', status: 'paused', steps: 0, conversion: '0%', activeUsers: 0 }, ...funnels]); }}
          className="flex items-center gap-2 px-6 py-3 bg-ink-900 text-white rounded-2xl text-sm font-bold">
          <Plus className="w-4 h-4" /> Создать
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(funnel => (
          <div key={funnel.id} className="bg-white rounded-2xl border border-surface-200 p-6 hover:shadow-lg hover:shadow-black/5 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${funnel.status === 'active' ? 'bg-emerald-50' : 'bg-surface-100'}`}>
                {funnel.status === 'active' ? <Play className="w-4 h-4 text-emerald-500 fill-emerald-500" /> : <Pause className="w-4 h-4 text-ink-300" />}
              </div>
              <button onClick={() => handleDelete(funnel.id)} className="p-2 text-ink-300 hover:text-destructive rounded-lg transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <h3 className="font-bold text-ink-900 mb-1">{funnel.name}</h3>
            <p className="text-xs text-ink-400 mb-4">{funnel.trigger}</p>
            <div className="grid grid-cols-3 gap-3">
              <div><p className="text-lg font-bold text-ink-900">{funnel.steps}</p><p className="text-[10px] text-ink-300">Шагов</p></div>
              <div><p className="text-lg font-bold text-ink-900">{funnel.conversion}</p><p className="text-[10px] text-ink-300">Конверсия</p></div>
              <div><p className="text-lg font-bold text-ink-900">{funnel.activeUsers}</p><p className="text-[10px] text-ink-300">В воронке</p></div>
            </div>
          </div>
        ))}
      </div>

      {/* AI modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowAiModal(false)} />
          <div className="relative bg-white rounded-3xl p-6 w-full max-w-lg animate-scale-in">
            <div className="flex items-center gap-3 mb-4">
              <Wand2 className="w-5 h-5 text-brand-500" />
              <div>
                <h3 className="font-bold text-ink-900">AI-сценарист воронок</h3>
                <p className="text-xs text-ink-400">Генерация под ключ</p>
              </div>
              <button onClick={() => setShowAiModal(false)} className="ml-auto p-2 hover:bg-surface-100 rounded-xl"><X className="w-5 h-5 text-ink-400" /></button>
            </div>
            <p className="text-xs font-bold text-ink-400 mb-2">Опишите цель воронки</p>
            <textarea value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} placeholder="Пример: Прогреть маму к покупке гайда за 3 дня..." className="w-full h-32 p-4 bg-surface-50 border border-surface-200 rounded-2xl text-sm outline-none focus:border-brand-500 resize-none transition-all mb-3" />
            <div className="flex gap-2 mb-4">
              {['Прогрев к вебинару', 'Брошенная корзина', 'Welcome-серия'].map(t => (
                <button key={t} onClick={() => setAiPrompt(t)} className="text-[10px] font-bold bg-surface-100 text-ink-500 px-3 py-1.5 rounded-full hover:bg-surface-200 transition-colors">{t}</button>
              ))}
            </div>
            <button onClick={handleGenerate} disabled={isGenerating} className="btn-primary flex items-center justify-center gap-2">
              {isGenerating ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Нейросеть думает...</> : <><Sparkles className="w-5 h-5" /> Сгенерировать цепочку</>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
