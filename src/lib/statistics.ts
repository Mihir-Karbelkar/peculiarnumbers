import type { TwinPrimeGrid } from './twinPrimes';

export function calculateStatistics(grid: TwinPrimeGrid) {
  const largestPair = grid.twinPrimes.at(-1);
  return {
    totalPrimes: grid.primes.length,
    totalTwinPrimePairs: grid.twinPrimes.length,
    sumWeightedCounts: grid.rows.reduce((sum, row) => sum + row.weightedCount, 0),
    numberOfRows: grid.rows.length,
    largestPrime: grid.primes.at(-1) ?? null,
    largestTwinPrimePair: largestPair ?? null
  };
}
