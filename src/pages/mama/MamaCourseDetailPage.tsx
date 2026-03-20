import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, PlayCircle, FileText, Download, CheckCircle2, Lock, ChevronDown } from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  locked: boolean;
}

interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

interface Material {
  id: string;
  title: string;
  type: 'video' | 'guide' | 'file';
  size?: string;
}

const COURSES_DATA: Record<string, {
  name: string;
  color: string;
  description: string;
  author: string;
  modules: Module[];
  materials: Material[];
}> = {
  course_first_aid: {
    name: 'Первая Помощь',
    color: '#FF9500',
    description: 'Экстренная помощь ребёнку от 0 до 7 лет. Все ситуации — от температуры до травм.',
    author: 'Анна Петрова',
    modules: [
      {
        id: 'm1', title: 'Модуль 1: Основы', lessons: [
          { id: 'l1', title: 'Введение в первую помощь', duration: '12 мин', completed: true, locked: false },
          { id: 'l2', title: 'Аптечка для ребёнка', duration: '8 мин', completed: true, locked: false },
          { id: 'l3', title: 'Когда вызывать скорую', duration: '15 мин', completed: true, locked: false },
        ]
      },
      {
        id: 'm2', title: 'Модуль 2: Температура', lessons: [
          { id: 'l4', title: 'Виды термометров', duration: '6 мин', completed: true, locked: false },
          { id: 'l5', title: 'Алгоритм при температуре', duration: '18 мин', completed: false, locked: false },
          { id: 'l6', title: 'Жаропонижающие: дозировки', duration: '10 мин', completed: false, locked: false },
        ]
      },
      {
        id: 'm3', title: 'Модуль 3: Травмы', lessons: [
          { id: 'l7', title: 'Ушибы и ссадины', duration: '14 мин', completed: false, locked: true },
          { id: 'l8', title: 'Ожоги', duration: '12 мин', completed: false, locked: true },
        ]
      },
    ],
    materials: [
      { id: 'mat1', title: 'Памятка: Аптечка', type: 'file', size: '2.1 МБ' },
      { id: 'mat2', title: 'Видео: Реанимация младенца', type: 'video' },
      { id: 'mat3', title: 'Гайд: Температурный лист', type: 'guide' },
    ],
  },
  course_sleep: {
    name: 'Сон малыша',
    color: '#5856D6',
    description: 'Авторская методика здорового сна. Без слёз, пошаговое руководство.',
    author: 'Анна Петрова',
    modules: [
      {
        id: 'm1', title: 'Модуль 1: Теория сна', lessons: [
          { id: 'l1', title: 'Фазы сна ребёнка', duration: '10 мин', completed: true, locked: false },
          { id: 'l2', title: 'Нормы сна по возрасту', duration: '8 мин', completed: true, locked: false },
        ]
      },
      {
        id: 'm2', title: 'Модуль 2: Ритуалы', lessons: [
          { id: 'l3', title: 'Создание ритуала', duration: '15 мин', completed: false, locked: false },
          { id: 'l4', title: 'Среда для сна', duration: '12 мин', completed: false, locked: true },
        ]
      },
    ],
    materials: [
      { id: 'mat1', title: 'Чек-лист: Ритуал перед сном', type: 'file', size: '1.3 МБ' },
      { id: 'mat2', title: 'Гайд: Режим дня', type: 'guide' },
    ],
  },
  club_main: {
    name: 'Клуб Anna MAMA',
    color: '#FF2D55',
    description: 'Сообщество мам с доступом к экспертам, вебинарам и эксклюзивным материалам.',
    author: 'Анна Петрова',
    modules: [],
    materials: [
      { id: 'mat1', title: 'Запись вебинара: Прикорм', type: 'video' },
      { id: 'mat2', title: 'Гайд: Первые зубы', type: 'guide' },
      { id: 'mat3', title: 'Чек-лист: Развитие 0-12 мес', type: 'file', size: '0.8 МБ' },
    ],
  },
  club_woman: {
    name: 'Женская Среда',
    color: '#AF52DE',
    description: 'Женское здоровье, психология и восстановление после родов.',
    author: 'Анна Петрова',
    modules: [],
    materials: [
      { id: 'mat1', title: 'Гайд: Восстановление после родов', type: 'guide' },
      { id: 'mat2', title: 'Вебинар: Тревожность у мам', type: 'video' },
    ],
  },
};

const MATERIAL_ICONS = { video: PlayCircle, guide: FileText, file: Download };

export default function MamaCourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [expandedModule, setExpandedModule] = useState<string | null>('m1');

  const course = COURSES_DATA[id || ''];
  if (!course) {
    return (
      <div className="p-8 text-center animate-fade-in">
        <p className="text-ink-400 font-bold">Продукт не найден</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-brand-500 font-bold text-sm">← Назад</button>
      </div>
    );
  }

  const totalLessons = course.modules.reduce((s, m) => s + m.lessons.length, 0);
  const completedLessons = course.modules.reduce((s, m) => s + m.lessons.filter(l => l.completed).length, 0);

  return (
    <div className="pb-6 animate-fade-in">
      {/* Header */}
      <div className="relative p-6 rounded-b-3xl" style={{ background: `linear-gradient(135deg, ${course.color}, ${course.color}CC)` }}>
        <button onClick={() => navigate(-1)} className="mb-4 p-2 -ml-2 rounded-full active:bg-white/20 transition-colors">
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <h1 className="text-white text-xl font-bold mb-1" style={{ lineHeight: '1.2' }}>{course.name}</h1>
        <p className="text-white/70 text-xs font-bold mb-2">Автор: {course.author}</p>
        <p className="text-white/80 text-sm">{course.description}</p>
        {totalLessons > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-white/70 text-[10px] font-bold">{completedLessons} из {totalLessons} уроков</span>
              <span className="text-white font-bold text-xs">{Math.round((completedLessons / totalLessons) * 100)}%</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full transition-all" style={{ width: `${(completedLessons / totalLessons) * 100}%` }} />
            </div>
          </div>
        )}
      </div>

      {/* Modules / Program */}
      {course.modules.length > 0 && (
        <div className="px-4 mt-5">
          <h2 className="text-xs font-bold text-ink-300 uppercase tracking-wider mb-3">Программа</h2>
          <div className="space-y-2">
            {course.modules.map(mod => (
              <div key={mod.id} className="bg-surface-50 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setExpandedModule(expandedModule === mod.id ? null : mod.id)}
                  className="w-full flex items-center justify-between p-4 active:bg-surface-100 transition-colors"
                >
                  <span className="font-bold text-sm text-ink-900">{mod.title}</span>
                  <ChevronDown className={`w-4 h-4 text-ink-300 transition-transform ${expandedModule === mod.id ? 'rotate-180' : ''}`} />
                </button>
                {expandedModule === mod.id && (
                  <div className="px-4 pb-3 space-y-1.5">
                    {mod.lessons.map(lesson => (
                      <div
                        key={lesson.id}
                        className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${lesson.locked ? 'opacity-50' : 'active:bg-surface-100 cursor-pointer'}`}
                      >
                        {lesson.completed ? (
                          <CheckCircle2 className="w-5 h-5 shrink-0" style={{ color: course.color }} />
                        ) : lesson.locked ? (
                          <Lock className="w-5 h-5 text-ink-200 shrink-0" />
                        ) : (
                          <PlayCircle className="w-5 h-5 text-ink-300 shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-ink-900 font-medium truncate">{lesson.title}</p>
                          <p className="text-[10px] text-ink-300">{lesson.duration}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Materials */}
      {course.materials.length > 0 && (
        <div className="px-4 mt-6">
          <h2 className="text-xs font-bold text-ink-300 uppercase tracking-wider mb-3">Материалы</h2>
          <div className="space-y-2">
            {course.materials.map(mat => {
              const Icon = MATERIAL_ICONS[mat.type];
              return (
                <div key={mat.id} className="flex items-center gap-3 p-4 bg-surface-50 rounded-2xl active:scale-[0.98] transition-transform cursor-pointer">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: course.color + '15' }}>
                    <Icon className="w-5 h-5" style={{ color: course.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-ink-900 truncate">{mat.title}</p>
                    <p className="text-[10px] text-ink-300 uppercase">{mat.type}{mat.size ? ` · ${mat.size}` : ''}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
