# 4Sum II

| | |
|---|---|
| **Topic** | Meet in the Middle |
| **Difficulty** | Medium |
| **Pattern** | split 4 arrays into 2 + 2, hash combine |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md), [Hashing](../../../05_Hashing/README.md) |
| **Source** | LeetCode #454 — https://leetcode.com/problems/4sum-ii/ (statement paraphrased) |
| **Solution file** | [01_four_sum_ii.js](../solutions/01_four_sum_ii.js) — open only after a real attempt |

## Problem

You are given four integer arrays `A`, `B`, `C`, `D`, all of the same length `n`. Count how many
index tuples `(i, j, k, l)` make `A[i] + B[j] + C[k] + D[l]` equal to zero.

## Examples

```
A=[1,2] B=[-2,-1] C=[-1,2] D=[0,2]   Output: 2
   (0,0,0,1): 1 + -2 + -1 + 2 = 0
   (1,1,0,0): 2 + -1 + -1 + 0 = 0
A=[0] B=[0] C=[0] D=[0]              Output: 1
```

## Constraints & clarifying questions

```
- 1 <= n <= 200, values in [-2^28, 2^28]
- Count index tuples, not distinct value combinations (duplicates count separately).
- n^4 = 1.6e9 is too slow; n^2 = 40,000 is easy.
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is meet in the middle in disguise. The "halves" are not halves of one array — they are the pair (A, B) and the pair (C, D).

</details>

<details><summary>Hint 2</summary>

**Start simple.** Four nested loops give O(n^4). Can you replace the last two loops with a single lookup?

</details>

<details><summary>Hint 3</summary>

**The key idea.** Put every `a + b` into a frequency map. For each `c + d`, the number of matching left pairs is `freq[-(c + d)]`.

</details>

<details><summary>Hint 4</summary>

**Edge cases.** Use a `Map` with counts, not a `Set` — many (i, j) pairs can share the same sum. All zeros gives n^4 tuples.

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^4) time, O(1) space

Four nested loops; count the tuples whose sum is 0.

### APPROACH 2 — Optimal (meet in the middle + hash)   O(n^2) time, O(n^2) space

```
freq = map of (a + b) -> how many (i, j) pairs give it
answer = sum over (c, d) of freq[-(c + d)]
```

Dry run on example 1:

```
A+B sums: -1, 0, 0, 1          freq = {-1:1, 0:2, 1:1}
C+D sums: -1 -> need  1 -> 1
           1 -> need -1 -> 1
           2 -> need -2 -> 0
           4 -> need -4 -> 0
answer = 2
```

### Edge cases

```
- all zeros -> n^4
- no solution -> 0
```

### Common mistakes

- Using a `Set` and losing multiplicities.
- Trying to sort and use 4Sum-style pointers — works but is slower and fiddlier.

Full JavaScript solution with tests: [01_four_sum_ii.js](../solutions/01_four_sum_ii.js).

</details>

## Related follow-ups

- LeetCode #18 4Sum (one array, distinct quadruplets)
- LeetCode #1 Two Sum (the one-lookup building block)
- What if there were 6 arrays? (3 + 3 split, O(n^3))

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
