# Permutation Sequence

| | |
|---|---|
| **Topic** | Combinatorics |
| **Difficulty** | Hard |
| **Pattern** | factorial number system (k-th permutation) |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #60 — https://leetcode.com/problems/permutation-sequence/ |
| **Solution file** | [07_permutation_sequence.js](../solutions/07_permutation_sequence.js) — open only after a real attempt |

## Problem

Write out all n! orderings of the digits 1..n in dictionary order. Return the k-th one
(counting from 1) as a string.

## Examples

```
Input: n = 3, k = 3   Output: "213"   (123, 132, 213, 231, 312, 321)
Input: n = 4, k = 9   Output: "2314"
Input: n = 3, k = 1   Output: "123"
```

## Constraints & clarifying questions

```
- 1 <= n <= 9, 1 <= k <= n!
- k is 1-indexed
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** Ranking / unranking permutations. Read *Next permutation and k-th permutation* in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** Start at "12...n" and call next-permutation k-1 times. Up to 362880 steps: OK but wasteful.

</details>

<details><summary>Hint 3</summary>

**The key idea.** With m digits left, each choice of first digit covers a block of (m-1)! permutations. So the index of the next digit is floor(k / (m-1)!) with 0-indexed k, then k %= (m-1)!.

</details>

<details><summary>Hint 4</summary>

**Edge cases.** Subtract 1 from k first. k = n! gives the digits in descending order.

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(k * n) time, O(n) space

```
arr = [1..n]; repeat k-1 times: nextPermutation(arr)
```

### APPROACH 2 — Optimal (factorial number system)   O(n^2) time, O(n) space

```
rank = k - 1, pool = [1..n]
for m = n down to 1: idx = floor(rank / (m-1)!); take pool[idx]; rank %= (m-1)!
```

### Dry run

```
n = 4, k = 9 -> rank 8, pool [1,2,3,4]
  3! = 6: idx 1 -> 2, rank 2, pool [1,3,4]
  2! = 2: idx 1 -> 3, rank 0, pool [1,4]
  1! = 1: idx 0 -> 1, pool [4]
  0! = 1: idx 0 -> 4        -> "2314"
```

### Complexity

- Brute force: O(k * n) time, O(n) space
- Optimal: O(n^2) time, O(n) space

### Edge cases

```
- n = 1 -> "1"
- k = 1 -> ascending, k = n! -> descending
```

### Common mistakes

- Forgetting k-1: off by one block at every boundary.
- Using n! instead of (n-1)! as the block size.

Full JavaScript solution with tests: [07_permutation_sequence.js](../solutions/07_permutation_sequence.js). Run it with `node 07_permutation_sequence.js` from the solutions folder.

</details>

## Related follow-ups

- Next Permutation (LeetCode #31)
- Permutations II (LeetCode #47) — duplicates
- Rank of a permutation (inverse problem) — Lehmer code

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
