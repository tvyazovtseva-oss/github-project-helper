import { useState } from 'react';
import {
  Save, Eye, Plus, Trash2, GripVertical, FileText,
  Video, AlignLeft, Clock, ChevronDown, ChevronLeft,
  Calendar, Tag, Heart, Star, Play, MoreHorizontal,
  Image as ImageIcon, Layers, Minus, FileDigit, Download
} from 'lucide-react';

const PRODUCTS = [
  { id: 'club', name: 'Клуб Anna MAMA', color: '#f43f5e', icon: Heart },
  { id: 'sleep', name: 'Курс: Сон малыша', color: '#6366f1', icon: Clock },
  { id: 'prikorm', name: 'Курс: Первый прикорм', color: '#10b981', icon: Star }
];

const INITIAL_COURSES: any = {
  club: {
    title: 'Клуб Anna MAMA (База знаний)',
    lessons: [{
      id: 'l1', title: 'Как наладить сон без слез', type: 'video',
      publishDate: '2024-05-20', publishTime: '10:00', tags: ['Сон'], category: 'Сон',
      blocks: [
        { id: 'b1', type: 'video', content: 'https://rutube.ru/video/1', timecodes: [{ time: '02:15', label: 'Введение' }, { time: '05:40', label: 'Методика ПУ-ПАН' }] },
        { id: 'b2', type: 'text', content: '<h2>Важные правила</h2><p>Соблюдайте режим дня...</p>', isHtml: true },
        { id: 'b3', type: 'accordion', title: 'Часто задаваемые вопросы', content: 'Ответы про ночные пробуждения...' },
        { id: 'b4', type: 'pdf', fileName: 'Гайд_по_сну_2024.pdf', fileSize: '4.2 MB' },
        { id: 'b5', type: 'divider', style: 'dots' },
        { id: 'b6', type: 'image', url: 'https://images.unsplash.com/photo-1520206159846-aa30f1e293a9?w=800', caption: 'Пример идеальной детской' }
      ]
    }]
  },
  sleep: { title: 'Курс по Сну', lessons: [] },
  prikorm: { title: 'Курс по Прикорму', lessons: [] }
};

export default function LmsPage() {
  const [selectedProductId, setSelectedProductId] = useState('club');
  const [selectedLessonId, setSelectedLessonId] = useState('l1');
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const activeProduct = PRODUCTS.find(p => p.id === selectedProductId) || PRODUCTS[0];
  const currentCourse = INITIAL_COURSES[selectedProductId] || { title: 'Новый курс', lessons: [] };
  const selectedLesson = currentCourse.lessons.find((l: any) => l.id === selectedLessonId) || currentCourse.lessons[0];

  return (
    <>
      <header className="bg-card border-b border-border px-8 py-4 flex items-center justify-between z-20 shadow-sm shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 px-4 py-2 bg-muted rounded-2xl border border-border">
            <activeProduct.icon className="w-4 h-4" style={{ color: activeProduct.color }} />
            <span className="text-sm font-black">{activeProduct.name}</span>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setIsPreviewMode(true)} className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-2xl text-xs font-bold hover:bg-muted shadow-sm active:scale-95 transition-all"><Eye className="w-4 h-4" /> Предпросмотр</button>
          <button className="flex items-center gap-2 px-6 py-2 bg-foreground text-card rounded-2xl text-xs font-bold shadow-xl active:scale-95 transition-all"><Save className="w-4 h-4" /> Опубликовать</button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Lesson list */}
        <div className="w-80 bg-card border-r border-border flex flex-col shrink-0">
          <div className="p-6 bg-muted/30 border-b flex justify-between items-center">
            <div>
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1">Программа</p>
              <h3 className="text-sm font-black">Список уроков</h3>
            </div>
            <Plus className="w-6 h-6 text-primary bg-card p-1 rounded-lg shadow-sm border border-border cursor-pointer hover:scale-110 transition-transform" />
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
            {currentCourse.lessons.map((lesson: any) => (
              <div
                key={lesson.id}
                onClick={() => setSelectedLessonId(lesson.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${selectedLessonId === lesson.id ? 'border-primary/20 bg-primary/5 ring-1 ring-primary/10' : 'border-transparent hover:bg-muted'}`}
              >
                {selectedLessonId === lesson.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[8px] font-black px-2 py-0.5 rounded-full bg-card border text-muted-foreground uppercase">Урок {lesson.id.replace('l', '')}</span>
                  <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                </div>
                <p className="text-xs font-black leading-tight">{lesson.title}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 bg-muted overflow-y-auto p-8 custom-scrollbar">
          {selectedLesson ? (
            <div className="max-w-4xl mx-auto space-y-6 pb-40">
              <div className="bg-card p-8 rounded-[2.5rem] border border-border shadow-sm space-y-6">
                <input type="text" defaultValue={selectedLesson.title} className="w-full text-3xl font-black bg-transparent border-none outline-none placeholder:text-muted-foreground/30" placeholder="Заголовок урока..." />
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-blue-100">
                    <Calendar className="w-3 h-3" /> {selectedLesson.publishDate}
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-xl text-[10px] font-black uppercase tracking-widest border border-primary/20">
                    <Tag className="w-3 h-3" /> {selectedLesson.category}
                  </div>
                </div>
              </div>

              {/* Blocks */}
              <div className="space-y-4">
                {selectedLesson.blocks.map((block: any) => (
                  <div key={block.id} className="bg-card rounded-[2rem] border border-border shadow-sm overflow-hidden group transition-all hover:shadow-md">
                    <div className="bg-muted px-6 py-3 border-b border-border flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{block.type}</span>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 hover:bg-card rounded-lg text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
                        <button className="p-2 hover:bg-card rounded-lg text-muted-foreground cursor-grab"><GripVertical className="w-4 h-4" /></button>
                      </div>
                    </div>
                    <div className="p-8">
                      {block.type === 'video' && (
                        <div className="space-y-4">
                          <input className="flex-1 w-full bg-muted p-4 rounded-2xl border border-border text-xs font-bold outline-none" defaultValue={block.content} />
                          {block.timecodes && (
                            <div className="space-y-2">
                              <p className="text-[10px] font-black uppercase text-muted-foreground flex items-center gap-2"><Clock className="w-3 h-3" /> Таймкоды</p>
                              {block.timecodes.map((tc: any, idx: number) => (
                                <div key={idx} className="flex gap-2">
                                  <input className="w-20 bg-card p-2 rounded-xl border border-border text-[10px] font-black text-blue-600 text-center" defaultValue={tc.time} />
                                  <input className="flex-1 bg-card p-2 rounded-xl border border-border text-[10px] font-bold" defaultValue={tc.label} />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                      {block.type === 'text' && <textarea className="w-full bg-card p-4 rounded-2xl border border-border text-sm outline-none min-h-[150px]" defaultValue={block.content} />}
                      {block.type === 'pdf' && (
                        <div className="flex items-center gap-4 p-4 bg-muted rounded-2xl border border-border">
                          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary"><FileDigit className="w-6 h-6" /></div>
                          <div className="flex-1">
                            <p className="text-sm font-black">{block.fileName}</p>
                            <p className="text-[10px] text-muted-foreground font-bold uppercase">{block.fileSize}</p>
                          </div>
                        </div>
                      )}
                      {block.type === 'accordion' && (
                        <div className="space-y-4">
                          <input type="text" defaultValue={block.title} className="w-full bg-muted p-4 rounded-2xl border border-border text-sm font-black outline-none" />
                          <textarea className="w-full bg-card p-4 rounded-2xl border border-border text-sm outline-none min-h-[100px]" defaultValue={block.content} />
                        </div>
                      )}
                      {block.type === 'image' && (
                        <div className="space-y-4">
                          <img src={block.url} className="w-full h-48 object-cover rounded-3xl shadow-md" alt="" />
                          <input className="w-full bg-muted p-3 rounded-xl border border-border text-[10px] font-bold" placeholder="Подпись..." defaultValue={block.caption} />
                        </div>
                      )}
                      {block.type === 'divider' && (
                        <div className="flex justify-center gap-2 py-4">
                          <div className="w-2 h-2 bg-border rounded-full" />
                          <div className="w-2 h-2 bg-border rounded-full" />
                          <div className="w-2 h-2 bg-border rounded-full" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add block */}
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {[
                  { label: 'Видео', icon: Video, color: 'text-rose-500 bg-rose-50' },
                  { label: 'Текст', icon: FileText, color: 'text-blue-500 bg-blue-50' },
                  { label: 'PDF', icon: FileDigit, color: 'text-orange-500 bg-orange-50' },
                  { label: 'Спойлер', icon: Layers, color: 'text-indigo-500 bg-indigo-50' },
                  { label: 'Фото', icon: ImageIcon, color: 'text-emerald-500 bg-emerald-50' },
                  { label: 'Черта', icon: Minus, color: 'text-slate-500 bg-slate-50' },
                ].map(btn => (
                  <button key={btn.label} className="bg-card p-4 rounded-[1.5rem] border border-border flex flex-col items-center justify-center gap-2 hover:shadow-lg active:scale-90 transition-all group">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${btn.color}`}>
                      <btn.icon className="w-4 h-4" />
                    </div>
                    <span className="text-[8px] font-black uppercase text-muted-foreground">{btn.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <p>Выберите урок из списка слева</p>
            </div>
          )}
        </div>
      </div>

      {/* Preview modal */}
      {isPreviewMode && selectedLesson && (
        <div className="fixed inset-0 z-[100] bg-secondary/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-card h-[90vh] rounded-[3rem] shadow-2xl flex flex-col overflow-hidden border-[10px] border-black">
            <div className="h-12 bg-card flex items-center justify-between px-10 pt-4">
              <span className="text-xs font-bold">9:41</span>
              <div className="w-16 h-5 bg-black rounded-full" />
              <span className="text-xs">⚡</span>
            </div>
            <div className="flex-1 overflow-y-auto px-8 pb-12 pt-6 custom-scrollbar">
              <button onClick={() => setIsPreviewMode(false)} className="mb-6 p-2 bg-muted rounded-full text-muted-foreground"><ChevronLeft className="w-5 h-5" /></button>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-black text-primary uppercase tracking-widest px-2 py-1 bg-primary/10 rounded-lg">{selectedLesson.category}</span>
              </div>
              <h1 className="text-2xl font-black mb-8 leading-tight">{selectedLesson.title}</h1>
              <div className="space-y-8">
                {selectedLesson.blocks.map((b: any) => (
                  <div key={b.id}>
                    {b.type === 'video' && (
                      <div className="aspect-video bg-black rounded-3xl overflow-hidden relative cursor-pointer shadow-xl">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white"><Play className="w-8 h-8 fill-current" /></div>
                        </div>
                      </div>
                    )}
                    {b.type === 'text' && <div className="prose max-w-none text-sm" dangerouslySetInnerHTML={{ __html: b.content }} />}
                    {b.type === 'pdf' && (
                      <div className="p-5 bg-card border border-border rounded-3xl shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary"><FileDigit className="w-6 h-6" /></div>
                          <div>
                            <p className="text-sm font-black">{b.fileName}</p>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase">{b.fileSize}</p>
                          </div>
                        </div>
                        <button className="w-10 h-10 bg-foreground rounded-xl flex items-center justify-center text-card shadow-lg"><Download className="w-4 h-4" /></button>
                      </div>
                    )}
                    {b.type === 'image' && <img src={b.url} className="w-full h-64 object-cover rounded-3xl shadow-lg" alt={b.caption || ''} />}
                    {b.type === 'divider' && (
                      <div className="flex justify-center gap-3 py-4">
                        <div className="w-2 h-2 bg-border rounded-full" /><div className="w-2 h-2 bg-border rounded-full" /><div className="w-2 h-2 bg-border rounded-full" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
