# Power of Three / Power of Four

| | |
|---|---|
| **Topic** | Recursion |
| **Difficulty** | Easy |
| **Pattern** | shrink by a factor |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #326 — https://leetcode.com/problems/power-of-three/ (statement paraphrased in our own words) |
| **Solution file** | [02_power_of_three_four.js](../solutions/02_power_of_three_four.js) — open only after a real attempt |

## Problem

Given an integer n, decide whether n is a power of three (3^k for some k >= 0).
Same question for four. We solve both with one recursive helper isPowerOf(n, base).

## Examples

```
isPowerOfThree(27) -> true     (3^3)
isPowerOfThree(0)  -> false
isPowerOfThree(45) -> false    (45 = 3^2 * 5)
isPowerOfFour(16)  -> true     (4^2)
isPowerOfFour(8)   -> false    (power of two, but not of four)
isPowerOf(1, b)    -> true     (b^0)
```

## Constraints & clarifying questions

```
- n can be negative or zero? (yes -> always false)
- 32-bit range? (yes, -2^31 .. 2^31 - 1)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 25 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** The input shrinks by a constant FACTOR each step (n -> n / base), so the recursion depth is logarithmic.

</details>

<details><summary>Hint 2</summary>

**Start simple.** Multiply 1 by the base until you reach or pass n, then compare.

</details>

<details><summary>Hint 3</summary>

**The key idea.** n is a power of b exactly when n is divisible by b AND n / b is a power of b. Base case: 1 is b^0.

</details>

<details><summary>Hint 4</summary>

**Edge cases.** n <= 0 must return false before anything else: 0 % 3 === 0, so without the guard you recurse forever. (Power of Four is LeetCode #342, same helper.)

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (multiply up)   O(log n) time, O(1) space

```
Start at p = 1, multiply by base until p >= n, then compare p === n.
```

### APPROACH 2 — Optimal (recursive "peel one factor")   O(log_b n) time, O(log_b n) stack

```
PROMISE: isPowerOf(n, b) says whether n = b^k.
  base cases: n <= 0 -> false;  n === 1 -> true (b^0)
  if n is not divisible by b it cannot be a power -> false
  otherwise n is a power of b exactly when n / b is -> recurse on n / b.
The input shrinks by a factor of b each step, so depth is log_b(n) (<= 20 for 3^19).
(Interview bonus: for 3, 1162261467 % n === 0 works because 3 is prime and 3^19 is the
 largest power in 32-bit range. For 4: power of two AND (n - 1) % 3 === 0.)

Dry run isPowerOf(27, 3):
  27 % 3 = 0 -> isPowerOf(9) -> 9 % 3 = 0 -> isPowerOf(3) -> isPowerOf(1) -> true
Dry run isPowerOf(45, 3):
  45 -> 15 -> 5, 5 % 3 = 2 -> false
```

### Complexity

| Approach | Time | Space |
|---|---|---|
| multiply up | O(log n) | O(1) |
| recursive peel | O(log_b n) | O(log_b n) stack |

### Edge cases

```
- n = 1 -> true for every base
- n = 0 -> false (0 % 3 === 0 would recurse forever without the n <= 0 guard!)
- negative n -> false
```

### Common mistakes

- Missing the n <= 0 guard (infinite recursion on 0).
- Using floating point division and comparing with === 1 after rounding errors (integer % check avoids it).
- For four: accepting 8 because it is a power of two.

Full JavaScript solution with tests: [02_power_of_three_four.js](../solutions/02_power_of_three_four.js). Run it with `node 02_power_of_three_four.js` from the solutions folder.

</details>

## Related follow-ups

- Power of Two (LeetCode #231)
- Power of Four (LeetCode #342)
- Pow(x, n) (LeetCode #50)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Write down the recursive PROMISE you used in one sentence. If you could not state it, re-solve.
- Re-solve from scratch in 3 days, then in 1 week.
