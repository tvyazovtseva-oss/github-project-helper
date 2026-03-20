import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SubViewHeaderProps {
  title: string;
  onBack?: () => void;
}

export default function SubViewHeader({ title, onBack }: SubViewHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-surface-200 bg-white/80 glass sticky top-0 z-20">
      <button
        onClick={onBack || (() => navigate(-1))}
        className="p-2 -ml-2 rounded-xl hover:bg-surface-100 active:scale-95 transition-all"
      >
        <ChevronRight className="w-5 h-5 text-ink-900 rotate-180" />
      </button>
      <h1 className="text-lg font-bold text-ink-900">{title}</h1>
    </div>
  );
}
