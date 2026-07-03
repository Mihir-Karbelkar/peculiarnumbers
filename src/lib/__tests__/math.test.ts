import { describe, expect, it } from 'vitest';
import { generatePrimeSieve, primesFromSieve } from '../sieve';
import { findTwinPrimes, generateGrid } from '../twinPrimes';

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
