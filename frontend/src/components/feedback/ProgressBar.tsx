type ProgressBarProps = {
  progress: number
}

export const ProgressBar = ({ progress }: ProgressBarProps) => (
  <div className="w-full rounded-full bg-slate-100 dark:bg-slate-800">
    <div
      className="rounded-full bg-brand-500 py-1 text-xs font-semibold text-white transition-all"
      style={{ width: `${progress}%` }}
    >
      <span className="px-2">{progress}%</span>
    </div>
  </div>
)

