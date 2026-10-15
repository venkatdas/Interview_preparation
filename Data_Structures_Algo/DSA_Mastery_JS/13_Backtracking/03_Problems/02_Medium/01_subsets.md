# Subsets

| | |
|---|---|
| **Topic** | Backtracking |
| **Difficulty** | Medium |
| **Pattern** | start index, record every node |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #78 — https://leetcode.com/problems/subsets/ |
| **Solution file** | [01_subsets.js](../solutions/01_subsets.js) — open only after a real attempt |

## Problem

Given an array of UNIQUE integers, return all possible subsets (the power set).
The order of subsets in the output does not matter.

## Examples

```
Input: [1,2,3]   Output: [[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]
Input: [0]       Output: [[],[0]]
```

## Constraints & clarifying questions

```
- Are the elements unique? (yes here; see Subsets II for duplicates)
- n is small (<= 10): the output has 2^n entries, so exponential is unavoidable.
- Does the order inside a subset or of the subsets matter? (no)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *start index, record every node* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (bit mask)   O(n * 2^n) time, O(n * 2^n) space (output). Every subset corresponds to an n-bit number: bit i set means "nums[i] is in".

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Backtracking with a start index)   O(n * 2^n) time, O(n) extra space. Every node in the decision tree is a valid subset, so we record the path on entry.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- []  -> [[]]  (the empty set has exactly one subset: itself)
- single element -> [[], [x]]
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (bit mask)   O(n * 2^n) time, O(n * 2^n) space (output)

```
Every subset corresponds to an n-bit number: bit i set means "nums[i] is in".
Loop mask from 0 to 2^n - 1 and collect the elements whose bit is set.
Not really "brute", it's a great iterative solution, but it hides the recursion
idea that interviewers want to see.
```

### APPROACH 2 — Optimal (Backtracking with a start index)   O(n * 2^n) time, O(n) extra space

```
Every node in the decision tree is a valid subset, so we record the path on entry.
To avoid producing [1,2] and [2,1] we only ever add elements AFTER the last one
we added (the `start` index).

Dry run on [1,2,3]:
  go(0, [])        record []
    push 1, go(1, [1])      record [1]
      push 2, go(2, [1,2])  record [1,2]
        push 3, go(3,[1,2,3]) record [1,2,3]; loop empty; pop 3
      pop 2
      push 3, go(3, [1,3])  record [1,3]; pop 3
    pop 1
    push 2, go(2, [2])      record [2]
      push 3, go(3, [2,3])  record [2,3]; pop 3
    pop 2
    push 3, go(3, [3])      record [3]; pop 3
  8 subsets recorded.
```

### Edge cases

```
- []  -> [[]]  (the empty set has exactly one subset: itself)
- single element -> [[], [x]]
```

Full JavaScript solution with tests: [01_subsets.js](../solutions/01_subsets.js). Run it with `node 01_subsets.js` from the solutions folder.

</details>

## Common mistakes

- Pushing `path` itself instead of a copy, so every stored subset ends up empty.
- Only recording at the leaves (depth n) and missing the smaller subsets, or forgetting the empty subset.
- Looping from 0 instead of `start`, which produces the same subset in several orders.

## Related follow-ups

- [Subsets II](02_subsets_ii.md)
- [Subsets](../../../14_Bit_Manipulation/03_Problems/02_Medium/14_subsets_bitmask.md) (14_Bit_Manipulation)
- [Combinations](05_combinations.md)
- Letter Case Permutation (LeetCode #784)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
