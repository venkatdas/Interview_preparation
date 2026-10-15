# Design Hit Counter

| | |
|---|---|
| **Topic** | Online Algorithms |
| **Difficulty** | Medium |
| **Pattern** | circular time buckets / queue |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #362 — https://leetcode.com/problems/design-hit-counter/ |
| **Solution file** | [04_design_hit_counter.js](../solutions/04_design_hit_counter.js) — open only after a real attempt |

## Problem

Design a counter of hits in the last 5 minutes. `hit(t)` records a hit at second t and
`getHits(t)` returns how many hits happened in the last 300 seconds, i.e. with time in
`(t - 300, t]`. Calls arrive with non-decreasing timestamps and several hits can share one
second.

## Examples

```
hit(1); hit(2); hit(3)
getHits(4)   -> 3
hit(300)
getHits(300) -> 4
getHits(301) -> 3     the hit at second 1 has expired
```

## Constraints & clarifying questions

```
- timestamps non-decreasing (online, in order)
- Follow-up: what if there are millions of hits per second? (memory must not grow with hits)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** *Sliding time window* over an ordered stream. See "Moving averages" and "Rate limiters" in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** Store every timestamp; count those with `time > t - 300`. A queue lets you drop expired ones from the front.

</details>

<details><summary>Hint 3</summary>

**The key idea.** For the follow-up, group hits by second: 300 buckets indexed by `t % 300`, each holding (time, count). A bucket whose stored time is old gets reset on the next hit.

</details>

<details><summary>Hint 4</summary>

**Edge cases.** A hit exactly 300 seconds ago is expired. Long silent gaps leave stale buckets — the time check ignores them.

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### Brute force

Store all timestamps; `getHits` filters `time > t - 300`. O(n) per query, O(n) memory.

### Optimized approach

300 circular buckets (time[i], count[i]). O(1) hit, O(300) getHits, O(300) memory regardless of traffic.
```
hit(t):   i = t % 300; if time[i] != t: time[i] = t, count[i] = 1 else count[i]++
getHits:  sum count[i] where time[i] > t - 300
```
A deque of (second, count) pairs is the other good answer: amortised O(1) and memory bounded by 300 entries.

### Dry run

```
hit 1 -> b[1]=(1,1); hit 2 -> b[2]=(2,1); hit 3 -> b[3]=(3,1)
getHits(4): all three times > -296 -> 3
hit 300 -> b[0]=(300,1)
getHits(301): times > 1 -> b[2], b[3], b[0] -> 3
```

### Complexity

Buckets: O(1) hit, O(W) query, O(W) space with W = 300. Queue: O(1) amortised, memory O(hits in window).

### Edge cases

- query before any hit -> 0
- many hits in one second
- gap longer than the window

### Common mistakes

- Using `>=` at the boundary (counts a hit from exactly 300 seconds ago).
- Forgetting to reset a reused bucket.

Full JavaScript solution with tests: [04_design_hit_counter.js](../solutions/04_design_hit_counter.js). Run it with `node 04_design_hit_counter.js` from the solutions folder.

</details>

## Related follow-ups

- Logger Rate Limiter (problem 02)
- Time Based Key-Value Store (LeetCode #981)
- Sliding-window rate limiter (streaming.js)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
