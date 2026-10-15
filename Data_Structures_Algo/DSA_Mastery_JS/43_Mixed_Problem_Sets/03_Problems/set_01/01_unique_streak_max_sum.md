# Unique Streak Max Sum

| | |
|---|---|
| **Set** | [Mixed Set 01](README.md) — problem 01 of 5 |
| **Difficulty** | Easy |
| **Time box** | 15 minutes (then open Hint 1) |
| **Source** | Original exercise |
| **Solution file** | [01_unique_streak_max_sum.js](solutions/01_unique_streak_max_sum.js) — open only after a real attempt |

> The topic is hidden on purpose. Part of the skill being trained is recognizing the pattern on your own.

## Problem

A game records the point value of every round in an array `nums`. A "streak" is any
k consecutive rounds whose point values are all different from each other.
Return the largest total of any streak. If no streak of length k exists, return null.

## Examples

```
Input: nums = [4, 2, 4, 5, 6], k = 3   Output: 15    Explanation: [4,5,6]; [4,2,4] repeats 4
Input: nums = [1, 1, 1], k = 2         Output: null  Explanation: every window repeats a value
Input: nums = [-3, -1, -2], k = 1      Output: -1    Explanation: any single round is a streak
```

## Constraints & clarifying questions

```
- 1 <= k; nums may be shorter than k (then return null).
- Values can be negative, so "no streak" cannot be signalled with 0 -> return null.
- Integers fit safely in a JS number.
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 15 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1 — which patterns?</summary>

**Pattern.** Fixed-size sliding window + a frequency hash map. See [Sliding Window](../../../07_Sliding_Window/README.md) and [Hashing](../../../05_Hashing/README.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** Write the O(n·k) version first: for each start, build a Set of the window and check its size.

</details>

<details><summary>Hint 3</summary>

**The key idea.** When the window slides, only two values change. Keep a count map and a counter of "values that appear twice or more" so the distinct check is O(1).

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- nums.length < k              -> null
- all values negative          -> answer is negative (do not start best at 0)
- k === 1                      -> max element
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n * k) time, O(k) space

```
For every start index i, build a Set of nums[i..i+k-1] and add up the window.
If the Set has k elements, the window is a streak; keep the best sum.
```

### APPROACH 2 — Optimal (fixed sliding window + frequency map)   O(n) time, O(k) space

```
Slide a window of size k. Keep a running sum and a Map value -> count, plus a counter
`dupes` = how many values currently appear more than once. Add the new right value,
remove the value that leaves on the left, update sum/dupes in O(1). A full window with
dupes === 0 is a streak.

Dry run on nums = [4, 2, 4, 5, 6], k = 3:
  right=0 add 4   sum=4  counts{4:1}            dupes=0  (window not full)
  right=1 add 2   sum=6  counts{4:1,2:1}        dupes=0  (window not full)
  right=2 add 4   sum=10 counts{4:2,2:1}        dupes=1  full, dupes>0 -> skip
  right=3 add 5, drop 4  sum=11 counts{4:1,2:1,5:1} dupes=0 -> best=11
  right=4 add 6, drop 2  sum=15 counts{4:1,5:1,6:1} dupes=0 -> best=15
  answer 15
```

### Edge cases

```
- nums.length < k              -> null
- all values negative          -> answer is negative (do not start best at 0)
- k === 1                      -> max element
```

### Common mistakes

```
- Starting best at 0 and returning 0 for "none": wrong when every streak is negative.
- Checking distinctness by rebuilding a Set every step: correct but O(n * k).
- Forgetting to decrement `dupes` when a count drops from 2 to 1.
```

Full JavaScript solution with tests: [01_unique_streak_max_sum.js](solutions/01_unique_streak_max_sum.js). Run it with `node solutions/01_unique_streak_max_sum.js` from this folder.

</details>

## Related follow-ups

- Variable-size version: longest streak with all distinct values (LeetCode #3 style)
- Allow at most one repeated value inside the streak
- Return the start index of the best streak

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Write down which pattern you did NOT see at first. That is the one to drill.
- Fill in the set's reflection checklist in [QUIZ.md](../../04_Interview_And_Assessment/QUIZ.md).
- Re-solve from scratch in 3 days, then in 1 week.
