# Shuffle an Array

| | |
|---|---|
| **Topic** | Classic Techniques (Kadane, Boyer-Moore, Floyd, Reservoir, Binary Lifting, Sqrt Decomposition) |
| **Difficulty** | Medium |
| **Pattern** | Fisher-Yates |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #384 — https://leetcode.com/problems/shuffle-an-array/ |
| **Solution file** | [03_shuffle_an_array.js](../solutions/03_shuffle_an_array.js) — open only after a real attempt |

## Problem

Implement Solution(nums) with
  - reset(): return the original array
  - shuffle(): return a random permutation where every permutation is EQUALLY likely

## Examples

```
Solution([1,2,3]); shuffle() -> e.g. [3,1,2]; reset() -> [1,2,3]; shuffle() -> e.g. [1,3,2]
```

## Constraints & clarifying questions

```
- Up to 200 elements, up to 5 * 10^4 calls
- "Equally likely" is the whole point: a biased shuffle is a wrong answer
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *Fisher-Yates* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n^2) time per shuffle. Copy the array; repeatedly pick a random remaining element, remove it (splice, O(n)), and append it to the output.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Fisher-Yates / Knuth shuffle)   O(n) time, O(n) space for the copy. For i from n-1 down to 1: pick j uniformly in [0, i] and swap a[i] with a[j].

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- single element -> shuffle returns it
- reset must return the ORIGINAL order even after many shuffles (keep an untouched copy)
- empty array
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^2) time per shuffle

```
Copy the array; repeatedly pick a random remaining element, remove it (splice, O(n)), and
append it to the output. Uniform, but O(n^2) because of splice.
(Non-answer: nums.sort(() => Math.random() - 0.5) is NOT uniform - comparison sorts assume
a consistent comparator, and the resulting distribution is visibly skewed.)
```

### APPROACH 2 — Optimal (Fisher-Yates / Knuth shuffle)   O(n) time, O(n) space for the copy

```
For i from n-1 down to 1: pick j uniformly in [0, i] and swap a[i] with a[j].
Why uniform: position n-1 receives each element with probability 1/n; given that, position
n-2 receives each remaining element with probability 1/(n-1); and so on -> each permutation
has probability 1/n * 1/(n-1) * ... * 1 = 1/n!.

Dry run on [1,2,3] (random picks shown):
  i=2: j=0 -> swap a[2], a[0] -> [3,2,1]
  i=1: j=1 -> no change        -> [3,2,1]
```

### Edge cases

```
- single element -> shuffle returns it
- reset must return the ORIGINAL order even after many shuffles (keep an untouched copy)
- empty array
```

Full JavaScript solution with tests: [03_shuffle_an_array.js](../solutions/03_shuffle_an_array.js). Run it with `node 03_shuffle_an_array.js` from the solutions folder.

</details>

## Common mistakes

- Picking `j` from the whole array (`0..n-1`) at every step; that gives n^n outcomes, which are not uniform over n! permutations.
- Shuffling the original array in place so `reset` can no longer return it.
- Using `array.sort(() => Math.random() - 0.5)`, which is biased.

## Related follow-ups

- [Linked List Random Node](04_linked_list_random_node.md)
- [Random Pick Index](05_random_pick_index.md)
- Random Pick with Weight (LeetCode #528)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
