# Count Good Numbers

| | |
|---|---|
| **Topic** | Recursion |
| **Difficulty** | Medium |
| **Pattern** | fast power (halving recursion) |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md), [Mathematics for DSA](../../../00_Foundations/04_Mathematics_For_DSA/README.md) |
| **Source** | LeetCode #1922 — https://leetcode.com/problems/count-good-numbers/ (statement paraphrased in our own words) |
| **Solution file** | [08_count_good_numbers.js](../solutions/08_count_good_numbers.js) — open only after a real attempt |

## Problem

A digit string is "good" if digits at even indices (0, 2, 4, ...) are even
(0,2,4,6,8 -> 5 choices) and digits at odd indices are prime (2,3,5,7 -> 4 choices).
Leading zeros are allowed. Given n (the length), return the number of good strings
modulo 1e9 + 7.

## Examples

```
n = 1  -> 5
n = 4  -> 400        (5 * 4 * 5 * 4)
n = 50 -> 564908303
```

## Constraints & clarifying questions

```
- 1 <= n <= 10^15  -> we cannot loop n times, and products overflow 2^53 -> BigInt
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 35 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** Count by the multiplication rule, then compute a huge power: *fast exponentiation*.

</details>

<details><summary>Hint 2</summary>

**Start simple.** Enumerate all strings for tiny n to discover the pattern 5, 20, 100, 400, ...

</details>

<details><summary>Hint 3</summary>

**The key idea.** Answer = 5^ceil(n/2) * 4^floor(n/2) mod 1e9+7. pow(b, e) = pow(b, e/2)^2 (times b if e is odd): compute the half ONCE.

</details>

<details><summary>Hint 4</summary>

**Edge cases.** n up to 10^15: use BigInt for exponents and products (half * half overflows 2^53 as Number).

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (enumerate strings)   O(10^n * n) time

```
Generate every digit string of length n and test it. Only usable for n <= 6.
(A linear loop multiplying 5 and 4 alternately is O(n): still too slow for 10^15.)
```

### APPROACH 2 — Optimal (count = 5^ceil(n/2) * 4^floor(n/2), recursive fast power)

```
  O(log n) time, O(log n) stack
PROMISE: pow(b, e) returns b^e mod M.
  base: e = 0 -> 1
  step: half = pow(b, floor(e/2)) ONCE; result = half*half (times b if e is odd).
Calling pow twice for the halves would bring us back to O(e) calls — the single call
reused twice is the whole trick.

Dry run pow(5, 5):
  pow(5,5) -> half = pow(5,2) -> half = pow(5,1) -> half = pow(5,0) = 1 -> 1*1*5 = 5
           pow(5,2) = 5*5 = 25
  pow(5,5) = 25*25*5 = 3125 ✓
```

### Complexity

| Approach | Time | Space |
|---|---|---|
| enumerate | O(10^n * n) | O(n) |
| linear multiply | O(n) | O(1) |
| fast power | O(log n) | O(log n) stack |

### Edge cases

```
- n = 1 -> only one even position -> 5
- huge n (10^15): BigInt needed for the exponent arithmetic and products
```

### Common mistakes

- Calling pow twice for the two halves (back to O(n) calls).
- Using Number for half * half (precision loss above 2^53).
- Swapping which positions are even/odd: index 0 is even.

Full JavaScript solution with tests: [08_count_good_numbers.js](../solutions/08_count_good_numbers.js). Run it with `node 08_count_good_numbers.js` from the solutions folder.

</details>

## Related follow-ups

- Pow(x, n) (LeetCode #50)
- Super Pow (LeetCode #372)
- Count Vowels Permutation (LeetCode #1220)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Write down the recursive PROMISE you used in one sentence. If you could not state it, re-solve.
- Re-solve from scratch in 3 days, then in 1 week.
