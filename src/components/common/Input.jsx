export default function Input({
  label = null,
  placeholder = '',
  value,
  onChange,
  type = 'text',
  error = null,
  icon = null,
  ...props
}) {
  const id = props.id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-display font-semibold text-text-secondary"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">
            {icon}
          </span>
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={[
            'w-full h-12 rounded-xl border bg-surface px-4 text-base font-display text-text-primary',
            'outline-none transition-all',
            'focus:ring-2 focus:ring-primary/30 focus:border-primary',
            icon ? 'pl-10' : '',
            error ? 'border-error' : 'border-gray-200',
          ].join(' ')}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        />
      </div>
      {error && (
        <p id={`${id}-error`} className="text-xs font-display text-error mt-0.5">
          {error}
        </p>
      )}
    </div>
  );
}
