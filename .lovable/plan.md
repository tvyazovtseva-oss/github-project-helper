

# Plan: Полная интеграция обновленной платформы Anna MAMA

## Что изменится

Текущий проект содержит простую админ-панель из 8 страниц без авторизации. Загруженный код — это полноценная платформа с 4 порталами (мама, врач, поддержка, админ), авторизацией через Supabase, ролевой маршрутизацией и дизайн-системой в стиле Apple/Jony Ive.

## Архитектура новой платформы

```text
/login, /register          — Авторизация (Supabase Auth)
/mama/*                    — Портал мамы (мобильный UI)
  /mama                    — Главная (продукты, новости)
  /mama/library            — База знаний
  /mama/chat               — Чат с врачом (realtime)
  /mama/profile            — Профиль, медкарта, рост, заметки
/doctor/*                  — Портал врача (тикеты)
/support/*                 — Портал поддержки
/admin/*                   — Админ-панель (10 разделов)
  analytics, users, tickets, broadcasts,
  funnels, lessons, access, notifications,
  content, payments
```

## Этапы реализации

### 1. Обновить дизайн-систему
- **tailwind.config.ts** — добавить цвета `brand`, `surface`, `ink`, анимации (`fade-in`, `slide-up`, `scale-in`, `float`)
- **src/index.css** — заменить на новую систему: glass-эффекты, `.input-premium`, `.btn-primary`, `.btn-brand`, `.admin-input`, safe-area, product theme CSS variables

### 2. Создать инфраструктуру авторизации
- **src/lib/supabase.ts** — клиент Supabase (singleton для HMR)
- **src/lib/whoStandards.ts** — WHO стандарты роста (данные + утилиты)
- **src/contexts/AuthContext.tsx** — провайдер авторизации (login, register, logout, роли)
- **src/components/ErrorBoundary.tsx** — обработка ошибок
- **src/components/ProtectedRoute.tsx** — защита маршрутов + RoleGuard

### 3. Создать UI-компоненты
- **src/components/ui/Toast.tsx** — кастомная система тостов (success/error/info)
- **src/components/ui/EditInput.tsx** — стилизованный input
- **src/components/ui/SubViewHeader.tsx** — заголовок с кнопкой "назад"
- **src/components/GrowthChart.tsx** — SVG-график роста ребенка vs WHO

### 4. Создать лейауты
- **src/layouts/AdminLayout.tsx** — боковая навигация с поддержкой ролей (admin/doctor), мобильная адаптация, logout
- **src/layouts/MamaLayout.tsx** — мобильный лейаут с bottom-nav, переключатель продуктов, уведомления

### 5. Создать страницы авторизации
- **src/pages/auth/LoginPage.tsx** — форма входа (email/пароль, dev-bypass demo@mama.ru)
- **src/pages/auth/RegisterPage.tsx** — регистрация с согласием на условия

### 6. Создать портал мамы (4 страницы)
- **MamaHomePage** — баннер продукта, лента новостей, быстрые действия, статус подписки
- **MamaLibraryPage** — поиск, фильтры по категориям, список материалов
- **MamaChatPage** — realtime-чат с врачом через Supabase
- **MamaProfilePage** — профиль, редактирование, медкарта, рост (с графиком WHO), покупки, заметки

### 7. Обновить админ-панель (10 страниц)
Все страницы переписываются с нуля по новому дизайну:
- **AdminAnalyticsPage** — конструктор отчетов, KPI (MRR/ARPU), журнал транзакций, экспорт
- **AdminUsersPage** — CRM с фильтрами, карточка мамы (slide-over), управление доступом/тегами
- **AdminBroadcastsPage** — создание рассылок (multi-channel), статистика, история
- **AdminFunnelsPage** — воронки с AI-генератором сценариев
- **AdminLessonsPage** — полноценный LMS-редактор (видео, текст, PDF, спойлеры, таймкоды), предпросмотр в "телефоне"
- **AdminAccessPage** — тарифы, акцентный цвет продукта, превью карточки
- **AdminNotificationsPage** — timeline цепочки уведомлений с каналами и расписанием
- **AdminContentPage** — аналитика поисковых запросов, база материалов
- **AdminPaymentsPage** — интеграция шлюзов (CloudPayments/Stripe), генератор виджета для Tilda
- **DoctorTicketsPage** — чат с тикетами, AI-сводка, медкарта ребенка

### 8. Обновить маршрутизацию
- **src/App.tsx** — полная переделка: AuthProvider, ToastProvider, ErrorBoundary, ролевые маршруты (/mama, /doctor, /support, /admin)

## Технические детали

- Исходный код в JSX → конвертация в TypeScript (.tsx)
- Supabase используется для: auth, profiles, children, messages, user_notes, health_records
- Проект использует `@supabase/supabase-js` (уже в зависимостях Lovable)
- Tailwind расширяется кастомными цветами (brand, surface, ink) — без конфликта с shadcn
- Старые файлы страниц (`src/pages/ProductsPage.tsx` и т.д.) будут заменены новыми в `src/pages/admin/`

## Количество файлов
~30 файлов будет создано/обновлено. Реализация будет выполнена поэтапно.

