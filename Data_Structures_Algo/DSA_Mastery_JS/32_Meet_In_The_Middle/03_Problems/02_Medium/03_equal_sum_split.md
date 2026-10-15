# Equal-Sum Split

| | |
|---|---|
| **Topic** | Meet in the Middle |
| **Difficulty** | Medium |
| **Pattern** | signed sums + hash |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md), [Hashing](../../../05_Hashing/README.md) |
| **Source** | Original exercise |
| **Solution file** | [03_equal_sum_split.js](../solutions/03_equal_sum_split.js) — open only after a real attempt |

## Problem

You have up to 40 integers (they may be negative, up to 10^9 in size). Every number must go into
group **A** or group **B**. Count the assignments where `sum(A) === sum(B)`. Groups are labelled
(putting `x` in A and `y` in B is different from the reverse) and may be empty.

## Examples

```
nums=[1,1]      Output: 2    (A={1st}, B={2nd}) and the mirror
nums=[1,2,3]    Output: 2    (A={1,2}, B={3}) and the mirror
nums=[]         Output: 1    (both groups empty)
nums=[0]        Output: 2    (0 can go to either side)
```

## Constraints & clarifying questions

```
- 0 <= n <= 40, |nums[i]| <= 1e9
- Labelled groups? (yes — halve the answer for unlabelled)
- May a group be empty? (yes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** 2^40 assignments is too many, values are too big for DP. Meet in the middle.

</details>

<details><summary>Hint 2</summary>

**Start simple.** Give each value a sign: `+` if it goes to A, `-` if it goes to B. What must the signed total be?

</details>

<details><summary>Hint 3</summary>

**The key idea.** The signed total must be 0. Enumerate all signed totals of each half; a left total `x` matches a right total `y` exactly when `y = -x`. Count with a frequency map.

</details>

<details><summary>Hint 4</summary>

**Edge cases.** Zeros double the count (each zero can go either way). If the overall sum is odd the answer is 0 — the algorithm finds that anyway.

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(2^n · n) time

Try every bitmask (bit set = group A), compute `sum(A) − sum(B)`, count zeros.

### APPROACH 2 — Optimal (meet in the middle over signed sums + hash)   O(2^(n/2)) time and space

```
Lsigned = all ± totals of left half
Rsigned = all ± totals of right half, as a frequency map
answer  = sum over x in Lsigned of freq[-x]
```

Dry run `[1,2,3]`: left `[1]` → {+1, −1}; right `[2,3]` → {5, −1, 1, −5}.
x=+1 needs −1 → 1; x=−1 needs +1 → 1. Answer 2.

### Edge cases

```
- []        -> 1
- [0,0,0]   -> 8
- [1,2]     -> 0
```

### Common mistakes

- Using a `Set` instead of counts.
- Thinking in terms of "subset with sum total/2" and then dividing by 2 when the groups are labelled — off by a factor of two.

Full JavaScript solution with tests: [03_equal_sum_split.js](../solutions/03_equal_sum_split.js).

</details>

## Related follow-ups

- LeetCode #416 Partition Equal Subset Sum (small values → DP)
- LeetCode #494 Target Sum (same ± idea, small values → DP)
- Three groups with equal sums (state becomes a pair of differences)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
