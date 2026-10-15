# Find the Shortest Superstring / Travelling Salesman for small n

| | |
|---|---|
| **Topic** | Advanced DP (Bitmask, Tree, Digit, State Machine) |
| **Difficulty** | Hard |
| **Pattern** | bitmask + last (Held-Karp) |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #943 — https://leetcode.com/problems/find-the-shortest-superstring/ |
| **Solution file** | [14_shortest_superstring_tsp.js](../solutions/14_shortest_superstring_tsp.js) — open only after a real attempt |

## Problem

Given words (none is a substring of another), return the shortest string that
contains every word as a substring. If several, any is accepted.

## Examples

```
Input: ["alex","loves","leetcode"]   Output: "alexlovesleetcode" (any order works, no overlap)
Input: ["catg","ctaagt","gcta","ttca","atgcatc"]   Output: "gctaagttcatgcatc"
```

## Constraints & clarifying questions

```
- 1 <= n <= 12, word length <= 20. n <= 12 -> 2^12 * 12 * 12 ~ 600k ops: bitmask DP.
- Why is this TSP? Each word is a city. Placing word j right after word i costs
  len(j) - overlap(i, j) extra characters. We need the cheapest ORDER visiting every
  city once: exactly the Travelling Salesman Problem (path version).
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *bitmask + last (Held-Karp)* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (plain recursion over permutations)   O(n! * n) time. Try every order, merge greedily with max overlap, keep the shortest.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Bitmask DP (Held-Karp)   O(2^n * n^2) time, O(2^n * n) space. Precompute overlap[i][j] = longest suffix of word i that is a prefix of word j.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- one word -> that word
- no overlaps at all -> any concatenation, total = sum of lengths
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (plain recursion over permutations)   O(n! * n) time

```
Try every order, merge greedily with max overlap, keep the shortest. Fine for n <= 7.
```

### APPROACH 2 — Bitmask DP (Held-Karp)   O(2^n * n^2) time, O(2^n * n) space

```
Precompute overlap[i][j] = longest suffix of word i that is a prefix of word j.
```

### DP definition

```
STATE      dp[mask][last] = minimum total length of a superstring that uses exactly
the words in `mask` and ENDS with word `last`.
RECURRENCE dp[mask | (1&lt;&lt;j)][j] = min( dp[mask][last] + len(j) - overlap[last][j] )
for every j not in mask.
BASE CASES dp[1 &lt;&lt; i][i] = len(words[i]).
ANSWER     min over last of dp[full][last]; keep a parent[mask][last] table to
rebuild the actual order (path reconstruction), then merge the words.

Dry run words = ["ab", "bc", "ca"] (overlap ab->bc = 1, bc->ca = 1, ca->ab = 1, others 0):
  mask 001 (ab) last 0 : 2      mask 010 (bc) last 1 : 2      mask 100 (ca) last 2 : 2
  mask 011 last 1 (ab then bc) : 2 + 2 - 1 = 3     mask 011 last 0 (bc then ab): 4
  mask 110 last 2 (bc then ca) : 3                 mask 101 last 0 (ca then ab): 3
  mask 111 last 2 : from 011/last1 -> 3 + 2 - 1 = 4  ("abca")
  answer length 4, e.g. "abca" (or "bcab", "cabc")
```

### Edge cases

```
- one word -> that word
- no overlaps at all -> any concatenation, total = sum of lengths
```

Full JavaScript solution with tests: [14_shortest_superstring_tsp.js](../solutions/14_shortest_superstring_tsp.js). Run it with `node 14_shortest_superstring_tsp.js` from the solutions folder.

</details>

## Common mistakes

- Recomputing the overlap of two words inside the DP; precompute an n x n overlap table.
- Storing only the best length and then being unable to rebuild the string; keep a parent pointer per (mask, last).
- Trying all n! orders; that is the brute force the bitmask DP replaces with O(2^n · n^2).

## Related follow-ups

- [Partition to K Equal Sum Subsets](../02_Medium/11_partition_k_equal_sum_subsets.md)
- Travelling Salesman Problem (classic bitmask DP)
- Shortest Path Visiting All Nodes (LeetCode #847)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
