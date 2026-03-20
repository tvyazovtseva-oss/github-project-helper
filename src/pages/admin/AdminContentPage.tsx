import { useState } from 'react';
import {
  Database, Search, TrendingUp, AlertTriangle,
  FilePlus, Star, Filter, PlayCircle, FileText, BookOpen
} from 'lucide-react';

const SEARCH_GAPS = [
  { term: 'как отучить от груди ночью', count: 142, trend: '+15%', status: 'critical', suggestion: 'Снять видео-инструкцию' },
  { term: 'аллергия на прикорм сыпь', count: 89, trend: '+5%', status: 'warning', suggestion: 'Написать памятку (PDF)' },
  { term: 'почему плачет перед сном', count: 312, trend: '-2%', status: 'normal', suggestion: 'Обновить урок в курсе' },
];

const INITIAL_CONTENT = [
  { id: 1, title: 'Как наладить сон ребёнка до года', type: 'video', views: 3420, rating: 4.9, comments: 156 },
  { id: 2, title: 'Памятка: Введение прикорма', type: 'pdf', views: 890, rating: 4.8, comments: 24 },
  { id: 3, title: 'Что делать при коликах?', type: 'article', views: 5600, rating: 4.5, comments: 312 },
];

const TYPE_ICONS: Record<string, typeof PlayCircle> = { video: PlayCircle, pdf: FileText, article: BookOpen };

export default function AdminContentPage() {
  const [content, setContent] = useState(INITIAL_CONTENT);
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = content.filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleAdd = () => {
    const title = prompt('Название нового материала:');
    if (title) setContent([{ id: Date.now(), title, type: 'article', views: 0, rating: 5.0, comments: 0 }, ...content]);
  };

  return (
    <div className="p-6 lg:p-8 max-w-6xl animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-ink-900">Фабрика контента</h1>
            <Database className="w-5 h-5 text-brand-500" />
          </div>
          <p className="text-sm text-ink-400 mt-1">Анализ пробелов и управление материалами</p>
        </div>
        <button onClick={handleAdd} className="flex items-center gap-2 px-6 py-3 bg-ink-900 text-white rounded-2xl text-sm font-bold active:scale-[0.97] transition-transform">
          <FilePlus className="w-4 h-4" /> Добавить материал
        </button>
      </div>

      {/* Search gaps */}
      <div className="bg-white rounded-2xl border border-surface-200 p-6 mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Search className="w-4 h-4 text-brand-500" />
          <h3 className="font-bold text-sm text-ink-900">Что мамы ищут, но не находят?</h3>
        </div>
        <p className="text-xs text-ink-400 mb-4">Слова из поиска по базе без результатов</p>
        <div className="space-y-3">
          {SEARCH_GAPS.map((gap, i) => (
            <div key={i} className="p-4 bg-surface-50 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-ink-900">"{gap.term}"</span>
                <span className="text-xs text-ink-400">{gap.count} запросов</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> {gap.trend}</span>
                <button className="text-[10px] font-bold text-brand-500 hover:text-brand-600">Создать ТЗ для AI →</button>
              </div>
              {gap.status === 'critical' && (
                <div className="flex gap-2 mt-3 p-3 bg-destructive/5 rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                  <p className="text-xs text-ink-500">Много мамочек столкнулись с этой проблемой. Рекомендуем: {gap.suggestion}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content table */}
      <div className="bg-white rounded-2xl border border-surface-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-200">
          <h3 className="font-bold text-ink-900">База материалов</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-ink-300" />
            <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Поиск..." className="pl-8 pr-3 py-1.5 text-xs bg-surface-50 border border-surface-200 rounded-lg outline-none focus:border-brand-500 w-48" />
          </div>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-ink-400 border-b border-surface-200">
              <th className="text-left px-6 py-3 font-bold text-xs">Материал</th>
              <th className="text-right px-6 py-3 font-bold text-xs hidden md:table-cell">Статистика</th>
              <th className="text-right px-6 py-3 font-bold text-xs hidden md:table-cell">Оценка</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(item => {
              const Icon = TYPE_ICONS[item.type] || BookOpen;
              return (
                <tr key={item.id} className="border-t border-surface-100 hover:bg-surface-50/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-brand-500 shrink-0" />
                      <div>
                        <p className="font-bold text-ink-900">{item.title}</p>
                        <p className="text-[10px] text-ink-300 uppercase">{item.type}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right hidden md:table-cell">
                    <p className="text-xs text-ink-500">{item.views.toLocaleString()} просмотров</p>
                    <p className="text-[10px] text-ink-300">{item.comments} коммент.</p>
                  </td>
                  <td className="px-6 py-4 text-right hidden md:table-cell">
                    <div className="flex items-center justify-end gap-1">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className="text-xs font-bold">{item.rating}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-xs font-bold text-brand-500 bg-brand-50 px-3 py-1.5 rounded-lg hover:bg-brand-100 transition-colors">Редактировать</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
