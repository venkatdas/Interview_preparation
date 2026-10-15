# Majority Element

| | |
|---|---|
| **Topic** | Arrays |
| **Difficulty** | Easy |
| **Pattern** | Boyer-Moore voting |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #169 — https://leetcode.com/problems/majority-element/ |
| **Solution file** | [10_majority_element.js](../solutions/10_majority_element.js) — open only after a real attempt |

## Problem

Given an array of size n, return the majority element: the value that appears
MORE than n / 2 times. You may assume it always exists.

## Examples

```
Input: [3, 2, 3]               Output: 3
Input: [2, 2, 1, 1, 1, 2, 2]   Output: 2
```

## Constraints & clarifying questions

```
- Is a majority guaranteed to exist? (yes; otherwise do a second pass to verify the count)
- "More than n/2" strictly? (yes; with n = 4 you need at least 3 copies)
- O(1) space follow-up? (yes, that is the Boyer-Moore part)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *Boyer-Moore voting* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n^2) time, O(1) space. For each element count how many times it appears; return the first with count > n/2.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Boyer-Moore voting)   O(n) time, O(1) space. Keep a `candidate` and a `count`.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- Single element -> itself
- Majority appears at the very end
- All identical values
- Negative numbers
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^2) time, O(1) space

```
For each element count how many times it appears; return the first with count > n/2.
(Middle ground: count with a Map in O(n) time, O(n) space; or sort and return nums[n/2].)
```

### APPROACH 2 — Optimal (Boyer-Moore voting)   O(n) time, O(1) space

```
Keep a `candidate` and a `count`. Walk the array:
  - count === 0 -> adopt the current value as candidate
  - value === candidate -> count++, else count--
Intuition: every non-majority element can "cancel" one majority element, but the
majority has more than half the votes, so it can never be fully cancelled out.
Whatever candidate survives at the end is the majority.

Dry run on [2, 2, 1, 1, 1, 2, 2]:
  2: count 0 -> cand=2, count=1
  2: same    -> count=2
  1: diff    -> count=1
  1: diff    -> count=0
  1: count 0 -> cand=1, count=1
  2: diff    -> count=0
  2: count 0 -> cand=2, count=1   -> return 2
```

### Edge cases

```
- Single element -> itself
- Majority appears at the very end
- All identical values
- Negative numbers
```

Full JavaScript solution with tests: [10_majority_element.js](../solutions/10_majority_element.js). Run it with `node 10_majority_element.js` from the solutions folder.

</details>

## Common mistakes

- Assuming Boyer-Moore works when a majority might not exist; then a second counting pass is needed to verify.
- Resetting the candidate when count reaches 0 but forgetting to set count back to 1.
- Sorting (O(n log n)) and returning the middle is fine, but saying it is O(n) is wrong.

## Related follow-ups

- [Majority Element II](../../../41_Advanced_Algorithm_Design/01_Classic_Techniques/03_Problems/02_Medium/01_majority_element_ii.md) — elements appearing more than n/3 times, two candidates
- [Top K Frequent Elements](../../../05_Hashing/03_Problems/02_Medium/09_top_k_frequent_elements.md) — counting with a map, then selecting
- [Contains Duplicate](03_contains_duplicate.md) — the simplest counting question

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
