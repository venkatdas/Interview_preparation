# Intersection of Two Arrays

| | |
|---|---|
| **Topic** | Hashing (Hash Maps and Sets) |
| **Difficulty** | Easy |
| **Pattern** | seen-set |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #349 — https://leetcode.com/problems/intersection-of-two-arrays/ |
| **Solution file** | [07_intersection_of_two_arrays.js](../solutions/07_intersection_of_two_arrays.js) — open only after a real attempt |

## Problem

Given two integer arrays nums1 and nums2, return an array of their intersection.
Each element in the result must be unique. Order does not matter.

## Examples

```
Input: nums1 = [1, 2, 2, 1], nums2 = [2, 2]         Output: [2]
Input: nums1 = [4, 9, 5], nums2 = [9, 4, 9, 8, 4]   Output: [9, 4]   (or [4, 9])
```

## Constraints & clarifying questions

```
- Unique results, or with duplicates (that's LeetCode 350, Intersection II)? (unique)
- Does order of output matter? (no -> we sort in tests to compare)
- Are the arrays sorted? (no; if yes, two pointers would use O(1) extra space)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *seen-set* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n * m) time, O(1) extra space. For each element of nums1, scan nums2 for it, and also scan the result to avoid adding duplicates.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (seen-set)   O(n + m) time, O(n) space. 1.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- No overlap -> []
- One array empty -> []
- Duplicates on both sides must appear once
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n * m) time, O(1) extra space

```
For each element of nums1, scan nums2 for it, and also scan the result to avoid
adding duplicates.
```

### APPROACH 2 — Optimal (seen-set)   O(n + m) time, O(n) space

```
1. Put every element of nums1 into a Set (removes duplicates for free).
  2. Walk nums2. If the set has the value, add it to the result and DELETE it from
     the set so it can't be added twice.

Dry run on [1,2,2,1] and [2,2]:
  set = {1, 2}
  2 -> in set -> result [2], set {1}
  2 -> not in set -> skip
  result [2]
```

### Edge cases

```
- No overlap -> []
- One array empty -> []
- Duplicates on both sides must appear once
```

Full JavaScript solution with tests: [07_intersection_of_two_arrays.js](../solutions/07_intersection_of_two_arrays.js). Run it with `node 07_intersection_of_two_arrays.js` from the solutions folder.

</details>

## Common mistakes

- Returning duplicates in the output; each common value appears once.
- Using `arr.includes` inside a loop, giving O(n·m).
- Confusing this with Intersection of Two Arrays II, which keeps multiplicities.

## Related follow-ups

- Intersection of Two Arrays II (LeetCode #350) — keep counts, use a frequency map
- [Merge Sorted Array](../../../06_Two_Pointers/03_Problems/01_Easy/08_merge_sorted_array.md) — two pointers over sorted inputs
- [Interval List Intersections](../../../31_Intervals/03_Problems/02_Medium/05_interval_list_intersections.md) — intersection of ranges

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
