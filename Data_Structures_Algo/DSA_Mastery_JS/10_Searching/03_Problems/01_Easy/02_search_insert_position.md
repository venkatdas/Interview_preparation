# Search Insert Position

| | |
|---|---|
| **Topic** | Searching (Linear and Binary Search) |
| **Difficulty** | Easy |
| **Pattern** | lower bound |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #35 — https://leetcode.com/problems/search-insert-position/ |
| **Solution file** | [02_search_insert_position.js](../solutions/02_search_insert_position.js) — open only after a real attempt |

## Problem

Given a sorted array of distinct integers and a target, return the index if the
target is found. If not, return the index where it would be inserted to keep the
array sorted. O(log n) required.

## Examples

```
Input: [1,3,5,6], 5   Output: 2
Input: [1,3,5,6], 2   Output: 1
Input: [1,3,5,6], 7   Output: 4   (append at the end)
Input: [1,3,5,6], 0   Output: 0
```

## Constraints & clarifying questions

```
- Distinct values? (yes; with duplicates "lower bound" = insert before the equal run)
- Can the answer be n (past the end)? (yes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *lower bound* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n) time. Scan from the left; return the first index whose value is >= target, or n.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (lower bound, Template 2)   O(log n) time, O(1) space. This IS lowerBound: the first index i with nums[i] >= target.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- [] -> 0
- target smaller than all -> 0; larger than all -> n
- exact match returns its index
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n) time

```
Scan from the left; return the first index whose value is >= target, or n.
```

### APPROACH 2 — Optimal (lower bound, Template 2)   O(log n) time, O(1) space

```
This IS lowerBound: the first index i with nums[i] >= target. Use the half-open
range [left, right) with right = n so n is a valid answer. If nums[mid] < target
the answer is right of mid; otherwise mid could be the answer, so keep it (right = mid).

Dry run [1,3,5,6], target 2:
  left=0 right=4 mid=2 nums[2]=5 >= 2 -> right=2
  left=0 right=2 mid=1 nums[1]=3 >= 2 -> right=1
  left=0 right=1 mid=0 nums[0]=1 < 2  -> left=1
  left === right === 1 -> return 1
```

### Edge cases

```
- [] -> 0
- target smaller than all -> 0; larger than all -> n
- exact match returns its index
```

Full JavaScript solution with tests: [02_search_insert_position.js](../solutions/02_search_insert_position.js). Run it with `node 02_search_insert_position.js` from the solutions folder.

</details>

## Common mistakes

- Returning -1 when the target is missing; the answer is where it would go.
- Forgetting the case where the target is larger than every element (answer n).
- Using `hi = n - 1` with the half-open template, which makes n unreachable.

## Related follow-ups

- [Binary Search](01_binary_search.md) — exact match only
- [First Bad Version](03_first_bad_version.md) — the same lower-bound shape on a predicate
- [Find First and Last Position of Element in Sorted Array](../02_Medium/04_first_and_last_position.md) — lower and upper bound

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
