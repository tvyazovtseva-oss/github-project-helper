import { Heart, BookOpen, MessageCircle, TrendingUp, Calendar, Star } from 'lucide-react';

const NEWS = [
  { id: 1, title: 'Вебинар: Первый прикорм', desc: 'Прямой эфир с педиатром. Завтра в 19:00', tag: 'Скоро', color: '#FF9500' },
  { id: 2, title: 'Новый гайд: Сон без слёз', desc: 'Авторская методика Анны для детей 0-3', tag: 'Новое', color: '#FF2D55' },
  { id: 3, title: 'Обновление библиотеки', desc: 'Добавлено 12 новых материалов по здоровью', tag: 'Контент', color: '#34C759' },
];

const QUICK_ACTIONS = [
  { icon: BookOpen, label: 'Уроки', color: '#5856D6' },
  { icon: MessageCircle, label: 'Чат', color: '#007AFF' },
  { icon: Calendar, label: 'Календарь', color: '#FF9500' },
  { icon: Star, label: 'Избранное', color: '#FFD60A' },
];

export default function MamaHomePage() {
  return (
    <div className="pb-6 animate-fade-in">
      {/* Hero banner */}
      <div className="relative mx-4 mt-4 p-6 rounded-3xl overflow-hidden" style={{ background: 'linear-gradient(135deg, var(--product-color), #FF6B8A)' }}>
        <div className="relative z-10">
          <p className="text-white/70 text-xs font-bold uppercase tracking-wider mb-1">Ваш клуб</p>
          <h2 className="text-white text-xl font-bold mb-2" style={{ lineHeight: '1.2' }}>Добро пожаловать в Anna MAMA</h2>
          <p className="text-white/80 text-sm mb-4">Подписка активна до 24.04.2026</p>
          <button className="px-5 py-2.5 bg-white rounded-2xl text-sm font-bold active:scale-95 transition-transform" style={{ color: 'var(--product-color)' }}>
            Перейти к урокам
          </button>
        </div>
        <Heart className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10" />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-4 gap-3 px-4 mt-6">
        {QUICK_ACTIONS.map((action, i) => (
          <button key={i} className="flex flex-col items-center gap-2 active:scale-90 transition-transform">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: action.color + '12' }}>
              <action.icon className="w-6 h-6" style={{ color: action.color }} />
            </div>
            <span className="text-[11px] font-semibold text-ink-500">{action.label}</span>
          </button>
        ))}
      </div>

      {/* News feed */}
      <div className="mt-8 px-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-ink-900">Новости</h3>
          <button className="text-xs font-bold text-brand-500">Все →</button>
        </div>
        <div className="space-y-3">
          {NEWS.map(item => (
            <div key={item.id} className="p-4 bg-surface-50 rounded-2xl active:scale-[0.98] transition-transform cursor-pointer">
              <div className="flex items-start justify-between mb-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: item.color }}>
                  {item.tag}
                </span>
                <TrendingUp className="w-4 h-4 text-ink-200" />
              </div>
              <h4 className="font-bold text-sm text-ink-900 mb-1">{item.title}</h4>
              <p className="text-xs text-ink-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
