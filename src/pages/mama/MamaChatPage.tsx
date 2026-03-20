import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Smile } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'doctor';
  time: string;
}

const INITIAL_MESSAGES: Message[] = [
  { id: '1', text: 'Здравствуйте! Подскажите, нормально ли что ребёнок в 6 месяцев просыпается 4-5 раз за ночь?', sender: 'user', time: '10:30' },
  { id: '2', text: 'Здравствуйте! Это частая ситуация для этого возраста. Давайте разберёмся подробнее. Расскажите, как организован режим дня малыша?', sender: 'doctor', time: '10:32' },
  { id: '3', text: 'Встаём обычно в 7-8, дневной сон 2 раза примерно по часу. Вечером укладываем в 20:00-21:00', sender: 'user', time: '10:35' },
  { id: '4', text: 'Режим хороший! Попробуйте перенести второй дневной сон чуть раньше и убедитесь, что между последним сном и ночным укладыванием проходит не менее 3 часов. Также важна рутина перед сном — ванна, массаж, книга.', sender: 'doctor', time: '10:38' },
];

export default function MamaChatPage() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg: Message = {
      id: Date.now().toString(),
      text: input.trim(),
      sender: 'user',
      time: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([...messages, newMsg]);
    setInput('');

    // Simulate doctor reply
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: 'Спасибо за вопрос! Я изучу информацию и отвечу в ближайшее время.',
        sender: 'doctor',
        time: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }),
      }]);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full animate-fade-in">
      {/* Chat header */}
      <div className="px-4 py-3 border-b border-surface-200 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-sm">
            АВ
          </div>
          <div>
            <p className="font-bold text-sm text-ink-900">Педиатр Анна Викторовна</p>
            <p className="text-[11px] text-emerald-500 font-medium">Онлайн</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 no-scrollbar">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-brand-500 text-white rounded-br-md'
                  : 'bg-surface-100 text-ink-900 rounded-bl-md'
              }`}
            >
              <p>{msg.text}</p>
              <p className={`text-[10px] mt-1 ${msg.sender === 'user' ? 'text-white/60' : 'text-ink-300'}`}>
                {msg.time}
              </p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-surface-200 bg-white safe-bottom">
        <div className="flex items-center gap-2">
          <button className="p-2 text-ink-300 hover:text-ink-500 transition-colors">
            <Paperclip className="w-5 h-5" />
          </button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Написать сообщение..."
            className="flex-1 px-4 py-2.5 bg-surface-100 rounded-2xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-brand-500/10 transition-all"
          />
          <button className="p-2 text-ink-300 hover:text-ink-500 transition-colors">
            <Smile className="w-5 h-5" />
          </button>
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="p-2.5 bg-brand-500 text-white rounded-full disabled:opacity-30 active:scale-90 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
