import { generatePrimeSieve, primesFromSieve } from './sieve';

export type TwinPrimePair = [number, number];
export type GridRow = { index: number; start: number; end: number; numbers: number[]; weightedCount: number };
export type TwinPrimeGrid = { n: number; rowSize: number; rows: GridRow[]; primes: number[]; sieve: boolean[]; twinPrimes: TwinPrimePair[] };

export function findTwinPrimes(primes: number[]): TwinPrimePair[] {
  const primeSet = new Set(primes);
  return primes.filter((p) => primeSet.has(p + 2)).map((p) => [p, p + 2] as TwinPrimePair);
}

function rowIndexFor(value: number, rowSize: number): number {
  return Math.floor((value - 1) / rowSize);
}

export function generateGrid(n: number, r: number): TwinPrimeGrid {
  const max = Math.max(1, Math.floor(n));
  const rowSize = Math.max(1, Math.floor(r));
  const sieve = generatePrimeSieve(max);
  const primes = primesFromSieve(sieve);
  const twinPrimes = findTwinPrimes(primes).filter(([, q]) => q <= max);
  const rowCount = Math.ceil(max / rowSize);
  const rows: GridRow[] = Array.from({ length: rowCount }, (_, index) => {
    const start = index * rowSize + 1;
    const end = Math.min(max, start + rowSize - 1);
    return { index, start, end, numbers: Array.from({ length: end - start + 1 }, (__, i) => start + i), weightedCount: 0 };
  });

  for (const [p, q] of twinPrimes) {
    const first = rowIndexFor(p, rowSize);
    const last = rowIndexFor(q, rowSize);
    const touched = last - first + 1;
    const share = 1 / touched;
    for (let row = first; row <= last; row += 1) rows[row].weightedCount += share;
  }
  return { n: max, rowSize, rows, primes, sieve, twinPrimes };
}

export function twinPartnerMap(pairs: TwinPrimePair[]): Map<number, number[]> {
  const map = new Map<number, number[]>();
  for (const [a, b] of pairs) {
    map.set(a, [...(map.get(a) ?? []), b]);
    map.set(b, [...(map.get(b) ?? []), a]);
  }
  return map;
}
