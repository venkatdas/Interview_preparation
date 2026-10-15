# How To Solve A Problem — Quiz

Scenario-based questions about the UMPIRE process. Concepts: [CONCEPTS.md](../01_Concepts/CONCEPTS.md).

### Q1. Multiple choice — the first thing to do after reading a problem is

A) start coding the optimal solution  B) restate it and ask clarifying questions  C) state the complexity  D) write tests

<details><summary>Answer</summary>

**B.**

</details>

### Q2. Multiple choice — the constraint n ≤ 20 most likely hints at

A) O(n log n)  B) O(2^n) or O(n · 2^n) is acceptable  C) O(1)  D) binary search

<details><summary>Answer</summary>

**B.** 2^20 ≈ 10^6.

</details>

### Q3. Spot the process mistake

A candidate hears "find two numbers that sum to target", immediately writes a hash map solution, and returns values instead of indices.

<details><summary>Answer</summary>

They skipped U (understand): the expected output format (indices vs values, 0- or 1-based, what if no pair) was never confirmed.

</details>

### Q4. Match the signal to the pattern

"Return the length of the longest substring with at most k distinct characters."

<details><summary>Answer</summary>

Contiguous + longest + a condition that grows monotonically → variable-size sliding window with a frequency map.

</details>

### Q5. Match the signal to the pattern

"Given a sorted array, find whether any two numbers sum to x, using O(1) extra space."

<details><summary>Answer</summary>

Sorted + pair + O(1) space → two pointers from both ends.

</details>

### Q6. Spot the bug found by a dry run

```js
function maxOf(nums) { let best = 0; for (const x of nums) if (x > best) best = x; return best; }
```

Which test case exposes it?

<details><summary>Answer</summary>

An all-negative array such as `[-3, -1]` returns 0. Initialise with `-Infinity` or `nums[0]`. Always include negatives in your test list.

</details>

### Q7. Multiple choice — after finishing the code, you should

A) say "done"  B) dry run an example and an edge case, then state complexity  C) start optimising micro-details  D) rewrite it in another style

<details><summary>Answer</summary>

**B.**

</details>

### Q8. What is the repeated work?

Brute force for "number of subarrays with sum k" recomputes the sum of every subarray. What can be reused, and what does it become?

<details><summary>Answer</summary>

Prefix sums: the sum of any subarray is a difference of two prefixes. With a hash map of prefix counts it becomes O(n).

</details>

### Q9. Multiple choice — you are stuck for two minutes. The best move is

A) stay silent until you have the full answer  B) think out loud, try a small example by hand, and share partial ideas  C) ask for the solution  D) switch languages

<details><summary>Answer</summary>

**B.**

</details>

### Q10. Order the steps

Put these in UMPIRE order: write code, state complexity, ask clarifying questions, identify a pattern, dry run, outline the plan.

<details><summary>Answer</summary>

Ask clarifying questions (U) → identify a pattern (M) → outline the plan (P) → write code (I) → dry run (R) → state complexity (E).

</details>

### Q11. Edge-case checklist

List five edge cases you should test for an array problem.

<details><summary>Answer</summary>

Empty array, one element, all equal / duplicates, negatives (and zero), already sorted / reverse sorted, very large values, answer at the first or last position.

</details>

## Mastery checklist

- [ ] I follow UMPIRE on every problem without being reminded.
- [ ] I always state a brute force and its complexity before optimising.
- [ ] I ask at least three clarifying questions and write examples before coding.
- [ ] I dry run my code on a normal and an edge case before saying "done".
- [ ] I scored at least 9/11 on this quiz.
