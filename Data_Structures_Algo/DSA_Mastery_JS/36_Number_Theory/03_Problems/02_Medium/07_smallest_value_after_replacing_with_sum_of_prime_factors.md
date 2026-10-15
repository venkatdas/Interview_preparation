# Smallest Value After Replacing With Sum of Prime Factors

| | |
|---|---|
| **Topic** | Number Theory (Essential) |
| **Difficulty** | Medium |
| **Pattern** | smallest-prime-factor sieve |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #2507 — https://leetcode.com/problems/smallest-value-after-replacing-with-sum-of-prime-factors/ (statement paraphrased in our own words) |
| **Solution file** | [07_smallest_value_after_replacing_with_sum_of_prime_factors.js](../solutions/07_smallest_value_after_replacing_with_sum_of_prime_factors.js) — open only after a real attempt |

## Problem

Start with n. Repeatedly replace it with the sum of its prime factors, counting repeated primes every time (for example 12 = 2*2*3 becomes 2+2+3 = 7). Return the smallest value that n ever takes.

## Examples

```
Input: 15   Output: 5    (15 -> 8 -> 6 -> 5 -> 5)
Input: 3    Output: 3
Input: 4    Output: 4    (4 -> 2+2 = 4)
```

## Constraints & clarifying questions

```
- 2 <= n <= 10^5
- Does it always stop? Yes: for composite a*b, a + b <= a*b, equal only at 4.
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** Repeated factorization -> smallest prime factor table.

</details>

<details><summary>Hint 2</summary>

**Start simple.** Trial-divide in a loop until the sum stops changing.

</details>

<details><summary>Hint 3</summary>

**The key idea.** Precompute spf[] up to n once. Factorizing x then takes O(log x): divide by spf[x] until x is 1.

</details>

<details><summary>Hint 4</summary>

**Edge cases.** Stop when sum === current value, not when the value is prime: 4 is a fixed point but not prime.

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(sqrt n) per round, O(1) space

```
loop: s = sum of prime factors by trial division; if s === n return n; n = s
```

### APPROACH 2 — Optimal (spf sieve)   O(n) build + O(log n) per round, O(n) space

```
spf = smallest-prime-factor sieve up to n
loop:
  s = 0, x = n; while x > 1: s += spf[x]; x /= spf[x]
  if s === n return n
  n = s           // s <= n so spf still covers it
```

### Dry run

```
n = 15: 3 + 5 = 8
n = 8 : 2 + 2 + 2 = 6
n = 6 : 2 + 3 = 5
n = 5 : 5 -> equal -> answer 5
```

### Complexity

| Approach | Time | Space |
|---|---|---|
| Trial division per round | O(sqrt n * rounds) | O(1) |
| spf sieve | O(n + log n * rounds) | O(n) |

### Edge cases

```
- n prime -> n
- n = 4 -> 4
- n = 2 -> 2
```

### Common mistakes

- Summing DISTINCT primes only (12 would give 5 instead of 7).
- Stopping on "is prime" and looping forever on 4.

Full JavaScript solution with tests: [07_smallest_value_after_replacing_with_sum_of_prime_factors.js](../solutions/07_smallest_value_after_replacing_with_sum_of_prime_factors.js). Run it with `node 07_smallest_value_after_replacing_with_sum_of_prime_factors.js` from the solutions folder.

</details>

## Related follow-ups

- Four Divisors (problem 03) — another spf use
- Distinct Prime Factors of Product of Array (LeetCode 2521)
- Largest Component Size by Common Factor (LeetCode 952) — spf + union-find

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
