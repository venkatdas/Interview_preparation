# Hand of Straights

| | |
|---|---|
| **Topic** | Greedy Algorithms |
| **Difficulty** | Medium |
| **Pattern** | sorted map greedy |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #846 — https://leetcode.com/problems/hand-of-straights/ |
| **Solution file** | [12_hand_of_straights.js](../solutions/12_hand_of_straights.js) — open only after a real attempt |

## Problem

You hold cards with integer values. You want to rearrange them into groups of exactly
groupSize consecutive cards (like 3,4,5). Return true if that is possible.

## Examples

```
Input: hand = [1,2,3,6,2,3,4,7,8], groupSize = 3   Output: true   Explanation: [1,2,3],[2,3,4],[6,7,8]
Input: hand = [1,2,3,4,5], groupSize = 4            Output: false  Explanation: 5 is not divisible by 4
```

## Constraints & clarifying questions

```
- Must every card be used? (yes)
- groupSize = 1? (always true)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *sorted map greedy* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n! / ...) time. Backtracking: pick any unused card, try to build a group of consecutive cards from it, recurse on the rest.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (count map + start from the smallest)   O(n log n) time, O(n) space. Count cards.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- hand.length % groupSize !== 0 -> false immediately
- groupSize = 1 -> true
- duplicates that need two overlapping groups ([1,1,2,2,3,3], 3) -> true
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n! / ...) time

```
Backtracking: pick any unused card, try to build a group of consecutive cards from it,
recurse on the rest. Exponential.
```

### APPROACH 2 — Optimal (count map + start from the smallest)   O(n log n) time, O(n) space

```
Count cards. Repeatedly take the SMALLEST remaining value v and remove one copy of each
v, v+1, ..., v+groupSize-1. If any is missing, return false.
```

### WHY GREEDY WORKS

```
The smallest card has no smaller neighbour, so it can only be the FIRST card of its group.
That group is therefore forced to be [v, v+1, ..., v+groupSize-1] - there is no choice to
get wrong. Remove it and the argument repeats on what is left.

Dry run on [1,2,3,6,2,3,4,7,8], groupSize 3:
  counts {1:1, 2:2, 3:2, 4:1, 6:1, 7:1, 8:1}
  smallest 1 -> remove 1,2,3 -> {2:1, 3:1, 4:1, 6:1, 7:1, 8:1}
  smallest 2 -> remove 2,3,4 -> {6:1, 7:1, 8:1}
  smallest 6 -> remove 6,7,8 -> {} -> true
```

### Edge cases

```
- hand.length % groupSize !== 0 -> false immediately
- groupSize = 1 -> true
- duplicates that need two overlapping groups ([1,1,2,2,3,3], 3) -> true
```

Full JavaScript solution with tests: [12_hand_of_straights.js](../solutions/12_hand_of_straights.js). Run it with `node 12_hand_of_straights.js` from the solutions folder.

</details>

## Common mistakes

- Starting a group from any card instead of the SMALLEST remaining card (only the smallest is forced to start a group).
- Forgetting the quick check `hand.length % groupSize !== 0` -> false.
- Decrementing counts by 1 when the smallest card appears several times - start that many groups at once.

## Related follow-ups

- Divide Array in Sets of K Consecutive Numbers (LeetCode #1296) - same problem
- Split Array into Consecutive Subsequences (LeetCode #659)
- [Queue Reconstruction by Height](../02_Medium/16_queue_reconstruction_by_height.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
