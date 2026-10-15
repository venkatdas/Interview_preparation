# Random Pick with Weight

| | |
|---|---|
| **Topic** | Probability and Randomization |
| **Difficulty** | Medium |
| **Pattern** | prefix sums + binary search |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #528 — https://leetcode.com/problems/random-pick-with-weight/ (statement paraphrased, not copied) |
| **Solution file** | [04_random_pick_with_weight.js](../solutions/04_random_pick_with_weight.js) — open only after a real attempt |

## Problem

You get an array `w` of positive integers where `w[i]` is the weight of index `i`. Implement `pickIndex()`, which returns index `i` with probability `w[i] / sum(w)`.

## Examples

```
w = [1, 3]
pickIndex() -> 0 with probability 1/4, 1 with probability 3/4

w = [1, 3, 2]
pickIndex() -> 0 with prob 1/6, 1 with prob 3/6, 2 with prob 2/6
```

## Constraints & clarifying questions

```
- Up to 1e4 weights, each up to 1e5, up to 1e4 calls -> precompute once
- Can weights change between calls? (no; if they could, use a Fenwick tree)
- Zero weights? (not in LeetCode; our code never picks them)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** Weighted random choice. See section 5.6 of [the concepts guide](../../01_Concepts/CONCEPTS.md) and the "ruler" picture in section 3.

</details>

<details><summary>Hint 2</summary>

**Start simple.** Draw r uniform in [0, total). Walk the weights subtracting each; where r drops below 0 is your index. That is O(n) per pick.

</details>

<details><summary>Hint 3</summary>

**The key idea.** Prefix sums turn the weights into back-to-back intervals whose lengths are the weights. The answer is the first prefix strictly greater than r: binary search, O(log n).

</details>

<details><summary>Hint 4</summary>

**Edge cases.** A single weight. r landing exactly on a boundary (half-open intervals: use strict `>`).

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (Linear scan)   O(n) per pick, O(1) extra space

```
r = rng() * total
for i: r -= w[i]; if r < 0 return i
```

### APPROACH 2 — Optimal (Prefix sums + binary search)   O(n) build, O(log n) per pick, O(n) space

```
prefix[i] = w[0] + ... + w[i]
r = rng() * total
return first i with prefix[i] > r
Index i owns [prefix[i-1], prefix[i]), an interval of length w[i].
```

### Dry run

```
w = [1, 3, 2] -> prefix [1, 4, 6], r = 4.5
  lo=0 hi=2 mid=1 prefix 4 > 4.5? no -> lo=2
  return 2          (4.5 lies in [4, 6))
```

### Complexity

- Brute force: O(n) per pick, O(1) extra space
- Optimal: O(n) build, O(log n) per pick, O(n) space

### Edge cases

```
- one weight -> always 0
- r exactly 4.0 -> index 2 (boundary belongs to the interval that starts there)
- large totals -> doubles are exact up to 2^53
```

### Common mistakes

- Using `>=` in the search: shifts boundary values left and can make a zero-weight index pickable.
- Building an array with w[i] copies of i: memory = total weight (up to 1e9).
- Using Math.floor(rng() * total) with 1-based thinking and getting off by one.

Full JavaScript solution with tests: [04_random_pick_with_weight.js](../solutions/04_random_pick_with_weight.js). Run it with `node 04_random_pick_with_weight.js` from the solutions folder.

</details>

## Related follow-ups

- Random Point in Non-overlapping Rectangles (LeetCode 497)
- Alias method for O(1) picks (Advanced)
- Weighted pick with updates (Fenwick tree + binary lifting)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
