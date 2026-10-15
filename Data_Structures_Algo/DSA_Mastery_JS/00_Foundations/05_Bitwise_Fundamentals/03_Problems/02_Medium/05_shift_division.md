# Divide by Powers of Two with Shifts

| | |
|---|---|
| **Topic** | Bitwise Fundamentals |
| **Difficulty** | Medium |
| **Pattern** | `>>` vs `>>>`, rounding |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | Original exercise |
| **Solution file** | [05_shift_division.js](../solutions/05_shift_division.js) — open only after a real attempt |

## Problem

Given a 32-bit signed integer n and 0 <= k <= 31, compute three quotients of n / 2^k
using ONLY bitwise operators, comparisons and + / - (no /, %, Math.*):
  floor:    Math.floor(n / 2^k)                 (round toward -infinity)
  trunc:    Math.trunc(n / 2^k)                 (round toward zero, like C integer division)
  unsigned: Math.floor((n as uint32) / 2^k)     (treat the bits as unsigned)

## Examples

```
Input: n = 20,  k = 2   Output: { floor: 5,  trunc: 5,  unsigned: 5 }
Input: n = -7,  k = 1   Output: { floor: -4, trunc: -3, unsigned: 2147483644 }
Input: n = -1,  k = 31  Output: { floor: -1, trunc: 0,  unsigned: 1 }
Input: n = 5,   k = 0   Output: { floor: 5,  trunc: 5,  unsigned: 5 }
```

## Constraints & clarifying questions

```
- n is in [-2^31, 2^31 - 1]; k in [0, 31].
- Why does it matter? Mid-point (lo + hi) >> 1, hashing, and C-style division ports.
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** *Shift semantics*. Sections 5.5 and 8 (dry run with −6) in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (arithmetic)   O(1) time. floor = Math.floor(n / 2 ** k); trunc = Math.trunc(n / 2 ** k); unsigned = Math.floor((n >>> 0) / 2 ** k). The reference answer.

</details>

<details><summary>Hint 3</summary>

**The key idea.** `n >> k` floors, `n >>> k` divides the unsigned view. For truncation of a negative n, add the bias `2^k - 1` before `>> k`; build the bias branch-free as `(n >> 31) >>> (32 - k)`.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- k = 0: all three are n (unsigned is n >>> 0)
- n = -2^31: trunc bias must not overflow (n + bias stays negative: safe)
- n = -1, k = 31: floor -1, trunc 0, unsigned 1
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (arithmetic)   O(1) time

```
floor = Math.floor(n / 2 ** k); trunc = Math.trunc(n / 2 ** k);
unsigned = Math.floor((n >>> 0) / 2 ** k). The reference answer.
```

### APPROACH 2 — Optimal (shifts)   O(1) time, O(1) space

```
floor:    n >> k     (arithmetic shift copies the sign bit: rounds toward -infinity)
unsigned: n >>> k    (zero-fill shift on the unsigned view)
trunc:    for n >= 0 same as floor. For n < 0 add a BIAS of (2^k - 1) before shifting:
          (n + bias) >> k. The bias pushes any non-zero remainder past the next multiple,
          turning floor into ceil, which is truncation for negative numbers.
          Branch-free bias: (n >> 31) is -1 (all ones) when n < 0 and 0 otherwise;
          >>> (32 - k) keeps only its low k bits -> 2^k - 1 or 0 (k = 0 handled separately).
          n + bias cannot overflow: bias is non-zero only when n is negative.

Dry run n = -7 (…11111001), k = 1:
  floor:    -7 >> 1  = …11111100 = -4
  trunc:    bias = 1; (-7 + 1) >> 1 = -6 >> 1 = -3
  unsigned: -7 >>> 1 = 0111…1100 = 2147483644
```

### Edge cases

```
- k = 0: all three are n (unsigned is n >>> 0)
- n = -2^31: trunc bias must not overflow (n + bias stays negative: safe)
- n = -1, k = 31: floor -1, trunc 0, unsigned 1
```

### Common mistakes

```
- Using >> and calling it "integer division" for negatives (it floors, C truncates).
- Using >>> on signed values expecting a negative result.
- Building the bias as (1 << k) - 1 and forgetting that 1 << 31 is negative (it happens to
  wrap correctly, but the branch-free form avoids having to reason about it).
```

Full JavaScript solution with tests: [05_shift_division.js](../solutions/05_shift_division.js). Run it with `node 05_shift_division.js` from the solutions folder.

</details>

## Related follow-ups

- LeetCode #29 Divide Two Integers.
- Safe binary-search mid-point without overflow.
- Round-to-nearest division by 2^k with shifts.

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
