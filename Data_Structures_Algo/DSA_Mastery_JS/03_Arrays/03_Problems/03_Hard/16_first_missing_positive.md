# First Missing Positive

| | |
|---|---|
| **Topic** | Arrays |
| **Difficulty** | Hard |
| **Pattern** | cyclic sort |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #41 — https://leetcode.com/problems/first-missing-positive/ |
| **Solution file** | [16_first_missing_positive.js](../solutions/16_first_missing_positive.js) — open only after a real attempt |

## Problem

Given an unsorted integer array (may contain negatives, zeros, duplicates and huge
values), return the smallest positive integer that is NOT present.
Required: O(n) time and O(1) extra space.

## Examples

```
Input: [1, 2, 0]          Output: 3
Input: [3, 4, -1, 1]      Output: 2
Input: [7, 8, 9, 11, 12]  Output: 1
```

## Constraints & clarifying questions

```
- Can I modify the input? (yes, otherwise O(1) space is impossible)
- Range of values? (any 32-bit int; only 1..n matter)
- Empty array -> 1
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *cyclic sort* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n) time, O(n) space. Put everything in a Set, then check 1, 2, 3, ...

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (cyclic sort)   O(n) time, O(1) extra space. Try to put each value v at index v - 1 ("its home").

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- [1] -> 2;  [2] -> 1;  [] -> 1
- Duplicates [1, 1] -> 2 (the duplicate check prevents an infinite swap loop)
- All values out of range -> 1
- Complete 1..n -> n + 1
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n) time, O(n) space

```
Put everything in a Set, then check 1, 2, 3, ... until one is missing.
(Sorting first would be O(n log n) time, O(1) space.)
```

### APPROACH 2 — Optimal (cyclic sort)   O(n) time, O(1) extra space

```
Try to put each value v at index v - 1 ("its home"). Walk with index i:
  - if nums[i] is in 1..n AND it is not already at home AND its home slot does not
    already hold the same value (duplicate) -> swap it home and look at the value that
    arrived at i (do not advance i)
  - otherwise advance i
Each swap puts one value in its final place, so there are at most n swaps -> O(n).
Then scan: the first index i with nums[i] !== i + 1 gives the answer i + 1. If all
match, answer n + 1.

Dry run on [3, 4, -1, 1]:
  i=0: 3 -> home idx 2, swap -> [-1, 4, 3, 1]
  i=0: -1 out of range -> i=1
  i=1: 4 -> home idx 3, swap -> [-1, 1, 3, 4]
  i=1: 1 -> home idx 0, swap -> [1, -1, 3, 4]
  i=1: -1 -> i=2
  i=2: 3 at home -> i=3
  i=3: 4 at home -> done
  scan: idx 0 ok (1), idx 1 holds -1 !== 2 -> answer 2
```

### KEY INSIGHT: with n elements the answer is always in 1..n+1. If 1..n are all present

```
the answer is n+1; otherwise some value in 1..n is missing. So values <= 0 or > n are
noise and can be ignored.
```

### Edge cases

```
- [1] -> 2;  [2] -> 1;  [] -> 1
- Duplicates [1, 1] -> 2 (the duplicate check prevents an infinite swap loop)
- All values out of range -> 1
- Complete 1..n -> n + 1
```

Full JavaScript solution with tests: [16_first_missing_positive.js](../solutions/16_first_missing_positive.js). Run it with `node 16_first_missing_positive.js` from the solutions folder.

</details>

## Common mistakes

- Using `if` instead of `while` when placing values; after one swap, the new value at i also needs placing.
- Infinite loop on duplicates: check `nums[nums[i] - 1] !== nums[i]` before swapping, not `i !== nums[i] - 1`.
- Forgetting that the answer can be n + 1 when 1..n are all present.

## Related follow-ups

- [Find All Numbers Disappeared in an Array](../01_Easy/12_find_all_numbers_disappeared.md) — the easier index-as-hash cousin
- [Missing Number](../01_Easy/11_missing_number.md) — exactly one missing from 0..n
- [Find the Duplicate Number](../02_Medium/18_find_the_duplicate_number.md) — values as pointers

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
