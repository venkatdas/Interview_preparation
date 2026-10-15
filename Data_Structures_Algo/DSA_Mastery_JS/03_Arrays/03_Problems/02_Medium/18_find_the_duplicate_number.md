# Find the Duplicate Number

| | |
|---|---|
| **Topic** | Arrays |
| **Difficulty** | Medium |
| **Pattern** | Floyd cycle detection |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #287 — https://leetcode.com/problems/find-the-duplicate-number/ |
| **Solution file** | [18_find_the_duplicate_number.js](../solutions/18_find_the_duplicate_number.js) — open only after a real attempt |

## Problem

Given an array of n + 1 integers where each value is in the range [1, n], there is
exactly one value that repeats (it may repeat more than once). Return it.
Constraints: do NOT modify the array, use O(1) extra space.

## Examples

```
Input: [1, 3, 4, 2, 2]      Output: 2
Input: [3, 1, 3, 4, 2]      Output: 3
Input: [3, 3, 3, 3, 3]      Output: 3
```

## Constraints & clarifying questions

```
- Exactly one duplicated value? (yes, possibly repeated many times)
- Values strictly in 1..n with length n + 1? (yes - so index 0 is never pointed to)
- Can I modify the array or use extra memory? (no / no - that rules out negation marking and a Set)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *Floyd cycle detection* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n^2) time, O(1) space. Compare every pair of indices and return the first equal pair's value.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Floyd's cycle detection / tortoise and hare)   O(n) time, O(1) space. Treat each index as a node that points to nums[index].

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- Duplicate repeated more than twice: [3, 3, 3, 3, 3] -> 3
- Two elements [1, 1] -> 1
- Duplicate is n (the largest value) or 1 (the smallest)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^2) time, O(1) space

```
Compare every pair of indices and return the first equal pair's value.
(A Set gives O(n) time but O(n) space; sorting modifies the input.)
```

### APPROACH 2 — Optimal (Floyd's cycle detection / tortoise and hare)   O(n) time, O(1) space

```
Treat each index as a node that points to nums[index]. Starting from 0 we get a path
0 -> nums[0] -> nums[nums[0]] -> ... Since values are in 1..n and there are n + 1
slots, two indices point to the same node (the duplicate), which is exactly a cycle
entrance in a linked list. This is "Linked List Cycle II" (15_Linked_Lists) in disguise.
  Phase 1: slow moves 1 step, fast moves 2 steps, until they meet inside the cycle.
  Phase 2: reset slow to 0, move both 1 step; where they meet is the cycle entrance
           = the duplicate value.

Dry run on [1, 3, 4, 2, 2]:  (index -> value: 0->1, 1->3, 2->4, 3->2, 4->2)
  path from 0: 0 -> 1 -> 3 -> 2 -> 4 -> 2 -> 4 ...   (cycle is 2 <-> 4, entrance is 2)
  phase 1: slow = nums[0] = 1, fast = nums[nums[0]] = 3
           slow = nums[1] = 3, fast = nums[nums[3]] = nums[2] = 4
           slow = nums[3] = 2, fast = nums[nums[4]] = nums[2] = 4
           slow = nums[2] = 4, fast = nums[nums[4]] = 4      -> meet at 4
  phase 2: fromStart = 0, fromMeeting = 4
           fromStart = nums[0] = 1, fromMeeting = nums[4] = 2
           fromStart = nums[1] = 3, fromMeeting = nums[2] = 4
           fromStart = nums[3] = 2, fromMeeting = nums[4] = 2  -> meet at 2 -> answer 2
```

### Edge cases

```
- Duplicate repeated more than twice: [3, 3, 3, 3, 3] -> 3
- Two elements [1, 1] -> 1
- Duplicate is n (the largest value) or 1 (the smallest)
```

Full JavaScript solution with tests: [18_find_the_duplicate_number.js](../solutions/18_find_the_duplicate_number.js). Run it with `node 18_find_the_duplicate_number.js` from the solutions folder.

</details>

## Common mistakes

- Sorting or marking the array, which breaks the "do not modify the array" constraint.
- In Floyd phase 2, restarting *both* pointers at the start; only one restarts, the other stays at the meeting point.
- Starting slow and fast at index 0 and comparing before the first move, which exits immediately.

## Related follow-ups

- [Linked List Cycle II](../../../15_Linked_Lists/03_Problems/02_Medium/04_linked_list_cycle_ii.md) — the same Floyd cycle-start proof
- [Happy Number](../../../00_Foundations/04_Mathematics_For_DSA/03_Problems/01_Easy/05_happy_number.md) — cycle detection on a number sequence
- [Find the Duplicate Number (Bit Manipulation)](../../../14_Bit_Manipulation/03_Problems/02_Medium/16_find_the_duplicate_number.md) — a bit-counting alternative

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
