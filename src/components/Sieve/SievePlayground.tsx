import { useEffect, useMemo, useState, type ChangeEvent } from 'react';
import {
  Gauge,
  Pause,
  Play,
  RotateCcw,
  SkipForward,
  StepBack,
  StepForward,
} from 'lucide-react';
import { Button } from '@/components/UI/Button';
import {
  clampSieveLimit,
  MAX_SIEVE_LIMIT,
  MIN_SIEVE_LIMIT,
  runSieveAlgorithm,
  SIEVE_ALGORITHMS,
  type SieveAlgorithmId,
  type SieveFrame,
} from '@/lib/sievePlayground';
import { cn } from '@/lib/utils';

const SPEEDS = [
  { label: '0.5×', delay: 850 },
  { label: '1×', delay: 480 },
  { label: '2×', delay: 220 },
  { label: '4×', delay: 90 },
];

function countVisibleSurvivors(frame: SieveFrame): number {
  return frame.eliminated.slice(1).filter((eliminated) => !eliminated).length;
}

function describeCell(value: number, frame: SieveFrame): string {
  if (frame.results[value]) return `${value} is in the final result`;
  if (frame.eliminated[value]) {
    const owner = frame.owner[value];
    return owner ? `${value} was eliminated by ${owner}` : `${value} was eliminated`;
  }
  return `${value} is still a candidate`;
}

export default function SievePlayground() {
  const [algorithm, setAlgorithm] = useState<SieveAlgorithmId>('eratosthenes');
  const [limit, setLimit] = useState(120);
  const [frameIndex, setFrameIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speedIndex, setSpeedIndex] = useState(1);

  const run = useMemo(() => runSieveAlgorithm(algorithm, limit), [algorithm, limit]);
  const comparisons = useMemo(
    () => SIEVE_ALGORITHMS.map((item) => ({ item, run: runSieveAlgorithm(item.id, limit) })),
    [limit],
  );
  const meta = SIEVE_ALGORITHMS.find((item) => item.id === algorithm) ?? SIEVE_ALGORITHMS[0];
  const frame = run.frames[Math.min(frameIndex, run.frames.length - 1)];
  const isComplete = frameIndex === run.frames.length - 1;

  useEffect(() => {
    setFrameIndex(0);
    setPlaying(false);
  }, [run]);

  useEffect(() => {
    if (!playing) return undefined;
    const timer = window.setInterval(() => {
      setFrameIndex((current) => {
        if (current >= run.frames.length - 1) {
          setPlaying(false);
          return current;
        }
        return current + 1;
      });
    }, SPEEDS[speedIndex].delay);
    return () => window.clearInterval(timer);
  }, [playing, run.frames.length, speedIndex]);

  const jumpTo = (nextFrame: number) => {
    setPlaying(false);
    setFrameIndex(Math.min(run.frames.length - 1, Math.max(0, nextFrame)));
  };

  const maxInspections = Math.max(...comparisons.map(({ run: itemRun }) => itemRun.frames.at(-1)?.inspections ?? 0), 1);
  const recentFrames = run.frames.slice(Math.max(0, frameIndex - 5), frameIndex + 1).reverse();

  return (
    <div className="space-y-8">
      <section className="notebook-card p-4 md:p-6">
        <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-sky-300">Choose a process</p>
            <h2 className="mt-2 font-serif text-3xl">Four sieves, one integer field</h2>
          </div>
          <label className="grid gap-2 text-sm text-slate-300 md:w-48">
            <span>Maximum value</span>
            <input
              className="focus-ring rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2 text-slate-50"
              type="number"
              min={MIN_SIEVE_LIMIT}
              max={MAX_SIEVE_LIMIT}
              value={limit}
              onChange={(event: ChangeEvent<HTMLInputElement>) => setLimit(Math.min(MAX_SIEVE_LIMIT, Math.max(0, Number(event.target.value))))}
              onBlur={() => setLimit(clampSieveLimit(limit))}
            />
          </label>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {SIEVE_ALGORITHMS.map((item) => {
            const selected = item.id === algorithm;
            return (
              <button
                type="button"
                key={item.id}
                aria-pressed={selected}
                onClick={() => setAlgorithm(item.id)}
                className={cn(
                  'focus-ring rounded-2xl border p-4 text-left transition',
                  selected
                    ? 'border-sky-300/60 bg-sky-300/15 shadow-lg shadow-sky-950/30'
                    : 'border-white/10 bg-slate-950/35 hover:border-white/20 hover:bg-white/[0.06]',
                )}
              >
                <span className="font-serif text-xl text-slate-50">{item.shortName}</span>
                <span className="mt-2 block text-sm leading-6 text-slate-400">{item.description}</span>
                <span className="mt-4 inline-flex rounded-full bg-white/[0.06] px-2.5 py-1 font-mono text-xs text-slate-300">
                  {item.complexity}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {[
          ['Frame', `${frameIndex + 1} / ${run.frames.length}`],
          ['Survivors now', countVisibleSurvivors(frame)],
          ['Inspections', frame.inspections],
          ['Writes', frame.writes],
          ['Revisits', frame.revisits],
        ].map(([label, value]) => (
          <div className="notebook-card p-4" key={label}>
            <p className="text-sm text-slate-400">{label}</p>
            <p className="mt-2 font-mono text-2xl text-slate-50">{value}</p>
          </div>
        ))}
      </section>

      <section className="notebook-card overflow-hidden">
        <div className="border-b border-white/10 p-4 md:p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-sky-300/15 px-3 py-1 text-xs font-medium text-sky-200">{frame.phase}</span>
                <span className="text-xs text-slate-500">{meta.name}</span>
              </div>
              <h3 className="mt-3 font-serif text-2xl text-slate-50">{frame.title}</h3>
              <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-400">{frame.detail}</p>
              {frame.formula && <p className="mt-2 font-mono text-sm text-amber-200">{frame.formula}</p>}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button className="px-3" onClick={() => jumpTo(0)} disabled={frameIndex === 0} aria-label="Restart">
                <RotateCcw className="size-4" />
              </Button>
              <Button className="px-3" onClick={() => jumpTo(frameIndex - 1)} disabled={frameIndex === 0} aria-label="Previous step">
                <StepBack className="size-4" />
              </Button>
              <Button
                className="min-w-28 justify-center bg-sky-300/25"
                onClick={() => setPlaying((current) => !current)}
                disabled={isComplete}
              >
                {playing ? <Pause className="mr-2 inline size-4" /> : <Play className="mr-2 inline size-4" />}
                {playing ? 'Pause' : 'Play'}
              </Button>
              <Button className="px-3" onClick={() => jumpTo(frameIndex + 1)} disabled={isComplete} aria-label="Next step">
                <StepForward className="size-4" />
              </Button>
              <Button className="px-3" onClick={() => jumpTo(run.frames.length - 1)} disabled={isComplete} aria-label="Skip to result">
                <SkipForward className="size-4" />
              </Button>
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
            <label className="grid gap-2 text-xs text-slate-400">
              <span className="flex justify-between"><span>Timeline</span><span>{Math.round((frameIndex / Math.max(run.frames.length - 1, 1)) * 100)}%</span></span>
              <input
                className="w-full accent-sky-300"
                type="range"
                min={0}
                max={run.frames.length - 1}
                value={frameIndex}
                onChange={(event: ChangeEvent<HTMLInputElement>) => jumpTo(Number(event.target.value))}
                aria-label="Sieve timeline"
              />
            </label>
            <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-slate-950/50 p-1">
              <Gauge className="mx-2 size-4 text-slate-400" />
              {SPEEDS.map((speed, index) => (
                <button
                  type="button"
                  key={speed.label}
                  onClick={() => setSpeedIndex(index)}
                  className={cn(
                    'focus-ring rounded-lg px-2.5 py-1.5 text-xs transition',
                    index === speedIndex ? 'bg-white/10 text-slate-50' : 'text-slate-400 hover:text-slate-200',
                  )}
                >
                  {speed.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 md:p-5">
          <div className="mb-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-400">
            <span className="flex items-center gap-2"><span className="size-3 rounded bg-slate-700" />Candidate</span>
            <span className="flex items-center gap-2"><span className="size-3 rounded bg-amber-300" />Active base</span>
            <span className="flex items-center gap-2"><span className="size-3 rounded bg-sky-300" />Current touch</span>
            <span className="flex items-center gap-2"><span className="size-3 rounded bg-rose-400/50" />Eliminated</span>
            <span className="flex items-center gap-2"><span className="size-3 rounded bg-emerald-300" />Final result</span>
          </div>

          <div
            className="grid gap-2"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(2.75rem, 1fr))' }}
            aria-label={`${meta.name} number field`}
          >
            {Array.from({ length: run.limit }, (_, index) => index + 1).map((value) => {
              const active = frame.active.includes(value);
              const touched = frame.touched.includes(value);
              const eliminated = frame.eliminated[value];
              const result = frame.results[value];
              return (
                <div
                  key={value}
                  title={describeCell(value, frame)}
                  className={cn(
                    'relative flex aspect-square min-h-11 items-center justify-center rounded-xl border font-mono text-sm transition duration-200',
                    'border-white/5 bg-slate-900/65 text-slate-300',
                    eliminated && 'bg-rose-950/30 text-slate-600 line-through',
                    result && 'border-emerald-300/50 bg-emerald-300/20 text-emerald-100 no-underline shadow-sm shadow-emerald-950',
                    active && 'z-10 scale-105 border-amber-200 bg-amber-300 text-slate-950 no-underline shadow-lg shadow-amber-950/50',
                    touched && !active && !result && 'z-10 scale-105 border-sky-200 bg-sky-300 text-slate-950 no-underline shadow-lg shadow-sky-950/50',
                  )}
                >
                  {value}
                  {eliminated && frame.owner[value] > 0 && (
                    <span className="absolute bottom-0.5 right-1 text-[8px] leading-none text-slate-500">{frame.owner[value]}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="notebook-card p-5">
          <p className="text-xs uppercase tracking-[0.24em] text-sky-300">Recent operations</p>
          <div className="mt-4 divide-y divide-white/5">
            {recentFrames.map((item, index) => (
              <div className={cn('py-3', index > 0 && 'opacity-60')} key={`${frameIndex - index}-${item.title}`}>
                <div className="flex items-start justify-between gap-4">
                  <p className="text-sm font-medium text-slate-200">{item.title}</p>
                  <span className="shrink-0 font-mono text-xs text-slate-500">#{frameIndex - index + 1}</span>
                </div>
                <p className="mt-1 text-xs leading-5 text-slate-500">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <aside className="notebook-card p-5">
          <p className="text-xs uppercase tracking-[0.24em] text-violet-300">How it works</p>
          <h3 className="mt-3 font-serif text-2xl">{meta.name}</h3>
          <p className="mt-3 text-sm leading-6 text-slate-400">{meta.bestFor}</p>
          <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/45 p-4 font-mono text-xs leading-6 text-slate-300">
            {meta.pseudocode.map((line) => <div key={line}>{line}</div>)}
          </div>
          <div className="mt-4 flex items-center justify-between rounded-xl bg-white/[0.04] px-3 py-2 text-sm">
            <span className="text-slate-400">Complexity</span>
            <span className="font-mono text-slate-100">{meta.complexity}</span>
          </div>
        </aside>
      </section>

      <section className="notebook-card overflow-hidden">
        <div className="border-b border-white/10 p-5">
          <p className="text-xs uppercase tracking-[0.24em] text-sky-300">Comparison mode</p>
          <h2 className="mt-2 font-serif text-3xl">How much work does each sieve perform?</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
            The counts below use the same limit. Prime sieves should agree on their result; Lucky Numbers intentionally produces a different sequence.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-slate-950/55 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-3">Algorithm</th>
                <th className="px-5 py-3">Result</th>
                <th className="px-5 py-3">Inspections</th>
                <th className="px-5 py-3">Writes</th>
                <th className="px-5 py-3">Revisits</th>
                <th className="px-5 py-3">Relative work</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {comparisons.map(({ item, run: comparisonRun }) => {
                const finalFrame = comparisonRun.frames.at(-1)!;
                const width = Math.max(4, (finalFrame.inspections / maxInspections) * 100);
                return (
                  <tr key={item.id} className={cn(item.id === algorithm && 'bg-sky-300/[0.06]')}>
                    <td className="px-5 py-4 font-medium text-slate-100">{item.shortName}</td>
                    <td className="px-5 py-4 font-mono text-slate-300">{comparisonRun.values.length} {comparisonRun.resultLabel}</td>
                    <td className="px-5 py-4 font-mono text-slate-300">{finalFrame.inspections}</td>
                    <td className="px-5 py-4 font-mono text-slate-300">{finalFrame.writes}</td>
                    <td className="px-5 py-4 font-mono text-slate-300">{finalFrame.revisits}</td>
                    <td className="px-5 py-4">
                      <div className="h-2 w-36 overflow-hidden rounded-full bg-white/5">
                        <div className="h-full rounded-full bg-sky-300/70" style={{ width: `${width}%` }} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
