import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Heart, BookOpen, MessageCircle, TrendingUp, Calendar, Star,
  Syringe, TestTube, Stethoscope, Ruler, ChevronRight, Eye, EyeOff,
  Baby, GraduationCap, Users, Sparkles
} from 'lucide-react';

const FEED_ITEMS = [
  { id: 1, title: 'Вебинар: Первый прикорм', desc: 'Прямой эфир с педиатром. Завтра в 19:00', tag: 'Скоро', color: '#FF9500', source: 'Клуб Anna MAMA', link: '/mama/courses/club_main', read: false },
  { id: 2, title: 'Новый гайд: Сон без слёз', desc: 'Авторская методика Анны для детей 0-3', tag: 'Новое', color: '#F43F5E', source: 'Библиотека', link: '/mama/library', read: false },
  { id: 3, title: 'Обновление библиотеки', desc: 'Добавлено 12 новых материалов по здоровью', tag: 'Контент', color: '#34C759', source: 'Библиотека', link: '/mama/library', read: true },
  { id: 4, title: 'Урок 5 доступен', desc: 'Курс «Сон малыша» — новый модуль открыт', tag: 'Курс', color: '#5856D6', source: 'Сон малыша', link: '/mama/courses/course_sleep', read: false },
];

const HEALTH_SUMMARY = [
  { key: 'vaccines', icon: Syringe, label: 'Прививки', value: '8 из 12', color: '#FF9500' },
  { key: 'tests', icon: TestTube, label: 'Анализы', value: '3 запланировано', color: '#AF52DE' },
  { key: 'checkups', icon: Stethoscope, label: 'Чекапы', value: 'Следующий: 6 мес', color: '#007AFF' },
  { key: 'growth', icon: Ruler, label: 'Замеры', value: '9.6 кг / 76 см', color: '#34C759' },
];

const ACTIVE_PRODUCTS = [
  { id: 'club_main', name: 'Клуб Anna MAMA', type: 'subscription' as const, color: '#FF2D55', expires: '24.04.2026', icon: Users },
  { id: 'club_woman', name: 'Женская Среда', type: 'subscription' as const, color: '#AF52DE', expires: '12.05.2026', icon: Users },
  { id: 'course_first_aid', name: 'Первая Помощь', type: 'course' as const, color: '#FF9500', progress: 65, icon: GraduationCap },
  { id: 'course_sleep', name: 'Сон малыша', type: 'course' as const, color: '#5856D6', progress: 30, icon: GraduationCap },
];

const MOCK_CHILD = {
  name: 'София',
  birthdate: '2024-01-15',
  ageText: '1 год 2 мес',
  weight: '9.6 кг',
  height: '76 см',
  profileProgress: 72,
};

export default function MamaHomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [feed, setFeed] = useState(FEED_ITEMS);
  const [expandedHealth, setExpandedHealth] = useState<string | null>(null);

  const hideFeedItem = (id: number) => {
    setFeed(prev => prev.filter(i => i.id !== id));
  };

  const markRead = (id: number) => {
    setFeed(prev => prev.map(i => i.id === id ? { ...i, read: true } : i));
  };

  return (
    <div className="pb-6 animate-fade-in">
      {/* Personalized hero banner */}
      <div className="relative mx-4 mt-4 p-6 rounded-3xl overflow-hidden" style={{ background: 'linear-gradient(135deg, var(--product-color), #FF6B8A)' }}>
        <div className="relative z-10">
          <p className="text-white/70 text-xs font-bold uppercase tracking-wider mb-1">Добрый день</p>
          <h2 className="text-white text-xl font-bold mb-1" style={{ lineHeight: '1.2' }}>
            {user?.full_name || 'Мама'}
          </h2>
          <p className="text-white/80 text-sm mb-4">
            {MOCK_CHILD.name} — {MOCK_CHILD.ageText}
          </p>
          <button
            onClick={() => navigate('/mama/courses')}
            className="px-5 py-2.5 bg-white rounded-2xl text-sm font-bold active:scale-95 transition-transform"
            style={{ color: 'var(--product-color)' }}
          >
            Перейти к урокам
          </button>
        </div>
        <Heart className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10" />
      </div>

      {/* Baby profile card */}
      <div className="mx-4 mt-5">
        <button
          onClick={() => navigate('/mama/profile')}
          className="w-full flex items-center gap-4 p-4 bg-surface-50 rounded-2xl active:scale-[0.98] transition-transform"
        >
          <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center shrink-0">
            <Baby className="w-6 h-6 text-brand-500" />
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="font-bold text-sm text-ink-900">{MOCK_CHILD.name}</p>
            <p className="text-xs text-ink-400">{MOCK_CHILD.ageText} · {MOCK_CHILD.weight} · {MOCK_CHILD.height}</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-[10px] font-bold text-ink-300">Профиль</span>
            <div className="w-16 h-1.5 bg-surface-200 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-brand-500" style={{ width: `${MOCK_CHILD.profileProgress}%` }} />
            </div>
            <span className="text-[10px] text-ink-300">{MOCK_CHILD.profileProgress}%</span>
          </div>
        </button>
      </div>

      {/* Health card — accordion summary */}
      <div className="mt-6 px-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-ink-900">Медкарта</h3>
          <button onClick={() => navigate('/mama/health')} className="text-xs font-bold text-brand-500">
            Полная карта →
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {HEALTH_SUMMARY.map(item => (
            <button
              key={item.key}
              onClick={() => setExpandedHealth(expandedHealth === item.key ? null : item.key)}
              className="w-full flex items-center gap-3 p-3.5 bg-surface-50 rounded-2xl active:scale-[0.98] transition-transform"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: item.color + '15' }}>
                <item.icon className="w-5 h-5" style={{ color: item.color }} />
              </div>
              <div className="flex-1 text-left">
                <p className="text-xs font-bold text-ink-900">{item.label}</p>
                <p className="text-[11px] text-ink-400">{item.value}</p>
              </div>
              <ChevronRight className={`w-4 h-4 text-ink-200 transition-transform ${expandedHealth === item.key ? 'rotate-90' : ''}`} />
            </button>
          ))}
        </div>
      </div>

      {/* Active subscriptions & courses */}
      <div className="mt-6 px-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-ink-900">Мои продукты</h3>
          <button onClick={() => navigate('/mama/courses')} className="text-xs font-bold text-brand-500">
            Все →
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pb-1">
          {ACTIVE_PRODUCTS.map(p => (
            <button
              key={p.id}
              onClick={() => navigate(`/mama/courses/${p.id}`)}
              className="p-4 bg-surface-50 rounded-2xl active:scale-[0.96] transition-transform text-left"
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: p.color + '15' }}>
                <p.icon className="w-4 h-4" style={{ color: p.color }} />
              </div>
              <p className="text-xs font-bold text-ink-900 truncate">{p.name}</p>
              {p.type === 'subscription' ? (
                <p className="text-[10px] text-ink-400 mt-1">до {p.expires}</p>
              ) : (
                <div className="mt-2">
                  <div className="w-full h-1.5 bg-surface-200 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${p.progress}%`, backgroundColor: p.color }} />
                  </div>
                  <p className="text-[10px] text-ink-400 mt-1">{p.progress}%</p>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Global feed */}
      <div className="mt-6 px-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-ink-900">Обновления</h3>
          <button onClick={() => navigate('/mama/notifications')} className="text-xs font-bold text-brand-500">
            Все →
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {feed.map(item => (
            <div
              key={item.id}
              onClick={() => { markRead(item.id); navigate(item.link); }}
              className={`p-4 rounded-2xl active:scale-[0.98] transition-transform cursor-pointer ${item.read ? 'bg-surface-50' : 'bg-surface-50 ring-1 ring-brand-200'}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: item.color }}>
                    {item.tag}
                  </span>
                  <span className="text-[10px] text-ink-300">{item.source}</span>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); hideFeedItem(item.id); }}
                  className="p-1 rounded-full hover:bg-surface-200 transition-colors"
                >
                  <EyeOff className="w-3.5 h-3.5 text-ink-200" />
                </button>
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
