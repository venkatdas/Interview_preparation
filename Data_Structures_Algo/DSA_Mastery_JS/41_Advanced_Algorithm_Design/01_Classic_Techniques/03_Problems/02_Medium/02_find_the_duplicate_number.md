# Find the Duplicate Number

| | |
|---|---|
| **Topic** | Classic Techniques (Kadane, Boyer-Moore, Floyd, Reservoir, Binary Lifting, Sqrt Decomposition) |
| **Difficulty** | Medium |
| **Pattern** | Floyd on an array (+ binary search on value) |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #287 — https://leetcode.com/problems/find-the-duplicate-number/ |
| **Solution file** | [02_find_the_duplicate_number.js](../solutions/02_find_the_duplicate_number.js) — open only after a real attempt |

## Problem

nums has n + 1 integers, each in the range [1, n]. Exactly one value is repeated (it may
appear more than twice). Find it WITHOUT modifying the array and using O(1) extra space.

## Examples

```
Input: [1,3,4,2,2]   Output: 2
Input: [3,1,3,4,2]   Output: 3
Input: [3,3,3,3,3]   Output: 3
```

## Constraints & clarifying questions

```
- Can we sort / modify? (no) Extra space? (O(1)) -> rules out Set and sorting
- Exactly one duplicated value (but possibly many copies)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *Floyd on an array (+ binary search on value)* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n^2) time, O(1) space. Compare every pair.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Floyd's tortoise and hare)   O(n) time, O(1) space. View index i as a node with an edge i -> nums[i].

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- duplicate appears many times
- n = 1: [1,1] -> 1
- duplicate is the largest or smallest value
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^2) time, O(1) space

```
Compare every pair. (A sort or a Set would be O(n log n) / O(n) space - not allowed.)
Also possible: binary search on the VALUE - count how many elements are <= mid; if more
than mid, the duplicate is in [1, mid]. O(n log n), O(1) space.
```

### APPROACH 2 — Optimal (Floyd's tortoise and hare)   O(n) time, O(1) space

```
View index i as a node with an edge i -> nums[i]. Index 0 is never a target (values are
>= 1), so starting at 0 we walk into a rho-shaped path: a tail, then a cycle. The node
where the tail enters the cycle is pointed to by two indices = the duplicate value.
Phase 1: slow += 1 step, fast += 2 steps until they meet (inside the cycle).
Phase 2: reset slow to the start; move both one step at a time; they meet at the entrance.

Dry run on [1,3,4,2,2]  (walk on VALUES: next(x) = nums[x], start at nums[0] = 1):
  path: 1 -> 3 -> 2 -> 4 -> 2 -> 4 -> ...      (tail 1, 3; cycle 2 <-> 4; entrance 2)
  phase 1 (slow x1, fast x2), both start at 1:
    slow = 3, fast = 2;   slow = 2, fast = 2  -> meet at 2
  phase 2 (both x1), slow restarts at nums[0] = 1, fast stays at 2:
    slow = 3, fast = 4;   slow = 2, fast = 2  -> meet at 2 = the duplicate
```

### Edge cases

```
- duplicate appears many times
- n = 1: [1,1] -> 1
- duplicate is the largest or smallest value
```

Full JavaScript solution with tests: [02_find_the_duplicate_number.js](../solutions/02_find_the_duplicate_number.js). Run it with `node 02_find_the_duplicate_number.js` from the solutions folder.

</details>

## Common mistakes

- Sorting or marking the array; the problem forbids modifying it.
- Starting phase 2 from the meeting point for both pointers; one pointer must restart from `nums[0]` (the list head).
- Returning the meeting point of phase 1, which is inside the cycle but not necessarily its entrance.

## Related follow-ups

- Linked List Cycle II (LeetCode #142)
- [Majority Element II](01_majority_element_ii.md)
- First Missing Positive (LeetCode #41)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
