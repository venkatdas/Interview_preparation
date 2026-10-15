# Shuffle an Array

| | |
|---|---|
| **Topic** | Probability and Randomization |
| **Difficulty** | Medium |
| **Pattern** | Fisher–Yates shuffle |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #384 — https://leetcode.com/problems/shuffle-an-array/ (statement paraphrased, not copied) |
| **Solution file** | [01_shuffle_an_array.js](../solutions/01_shuffle_an_array.js) — open only after a real attempt |

## Problem

Design a class that receives an integer array once. It supports two calls:

- `reset()` returns the array in its original order.
- `shuffle()` returns a random ordering of the array in which **every possible permutation is equally likely** (each with probability 1/n!).

## Examples

```
const s = new Solution([1, 2, 3]);
s.shuffle()  -> [3, 1, 2]   (any of the 6 orders; each has probability 1/6)
s.reset()    -> [1, 2, 3]
s.shuffle()  -> [1, 3, 2]
```

## Constraints & clarifying questions

```
- Are values distinct? (LeetCode says yes; a correct shuffle works either way)
- Return a new array, or shuffle in place? (return a copy; never lose the original)
- Can the array be empty? (yes -> shuffle returns [])
- How will fairness be judged? (statistically: all n! orders equally likely)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *uniform random permutation*. Read section 5.4 of [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** Put all values in a "hat". Repeatedly draw a uniformly random one, remove it, append it to the output. Is every order equally likely? What does removing from the middle of an array cost?

</details>

<details><summary>Hint 3</summary>

**The key idea.** Do the hat trick in place: the unshuffled part is the prefix `a[0..i]`. Pick `j` uniformly in `[0, i]` (i included!), swap `a[i]` and `a[j]`, then shrink the prefix.

</details>

<details><summary>Hint 4</summary>

**Edge cases.** Empty and one-element arrays. Keep a private copy so `reset()` works after many shuffles. Do NOT pick `j` from the whole array each time: that version is biased.

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (Draw from a hat)   O(n^2) time, O(n) space

```
Copy the array. While it is non-empty, choose a random index, splice that element
out and push it to the result. Each step is uniform over what is left, so the
result is uniform, but every splice shifts elements: O(n) per step.
```

### APPROACH 2 — Optimal (Fisher–Yates)   O(n) time per shuffle, O(n) space for the copy

```
for i from n-1 down to 1:
    j = random integer in [0, i]
    swap a[i], a[j]          // a[i] is now final
Proof: step i has i+1 equally likely choices, so there are n * (n-1) * ... * 2 = n!
equally likely runs, and each run produces a different permutation. So every
permutation has probability exactly 1/n!.
```

### Dry run

```
[1, 2, 3], random picks j = 0 then j = 1
  i = 2, j = 0: swap a[2], a[0] -> [3, 2, 1]   (1 is final)
  i = 1, j = 1: swap with itself -> [3, 2, 1]   (2 stays: allowed and needed)
  result [3, 2, 1]
```

### Complexity

- Brute force: O(n^2) time, O(n) space
- Optimal: O(n) time per shuffle, O(n) space for the copy

### Edge cases

```
- [] and [x] -> nothing to swap
- reset after shuffles -> original order (we never mutate the stored copy)
- duplicates -> still a permutation of the input
```

### Common mistakes

- j in [0, n-1] for every i (naive shuffle): n^n runs cannot split evenly into n! orders.
- j in [0, i-1]: Sattolo's algorithm, which never leaves an element in place.
- arr.sort(() => Math.random() - 0.5): biased and engine dependent.

Full JavaScript solution with tests: [01_shuffle_an_array.js](../solutions/01_shuffle_an_array.js). Run it with `node 01_shuffle_an_array.js` from the solutions folder.

</details>

## Related follow-ups

- Random Flip Matrix (LeetCode 519)
- Sattolo's algorithm: random cyclic permutation
- Shuffle a deck so no card stays in place (derangement via rejection)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
