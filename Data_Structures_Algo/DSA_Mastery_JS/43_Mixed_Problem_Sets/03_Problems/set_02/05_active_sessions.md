# Active Sessions

| | |
|---|---|
| **Set** | [Mixed Set 02](README.md) — problem 05 of 5 |
| **Difficulty** | Medium |
| **Time box** | 25 minutes (then open Hint 1) |
| **Source** | Original exercise |
| **Solution file** | [05_active_sessions.js](solutions/05_active_sessions.js) — open only after a real attempt |

> The topic is hidden on purpose. Part of the skill being trained is recognizing the pattern on your own.

## Problem

A website logs user sessions as [start, end): a session is active at time t when
start <= t < end. Given the sessions and a list of query times, return for every query
how many sessions are active at that moment (answers in query order).

## Examples

```
Input: sessions = [[1, 5], [2, 3], [4, 8]], queries = [2, 3, 5, 0]   Output: [2, 1, 1, 0]
       Explanation: t=3 -> [2,3) already ended, only [1,5); t=5 -> only [4,8)
Input: sessions = [], queries = [1]                                  Output: [0]
```

## Constraints & clarifying questions

```
- Up to 10^5 sessions and 10^5 queries -> O(n * q) is too slow.
- Is end exclusive? (yes) Can start === end? (yes; such a session is never active)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 25 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1 — which patterns?</summary>

**Pattern.** Sorting + binary search (or a sweep line). See [Sorting](../../../11_Sorting/README.md) and [Searching / Binary Search](../../../10_Searching/README.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** For each query scan all sessions: O(n·q).

</details>

<details><summary>Hint 3</summary>

**The key idea.** Active at t = (starts ≤ t) − (ends ≤ t). Sort starts and ends separately; each count is one binary search.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- no sessions                 -> zeros
- query exactly at an end     -> that session is NOT counted (exclusive end)
- zero-length sessions        -> cancel out
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n * q) time, O(1) extra space

```
For each query, scan all sessions and count start <= t < end.
```

### APPROACH 2 — Optimal (sort starts and ends separately + binary search)   O((n + q) log n) time, O(n) space

```
active(t) = #(start <= t) - #(end <= t). Every session with end <= t also has
start <= t (start <= end), so the subtraction removes exactly the finished ones.
Both counts are "upper bound" binary searches on sorted arrays.

Dry run on sessions [[1,5],[2,3],[4,8]]:
  starts = [1, 2, 4]   ends = [3, 5, 8]
  t=2: starts <= 2 -> 2, ends <= 2 -> 0 -> 2
  t=3: starts <= 3 -> 2, ends <= 3 -> 1 -> 1
  t=5: starts <= 5 -> 3, ends <= 5 -> 2 -> 1
  t=0: 0 - 0 -> 0
```

### Edge cases

```
- no sessions                 -> zeros
- query exactly at an end     -> that session is NOT counted (exclusive end)
- zero-length sessions        -> cancel out
```

### Common mistakes

```
- Pairing starts and ends after sorting them separately (they no longer belong
  together — and you do not need them to).
- Using "< t" instead of "<= t" for the ends count.
```

Full JavaScript solution with tests: [05_active_sessions.js](solutions/05_active_sessions.js). Run it with `node solutions/05_active_sessions.js` from this folder.

</details>

## Related follow-ups

- Return the time with the most active sessions (sweep line)
- Sessions added and removed online (Fenwick tree)
- Inclusive ends

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Write down which pattern you did NOT see at first. That is the one to drill.
- Fill in the set's reflection checklist in [QUIZ.md](../../04_Interview_And_Assessment/QUIZ.md).
- Re-solve from scratch in 3 days, then in 1 week.
