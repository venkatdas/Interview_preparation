# Merge k Sorted Lists

| | |
|---|---|
| **Topic** | Divide and Conquer |
| **Difficulty** | Hard |
| **Pattern** | pairwise merge, N log k |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #23 — https://leetcode.com/problems/merge-k-sorted-lists/ |
| **Solution file** | [04_merge_k_sorted_lists.js](../solutions/04_merge_k_sorted_lists.js) — open only after a real attempt |

## Problem

You are given k linked lists, each sorted ascending. Merge them into one sorted list.

## Examples

```
Input: [[1,4,5],[1,3,4],[2,6]]   Output: [1,1,2,3,4,4,5,6]
Input: []                        Output: []
Input: [[]]                      Output: []
```

## Constraints & clarifying questions

```
- k up to 10^4, total nodes N up to 10^4 * 500
- Lists may be empty
- Can we reuse the nodes? (yes, relink them; no new nodes needed)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *pairwise merge, N log k* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(N log N) time, O(N) space. Collect every value into an array, sort, rebuild a list.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Divide & conquer pairwise merge)   O(N log k) time, O(log k) stack. Merge lists [0..k/2) and [k/2..k) recursively, then merge the two results with the standard two-list merge.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- k = 0 -> null
- all lists empty -> null
- one list -> itself
- duplicates across lists
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(N log N) time, O(N) space

```
Collect every value into an array, sort, rebuild a list. Simple and often accepted, but
it ignores that the inputs are already sorted.
(Another naive option: merge list 1 with list 2, then with list 3, ... = O(N * k).)
```

### APPROACH 2 — Optimal (Divide & conquer pairwise merge)   O(N log k) time, O(log k) stack

```
Merge lists [0..k/2) and [k/2..k) recursively, then merge the two results with the
standard two-list merge. Each recursion level merges every node once -> O(N) per level,
and there are log k levels.
(Equivalent alternative: a min-heap of k heads, also O(N log k), see ../../../19_Heaps_And_Priority_Queues/.)

Dry run on [[1,4,5],[1,3,4],[2,6]]:
  split -> [[1,4,5]] and [[1,3,4],[2,6]]
  right splits -> [1,3,4] and [2,6] -> merge -> [1,2,3,4,6]
  top merge [1,4,5] with [1,2,3,4,6] -> [1,1,2,3,4,4,5,6]
```

### Edge cases

```
- k = 0 -> null
- all lists empty -> null
- one list -> itself
- duplicates across lists
```

Full JavaScript solution with tests: [04_merge_k_sorted_lists.js](../solutions/04_merge_k_sorted_lists.js). Run it with `node 04_merge_k_sorted_lists.js` from the solutions folder.

</details>

## Common mistakes

- Merging list 1 with list 2, then the result with list 3, and so on - that is O(N k), not O(N log k).
- Not handling empty lists / an empty `lists` array.
- Losing nodes by not attaching the remaining tail after one list runs out.

## Related follow-ups

- Merge Two Sorted Lists (LeetCode #21)
- Kth Smallest Element in a Sorted Matrix (LeetCode #378)
- [Heaps and Priority Queues](../../../19_Heaps_And_Priority_Queues/README.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
