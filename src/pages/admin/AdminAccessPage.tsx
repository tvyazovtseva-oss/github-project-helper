import { useState } from 'react';
import { Settings, Plus, Trash2, Save, Smartphone, Monitor, Palette, Clock, Calendar } from 'lucide-react';

interface Tier {
  id: string;
  name: string;
  price: number;
  duration: string;
  preAccess: number;
}

export default function AdminAccessPage() {
  const [product, setProduct] = useState({
    name: 'Клуб Anna MAMA',
    color: '#f43f5e',
    tiers: [
      { id: '1', name: 'Месячный', price: 1900, duration: '30', preAccess: 0 },
      { id: '2', name: 'Годовой VIP', price: 12000, duration: '365', preAccess: 7 },
    ] as Tier[],
  });
  const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('mobile');

  const handleAddTier = () => {
    setProduct({ ...product, tiers: [...product.tiers, { id: Date.now().toString(), name: 'Новый тариф', price: 0, duration: '30', preAccess: 0 }] });
  };

  const handleUpdateTier = (id: string, updates: Partial<Tier>) => {
    setProduct({ ...product, tiers: product.tiers.map(t => t.id === id ? { ...t, ...updates } : t) });
  };

  const handleDeleteTier = (id: string) => {
    setProduct({ ...product, tiers: product.tiers.filter(t => t.id !== id) });
  };

  return (
    <div className="p-6 lg:p-8 max-w-6xl animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-ink-900">Настройка доступа</h1>
            <Settings className="w-5 h-5 text-brand-500" />
          </div>
          <p className="text-sm text-ink-400 mt-1">Управление тарифами и логикой</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Settings */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-surface-200 p-6">
            <h3 className="font-bold text-ink-900 mb-4 flex items-center gap-2"><Palette className="w-4 h-4 text-brand-500" /> Базовые параметры</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-ink-400 mb-1 block">Название продукта</label>
                <input value={product.name} onChange={(e) => setProduct({ ...product, name: e.target.value })} className="admin-input" />
              </div>
              <div>
                <label className="text-xs font-bold text-ink-400 mb-1 block">Акцентный цвет</label>
                <div className="flex gap-3">
                  <input type="color" value={product.color} onChange={(e) => setProduct({ ...product, color: e.target.value })} className="h-12 w-12 rounded-xl cursor-pointer border-0 p-0" />
                  <input value={product.color} onChange={(e) => setProduct({ ...product, color: e.target.value })} className="admin-input uppercase font-mono flex-1" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-surface-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-ink-900">Тарифы и сроки</h3>
              <button onClick={handleAddTier} className="text-xs font-bold text-brand-500 flex items-center gap-1"><Plus className="w-3 h-3" /> Добавить</button>
            </div>
            <div className="space-y-4">
              {product.tiers.map(tier => (
                <div key={tier.id} className="p-4 bg-surface-50 rounded-xl space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-ink-300">Название</label>
                      <input value={tier.name} onChange={(e) => handleUpdateTier(tier.id, { name: e.target.value })} className="admin-input text-xs py-2.5 px-3" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-ink-300">Цена (₽)</label>
                      <input type="number" value={tier.price} onChange={(e) => handleUpdateTier(tier.id, { price: parseInt(e.target.value) || 0 })} className="admin-input text-xs py-2.5 px-3 font-mono" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-ink-300 flex items-center gap-1"><Clock className="w-3 h-3" /> Длительность</label>
                      <select value={tier.duration} onChange={(e) => handleUpdateTier(tier.id, { duration: e.target.value })} className="admin-input text-xs py-2.5 px-3">
                        <option value="30">30 дней</option>
                        <option value="90">90 дней</option>
                        <option value="180">180 дней</option>
                        <option value="365">365 дней</option>
                        <option value="forever">Навсегда</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-ink-300 flex items-center gap-1"><Calendar className="w-3 h-3" /> Пред-доступ</label>
                      <select value={tier.preAccess} onChange={(e) => handleUpdateTier(tier.id, { preAccess: parseInt(e.target.value) })} className="admin-input text-xs py-2.5 px-3">
                        <option value="0">Нет</option>
                        <option value="3">3 дня</option>
                        <option value="7">7 дней</option>
                      </select>
                    </div>
                  </div>
                  <button onClick={() => handleDeleteTier(tier.id)} className="p-2 text-ink-300 hover:text-destructive hover:bg-destructive/5 rounded-lg transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button className="btn-primary flex items-center justify-center gap-2">
            <Save className="w-4 h-4" /> Сохранить настройки
          </button>
        </div>

        {/* Preview */}
        <div>
          <div className="sticky top-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-ink-400">Превью карточки</span>
              <div className="flex bg-surface-100 rounded-lg p-0.5">
                <button onClick={() => setPreviewMode('mobile')} className={`p-1.5 rounded-md transition-all ${previewMode === 'mobile' ? 'bg-white shadow-sm text-ink-900' : 'text-ink-400'}`}><Smartphone className="w-4 h-4" /></button>
                <button onClick={() => setPreviewMode('desktop')} className={`p-1.5 rounded-md transition-all ${previewMode === 'desktop' ? 'bg-white shadow-sm text-ink-900' : 'text-ink-400'}`}><Monitor className="w-4 h-4" /></button>
              </div>
            </div>
            <div className={`bg-white rounded-3xl border-2 border-surface-200 overflow-hidden mx-auto transition-all ${previewMode === 'mobile' ? 'max-w-[320px]' : 'max-w-full'}`}>
              <div className="p-6" style={{ background: `linear-gradient(135deg, ${product.color}, ${product.color}88)` }}>
                <span className="text-white/70 text-[10px] font-bold uppercase">Подписка</span>
                <h3 className="text-white text-xl font-bold mt-1" style={{ lineHeight: '1.2' }}>{product.name}</h3>
              </div>
              <div className="p-4 space-y-2">
                <p className="text-xs font-bold text-ink-400 mb-2">Выберите тариф:</p>
                {product.tiers.map((tier, i) => (
                  <div key={tier.id} className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all ${i === 0 ? 'border-current' : 'border-surface-200'}`} style={i === 0 ? { borderColor: product.color } : undefined}>
                    <span className="text-sm font-bold text-ink-900">{tier.name}</span>
                    <span className="text-sm font-bold" style={{ color: product.color }}>{tier.price} ₽</span>
                  </div>
                ))}
                <button className="w-full py-3 rounded-2xl text-white font-bold text-sm mt-3" style={{ backgroundColor: product.color }}>Оформить доступ</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
