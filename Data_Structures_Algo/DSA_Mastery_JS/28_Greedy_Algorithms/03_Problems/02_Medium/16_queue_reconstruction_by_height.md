# Queue Reconstruction by Height

| | |
|---|---|
| **Topic** | Greedy Algorithms |
| **Difficulty** | Medium |
| **Pattern** | sort + insert |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #406 — https://leetcode.com/problems/queue-reconstruction-by-height/ |
| **Solution file** | [16_queue_reconstruction_by_height.js](../solutions/16_queue_reconstruction_by_height.js) — open only after a real attempt |

## Problem

people[i] = [h, k]: person i has height h and there are exactly k people in front of them
in the queue with height >= h. The array is shuffled. Reconstruct the queue.

## Examples

```
Input: [[7,0],[4,4],[7,1],[5,0],[6,1],[5,2]]
Output: [[5,0],[7,0],[5,2],[6,1],[4,4],[7,1]]
  Explanation: e.g. [5,2] has exactly two people >= 5 ahead of it ([5,0] and [7,0])
```

## Constraints & clarifying questions

```
- Is a valid answer guaranteed to exist? (yes)
- Is it unique? (yes for valid input)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *sort + insert* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n! * n) time. Try every permutation and check the k values.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (sort tall-first, insert at index k)   O(n^2) time, O(n) space. Sort by height descending; for equal heights, by k ascending.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- single person -> same
- all same height -> sorted by k gives 0,1,2,...
- empty -> []
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n! * n) time

```
Try every permutation and check the k values. Only for tiny inputs.
```

### APPROACH 2 — Optimal (sort tall-first, insert at index k)   O(n^2) time, O(n) space

```
Sort by height descending; for equal heights, by k ascending. Then insert each person
into the result at index k.
```

### WHY GREEDY WORKS

```
Process tallest people first. When we insert a person, everyone already placed is at
least as tall, so "k people >= me in front" simply means "put me at index k". Shorter
people inserted LATER cannot break this: they are shorter, so they do not count toward
anyone taller's k, no matter where they land. Ties: for equal height, smaller k must come
first so that the later one counts the earlier one.

Dry run on [[7,0],[4,4],[7,1],[5,0],[6,1],[5,2]]:
  sorted: [7,0],[7,1],[6,1],[5,0],[5,2],[4,4]
  insert [7,0] at 0 -> [[7,0]]
  insert [7,1] at 1 -> [[7,0],[7,1]]
  insert [6,1] at 1 -> [[7,0],[6,1],[7,1]]
  insert [5,0] at 0 -> [[5,0],[7,0],[6,1],[7,1]]
  insert [5,2] at 2 -> [[5,0],[7,0],[5,2],[6,1],[7,1]]
  insert [4,4] at 4 -> [[5,0],[7,0],[5,2],[6,1],[4,4],[7,1]]
```

### Edge cases

```
- single person -> same
- all same height -> sorted by k gives 0,1,2,...
- empty -> []
```

Full JavaScript solution with tests: [16_queue_reconstruction_by_height.js](../solutions/16_queue_reconstruction_by_height.js). Run it with `node 16_queue_reconstruction_by_height.js` from the solutions folder.

</details>

## Common mistakes

- Sorting by height ascending - shorter people inserted first get shifted by taller ones later and their `k` breaks.
- Breaking height ties by `k` descending; equal heights must be sorted by `k` ascending.
- Using push + manual shifting with bugs; `splice(k, 0, person)` does the insert in one call.

## Related follow-ups

- [Hand of Straights](../02_Medium/12_hand_of_straights.md)
- Count of Smaller Numbers After Self (see [Divide and Conquer](../../../30_Divide_And_Conquer/03_Problems/03_Hard/06_count_of_smaller_numbers_after_self.md))
- Reveal Cards In Increasing Order (LeetCode #950)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
