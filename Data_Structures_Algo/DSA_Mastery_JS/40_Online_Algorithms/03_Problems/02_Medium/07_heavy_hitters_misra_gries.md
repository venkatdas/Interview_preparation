# Top-K Heavy Hitters with Misra-Gries

| | |
|---|---|
| **Topic** | Online Algorithms |
| **Difficulty** | Medium |
| **Pattern** | Misra-Gries counters + verification pass |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | Original exercise |
| **Solution file** | [07_heavy_hitters_misra_gries.js](../solutions/07_heavy_hitters_misra_gries.js) — open only after a real attempt |

## Problem

A very long stream of string ids passes by. For a given k >= 2 return every id whose frequency
is strictly greater than n / k (n = stream length), as `[id, exactCount]` pairs sorted by count
descending, ties by id ascending. You may read the stream twice but may keep only O(k) ids in
memory between passes — no full frequency map.

## Examples

```
stream a b a c a b d a b, k = 3 -> threshold 3 -> [["a", 4]]   (b has 3, not > 3)
stream x y x y x y z,     k = 2 -> threshold 3.5 -> []
stream x x x y,           k = 2 -> [["x", 3]]
```

## Constraints & clarifying questions

```
- strictly greater than n/k
- exact counts in the answer
- at most k-1 ids can qualify (why?)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** *Heavy hitters* in small memory -> Misra-Gries. See the Misra-Gries section of [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** A full Map of counts solves it in one pass but uses O(distinct) memory.

</details>

<details><summary>Hint 3</summary>

**The key idea.** Keep k-1 counters. When a new id arrives and every counter is taken, decrement ALL of them. Each such step cancels k different occurrences, so it can happen at most n/k times — any id above n/k survives.

</details>

<details><summary>Hint 4</summary>

**Edge cases.** Survivors are only candidates: count them exactly in a second pass. Empty stream -> [].

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### Brute force

Map of all counts, filter `> n/k`, sort. O(n + d log d) time, O(d) memory for d distinct ids.

### Optimized approach

Pass 1: Misra-Gries with k-1 counters (O(k) memory). Pass 2: count only the candidates. Filter and sort.
O(n * k) worst-case time (the decrement-all loop), O(k) memory.

### Dry run

```
stream a b a c a b d a b, k = 3 (2 counters)
a {a:1}  b {a:1,b:1}  a {a:2,b:1}  c full -> {a:1}
a {a:2}  b {a:2,b:1}  d full -> {a:1}  a {a:2}  b {a:2,b:1}
candidates a, b; exact a=4, b=3; threshold 3 -> [["a",4]]
```

### Complexity

O(n k) time worst case (O(n) amortised with a cleverer structure), O(k) space.

### Edge cases

- empty stream
- single distinct id
- ties on count

### Common mistakes

- Returning Misra-Gries counters as exact counts (they are under-estimates by up to n/k).
- Using `>=` instead of `>` for the threshold.
- Keeping k counters instead of k-1 (still correct, slightly wasteful).

Full JavaScript solution with tests: [07_heavy_hitters_misra_gries.js](../solutions/07_heavy_hitters_misra_gries.js). Run it with `node 07_heavy_hitters_misra_gries.js` from the solutions folder.

</details>

## Related follow-ups

- Majority Element (LeetCode #169, Boyer-Moore = Misra-Gries with k = 2)
- Majority Element II (LeetCode #229, k = 3)
- Count-Min Sketch top-k (streaming.js)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
