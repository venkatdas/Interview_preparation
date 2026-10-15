# Maximum Product Subarray

| | |
|---|---|
| **Topic** | Arrays |
| **Difficulty** | Medium |
| **Pattern** | Kadane with max & min |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #152 — https://leetcode.com/problems/maximum-product-subarray/ |
| **Solution file** | [14_maximum_product_subarray.js](../solutions/14_maximum_product_subarray.js) — open only after a real attempt |

## Problem

Given an integer array, find the contiguous subarray (at least one element) with
the largest PRODUCT and return that product.

## Examples

```
Input: [2, 3, -2, 4]   Output: 6    Explanation: [2, 3]
Input: [-2, 0, -1]     Output: 0    Explanation: [-2, -1] is not contiguous, best is [0]
Input: [-2, 3, -4]     Output: 24   Explanation: two negatives make a positive
```

## Constraints & clarifying questions

```
- Can there be zeros and negatives? (yes - both are the whole difficulty)
- Does the product fit in a 32-bit int? (assume yes)
- At least one element? (yes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *Kadane with max & min* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n^2) time, O(1) space. For every start index, extend the end index multiplying as you go; track the max.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Kadane with max AND min)   O(n) time, O(1) space. Plain Kadane fails because a negative number flips sign: the SMALLEST product so far times a negative becomes the LARGEST.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- Single negative element -> that element
- Zero in the middle splits the array: [-2, 0, -1] -> 0
- Odd number of negatives: the answer skips one end negative
- All negatives, even count -> whole product
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^2) time, O(1) space

```
For every start index, extend the end index multiplying as you go; track the max.
```

### APPROACH 2 — Optimal (Kadane with max AND min)   O(n) time, O(1) space

```
Plain Kadane fails because a negative number flips sign: the SMALLEST product so far
times a negative becomes the LARGEST. So at each index track both:
  curMax = max(num, curMax * num, curMin * num)
  curMin = min(num, curMax * num, curMin * num)   (use the OLD curMax)
A zero resets both to 0 and then to num on the next step, which handles zeros for free.

Dry run on [2, 3, -2, 4]:
  num 2:  curMax=2   curMin=2    best=2
  num 3:  curMax=6   curMin=3    best=6
  num -2: candidates -2, 6*-2=-12, 3*-2=-6 -> curMax=-2 curMin=-12   best=6
  num 4:  candidates 4, -8, -48            -> curMax=4  curMin=-48   best=6  -> 6

Dry run on [-2, 3, -4]:
  num -2: curMax=-2  curMin=-2   best=-2
  num 3:  curMax=3   curMin=-6   best=3
  num -4: candidates -4, -12, 24 -> curMax=24 curMin=-12  best=24   -> 24
```

### Edge cases

```
- Single negative element -> that element
- Zero in the middle splits the array: [-2, 0, -1] -> 0
- Odd number of negatives: the answer skips one end negative
- All negatives, even count -> whole product
```

Full JavaScript solution with tests: [14_maximum_product_subarray.js](../solutions/14_maximum_product_subarray.js). Run it with `node 14_maximum_product_subarray.js` from the solutions folder.

</details>

## Common mistakes

- Tracking only the running maximum; a negative number turns the smallest product into the largest.
- Updating `max` before computing the new `min` with the old `max` value; save the old value first.
- Initialising the answer to 0, which is wrong for `[-2]`.

## Related follow-ups

- [Maximum Subarray](04_maximum_subarray.md) — plain Kadane on sums
- Maximum Product of Three Numbers (LeetCode #628) — sign handling without contiguity
- Subarray Product Less Than K (LeetCode #713) — products with a sliding window

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
