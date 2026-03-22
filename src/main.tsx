import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Global error handlers to prevent silent white screens
window.onerror = (message, source, lineno, colno, error) => {
  console.error('[Global Error]', { message, source, lineno, colno, error });
};

window.onunhandledrejection = (event) => {
  console.error('[Unhandled Promise Rejection]', event.reason);
};

const rootEl = document.getElementById("root")!;

try {
  createRoot(rootEl).render(<App />);
} catch (err) {
  console.error('[Mount Error]', err);
  rootEl.innerHTML = `
    <div style="min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:2rem;font-family:system-ui,sans-serif;text-align:center">
      <div style="font-size:3rem;margin-bottom:1rem">⚠️</div>
      <h1 style="font-size:1.25rem;font-weight:700;margin-bottom:0.5rem;color:#1a1a1a">Что-то пошло не так</h1>
      <p style="color:#666;font-size:0.875rem;margin-bottom:1.5rem">Пожалуйста, перезагрузите страницу</p>
      <button onclick="location.reload()" style="padding:0.75rem 2rem;background:#1a1a1a;color:#fff;border:none;border-radius:1rem;font-weight:700;font-size:0.875rem;cursor:pointer">Обновить</button>
    </div>
  `;
}
