import { useState } from 'react';
import {
  BookOpen, Plus, Trash2, Save, Eye, Video, FileText,
  AlignLeft, ChevronRight, ChevronDown, Clock, Sparkles,
  Heart, Star, Smartphone, Monitor, GripVertical
} from 'lucide-react';

const PRODUCTS = [
  { id: 'club', name: 'Клуб Аннамама', color: '#f43f5e', icon: Heart },
  { id: 'sleep', name: 'Курс: Сон малыша', color: '#6366f1', icon: Clock },
  { id: 'prikorm', name: 'Курс: Первый прикорм', color: '#10b981', icon: Star },
];

interface Block {
  id: string;
  type: 'video' | 'text' | 'accordion' | 'pdf';
  content: string;
  title?: string;
  timecodes?: { time: string; label: string }[];
  fileName?: string;
}

interface Lesson {
  id: string;
  title: string;
  type: string;
  blocks: Block[];
  publishDate: string;
  category: string;
}

const INITIAL_LESSONS: Lesson[] = [
  {
    id: 'l1', title: 'Как наладить сон без слез', type: 'video', publishDate: '2024-05-20', category: 'Сон',
    blocks: [
      { id: 'b1', type: 'video', content: 'https://rutube.ru/video/1', timecodes: [{ time: '02:15', label: 'Введение' }, { time: '05:40', label: 'Методика ПУ-ПАН' }] },
      { id: 'b2', type: 'text', content: '## Важные правила\nСоблюдайте режим дня...' },
      { id: 'b3', type: 'accordion', title: 'Часто задаваемые вопросы', content: 'Ответы про ночные пробуждения...' },
      { id: 'b4', type: 'pdf', content: '', fileName: 'Гайд_по_сну_2024.pdf' },
    ]
  },
];

const BLOCK_TYPES = [
  { type: 'video' as const, icon: Video, label: 'Видео' },
  { type: 'text' as const, icon: AlignLeft, label: 'Текст' },
  { type: 'accordion' as const, icon: ChevronDown, label: 'Спойлер' },
  { type: 'pdf' as const, icon: FileText, label: 'PDF' },
];

export default function AdminLessonsPage() {
  const [activeProduct, setActiveProduct] = useState(PRODUCTS[0]);
  const [lessons, setLessons] = useState(INITIAL_LESSONS);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(lessons[0]);
  const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('mobile');
  const [showPreview, setShowPreview] = useState(false);

  const handleAddLesson = () => {
    const newLesson: Lesson = {
      id: Date.now().toString(), title: 'Новый урок', type: 'text',
      publishDate: new Date().toISOString().split('T')[0], category: 'Общее', blocks: [],
    };
    setLessons([...lessons, newLesson]);
    setSelectedLesson(newLesson);
  };

  const handleAddBlock = (type: Block['type']) => {
    if (!selectedLesson) return;
    const block: Block = { id: Date.now().toString(), type, content: '', title: type === 'accordion' ? 'Заголовок' : undefined };
    const updated = { ...selectedLesson, blocks: [...selectedLesson.blocks, block] };
    setSelectedLesson(updated);
    setLessons(lessons.map(l => l.id === updated.id ? updated : l));
  };

  const handleUpdateBlock = (blockId: string, updates: Partial<Block>) => {
    if (!selectedLesson) return;
    const updated = { ...selectedLesson, blocks: selectedLesson.blocks.map(b => b.id === blockId ? { ...b, ...updates } : b) };
    setSelectedLesson(updated);
    setLessons(lessons.map(l => l.id === updated.id ? updated : l));
  };

  const handleDeleteBlock = (blockId: string) => {
    if (!selectedLesson) return;
    const updated = { ...selectedLesson, blocks: selectedLesson.blocks.filter(b => b.id !== blockId) };
    setSelectedLesson(updated);
    setLessons(lessons.map(l => l.id === updated.id ? updated : l));
  };

  return (
    <div className="flex h-full animate-fade-in">
      {/* Lesson list */}
      <div className="w-72 border-r border-surface-200 bg-white flex flex-col shrink-0 hidden lg:flex">
        <div className="p-4 border-b border-surface-200">
          <select
            value={activeProduct.id}
            onChange={(e) => setActiveProduct(PRODUCTS.find(p => p.id === e.target.value) || PRODUCTS[0])}
            className="admin-input text-xs"
          >
            {PRODUCTS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-1">
          {lessons.map(l => (
            <button
              key={l.id}
              onClick={() => setSelectedLesson(l)}
              className={`w-full text-left p-3 rounded-xl transition-all ${selectedLesson?.id === l.id ? 'bg-brand-50 text-brand-600' : 'hover:bg-surface-50 text-ink-700'}`}
            >
              <p className="text-sm font-bold truncate">{l.title}</p>
              <p className="text-[10px] text-ink-300 mt-0.5">{l.category} · {l.blocks.length} блоков</p>
            </button>
          ))}
        </div>
        <div className="p-3 border-t border-surface-200">
          <button onClick={handleAddLesson} className="w-full flex items-center justify-center gap-2 py-3 bg-ink-900 text-white rounded-xl text-xs font-bold active:scale-[0.97] transition-transform">
            <Plus className="w-3 h-3" /> Новый урок
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-y-auto">
        {selectedLesson ? (
          <div className="p-6 lg:p-8 max-w-3xl">
            <div className="flex items-center justify-between mb-6">
              <input
                value={selectedLesson.title}
                onChange={(e) => {
                  const updated = { ...selectedLesson, title: e.target.value };
                  setSelectedLesson(updated);
                  setLessons(lessons.map(l => l.id === updated.id ? updated : l));
                }}
                className="text-2xl font-bold text-ink-900 outline-none bg-transparent flex-1"
                placeholder="Название урока"
              />
              <div className="flex gap-2">
                <button onClick={() => setShowPreview(!showPreview)} className="p-2.5 rounded-xl bg-surface-100 hover:bg-surface-200 transition-colors">
                  <Eye className="w-4 h-4 text-ink-500" />
                </button>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-ink-900 text-white rounded-xl text-xs font-bold">
                  <Save className="w-3 h-3" /> Сохранить
                </button>
              </div>
            </div>

            {/* Block types */}
            <div className="flex gap-2 mb-6">
              {BLOCK_TYPES.map(bt => (
                <button key={bt.type} onClick={() => handleAddBlock(bt.type)} className="flex items-center gap-2 px-3 py-2 bg-surface-50 rounded-xl text-xs font-bold text-ink-500 hover:bg-surface-100 border border-surface-200 transition-all">
                  <bt.icon className="w-3 h-3" /> {bt.label}
                </button>
              ))}
            </div>

            {/* Blocks */}
            <div className="space-y-4">
              {selectedLesson.blocks.map(block => (
                <div key={block.id} className="bg-white rounded-2xl border border-surface-200 p-5 group">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <GripVertical className="w-4 h-4 text-ink-200 cursor-grab" />
                      <span className="text-[10px] font-bold text-ink-300 uppercase">{block.type}</span>
                    </div>
                    <button onClick={() => handleDeleteBlock(block.id)} className="p-1.5 text-ink-300 hover:text-destructive opacity-0 group-hover:opacity-100 rounded-lg transition-all">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {block.type === 'video' && (
                    <div className="space-y-3">
                      <input value={block.content} onChange={(e) => handleUpdateBlock(block.id, { content: e.target.value })} placeholder="URL видео (RuTube / YouTube)" className="admin-input text-xs" />
                      {block.timecodes && block.timecodes.map((tc, i) => (
                        <div key={i} className="flex gap-2 items-center">
                          <span className="text-xs font-mono text-ink-400 bg-surface-100 px-2 py-1 rounded-lg">{tc.time}</span>
                          <span className="text-xs text-ink-600">{tc.label}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {block.type === 'text' && (
                    <textarea value={block.content} onChange={(e) => handleUpdateBlock(block.id, { content: e.target.value })} className="w-full h-32 admin-input text-xs resize-none" placeholder="Текст урока (поддерживает Markdown)..." />
                  )}

                  {block.type === 'accordion' && (
                    <div className="space-y-2">
                      <input value={block.title || ''} onChange={(e) => handleUpdateBlock(block.id, { title: e.target.value })} className="admin-input text-xs" placeholder="Заголовок спойлера" />
                      <textarea value={block.content} onChange={(e) => handleUpdateBlock(block.id, { content: e.target.value })} className="w-full h-20 admin-input text-xs resize-none" placeholder="Содержимое..." />
                    </div>
                  )}

                  {block.type === 'pdf' && (
                    <div className="flex items-center gap-3 p-3 bg-surface-50 rounded-xl">
                      <FileText className="w-5 h-5 text-brand-500" />
                      <span className="text-sm font-bold text-ink-700">{block.fileName || 'Загрузите PDF'}</span>
                    </div>
                  )}
                </div>
              ))}
              {selectedLesson.blocks.length === 0 && (
                <div className="text-center py-12 text-ink-300">
                  <BookOpen className="w-10 h-10 mx-auto mb-3 text-ink-200" />
                  <p className="font-bold text-sm">Добавьте первый блок контента</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-ink-300">
            <div className="text-center">
              <BookOpen className="w-12 h-12 mx-auto mb-3 text-ink-200" />
              <p className="font-bold">Выберите урок</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
