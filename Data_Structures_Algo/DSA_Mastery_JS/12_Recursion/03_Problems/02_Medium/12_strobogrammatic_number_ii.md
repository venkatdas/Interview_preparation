# Strobogrammatic Number II

| | |
|---|---|
| **Topic** | Recursion |
| **Difficulty** | Medium |
| **Pattern** | build from the inside out |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #247 — https://leetcode.com/problems/strobogrammatic-number-ii/ (statement paraphrased in our own words) |
| **Solution file** | [12_strobogrammatic_number_ii.js](../solutions/12_strobogrammatic_number_ii.js) — open only after a real attempt |

## Problem

A strobogrammatic number looks the same after rotating it 180 degrees
(0->0, 1->1, 8->8, 6->9, 9->6). Return all strobogrammatic numbers with exactly
n digits, as strings, with no leading zero (except "0" itself when n = 1).

## Examples

```
n = 1 -> ["0", "1", "8"]
n = 2 -> ["11", "69", "88", "96"]
n = 3 -> ["101","111","181","609","619","689","808","818","888","906","916","986"]
```

## Constraints & clarifying questions

```
- 1 <= n <= 14. Output order? (any)
- Is "00" valid for n = 2? (no - leading zero)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 35 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** A strobogrammatic string of length m is a valid pair wrapped around one of length m - 2. Recursion that shrinks by 2.

</details>

<details><summary>Hint 2</summary>

**Start simple.** Check every n-digit number by rotating it. Only fine for n <= 6.

</details>

<details><summary>Hint 3</summary>

**The key idea.** Base cases m = 0 -> [""] and m = 1 -> ["0","1","8"]. Wrap each inner string with (0,0) (1,1) (6,9) (8,8) (9,6).

</details>

<details><summary>Hint 4</summary>

**Edge cases.** Skip the (0,0) pair ONLY at the outermost level. "0" alone is valid when n = 1.

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (check every n-digit number)   O(10^n * n) time

```
Loop over all numbers with n digits, rotate each, keep the ones equal to themselves.
Only usable for n <= 6.
```

### APPROACH 2 — Optimal (build from the inside out)   O(5^(n/2) * n) time

```
PROMISE: build(m) returns all strobogrammatic strings of length m, ALLOWING leading 0.
  base: m = 0 -> [""], m = 1 -> ["0", "1", "8"]
  step: for each inner of build(m - 2), wrap it with each pair
        (0,0) (1,1) (6,9) (8,8) (9,6)  ->  left + inner + right
  at the OUTERMOST level (m === n) skip the (0,0) pair: no leading zero.
Inner layers may use 0, so we need to know which call is the outer one -> pass n along.

Dry run n = 3:
  build(1) = ["0","1","8"]
  wrap each with 1_1, 6_9, 8_8, 9_6 (no 0_0 at the outer level) -> 4 * 3 = 12 strings
```

### Complexity

| Approach | Time | Space |
|---|---|---|
| check all numbers | O(10^n * n) | O(output) |
| inside-out recursion | O(5^(n/2) * n) | O(output) |

### Edge cases

```
- n = 1: "0" is allowed (it is not a leading zero, it is the number zero)
- even n: middle is empty
```

### Common mistakes

- Forbidding 0 in inner layers too (misses "1001").
- Allowing a leading 0 at the outer layer.
- Putting 6 or 9 in the middle of an odd-length number.

Full JavaScript solution with tests: [12_strobogrammatic_number_ii.js](../solutions/12_strobogrammatic_number_ii.js). Run it with `node 12_strobogrammatic_number_ii.js` from the solutions folder.

</details>

## Related follow-ups

- Strobogrammatic Number (LeetCode #246)
- Strobogrammatic Number III (LeetCode #248)
- Confusing Number II (LeetCode #1088)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Write down the recursive PROMISE you used in one sentence. If you could not state it, re-solve.
- Re-solve from scratch in 3 days, then in 1 week.
