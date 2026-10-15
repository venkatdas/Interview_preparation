# Smallest String With Swaps

| | |
|---|---|
| **Topic** | Union-Find Basics |
| **Difficulty** | Medium |
| **Pattern** | group indices, sort within group |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #1202 — https://leetcode.com/problems/smallest-string-with-swaps/ |
| **Solution file** | [08_smallest_string_with_swaps.js](../solutions/08_smallest_string_with_swaps.js) — open only after a real attempt |

## Problem

Given a string s and a list of index pairs. You may swap the characters at the two
indices of any pair, as many times as you like. Return the lexicographically smallest
string you can get.

## Examples

```
Input: s = "dcab", pairs = [[0,3],[1,2]]         Output: "bacd"
Input: s = "dcab", pairs = [[0,3],[1,2],[0,2]]   Output: "abcd"
Input: s = "cba", pairs = [[0,1],[1,2]]          Output: "abc"
```

## Constraints & clarifying questions

```
- Unlimited swaps? (yes - that is what makes it a components problem)
- No pairs -> return s unchanged
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *group indices, sort within group* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Alternative (DFS to find index components)   O(n log n + pairs). Build adjacency over indices, DFS each component, sort.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Union-Find)   O((n + pairs) * alpha + n log n). 1.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- empty pairs -> s
- all indices connected -> fully sorted string
- duplicate pairs
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Alternative (DFS to find index components)   O(n log n + pairs)

```
Build adjacency over indices, DFS each component, sort. Shown as `dfsVersion`.
```

### APPROACH 2 — Optimal (Union-Find)   O((n + pairs) * alpha + n log n)

```
1. union every pair.
  2. group indices by root; collect their chars.
  3. sort indices ascending and chars ascending; zip them back.

Dry run "dcab", [[0,3],[1,2]]:
  components {0,3} chars [d,b] -> sorted [b,d] -> s[0]=b, s[3]=d
             {1,2} chars [c,a] -> sorted [a,c] -> s[1]=a, s[2]=c
  result "bacd"
```

### KEY INSIGHT: if indices are connected through pairs (directly or via a chain), you can

```
arrange the characters at those indices in ANY order (unlimited swaps along a
connected graph can realise any permutation). So: for each connected component of
indices, sort its characters and place them back in sorted index order.
```

### Edge cases

```
- empty pairs -> s
- all indices connected -> fully sorted string
- duplicate pairs
```

Full JavaScript solution with tests: [08_smallest_string_with_swaps.js](../solutions/08_smallest_string_with_swaps.js). Run it with `node 08_smallest_string_with_swaps.js` from the solutions folder.

</details>

## Common mistakes

- Applying the swaps literally; any permutation inside a connected group of indices is reachable, so just sort each group.
- Sorting the characters but writing them back in the wrong index order (indices of the group must be sorted too).
- Forgetting indices that appear in no pair keep their own character.

## Related follow-ups

- [Accounts Merge](06_accounts_merge.md)
- [Lexicographically Smallest Equivalent String](../../../02_Advanced_Union_Find/03_Problems/02_Medium/02_lexicographically_smallest_equivalent_string.md)
- [Number of Provinces](04_number_of_provinces.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
