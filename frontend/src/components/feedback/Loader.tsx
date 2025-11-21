export const Loader = ({ label = 'Carregando...' }: { label?: string }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-14 text-slate-500">
    <span className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
    <p className="text-sm font-medium">{label}</p>
  </div>
)

