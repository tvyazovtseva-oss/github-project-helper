import { useState, useEffect } from 'react';
import {
  Settings, Save, Plus, Trash2,
  Palette, CreditCard,
  ChevronRight, Heart, Monitor, Smartphone,
  Clock, Calendar, X, Check, User, Lock
} from 'lucide-react';

export default function ProductsPage() {
  const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>('mobile');
  const [editingTier, setEditingTier] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const [productData, setProductData] = useState({
    name: 'Клуб Anna MAMA',
    badgeText: 'Подписка: 1 месяц доступа',
    color: '#f43f5e',
    icon: 'Heart',
    layout: [
      { id: 'hero', name: 'Главный баннер', visible: true },
      { id: 'actions', name: 'Кнопки быстрых действий', visible: true },
      { id: 'health_map', name: 'Карта здоровья', visible: true },
      { id: 'status_bar', name: 'Индикатор прогресса', visible: true }
    ],
    pricing: [
      {
        id: 1, label: 'Пробный период', price: '0',
        durationValue: 3, durationUnit: 'days',
        expirationType: 'exact', startDateType: 'immediate',
        fixedStartDate: '', fixedStartTime: '00:00', preAccessEnabled: true
      },
      {
        id: 2, label: 'Базовый', price: '2900',
        durationValue: 31, durationUnit: 'days',
        expirationType: 'endOfDay', startDateType: 'fixed',
        fixedStartDate: '2026-04-17', fixedStartTime: '15:00', preAccessEnabled: true
      }
    ]
  });

  const updateField = (field: string, value: any) => {
    setProductData(prev => ({ ...prev, [field]: value }));
  };

  const saveTier = (updatedTier: any) => {
    setProductData(prev => ({
      ...prev,
      pricing: prev.pricing.map(t => t.id === updatedTier.id ? updatedTier : t)
    }));
    setEditingTier(null);
  };

  const getMockExpiration = () => {
    const date = new Date();
    date.setDate(date.getDate() + 31);
    return date.toLocaleDateString() + ' в ' + (productData.pricing[1].expirationType === 'endOfDay' ? '23:59:59' : '15:00:00');
  };

  return (
    <>
      <header className="bg-card border-b border-border px-8 py-5 flex items-center justify-between shrink-0">
        <h2 className="text-2xl font-bold">Конструктор продукта</h2>
        <button className="p-3 bg-foreground text-card rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all">
          <Save className="w-5 h-5" />
        </button>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Settings Panel */}
        <aside className="w-[420px] bg-card border-r border-border overflow-y-auto p-8 space-y-10 shrink-0 custom-scrollbar">
          <section className="space-y-6">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              <CreditCard className="w-3 h-3" /> Тарифы и логика времени
            </div>
            <div className="space-y-3">
              {productData.pricing.map(tier => (
                <button
                  key={tier.id}
                  onClick={() => setEditingTier({ ...tier })}
                  className="w-full p-4 bg-card border border-border rounded-2xl flex justify-between items-center group hover:border-foreground transition-all text-left shadow-sm"
                >
                  <div>
                    <p className="text-sm font-black">{tier.label}</p>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">
                      {tier.durationValue} {tier.durationUnit} • {tier.price}₽
                    </p>
                    {tier.startDateType === 'fixed' && (
                      <div className="mt-1 flex items-center gap-1 text-[9px] text-blue-500 font-bold">
                        <Calendar className="w-2.5 h-2.5" /> {tier.fixedStartDate} {tier.fixedStartTime}
                      </div>
                    )}
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              <Palette className="w-3 h-3" /> Оформление
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Название</label>
                <input type="text" value={productData.name} onChange={(e) => updateField('name', e.target.value)} className="admin-input" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Цвет</label>
                <input type="color" value={productData.color} onChange={(e) => updateField('color', e.target.value)} className="w-full h-10 rounded-xl cursor-pointer" />
              </div>
            </div>
          </section>
        </aside>

        {/* Preview */}
        <div className="flex-1 relative flex flex-col items-center justify-center p-10 overflow-hidden">
          <div className="absolute top-6 left-1/2 -translate-x-1/2 flex bg-card p-1.5 rounded-2xl shadow-sm border border-border z-10">
            <button onClick={() => setViewMode('mobile')} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black transition-all ${viewMode === 'mobile' ? 'bg-foreground text-card shadow-lg' : 'text-muted-foreground'}`}>
              <Smartphone className="w-3 h-3" /> MOBILE
            </button>
            <button onClick={() => setViewMode('desktop')} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black transition-all ${viewMode === 'desktop' ? 'bg-foreground text-card shadow-lg' : 'text-muted-foreground'}`}>
              <Monitor className="w-3 h-3" /> DESKTOP
            </button>
          </div>

          <div className={`transition-all duration-700 ease-in-out bg-card shadow-[0_40px_120px_-20px_rgba(0,0,0,0.15)] relative overflow-hidden flex flex-col
            ${viewMode === 'mobile' ? 'w-[375px] h-[760px] rounded-[3.5rem] border-[10px] border-gray-900' : 'w-full h-full max-w-5xl rounded-3xl border border-border'}
          `}>
            <div className="h-full flex flex-col" style={{ '--p-color': productData.color, '--p-bg': productData.color + '15' } as any}>
              <header className="h-16 px-6 border-b border-border/50 flex items-center justify-between bg-card/80 backdrop-blur-xl z-10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: productData.color }}>
                    <Heart className="w-4 h-4 fill-current" />
                  </div>
                  <span className="font-black text-sm tracking-tight">{productData.name}</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center">
                  <User className="w-4 h-4 text-muted-foreground" />
                </div>
              </header>

              <div className={`flex-1 overflow-y-auto p-6 ${viewMode === 'desktop' ? 'grid grid-cols-12 gap-8' : 'space-y-6'}`}>
                <div className={viewMode === 'desktop' ? 'col-span-12' : ''}>
                  <div className="bg-foreground text-card p-6 rounded-[2.5rem] shadow-xl relative overflow-hidden">
                    <div className="relative z-10 flex justify-between items-start">
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Доступ активен до:</p>
                        <p className="text-xl font-black">{getMockExpiration()}</p>
                        <p className="text-[9px] text-gray-500 font-bold mt-2 uppercase tracking-tighter">Осталось: 30д 12ч 44м {currentTime.getSeconds()}с</p>
                      </div>
                      <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                        <Clock className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className={viewMode === 'desktop' ? 'col-span-12' : ''}>
                  <div className="bg-blue-50 border border-blue-100 p-5 rounded-[2rem] flex items-start gap-4 shadow-sm">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-blue-600">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-blue-900 leading-none">Старт обучения: {productData.pricing[1].fixedStartDate} в {productData.pricing[1].fixedStartTime}</p>
                      <p className="text-[10px] text-blue-600 font-bold mt-1">Доступ к контенту откроется автоматически.</p>
                    </div>
                  </div>
                </div>

                <div className={viewMode === 'desktop' ? 'col-span-8' : ''}>
                  <div className="p-10 rounded-[2.5rem] relative overflow-hidden transition-all shadow-sm min-h-[200px] flex flex-col justify-center" style={{ backgroundColor: 'var(--p-bg)' }}>
                    <h2 className="text-3xl font-black tracking-tighter leading-none">Заполните <br />анкету профиля</h2>
                    <p className="text-xs font-bold text-muted-foreground mt-4 max-w-[200px]">Это поможет адаптировать материалы под возраст ваших детей</p>
                    <button className="mt-6 w-fit px-8 py-3 rounded-2xl text-white text-xs font-bold shadow-lg active:scale-95 transition-all" style={{ backgroundColor: productData.color }}>Открыть анкету</button>
                  </div>
                </div>

                <div className={viewMode === 'desktop' ? 'col-span-12 grid grid-cols-3 gap-4' : 'grid grid-cols-2 gap-4'}>
                  {[1, 2, 3].map(i => (
                    <div key={i} className="p-6 bg-muted border border-dashed border-border rounded-[2rem] flex flex-col items-center justify-center gap-3 opacity-60">
                      <Lock className="w-6 h-6 text-muted-foreground" />
                      <div className="h-2 w-16 bg-border rounded-full" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tier Modal */}
      {editingTier && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden">
            <header className="p-8 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black tracking-tight">Параметры доступа</h3>
                <p className="text-xs text-muted-foreground font-bold uppercase">{editingTier.label}</p>
              </div>
              <button onClick={() => setEditingTier(null)} className="p-2 hover:bg-muted rounded-full"><X /></button>
            </header>

            <div className="p-8 space-y-8 overflow-y-auto max-h-[70vh]">
              <div className="space-y-4">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Старт продукта</p>
                <select
                  value={editingTier.startDateType}
                  onChange={(e) => setEditingTier({ ...editingTier, startDateType: e.target.value })}
                  className="admin-input"
                >
                  <option value="immediate">Сразу после оплаты</option>
                  <option value="fixed">В конкретный момент (запуск)</option>
                </select>

                {editingTier.startDateType === 'fixed' && (
                  <div className="p-6 bg-blue-50 rounded-[2rem] border border-blue-100 space-y-5 shadow-inner">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-blue-800 uppercase flex items-center gap-1"><Calendar className="w-3 h-3" /> Дата</label>
                        <input type="date" value={editingTier.fixedStartDate} onChange={(e) => setEditingTier({ ...editingTier, fixedStartDate: e.target.value })} className="w-full p-4 bg-white border border-blue-200 rounded-2xl font-bold text-sm outline-none shadow-sm focus:ring-2 focus:ring-blue-400" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-blue-800 uppercase flex items-center gap-1"><Clock className="w-3 h-3" /> Время</label>
                        <input type="time" value={editingTier.fixedStartTime} onChange={(e) => setEditingTier({ ...editingTier, fixedStartTime: e.target.value })} className="w-full p-4 bg-white border border-blue-200 rounded-2xl font-bold text-sm outline-none shadow-sm focus:ring-2 focus:ring-blue-400" />
                      </div>
                    </div>
                    <label className="flex items-center gap-3 p-4 bg-white/50 rounded-2xl cursor-pointer hover:bg-white transition-colors">
                      <input type="checkbox" checked={editingTier.preAccessEnabled} onChange={(e) => setEditingTier({ ...editingTier, preAccessEnabled: e.target.checked })} className="w-5 h-5 accent-blue-600 rounded-lg" />
                      <span className="text-xs font-bold text-blue-900 leading-tight">Разрешить вход до наступления старта</span>
                    </label>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Окончание доступа</p>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => setEditingTier({ ...editingTier, expirationType: 'exact' })} className={`p-4 rounded-2xl border transition-all text-left ${editingTier.expirationType === 'exact' ? 'border-foreground bg-foreground text-card shadow-lg' : 'border-border bg-muted'}`}>
                    <Clock className="w-5 h-5 mb-2" />
                    <p className="text-xs font-bold leading-tight">Точно до секунды</p>
                  </button>
                  <button onClick={() => setEditingTier({ ...editingTier, expirationType: 'endOfDay' })} className={`p-4 rounded-2xl border transition-all text-left ${editingTier.expirationType === 'endOfDay' ? 'border-foreground bg-foreground text-card shadow-lg' : 'border-border bg-muted'}`}>
                    <Clock className="w-5 h-5 mb-2" />
                    <p className="text-xs font-bold leading-tight">Конец суток</p>
                  </button>
                </div>
              </div>
            </div>

            <footer className="p-8 border-t border-border flex gap-3 bg-muted/50">
              <button onClick={() => setEditingTier(null)} className="flex-1 py-4 font-black text-xs uppercase text-muted-foreground hover:text-foreground transition-colors">Отмена</button>
              <button onClick={() => saveTier(editingTier)} className="flex-1 py-4 bg-foreground text-card rounded-2xl font-black text-xs shadow-xl active:scale-95 transition-all uppercase flex items-center justify-center gap-2">
                <Check className="w-4 h-4" /> Сохранить
              </button>
            </footer>
          </div>
        </div>
      )}
    </>
  );
}
