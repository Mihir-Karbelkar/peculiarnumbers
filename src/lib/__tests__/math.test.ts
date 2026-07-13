import { describe, expect, it } from 'vitest';
import { generatePrimeSieve, primesFromSieve } from '../sieve';
import { runSieveAlgorithm } from '../sievePlayground';
import { findTwinPrimes, generateGrid } from '../twinPrimes';

const primesTo50 = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];

describe('prime utilities', () => {
  it('generates a correct sieve', () => {
    const sieve = generatePrimeSieve(20);
    expect(primesFromSieve(sieve)).toEqual([2, 3, 5, 7, 11, 13, 17, 19]);
    expect(sieve[0]).toBe(false);
    expect(sieve[1]).toBe(false);
    expect(sieve[4]).toBe(false);
  });

  it('detects twin primes', () => {
    expect(findTwinPrimes([2, 3, 5, 7, 11, 13, 17, 19])).toEqual([[3, 5], [5, 7], [11, 13], [17, 19]]);
  });

  it('keeps weighted counts conserved', () => {
    const grid = generateGrid(1000, 37);
    const sum = grid.rows.reduce((total, row) => total + row.weightedCount, 0);
    expect(sum).toBeCloseTo(grid.twinPrimes.length, 10);
  });

  it('matches the documented n=100, r=10 first column', () => {
    const grid = generateGrid(100, 10);
    expect(grid.rows.map((row) => row.weightedCount)).toEqual([2, 2, 0.5, 0.5, 1, 0.5, 0.5, 1, 0, 0]);
  });
});

describe('sieve playground', () => {
  it.each(['eratosthenes', 'linear', 'sundaram'] as const)('%s returns the same primes', (algorithm) => {
    expect(runSieveAlgorithm(algorithm, 50).values).toEqual(primesTo50);
  });

  it('generates the standard lucky numbers through 50', () => {
    expect(runSieveAlgorithm('lucky', 50).values).toEqual([1, 3, 7, 9, 13, 15, 21, 25, 31, 33, 37, 43, 49]);
  });

  it('makes exactly one composite write in the linear sieve', () => {
    const run = runSieveAlgorithm('linear', 50);
    const finalFrame = run.frames.at(-1)!;
    expect(finalFrame.writes).toBe(49 - primesTo50.length);
    expect(finalFrame.revisits).toBe(0);
  });

  it('marks every final value in the last frame', () => {
    const run = runSieveAlgorithm('eratosthenes', 30);
    const finalFrame = run.frames.at(-1)!;
    expect(run.values.every((value) => finalFrame.results[value])).toBe(true);
  });
});
