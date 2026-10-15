# Ugly Number

| | |
|---|---|
| **Topic** | Number Theory (Essential) |
| **Difficulty** | Easy |
| **Pattern** | divide out allowed primes |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #263 — https://leetcode.com/problems/ugly-number/ (statement paraphrased in our own words) |
| **Solution file** | [01_ugly_number.js](../solutions/01_ugly_number.js) — open only after a real attempt |

## Problem

Call a positive integer "ugly" when 2, 3 and 5 are the only primes that divide it.
Given an integer n, decide whether it is ugly. The number 1 counts as ugly because it has no prime factors at all.

## Examples

```
Input: 6    Output: true    (6 = 2 * 3)
Input: 1    Output: true    (no prime factors)
Input: 14   Output: false   (7 divides 14)
Input: 0    Output: false   (not positive)
```

## Constraints & clarifying questions

```
- n fits in a 32-bit signed integer and may be 0 or negative.
- Zero and negatives are never ugly. Is 1 ugly? (yes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** Prime factorization. Every integer > 1 has exactly one factorization into primes (fundamental theorem of arithmetic). Re-read "Divisibility and factorization" in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** Factorize n completely by trial division and check each prime. That works, but you search for primes you are going to reject anyway.

</details>

<details><summary>Hint 3</summary>

**The key idea.** Strip the allowed primes instead: divide by 2 while you can, then by 3, then by 5. If anything other than 1 is left, some other prime was in the factorization.

</details>

<details><summary>Hint 4</summary>

**Edge cases.** Guard n <= 0 FIRST: with n = 0 the loop "while (n % 2 === 0)" never ends because 0 % 2 is 0.

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(sqrt n) time, O(1) space

```
Trial-divide by every d from 2 while d*d <= n. Whenever d divides n,
reject if d is not 2, 3 or 5. The leftover (a prime or 1) must also be 1, 2, 3 or 5.
```

### APPROACH 2 — Optimal (divide out 2, 3, 5)   O(log n) time, O(1) space

```
if n <= 0 return false
for p in [2, 3, 5]: while n % p == 0: n /= p
return n == 1
Each division at least halves n, so there are at most log2(n) divisions.
```

### Dry run

```
n = 30:  p=2 -> 15,  p=3 -> 5,  p=5 -> 1      -> true
n = 14:  p=2 -> 7,   p=3 no,   p=5 no          -> 7 left -> false
```

### Complexity

| Approach | Time | Space |
|---|---|---|
| Brute force (trial division) | O(sqrt n) | O(1) |
| Divide out 2, 3, 5 | O(log n) | O(1) |

### Edge cases

```
- n = 0 or negative -> false (and avoids the infinite loop)
- n = 1 -> true
- large prime like 2147483647 -> false
```

### Common mistakes

- Forgetting the n <= 0 guard (infinite loop on 0).
- Checking "n % 2 === 0 || n % 3 === 0 || n % 5 === 0" once instead of dividing repeatedly; 14 passes that check but is not ugly.

Full JavaScript solution with tests: [01_ugly_number.js](../solutions/01_ugly_number.js). Run it with `node 01_ugly_number.js` from the solutions folder.

</details>

## Related follow-ups

- Ugly Number II (LeetCode 264) — the n-th ugly number with three pointers
- Super Ugly Number (LeetCode 313) — any list of primes, heap or k pointers
- Ugly Number III (LeetCode 1201) — binary search + inclusion–exclusion (same idea as problem 11 here)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
