# Boats to Save People

| | |
|---|---|
| **Topic** | Two Pointers |
| **Difficulty** | Medium |
| **Pattern** | sort + greedy pairing |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #881 — https://leetcode.com/problems/boats-to-save-people/ |
| **Solution file** | [17_boats_to_save_people.js](../solutions/17_boats_to_save_people.js) — open only after a real attempt |

## Problem

people[i] is the weight of person i. Each boat carries at most 2 people and at most
`limit` total weight. Every person weighs <= limit. Return the minimum number of boats.

## Examples

```
Input: people = [1, 2], limit = 3         Output: 1   Explanation: (1, 2)
Input: people = [3, 2, 2, 1], limit = 3   Output: 3   Explanation: (1, 2), (2), (3)
Input: people = [3, 5, 3, 4], limit = 5   Output: 4   Explanation: nobody can share
```

## Constraints & clarifying questions

```
- At most 2 per boat, not "as many as fit"? (yes, exactly this rule makes two pointers work)
- Every person fits alone? (guaranteed)
- Can I sort? (yes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *sort + greedy pairing* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   exponential. Try all ways of pairing people.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (sort + greedy opposite ends)   O(n log n) time, O(1) extra space. Sort.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- One person -> 1
- Everyone exactly limit -> n boats
- All pairs fit -> ceil(n / 2)
- Empty -> 0
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   exponential

```
Try all ways of pairing people. Only to illustrate; we implement a small backtracking
version for tests on tiny inputs.
```

### APPROACH 2 — Optimal (sort + greedy opposite ends)   O(n log n) time, O(1) extra space

```
Sort. The HEAVIEST person must take a boat. Who should share it? The LIGHTEST person
is the best candidate: if even the lightest can't fit with the heaviest, nobody can,
and the heaviest goes alone. If the lightest fits, pairing them is never worse than
pairing the lightest with someone else (exchange argument: any other partner could be
swapped in later).
  light = 0, heavy = n - 1
  while light <= heavy:
    if people[light] + people[heavy] <= limit: light++   (they share)
    heavy--                                              (heavy always boards)
    boats++

Dry run on sorted [1, 2, 2, 3], limit 3:
  light=0(1) heavy=3(3): 1+3=4 > 3 -> heavy alone. heavy=2, boats=1
  light=0(1) heavy=2(2): 1+2=3 <= 3 -> share. light=1, heavy=1, boats=2
  light=1(2) heavy=1(2): same person -> boards alone. heavy=0, boats=3
  light > heavy stop. 3
```

### Edge cases

```
- One person -> 1
- Everyone exactly limit -> n boats
- All pairs fit -> ceil(n / 2)
- Empty -> 0
```

Full JavaScript solution with tests: [17_boats_to_save_people.js](../solutions/17_boats_to_save_people.js). Run it with `node 17_boats_to_save_people.js` from the solutions folder.

</details>

## Common mistakes

- Forgetting to sort first.
- Trying to pair the heaviest person with the *next heaviest* instead of the lightest.
- Not counting a boat when the heaviest person rides alone.

## Related follow-ups

- [Two Sum II - Input Array Is Sorted](03_two_sum_ii_sorted.md) — pairs from opposite ends
- [Assign Cookies](../../../28_Greedy_Algorithms/03_Problems/01_Easy/01_assign_cookies.md) — another sort-then-match greedy
- [Partition Labels](18_partition_labels.md) — greedy grouping

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
