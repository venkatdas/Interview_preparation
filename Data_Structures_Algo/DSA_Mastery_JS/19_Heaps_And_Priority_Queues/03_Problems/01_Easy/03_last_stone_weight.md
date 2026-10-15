# Last Stone Weight

| | |
|---|---|
| **Topic** | Heaps and Priority Queues |
| **Difficulty** | Easy |
| **Pattern** | max-heap simulation |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #1046 — https://leetcode.com/problems/last-stone-weight/ |
| **Solution file** | [03_last_stone_weight.js](../solutions/03_last_stone_weight.js) — open only after a real attempt |

## Problem

You have stones with positive weights. Each turn, take the two HEAVIEST
stones x <= y and smash them: if x === y both are destroyed, otherwise the
stone of weight y - x remains. Return the weight of the last stone, or 0 if
none remain.

## Examples

```
Input: [2,7,4,1,8,1]  Output: 1
  Explanation: 8&7 -> 1, [2,4,1,1,1]; 4&2 -> 2, [2,1,1,1]; 2&1 -> 1, [1,1,1];
               1&1 -> 0, [1]; answer 1
Input: [1]            Output: 1
```

## Constraints & clarifying questions

```
- Weights positive? (yes, 1..1000) Count? (<= 30, but do it well anyway)
- Empty input? (return 0)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *max-heap simulation* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n^2 log n) time, O(n) space. Every turn sort the array, pop the two largest, push the difference back.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (max-heap simulation)   O(n log n) time, O(n) space. "Repeatedly take the largest" is the signal for a max-heap.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- [] -> 0
- all equal pairs cancel to 0, e.g. [3,3] -> 0
- single stone -> itself
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^2 log n) time, O(n) space

```
Every turn sort the array, pop the two largest, push the difference back.
Up to n turns, each sorting -> n * n log n.
```

### APPROACH 2 — Optimal (max-heap simulation)   O(n log n) time, O(n) space

```
"Repeatedly take the largest" is the signal for a max-heap. Heapify once,
then while more than one stone: pop y, pop x, if y !== x push y - x.
Each turn costs O(log n) and removes at least one stone.

Dry run on [2,7,4,1,8,1]:
  heap(max) -> pop 8, pop 7, push 1   -> {4,2,1,1,1}
  pop 4, pop 2, push 2                -> {2,1,1,1}
  pop 2, pop 1, push 1                -> {1,1,1}
  pop 1, pop 1, equal, push nothing   -> {1}
  one left -> 1
```

### Edge cases

```
- [] -> 0
- all equal pairs cancel to 0, e.g. [3,3] -> 0
- single stone -> itself
```

Full JavaScript solution with tests: [03_last_stone_weight.js](../solutions/03_last_stone_weight.js). Run it with `node 03_last_stone_weight.js` from the solutions folder.

</details>

## Common mistakes

- Sorting the array again after every smash (O(n² log n)).
- Pushing a stone of weight 0 back into the heap.
- Returning `undefined` instead of 0 when no stones remain.

## Related follow-ups

- [Minimum Cost to Connect Sticks](../02_Medium/12_min_cost_connect_sticks.md)
- [Kth Largest Element in an Array](../02_Medium/01_kth_largest_element.md)
- Last Stone Weight II (LeetCode #1049)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
