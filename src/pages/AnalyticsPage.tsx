import { useState, useMemo } from 'react';
import {
  TrendingUp, CheckCircle2, Search, ArrowRight,
  ListFilter, Download, FileSpreadsheet
} from 'lucide-react';

const MOCK_SALES = [
  { id: 'tx_1', user: 'Елена Смирнова', product: 'Клуб (1 мес)', tariff: 'Базовый', amount: 2900, monthlyValue: 2900, date: '2024-03-17T14:30:00', status: 'active' },
  { id: 'tx_2', user: 'Анна Иванова', product: 'Гайд: Сон', tariff: 'Стандарт', amount: 990, monthlyValue: 990, date: '2024-03-16T09:15:00', status: 'completed' },
  { id: 'tx_3', user: 'Мария Петрова', product: 'Клуб (12 мес)', tariff: 'Годовой VIP', amount: 24000, monthlyValue: 2000, date: '2024-03-15T18:00:00', status: 'active' },
  { id: 'tx_4', user: 'Ольга Сидорова', product: 'Клуб (12 мес)', tariff: 'Годовой', amount: 12000, monthlyValue: 1000, date: '2024-03-15T11:00:00', status: 'active' },
];

const PRODUCTS_LIST = ['Клуб (12 мес)', 'Клуб (1 мес)', 'Гайд: Сон', 'Вебинар: Прикорм'];

export default function AnalyticsPage() {
  const [dateFrom, setDateFrom] = useState('2024-03-01T00:00');
  const [dateTo, setDateTo] = useState('2024-03-31T23:59');
  const [selectedProduct, setSelectedProduct] = useState('all');
  const [showActiveOnly, setShowActiveOnly] = useState(false);

  const filteredSales = useMemo(() => {
    return MOCK_SALES.filter(sale => {
      const saleDate = new Date(sale.date);
      const matchesDate = saleDate >= new Date(dateFrom) && saleDate <= new Date(dateTo);
      const matchesProduct = selectedProduct === 'all' || sale.product === selectedProduct;
      const matchesStatus = !showActiveOnly || sale.status === 'active';
      return matchesDate && matchesProduct && matchesStatus;
    });
  }, [dateFrom, dateTo, selectedProduct, showActiveOnly]);

  const totalRevenue = filteredSales.reduce((acc, curr) => acc + curr.amount, 0);
  const totalMonthlyValue = filteredSales.reduce((acc, curr) => acc + curr.monthlyValue, 0);

  return (
    <>
      <header className="bg-card border-b border-border px-8 py-5 flex items-center justify-between shrink-0">
        <h2 className="text-2xl font-bold">Детальная аналитика продаж</h2>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-xl text-sm font-bold hover:bg-muted transition-all">
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> XLSX
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-xl text-sm font-bold hover:bg-muted transition-all">
            <Download className="w-4 h-4 text-blue-600" /> CSV
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-7xl mx-auto space-y-8 pb-20">
          {/* Filters */}
          <div className="bg-card p-6 rounded-3xl border border-border shadow-sm space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <ListFilter className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-lg">Конструктор отчета</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Период</label>
                <div className="flex items-center gap-3">
                  <input type="datetime-local" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="flex-1 bg-muted border border-border p-2.5 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20" />
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  <input type="datetime-local" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="flex-1 bg-muted border border-border p-2.5 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Продукт</label>
                <select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)} className="w-full bg-muted border border-border p-2.5 rounded-xl text-sm font-medium outline-none">
                  <option value="all">Все продукты</option>
                  {PRODUCTS_LIST.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-10 h-6 rounded-full transition-colors relative ${showActiveOnly ? 'bg-primary' : 'bg-muted-foreground/30'}`}>
                  <input type="checkbox" className="hidden" checked={showActiveOnly} onChange={() => setShowActiveOnly(!showActiveOnly)} />
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${showActiveOnly ? 'left-5' : 'left-1'}`} />
                </div>
                <span className="text-sm font-bold text-muted-foreground group-hover:text-foreground">Только активные</span>
              </label>
              <span className="text-xs text-muted-foreground italic">Найдено: <span className="text-primary font-bold">{filteredSales.length}</span></span>
            </div>
          </div>

          {/* KPI */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-3xl border border-border shadow-sm relative overflow-hidden group">
              <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest mb-2">Общая выручка</p>
              <h4 className="text-4xl font-black">{totalRevenue.toLocaleString()} ₽</h4>
              <p className="text-xs text-muted-foreground mt-4 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> За выбранный период</p>
            </div>
            <div className="bg-secondary p-8 rounded-3xl shadow-xl text-secondary-foreground">
              <p className="text-[11px] font-bold text-primary uppercase tracking-widest mb-2 flex items-center gap-2"><TrendingUp className="w-4 h-4" /> MRR</p>
              <h4 className="text-4xl font-black">{totalMonthlyValue.toLocaleString()} ₽</h4>
              <p className="text-xs text-sidebar-foreground mt-4">Реальный доход в месяц</p>
            </div>
            <div className="bg-card p-8 rounded-3xl border border-border shadow-sm">
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2">ARPU</p>
              <h4 className="text-3xl font-black">{(filteredSales.length ? Math.round(totalRevenue / filteredSales.length) : 0).toLocaleString()} ₽</h4>
              <div className="flex items-center gap-2 text-xs font-bold text-green-600 bg-green-50 self-start px-2 py-1 rounded-lg mt-4 w-fit">
                <TrendingUp className="w-3 h-3" /> +5.2%
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden">
            <div className="p-8 border-b border-border">
              <h3 className="font-black text-xl">Журнал транзакций</h3>
              <p className="text-sm text-muted-foreground mt-1">Детальный список оплат</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase">Мама</th>
                    <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase">Продукт</th>
                    <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase text-center">Дата</th>
                    <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase text-right">Сумма</th>
                    <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase text-right">Доход/мес</th>
                    <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase text-center">Статус</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredSales.map(sale => (
                    <tr key={sale.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-8 py-5">
                        <p className="font-bold">{sale.user}</p>
                        <p className="text-[10px] text-muted-foreground uppercase mt-0.5">ID: {sale.id}</p>
                      </td>
                      <td className="px-8 py-5">
                        <p className="text-sm font-bold">{sale.product}</p>
                        <p className="text-xs text-primary font-medium">{sale.tariff}</p>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <p className="text-sm font-medium">{new Date(sale.date).toLocaleDateString('ru-RU')}</p>
                        <p className="text-[10px] text-muted-foreground font-bold">{new Date(sale.date).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</p>
                      </td>
                      <td className="px-8 py-5 text-right font-black">{sale.amount.toLocaleString()} ₽</td>
                      <td className="px-8 py-5 text-right text-sm font-bold text-emerald-600">{sale.monthlyValue.toLocaleString()} ₽</td>
                      <td className="px-8 py-5 text-center">
                        <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${sale.status === 'active' ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-muted text-muted-foreground border border-border'}`}>
                          {sale.status === 'active' ? 'Активна' : 'Завершена'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
