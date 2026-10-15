# Lazy Range Iterable

| | |
|---|---|
| **Topic** | Programming Fundamentals |
| **Difficulty** | Medium |
| **Pattern** | iteration protocol, half-open ranges |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | Original exercise |
| **Solution file** | [08_range_iterable.js](../solutions/08_range_iterable.js) — open only after a real attempt |

## Problem

Implement lazyRange(start, end, step = 1) that returns an ITERABLE (usable with
for...of and spread) producing start, start + step, ... and stopping BEFORE end
(half-open, like Python's range). It must:
  - support negative steps (counting down: stop when value <= end)
  - throw RangeError for step 0
  - be lazy: lazyRange(0, Infinity) must not hang until you consume it
  - be re-iterable: spreading the same range twice gives the same values twice
Also expose size(): how many values it will produce, computed WITHOUT iterating.

## Examples

```
Input: lazyRange(0, 5)          Values: [0, 1, 2, 3, 4]      size 5
Input: lazyRange(1, 10, 3)      Values: [1, 4, 7]            size 3
Input: lazyRange(5, 0, -2)      Values: [5, 3, 1]            size 3
Input: lazyRange(3, 3)          Values: []                   size 0
Input: lazyRange(0, 5, -1)      Values: []  (wrong direction) size 0
```

## Constraints & clarifying questions

```
- Integers only? (assume integer start, end, step)
- Is end inclusive? (no, excluded)
- Re-iterable or one-shot like a generator object? (re-iterable)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** The *iteration protocol*. Read section 5.8 in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (eager array)   O(size) time and space at creation. Build an array with a while loop and return it. Arrays are iterable, but this hangs on infinite ranges and wastes memory for huge ones.

</details>

<details><summary>Hint 3</summary>

**The key idea.** Return an object whose `[Symbol.iterator]()` creates a fresh cursor and returns `{ next() }`. Stop with a direction-aware test `step > 0 ? cur < end : cur > end` (never `cur !== end`). Size is `max(0, ceil((end - start) / step))`.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- start === end          -> empty
- step in wrong direction -> empty (not infinite!)
- step 0                 -> RangeError (would be infinite)
- Infinity end           -> fine as long as the consumer breaks
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (eager array)   O(size) time and space at creation

```
Build an array with a while loop and return it. Arrays are iterable, but this
hangs on infinite ranges and wastes memory for huge ones.
```

### APPROACH 2 — Optimal (iteration protocol)   O(1) creation, O(1) per value, O(1) space

```
Return an object whose [Symbol.iterator]() creates a FRESH cursor each time and
returns { next() }. next() checks the half-open condition
  step > 0 ? cur < end : cur > end
and returns { value, done }. Because each call to [Symbol.iterator] starts a new
cursor, the range is re-iterable (a generator OBJECT would be exhausted after one pass).
size = max(0, ceil((end - start) / step)): positive when direction and step agree.

Dry run lazyRange(5, 0, -2):
  cur 5: 5 > 0 yes -> 5, cur 3
  cur 3: yes -> 3, cur 1
  cur 1: yes -> 1, cur -1
  cur -1: -1 > 0 no -> done
  size = ceil((0 - 5) / -2) = ceil(2.5) = 3
```

### Edge cases

```
- start === end          -> empty
- step in wrong direction -> empty (not infinite!)
- step 0                 -> RangeError (would be infinite)
- Infinity end           -> fine as long as the consumer breaks
```

### Common mistakes

```
- Using cur !== end as the stop test: overshoots when step does not divide the distance -> infinite loop.
- Returning a generator object (one-shot) instead of an iterable.
- Off-by-one in size (floor instead of ceil).
```

Full JavaScript solution with tests: [08_range_iterable.js](../solutions/08_range_iterable.js). Run it with `node 08_range_iterable.js` from the solutions folder.

</details>

## Related follow-ups

- Write a lazy `map` / `filter` / `take` over any iterable using generators.
- LeetCode #284 Peeking Iterator.
- LeetCode #173 Binary Search Tree Iterator.

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
