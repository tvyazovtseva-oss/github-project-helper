import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Sparkles, Phone, Send as SendIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';

// Simple phone mask: allows +, digits, spaces, dashes, parens
function formatPhone(raw: string): string {
  // Strip everything except digits and leading +
  const cleaned = raw.replace(/[^\d+]/g, '');
  if (!cleaned) return '';
  // If starts with +7 or 8 (Russian), format nicely
  if (cleaned.startsWith('+7') && cleaned.length <= 12) {
    const d = cleaned.slice(2);
    let result = '+7';
    if (d.length > 0) result += ' (' + d.slice(0, 3);
    if (d.length >= 3) result += ') ';
    if (d.length > 3) result += d.slice(3, 6);
    if (d.length > 6) result += '-' + d.slice(6, 8);
    if (d.length > 8) result += '-' + d.slice(8, 10);
    return result;
  }
  // For international, just group digits
  return cleaned;
}

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    if (showWelcome) {
      const timer = setTimeout(() => {
        navigate('/mama');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [showWelcome, navigate]);

  const handlePhoneChange = (raw: string) => {
    // Allow only digits, +, spaces, parens, dashes
    const digits = raw.replace(/[^\d+() \-]/g, '');
    // If user is typing and starts with 8, auto-convert to +7
    if (digits === '8') {
      setPhone('+7');
      return;
    }
    setPhone(formatPhone(digits));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) { setError('Примите условия использования'); return; }
    if (phone.replace(/\D/g, '').length < 10) { setError('Введите корректный номер телефона'); return; }
    setError('');
    setLoading(true);

    const result = await register(name, email, password);
    setLoading(false);

    if (result.success) {
      setShowWelcome(true);
    } else {
      setError(result.error || 'Ошибка регистрации');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-white">
      <div className="w-full max-w-sm animate-fade-in">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-brand-500 mb-2">Аннамама</h1>
          <p className="text-sm text-ink-400">Присоединяйтесь к нам</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ваше имя"
            className="input-premium"
            required
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="input-premium"
            required
          />

          {/* Phone with international support */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-300">
              <Phone className="w-4 h-4" />
            </div>
            <input
              type="tel"
              value={phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              placeholder="+7 (___) ___-__-__"
              className="input-premium pl-11"
              required
            />
          </div>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Пароль"
            className="input-premium"
            required
            minLength={6}
          />

          {/* Telegram link */}
          <a
            href="https://t.me/annamama_bot"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 bg-surface-50 rounded-2xl border border-surface-200 hover:border-brand-300 transition-colors group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#2AABEE]/10 flex items-center justify-center shrink-0">
              <SendIcon className="w-5 h-5 text-[#2AABEE]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-ink-900">Привязать Telegram</p>
              <p className="text-[11px] text-ink-400 leading-snug">Получайте уведомления в мессенджере</p>
            </div>
            <span className="text-xs font-bold text-brand-500 group-hover:translate-x-0.5 transition-transform">→</span>
          </a>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-surface-300 text-brand-500 focus:ring-brand-500"
            />
            <span className="text-xs text-ink-400 leading-relaxed">
              Я соглашаюсь с{' '}
              <span className="text-brand-500 font-semibold">условиями использования</span>{' '}
              и{' '}
              <span className="text-brand-500 font-semibold">политикой конфиденциальности</span>
            </span>
          </label>

          {error && (
            <p className="text-sm text-destructive font-medium bg-destructive/5 px-4 py-3 rounded-xl">{error}</p>
          )}

          <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">
            {loading ? 'Создание...' : 'Создать аккаунт'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className="text-sm font-semibold text-brand-500">
            Уже есть аккаунт? Войти
          </Link>
        </div>
      </div>

      {/* Welcome onboarding popup */}
      <Dialog open={showWelcome} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-sm border-none shadow-2xl rounded-3xl text-center p-10 [&>button]:hidden">
          <DialogTitle className="sr-only">Добро пожаловать</DialogTitle>
          <div className="flex flex-col items-center gap-5 animate-scale-in">
            <div className="w-20 h-20 rounded-full bg-brand-100 flex items-center justify-center animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]">
              <Sparkles className="w-10 h-10 text-brand-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-ink-900 mb-2">Добро пожаловать!</h2>
              <p className="text-sm text-ink-400 leading-relaxed">
                Вы в экосистеме Аннамама.<br />
                Впереди — всё для вас и малыша.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
