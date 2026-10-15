# Design Hit Counter

| | |
|---|---|
| **Topic** | Queues and Deques |
| **Difficulty** | Medium |
| **Pattern** | time-window queue + counts |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #362 — https://leetcode.com/problems/design-hit-counter/ |
| **Solution file** | [11_design_hit_counter.js](../solutions/11_design_hit_counter.js) — open only after a real attempt |

## Problem

Design a counter that records hits and returns the number of hits in the
past 5 minutes (300 seconds). Timestamps are in seconds and arrive in
non-decreasing order (several hits can share a timestamp).
  hit(timestamp)      record one hit
  getHits(timestamp)  hits in (timestamp - 300, timestamp]

## Examples

```
hit(1) hit(2) hit(3)  getHits(4) -> 3
hit(300)              getHits(300) -> 4
                      getHits(301) -> 3   Explanation: the hit at t=1 is now outside
```

## Constraints & clarifying questions

```
- Timestamps monotonic? (yes -> queue works. If not, you'd need a sorted structure)
- Many hits at the SAME second? (yes -> follow-up: store [timestamp, count] pairs
  instead of one entry per hit, so memory stays O(300))
- Window is (t-300, t]: a hit exactly 300s old does NOT count
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *time-window queue + counts* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH — Optimal (queue of [timestamp, count], expire from the front). hit(t):     if the back has the same timestamp, count++ ; else enqueue [t, 1].

</details>

<details><summary>Hint 3</summary>

**Edge cases to handle.**

```
- getHits before any hit -> 0
- many hits in one second (count compression)
- huge gap in time clears the whole queue
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH — Optimal (queue of [timestamp, count], expire from the front)

```
hit(t):     if the back has the same timestamp, count++ ; else enqueue [t, 1]. total++
  getHits(t): while front.timestamp <= t - 300: total -= front.count, dequeue
              return total
Memory is bounded by 300 distinct seconds. Each entry is enqueued and
dequeued once -> amortized O(1).

Dry run: hit 1,2,3 ; getHits 4 ; hit 300 ; getHits 300 ; getHits 301
  hits        queue [[1,1],[2,1],[3,1]]   total 3
  getHits 4   front 1 > 4-300 -> keep. -> 3
  hit 300     queue [...,[300,1]]         total 4
  getHits 300 -> 4
  getHits 301 front 1 <= 1 -> drop. 2 <= 1? no. -> 3
```

### NAIVE APPROACH   O(n) per getHits, unbounded memory

```
Store all timestamps in an array; getHits filters. Memory never shrinks.
```

### Edge cases

```
- getHits before any hit -> 0
- many hits in one second (count compression)
- huge gap in time clears the whole queue
```

Full JavaScript solution with tests: [11_design_hit_counter.js](../solutions/11_design_hit_counter.js). Run it with `node 11_design_hit_counter.js` from the solutions folder.

</details>

## Common mistakes

- Off-by-one on the 300-second window boundary.
- Storing every hit forever (memory grows without bound).
- Assuming timestamps can arrive out of order without asking.

## Related follow-ups

- [Number of Recent Calls](../01_Easy/05_number_of_recent_calls.md)
- [Moving Average from Data Stream](../01_Easy/06_moving_average.md)
- Logger Rate Limiter (LeetCode #359)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
