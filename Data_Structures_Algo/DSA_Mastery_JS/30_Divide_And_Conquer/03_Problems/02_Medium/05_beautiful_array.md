# Beautiful Array

| | |
|---|---|
| **Topic** | Divide and Conquer |
| **Difficulty** | Medium |
| **Pattern** | odd/even affine construction |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #932 — https://leetcode.com/problems/beautiful-array/ |
| **Solution file** | [05_beautiful_array.js](../solutions/05_beautiful_array.js) — open only after a real attempt |

## Problem

An array is beautiful if it is a permutation of 1..n and for every i < k < j there is
NO index k with 2 * nums[k] = nums[i] + nums[j] (no element is the average of two
elements around it). Return any beautiful array of length n.

## Examples

```
Input: 4   Output: [2,1,4,3]  (one valid answer)
Input: 5   Output: [3,1,2,5,4]
```

## Constraints & clarifying questions

```
- n up to 1000 -> cannot enumerate permutations
- Any valid answer is accepted
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *odd/even affine construction* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (backtracking)   O(n!) worst case. Build the permutation one element at a time and check the average condition against every pair placed so far.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Divide & conquer: odds on the left, evens on the right)   O(n log n). Key facts: 1.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- n = 1 -> [1]
- n = 2 -> [1,2]
- verify the output with an independent checker in tests
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (backtracking)   O(n!) worst case

```
Build the permutation one element at a time and check the average condition against
every pair placed so far. Only feasible for n <= 8 or so.
```

### APPROACH 2 — Optimal (Divide & conquer: odds on the left, evens on the right)   O(n log n)

```
Key facts:
  1. If A is beautiful, so is 2A - 1 (all odd) and 2A (all even): the condition is
     preserved under affine maps x -> ax + b.
  2. Concatenating an all-odd beautiful array with an all-even one is beautiful: for i in
     the odd part and j in the even part, nums[i] + nums[j] is odd, so no integer k is
     their average.
So beautiful(n) = [2x - 1 for x in beautiful(ceil(n/2))] + [2x for x in beautiful(floor(n/2))].
Base: beautiful(1) = [1].

Dry run n = 5:
  beautiful(3) = odds of beautiful(2) + evens of beautiful(1)
    beautiful(2) = odds of [1] + evens of [1] = [1] + [2] = [1,2]
    -> [1,3] + [2] = [1,3,2]
  beautiful(2) = [1,2]
  beautiful(5) = [1,5,3] + [2,4] = [1,5,3,2,4]
```

### Edge cases

```
- n = 1 -> [1]
- n = 2 -> [1,2]
- verify the output with an independent checker in tests
```

Full JavaScript solution with tests: [05_beautiful_array.js](../solutions/05_beautiful_array.js). Run it with `node 05_beautiful_array.js` from the solutions folder.

</details>

## Common mistakes

- Trying to search permutations - n! is hopeless beyond n = 10.
- Mapping with the wrong transforms; use `2x - 1` for the odd half and `2x` for the even half.
- Not trimming values above n when building from a larger beautiful array.

## Related follow-ups

- [Different Ways to Add Parentheses](../02_Medium/03_different_ways_to_add_parentheses.md)
- Construct the Lexicographically Largest Valid Sequence (LeetCode #1718)
- Gray Code (LeetCode #89)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
