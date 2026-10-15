# Number of Recent Calls

| | |
|---|---|
| **Topic** | Queues and Deques |
| **Difficulty** | Easy |
| **Pattern** | time-window queue |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #933 — https://leetcode.com/problems/number-of-recent-calls/ |
| **Solution file** | [05_number_of_recent_calls.js](../solutions/05_number_of_recent_calls.js) — open only after a real attempt |

## Problem

Implement RecentCounter with ping(t): record a request at time t (ms) and
return how many requests happened in [t - 3000, t]. Calls to ping use
strictly increasing t.

## Examples

```
ping(1) -> 1   ping(100) -> 2   ping(3001) -> 3   ping(3002) -> 3
Explanation: at t=3002 the window is [2, 3002]; the ping at t=1 is out.
```

## Constraints & clarifying questions

```
- Is t strictly increasing? (yes - so old pings leave the window in order)
- Window inclusive on both ends? (yes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *time-window queue* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH — Optimal (queue of timestamps, drop the old ones)   amortized O(1) per ping, O(window) space. Because times only increase, the OLDEST pings expire first.

</details>

<details><summary>Hint 3</summary>

**Edge cases to handle.**

```
- first ping -> 1
- a gap larger than 3000 clears the queue down to the new ping
- t exactly 3000 later is still inside the window
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH — Optimal (queue of timestamps, drop the old ones)   amortized O(1) per ping, O(window) space

```
Because times only increase, the OLDEST pings expire first. That's a queue:
  enqueue t at the back
  while front < t - 3000: dequeue
  return size
Each timestamp is enqueued once and dequeued once -> amortized O(1).

Dry run: ping 1, 100, 3001, 3002
  ping 1     queue [1]                 -> 1
  ping 100   queue [1,100]             -> 2
  ping 3001  window [1,3001]: 1 stays   queue [1,100,3001]   -> 3
  ping 3002  window [2,3002]: drop 1    queue [100,3001,3002] -> 3
```

### NAIVE APPROACH   O(n) per ping, O(n) space

```
Store every t in an array; on each ping, count how many are >= t - 3000.
The array grows forever and every ping re-scans it.
```

### Edge cases

```
- first ping -> 1
- a gap larger than 3000 clears the queue down to the new ping
- t exactly 3000 later is still inside the window
```

Full JavaScript solution with tests: [05_number_of_recent_calls.js](../solutions/05_number_of_recent_calls.js). Run it with `node 05_number_of_recent_calls.js` from the solutions folder.

</details>

## Common mistakes

- Using `< t - 3000` vs `<= t - 3000` incorrectly (the window is inclusive [t - 3000, t]).
- Scanning the whole history on every ping (O(n) each).
- Using `shift()` on a huge array without noting its cost (fine here, but mention a head pointer).

## Related follow-ups

- [Design Hit Counter](../02_Medium/11_design_hit_counter.md)
- [Moving Average from Data Stream](06_moving_average.md)
- Logger Rate Limiter (LeetCode #359)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
