# Single Number III

| | |
|---|---|
| **Topic** | Bit Manipulation |
| **Difficulty** | Medium |
| **Pattern** | split by lowest set bit |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #260 — https://leetcode.com/problems/single-number-iii/ |
| **Solution file** | [10_single_number_iii.js](../solutions/10_single_number_iii.js) — open only after a real attempt |

## Problem

Every element appears exactly twice except TWO elements, which appear once each.
Return the two single elements, in any order. O(n) time, O(1) space.

## Examples

```
Input: [1,2,1,3,2,5]   Output: [3,5]
Input: [-1,0]          Output: [-1,0]
Input: [0,1]           Output: [0,1]
```

## Constraints & clarifying questions

```
- Exactly two singles? (yes)
- Order of output? (any; tests sort it)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *split by lowest set bit* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n) time, O(n) space. Hash map counts, collect keys with count 1.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (XOR, then split on a differing bit)   O(n) time, O(1) space. 1.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- just two elements -> themselves
- negatives: xor & -xor still isolates a bit; for xor = -2^31, -xor overflows back to
  -2^31 and the AND still yields that single bit, so it is safe
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n) time, O(n) space

```
Hash map counts, collect keys with count 1.
```

### APPROACH 2 — Optimal (XOR, then split on a differing bit)   O(n) time, O(1) space

```
1. XOR everything -> x ^ y (pairs cancel). Call it `xor`. It is non-zero because x !== y.
2. Pick any set bit of `xor`: the lowest one is `xor & -xor`. At that bit, x and y DIFFER.
3. Split the array into two groups by that bit. x is in one group, y in the other, and
   every pair lands in the same group (equal numbers have equal bits). XOR each group
   separately -> x and y.

Dry run on [1,2,1,3,2,5]:
  xor = 3 ^ 5 = 011 ^ 101 = 110 (6)
  lowest set bit = 010 (2)
  group with bit1 set:   2, 2, 3  -> 3
  group with bit1 clear: 1, 1, 5  -> 5   -> [3,5]
```

### Edge cases

```
- just two elements -> themselves
- negatives: xor & -xor still isolates a bit; for xor = -2^31, -xor overflows back to
  -2^31 and the AND still yields that single bit, so it is safe
```

Full JavaScript solution with tests: [10_single_number_iii.js](../solutions/10_single_number_iii.js). Run it with `node 10_single_number_iii.js` from the solutions folder.

</details>

## Common mistakes

- Using `xor & -xor` incorrectly when xor is -2147483648 (it still works in JS 32-bit math, but check your language).
- Splitting the array by an arbitrary bit that is the same in both answers.
- Returning the two numbers in a fixed order when the problem allows any order (or vice versa).

## Related follow-ups

- [Single Number](../01_Easy/01_single_number.md)
- [Single Number II](09_single_number_ii.md)
- [Missing Number](../01_Easy/04_missing_number.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
