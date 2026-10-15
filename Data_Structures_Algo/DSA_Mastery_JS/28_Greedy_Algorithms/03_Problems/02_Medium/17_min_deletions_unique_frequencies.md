# Minimum Deletions to Make Character Frequencies Unique

| | |
|---|---|
| **Topic** | Greedy Algorithms |
| **Difficulty** | Medium |
| **Pattern** | sort + decrement |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #1647 — https://leetcode.com/problems/minimum-deletions-to-make-character-frequencies-unique/ |
| **Solution file** | [17_min_deletions_unique_frequencies.js](../solutions/17_min_deletions_unique_frequencies.js) — open only after a real attempt |

## Problem

A string is "good" if no two different characters have the same frequency.
Return the minimum number of characters to delete to make s good.

## Examples

```
Input: "aab"        Output: 0   Explanation: a:2, b:1 already unique
Input: "aaabbbcc"   Output: 2   Explanation: delete two b's -> a:3, b:1, c:2
Input: "ceabaacb"   Output: 2   Explanation: a:3, b:2, c:2, e:1 -> delete one c and the e (c:1 clashes with e:1, so delete e too)
```

## Constraints & clarifying questions

```
- Lowercase only? (yes, so at most 26 distinct frequencies)
- Can a frequency drop to 0 (character removed entirely)? (yes, 0 is allowed to repeat)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *sort + decrement* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(26 * maxFreq^26) in theory. For each character try every target frequency 0..count; pick the combination with unique non-zero frequencies and the fewest deletions.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (sort frequencies descending, lower each clash)   O(n + 26 log 26) time, O(26) space. Sort counts from largest to smallest.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- all distinct characters (every freq 1) -> deletions until all but one are 0
- single character type -> 0
- frequencies collide down to 0 -> stop at 0, which is allowed to repeat
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(26 * maxFreq^26) in theory

```
For each character try every target frequency 0..count; pick the combination with unique
non-zero frequencies and the fewest deletions. Only tiny inputs; done here with recursion.
```

### APPROACH 2 — Optimal (sort frequencies descending, lower each clash)   O(n + 26 log 26) time, O(26) space

```
Sort counts from largest to smallest. Keep a set of used frequencies. For each count, while
it is > 0 and already used, decrement it (one deletion each). Then mark it used.
```

### WHY GREEDY WORKS

```
We can only DECREASE frequencies. Processing from the largest, each character takes the
highest free frequency at or below its count. Taking a lower one than necessary would only
waste deletions and push later (smaller) characters even lower. Exchange argument: swap any
optimal assignment to use the highest free slot for the current character - deletions never
increase.

Dry run on "aaabbbcc": counts [3,3,2] sorted desc
  3 -> free, used {3}
  3 -> taken, lower to 2 (1 deletion). 2 is free -> used {3,2}, deletions 1
  2 -> taken, lower to 1 (1 deletion). 1 is free -> used {3,2,1}, deletions 2 -> answer 2
```

### Edge cases

```
- all distinct characters (every freq 1) -> deletions until all but one are 0
- single character type -> 0
- frequencies collide down to 0 -> stop at 0, which is allowed to repeat
```

Full JavaScript solution with tests: [17_min_deletions_unique_frequencies.js](../solutions/17_min_deletions_unique_frequencies.js). Run it with `node 17_min_deletions_unique_frequencies.js` from the solutions folder.

</details>

## Common mistakes

- Decrementing a frequency below 0 - a character deleted completely has frequency 0, and many letters may share 0.
- Using a `Set` of used frequencies but forgetting to add the new frequency after decrementing.
- Trying to increase frequencies - you may only delete.

## Related follow-ups

- Minimum Increment to Make Array Unique (LeetCode #945)
- [Task Scheduler](../02_Medium/15_task_scheduler.md)
- Sort Characters By Frequency (LeetCode #451)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
