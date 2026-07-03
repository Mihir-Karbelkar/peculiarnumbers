export function generatePrimeSieve(n: number): boolean[] {
  const limit = Math.max(0, Math.floor(n));
  const sieve = Array<boolean>(limit + 1).fill(true);
  if (limit >= 0) sieve[0] = false;
  if (limit >= 1) sieve[1] = false;
  for (let p = 2; p * p <= limit; p += 1) {
    if (!sieve[p]) continue;
    for (let multiple = p * p; multiple <= limit; multiple += p) sieve[multiple] = false;
  }
  return sieve;
}

export function primesFromSieve(sieve: boolean[]): number[] {
  return sieve.flatMap((isPrime, value) => (isPrime ? [value] : []));
}
