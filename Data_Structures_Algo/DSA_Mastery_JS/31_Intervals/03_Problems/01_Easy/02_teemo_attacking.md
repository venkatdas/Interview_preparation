# Teemo Attacking

| | |
|---|---|
| **Topic** | Intervals and Sweep Line |
| **Difficulty** | Easy |
| **Pattern** | adjacent overlap clip |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #495 — https://leetcode.com/problems/teemo-attacking/ |
| **Solution file** | [02_teemo_attacking.js](../solutions/02_teemo_attacking.js) — open only after a real attempt |

## Problem

timeSeries is a sorted list of attack times. Each attack poisons the target for
`duration` seconds starting at that second (attack at t covers t .. t+duration-1).
A new attack resets the timer (it does not stack). Return the total poisoned seconds.

## Examples

```
Input: timeSeries = [1,4], duration = 2   Output: 4   Explanation: 1-2 and 4-5
Input: timeSeries = [1,2], duration = 2   Output: 3   Explanation: 1-2 then reset to 2-3
```

## Constraints & clarifying questions

```
- Is timeSeries sorted ascending? (yes)
- Can two attacks happen at the same second? (treat as one; the formula handles it)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *adjacent overlap clip* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n * duration) time, O(n * duration) space. Put every poisoned second into a Set; return its size.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (clip each interval by the next start)   O(n) time, O(1) space. Each attack is the interval [t, t + duration).

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- empty -> 0
- single attack -> duration
- duration 0 -> 0
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n * duration) time, O(n * duration) space

```
Put every poisoned second into a Set; return its size.
```

### APPROACH 2 — Optimal (clip each interval by the next start)   O(n) time, O(1) space

```
Each attack is the interval [t, t + duration). Because the list is sorted, attack i
contributes min(duration, next - t) seconds: either its full duration, or only until the
next attack resets it. The last attack always contributes the full duration.

Dry run on [1,2], duration 2:
  i=0: min(2, 2-1) = 1
  last: 2            -> 3
```

### Edge cases

```
- empty -> 0
- single attack -> duration
- duration 0 -> 0
```

Full JavaScript solution with tests: [02_teemo_attacking.js](../solutions/02_teemo_attacking.js). Run it with `node 02_teemo_attacking.js` from the solutions folder.

</details>

## Common mistakes

- Adding `duration` for every attack and double-counting the overlap when attacks are closer than `duration` apart.
- Off-by-one on the overlap: an attack at t poisons `[t, t + duration - 1]`.
- Forgetting the last attack always contributes a full `duration`, or crashing on an empty list.

## Related follow-ups

- [Merge Intervals](../02_Medium/03_merge_intervals.md)
- [Car Pooling](../02_Medium/10_car_pooling.md)
- Summary Ranges (LeetCode #228)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
