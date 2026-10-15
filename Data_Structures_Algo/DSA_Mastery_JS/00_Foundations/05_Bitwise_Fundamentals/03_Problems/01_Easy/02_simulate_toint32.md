# Simulate ToInt32 and ToUint32

| | |
|---|---|
| **Topic** | Bitwise Fundamentals |
| **Difficulty** | Easy |
| **Pattern** | modular arithmetic, 32-bit conversion |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | Original exercise |
| **Solution file** | [02_simulate_toint32.js](../solutions/02_simulate_toint32.js) — open only after a real attempt |

## Problem

JavaScript converts operands of & | ^ ~ << >> with ToInt32, and of >>> with ToUint32.
Implement toInt32(x) and toUint32(x) using ONLY arithmetic (Math.trunc, %, +, -),
no bitwise operators, so that they match x | 0 and x >>> 0 for every Number x,
including fractions, negatives, values far beyond 2^32, NaN and Infinity.

## Examples

```
Input: 3.9            toInt32: 3            toUint32: 3
Input: -3.9           toInt32: -3           toUint32: 4294967293
Input: 2147483648     toInt32: -2147483648  toUint32: 2147483648
Input: 4294967301     toInt32: 5            toUint32: 5
Input: NaN            toInt32: 0            toUint32: 0
```

## Constraints & clarifying questions

```
- Any Number, up to Number.MAX_VALUE.
- -0 -> 0 (result must be +0; compare with === is fine).
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 20 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** *The 32-bit funnel*. Section 5.4 in [the concepts guide](../../01_Concepts/CONCEPTS.md) lists the four steps.

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (repeated subtraction / addition)   O(|x| / 2^32) time. Truncate, then while t >= 2^32 subtract 2^32; while t < 0 add 2^32. Correct but hopelessly slow for x = 1e300 (so the brute force caps at |x| < 2^40 in tests).

</details>

<details><summary>Hint 3</summary>

**The key idea.** Truncate toward zero, then reduce modulo 2^32 into `[0, 2^32)` with `((t % 2^32) + 2^32) % 2^32` (JS `%` keeps the sign). That is ToUint32; subtract 2^32 when it is at least 2^31 to get ToInt32.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- NaN, Infinity, -Infinity -> 0
- -0 -> 0
- 2^31 exactly -> -2^31 (int32), 2^31 (uint32)
- 2^53 + 2 and 1e300 -> must still match x | 0
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (repeated subtraction / addition)   O(|x| / 2^32) time

```
Truncate, then while t >= 2^32 subtract 2^32; while t < 0 add 2^32. Correct but
hopelessly slow for x = 1e300 (so the brute force caps at |x| < 2^40 in tests).
```

### APPROACH 2 — Optimal (modular arithmetic)   O(1) time, O(1) space

```
1. not finite -> 0
2. t = Math.trunc(x)                    (toward zero, NOT floor)
3. u = ((t % 2^32) + 2^32) % 2^32       (JS % keeps the sign of t, so shift into range)
4. toUint32 = u; toInt32 = u >= 2^31 ? u - 2^32 : u
For huge t this is still exact: JS % on doubles computes the remainder exactly
(like C fmod), so t % 2^32 has no rounding error even for 1e300.

Dry run x = -3.9:
  t = -3; -3 % 2^32 = -3; (-3 + 2^32) % 2^32 = 4294967293 = toUint32
  4294967293 >= 2^31 -> toInt32 = 4294967293 - 4294967296 = -3
```

### Edge cases

```
- NaN, Infinity, -Infinity -> 0
- -0 -> 0
- 2^31 exactly -> -2^31 (int32), 2^31 (uint32)
- 2^53 + 2 and 1e300 -> must still match x | 0
```

### Common mistakes

```
- Math.floor instead of Math.trunc (-3.9 -> -4, wrong).
- Forgetting that % can return a negative number.
- Returning -0 for -0.5 (fix by adding 0 or using the modular step, which gives +0).
```

Full JavaScript solution with tests: [02_simulate_toint32.js](../solutions/02_simulate_toint32.js). Run it with `node 02_simulate_toint32.js` from the solutions folder.

</details>

## Related follow-ups

- Implement `Math.imul` with 16-bit halves.
- LeetCode #7 Reverse Integer (detect 32-bit overflow).
- Implement ToInt8 / ToUint8 (what `Int8Array` does on assignment).

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
