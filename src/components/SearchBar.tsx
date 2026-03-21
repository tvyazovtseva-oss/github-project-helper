import { useState, useCallback, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  debounceMs?: number;
}

export default function SearchBar({ placeholder = 'Поиск...', onSearch, debounceMs = 300 }: SearchBarProps) {
  const [value, setValue] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => onSearch(value), debounceMs);
    return () => clearTimeout(timer);
  }, [value, debounceMs, onSearch]);

  return (
    <div className="flex items-center gap-2 px-3 py-2.5 bg-surface-50 rounded-xl">
      <Search className="w-4 h-4 text-ink-300 shrink-0" />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="flex-1 text-sm bg-transparent outline-none text-ink-900 placeholder:text-ink-300"
      />
      {value && (
        <button onClick={() => setValue('')} className="p-0.5 rounded-full hover:bg-surface-200 transition-colors">
          <X className="w-3.5 h-3.5 text-ink-300" />
        </button>
      )}
    </div>
  );
}
