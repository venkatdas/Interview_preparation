# Palindrome Linked List

| | |
|---|---|
| **Topic** | Linked Lists |
| **Difficulty** | Easy |
| **Pattern** | middle + reverse + compare |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #234 — https://leetcode.com/problems/palindrome-linked-list/ |
| **Solution file** | [07_palindrome_linked_list.js](../solutions/07_palindrome_linked_list.js) — open only after a real attempt |

## Problem

Given the head of a singly linked list, return true if the values read the
same forwards and backwards.

## Examples

```
Input: 1 -> 2 -> 2 -> 1   Output: true
Input: 1 -> 2             Output: false
Input: 1 -> 2 -> 3 -> 2 -> 1   Output: true
```

## Constraints & clarifying questions

```
- May I modify the list? (the O(1) space solution reverses half; ask, and
  offer to restore it afterwards)
- Follow-up: O(n) time and O(1) space?
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *middle + reverse + compare* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (copy to array)   O(n) time, O(n) space. Copy values into an array and compare with two pointers from both ends.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (find middle, reverse second half, compare)   O(n) time, O(1) space. 1.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- empty or single node -> true
- two equal nodes -> true, two different -> false
- odd length with a different middle is still a palindrome (1,2,1)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (copy to array)   O(n) time, O(n) space

```
Copy values into an array and compare with two pointers from both ends.
Simple and correct, but uses O(n) extra memory.
```

### APPROACH 2 — Optimal (find middle, reverse second half, compare)   O(n) time, O(1) space

```
1. Fast/slow pointers to find the end of the first half.
2. Reverse the second half in place.
3. Walk both halves together comparing values.
4. (Optional but polite) reverse the second half back to restore the input.

Dry run on 1 -> 2 -> 2 -> 1:
  step 1: slow stops at the first 2 (end of first half)
  step 2: reverse 2 -> 1 into 1 -> 2 ; list is now 1 -> 2 -> 2 <- 1 (visually)
  step 3: compare 1 vs 1 ok, 2 vs 2 ok -> true

The second half is never longer than the first half, so the compare loop runs
while the reversed half still has nodes. On an odd-length list the middle
node belongs to the first half and the loop ends before reaching it, which
is exactly what we want (the middle never needs comparing).
```

### Edge cases

```
- empty or single node -> true
- two equal nodes -> true, two different -> false
- odd length with a different middle is still a palindrome (1,2,1)
```

Full JavaScript solution with tests: [07_palindrome_linked_list.js](../solutions/07_palindrome_linked_list.js). Run it with `node 07_palindrome_linked_list.js` from the solutions folder.

</details>

## Common mistakes

- Comparing the reversed second half against the whole first half including the middle on odd length (skip or ignore the middle).
- Leaving the input list modified without restoring it (mention this to the interviewer).
- Reversing the whole list and losing the original order to compare with.

## Related follow-ups

- [Reverse Linked List](01_reverse_linked_list.md)
- [Middle of the Linked List](05_middle_of_linked_list.md)
- [Valid Palindrome](../../../04_Strings/03_Problems/01_Easy/02_valid_palindrome.md) (04_Strings)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
