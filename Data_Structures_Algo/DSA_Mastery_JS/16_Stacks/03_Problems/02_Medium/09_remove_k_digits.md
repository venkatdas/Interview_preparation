# Remove K Digits

| | |
|---|---|
| **Topic** | Stacks |
| **Difficulty** | Medium |
| **Pattern** | monotonic stack (greedy) |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #402 — https://leetcode.com/problems/remove-k-digits/ |
| **Solution file** | [09_remove_k_digits.js](../solutions/09_remove_k_digits.js) — open only after a real attempt |

## Problem

Given a string num representing a non-negative integer and an integer k,
remove k digits so that the remaining number is the SMALLEST possible.
Return it as a string without leading zeros ("0" if nothing is left).

## Examples

```
Input: num = "1432219", k = 3   Output: "1219"   Explanation: remove 4, 3, 2
Input: num = "10200", k = 1     Output: "200"    Explanation: remove the 1, drop leading zeros
Input: num = "10", k = 2        Output: "0"
```

## Constraints & clarifying questions

```
- k <= num.length? (yes)
- Must strip leading zeros from the answer? (yes)
- Return "0" rather than ""? (yes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *monotonic stack (greedy)* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (try all combinations)   O(C(n,k) * n) time. Generate every way to keep n-k digits, compare as numbers.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (greedy with a monotonic increasing stack)   O(n) time, O(n) space. Key insight: the number is smallest when its digits are as small as possible from the LEFT.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- k === num.length -> "0"
- already increasing digits ("12345", k=2) -> remove from the end -> "123"
- leading zeros after removal ("10200", k=1)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (try all combinations)   O(C(n,k) * n) time

```
Generate every way to keep n-k digits, compare as numbers. Exponential.
We implement it with recursion for tiny inputs only, to verify the greedy.
```

### APPROACH 2 — Optimal (greedy with a monotonic increasing stack)   O(n) time, O(n) space

```
Key insight: the number is smallest when its digits are as small as possible
from the LEFT. So whenever a digit is smaller than the one before it, the
previous (bigger) digit should be removed - that "peak" is hurting us most.
  for each digit: while k > 0 and stack.top > digit: pop, k--
  push digit
If k is still > 0 after the loop, the stack is non-decreasing: remove from the END.
Finally strip leading zeros.

Dry run on "1432219", k=3:
  1  push                 [1]
  4  push                 [1,4]
  3  4>3 pop (k=2) push   [1,3]
  2  3>2 pop (k=1) push   [1,2]
  2  push                 [1,2,2]
  1  2>1 pop (k=0) push   [1,2,1]
  9  push                 [1,2,1,9]
  k=0 -> "1219"
```

### Edge cases

```
- k === num.length -> "0"
- already increasing digits ("12345", k=2) -> remove from the end -> "123"
- leading zeros after removal ("10200", k=1)
```

Full JavaScript solution with tests: [09_remove_k_digits.js](../solutions/09_remove_k_digits.js). Run it with `node 09_remove_k_digits.js` from the solutions folder.

</details>

## Common mistakes

- Forgetting to remove remaining k digits from the end when the stack is non-decreasing.
- Not stripping leading zeros, or returning `""` instead of `"0"`.
- Popping on `>=`, which removes equal digits needlessly (still correct in value but wasteful); be precise.

## Related follow-ups

- Remove Duplicate Letters (LeetCode #316)
- [Daily Temperatures](05_daily_temperatures.md)
- Create Maximum Number (LeetCode #321)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
