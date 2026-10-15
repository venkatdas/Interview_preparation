# Minimum Cost to Connect Sticks

| | |
|---|---|
| **Topic** | Heaps and Priority Queues |
| **Difficulty** | Medium |
| **Pattern** | Huffman-style greedy |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #1167 — https://leetcode.com/problems/minimum-cost-to-connect-sticks/ |
| **Solution file** | [12_min_cost_connect_sticks.js](../solutions/12_min_cost_connect_sticks.js) — open only after a real attempt |

## Problem

You have sticks with given lengths. Connecting two sticks of lengths x and y
costs x + y and produces one stick of length x + y. Connect all sticks into
one; return the minimum total cost.

## Examples

```
Input: [2,4,3]       Output: 14   Explanation: 2+3=5 (cost 5), 5+4=9 (cost 9), total 14
Input: [1,8,3,5]     Output: 30   Explanation: 1+3=4, 4+5=9, 9+8=17 -> 4+9+17 = 30
Input: [5]           Output: 0
```

## Constraints & clarifying questions

```
- Single stick -> 0 (nothing to connect). Empty -> 0.
- Why not just sort once? (the merged stick's length changes the order)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *Huffman-style greedy* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (re-sort each step)   O(n^2 log n) time, O(n) space. Each step: sort, take the two smallest, push their sum back.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (min-heap, Huffman-style greedy)   O(n log n) time, O(n) space. A stick joined early gets counted in every later merge, so the SMALLEST sticks should be merged first and the biggest as late as possible.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- [] or [x] -> 0
- two sticks -> their sum
- many equal sticks
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (re-sort each step)   O(n^2 log n) time, O(n) space

```
Each step: sort, take the two smallest, push their sum back. The greedy
choice is the same as the optimal; only the data structure is slow.
```

### APPROACH 2 — Optimal (min-heap, Huffman-style greedy)   O(n log n) time, O(n) space

```
A stick joined early gets counted in every later merge, so the SMALLEST
sticks should be merged first and the biggest as late as possible. That is
exactly Huffman coding. Heapify all sticks; while more than one: pop two
smallest, add their sum to the cost, push the sum.

Dry run on [1,8,3,5]:
  heap {1,3,5,8}: pop 1,3 -> cost 4,  push 4   -> {4,5,8}
  pop 4,5 -> cost 4+9 = 13, push 9           -> {8,9}
  pop 8,9 -> cost 13+17 = 30, push 17        -> {17}
  one left -> 30
```

### Edge cases

```
- [] or [x] -> 0
- two sticks -> their sum
- many equal sticks
```

Full JavaScript solution with tests: [12_min_cost_connect_sticks.js](../solutions/12_min_cost_connect_sticks.js). Run it with `node 12_min_cost_connect_sticks.js` from the solutions folder.

</details>

## Common mistakes

- Sorting once and merging left to right: merged sticks must be re-inserted in order.
- Adding only the final stick length instead of the cost of every merge.
- Not returning 0 for one stick.

## Related follow-ups

- [Last Stone Weight](../01_Easy/03_last_stone_weight.md)
- Huffman coding (classic greedy)
- Minimum Cost to Merge Stones (LeetCode #1000)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
