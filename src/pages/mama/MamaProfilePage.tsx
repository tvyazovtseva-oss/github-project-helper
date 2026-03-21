import { useState, useMemo, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Country, City, ICountry, ICity } from 'country-state-city';
import {
  User, Baby, Edit3, Calendar, Settings, Bell, BellOff,
  CreditCard, Plus, Crown, Camera, Mail, Phone, MapPin,
  Globe, Send, X, Trash2, MessageSquare, ChevronDown, Pencil, Save
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

// ─── Smart age calculation ────────────────────────────────────────────
function calcAge(birthdate: string): string {
  const born = new Date(birthdate);
  const now = new Date();
  let years = now.getFullYear() - born.getFullYear();
  let months = now.getMonth() - born.getMonth();
  if (now.getDate() < born.getDate()) months--;
  if (months < 0) { years--; months += 12; }

  const totalMonths = years * 12 + months;

  if (totalMonths < 12) return `${totalMonths} мес`;
  if (totalMonths < 24) return `${years} год ${months > 0 ? months + ' мес' : ''}`.trim();
  if (years < 5) return `${years} г ${months > 0 ? months + ' мес' : ''}`.trim();
  return `${years} лет`;
}

// ─── Mock data ────────────────────────────────────────────────────────
interface Child {
  id: string;
  name: string;
  birthdate: string;
  gender: 'girl' | 'boy';
}

const INITIAL_CHILDREN: Child[] = [
  { id: 'child_1', name: 'София', birthdate: '2024-01-15', gender: 'girl' },
  { id: 'child_2', name: 'Даниил', birthdate: '2022-06-10', gender: 'boy' },
];

interface NotifChannel {
  push: boolean;
  email: boolean;
  telegram: boolean;
}

interface NotifSetting {
  key: string;
  label: string;
  group: 'system' | 'marketing';
  channels: NotifChannel;
  required?: boolean;
}

const INITIAL_NOTIF_SETTINGS: NotifSetting[] = [
  { key: 'courses', label: 'Обновления курсов', group: 'system', channels: { push: true, email: true, telegram: false } },
  { key: 'health', label: 'Напоминания по медкарте и здоровью', group: 'system', channels: { push: true, email: false, telegram: false } },
  { key: 'webinars', label: 'Вебинары и эфиры', group: 'system', channels: { push: true, email: true, telegram: true } },
  { key: 'subscription', label: 'Окончание подписки', group: 'system', channels: { push: true, email: true, telegram: false }, required: true },
  { key: 'access', label: 'Доступ к курсам и чеки', group: 'system', channels: { push: true, email: true, telegram: false }, required: true },
  { key: 'promo', label: 'Акции и предложения', group: 'marketing', channels: { push: false, email: false, telegram: false } },
];

const SUBSCRIPTIONS = [
  { id: 'club_main', name: 'Клуб Аннамама', status: 'active' as const, expires: '24.04.2026', expiresTime: '24.04.2026, 23:59', paidDate: '24.04.2025', price: '2 990 ₽/мес', color: '#FF2D55' },
  { id: 'club_woman', name: 'Женская Среда', status: 'active' as const, expires: '12.05.2026', expiresTime: '12.05.2026, 23:59', paidDate: '12.05.2025', price: '1 990 ₽/мес', color: '#AF52DE' },
  { id: 'course_first_aid', name: 'Первая Помощь', status: 'lifetime' as const, expires: '', expiresTime: '', paidDate: '01.09.2024', price: 'Навсегда', color: '#FF9500' },
  { id: 'course_sleep', name: 'Сон малыша', status: 'expired' as const, expires: '01.03.2025', expiresTime: '01.03.2025, 23:59', paidDate: '01.03.2024', price: '4 990 ₽', color: '#5856D6' },
];

const TABS = ['Профиль', 'Дети', 'Рассылки', 'Подписки'];

// ─── Component ────────────────────────────────────────────────────────
export default function MamaProfilePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('Профиль');

  // Profile fields
  const [lastName, setLastName] = useState('Петрова');
  const [firstName, setFirstName] = useState(user?.full_name?.split(' ')[0] || 'Мария');
  const [patronymic, setPatronymic] = useState('Александровна');
  const [phone, setPhone] = useState('+7 912 345-67-89');
  const [dob, setDob] = useState('1992-05-14');
  const [selectedCountryCode, setSelectedCountryCode] = useState('RU');
  const [selectedCityName, setSelectedCityName] = useState('Moscow');
  const [countrySearch, setCountrySearch] = useState('');
  const [citySearch, setCitySearch] = useState('');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Email change dialog
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [emailReason, setEmailReason] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  // Children
  const [children, setChildren] = useState<Child[]>(INITIAL_CHILDREN);
  const [editingChild, setEditingChild] = useState<Child | null>(null);
  const [showChildDialog, setShowChildDialog] = useState(false);

  // Notifications
  const [notifSettings, setNotifSettings] = useState(INITIAL_NOTIF_SETTINGS);

  // ─── Country/City from country-state-city ─────────────────────────
  const allCountries = useMemo(() => Country.getAllCountries(), []);

  const filteredCountries = useMemo(() => {
    if (!countrySearch) return allCountries.slice(0, 30);
    const q = countrySearch.toLowerCase();
    return allCountries.filter(c =>
      c.name.toLowerCase().includes(q) || c.isoCode.toLowerCase().includes(q)
    ).slice(0, 30);
  }, [countrySearch, allCountries]);

  const citiesForCountry = useMemo(() =>
    City.getCitiesOfCountry(selectedCountryCode) || [],
    [selectedCountryCode]
  );

  const filteredCities = useMemo(() => {
    if (!citySearch) return citiesForCountry.slice(0, 30);
    const q = citySearch.toLowerCase();
    return citiesForCountry.filter(c => c.name.toLowerCase().includes(q)).slice(0, 30);
  }, [citySearch, citiesForCountry]);

  const selectedCountry = useMemo(() =>
    allCountries.find(c => c.isoCode === selectedCountryCode),
    [selectedCountryCode, allCountries]
  );

  const countryDisplayName = selectedCountry ? `${selectedCountry.flag} ${selectedCountry.name}` : '';

  const toggleNotif = useCallback((key: string, channel: keyof NotifChannel) => {
    setNotifSettings(prev => prev.map(n => {
      if (n.key !== key) return n;
      const newChannels = { ...n.channels, [channel]: !n.channels[channel] };

      if (n.required) {
        const otherActive = (channel === 'email')
          ? (newChannels.push || newChannels.telegram)
          : true;

        if (channel === 'email' && !newChannels.email && !otherActive) {
          toast.error('Email нельзя отключить без альтернативного канала (Push или Telegram)');
          return n;
        }
        if (!newChannels.push && !newChannels.email && !newChannels.telegram) {
          toast.error('Должен остаться хотя бы один активный канал');
          return { ...n, channels: { ...newChannels, email: true } };
        }
      }
      return { ...n, channels: newChannels };
    }));
  }, []);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (avatarUrl) URL.revokeObjectURL(avatarUrl);
    setAvatarUrl(URL.createObjectURL(file));
  };

  const handleSendEmailRequest = () => {
    setEmailSent(true);
    setTimeout(() => { setShowEmailDialog(false); setEmailSent(false); setNewEmail(''); setEmailReason(''); }, 1500);
  };

  const handleSaveProfile = () => {
    toast.success('Изменения сохранены');
  };

  const saveChild = (child: Child) => {
    setChildren(prev => {
      const exists = prev.find(c => c.id === child.id);
      if (exists) return prev.map(c => c.id === child.id ? child : c);
      return [...prev, child];
    });
    setShowChildDialog(false);
    setEditingChild(null);
  };

  const deleteChild = (id: string) => {
    setChildren(prev => prev.filter(c => c.id !== id));
  };

  const systemNotifs = notifSettings.filter(n => n.group === 'system');
  const marketingNotifs = notifSettings.filter(n => n.group === 'marketing');

  return (
    <div className="pb-6 animate-fade-in">
      {/* Avatar + name header */}
      <div className="px-4 pt-6 pb-4 text-center">
        <div className="relative w-20 h-20 mx-auto mb-3">
          <div className="w-20 h-20 rounded-full bg-brand-100 flex items-center justify-center overflow-hidden">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Аватар" className="w-full h-full object-cover" />
            ) : (
              <User className="w-8 h-8 text-brand-500" />
            )}
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute -bottom-1 -right-1 w-8 h-8 bg-ink-900 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform"
          >
            <Camera className="w-3.5 h-3.5 text-white" />
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
        </div>
        <h2 className="text-lg font-bold text-ink-900">{lastName} {firstName}</h2>
        <p className="text-sm text-ink-400">{user?.email}</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-4 mb-4 overflow-x-auto no-scrollbar">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === tab ? 'bg-ink-900 text-white' : 'bg-surface-100 text-ink-400'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="px-4">
        {/* ─── Profile tab ─────────────────────────────────────── */}
        {activeTab === 'Профиль' && (
          <div className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <FieldRow label="Фамилия" value={lastName} onChange={setLastName} editable />
              <FieldRow label="Имя" value={firstName} onChange={setFirstName} editable />
              <FieldRow label="Отчество" value={patronymic} onChange={setPatronymic} placeholder="Необязательно" editable />
              <FieldRow label="Телефон" value={phone} onChange={setPhone} type="tel" icon={Phone} editable />
              <FieldRow label="Дата рождения" value={dob} onChange={setDob} type="date" icon={Calendar} editable />

              {/* Email — read-only + button */}
              <div className="p-4 bg-surface-50 rounded-2xl">
                <p className="text-[10px] text-ink-300 uppercase font-bold tracking-wider mb-1">Email</p>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-bold text-ink-900 truncate">{user?.email}</p>
                  <button
                    onClick={() => setShowEmailDialog(true)}
                    className="text-[11px] font-bold text-brand-500 whitespace-nowrap active:scale-95 transition-transform flex items-center gap-1"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    Изменить
                  </button>
                </div>
              </div>

              <FieldRow label="Дата регистрации" value="15 января 2024" readOnly icon={Calendar} />

              {/* Country — cascading with country-state-city */}
              <div className="relative">
                <div className="p-4 bg-surface-50 rounded-2xl">
                  <p className="text-[10px] text-ink-300 uppercase font-bold tracking-wider mb-1">Страна</p>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-ink-300 shrink-0" />
                    <input
                      value={showCountryDropdown ? countrySearch : countryDisplayName}
                      onChange={(e) => { setCountrySearch(e.target.value); setShowCountryDropdown(true); }}
                      onFocus={() => { setShowCountryDropdown(true); setCountrySearch(''); }}
                      onBlur={() => setTimeout(() => setShowCountryDropdown(false), 200)}
                      className="flex-1 text-sm font-bold text-ink-900 bg-transparent outline-none"
                      placeholder="Начните вводить..."
                    />
                    <Pencil className="w-3.5 h-3.5 text-ink-200 shrink-0" />
                  </div>
                </div>
                {showCountryDropdown && filteredCountries.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-2xl shadow-xl border border-surface-200 z-20 max-h-48 overflow-y-auto">
                    {filteredCountries.map(c => (
                      <button
                        key={c.isoCode}
                        onMouseDown={() => {
                          setSelectedCountryCode(c.isoCode);
                          setSelectedCityName('');
                          setCitySearch('');
                          setShowCountryDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-sm hover:bg-surface-50 transition-colors first:rounded-t-2xl last:rounded-b-2xl ${c.isoCode === selectedCountryCode ? 'font-bold text-brand-500' : 'text-ink-700'}`}
                      >
                        {c.flag} {c.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* City — cascading */}
              <div className="relative">
                <div className="p-4 bg-surface-50 rounded-2xl">
                  <p className="text-[10px] text-ink-300 uppercase font-bold tracking-wider mb-1">Город</p>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-ink-300 shrink-0" />
                    <input
                      value={showCityDropdown ? citySearch : selectedCityName}
                      onChange={(e) => { setCitySearch(e.target.value); setShowCityDropdown(true); }}
                      onFocus={() => { setShowCityDropdown(true); setCitySearch(''); }}
                      onBlur={() => setTimeout(() => setShowCityDropdown(false), 200)}
                      className="flex-1 text-sm font-bold text-ink-900 bg-transparent outline-none"
                      placeholder={selectedCountryCode ? 'Начните вводить...' : 'Сначала выберите страну'}
                      disabled={!selectedCountryCode}
                    />
                    <Pencil className="w-3.5 h-3.5 text-ink-200 shrink-0" />
                  </div>
                </div>
                {showCityDropdown && filteredCities.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-2xl shadow-xl border border-surface-200 z-20 max-h-48 overflow-y-auto">
                    {filteredCities.map((c, idx) => (
                      <button
                        key={`${c.name}-${idx}`}
                        onMouseDown={() => { setSelectedCityName(c.name); setShowCityDropdown(false); }}
                        className={`w-full text-left px-4 py-3 text-sm hover:bg-surface-50 transition-colors first:rounded-t-2xl last:rounded-b-2xl ${c.name === selectedCityName ? 'font-bold text-brand-500' : 'text-ink-700'}`}
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Save button */}
            <button
              onClick={handleSaveProfile}
              className="w-full mt-6 flex items-center justify-center gap-2 py-3.5 bg-ink-900 text-white text-sm font-bold rounded-2xl active:scale-[0.98] transition-transform"
            >
              <Save className="w-4 h-4" />
              Сохранить изменения
            </button>
          </div>
        )}

        {/* ─── Children tab ────────────────────────────────────── */}
        {activeTab === 'Дети' && (
          <div className="animate-fade-in">
            <div className="space-y-2 mb-4">
              {children.map(child => (
                <div key={child.id} className="flex items-center gap-4 p-4 bg-surface-50 rounded-2xl">
                  <div className="w-11 h-11 rounded-full bg-brand-100 flex items-center justify-center shrink-0">
                    <Baby className="w-5 h-5 text-brand-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-ink-900">{child.name}</p>
                    <p className="text-xs text-ink-400">
                      {child.gender === 'girl' ? 'Девочка' : 'Мальчик'} · {calcAge(child.birthdate)}
                    </p>
                    <p className="text-[10px] text-ink-300 mt-0.5">
                      {new Date(child.birthdate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => { setEditingChild(child); setShowChildDialog(true); }}
                      className="p-2 rounded-xl hover:bg-surface-200 transition-colors"
                    >
                      <Edit3 className="w-4 h-4 text-ink-300" />
                    </button>
                    <button
                      onClick={() => deleteChild(child.id)}
                      className="p-2 rounded-xl hover:bg-destructive/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-ink-300" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => { setEditingChild(null); setShowChildDialog(true); }}
              className="w-full flex items-center justify-center gap-2 p-3 bg-surface-100 rounded-2xl text-sm font-bold text-ink-400 active:scale-[0.98] transition-transform"
            >
              <Plus className="w-4 h-4" /> Добавить ребёнка
            </button>
          </div>
        )}

        {/* ─── Notifications tab (Рассылки) ────────────────────── */}
        {activeTab === 'Рассылки' && (
          <div className="animate-fade-in space-y-6">
            <div>
              <h3 className="text-xs font-bold text-ink-300 uppercase tracking-wider mb-3">Системные уведомления</h3>
              <div className="space-y-3">
                {systemNotifs.map(n => (
                  <NotifSettingCard key={n.key} item={n} onToggle={toggleNotif} />
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xs font-bold text-ink-300 uppercase tracking-wider mb-3">Маркетинговые рассылки</h3>
              <div className="space-y-3">
                {marketingNotifs.map(n => (
                  <NotifSettingCard key={n.key} item={n} onToggle={toggleNotif} />
                ))}
              </div>
              <p className="text-[10px] text-ink-300 mt-2 px-1">
                Вы можете отключить маркетинговые рассылки в любой момент. Системные уведомления нельзя полностью отключить.
              </p>
            </div>
          </div>
        )}

        {/* ─── Subscriptions tab ───────────────────────────────── */}
        {activeTab === 'Подписки' && (
          <div className="space-y-3 animate-fade-in">
            {SUBSCRIPTIONS.map(sub => (
              <div key={sub.id} className="p-4 bg-surface-50 rounded-2xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: sub.color + '15' }}>
                    <Crown className="w-4 h-4" style={{ color: sub.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-ink-900">{sub.name}</p>
                    <p className="text-[10px] text-ink-400">
                      {sub.status === 'lifetime' ? 'Бессрочная' : sub.status === 'expired' ? `Истекла: ${sub.expiresTime}` : `До ${sub.expiresTime}`}
                    </p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    sub.status === 'active' ? 'bg-green-50 text-green-600'
                    : sub.status === 'expired' ? 'bg-surface-200 text-ink-400'
                    : 'bg-blue-50 text-blue-600'
                  }`}>
                    {sub.status === 'active' ? 'Активна' : sub.status === 'expired' ? 'Истекла' : 'Навсегда'}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-surface-200">
                  <div className="text-left">
                    <span className="text-xs font-bold text-ink-500">{sub.price}</span>
                    <p className="text-[10px] text-ink-300">Оплачено: {sub.paidDate}</p>
                  </div>
                  {sub.status !== 'lifetime' && (
                    <button className="text-xs font-bold text-brand-500 active:scale-95 transition-transform">
                      Продлить →
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ─── Email change dialog ───────────────────────────────── */}
      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent className="sm:max-w-sm rounded-3xl">
          <DialogHeader>
            <DialogTitle>Запрос на смену Email</DialogTitle>
          </DialogHeader>
          {emailSent ? (
            <div className="text-center py-6 animate-fade-in">
              <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-3">
                <Send className="w-6 h-6 text-green-500" />
              </div>
              <p className="text-sm font-bold text-ink-900">Заявка отправлена!</p>
              <p className="text-xs text-ink-400 mt-1">Администратор свяжется с вами</p>
            </div>
          ) : (
            <div className="space-y-4 py-2">
              <div>
                <label className="text-xs font-bold text-ink-500 mb-1 block">Текущий Email</label>
                <p className="text-sm text-ink-400 bg-surface-50 px-4 py-3 rounded-xl">{user?.email}</p>
              </div>
              <div>
                <label className="text-xs font-bold text-ink-500 mb-1 block">Новый Email</label>
                <input value={newEmail} onChange={(e) => setNewEmail(e.target.value)} type="email" placeholder="new@email.com" className="input-premium" />
              </div>
              <div>
                <label className="text-xs font-bold text-ink-500 mb-1 block">Причина</label>
                <textarea
                  value={emailReason}
                  onChange={(e) => setEmailReason(e.target.value)}
                  placeholder="Укажите причину смены..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-surface-50 border border-surface-200 text-sm text-ink-900 outline-none focus:ring-2 focus:ring-brand-500/30 resize-none"
                />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <button className="px-4 py-2.5 text-sm font-bold text-ink-400 rounded-xl">Отмена</button>
                </DialogClose>
                <button
                  onClick={handleSendEmailRequest}
                  disabled={!newEmail || !emailReason}
                  className="px-5 py-2.5 bg-ink-900 text-white text-sm font-bold rounded-xl disabled:opacity-40 active:scale-95 transition-transform"
                >
                  Отправить
                </button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ─── Child edit/add dialog ─────────────────────────────── */}
      <ChildDialog
        open={showChildDialog}
        onOpenChange={(open) => { setShowChildDialog(open); if (!open) setEditingChild(null); }}
        child={editingChild}
        onSave={saveChild}
      />
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────

function FieldRow({
  label, value, onChange, readOnly, type = 'text', placeholder, icon: Icon, editable,
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  readOnly?: boolean;
  type?: string;
  placeholder?: string;
  icon?: typeof User;
  editable?: boolean;
}) {
  return (
    <div className="p-4 bg-surface-50 rounded-2xl">
      <p className="text-[10px] text-ink-300 uppercase font-bold tracking-wider mb-1">{label}</p>
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4 text-ink-300 shrink-0" />}
        {readOnly ? (
          <p className="text-sm font-bold text-ink-900">{value}</p>
        ) : (
          <>
            <input
              type={type}
              value={value}
              onChange={(e) => onChange?.(e.target.value)}
              placeholder={placeholder}
              className="flex-1 text-sm font-bold text-ink-900 bg-transparent outline-none placeholder:text-ink-200 placeholder:font-normal"
            />
            {editable && <Pencil className="w-3.5 h-3.5 text-ink-200 shrink-0" />}
          </>
        )}
      </div>
    </div>
  );
}

function NotifSettingCard({
  item, onToggle,
}: {
  item: NotifSetting;
  onToggle: (key: string, channel: keyof NotifChannel) => void;
}) {
  const channels: { key: keyof NotifChannel; label: string }[] = [
    { key: 'push', label: 'Push' },
    { key: 'email', label: 'Email' },
    { key: 'telegram', label: 'Telegram' },
  ];

  return (
    <div className="p-4 bg-surface-50 rounded-2xl">
      <div className="flex items-center gap-2 mb-3">
        <p className="font-bold text-sm text-ink-900">{item.label}</p>
        {item.required && (
          <span className="text-[9px] font-bold text-ink-300 bg-surface-200 px-1.5 py-0.5 rounded-full">Обязательно</span>
        )}
      </div>
      <div className="flex gap-2">
        {channels.map(ch => (
          <button
            key={ch.key}
            onClick={() => onToggle(item.key, ch.key)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[11px] font-bold transition-all ${
              item.channels[ch.key] ? 'bg-ink-900 text-white' : 'bg-surface-200 text-ink-400'
            }`}
          >
            {item.channels[ch.key] ? <Bell className="w-3 h-3" /> : <BellOff className="w-3 h-3" />}
            {ch.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function ChildDialog({
  open, onOpenChange, child, onSave,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  child: Child | null;
  onSave: (c: Child) => void;
}) {
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'girl' | 'boy'>('girl');
  const [birthdate, setBirthdate] = useState('');

  const prevOpen = useRef(open);
  if (open && !prevOpen.current) {
    if (child) {
      setName(child.name);
      setGender(child.gender);
      setBirthdate(child.birthdate);
    } else {
      setName('');
      setGender('girl');
      setBirthdate('');
    }
  }
  prevOpen.current = open;

  const handleSave = () => {
    onSave({ id: child?.id || `child_${Date.now()}`, name, gender, birthdate });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm rounded-3xl">
        <DialogHeader>
          <DialogTitle>{child ? 'Редактировать' : 'Добавить ребёнка'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <label className="text-xs font-bold text-ink-500 mb-1 block">Имя</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="input-premium" placeholder="Имя ребёнка" />
          </div>
          <div>
            <label className="text-xs font-bold text-ink-500 mb-1 block">Пол</label>
            <div className="flex gap-2">
              <button
                onClick={() => setGender('girl')}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${gender === 'girl' ? 'bg-brand-500 text-white' : 'bg-surface-100 text-ink-400'}`}
              >
                Девочка
              </button>
              <button
                onClick={() => setGender('boy')}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${gender === 'boy' ? 'bg-brand-500 text-white' : 'bg-surface-100 text-ink-400'}`}
              >
                Мальчик
              </button>
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-ink-500 mb-1 block">Дата рождения</label>
            <input type="date" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} className="input-premium" />
          </div>
          {birthdate && (
            <p className="text-xs text-ink-400 text-center">Возраст: <strong>{calcAge(birthdate)}</strong></p>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <button className="px-4 py-2.5 text-sm font-bold text-ink-400 rounded-xl">Отмена</button>
          </DialogClose>
          <button
            onClick={handleSave}
            disabled={!name || !birthdate}
            className="px-5 py-2.5 bg-ink-900 text-white text-sm font-bold rounded-xl disabled:opacity-40 active:scale-95 transition-transform"
          >
            Сохранить
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
