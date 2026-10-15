# Contains Duplicate

| | |
|---|---|
| **Topic** | Arrays |
| **Difficulty** | Easy |
| **Pattern** | set |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #217 — https://leetcode.com/problems/contains-duplicate/ |
| **Solution file** | [03_contains_duplicate.js](../solutions/03_contains_duplicate.js) — open only after a real attempt |

## Problem

Given an integer array, return true if any value appears at least twice,
and false if every element is distinct.

## Examples

```
Input: [1, 2, 3, 1]              Output: true
Input: [1, 2, 3, 4]              Output: false
Input: [1, 1, 1, 3, 3, 4, 3, 2]  Output: true
```

## Constraints & clarifying questions

```
- Can the array be empty? (yes -> false)
- Are the values integers only? (yes; with floats/NaN a Set still works except NaN === NaN is handled by Set)
- Can I sort the input (modify it)? (ask; sorting gives O(n log n) time, O(1) extra space)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *set* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n^2) time, O(1) space. Compare every pair.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Set)   O(n) time, O(n) space. Walk the array once.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- Empty array -> false
- Single element -> false
- Duplicate at the two ends
- Negative numbers
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^2) time, O(1) space

```
Compare every pair. Return true the moment two equal values are found.
```

### APPROACH 2 — Optimal (Set)   O(n) time, O(n) space

```
Walk the array once. Keep a Set of values seen so far. If the current value is
already in the Set, we found a duplicate. Set.has and Set.add are O(1) average.
(Alternative: sort, then check neighbours - O(n log n) time, O(1) extra space.)

Dry run on [1, 2, 3, 1]:
  1 -> not seen, add    {1}
  2 -> not seen, add    {1, 2}
  3 -> not seen, add    {1, 2, 3}
  1 -> seen!            return true
```

### Edge cases

```
- Empty array -> false
- Single element -> false
- Duplicate at the two ends
- Negative numbers
```

Full JavaScript solution with tests: [03_contains_duplicate.js](../solutions/03_contains_duplicate.js). Run it with `node 03_contains_duplicate.js` from the solutions folder.

</details>

## Common mistakes

- Using a nested loop (O(n^2)) when one pass with a `Set` is enough.
- Using a plain object as a set: keys become strings, so it still works for numbers but is slower and surprising for mixed types.
- Comparing `new Set(nums).size` to `nums.length` is correct, but forgetting it always scans the whole array even when a duplicate appears early.

## Related follow-ups

- [Contains Duplicate II](../../../05_Hashing/03_Problems/01_Easy/02_contains_duplicate_ii.md) — duplicates within distance k, a sliding set
- [Find the Duplicate Number](../02_Medium/18_find_the_duplicate_number.md) — same question with O(1) extra space
- Contains Duplicate III (LeetCode #220) — values within t and indices within k, bucketing

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
