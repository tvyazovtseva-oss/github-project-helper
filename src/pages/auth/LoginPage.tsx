import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Heart, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      // Redirect based on role will be handled by route guards
      navigate('/');
    } else {
      setError(result.error || 'Ошибка входа');
    }
  };

  const quickLogin = async (email: string) => {
    setLoading(true);
    const result = await login(email, 'demo');
    setLoading(false);
    if (result.success) navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-white">
      <div className="w-full max-w-sm animate-fade-in">
        <div className="text-center mb-10">
          <Heart className="w-12 h-12 text-brand-500 fill-brand-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-ink-900 mb-1">Anna MAMA</h1>
          <p className="text-sm text-ink-400">Здоровье и развитие малыша</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="input-premium"
            required
          />
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Пароль"
              className="input-premium pr-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-300"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {error && (
            <p className="text-sm text-destructive font-medium bg-destructive/5 px-4 py-3 rounded-xl">{error}</p>
          )}

          <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/register" className="text-sm font-semibold text-brand-500">
            Создать аккаунт
          </Link>
        </div>

        {/* Quick demo access */}
        <div className="mt-10 pt-6 border-t border-surface-200">
          <p className="text-xs text-ink-300 text-center mb-3 font-medium">Демо-доступ</p>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => quickLogin('demo@mama.ru')} className="px-3 py-2.5 bg-surface-50 rounded-xl text-xs font-bold text-ink-500 hover:bg-surface-100 transition-all active:scale-[0.97]">
              👩 Мама
            </button>
            <button onClick={() => quickLogin('doctor@anna.ru')} className="px-3 py-2.5 bg-surface-50 rounded-xl text-xs font-bold text-ink-500 hover:bg-surface-100 transition-all active:scale-[0.97]">
              🩺 Врач
            </button>
            <button onClick={() => quickLogin('admin@anna.ru')} className="px-3 py-2.5 bg-surface-50 rounded-xl text-xs font-bold text-ink-500 hover:bg-surface-100 transition-all active:scale-[0.97]">
              ⚙️ Админ
            </button>
            <button onClick={() => quickLogin('support@anna.ru')} className="px-3 py-2.5 bg-surface-50 rounded-xl text-xs font-bold text-ink-500 hover:bg-surface-100 transition-all active:scale-[0.97]">
              🎧 Поддержка
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
