# Divisible Downward Paths

| | |
|---|---|
| **Set** | [Mixed Set 04](README.md) — problem 01 of 5 |
| **Difficulty** | Medium |
| **Time box** | 25 minutes (then open Hint 1) |
| **Source** | Original exercise |
| **Solution file** | [01_divisible_downward_paths.js](solutions/01_divisible_downward_paths.js) — open only after a real attempt |

> The topic is hidden on purpose. Part of the skill being trained is recognizing the pattern on your own.

## Problem

A binary tree (given as a level-order array with null for missing children) stores an
integer in each node. A "downward path" starts at any node and goes down through
children only, ending at that node or any descendant (a single node is a path).
Return how many downward paths have a sum divisible by k (k >= 1).

## Examples

```
Input: tree = [1, 2, 3], k = 3     Output: 2   Explanation: [3] and [1,2]
Input: tree = [4, -4, 2], k = 2    Output: 5   Explanation: [4],[−4],[2],[4,−4],[4,2]
Input: tree = [], k = 5            Output: 0
```

## Constraints & clarifying questions

```
- Up to 10^4 nodes; values may be negative.
- Is 0 divisible by k? (yes)
- The tree can be a long chain (depth up to n).
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 25 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1 — which patterns?</summary>

**Pattern.** DFS with backtracking + prefix sums modulo k in a hash map. See [Binary Trees](../../../20_Trees/01_Binary_Trees/README.md), [Prefix Sums & Difference Arrays](../../../08_Prefix_Sums_And_Difference_Arrays/README.md) and [Hashing](../../../05_Hashing/README.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** From every node, walk every downward path and count sums divisible by k.

</details>

<details><summary>Hint 3</summary>

**The key idea.** Two prefixes on the same root-to-node chain with equal remainders mod k bound a divisible path. Keep remainder counts for the current chain only (add on entry, remove on exit).

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- empty tree -> 0
- k = 1 -> every path counts: sum over nodes of depth (1-based)
- negative values -> normalise the modulo
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n * h) time (O(n^2) on a chain), O(h) space

```
From every node, walk down every descendant path, keeping a running sum, and count
sums divisible by k.
```

### APPROACH 2 — Optimal (DFS + prefix sums mod k in a hash map, with backtracking)   O(n) time, O(n) space

```
Let P = sum from the root down to the current node. A downward path ending here starts
just below some ancestor A with prefix Q, and its sum P - Q is divisible by k iff
P mod k === Q mod k. Keep counts of "prefix mod k" for the CURRENT root-to-node chain
(seed {0: 1} for the empty prefix). At each node add counts[P mod k], then increment
counts[P mod k], recurse, and decrement on the way back (backtracking keeps only
ancestors in the map).

Dry run on [1, 2, 3], k = 3:
  counts {0:1}
  node 1: P=1 mod 1 -> +0          counts {0:1, 1:1}
    node 2: P=3 mod 0 -> +1 ([1,2]) counts {0:2, 1:1}, then undo -> {0:1, 1:1}
    node 3: P=4 mod 1 -> +1 ([3])   counts {0:1, 1:2}, then undo
  answer 2
```

### Edge cases

```
- empty tree -> 0
- k = 1 -> every path counts: sum over nodes of depth (1-based)
- negative values -> normalise the modulo
```

### Common mistakes

```
- JS % keeps the sign: (-4) % 3 === -1, which would never match 2.
- Forgetting to undo the count after visiting children: sibling subtrees then see each other.
```

Full JavaScript solution with tests: [01_divisible_downward_paths.js](solutions/01_divisible_downward_paths.js). Run it with `node solutions/01_divisible_downward_paths.js` from this folder.

</details>

## Related follow-ups

- Paths that sum exactly to target (LeetCode #437)
- Return the longest divisible path
- Paths may go up and then down (much harder)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Write down which pattern you did NOT see at first. That is the one to drill.
- Fill in the set's reflection checklist in [QUIZ.md](../../04_Interview_And_Assessment/QUIZ.md).
- Re-solve from scratch in 3 days, then in 1 week.
