import { useState } from 'react';
import { Search, BookOpen, PlayCircle, FileText, Star } from 'lucide-react';

const CATEGORIES = ['Все', 'Сон', 'Питание', 'Здоровье', 'Развитие', 'Психология'];

const MATERIALS = [
  { id: 1, title: 'Как наладить сон ребёнка до года', type: 'video', category: 'Сон', rating: 4.9 },
  { id: 2, title: 'Памятка: Введение прикорма', type: 'pdf', category: 'Питание', rating: 4.8 },
  { id: 3, title: 'Что делать при коликах?', type: 'article', category: 'Здоровье', rating: 4.5 },
  { id: 4, title: 'Когда начинать закаливание', type: 'article', category: 'Здоровье', rating: 4.7 },
  { id: 5, title: 'Этапы развития речи 0-3', type: 'video', category: 'Развитие', rating: 4.6 },
  { id: 6, title: 'Послеродовая тревожность', type: 'article', category: 'Психология', rating: 4.9 },
];

const TYPE_ICONS: Record<string, typeof BookOpen> = {
  video: PlayCircle,
  pdf: FileText,
  article: BookOpen,
};

export default function MamaLibraryPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Все');

  const filtered = MATERIALS.filter(m => {
    const matchSearch = m.title.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === 'Все' || m.category === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="pb-6 animate-fade-in">
      {/* Search */}
      <div className="px-4 pt-4 pb-2">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-300" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск материалов..."
            className="w-full pl-11 pr-4 py-3 bg-surface-100 rounded-2xl text-sm font-medium outline-none focus:bg-white focus:ring-2 focus:ring-brand-500/10 transition-all"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 px-4 py-3 overflow-x-auto no-scrollbar">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              activeCategory === cat
                ? 'text-white shadow-md'
                : 'bg-surface-100 text-ink-400 hover:bg-surface-200'
            }`}
            style={activeCategory === cat ? { backgroundColor: 'var(--product-color)' } : undefined}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Materials */}
      <div className="px-4 space-y-3 mt-2">
        {filtered.map(item => {
          const Icon = TYPE_ICONS[item.type] || BookOpen;
          return (
            <div key={item.id} className="flex items-center gap-4 p-4 bg-surface-50 rounded-2xl active:scale-[0.98] transition-transform cursor-pointer">
              <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-brand-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-ink-900 truncate">{item.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-bold text-ink-300 uppercase">{item.type}</span>
                  <span className="text-ink-200">·</span>
                  <span className="text-[10px] text-ink-300">{item.category}</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span className="text-xs font-bold text-ink-500">{item.rating}</span>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-ink-300">
            <BookOpen className="w-10 h-10 mx-auto mb-3 text-ink-200" />
            <p className="font-bold text-sm">Ничего не найдено</p>
          </div>
        )}
      </div>
    </div>
  );
}
