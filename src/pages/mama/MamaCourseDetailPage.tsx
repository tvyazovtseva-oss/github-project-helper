import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, PlayCircle, FileText, Download, CheckCircle2, Lock, ChevronDown,
  Users, MessageCircle, Send, Paperclip, Info, ChevronRight,
  Bell, Hash, Plus, User
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

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

interface ChatMessage {
  id: string;
  text: string;
  sender: string;
  senderRole: 'user' | 'expert' | 'member';
  time: string;
  avatar?: string;
}

interface ForumThread {
  id: string;
  title: string;
  author: string;
  replies: number;
  lastActivity: string;
  tag: string;
}

interface NewsItem {
  id: string;
  title: string;
  desc: string;
  date: string;
  isNew: boolean;
}

const COURSES_DATA: Record<string, {
  name: string;
  color: string;
  description: string;
  author: string;
  isClub: boolean;
  modules: Module[];
  materials: Material[];
  instructions?: string[];
  news?: NewsItem[];
  expertChats?: { id: string; name: string; role: string; online: boolean }[];
  forumThreads?: ForumThread[];
}> = {
  course_first_aid: {
    name: 'Первая Помощь',
    color: '#FF9500',
    description: 'Экстренная помощь ребёнку от 0 до 7 лет. Все ситуации — от температуры до травм.',
    author: 'Анна Петрова',
    isClub: false,
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
    isClub: false,
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
    name: 'Клуб Аннамама',
    color: '#FF2D55',
    description: 'Закрытое сообщество мам с доступом к педиатрам, психологам и эксклюзивным материалам. Еженедельные вебинары, чаты с экспертами и поддержка 24/7.',
    author: 'Анна Петрова',
    isClub: true,
    modules: [],
    materials: [
      { id: 'mat1', title: 'Запись вебинара: Прикорм', type: 'video' },
      { id: 'mat2', title: 'Гайд: Первые зубы', type: 'guide' },
      { id: 'mat3', title: 'Чек-лист: Развитие 0-12 мес', type: 'file', size: '0.8 МБ' },
    ],
    instructions: [
      'Используйте личный чат для конфиденциальных вопросов к экспертам',
      'Общий форум — для обсуждений с другими мамами',
      'Новые материалы публикуются каждый понедельник',
      'Записи вебинаров доступны в разделе «Материалы» в течение 30 дней',
    ],
    news: [
      { id: 'n1', title: 'Новый вебинар: Первый прикорм', desc: 'Завтра в 19:00, ведёт педиатр Анна Викторовна', date: '20.03.2026', isNew: true },
      { id: 'n2', title: 'Открыт урок: Аллергия у малышей', desc: 'Новый материал в разделе «Питание»', date: '18.03.2026', isNew: true },
      { id: 'n3', title: 'Итоги марафона «Сон без слёз»', desc: 'Поздравляем участниц! Результаты внутри', date: '15.03.2026', isNew: false },
    ],
    expertChats: [
      { id: 'exp1', name: 'Анна Викторовна', role: 'Педиатр', online: true },
      { id: 'exp2', name: 'Елена Сергеевна', role: 'Психолог', online: false },
      { id: 'exp3', name: 'Мария Петровна', role: 'Нутрициолог', online: true },
    ],
    forumThreads: [
      { id: 'f1', title: 'Прикорм: с чего начать?', author: 'Катерина М.', replies: 23, lastActivity: '5 мин назад', tag: 'Питание' },
      { id: 'f2', title: 'Ребёнок не спит днём в 2 года', author: 'Алина К.', replies: 15, lastActivity: '1 ч назад', tag: 'Сон' },
      { id: 'f3', title: 'Истерики в магазине — как?', author: 'Наталья В.', replies: 42, lastActivity: '30 мин назад', tag: 'Психология' },
      { id: 'f4', title: 'Витамин D: какой выбрать?', author: 'Ольга Р.', replies: 8, lastActivity: '2 ч назад', tag: 'Здоровье' },
      { id: 'f5', title: 'Делимся режимами дня!', author: 'Юлия Д.', replies: 31, lastActivity: '45 мин назад', tag: 'Общее' },
    ],
  },
  club_woman: {
    name: 'Женская Среда',
    color: '#AF52DE',
    description: 'Женское здоровье, психология и восстановление после родов.',
    author: 'Анна Петрова',
    isClub: true,
    modules: [],
    materials: [
      { id: 'mat1', title: 'Гайд: Восстановление после родов', type: 'guide' },
      { id: 'mat2', title: 'Вебинар: Тревожность у мам', type: 'video' },
    ],
    instructions: [
      'Это безопасное пространство — все обсуждения конфиденциальны',
      'Задавайте вопросы психологу в личном чате',
      'Новые материалы каждую среду',
    ],
    news: [
      { id: 'n1', title: 'Новый гайд: Самозабота', desc: 'Практики для мам, которые забыли о себе', date: '19.03.2026', isNew: true },
    ],
    expertChats: [
      { id: 'exp1', name: 'Елена Сергеевна', role: 'Психолог', online: true },
    ],
    forumThreads: [
      { id: 'f1', title: 'Как вернуться в форму после родов?', author: 'Марина Л.', replies: 18, lastActivity: '2 ч назад', tag: 'Здоровье' },
    ],
  },
};

const MATERIAL_ICONS = { video: PlayCircle, guide: FileText, file: Download };

// Mock chat messages for expert chats
const MOCK_CHAT_MESSAGES: ChatMessage[] = [
  { id: '1', text: 'Здравствуйте! У меня вопрос по прикорму.', sender: 'Вы', senderRole: 'user', time: '10:30' },
  { id: '2', text: 'Здравствуйте! Конечно, задавайте. Сколько месяцев малышу?', sender: 'Анна Викторовна', senderRole: 'expert', time: '10:32' },
  { id: '3', text: 'Нам 6 месяцев, хотим начать с овощей.', sender: 'Вы', senderRole: 'user', time: '10:33' },
  { id: '4', text: 'Отлично! Рекомендую начать с кабачка или цветной капусты. Давайте по ½ чайной ложки, постепенно увеличивая.', sender: 'Анна Викторовна', senderRole: 'expert', time: '10:35' },
];

type ClubTab = 'about' | 'chat' | 'forum' | 'materials';

export default function MamaCourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [expandedModule, setExpandedModule] = useState<string | null>('m1');
  const [clubTab, setClubTab] = useState<ClubTab>('about');
  const [showInstructions, setShowInstructions] = useState(false);

  // Chat state
  const [selectedExpert, setSelectedExpert] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(MOCK_CHAT_MESSAGES);
  const [chatInput, setChatInput] = useState('');

  // Forum state
  const [selectedThread, setSelectedThread] = useState<string | null>(null);

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

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      text: chatInput.trim(),
      sender: 'Вы',
      senderRole: 'user',
      time: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }),
    };
    setChatMessages(prev => [...prev, newMsg]);
    setChatInput('');

    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: 'Спасибо за вопрос! Отвечу в ближайшее время.',
        sender: course.expertChats?.find(e => e.id === selectedExpert)?.name || 'Эксперт',
        senderRole: 'expert',
        time: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }),
      }]);
    }, 1500);
  };

  // ─── CLUB VIEW ─────────────────────────────────────────────────────
  if (course.isClub) {
    return (
      <div className="pb-6 animate-fade-in">
        {/* Header */}
        <div className="relative p-6 rounded-b-3xl" style={{ background: `linear-gradient(135deg, ${course.color}, ${course.color}CC)` }}>
          <button onClick={() => navigate(-1)} className="mb-4 p-2 -ml-2 rounded-full active:bg-white/20 transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-5 h-5 text-white/70" />
            <span className="text-white/70 text-xs font-bold uppercase tracking-wider">Клуб</span>
          </div>
          <h1 className="text-white text-xl font-bold mb-1" style={{ lineHeight: '1.2' }}>{course.name}</h1>
          <p className="text-white/80 text-sm">{course.description}</p>
        </div>

        {/* Club tabs */}
        <div className="flex gap-1 px-4 mt-4 mb-4 overflow-x-auto no-scrollbar">
          {([
            { key: 'about' as ClubTab, label: 'О клубе' },
            { key: 'chat' as ClubTab, label: 'Чат с экспертом' },
            { key: 'forum' as ClubTab, label: 'Форум' },
            { key: 'materials' as ClubTab, label: 'Материалы' },
          ]).map(tab => (
            <button
              key={tab.key}
              onClick={() => setClubTab(tab.key)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                clubTab === tab.key ? 'text-white' : 'bg-surface-100 text-ink-400'
              }`}
              style={clubTab === tab.key ? { backgroundColor: course.color } : undefined}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="px-4">
          {/* ─── About tab ─────────────────────────────────── */}
          {clubTab === 'about' && (
            <div className="space-y-4 animate-fade-in">
              {/* Instructions */}
              <button
                onClick={() => setShowInstructions(!showInstructions)}
                className="w-full flex items-center justify-between p-4 bg-surface-50 rounded-2xl"
              >
                <div className="flex items-center gap-2.5">
                  <Info className="w-4 h-4 text-ink-400" />
                  <span className="font-bold text-sm text-ink-900">Как пользоваться клубом</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-ink-300 transition-transform ${showInstructions ? 'rotate-180' : ''}`} />
              </button>
              {showInstructions && course.instructions && (
                <div className="p-4 bg-surface-50 rounded-2xl space-y-2 -mt-2 animate-fade-in">
                  {course.instructions.map((inst, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <span className="text-[10px] font-bold text-ink-300 bg-surface-200 w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-sm text-ink-600">{inst}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* News feed */}
              {course.news && course.news.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-ink-300 uppercase tracking-wider mb-3">Новости клуба</h3>
                  <div className="space-y-2">
                    {course.news.map(n => (
                      <div key={n.id} className={`p-4 rounded-2xl ${n.isNew ? 'bg-surface-50 ring-1 ring-brand-200' : 'bg-surface-50'}`}>
                        <div className="flex items-center gap-2 mb-1.5">
                          {n.isNew && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full text-white" style={{ backgroundColor: course.color }}>
                              Новое
                            </span>
                          )}
                          <span className="text-[10px] text-ink-300">{n.date}</span>
                        </div>
                        <p className="font-bold text-sm text-ink-900">{n.title}</p>
                        <p className="text-xs text-ink-400 mt-0.5">{n.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick access to experts */}
              {course.expertChats && (
                <div>
                  <h3 className="text-xs font-bold text-ink-300 uppercase tracking-wider mb-3">Эксперты</h3>
                  <div className="space-y-2">
                    {course.expertChats.map(exp => (
                      <button
                        key={exp.id}
                        onClick={() => { setSelectedExpert(exp.id); setClubTab('chat'); }}
                        className="w-full flex items-center gap-3 p-3.5 bg-surface-50 rounded-2xl active:scale-[0.98] transition-transform"
                      >
                        <div className="relative">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: course.color }}>
                            {exp.name.split(' ').map(w => w[0]).join('')}
                          </div>
                          {exp.online && (
                            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />
                          )}
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-bold text-sm text-ink-900">{exp.name}</p>
                          <p className="text-xs text-ink-400">{exp.role}</p>
                        </div>
                        <MessageCircle className="w-4 h-4 text-ink-300" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ─── Expert Chat tab ──────────────────────────── */}
          {clubTab === 'chat' && (
            <div className="animate-fade-in">
              {!selectedExpert ? (
                <div className="space-y-2">
                  <p className="text-sm text-ink-500 mb-3">Выберите эксперта для личного чата</p>
                  {course.expertChats?.map(exp => (
                    <button
                      key={exp.id}
                      onClick={() => setSelectedExpert(exp.id)}
                      className="w-full flex items-center gap-3 p-4 bg-surface-50 rounded-2xl active:scale-[0.98] transition-transform"
                    >
                      <div className="relative">
                        <div className="w-11 h-11 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: course.color }}>
                          {exp.name.split(' ').map(w => w[0]).join('')}
                        </div>
                        {exp.online && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />
                        )}
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-bold text-sm text-ink-900">{exp.name}</p>
                        <p className="text-xs text-ink-400">{exp.role} {exp.online ? '· Онлайн' : ''}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-ink-200" />
                    </button>
                  ))}
                </div>
              ) : (
                <div>
                  {/* Chat header */}
                  <div className="flex items-center gap-3 mb-4">
                    <button onClick={() => setSelectedExpert(null)} className="p-1.5 rounded-full hover:bg-surface-100 transition-colors">
                      <ArrowLeft className="w-4 h-4 text-ink-400" />
                    </button>
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: course.color }}>
                        {course.expertChats?.find(e => e.id === selectedExpert)?.name.split(' ').map(w => w[0]).join('')}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-ink-900">
                          {course.expertChats?.find(e => e.id === selectedExpert)?.name}
                        </p>
                        <p className="text-[10px] text-green-500 font-medium">
                          {course.expertChats?.find(e => e.id === selectedExpert)?.role}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="space-y-2.5 mb-4 max-h-80 overflow-y-auto">
                    {chatMessages.map(msg => (
                      <div key={msg.id} className={`flex ${msg.senderRole === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                          msg.senderRole === 'user'
                            ? 'rounded-br-md text-white'
                            : 'bg-surface-100 text-ink-900 rounded-bl-md'
                        }`}
                          style={msg.senderRole === 'user' ? { backgroundColor: course.color } : undefined}
                        >
                          <p>{msg.text}</p>
                          <p className={`text-[10px] mt-1 ${msg.senderRole === 'user' ? 'text-white/60' : 'text-ink-300'}`}>
                            {msg.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Input */}
                  <div className="flex items-center gap-2 p-2 bg-surface-50 rounded-2xl">
                    <button className="p-2 text-ink-300">
                      <Paperclip className="w-4 h-4" />
                    </button>
                    <input
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                      placeholder="Написать..."
                      className="flex-1 text-sm bg-transparent outline-none"
                    />
                    <button
                      onClick={handleSendChat}
                      disabled={!chatInput.trim()}
                      className="p-2 rounded-full text-white disabled:opacity-30 active:scale-90 transition-all"
                      style={{ backgroundColor: course.color }}
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ─── Forum tab ────────────────────────────────── */}
          {clubTab === 'forum' && (
            <div className="animate-fade-in">
              {!selectedThread ? (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm text-ink-500">Обсуждения участниц</p>
                    <button className="flex items-center gap-1 text-xs font-bold text-white px-3 py-1.5 rounded-full active:scale-95 transition-transform" style={{ backgroundColor: course.color }}>
                      <Plus className="w-3 h-3" /> Тема
                    </button>
                  </div>
                  <div className="space-y-2">
                    {course.forumThreads?.map(thread => (
                      <button
                        key={thread.id}
                        onClick={() => setSelectedThread(thread.id)}
                        className="w-full p-4 bg-surface-50 rounded-2xl text-left active:scale-[0.98] transition-transform"
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-surface-200 text-ink-500">
                            <Hash className="w-2.5 h-2.5 inline -mt-0.5" /> {thread.tag}
                          </span>
                          <span className="text-[10px] text-ink-300">{thread.lastActivity}</span>
                        </div>
                        <p className="font-bold text-sm text-ink-900 mb-0.5">{thread.title}</p>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] text-ink-400">{thread.author}</span>
                          <span className="text-[10px] text-ink-300 flex items-center gap-0.5">
                            <MessageCircle className="w-3 h-3" /> {thread.replies}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <button
                    onClick={() => setSelectedThread(null)}
                    className="flex items-center gap-1.5 text-sm font-bold text-ink-400 mb-4"
                  >
                    <ArrowLeft className="w-4 h-4" /> Все темы
                  </button>
                  <div className="p-4 bg-surface-50 rounded-2xl mb-3">
                    <p className="font-bold text-sm text-ink-900">
                      {course.forumThreads?.find(t => t.id === selectedThread)?.title}
                    </p>
                    <p className="text-xs text-ink-400 mt-1">
                      {course.forumThreads?.find(t => t.id === selectedThread)?.author}
                    </p>
                  </div>

                  {/* Forum messages (mock) */}
                  <div className="space-y-2.5 mb-4">
                    {[
                      { id: 'fm1', sender: 'Катерина М.', text: 'Девочки, поделитесь опытом! Нам скоро 6 мес, хочу начать прикорм.', time: '14:20' },
                      { id: 'fm2', sender: 'Алина К.', text: 'Мы начали с кабачка — всё прошло отлично! Главное, не торопиться.', time: '14:35' },
                      { id: 'fm3', sender: 'Наталья В.', text: 'А мы начали с каши, педиатр посоветовала. Тоже хорошо пошло 😊', time: '15:10' },
                    ].map(msg => (
                      <div key={msg.id} className="flex items-start gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-surface-200 flex items-center justify-center shrink-0 mt-0.5">
                          <User className="w-3.5 h-3.5 text-ink-400" />
                        </div>
                        <div className="flex-1 p-3 bg-surface-50 rounded-2xl rounded-tl-md">
                          <p className="text-[11px] font-bold text-ink-500">{msg.sender}</p>
                          <p className="text-sm text-ink-800 mt-0.5">{msg.text}</p>
                          <p className="text-[10px] text-ink-300 mt-1">{msg.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Reply input */}
                  <div className="flex items-center gap-2 p-2 bg-surface-50 rounded-2xl">
                    <input
                      placeholder="Написать ответ..."
                      className="flex-1 text-sm bg-transparent outline-none px-2"
                    />
                    <button className="p-2 rounded-full text-white active:scale-90 transition-all" style={{ backgroundColor: course.color }}>
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ─── Materials tab ────────────────────────────── */}
          {clubTab === 'materials' && (
            <div className="space-y-2 animate-fade-in">
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
          )}
        </div>
      </div>
    );
  }

  // ─── COURSE VIEW (no questionnaire, structured lessons) ─────────────
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
