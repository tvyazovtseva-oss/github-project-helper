import { useState, useMemo } from 'react';
import {
  TrendingUp, DollarSign, Users, BarChart3, Calendar,
  CheckCircle2, Download, FileSpreadsheet, ListFilter
} from 'lucide-react';

const MOCK_SALES = [
  { id: 'tx_1', user: 'Елена Смирнова', product: 'Клуб (12 мес)', tariff: 'Годовой VIP', amount: 12000, monthlyValue: 1000, date: '2024-03-10T14:30:00', status: 'active' },
  { id: 'tx_2', user: 'Мария Петрова', product: 'Гайд: Сон', tariff: 'Базовый', amount: 1500, monthlyValue: 1500, date: '2024-03-12T09:15:00', status: 'completed' },
  { id: 'tx_3', user: 'Анна Иванова', product: 'Клуб (1 мес)', tariff: 'Стандарт', amount: 1900, monthlyValue: 1900, date: '2024-02-28T22:45:00', status: 'inactive' },
  { id: 'tx_4', user: 'Ольга Сидорова', product: 'Клуб (12 мес)', tariff: 'Годовой', amount: 12000, monthlyValue: 1000, date: '2024-03-15T11:00:00', status: 'active' },
];

const PRODUCTS_LIST = ['Клуб (12 мес)', 'Клуб (1 мес)', 'Гайд: Сон', 'Вебинар: Прикорм'];

export default function AdminAnalyticsPage() {
  const [dateFrom, setDateFrom] = useState('2024-03-01T00:00');
  const [dateTo, setDateTo] = useState('2024-03-31T23:59');
  const [selectedProduct, setSelectedProduct] = useState('all');
  const [showActiveOnly, setShowActiveOnly] = useState(false);

  const filteredSales = useMemo(() => {
    return MOCK_SALES.filter(s => {
      const d = new Date(s.date);
      const from = new Date(dateFrom);
      const to = new Date(dateTo);
      if (d < from || d > to) return false;
      if (selectedProduct !== 'all' && s.product !== selectedProduct) return false;
      if (showActiveOnly && s.status !== 'active') return false;
      return true;
    });
  }, [dateFrom, dateTo, selectedProduct, showActiveOnly]);

  const totalRevenue = filteredSales.reduce((sum, s) => sum + s.amount, 0);
  const totalMRR = filteredSales.reduce((sum, s) => sum + s.monthlyValue, 0);
  const arpu = filteredSales.length > 0 ? Math.round(totalRevenue / filteredSales.length) : 0;

  const handleExport = (format: string) => alert(`Экспорт в ${format} (демо)`);

  return (
    <div className="p-6 lg:p-8 max-w-6xl animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">Аналитика продаж</h1>
          <p className="text-sm text-ink-400 mt-1">Детальный отчёт по транзакциям</p>
        </div>
      </div>

      {/* Report builder */}
      <div className="bg-white rounded-2xl border border-surface-200 p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <ListFilter className="w-4 h-4 text-brand-500" />
          <h3 className="font-bold text-sm text-ink-900">Конструктор отчёта</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-xs font-bold text-ink-400 mb-1 block">От</label>
            <input type="datetime-local" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="admin-input text-xs" />
          </div>
          <div>
            <label className="text-xs font-bold text-ink-400 mb-1 block">До</label>
            <input type="datetime-local" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="admin-input text-xs" />
          </div>
          <div>
            <label className="text-xs font-bold text-ink-400 mb-1 block">Продукт</label>
            <select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)} className="admin-input text-xs">
              <option value="all">Все продукты</option>
              {PRODUCTS_LIST.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div className="flex items-end gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={showActiveOnly} onChange={(e) => setShowActiveOnly(e.target.checked)} className="rounded border-surface-300" />
              <span className="text-xs font-bold text-ink-500">Только активные</span>
            </label>
            <span className="text-xs text-ink-300 ml-auto">Найдено: {filteredSales.length}</span>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <KPICard icon={DollarSign} label="Выручка" value={`${totalRevenue.toLocaleString()} ₽`} sub="За выбранный период" color="text-emerald-500" />
        <KPICard icon={TrendingUp} label="MRR" value={`${totalMRR.toLocaleString()} ₽ /мес`} sub="Годовые чеки размазаны помесячно" color="text-blue-500" />
        <KPICard icon={Users} label="ARPU" value={`${arpu.toLocaleString()} ₽`} sub="+5.2%" color="text-brand-500" />
      </div>

      {/* Transactions */}
      <div className="bg-white rounded-2xl border border-surface-200 overflow-hidden">
        <div className="flex items-center justify-between p-6 pb-4">
          <h3 className="font-bold text-ink-900">Журнал транзакций</h3>
          <div className="flex gap-2">
            <button onClick={() => handleExport('CSV')} className="flex items-center gap-1.5 px-3 py-2 border border-surface-300 rounded-xl text-xs font-bold text-ink-500 hover:bg-surface-50">
              <Download className="w-3 h-3" /> CSV
            </button>
            <button onClick={() => handleExport('XLSX')} className="flex items-center gap-1.5 px-3 py-2 border border-surface-300 rounded-xl text-xs font-bold text-ink-500 hover:bg-surface-50">
              <FileSpreadsheet className="w-3 h-3 text-emerald-500" /> XLSX
            </button>
          </div>
        </div>
        {filteredSales.length > 0 ? (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-t border-surface-200 text-ink-400">
                <th className="text-left px-6 py-3 font-bold text-xs">Мама</th>
                <th className="text-left px-6 py-3 font-bold text-xs">Продукт</th>
                <th className="text-left px-6 py-3 font-bold text-xs">Дата</th>
                <th className="text-right px-6 py-3 font-bold text-xs">Сумма</th>
                <th className="text-right px-6 py-3 font-bold text-xs">Статус</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.map(s => (
                <tr key={s.id} className="border-t border-surface-100 hover:bg-surface-50/50">
                  <td className="px-6 py-4">
                    <p className="font-bold text-ink-900">{s.user}</p>
                    <p className="text-xs text-ink-300">{s.id}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-ink-700">{s.product}</p>
                    <p className="text-xs text-ink-300">{s.tariff}</p>
                  </td>
                  <td className="px-6 py-4 text-ink-500">
                    {new Date(s.date).toLocaleDateString('ru')}
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-ink-900 tabular-nums">{s.amount.toLocaleString()} ₽</td>
                  <td className="px-6 py-4 text-right">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${s.status === 'active' ? 'bg-emerald-50 text-emerald-600' : s.status === 'completed' ? 'bg-blue-50 text-blue-600' : 'bg-surface-100 text-ink-400'}`}>
                      {s.status === 'active' ? 'Активна' : s.status === 'completed' ? 'Завершена' : 'Неактивна'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-12 text-center">
            <BarChart3 className="w-12 h-12 text-ink-200 mx-auto mb-3" />
            <p className="text-sm text-ink-400">Нет данных за выбранный период</p>
          </div>
        )}
      </div>
    </div>
  );
}

function KPICard({ icon: Icon, label, value, sub, color }: { icon: typeof DollarSign; label: string; value: string; sub: string; color: string }) {
  return (
    <div className="bg-white rounded-2xl border border-surface-200 p-6">
      <div className="flex items-center gap-2 mb-3">
        <Icon className={`w-4 h-4 ${color}`} />
        <span className="text-xs font-bold text-ink-400">{label}</span>
      </div>
      <p className="text-2xl font-bold text-ink-900 tabular-nums">{value}</p>
      <p className="text-xs text-ink-300 mt-1">{sub}</p>
    </div>
  );
}
