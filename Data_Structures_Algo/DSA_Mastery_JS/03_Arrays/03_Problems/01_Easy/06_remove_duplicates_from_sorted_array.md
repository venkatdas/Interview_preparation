# Remove Duplicates from Sorted Array

| | |
|---|---|
| **Topic** | Arrays |
| **Difficulty** | Easy |
| **Pattern** | write pointer |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #26 — https://leetcode.com/problems/remove-duplicates-from-sorted-array/ |
| **Solution file** | [06_remove_duplicates_from_sorted_array.js](../solutions/06_remove_duplicates_from_sorted_array.js) — open only after a real attempt |

## Problem

Given a SORTED integer array, remove the duplicates in place so that each value
appears once. Return k, the number of unique elements. The first k slots of the
array must hold the unique values in order; what comes after does not matter.

## Examples

```
Input: [1, 1, 2]                   Output: 2, nums = [1, 2, _]
Input: [0, 0, 1, 1, 1, 2, 2, 3, 3, 4]   Output: 5, nums = [0, 1, 2, 3, 4, _, _, _, _, _]
```

## Constraints & clarifying questions

```
- Is the array guaranteed sorted? (yes - duplicates are always adjacent, that is the key)
- O(1) extra space? (yes)
- What should be after index k? (anything)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *write pointer* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n) time, O(n) space. Build a Set (or a new array skipping equal neighbours), copy it back, return its size.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (write pointer)   O(n) time, O(1) space. `writeIndex` points to the last unique value kept.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- Empty array -> 0
- Single element -> 1
- All identical -> 1
- No duplicates -> n
- Negative numbers (sorted order still holds)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n) time, O(n) space

```
Build a Set (or a new array skipping equal neighbours), copy it back, return its size.
Works but ignores the "in place" requirement.
```

### APPROACH 2 — Optimal (write pointer)   O(n) time, O(1) space

```
`writeIndex` points to the last unique value kept. Scan with `readIndex` from 1.
If nums[readIndex] differs from nums[writeIndex], it is a new unique value:
advance writeIndex and copy it there. Because the array is sorted, "differs from
the last kept" is the same as "never seen before".

Dry run on [0, 0, 1, 1, 2]:
  write=0
  read 1: 0 === nums[0]=0   skip
  read 2: 1 !== 0 -> write=1, nums[1]=1  -> [0,1,1,1,2]
  read 3: 1 === nums[1]=1   skip
  read 4: 2 !== 1 -> write=2, nums[2]=2  -> [0,1,2,1,2]
  return write + 1 = 3
```

### Edge cases

```
- Empty array -> 0
- Single element -> 1
- All identical -> 1
- No duplicates -> n
- Negative numbers (sorted order still holds)
```

Full JavaScript solution with tests: [06_remove_duplicates_from_sorted_array.js](../solutions/06_remove_duplicates_from_sorted_array.js). Run it with `node 06_remove_duplicates_from_sorted_array.js` from the solutions folder.

</details>

## Common mistakes

- Returning the modified array instead of the count k of unique elements.
- Comparing `nums[i]` with `nums[i - 1]` after overwriting, instead of with the last *written* value `nums[k - 1]`.
- Not handling the empty array (k should be 0).

## Related follow-ups

- [Remove Duplicates from Sorted Array II](../../../06_Two_Pointers/03_Problems/02_Medium/06_remove_duplicates_sorted_array_ii.md) — allow each value at most twice
- [Remove Element](../../../06_Two_Pointers/03_Problems/01_Easy/04_remove_element.md) — same write-pointer idea
- [Move Zeroes](05_move_zeroes.md) — compaction with order preserved

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
