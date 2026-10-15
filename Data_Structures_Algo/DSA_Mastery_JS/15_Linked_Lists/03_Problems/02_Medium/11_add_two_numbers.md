# Add Two Numbers

| | |
|---|---|
| **Topic** | Linked Lists |
| **Difficulty** | Medium |
| **Pattern** | carry + dummy |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #2 — https://leetcode.com/problems/add-two-numbers/ |
| **Solution file** | [11_add_two_numbers.js](../solutions/11_add_two_numbers.js) — open only after a real attempt |

## Problem

Two non-empty linked lists represent two non-negative integers. The digits
are stored in REVERSE order (ones digit first). Add the numbers and return
the sum as a linked list in the same reversed format.

## Examples

```
Input: 2 -> 4 -> 3,  5 -> 6 -> 4   Output: 7 -> 0 -> 8   Explanation: 342 + 465 = 807
Input: 0, 0                        Output: 0
Input: 9 -> 9 -> 9,  1             Output: 0 -> 0 -> 0 -> 1   Explanation: 999 + 1 = 1000
```

## Constraints & clarifying questions

```
- Digits reversed (ones first)? (yes - that makes it easy: we add left to right)
- Can the lists have different lengths? (yes)
- Can the numbers be huge (more than 2^53)? (yes - so we must NOT convert to a JS number)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *carry + dummy* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (convert to numbers)   O(n+m) time, O(n+m) space. Read each list into a number, add, write the digits back.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (digit-by-digit with carry, like grade school)   O(max(n,m)) time, O(max(n,m)) space for the answer. Walk both lists together.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- different lengths
- final carry creates an extra node
- both zero
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (convert to numbers)   O(n+m) time, O(n+m) space

```
Read each list into a number, add, write the digits back. Breaks for long
lists because JavaScript numbers lose precision above 2^53. We use BigInt
here so the brute force is at least correct, but the interviewer wants the
digit-by-digit approach.
```

### APPROACH 2 — Optimal (digit-by-digit with carry, like grade school)   O(max(n,m)) time, O(max(n,m)) space for the answer

```
Walk both lists together. At each step:
  sum   = digitA + digitB + carry      (missing digit counts as 0)
  digit = sum % 10                     (goes into the new node)
  carry = floor(sum / 10)              (0 or 1)
Keep going while either list has nodes OR carry is 1.
Use a dummy head so the first node needs no special handling.

Dry run on 9 -> 9 -> 9  +  1:
  9+1+0 = 10 -> digit 0, carry 1       0
  9+0+1 = 10 -> digit 0, carry 1       0 -> 0
  9+0+1 = 10 -> digit 0, carry 1       0 -> 0 -> 0
  lists empty but carry=1 -> digit 1   0 -> 0 -> 0 -> 1
```

### Edge cases

```
- different lengths
- final carry creates an extra node
- both zero
```

Full JavaScript solution with tests: [11_add_two_numbers.js](../solutions/11_add_two_numbers.js). Run it with `node 11_add_two_numbers.js` from the solutions folder.

</details>

## Common mistakes

- Forgetting the final carry (e.g. 5 + 5 needs an extra node).
- Converting to numbers and back: overflows past 2^53.
- Stopping when one list ends instead of treating missing digits as 0.

## Related follow-ups

- Add Two Numbers II (LeetCode #445)
- [Sum of Two Integers](../../../14_Bit_Manipulation/03_Problems/02_Medium/11_sum_of_two_integers.md) (14_Bit_Manipulation)
- Multiply Strings (LeetCode #43)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
