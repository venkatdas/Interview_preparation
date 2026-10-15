# Closest Prime Numbers in Range

| | |
|---|---|
| **Topic** | Number Theory (Essential) |
| **Difficulty** | Medium |
| **Pattern** | sieve + adjacent scan |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #2523 — https://leetcode.com/problems/closest-prime-numbers-in-range/ (statement paraphrased in our own words) |
| **Solution file** | [06_closest_prime_numbers_in_range.js](../solutions/06_closest_prime_numbers_in_range.js) — open only after a real attempt |

## Problem

Given left and right, choose two primes p < q inside [left, right] whose difference q - p is as small as possible. If several pairs tie, pick the one with the smaller p. If the range holds fewer than two primes, return [-1, -1].

## Examples

```
Input: 10, 19   Output: [11, 13]
Input: 4, 6     Output: [-1, -1]  (only 5)
Input: 1, 3     Output: [2, 3]
```

## Constraints & clarifying questions

```
- 1 <= left <= right <= 10^6
- Follow-up: right up to 10^12 but right - left <= 10^6 -> segmented sieve.
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** Many primality tests on a range -> sieve once.

</details>

<details><summary>Hint 2</summary>

**Start simple.** Trial-divide each number in the range, remember the previous prime and the best gap.

</details>

<details><summary>Hint 3</summary>

**The key idea.** The closest pair is always two ADJACENT primes. Sieve up to right, then one scan. You can stop early at gap 2 (twin primes) because only (2, 3) has gap 1 and it would already have been found.

</details>

<details><summary>Hint 4</summary>

**Edge cases.** 1 is not prime. A range with zero or one prime returns [-1, -1].

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O((R - L) sqrt R) time, O(1) space

```
for x in [left, right]: if isPrime(x): compare x - prev with best; prev = x
```

### APPROACH 2 — Optimal (sieve + scan)   O(R log log R) time, O(R) space

```
sieve up to right
prev = -1
for x in [left, right] that is prime:
  if prev != -1 and x - prev < bestGap: update; if bestGap <= 2 return
  prev = x
```

### Dry run

```
[10, 19]: primes 11, 13, 17, 19
prev=11 -> x=13 gap 2 -> best [11,13], gap <= 2 -> stop
```

### Complexity

| Approach | Time | Space |
|---|---|---|
| Trial division | O((R-L) sqrt R) | O(1) |
| Sieve + scan | O(R log log R) | O(R) |
| Segmented sieve (follow-up) | O((R-L) log log R + sqrt R) | O(R-L + sqrt R) |

### Edge cases

```
- left = right -> [-1, -1]
- left = 1
- range containing exactly one prime
```

### Common mistakes

- Using <= instead of < when comparing gaps (breaks the "smaller p wins" tie rule).
- Sieving to right but forgetting to mark 0 and 1 as non-prime.

Full JavaScript solution with tests: [06_closest_prime_numbers_in_range.js](../solutions/06_closest_prime_numbers_in_range.js). Run it with `node 06_closest_prime_numbers_in_range.js` from the solutions folder.

</details>

## Related follow-ups

- Count Primes (problem 02)
- Prime gaps / twin primes via segmented sieve
- Prime Arrangements (LeetCode 1175)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
