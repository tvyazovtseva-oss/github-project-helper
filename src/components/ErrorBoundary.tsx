import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-surface-50">
          <AlertCircle className="w-12 h-12 text-destructive mb-4" />
          <h1 className="text-xl font-bold text-ink-900 mb-2">Что-то пошло не так</h1>
          <p className="text-ink-400 text-sm mb-6 text-center max-w-sm">
            Произошла непредвиденная ошибка. Попробуйте обновить страницу.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="px-6 py-3 bg-surface-200 text-ink-700 rounded-2xl font-bold text-sm active:scale-[0.97] transition-transform"
            >
              Попробовать снова
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-ink-900 text-white rounded-2xl font-bold text-sm flex items-center gap-2 active:scale-[0.97] transition-transform"
            >
              <RefreshCw className="w-4 h-4" />
              Обновить
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
