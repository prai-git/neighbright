const colorMap = {
  primary: 'bg-primary/10 text-primary',
  secondary: 'bg-secondary/10 text-secondary',
  accent: 'bg-accent/20 text-amber-700',
  success: 'bg-success/20 text-emerald-700',
  error: 'bg-error/10 text-error',
};

const tierColors = ['', 'bg-primary/10 text-primary', 'bg-secondary/10 text-secondary', 'bg-accent/20 text-amber-700'];

export default function Badge({
  variant = 'status',
  color = 'primary',
  children,
}) {
  const base = 'inline-flex items-center rounded-full font-display font-bold';

  if (variant === 'tier') {
    const tierNum = parseInt(children?.toString().replace(/\D/g, '')) || 1;
    return (
      <span className={`${base} text-xs px-2 py-0.5 ${tierColors[tierNum] || tierColors[1]}`}>
        {children}
      </span>
    );
  }

  if (variant === 'count') {
    return (
      <span className={`${base} text-xs w-5 h-5 flex items-center justify-center ${colorMap[color] || colorMap.primary}`}>
        {children}
      </span>
    );
  }

  return (
    <span className={`${base} text-xs px-2 py-0.5 ${colorMap[color] || colorMap.primary}`}>
      {children}
    </span>
  );
}
