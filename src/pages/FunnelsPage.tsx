import { useState } from 'react';
import {
  Users, Workflow, Zap, Edit, Trash2, Sparkles,
  Send, Loader2, Play, Pause, Clock, MessageSquare, X
} from 'lucide-react';

const MOCK_FUNNELS = [
  {
    id: 1, name: 'Велком-цепочка: Клуб', status: 'active',
    trigger: 'Покупка: Клуб (1 месяц)',
    stats: { inProgress: 142, completed: 890, conversion: '45%' },
    steps: [
      { id: 101, type: 'delay', value: '10 минут' },
      { id: 102, type: 'message', name: 'Приветствие и ссылка на ТГ-чат', content: 'Привет! Добро пожаловать...' },
      { id: 103, type: 'delay', value: '2 дня' },
      { id: 104, type: 'message', name: 'Как пользоваться базой знаний', content: 'Расскажу, как не потеряться...' }
    ]
  },
  {
    id: 2, name: 'Дожим: Брошенная корзина Гайд', status: 'paused',
    trigger: 'Событие: Бросил корзину (Гайд по сну)',
    stats: { inProgress: 12, completed: 45, conversion: '12%' },
    steps: [
      { id: 201, type: 'delay', value: '2 часа' },
      { id: 202, type: 'message', name: 'Вы забыли гайд в корзине!' },
      { id: 203, type: 'delay', value: '24 часа' },
      { id: 204, type: 'message', name: 'Скидка 10% на гайд' }
    ]
  }
];

export default function FunnelsPage() {
  const [isFunnelModalOpen, setIsFunnelModalOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [editingFunnel, setEditingFunnel] = useState<any>(null);

  const handleGenerateAiFunnel = () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    setTimeout(() => {
      setEditingFunnel({
        name: 'AI: ' + aiPrompt.substring(0, 30) + '...',
        trigger: 'Определено AI',
        steps: [
          { id: 1, type: 'message', name: 'Спасибо за покупку!' },
          { id: 2, type: 'delay', value: '1 день' },
          { id: 3, type: 'message', name: 'Опрос: Все получилось?' },
          { id: 4, type: 'delay', value: '3 дня' },
          { id: 5, type: 'message', name: 'Скидка 15% на Клуб' }
        ],
        status: 'draft'
      });
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <>
      <header className="bg-card border-b border-border px-8 py-5 flex items-center justify-between shrink-0">
        <h2 className="text-2xl font-bold">Автоматические воронки</h2>
        <button
          onClick={() => { setEditingFunnel(null); setAiPrompt(''); setIsFunnelModalOpen(true); }}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors shadow-sm"
        >
          <Sparkles className="w-5 h-5" /> Создать воронку текстом
        </button>
      </header>

      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center"><Workflow className="w-6 h-6" /></div>
              <div><p className="text-sm text-muted-foreground font-medium">Активных воронок</p><p className="text-2xl font-bold">2</p></div>
            </div>
            <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-50 text-green-500 flex items-center justify-center"><Users className="w-6 h-6" /></div>
              <div><p className="text-sm text-muted-foreground font-medium">Людей в процессе</p><p className="text-2xl font-bold">154</p></div>
            </div>
            <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center"><Zap className="w-6 h-6" /></div>
              <div><p className="text-sm text-muted-foreground font-medium">Авто-продажи за неделю</p><p className="text-2xl font-bold">42,500 ₽</p></div>
            </div>
          </div>

          <div className="space-y-4">
            {MOCK_FUNNELS.map(funnel => (
              <div key={funnel.id} className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden hover:border-primary/30 transition-colors group">
                <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold">{funnel.name}</h3>
                      {funnel.status === 'active' ? (
                        <span className="text-[10px] uppercase font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-200">Работает</span>
                      ) : (
                        <span className="text-[10px] uppercase font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded border border-border">Пауза</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1.5"><Zap className="w-4 h-4 text-amber-500" /> {funnel.trigger}</p>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-center"><p className="text-lg font-bold">{funnel.stats.conversion}</p><p className="text-[10px] text-muted-foreground uppercase">Конверсия</p></div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => { setEditingFunnel(funnel); setIsFunnelModalOpen(true); }} className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"><Edit className="w-5 h-5" /></button>
                      <button className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"><Trash2 className="w-5 h-5" /></button>
                    </div>
                  </div>
                </div>

                {/* Steps */}
                <div className="px-6 pb-6 flex items-center gap-2 overflow-x-auto no-scrollbar">
                  {funnel.steps.map((step, idx) => (
                    <div key={step.id} className="flex items-center gap-2">
                      <div className={`px-3 py-2 rounded-xl text-[10px] font-bold whitespace-nowrap border ${step.type === 'delay' ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
                        {step.type === 'delay' ? `⏱ ${step.value}` : `💬 ${step.name}`}
                      </div>
                      {idx < funnel.steps.length - 1 && <div className="w-4 h-px bg-border" />}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Modal */}
      {isFunnelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary/70 backdrop-blur-md">
          <div className="bg-card rounded-3xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="text-xl font-bold">AI Генератор воронок</h3>
              <button onClick={() => setIsFunnelModalOpen(false)} className="p-2 hover:bg-muted rounded-full"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex flex-1 overflow-hidden">
              <div className="w-1/3 border-r border-border p-8 flex flex-col bg-muted/50">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold">AI Помощник</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">Опишите воронку своими словами — AI создаст цепочку.</p>
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Пример: Создай воронку после покупки курса по сну..."
                  className="w-full h-48 p-4 bg-card border border-border rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 text-sm resize-none shadow-inner"
                />
                <button
                  onClick={handleGenerateAiFunnel}
                  disabled={isGenerating || !aiPrompt.trim()}
                  className="w-full mt-4 py-4 bg-foreground text-card rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-foreground/90 disabled:bg-muted disabled:text-muted-foreground transition-all shadow-lg"
                >
                  {isGenerating ? <><Loader2 className="w-5 h-5 animate-spin" /> Генерация...</> : <><Send className="w-5 h-5" /> Сгенерировать</>}
                </button>
              </div>

              <div className="flex-1 bg-card p-8 overflow-y-auto">
                {!editingFunnel ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground">
                    <Workflow className="w-16 h-16 mb-4 opacity-30" />
                    <p className="font-bold">Опишите воронку слева</p>
                    <p className="text-sm">AI создаст визуальную цепочку шагов</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h4 className="font-bold text-lg">{editingFunnel.name}</h4>
                    <p className="text-sm text-muted-foreground">{editingFunnel.trigger}</p>
                    <div className="space-y-3 mt-6">
                      {editingFunnel.steps.map((step: any, idx: number) => (
                        <div key={step.id} className={`p-4 rounded-2xl border ${step.type === 'delay' ? 'bg-amber-50 border-amber-100' : 'bg-blue-50 border-blue-100'}`}>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-sm font-black shadow-sm">{idx + 1}</div>
                            <div>
                              <p className="text-xs font-bold">{step.type === 'delay' ? `Ждать: ${step.value}` : step.name}</p>
                              {step.content && <p className="text-[10px] text-muted-foreground mt-1">{step.content}</p>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
