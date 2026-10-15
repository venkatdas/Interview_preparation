# Shortest Burst

| | |
|---|---|
| **Set** | [Mixed Set 06](README.md) — problem 02 of 5 |
| **Difficulty** | Hard |
| **Time box** | 30 minutes (then open Hint 1) |
| **Source** | Original exercise |
| **Solution file** | [02_shortest_burst.js](solutions/02_shortest_burst.js) — open only after a real attempt |

> The topic is hidden on purpose. Part of the skill being trained is recognizing the pattern on your own.

## Problem

A trading bot records the profit of each minute in `nums` (can be negative). A "burst"
is a contiguous run of minutes whose total profit is at least k. Return the length of
the shortest burst, or -1 if none exists.

## Examples

```
Input: nums = [2, -1, 2], k = 3          Output: 3
Input: nums = [1, 2, -5, 4, 1], k = 5    Output: 2   Explanation: [4, 1]
Input: nums = [-1, -2], k = 1            Output: -1
```

## Constraints & clarifying questions

```
- n up to 10^5, values in [-10^5, 10^5], k >= 1.
- Negative profits are allowed (that is what makes it hard).
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1 — which patterns?</summary>

**Pattern.** Prefix sums + a monotonic deque of candidate starts. See [Prefix Sums & Difference Arrays](../../../08_Prefix_Sums_And_Difference_Arrays/README.md) and [Monotonic Stacks & Queues](../../../18_Monotonic_Stacks_And_Queues/README.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** For each start extend until the sum reaches k: O(n²).

</details>

<details><summary>Hint 3</summary>

**The key idea.** Shortest j − i with P[j] − P[i] ≥ k. A start i is useless if a later start has a smaller or equal prefix. Keep increasing prefixes in a deque and pop from the front once a start is used.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- a single element >= k -> 1
- all negative -> -1
- large positive at the end after big negatives
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^2) time, O(1) space

```
For each start, extend the end with a running sum; stop at the first end reaching k.
```

### APPROACH 2 — Optimal (prefix sums + monotonic deque of candidate starts)   O(n) time, O(n) space

```
Prefix sums P (P[0] = 0). We want the shortest j - i with P[j] - P[i] >= k, i < j.
Keep a deque of start indices with INCREASING prefix values:
  - while P[j] - P[front] >= k: record j - front and pop the front (any later j would
    only give a longer burst for that start);
  - while P[back] >= P[j]: pop the back (j is a later AND not-larger start, so it
    dominates);
  - push j.

Dry run on [1, 2, -5, 4, 1], k = 5:  P = [0, 1, 3, -2, 2, 3]
  j=0 dq [0]
  j=1 P=1: 1-0<5; push        dq [0,1]
  j=2 P=3: 3-0<5; push        dq [0,1,2]
  j=3 P=-2: pop backs 2,1,0 (all >= -2); push  dq [3]
  j=4 P=2: 2-(-2)=4<5; push   dq [3,4]
  j=5 P=3: 3-(-2)=5>=5 -> len 2, pop 3; 3-2=1<5; pop back 4 (2 >= 3? no) push dq [4,5]
  answer 2
```

### Edge cases

```
- a single element >= k -> 1
- all negative -> -1
- large positive at the end after big negatives
```

### Common mistakes

```
- Using the classic two-pointer window: with negatives, shrinking may skip answers.
- Popping the back with > instead of >= (keeps a dominated start; still correct, slower).
```

Full JavaScript solution with tests: [02_shortest_burst.js](solutions/02_shortest_burst.js). Run it with `node solutions/02_shortest_burst.js` from this folder.

</details>

## Related follow-ups

- All values positive (plain sliding window works — why?)
- Longest subarray with sum ≥ k
- Sum exactly k with negatives (hash map of prefixes)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Write down which pattern you did NOT see at first. That is the one to drill.
- Fill in the set's reflection checklist in [QUIZ.md](../../04_Interview_And_Assessment/QUIZ.md).
- Re-solve from scratch in 3 days, then in 1 week.
