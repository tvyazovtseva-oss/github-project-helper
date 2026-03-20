import { useState } from 'react';
import {
  Sparkles, CheckCircle2, ChevronRight, Save, Download,
  Lightbulb, Copy, Share2, AlertCircle
} from 'lucide-react';

const SUGGESTED_TOPICS = [
  {
    id: 1,
    title: 'Купание при атопическом дерматите: правила и ошибки мам',
    mentions: 87,
    keyInsights: ['Как часто купать ребенка', 'Температура воды — споры', 'Эмоленты в ванну — да или нет?']
  },
  {
    id: 2,
    title: 'Когда вводить глютен: страхи и факты',
    mentions: 64,
    keyInsights: ['Аллергия на глютен vs целиакия', 'С какого возраста безопасно', 'Подмена понятий у мам']
  },
  {
    id: 3,
    title: 'Режим сна 6-9 месяцев: Почему все рекомендации не работают',
    mentions: 112,
    keyInsights: ['Регресс сна в 8 месяцев', 'Перестройка дневных снов', '«Метод Комаровского» — мнения врачей']
  }
];

export default function ContentGenPage() {
  const [step, setStep] = useState(1);
  const [selectedTopic, setSelectedTopic] = useState<any>(null);

  const handleSelectTopic = (topic: any) => {
    setSelectedTopic(topic);
    setStep(2);
    setTimeout(() => setStep(3), 3000);
  };

  return (
    <>
      <header className="bg-card border-b border-border px-8 py-5 shrink-0">
        <h2 className="text-2xl font-bold">Контент-генератор</h2>
        <p className="text-sm text-muted-foreground mt-1">ИИ анализирует чаты врачей и мам, предлагает темы для гайдов</p>
      </header>

      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-6xl mx-auto">

          {/* Step 1: Topics */}
          {step === 1 && (
            <div className="space-y-8">
              <div className="bg-card p-8 rounded-3xl border border-border shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center text-primary"><Sparkles className="w-5 h-5" /></div>
                  <div>
                    <h3 className="font-black text-lg">Популярные темы из чатов</h3>
                    <p className="text-xs text-muted-foreground">На основе анализа 1,247 сообщений за последние 30 дней</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {SUGGESTED_TOPICS.map(topic => (
                  <div key={topic.id} onClick={() => handleSelectTopic(topic)} className="bg-card p-8 rounded-[2rem] border border-border shadow-sm cursor-pointer group hover:shadow-lg hover:border-primary/30 transition-all">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-[10px] font-black bg-primary/10 text-primary px-2 py-1 rounded-lg uppercase">{topic.mentions} упоминаний</span>
                    </div>
                    <h3 className="text-xl font-black leading-tight mb-4 group-hover:text-primary transition-colors">{topic.title}</h3>
                    <div className="space-y-2">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Ключевые боли:</p>
                      {topic.keyInsights.map((insight, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" /> {insight}
                        </div>
                      ))}
                    </div>
                    <button className="w-full mt-8 bg-foreground text-card py-4 rounded-2xl text-[10px] font-black uppercase flex items-center justify-center gap-2 group-hover:bg-primary transition-colors">
                      Создать гайд <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Generating */}
          {step === 2 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-primary/20 rounded-full animate-ping absolute opacity-20" />
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center relative border-2 border-primary/30">
                  <Sparkles className="w-10 h-10 text-primary animate-pulse" />
                </div>
              </div>
              <h2 className="text-2xl font-black uppercase tracking-tight mb-2">Анализируем опыт врачей...</h2>
              <p className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest max-w-xs">
                Изучаем 124 диалога по теме "{selectedTopic?.title}"
              </p>
              <div className="mt-10 w-64 bg-muted h-1.5 rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full animate-pulse" style={{ width: '70%' }} />
              </div>
            </div>
          )}

          {/* Step 3: Editor */}
          {step === 3 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-card p-8 rounded-[2rem] border border-border shadow-sm">
                  <h4 className="text-[10px] font-black uppercase text-muted-foreground mb-6 flex items-center gap-2 tracking-widest">
                    <Lightbulb className="w-4 h-4 text-amber-500" /> Источники знаний
                  </h4>
                  <div className="space-y-4">
                    <div className="p-4 bg-muted rounded-2xl border border-border">
                      <p className="text-[10px] font-black text-primary uppercase mb-1">Топ-инсайт от врача:</p>
                      <p className="text-xs italic text-muted-foreground font-medium">"Эмолент наносится на влажную кожу — ошибка №1 в чатах."</p>
                    </div>
                  </div>
                </div>
                <div className="bg-primary p-8 rounded-[2rem] text-primary-foreground shadow-xl">
                  <h4 className="text-[10px] font-black uppercase opacity-60 mb-2 tracking-widest">Готовность</h4>
                  <div className="text-2xl font-black mb-4">85%</div>
                  <p className="text-xs font-bold opacity-90 leading-relaxed mb-6">Осталось добавить фото и проверить стиль.</p>
                  <button className="w-full bg-white text-primary py-3 rounded-xl text-[10px] font-black uppercase shadow-lg hover:scale-105 transition-transform">Отправить на проверку</button>
                </div>
              </div>

              <div className="lg:col-span-8">
                <div className="bg-card rounded-[2.5rem] border border-border shadow-2xl overflow-hidden min-h-[600px] flex flex-col">
                  <div className="p-6 border-b border-border flex items-center justify-between bg-muted/50">
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-card rounded-lg"><Copy className="w-4 h-4 text-muted-foreground" /></button>
                      <button className="p-2 hover:bg-card rounded-lg"><Share2 className="w-4 h-4 text-muted-foreground" /></button>
                    </div>
                    <button onClick={() => setStep(1)} className="text-[10px] font-black uppercase text-muted-foreground hover:text-primary">Закрыть</button>
                  </div>
                  <div className="p-12 flex-1">
                    <input defaultValue={selectedTopic?.title} className="w-full text-4xl font-black tracking-tight border-none focus:ring-0 placeholder:text-muted-foreground/30 mb-8 outline-none bg-transparent" />
                    <div className="prose max-w-none space-y-8">
                      <section>
                        <h4 className="text-primary font-black uppercase text-xs mb-3 tracking-widest flex items-center gap-2"><AlertCircle className="w-4 h-4" /> Почему это важно?</h4>
                        <p className="text-lg text-muted-foreground font-medium leading-relaxed">
                          На основе вопросов в клубе за последний месяц, тема ухода за кожей при дерматите вызывает больше всего сложностей.
                        </p>
                      </section>
                      <section className="bg-muted p-8 rounded-3xl border border-border">
                        <h4 className="font-black uppercase text-xs mb-6 tracking-widest">Чек-лист:</h4>
                        <ul className="space-y-4">
                          {["Температура воды 32-34°", "Длительность 5-10 минут", "Масла-эмоленты в ванночку", "Не тереть, только промакивать"].map((item, i) => (
                            <li key={i} className="flex gap-4 items-start">
                              <div className="w-6 h-6 rounded-lg bg-card border border-border flex items-center justify-center shrink-0">
                                <span className="text-[10px] font-black text-primary">{i + 1}</span>
                              </div>
                              <span className="text-sm font-bold leading-relaxed">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </section>
                    </div>
                  </div>
                  <div className="p-8 border-t border-border bg-muted/30 flex justify-between">
                    <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-card border border-border text-[10px] font-black uppercase"><Save className="w-4 h-4" /> Черновик</button>
                    <button className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-primary text-primary-foreground text-[10px] font-black uppercase shadow-lg"><Download className="w-4 h-4" /> Экспорт в PDF</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
