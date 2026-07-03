import type { TwinPrimeGrid } from './twinPrimes';

export function exportCSV(grid: TwinPrimeGrid): string {
  const header = ['Count', ...Array.from({ length: grid.rowSize }, (_, i) => String(i + 1))];
  const lines = [header.join(',')];
  for (const row of grid.rows) lines.push([row.weightedCount.toFixed(1), ...Array.from({ length: grid.rowSize }, (_, i) => row.numbers[i]?.toString() ?? '')].join(','));
  return lines.join('\n');
}

export function exportJSON(grid: TwinPrimeGrid): string {
  return JSON.stringify({ n: grid.n, rowSize: grid.rowSize, twinPrimes: grid.twinPrimes, rows: grid.rows }, null, 2);
}
