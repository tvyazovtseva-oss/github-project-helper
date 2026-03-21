import { useNavigate } from 'react-router-dom';
import { GraduationCap, Users, ChevronRight } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  color: string;
  type: 'subscription' | 'course';
  expiresAt: string; // ISO datetime
  progress?: number;
  lessonsTotal?: number;
  lessonsCompleted?: number;
  materialsTotal?: number;
  materialsCompleted?: number;
}

const PRODUCTS: Product[] = [
  { id: 'club_main', name: 'Клуб Аннамама', description: 'Сообщество мам с экспертами и вебинарами', color: '#FF2D55', type: 'subscription', expiresAt: '2026-04-24T23:59:00', materialsTotal: 45, materialsCompleted: 28 },
  { id: 'club_woman', name: 'Женская Среда', description: 'Женское здоровье и психология', color: '#AF52DE', type: 'subscription', expiresAt: '2026-05-12T23:59:00', materialsTotal: 22, materialsCompleted: 9 },
  { id: 'course_first_aid', name: 'Первая Помощь', description: 'Экстренная помощь ребёнку от 0 до 7 лет', color: '#FF9500', type: 'course', expiresAt: '2027-12-31T23:59:00', progress: 65, lessonsTotal: 20, lessonsCompleted: 13 },
  { id: 'course_sleep', name: 'Сон малыша', description: 'Методика здорового сна для ребёнка', color: '#5856D6', type: 'course', expiresAt: '2025-03-01T23:59:00', progress: 30, lessonsTotal: 16, lessonsCompleted: 5 },
];

function formatExpiry(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function isExpired(iso: string): boolean {
  return new Date(iso).getTime() < Date.now();
}

export default function MamaCoursesPage() {
  const navigate = useNavigate();

  const subscriptions = PRODUCTS.filter(p => p.type === 'subscription');
  const courses = PRODUCTS.filter(p => p.type === 'course');

  return (
    <div className="pb-6 animate-fade-in">
      <div className="px-4 pt-5 pb-2">
        <h1 className="text-2xl font-bold text-ink-900" style={{ lineHeight: '1.15' }}>Мои продукты</h1>
        <p className="text-sm text-ink-400 mt-1">{PRODUCTS.filter(p => !isExpired(p.expiresAt)).length} активных</p>
      </div>

      {/* Subscriptions */}
      <div className="px-4 mt-4">
        <h2 className="text-xs font-bold text-ink-300 uppercase tracking-wider mb-3">Подписки</h2>
        <div className="space-y-3">
          {subscriptions.map(p => {
            const expired = isExpired(p.expiresAt);
            return (
              <button
                key={p.id}
                onClick={() => navigate(`/mama/courses/${p.id}`)}
                className={`w-full flex items-center gap-4 p-4 bg-surface-50 rounded-2xl active:scale-[0.98] transition-transform text-left ${expired ? 'opacity-50 grayscale' : ''}`}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: p.color + '15' }}>
                  <Users className="w-6 h-6" style={{ color: p.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-sm text-ink-900">{p.name}</p>
                    {expired && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-red-100 text-red-600">Не активен</span>
                    )}
                  </div>
                  <p className="text-xs text-ink-400 mt-0.5 truncate">{p.description}</p>
                  {p.materialsTotal && (
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex-1 h-1.5 bg-surface-200 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${((p.materialsCompleted || 0) / p.materialsTotal) * 100}%`, backgroundColor: p.color }} />
                      </div>
                      <span className="text-[10px] font-bold text-ink-400 shrink-0">{p.materialsCompleted}/{p.materialsTotal}</span>
                    </div>
                  )}
                  <p className="text-[10px] text-ink-300 mt-1">
                    {expired ? 'Истёк: ' : 'Доступ до: '}{formatExpiry(p.expiresAt)}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-ink-200 shrink-0" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Courses */}
      <div className="px-4 mt-6">
        <h2 className="text-xs font-bold text-ink-300 uppercase tracking-wider mb-3">Курсы</h2>
        <div className="space-y-3">
          {courses.map(p => {
            const expired = isExpired(p.expiresAt);
            return (
              <button
                key={p.id}
                onClick={() => navigate(`/mama/courses/${p.id}`)}
                className={`w-full flex items-center gap-4 p-4 bg-surface-50 rounded-2xl active:scale-[0.98] transition-transform text-left ${expired ? 'opacity-50 grayscale' : ''}`}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: p.color + '15' }}>
                  <GraduationCap className="w-6 h-6" style={{ color: p.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-sm text-ink-900">{p.name}</p>
                    {expired && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-red-100 text-red-600">Не активен</span>
                    )}
                  </div>
                  <p className="text-xs text-ink-400 mt-0.5 truncate">{p.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 h-1.5 bg-surface-200 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${p.progress}%`, backgroundColor: p.color }} />
                    </div>
                    <span className="text-[10px] font-bold text-ink-400 shrink-0">{p.lessonsCompleted}/{p.lessonsTotal}</span>
                  </div>
                  <p className="text-[10px] text-ink-300 mt-1">
                    {expired ? 'Истёк: ' : 'Доступ до: '}{formatExpiry(p.expiresAt)}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-ink-200 shrink-0" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
