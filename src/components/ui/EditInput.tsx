interface EditInputProps {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
}

export default function EditInput({ label, value, onChange, placeholder, type = 'text', disabled = false }: EditInputProps) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-ink-400 uppercase tracking-wider">{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        className={`w-full bg-surface-100 border border-transparent rounded-2xl px-4 py-3.5 text-[16px] font-medium text-ink-900 outline-none focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all shadow-inner ${disabled ? 'opacity-50 grayscale pointer-events-none' : ''}`}
      />
    </div>
  );
}
