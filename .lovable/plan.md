

# Plan: Fix Safari/iOS White Screen Crash

## Root Cause Analysis

After reviewing the codebase, the most likely causes of a Safari crash are:

1. **`crypto.randomUUID()`** in `AuthContext.tsx` line 56 — not available in Safari < 15.4 or in non-secure contexts on some iOS versions. This runs on registration, but the import of the module itself could cause issues in some bundling scenarios.

2. **`country-state-city` library** — this is a large library (~2MB) that gets imported at the top level of `MamaProfilePage.tsx`. Some versions have had ESM/CJS compatibility issues with Safari's module system. Since it's imported eagerly, if the library throws during initialization, it would crash the entire app because `MamaProfilePage` is imported at the top of `App.tsx`.

3. **All page components are eagerly imported** in `App.tsx` — if ANY imported module crashes during initialization, the entire app dies with a white screen. The ErrorBoundary cannot catch module-level crashes.

4. **`h-screen` in `MamaLayout.tsx`** — the classic iOS Safari 100vh bug where the address bar causes content overflow.

5. **Date formatting** — `toLocaleString('ru-RU', ...)` with specific options can behave differently but shouldn't crash.

## Fix Strategy

### 1. Wrap root render in try/catch (main.tsx)
Add a global error handler that shows a fallback HTML message if React itself fails to mount. This catches module-level import crashes that ErrorBoundary cannot.

### 2. Lazy-load all page components (App.tsx)
Convert all page imports to `React.lazy()` with `Suspense`. This way, if `country-state-city` or any page-level import crashes, it won't take down the entire app — the ErrorBoundary will catch it.

### 3. Fix `crypto.randomUUID()` (AuthContext.tsx)
Replace with a simple UUID fallback function that works in all browsers:
```ts
function safeUUID() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}
```

### 4. Safe-guard `country-state-city` import (MamaProfilePage.tsx)
Wrap the `Country` / `City` usage in a try-catch so if the library fails, the page still renders with a manual text input fallback.

### 5. Fix iOS viewport (MamaLayout.tsx + index.css)
- Replace `h-screen` with `h-dvh` (dynamic viewport height) in MamaLayout
- Add `min-h-dvh` as fallback alongside `min-h-screen`
- Add CSS: `@supports` rule for `dvh` units
- Add `safe-area-inset` padding to key layout elements

### 6. Add viewport meta tag for iOS (index.html)
Add `viewport-fit=cover` to enable safe area insets:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
```

### 7. Global unhandled error listener (main.tsx)
Add `window.onerror` and `window.onunhandledrejection` handlers that log to console and prevent silent white screens.

## Files to Change

| File | Changes |
|---|---|
| `src/main.tsx` | Try/catch around render, global error handlers, fallback HTML |
| `src/App.tsx` | Lazy imports for all pages with Suspense |
| `src/contexts/AuthContext.tsx` | Replace `crypto.randomUUID()` with safe fallback |
| `src/layouts/MamaLayout.tsx` | `h-screen` → `h-dvh` with fallback |
| `src/index.css` | Add `dvh` support, safe-area-inset utilities |
| `index.html` | Add `viewport-fit=cover` to viewport meta |
| `src/pages/mama/MamaProfilePage.tsx` | Try-catch around country-state-city usage |

## Priority Order
1. Lazy imports + Suspense (prevents module crash from killing app)
2. `crypto.randomUUID` fix (direct crash on older Safari)
3. Global error fallback in main.tsx
4. iOS viewport fixes
5. Safe-area insets

