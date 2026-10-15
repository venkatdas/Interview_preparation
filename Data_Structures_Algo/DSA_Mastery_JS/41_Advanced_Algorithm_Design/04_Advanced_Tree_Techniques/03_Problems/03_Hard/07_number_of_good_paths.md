# Number of Good Paths

| | |
|---|---|
| **Topic** | Advanced Tree Techniques |
| **Difficulty** | Hard |
| **Pattern** | sort by value + union-find on a tree |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md), [Union-Find](../../../../27_Union_Find_Disjoint_Set/01_Union_Find_Basics/README.md) |
| **Source** | LeetCode #2421 — https://leetcode.com/problems/number-of-good-paths/ (statement paraphrased, not copied) |
| **Solution file** | [07_number_of_good_paths.js](../solutions/07_number_of_good_paths.js) — open only after a real attempt |

## Problem

A tree has n nodes 0..n-1 and node i has value `vals[i]`. A good path is a simple path whose
two end nodes have the same value and where no node on the path has a larger value than the
ends. A single node is a good path, and a path and its reverse count once. Return the number
of good paths.

## Examples

```
Input: vals = [1,3,2,1,3], edges = [[0,1],[0,2],[2,3],[2,4]]   Output: 6
  (5 single nodes + path 1-0-2-4 with values 3,1,2,3)
Input: vals = [1,1,2,2,3], edges = [[0,1],[1,2],[2,3],[2,4]]   Output: 7
Input: vals = [1], edges = []                                  Output: 1
```

## Constraints & clarifying questions

```
- n up to 3 * 10^4, values up to 10^5.
- Single nodes count? (yes)
- Answer can exceed 2^31? (up to n(n+1)/2 ~ 4.5 * 10^8 - fine in JS numbers)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** "No node larger than X on the path" -> only nodes with value <= X matter. Process values in increasing order and *connect as you go* (union-find). Pattern G in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** For every pair with equal values, find the path (BFS parents) and check its maximum: about O(n^3).

</details>

<details><summary>Hint 3</summary>

**The key idea.** Sort edges by max(vals[a], vals[b]). Before handling value x, union all edges with max <= x. Two value-x nodes now share a component exactly when a good path joins them. A component with c nodes of value x gives c(c+1)/2 paths.

</details>

<details><summary>Hint 4</summary>

**Edge cases.** Group all nodes of the same value together (count per component root with a Map). All-equal values -> n(n+1)/2.

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^3) worst case

All pairs with equal values; walk the path and check the maximum.

### APPROACH 2 — Optimal (sort + union-find)   O(n log n) time, O(n) space

```
for each value x in increasing order:
  union edges whose max endpoint value <= x
  count nodes of value x per component root: add c*(c+1)/2

Dry run on example 1:
  edge keys: [0,2]=2, [2,3]=2, [0,1]=3, [2,4]=3
  x=1: nodes 0 and 3, separate comps -> 2
  x=2: union 0-2, 2-3; node 2 alone -> 3
  x=3: union 0-1, 2-4; nodes 1, 4 together (c=2) -> +3 -> 6
```

### Edge cases

```
- n = 1 -> 1
- all equal values -> n(n+1)/2
- strictly increasing path -> n
```

### Common mistakes

- Unioning edges by min value instead of max value.
- Counting pairs before adding all edges allowed for the current value.
- Counting nodes of value x with the root computed BEFORE the unions finish.

Full JavaScript solution with tests: [07_number_of_good_paths.js](../solutions/07_number_of_good_paths.js).

</details>

## Related follow-ups

- Checking Existence of Edge Length Limited Paths (LeetCode #1697) - offline sort + union-find
- Path With Maximum Minimum Value (LeetCode #1102)
- Count pairs at distance <= k (centroid decomposition, see concepts 5.5)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
