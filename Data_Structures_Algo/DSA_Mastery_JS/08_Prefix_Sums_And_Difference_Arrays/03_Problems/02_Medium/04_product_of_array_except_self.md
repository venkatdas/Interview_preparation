# Product of Array Except Self

| | |
|---|---|
| **Topic** | Prefix Sums and Difference Arrays |
| **Difficulty** | Medium |
| **Pattern** | prefix × suffix |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #238 — https://leetcode.com/problems/product-of-array-except-self/ |
| **Solution file** | [04_product_of_array_except_self.js](../solutions/04_product_of_array_except_self.js) — open only after a real attempt |

## Problem

Given an integer array nums, return an array answer where answer[i] is the product of
all elements except nums[i]. Must run in O(n) and must NOT use division.

## Examples

```
Input: [1, 2, 3, 4]       Output: [24, 12, 8, 6]
Input: [-1, 1, 0, -3, 3]  Output: [0, 0, 9, 0, 0]
```

## Constraints & clarifying questions

```
- No division? (yes; division also breaks on zeros)
- O(1) extra space (output doesn't count)? (follow-up: yes with the two-pass trick)
- At least 2 elements? (yes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *prefix × suffix* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n^2) time, O(1) extra space. For each i, multiply every other element.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (prefix product × suffix product)   O(n) time, O(1) extra space. answer[i] = (product of everything LEFT of i) * (product of everything RIGHT of i).

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- One zero -> every other slot is 0, the zero's slot is the product of the rest
- Two zeros -> all zeros
- Negatives
- Exactly two elements -> swapped
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^2) time, O(1) extra space

```
For each i, multiply every other element.
```

### APPROACH 2 — Optimal (prefix product × suffix product)   O(n) time, O(1) extra space

```
answer[i] = (product of everything LEFT of i) * (product of everything RIGHT of i).
  Pass 1 (left to right): answer[i] = product of nums[0..i-1]  (a prefix product)
  Pass 2 (right to left): keep a running suffix product and multiply it in.
The output array holds the prefix products, so we need no extra arrays.

Dry run on [1, 2, 3, 4]:
  pass 1: left=1 -> answer[0]=1, left=1
                     answer[1]=1, left=2
                     answer[2]=2, left=6
                     answer[3]=6, left=24      answer = [1, 1, 2, 6]
  pass 2: right=1 -> answer[3]=6*1=6,  right=4
                     answer[2]=2*4=8,  right=12
                     answer[1]=1*12=12, right=24
                     answer[0]=1*24=24           answer = [24, 12, 8, 6]
```

### Edge cases

```
- One zero -> every other slot is 0, the zero's slot is the product of the rest
- Two zeros -> all zeros
- Negatives
- Exactly two elements -> swapped
```

Full JavaScript solution with tests: [04_product_of_array_except_self.js](../solutions/04_product_of_array_except_self.js). Run it with `node 04_product_of_array_except_self.js` from the solutions folder.

</details>

## Common mistakes

- Using division, which fails with zeros and is not allowed.
- Including nums[i] in its own prefix product.
- Using extra prefix and suffix arrays when a single suffix variable is enough.

## Related follow-ups

- [Product of Array Except Self (Arrays)](../../../03_Arrays/03_Problems/02_Medium/08_product_of_array_except_self.md) — the same problem in the arrays topic
- [Find Pivot Index](../01_Easy/03_find_pivot_index.md) — prefix and suffix sums
- [Trapping Rain Water](../../../06_Two_Pointers/03_Problems/03_Hard/12_trapping_rain_water.md) — left max and right max arrays

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
