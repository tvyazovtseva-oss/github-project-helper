import { useState } from 'react';
import { CreditCard, Copy, Check, ExternalLink, Settings } from 'lucide-react';

export default function AdminPaymentsPage() {
  const [gateway, setGateway] = useState<'cloudpayments' | 'stripe'>('cloudpayments');
  const [publicId, setPublicId] = useState('pk_test_1234567890');
  const [copied, setCopied] = useState(false);

  const widgetCode = `<script src="https://widget.cloudpayments.ru/bundles/cloudpayments.js"></script>
<script>
var widget = new cp.CloudPayments();
widget.pay('charge', {
  publicId: '${publicId}',
  description: 'Подписка Аннамама',
  amount: 1900,
  currency: 'RUB',
  skin: 'mini'
});
</script>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(widgetCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 lg:p-8 max-w-4xl animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-ink-900">Платежи</h1>
            <CreditCard className="w-5 h-5 text-brand-500" />
          </div>
          <p className="text-sm text-ink-400 mt-1">Интеграция платёжных шлюзов</p>
        </div>
      </div>

      {/* Gateway selector */}
      <div className="bg-white rounded-2xl border border-surface-200 p-6 mb-6">
        <h3 className="font-bold text-ink-900 mb-4 flex items-center gap-2"><Settings className="w-4 h-4 text-brand-500" /> Платежный шлюз</h3>
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setGateway('cloudpayments')}
            className={`flex-1 p-4 rounded-xl border-2 transition-all ${gateway === 'cloudpayments' ? 'border-brand-500 bg-brand-50' : 'border-surface-200 hover:border-surface-300'}`}
          >
            <p className="font-bold text-sm text-ink-900">CloudPayments</p>
            <p className="text-xs text-ink-400 mt-1">Для российского рынка</p>
          </button>
          <button
            onClick={() => setGateway('stripe')}
            className={`flex-1 p-4 rounded-xl border-2 transition-all ${gateway === 'stripe' ? 'border-brand-500 bg-brand-50' : 'border-surface-200 hover:border-surface-300'}`}
          >
            <p className="font-bold text-sm text-ink-900">Stripe</p>
            <p className="text-xs text-ink-400 mt-1">Международные платежи</p>
          </button>
        </div>

        <div>
          <label className="text-xs font-bold text-ink-400 mb-1 block">
            {gateway === 'cloudpayments' ? 'Public ID' : 'Publishable Key'}
          </label>
          <input
            value={publicId}
            onChange={(e) => setPublicId(e.target.value)}
            className="admin-input font-mono"
            placeholder={gateway === 'cloudpayments' ? 'pk_...' : 'pk_test_...'}
          />
        </div>
      </div>

      {/* Widget code */}
      <div className="bg-white rounded-2xl border border-surface-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-ink-900">Код виджета для Tilda</h3>
          <button onClick={handleCopy} className="flex items-center gap-2 px-3 py-2 text-xs font-bold bg-surface-50 rounded-xl hover:bg-surface-100 transition-colors">
            {copied ? <><Check className="w-3 h-3 text-emerald-500" /> Скопировано</> : <><Copy className="w-3 h-3" /> Копировать</>}
          </button>
        </div>
        <pre className="bg-ink-900 text-emerald-400 p-4 rounded-xl text-xs overflow-x-auto font-mono leading-relaxed">
          {widgetCode}
        </pre>
      </div>

      {/* Instructions */}
      <div className="bg-surface-50 rounded-2xl p-6">
        <h3 className="font-bold text-ink-900 mb-3">Как подключить</h3>
        <ol className="space-y-2 text-sm text-ink-500">
          <li className="flex gap-3"><span className="w-6 h-6 rounded-full bg-brand-500 text-white flex items-center justify-center text-xs font-bold shrink-0">1</span>Зарегистрируйтесь в {gateway === 'cloudpayments' ? 'CloudPayments' : 'Stripe'}</li>
          <li className="flex gap-3"><span className="w-6 h-6 rounded-full bg-brand-500 text-white flex items-center justify-center text-xs font-bold shrink-0">2</span>Вставьте ваш Public ID / Publishable Key выше</li>
          <li className="flex gap-3"><span className="w-6 h-6 rounded-full bg-brand-500 text-white flex items-center justify-center text-xs font-bold shrink-0">3</span>Скопируйте код виджета и вставьте в Tilda (блок T123)</li>
        </ol>
        <a href={gateway === 'cloudpayments' ? 'https://cloudpayments.ru' : 'https://stripe.com'} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-4 text-xs font-bold text-brand-500 hover:text-brand-600">
          Перейти в личный кабинет <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
