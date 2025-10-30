type Props = {
  label: string;
  value: string | number;
  icon?: string;
  description?: string;
};

export function StatsCard({ label, value, icon, description }: Props) {
  return (
    <div className="rounded-lg border border-zinc-200 dark:border-white/10 p-6 bg-gradient-to-br from-zinc-50/50 to-transparent dark:from-white/5 dark:to-transparent">
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400">{label}</h3>
        {icon && <span className="text-2xl">{icon}</span>}
      </div>
      <p className="text-3xl font-bold tracking-tight">{value}</p>
      {description && (
        <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">{description}</p>
      )}
    </div>
  );
}



