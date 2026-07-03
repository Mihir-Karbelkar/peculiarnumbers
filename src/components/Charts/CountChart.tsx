import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import type { GridRow } from '@/lib/twinPrimes';
export function CountChart({ rows }: { rows: GridRow[] }) {
  const data = rows.map((row) => ({ window: `${row.start}-${row.end}`, count: Number(row.weightedCount.toFixed(2)) }));
  return <div className="h-64"><ResponsiveContainer width="100%" height="100%"><AreaChart data={data} margin={{ left: -20, right: 10, top: 10, bottom: 10 }}><defs><linearGradient id="count" x1="0" x2="0" y1="0" y2="1"><stop offset="5%" stopColor="#38bdf8" stopOpacity={0.55}/><stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/></linearGradient></defs><XAxis dataKey="window" hide /><YAxis stroke="#94a3b8" allowDecimals /><Tooltip contentStyle={{ background: '#020617', border: '1px solid rgba(255,255,255,.12)', borderRadius: 12 }} /><Area type="monotone" dataKey="count" stroke="#7dd3fc" fill="url(#count)" /></AreaChart></ResponsiveContainer></div>;
}
