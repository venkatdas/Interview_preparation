# Unique Binary Search Trees

| | |
|---|---|
| **Topic** | Combinatorics |
| **Difficulty** | Medium |
| **Pattern** | Catalan numbers |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #96 — https://leetcode.com/problems/unique-binary-search-trees/ |
| **Solution file** | [04_unique_binary_search_trees.js](../solutions/04_unique_binary_search_trees.js) — open only after a real attempt |

## Problem

Given `n`, count how many structurally different binary search trees can hold exactly
the values 1 to n.

## Examples

```
Input: n = 3   Output: 5
Input: n = 1   Output: 1
Input: n = 4   Output: 14
```

## Constraints & clarifying questions

```
- 1 <= n <= 19
- Do we count the empty tree for n = 0? (yes, 1 shape)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** Pick a root, split the rest into left and right. Read *Catalan numbers* in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** If root is r, the left has r-1 nodes and the right n-r nodes, and their shapes multiply: G(n) = sum G(r-1) * G(n-r).

</details>

<details><summary>Hint 3</summary>

**The key idea.** That recurrence is the Catalan recurrence: G(n) = C(2n, n) / (n+1). Use Cat(i+1) = Cat(i) * 2(2i+1) / (i+2).

</details>

<details><summary>Hint 4</summary>

**Edge cases.** G(0) = 1 (an empty subtree is one shape, not zero). Without it every product becomes 0.

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^2) time, O(n) space

```
G[0] = 1; for nodes = 1..n: G[nodes] = sum over root of G[root-1] * G[nodes-root]
```

### APPROACH 2 — Optimal (Catalan closed form)   O(n) time, O(1) space

```
cat = 1
for i in 0..n-1: cat = cat * 2(2i+1) / (i+2)   // stays an integer each step
```

### Dry run

```
n = 3
  Cat1 = 1 * 2 / 2  = 1
  Cat2 = 1 * 6 / 3  = 2
  Cat3 = 2 * 10 / 4 = 5   -> 5
```

### Complexity

- Brute force: O(n^2) time, O(n) space
- Optimal: O(n) time, O(1) space

### Edge cases

```
- n = 0 -> 1, n = 1 -> 1
- n = 19 -> 1767263190 (fits a number)
```

### Common mistakes

- G(0) = 0 instead of 1.
- Computing (2n)! directly in plain numbers: overflows past 2^53 at n = 10.

Full JavaScript solution with tests: [04_unique_binary_search_trees.js](../solutions/04_unique_binary_search_trees.js). Run it with `node 04_unique_binary_search_trees.js` from the solutions folder.

</details>

## Related follow-ups

- Unique Binary Search Trees II (LeetCode #95) — actually build them
- Generate Parentheses (LeetCode #22) — also Catalan
- Different Ways to Add Parentheses (LeetCode #241)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
