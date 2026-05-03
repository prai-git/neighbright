export default function EmptyState({
  emoji = '📭',
  title,
  description,
  action = null,
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 px-6 text-center">
      <span className="text-6xl">{emoji}</span>
      {title && (
        <h3 className="text-xl font-display font-bold text-text-primary">{title}</h3>
      )}
      {description && (
        <p className="text-sm font-display text-text-secondary max-w-xs">{description}</p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
