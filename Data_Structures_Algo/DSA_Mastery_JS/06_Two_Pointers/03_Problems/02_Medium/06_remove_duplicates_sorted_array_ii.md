# Remove Duplicates from Sorted Array II

| | |
|---|---|
| **Topic** | Two Pointers |
| **Difficulty** | Medium |
| **Pattern** | read / write (look back k) |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #80 — https://leetcode.com/problems/remove-duplicates-from-sorted-array-ii/ |
| **Solution file** | [06_remove_duplicates_sorted_array_ii.js](../solutions/06_remove_duplicates_sorted_array_ii.js) — open only after a real attempt |

## Problem

Given a sorted array, remove duplicates in place so that each value appears AT MOST
TWICE. Keep the relative order. Return the new length k.

## Examples

```
Input: [1, 1, 1, 2, 2, 3]            Output: 5, nums = [1, 1, 2, 2, 3, _]
Input: [0, 0, 1, 1, 1, 1, 2, 3, 3]   Output: 7, nums = [0, 0, 1, 1, 2, 3, 3, _, _]
```

## Constraints & clarifying questions

```
- Sorted? (yes -> all copies of a value are adjacent, which is what makes this O(n))
- At most 2, or at most k in general? (solve for general k, it's the same code)
- In place, O(1) extra space? (yes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *read / write (look back k)* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n) time, O(n) space. Walk the array keeping a count of the current value; push to a new array while the count &lt;= 2.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (read / write, look back k)   O(n) time, O(1) space. The first k elements are always kept.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- length <= k -> nothing to remove
- all elements identical -> k
- no duplicates -> n unchanged
- negative values (sorted order still holds)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n) time, O(n) space

```
Walk the array keeping a count of the current value; push to a new array while the
count <= 2. Then copy back.
```

### APPROACH 2 — Optimal (read / write, look back k)   O(n) time, O(1) space

```
The first k elements are always kept. After that, nums[read] is allowed into the
output only if it differs from nums[write - k]: if it's equal, then the output already
ends with k copies of that value (the array is sorted, so everything between write - k
and write - 1 is that same value too).

Dry run on [1, 1, 1, 2, 2, 3], k = 2:
  write=2 (first two kept)           [1, 1, 1, 2, 2, 3]
  read=2 1  nums[write-2]=1 == 1 skip
  read=3 2  nums[0]=1 != 2  nums[2]=2 write=3   [1, 1, 2, 2, 2, 3]
  read=4 2  nums[1]=1 != 2  nums[3]=2 write=4   [1, 1, 2, 2, 2, 3]
  read=5 3  nums[2]=2 != 3  nums[4]=3 write=5   [1, 1, 2, 2, 3, 3]
  return 5
```

### Edge cases

```
- length <= k -> nothing to remove
- all elements identical -> k
- no duplicates -> n unchanged
- negative values (sorted order still holds)
```

Full JavaScript solution with tests: [06_remove_duplicates_sorted_array_ii.js](../solutions/06_remove_duplicates_sorted_array_ii.js). Run it with `node 06_remove_duplicates_sorted_array_ii.js` from the solutions folder.

</details>

## Common mistakes

- Comparing with `nums[i - 1]` or `nums[i - 2]` (the read side) instead of `nums[k - 2]` (the write side).
- Hard-coding special cases for the first two elements instead of starting k at 2.
- Returning the array instead of k.

## Related follow-ups

- [Remove Duplicates from Sorted Array](../../../03_Arrays/03_Problems/01_Easy/06_remove_duplicates_from_sorted_array.md) — at most once
- [Remove Element](../01_Easy/04_remove_element.md) — the base write-pointer pattern
- [String Compression](../../../04_Strings/03_Problems/02_Medium/11_string_compression.md) — compacting runs in place

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
