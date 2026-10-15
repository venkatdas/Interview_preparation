# Happy Number

| | |
|---|---|
| **Topic** | Mathematics for DSA |
| **Difficulty** | Easy |
| **Pattern** | Floyd cycle detection |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #202 — https://leetcode.com/problems/happy-number/ |
| **Solution file** | [05_happy_number.js](../solutions/05_happy_number.js) — open only after a real attempt |

## Problem

Replace a number by the sum of the squares of its digits, repeatedly. If you reach 1 the
number is "happy". If you loop forever without reaching 1 it is not. Return true if happy.

## Examples

```
Input: 19   Output: true    Explanation: 1+81=82, 64+4=68, 36+64=100, 1+0+0=1
Input: 2    Output: false   Explanation: 4, 16, 37, 58, 89, 145, 42, 20, 4, ... loops
```

## Constraints & clarifying questions

```
- n >= 1? (yes)
- How do I know it loops forever? (the sequence is bounded: a number with d digits maps to
  at most 81 * d, so values stay small and MUST eventually repeat)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *Floyd cycle detection* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (Set of seen values)   O(k) time, O(k) space, k = steps until repeat. Keep every value we have seen in a Set.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Floyd's cycle detection)   O(k) time, O(1) space. Treat next(n) as a linked-list "next pointer".

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- n = 1          -> true immediately
- n = 7          -> true (7, 49, 97, 130, 10, 1)
- large n        -> shrinks quickly, no overflow concern
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (Set of seen values)   O(k) time, O(k) space, k = steps until repeat

```
Keep every value we have seen in a Set. If we see a value again, we are in a loop -> false.
If we reach 1 -> true.
```

### APPROACH 2 — Optimal (Floyd's cycle detection)   O(k) time, O(1) space

```
Treat next(n) as a linked-list "next pointer". Move a slow pointer one step and a fast
pointer two steps. If they meet at 1 the number is happy. If they meet elsewhere, we are
in a cycle that does not contain 1. Same trick as detecting a cycle in a linked list
(see 15_Linked_Lists), with no memory needed.

Dry run on 19:
  slow=19 fast=19
  slow=82 fast=68
  slow=68 fast=1      fast reached 1 -> true
Dry run on 2:
  slow=4  fast=16
  slow=16 fast=58
  slow=37 fast=145
  slow=58 fast=20
  slow=89 fast=16
  slow=145 fast=58
  slow=42 fast=20
  slow=20 fast=16
  slow=4  fast=4      met at 4, not 1 -> false
```

### Edge cases

```
- n = 1          -> true immediately
- n = 7          -> true (7, 49, 97, 130, 10, 1)
- large n        -> shrinks quickly, no overflow concern
```

Full JavaScript solution with tests: [05_happy_number.js](../solutions/05_happy_number.js). Run it with `node 05_happy_number.js` from the solutions folder.

</details>

## Common mistakes

- Looping forever because you never detect the cycle; use a Set or Floyd's fast/slow pointers.
- Checking only whether the number returns to the start; the cycle may not include it.
- Summing digits instead of squares of digits.

## Related follow-ups

- [Linked List Cycle](../../../../15_Linked_Lists/03_Problems/01_Easy/03_linked_list_cycle.md) — Floyd on a list
- [Find the Duplicate Number](../../../../03_Arrays/03_Problems/02_Medium/18_find_the_duplicate_number.md) — Floyd on an index sequence
- [Add Digits](04_add_digits.md) — repeated digit transforms

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
