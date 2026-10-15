# Largest Number

| | |
|---|---|
| **Topic** | Sorting |
| **Difficulty** | Medium |
| **Pattern** | custom comparator |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #179 — https://leetcode.com/problems/largest-number/ |
| **Solution file** | [05_largest_number.js](../solutions/05_largest_number.js) — open only after a real attempt |

## Problem

Given a list of non-negative integers, arrange them so that they form the largest
possible number. Return it as a string (it may be too big for a number type).

## Examples

```
Input: [10,2]           Output: "210"
Input: [3,30,34,5,9]    Output: "9534330"
Input: [0,0]            Output: "0"      (not "00")
```

## Constraints & clarifying questions

```
- Non-negative only? (yes)
- All zeros -> "0" (strip the leading zeros case)
- n <= 100, values <= 10^9
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *custom comparator* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (all permutations)   O(n! * n). Try every ordering, join, keep the largest (compare by length, then lexicographically).

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (custom comparator: a before b if a+b > b+a)   O(n log n * d) time. Sorting by numeric value is wrong: 3 vs 30 -> "330" beats "303", but 3 &lt; 30.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- [0] -> "0"; [0,0] -> "0"
- single element
- same digits different lengths: [12,121] -> "12121" (12 first: "12121" > "12112")
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (all permutations)   O(n! * n)

```
Try every ordering, join, keep the largest (compare by length, then lexicographically).
Only feasible for n <= 8; included to validate the comparator on small inputs.
```

### APPROACH 2 — Optimal (custom comparator: a before b if a+b > b+a)   O(n log n * d) time

```
Sorting by numeric value is wrong: 3 vs 30 -> "330" beats "303", but 3 < 30.
Instead compare the two possible concatenations. For strings a and b, put a first
if a + b > b + a (as strings of digits, same length so string compare works).
This comparator is transitive (provable), so it is a valid sort order.
After sorting, if the first element is "0" everything is zero -> return "0".

Dry run [3,30,34,5,9] -> strings:
  compare 3 vs 30: "330" > "303" -> 3 first
  compare 3 vs 34: "334" < "343" -> 34 first
  sorted: ["9","5","34","3","30"] -> "9534330"
```

### Edge cases

```
- [0] -> "0"; [0,0] -> "0"
- single element
- same digits different lengths: [12,121] -> "12121" (12 first: "12121" > "12112")
```

Full JavaScript solution with tests: [05_largest_number.js](../solutions/05_largest_number.js). Run it with `node 05_largest_number.js` from the solutions folder.

</details>

## Common mistakes

- Sorting numbers descending; 9 must come before 34 because "934" > "349".
- Returning "00" for `[0, 0]`; the answer is "0".
- Writing a comparator that returns a boolean instead of a number.

## Related follow-ups

- [Sort an Array](01_sort_an_array.md) — comparator basics
- Smallest Value of the Rearranged Number (LeetCode #2165) — digit ordering with sign handling
- [Next Permutation](../../../03_Arrays/03_Problems/02_Medium/15_next_permutation.md) — ordering by digit arrangement

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
