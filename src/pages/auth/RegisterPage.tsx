import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Heart } from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) { setError('Примите условия использования'); return; }
    setError('');
    setLoading(true);

    const result = await register(name, email, password);
    setLoading(false);

    if (result.success) {
      navigate('/mama');
    } else {
      setError(result.error || 'Ошибка регистрации');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-white">
      <div className="w-full max-w-sm animate-fade-in">
        <div className="text-center mb-10">
          <Heart className="w-12 h-12 text-brand-500 fill-brand-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-ink-900 mb-1">Регистрация</h1>
          <p className="text-sm text-ink-400">Присоединяйтесь к Anna MAMA</p>
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
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Пароль"
            className="input-premium"
            required
            minLength={6}
          />

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
    </div>
  );
}
