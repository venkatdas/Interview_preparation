# Find All Numbers Disappeared in an Array

| | |
|---|---|
| **Topic** | Arrays |
| **Difficulty** | Easy |
| **Pattern** | index as hash |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #448 — https://leetcode.com/problems/find-all-numbers-disappeared-in-an-array/ |
| **Solution file** | [12_find_all_numbers_disappeared.js](../solutions/12_find_all_numbers_disappeared.js) — open only after a real attempt |

## Problem

Given an array of n integers where every value is in the range [1, n], return all
numbers in [1, n] that do NOT appear in the array. Follow-up: O(n) time and no extra
space (the returned list does not count).

## Examples

```
Input: [4, 3, 2, 7, 8, 2, 3, 1]   Output: [5, 6]
Input: [1, 1]                     Output: [2]
```

## Constraints & clarifying questions

```
- Are all values guaranteed in 1..n? (yes - that is what makes the index trick possible)
- Can I modify the input? (yes for the O(1) space version; restore it afterwards if asked)
- Output order? (ascending is natural with the index trick)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *index as hash* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n) time, O(n) space. Put the values in a Set, then loop 1..n and collect everything not in the Set.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (index as hash, negate to mark)   O(n) time, O(1) extra space. Value v "belongs" to index v - 1.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- Nothing missing: [1, 2, 3] -> []
- Everything the same: [1, 1, 1] -> [2, 3]
- Single element [1] -> []
- Empty array -> []
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n) time, O(n) space

```
Put the values in a Set, then loop 1..n and collect everything not in the Set.
(The true brute force, `includes` for each candidate, is O(n^2).)
```

### APPROACH 2 — Optimal (index as hash, negate to mark)   O(n) time, O(1) extra space

```
Value v "belongs" to index v - 1. Pass 1: for each value, negate the number sitting
at index |v| - 1 to mark "v was seen" (use abs because it may already be negated).
Pass 2: any index still holding a POSITIVE number was never marked, so index + 1 is
missing. We use the sign bit as a free boolean flag.

Dry run on [4, 3, 2, 7, 8, 2, 3, 1]:
  v=4 -> negate idx 3: [4, 3, 2,-7, 8, 2, 3, 1]
  v=3 -> negate idx 2: [4, 3,-2,-7, 8, 2, 3, 1]
  v=2 -> negate idx 1: [4,-3,-2,-7, 8, 2, 3, 1]
  v=7 -> negate idx 6: [4,-3,-2,-7, 8, 2,-3, 1]
  v=8 -> negate idx 7: [4,-3,-2,-7, 8, 2,-3,-1]
  v=2 -> idx 1 already negative, leave it
  v=3 -> idx 2 already negative, leave it
  v=1 -> negate idx 0: [-4,-3,-2,-7, 8, 2,-3,-1]
  positives at idx 4, 5 -> missing [5, 6]
```

### Edge cases

```
- Nothing missing: [1, 2, 3] -> []
- Everything the same: [1, 1, 1] -> [2, 3]
- Single element [1] -> []
- Empty array -> []
```

Full JavaScript solution with tests: [12_find_all_numbers_disappeared.js](../solutions/12_find_all_numbers_disappeared.js). Run it with `node 12_find_all_numbers_disappeared.js` from the solutions folder.

</details>

## Common mistakes

- Using `nums[i] - 1` as the index after it was already negated; always take `Math.abs(nums[i]) - 1`.
- Negating a slot twice (when a value repeats), which flips it back to positive; only negate if it is still positive.
- Forgetting the values are 1..n so the index is value - 1.

## Related follow-ups

- [Missing Number](11_missing_number.md) — exactly one number missing
- [First Missing Positive](../03_Hard/16_first_missing_positive.md) — the hardest index-as-hash problem
- Find All Duplicates in an Array (LeetCode #442) — the same negation trick, report seen-twice values

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
