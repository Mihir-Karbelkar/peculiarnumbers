export function NumberInput({ label, value, onChange, min = 1 }: { label: string; value: number; onChange: (value: number) => void; min?: number }) {
  return <label className="grid gap-2 text-sm text-slate-300"><span>{label}</span><input className="focus-ring rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-slate-50" type="number" min={min} value={value} onChange={(e) => onChange(Number(e.target.value))} /></label>;
}
