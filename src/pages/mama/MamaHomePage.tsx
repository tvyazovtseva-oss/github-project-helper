import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Heart, ChevronRight, EyeOff,
  GraduationCap, Users, Sparkles, X, Check,
  BookOpen, FileText, Headphones, Play, ListChecks, AlertTriangle
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  TOPICS, SUBTOPICS, AGE_TAGS, CONTENT_LIBRARY,
  CONTENT_TYPE_LABELS, DIFFICULTY_LABELS,
  getSubtopicsForTopics, getAgeTagForMonths, filterContent,
  type ContentItem, type Difficulty, type ContentTag,
} from '@/lib/contentData';

const FEED_ITEMS = [
  { id: 1, title: 'Вебинар: Первый прикорм', desc: 'Прямой эфир с педиатром. Завтра в 19:00', tag: 'Скоро', color: '#FF9500', source: 'Клуб Аннамама', link: '/mama/courses/club_main', read: false },
  { id: 2, title: 'Новый гайд: Сон без слёз', desc: 'Авторская методика Анны для детей 0-3', tag: 'Новое', color: '#F43F5E', source: 'Библиотека', link: '/mama/library', read: false },
  { id: 3, title: 'Обновление библиотеки', desc: 'Добавлено 12 новых материалов по здоровью', tag: 'Контент', color: '#34C759', source: 'Библиотека', link: '/mama/library', read: true },
  { id: 4, title: 'Урок 5 доступен', desc: 'Курс «Сон малыша» — новый модуль открыт', tag: 'Курс', color: '#5856D6', source: 'Сон малыша', link: '/mama/courses/course_sleep', read: false },
];

const ACTIVE_PRODUCTS = [
  { id: 'club_main', name: 'Клуб Аннамама', type: 'subscription' as const, color: '#FF2D55', expires: '24.04.2026', icon: Users },
  { id: 'club_woman', name: 'Женская Среда', type: 'subscription' as const, color: '#AF52DE', expires: '12.05.2026', icon: Users },
  { id: 'course_first_aid', name: 'Первая Помощь', type: 'course' as const, color: '#FF9500', progress: 65, icon: GraduationCap },
  { id: 'course_sleep', name: 'Сон малыша', type: 'course' as const, color: '#5856D6', progress: 30, icon: GraduationCap },
];

// Check if user has Club subscription (mock)
const HAS_CLUB = true;
// Mock child age in months (from profile)
const CHILD_AGE_MONTHS = 14; // ~1 year 2 months

const CONTENT_ICONS = {
  video: Play,
  audio: Headphones,
  pdf: FileText,
  guide: BookOpen,
  checklist: ListChecks,
};

interface QuestionnaireState {
  step: number; // 1=topics, 2=subtopics, 3=params
  selectedTopics: string[];
  selectedSubtopics: string[];
  materialsCount: number;
  difficulty: Difficulty;
}

export default function MamaHomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [feed, setFeed] = useState(FEED_ITEMS);

  // Questionnaire state
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [q, setQ] = useState<QuestionnaireState>({
    step: 1,
    selectedTopics: [],
    selectedSubtopics: [],
    materialsCount: 5,
    difficulty: 'beginner',
  });
  const [weeklyPlan, setWeeklyPlan] = useState<ContentItem[] | null>(null);
  const [contentGap, setContentGap] = useState<string | null>(null);

  const availableSubtopics = useMemo(() =>
    getSubtopicsForTopics(q.selectedTopics),
    [q.selectedTopics]
  );

  const hideFeedItem = (id: number) => {
    setFeed(prev => prev.filter(i => i.id !== id));
  };

  const markRead = (id: number) => {
    setFeed(prev => prev.map(i => i.id === id ? { ...i, read: true } : i));
  };

  const toggleTopic = (id: string) => {
    setQ(prev => {
      const selected = prev.selectedTopics.includes(id)
        ? prev.selectedTopics.filter(t => t !== id)
        : prev.selectedTopics.length < 3
          ? [...prev.selectedTopics, id]
          : prev.selectedTopics;
      return { ...prev, selectedTopics: selected };
    });
  };

  const toggleSubtopic = (id: string) => {
    setQ(prev => ({
      ...prev,
      selectedSubtopics: prev.selectedSubtopics.includes(id)
        ? prev.selectedSubtopics.filter(t => t !== id)
        : [...prev.selectedSubtopics, id],
    }));
  };

  const generatePlan = () => {
    const ageTag = getAgeTagForMonths(CHILD_AGE_MONTHS);
    const results = filterContent(CONTENT_LIBRARY, {
      topics: q.selectedTopics,
      subtopics: q.selectedSubtopics.length > 0 ? q.selectedSubtopics : undefined,
      ageTag,
      difficulty: q.difficulty,
      limit: q.materialsCount,
    });

    if (results.length < q.materialsCount) {
      setContentGap(`Найдено ${results.length} из ${q.materialsCount} запрошенных материалов`);
      // In production: send alert to admin content factory
      console.log('[ContentGap Alert]', {
        topics: q.selectedTopics,
        subtopics: q.selectedSubtopics,
        available: results.length,
        requested: q.materialsCount,
      });
    } else {
      setContentGap(null);
    }

    setWeeklyPlan(results);
    setShowQuestionnaire(false);
  };

  const resetQuestionnaire = () => {
    setQ({ step: 1, selectedTopics: [], selectedSubtopics: [], materialsCount: 5, difficulty: 'beginner' });
    setWeeklyPlan(null);
    setContentGap(null);
  };

  return (
    <div className="pb-6 animate-fade-in">
      {/* Personalized hero banner */}
      <div className="relative mx-4 mt-4 p-6 rounded-3xl overflow-hidden" style={{ background: 'linear-gradient(135deg, var(--product-color), #FF6B8A)' }}>
        <div className="relative z-10">
          <p className="text-white/70 text-xs font-bold uppercase tracking-wider mb-1">Добрый день</p>
          <h2 className="text-white text-xl font-bold mb-3" style={{ lineHeight: '1.2' }}>
            {user?.full_name || 'Мама'}
          </h2>
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

      {/* Club Questionnaire CTA (only for Club subscribers) */}
      {HAS_CLUB && !weeklyPlan && (
        <div className="mx-4 mt-4">
          <button
            onClick={() => setShowQuestionnaire(true)}
            className="w-full p-4 bg-surface-50 rounded-2xl flex items-center gap-3 active:scale-[0.98] transition-transform text-left"
          >
            <div className="w-11 h-11 rounded-xl bg-brand-100 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-brand-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm text-ink-900">Индивидуальный план на неделю</p>
              <p className="text-xs text-ink-400 mt-0.5">Выберите темы и получите подборку материалов</p>
            </div>
            <ChevronRight className="w-4 h-4 text-ink-200 shrink-0" />
          </button>
        </div>
      )}

      {/* Weekly Plan Results */}
      {weeklyPlan && (
        <div className="mx-4 mt-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-ink-900">📋 Ваш план на неделю</h3>
            <button onClick={resetQuestionnaire} className="text-xs font-bold text-brand-500">
              Изменить →
            </button>
          </div>

          {contentGap && (
            <div className="p-3 bg-amber-50 rounded-2xl flex items-start gap-2.5 mb-3">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-amber-700">{contentGap}</p>
                <p className="text-[10px] text-amber-600 mt-0.5">Увы, в этой теме пока не так много материалов, но мы уже работаем над этим!</p>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {weeklyPlan.map((item, idx) => {
              const Icon = CONTENT_ICONS[item.type];
              return (
                <div key={item.id} className="flex items-center gap-3 p-3.5 bg-surface-50 rounded-2xl active:scale-[0.98] transition-transform cursor-pointer">
                  <div className="w-8 h-8 rounded-lg bg-brand-100 flex items-center justify-center shrink-0 text-[10px] font-bold text-brand-500">
                    {idx + 1}
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-surface-100 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-ink-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-ink-900 truncate">{item.title}</p>
                    <p className="text-[10px] text-ink-400">
                      {CONTENT_TYPE_LABELS[item.type]}
                      {item.duration && ` · ${item.duration}`}
                      {item.fileSize && ` · ${item.fileSize}`}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {weeklyPlan.length === 0 && (
            <div className="p-6 bg-surface-50 rounded-2xl text-center">
              <AlertTriangle className="w-8 h-8 text-ink-200 mx-auto mb-2" />
              <p className="text-sm font-bold text-ink-500">Нет подходящих материалов</p>
              <p className="text-xs text-ink-300 mt-1">Попробуйте выбрать другие темы или снизить сложность</p>
            </div>
          )}
        </div>
      )}

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

      {/* ─── Questionnaire Dialog ──────────────────────────────── */}
      <Dialog open={showQuestionnaire} onOpenChange={setShowQuestionnaire}>
        <DialogContent className="sm:max-w-md rounded-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-500" />
              Индивидуальный план
            </DialogTitle>
          </DialogHeader>

          {/* Step indicator */}
          <div className="flex gap-1.5 mb-2">
            {[1, 2, 3].map(s => (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full transition-all ${s <= q.step ? 'bg-brand-500' : 'bg-surface-200'}`}
              />
            ))}
          </div>

          {/* Step 1: Topics */}
          {q.step === 1 && (
            <div className="space-y-3 animate-fade-in">
              <p className="text-sm text-ink-500">Выберите 2–3 темы на эту неделю</p>
              <div className="grid grid-cols-2 gap-2">
                {TOPICS.map(t => (
                  <button
                    key={t.id}
                    onClick={() => toggleTopic(t.id)}
                    className={`p-3 rounded-xl text-sm font-bold transition-all text-left ${
                      q.selectedTopics.includes(t.id)
                        ? 'bg-brand-500 text-white shadow-sm'
                        : 'bg-surface-50 text-ink-700 active:scale-95'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {q.selectedTopics.includes(t.id) && <Check className="w-3.5 h-3.5" />}
                      {t.label}
                    </span>
                  </button>
                ))}
              </div>
              <DialogFooter>
                <button
                  onClick={() => setQ(prev => ({ ...prev, step: 2 }))}
                  disabled={q.selectedTopics.length === 0}
                  className="w-full py-3 bg-ink-900 text-white text-sm font-bold rounded-xl disabled:opacity-40 active:scale-95 transition-transform"
                >
                  Далее
                </button>
              </DialogFooter>
            </div>
          )}

          {/* Step 2: Subtopics */}
          {q.step === 2 && (
            <div className="space-y-3 animate-fade-in">
              <p className="text-sm text-ink-500">Уточните подтемы (необязательно)</p>
              <div className="space-y-1.5 max-h-60 overflow-y-auto">
                {availableSubtopics.map(s => (
                  <button
                    key={s.id}
                    onClick={() => toggleSubtopic(s.id)}
                    className={`w-full p-3 rounded-xl text-sm font-medium transition-all text-left flex items-center justify-between ${
                      q.selectedSubtopics.includes(s.id)
                        ? 'bg-brand-50 text-brand-600 ring-1 ring-brand-200'
                        : 'bg-surface-50 text-ink-700'
                    }`}
                  >
                    <span>{s.label}</span>
                    {q.selectedSubtopics.includes(s.id) && <Check className="w-4 h-4 text-brand-500" />}
                  </button>
                ))}
                {availableSubtopics.length === 0 && (
                  <p className="text-xs text-ink-300 text-center py-4">Подтемы для выбранных тем не найдены</p>
                )}
              </div>
              <DialogFooter className="flex gap-2">
                <button onClick={() => setQ(prev => ({ ...prev, step: 1 }))} className="flex-1 py-3 text-sm font-bold text-ink-400 rounded-xl">
                  Назад
                </button>
                <button
                  onClick={() => setQ(prev => ({ ...prev, step: 3 }))}
                  className="flex-1 py-3 bg-ink-900 text-white text-sm font-bold rounded-xl active:scale-95 transition-transform"
                >
                  Далее
                </button>
              </DialogFooter>
            </div>
          )}

          {/* Step 3: Params */}
          {q.step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <p className="text-xs font-bold text-ink-500 mb-2">Возраст ребёнка (из профиля)</p>
                <div className="px-4 py-3 bg-surface-50 rounded-xl text-sm font-bold text-ink-900">
                  {AGE_TAGS.find(a => a.id === getAgeTagForMonths(CHILD_AGE_MONTHS))?.label || '—'}
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-ink-500 mb-2">Количество материалов</p>
                <div className="flex gap-2">
                  {[3, 5, 7, 10].map(n => (
                    <button
                      key={n}
                      onClick={() => setQ(prev => ({ ...prev, materialsCount: n }))}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                        q.materialsCount === n ? 'bg-ink-900 text-white' : 'bg-surface-50 text-ink-500'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-ink-500 mb-2">Сложность</p>
                <div className="flex gap-2">
                  {(['beginner', 'intermediate', 'advanced'] as Difficulty[]).map(d => (
                    <button
                      key={d}
                      onClick={() => setQ(prev => ({ ...prev, difficulty: d }))}
                      className={`flex-1 py-2.5 rounded-xl text-[11px] font-bold transition-all ${
                        q.difficulty === d ? 'bg-ink-900 text-white' : 'bg-surface-50 text-ink-500'
                      }`}
                    >
                      {DIFFICULTY_LABELS[d]}
                    </button>
                  ))}
                </div>
              </div>

              <DialogFooter className="flex gap-2">
                <button onClick={() => setQ(prev => ({ ...prev, step: 2 }))} className="flex-1 py-3 text-sm font-bold text-ink-400 rounded-xl">
                  Назад
                </button>
                <button
                  onClick={generatePlan}
                  className="flex-1 py-3 bg-brand-500 text-white text-sm font-bold rounded-xl active:scale-95 transition-transform"
                >
                  Получить план ✨
                </button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
