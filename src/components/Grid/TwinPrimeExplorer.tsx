import { useMemo, useState } from 'react';
import { Download } from 'lucide-react';
import { generateGrid, twinPartnerMap } from '@/lib/twinPrimes';
import { calculateStatistics } from '@/lib/statistics';
import { exportCSV, exportJSON } from '@/lib/export';
import { NumberInput } from '@/components/Controls/NumberInput';
import { Button } from '@/components/UI/Button';
import { CountChart } from '@/components/Charts/CountChart';
import { cn } from '@/lib/utils';

function download(name: string, text: string, type: string) {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = name; a.click(); URL.revokeObjectURL(url);
}

export default function TwinPrimeExplorer() {
  const [n, setN] = useState(100);
  const [r, setR] = useState(10);
  const [heatmap, setHeatmap] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const grid = useMemo(() => generateGrid(n, r), [n, r]);
  const stats = useMemo(() => calculateStatistics(grid), [grid]);
  const partners = useMemo(() => twinPartnerMap(grid.twinPrimes), [grid.twinPrimes]);
  const maxCount = Math.max(...grid.rows.map((row) => row.weightedCount), 1);

  return <div className="space-y-8">
    <section className="notebook-card p-5">
      <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
        <NumberInput label="Maximum number (n)" value={n} onChange={setN} />
        <NumberInput label="Row size (r)" value={r} onChange={setR} />
        <label className="flex items-center gap-3 rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-300"><input type="checkbox" checked={heatmap} onChange={(e) => setHeatmap(e.target.checked)} /> Heatmap Mode</label>
      </div>
    </section>

    <section className="grid gap-4 md:grid-cols-3">
      {[
        ['Total primes', stats.totalPrimes], ['Twin-prime pairs', stats.totalTwinPrimePairs], ['Sum weighted counts', stats.sumWeightedCounts.toFixed(1)],
        ['Rows', stats.numberOfRows], ['Largest prime', stats.largestPrime ?? '—'], ['Largest pair', stats.largestTwinPrimePair ? `(${stats.largestTwinPrimePair.join(', ')})` : '—']
      ].map(([label, value]) => <div className="notebook-card p-5" key={label}><p className="text-sm text-slate-400">{label}</p><p className="mt-2 font-serif text-3xl">{value}</p></div>)}
    </section>

    <section className="notebook-card p-5"><div className="mb-4 flex items-center justify-between"><h2 className="font-serif text-2xl">Weighted window signal</h2><div className="flex gap-2"><Button onClick={() => download('twin-prime-grid.csv', exportCSV(grid), 'text/csv')}><Download className="mr-2 inline size-4"/>CSV</Button><Button onClick={() => download('twin-prime-grid.json', exportJSON(grid), 'application/json')}>JSON</Button></div></div><CountChart rows={grid.rows} /></section>

    <section className="notebook-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead className="sticky top-0 z-20 bg-slate-900 text-slate-300"><tr><th className="sticky left-0 z-30 bg-slate-900 px-4 py-3 text-right">Count</th>{Array.from({ length: grid.rowSize }, (_, i) => <th className="px-3 py-3 text-center" key={i}>{i + 1}</th>)}</tr></thead>
          <tbody>{grid.rows.map((row) => {
            const intensity = row.weightedCount / maxCount;
            return <tr key={row.index} className="border-t border-white/5 odd:bg-white/[0.025] even:bg-slate-900/25" style={heatmap ? { backgroundColor: `rgba(14, 165, 233, ${0.08 + intensity * 0.22})` } : undefined}>
              <th className="sticky left-0 z-10 bg-slate-950/95 px-4 py-2 text-right font-mono text-sky-200">{row.weightedCount.toFixed(1)}</th>
              {Array.from({ length: grid.rowSize }, (_, i) => {
                const value = row.numbers[i];
                const isPrime = value !== undefined && grid.sieve[value];
                const isTwin = value !== undefined && partners.has(value);
                const isRelated = hovered !== null && value !== undefined && (value === hovered || (partners.get(hovered) ?? []).includes(value));
                return <td key={i} onMouseEnter={() => value && setHovered(value)} onMouseLeave={() => setHovered(null)} className="min-w-12 px-3 py-2 text-center"><span className={cn('inline-flex size-9 items-center justify-center rounded-full font-mono transition', isPrime && 'bg-violet-400/15 text-violet-100', isTwin && 'ring-1 ring-sky-300/70', isRelated && 'scale-110 bg-amber-300/25 text-amber-100 ring-2 ring-amber-200')}>{value ?? ''}</span></td>;
              })}
            </tr>})}</tbody>
        </table>
      </div>
    </section>
  </div>;
}
