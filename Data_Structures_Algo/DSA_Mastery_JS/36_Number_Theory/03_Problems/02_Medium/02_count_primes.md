# Count Primes (odd-only sieve)

| | |
|---|---|
| **Topic** | Number Theory (Essential) |
| **Difficulty** | Medium |
| **Pattern** | Sieve of Eratosthenes (optimized) |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) — basic sieve in [Foundations math](../../../00_Foundations/04_Mathematics_For_DSA/01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #204 — https://leetcode.com/problems/count-primes/ (statement paraphrased in our own words) |
| **Solution file** | [02_count_primes.js](../solutions/02_count_primes.js) — open only after a real attempt |

## Problem

Given a non-negative integer n, return how many primes are strictly smaller than n.
The Foundations topic solved this with a plain sieve. This time, make the sieve leaner: store only odd numbers in a typed array, and explain why starting at p*p is correct.

## Examples

```
Input: 10   Output: 4   (2, 3, 5, 7)
Input: 0    Output: 0
Input: 2    Output: 0   (strictly less than 2)
Input: 20   Output: 8
```

## Constraints & clarifying questions

```
- 0 <= n <= 5 * 10^6
- Strictly less than n (not <= n). Clarify this out loud.
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** Many primality questions over a whole range -> sieve, not repeated trial division.

</details>

<details><summary>Hint 2</summary>

**Start simple.** isPrime(x) by trial division for every x < n is O(n sqrt n), about 1e10 steps for n = 5e6. Too slow.

</details>

<details><summary>Hint 3</summary>

**The key idea.** 2 is the only even prime. Keep a Uint8Array for odd numbers only (index i means 2i + 1). For each odd prime p with p*p < n, cross out p*p, p*p + 2p, p*p + 4p ... (step 2p skips the even multiples).

</details>

<details><summary>Hint 4</summary>

**Edge cases.** n <= 2 -> 0. Count 2 separately (or use the trick that index 0 stands for 1, which is not prime, and cancels against the missing 2).

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n sqrt n) time, O(1) space

```
for x in 2..n-1: if isPrime(x) count++
isPrime tries divisors up to sqrt(x).
```

### APPROACH 2 — Optimal (odd-only sieve)   O(n log log n) time, O(n) space (n/2 bytes)

```
composite = Uint8Array(n / 2)        // index i <-> number 2i + 1
count = n / 2                         // all odd candidates + "1 instead of 2"
for odd p from 3 while p*p < n:
  if p not crossed: for m = p*p; m < n; m += 2p: cross m (count-- if newly crossed)
Why start at p*p? Any smaller multiple k*p has k < p, so it was already
crossed out by a prime factor of k.
```

### Dry run

```
n = 20, odd candidates: 1 3 5 7 9 11 13 15 17 19  (count = 10)
p=3: cross 9, 15             count = 8
p=5: 25 >= 20 -> stop
answer 8 = {2,3,5,7,11,13,17,19}  (1 is counted in place of 2)
```

### Complexity

| Approach | Time | Space |
|---|---|---|
| Trial division per number | O(n sqrt n) | O(1) |
| Plain sieve (Foundations) | O(n log log n) | O(n) |
| Odd-only sieve | O(n log log n), about half the work | O(n/2) bytes |

### Edge cases

```
- n = 0, 1, 2 -> 0
- n = 3 -> 1
- n is itself prime -> it is NOT counted
```

### Common mistakes

- Using <= n instead of < n.
- Starting the inner loop at 2p instead of p*p (correct but slower) or at p (crosses out p itself).
- Using a normal Array of booleans: 8x more memory than Uint8Array and slower.

Full JavaScript solution with tests: [02_count_primes.js](../solutions/02_count_primes.js). Run it with `node 02_count_primes.js` from the solutions folder.

</details>

## Related follow-ups

- Closest Prime Numbers in Range (problem 06)
- Segmented sieve for primes in [L, R] with R up to 1e12 (see CONCEPTS)
- Linear (Euler) sieve that also produces smallest prime factors

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
