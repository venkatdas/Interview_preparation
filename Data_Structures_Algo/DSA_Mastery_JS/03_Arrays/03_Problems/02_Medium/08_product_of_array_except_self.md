# Product of Array Except Self

| | |
|---|---|
| **Topic** | Arrays |
| **Difficulty** | Medium |
| **Pattern** | prefix / suffix |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #238 — https://leetcode.com/problems/product-of-array-except-self/ |
| **Solution file** | [08_product_of_array_except_self.js](../solutions/08_product_of_array_except_self.js) — open only after a real attempt |

## Problem

Given an integer array nums, return an array answer where answer[i] is the product
of all elements EXCEPT nums[i]. You must not use division, and it must run in O(n).

## Examples

```
Input: [1, 2, 3, 4]       Output: [24, 12, 8, 6]
Input: [-1, 1, 0, -3, 3]  Output: [0, 0, 9, 0, 0]
```

## Constraints & clarifying questions

```
- Can I use division? (no - and division breaks on zeros anyway)
- Can there be zeros? (yes; one zero -> only that slot is non-zero, two zeros -> all zeros)
- Does the product fit in a 32-bit int? (assume yes)
- Does the output array count as extra space? (no, the follow-up asks for O(1) extra beyond it)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *prefix / suffix* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n^2) time, O(1) extra space. For each i, multiply every other element.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (prefix and suffix products)   O(n) time, O(1) extra space. answer[i] = (product of everything LEFT of i) * (product of everything RIGHT of i).

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- JS gotcha: a negative times 0 gives -0, and strict equality tools (assert.deepStrictEqual,
  Object.is) treat -0 and 0 as different. Adding 0 (`x + 0`) normalizes -0 to 0.
- One zero: [1, 0, 3] -> [0, 3, 0]
- Two zeros -> all zeros
- Negative numbers
- Two elements: [a, b] -> [b, a]
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^2) time, O(1) extra space

```
For each i, multiply every other element. Simple but quadratic.
```

### APPROACH 2 — Optimal (prefix and suffix products)   O(n) time, O(1) extra space

```
answer[i] = (product of everything LEFT of i) * (product of everything RIGHT of i).
  Pass 1, left to right: write the running prefix product into answer[i] BEFORE
          multiplying nums[i] in, so answer[i] = product of nums[0..i-1].
  Pass 2, right to left: keep a running suffix product and multiply it into answer[i]
          BEFORE multiplying nums[i] in.
Using the output array for the prefixes means no extra arrays.

Dry run on [1, 2, 3, 4]:
  pass 1 (prefix): prefix=1 -> ans[0]=1, prefix=1
                   ans[1]=1, prefix=2
                   ans[2]=2, prefix=6
                   ans[3]=6, prefix=24          ans = [1, 1, 2, 6]
  pass 2 (suffix): suffix=1 -> ans[3]=6*1=6,  suffix=4
                   ans[2]=2*4=8,   suffix=12
                   ans[1]=1*12=12, suffix=24
                   ans[0]=1*24=24               ans = [24, 12, 8, 6]
```

### Edge cases

```
- JS gotcha: a negative times 0 gives -0, and strict equality tools (assert.deepStrictEqual,
  Object.is) treat -0 and 0 as different. Adding 0 (`x + 0`) normalizes -0 to 0.
- One zero: [1, 0, 3] -> [0, 3, 0]
- Two zeros -> all zeros
- Negative numbers
- Two elements: [a, b] -> [b, a]
```

Full JavaScript solution with tests: [08_product_of_array_except_self.js](../solutions/08_product_of_array_except_self.js). Run it with `node 08_product_of_array_except_self.js` from the solutions folder.

</details>

## Common mistakes

- Dividing the total product by `nums[i]`; this is banned and breaks on zeros.
- Off-by-one in the prefix pass: `answer[i]` must hold the product of elements *before* i, not including i.
- Allocating separate prefix and suffix arrays when one running suffix variable is enough for O(1) extra space.

## Related follow-ups

- [Product of Array Except Self (Prefix Sums)](../../../08_Prefix_Sums_And_Difference_Arrays/03_Problems/02_Medium/04_product_of_array_except_self.md) — the prefix/suffix view of the same problem
- [Trapping Rain Water](../../../06_Two_Pointers/03_Problems/03_Hard/12_trapping_rain_water.md) — another left-pass / right-pass problem
- [Find Pivot Index](../../../08_Prefix_Sums_And_Difference_Arrays/03_Problems/01_Easy/03_find_pivot_index.md) — prefix vs suffix sums

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
