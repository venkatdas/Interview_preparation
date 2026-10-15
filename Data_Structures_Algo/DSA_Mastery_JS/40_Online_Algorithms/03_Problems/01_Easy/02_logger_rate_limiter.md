# Logger Rate Limiter

| | |
|---|---|
| **Topic** | Online Algorithms |
| **Difficulty** | Easy |
| **Pattern** | hash map of next-allowed time |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #359 — https://leetcode.com/problems/logger-rate-limiter/ |
| **Solution file** | [02_logger_rate_limiter.js](../solutions/02_logger_rate_limiter.js) — open only after a real attempt |

## Problem

Messages reach a logger together with a timestamp in seconds (timestamps never go down).
`shouldPrintMessage(timestamp, message)` returns true when that exact message has not been
printed during the previous 10 seconds. A printed message blocks the same message until
`timestamp + 10`. A blocked call is not printed and does not extend the block.

## Examples

```
(1,  "foo") -> true     "foo" blocked until 11
(2,  "bar") -> true     "bar" blocked until 12
(3,  "foo") -> false
(8,  "bar") -> false
(10, "foo") -> false
(11, "foo") -> true
```

## Constraints & clarifying questions

```
- timestamps non-decreasing; several calls may share a timestamp
- Ask: does a rejected call reset the clock? (no)
- Ask: is memory a concern for millions of distinct messages? (discuss cleanup)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** An *online decision per event* using a hash map. See "Rate limiters" in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** Keep a list of everything printed and scan it for the same message within the last 10 seconds.

</details>

<details><summary>Hint 3</summary>

**The key idea.** You only need ONE number per message: the earliest time it may print again. Map message -> nextAllowed.

</details>

<details><summary>Hint 4</summary>

**Edge cases.** Exactly 10 seconds later is allowed (`>=`). Same timestamp twice: the second is false. Only update the map when you actually print.

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### Brute force

Store every printed (time, message). For each call scan for the same message with `t - time < 10`. O(n) per call.

### Optimized approach

Map message -> next allowed time. O(1) per call.
```
when = map.get(msg)
if when !== undefined and t < when: return false
map.set(msg, t + 10); return true
```
Memory follow-up: keep a queue of (time, msg) for printed messages and delete map entries older than 10 s, so memory is bounded by the last 10 seconds of traffic.

### Dry run

```
t   msg   map before         print?   map after
1   foo   {}                 yes      {foo:11}
2   bar   {foo:11}           yes      {foo:11, bar:12}
3   foo   {foo:11, bar:12}   no       same
11  foo   {foo:11, bar:12}   yes      {foo:21, bar:12}
```

### Complexity

O(1) time per call, O(m) space for m distinct messages (O(last 10 s) with cleanup).

### Edge cases

- exactly 10 seconds apart
- same timestamp twice
- rejected call must not move the block

### Common mistakes

- Updating the map on a rejected call (extends the block forever under spam).
- Using `>` instead of `>=` at the boundary.

Full JavaScript solution with tests: [02_logger_rate_limiter.js](../solutions/02_logger_rate_limiter.js). Run it with `node 02_logger_rate_limiter.js` from the solutions folder.

</details>

## Related follow-ups

- Design Hit Counter (problem 04)
- Sliding-log and token-bucket limiters (streaming.js)
- Design Rate Limiter (system design)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
