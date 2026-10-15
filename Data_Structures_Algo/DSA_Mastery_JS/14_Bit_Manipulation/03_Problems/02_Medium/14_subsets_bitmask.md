# Subsets

| | |
|---|---|
| **Topic** | Bit Manipulation |
| **Difficulty** | Medium |
| **Pattern** | enumerate masks |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #78 — https://leetcode.com/problems/subsets/ |
| **Solution file** | [14_subsets_bitmask.js](../solutions/14_subsets_bitmask.js) — open only after a real attempt |

## Problem

Given an array of distinct integers, return every possible subset (the power set).
Any order is fine.

## Examples

```
Input: [1,2,3]   Output: [[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]
Input: [0]       Output: [[],[0]]
```

## Constraints & clarifying questions

```
- n <= 10 on LeetCode; the bitmask approach needs n < 31 in JS.
- Distinct elements? (yes; with duplicates you need sorting + skipping)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *enumerate masks* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (backtracking)   O(n * 2^n) time, O(n) recursion space. Classic include/exclude recursion from 13_Backtracking/.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (bitmask enumeration)   O(n * 2^n) time, O(n * 2^n) output. There are 2^n subsets and 2^n integers in [0, 2^n).

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- empty input -> [[]]
- single element -> [[], [x]]
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (backtracking)   O(n * 2^n) time, O(n) recursion space

```
Classic include/exclude recursion from 13_Backtracking/. Shown as the
"other" way; same complexity, different shape.
```

### APPROACH 2 — Optimal (bitmask enumeration)   O(n * 2^n) time, O(n * 2^n) output

```
There are 2^n subsets and 2^n integers in [0, 2^n). Make the integer `mask` describe a
subset: bit i set means "nums[i] is in". Loop mask from 0 to 2^n - 1 and decode each.
Same time as backtracking, but iterative and trivially extended to "only masks with
k bits" or "sub-masks of a given mask".

Dry run on [1,2,3] (n = 3, masks 0..7):
  mask 000 -> []        mask 001 -> [1]      mask 010 -> [2]      mask 011 -> [1,2]
  mask 100 -> [3]       mask 101 -> [1,3]    mask 110 -> [2,3]    mask 111 -> [1,2,3]
```

### Edge cases

```
- empty input -> [[]]
- single element -> [[], [x]]
```

Full JavaScript solution with tests: [14_subsets_bitmask.js](../solutions/14_subsets_bitmask.js). Run it with `node 14_subsets_bitmask.js` from the solutions folder.

</details>

## Common mistakes

- Using `1 << n` with n ≥ 31 (overflows to negative in JS).
- Mapping bit i to the wrong element (bit 0 is the first item when you test `mask & (1 << i)`).
- Assuming the mask method removes duplicates when the input has repeated values.

## Related follow-ups

- [Subsets](../../../13_Backtracking/03_Problems/02_Medium/01_subsets.md) (13_Backtracking)
- [Subsets II](../../../13_Backtracking/03_Problems/02_Medium/02_subsets_ii.md) (13_Backtracking)
- Letter Case Permutation (LeetCode #784)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
