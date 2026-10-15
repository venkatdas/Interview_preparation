# Memoize with a Closure

| | |
|---|---|
| **Topic** | Programming Fundamentals |
| **Difficulty** | Medium |
| **Pattern** | closure cache, memoization |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | Original exercise |
| **Solution file** | [07_memoize_closure.js](../solutions/07_memoize_closure.js) — open only after a real attempt |

## Problem

Count the number of ways to climb a staircase of n steps when each move climbs
1, 2 or 3 steps. Write it as a plain recursive function first, then write a
general memoize(fn) helper that returns a cached version of any function whose
arguments are numbers. The cache must live inside a closure (no global variables),
and the memoized function must call ITSELF through the cache so inner calls are
cached too. Also report how many times the underlying function body ran.

## Examples

```
Input: n = 0   Output: 1   (do nothing: one way)
Input: n = 3   Output: 4   (1+1+1, 1+2, 2+1, 3)
Input: n = 4   Output: 7
Input: n = 40  Output: 23837527729   (instant with memo, very slow without)
```

## Constraints & clarifying questions

```
- n up to 70 -> the answer exceeds 2^53 around n = 74, so stay below or use BigInt.
- Negative n? (0 ways)
- Should two separate memoize() calls share a cache? (no, each closure gets its own)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** *Closures* for private state. Read section 5.7 in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (plain recursion)   O(3^n) time, O(n) stack. ways(n) = ways(n-1) + ways(n-2) + ways(n-3), ways(0) = 1, ways(<0) = 0. The same subproblems are recomputed again and again (ways(n-3) is reached from three different parents).

</details>

<details><summary>Hint 3</summary>

**The key idea.** `memoize(fn)` creates a `Map` inside its own scope and returns a wrapper that checks it first. For recursion to benefit, the recursive calls must go through the wrapper: define `const ways = memoize(n => ... ways(n - 1) ...)`.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- n = 0 -> 1, n < 0 -> 0
- two memoized functions must not share a cache
- the cache key: for one numeric arg, the number itself is a fine Map key
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (plain recursion)   O(3^n) time, O(n) stack

```
ways(n) = ways(n-1) + ways(n-2) + ways(n-3), ways(0) = 1, ways(<0) = 0.
The same subproblems are recomputed again and again (ways(n-3) is reached from
three different parents).
```

### APPROACH 2 — Optimal (memoize via closure)   O(n) time, O(n) space

```
memoize(fn) creates `const cache = new Map()` and returns a wrapper that checks the
cache first. The cache variable is captured by the wrapper (a closure), so it survives
between calls but nobody else can touch it. Crucially, the recursive calls must go
through the WRAPPER: we define `const ways = memoize(n => ... ways(n - 1) ...)`.
Each n is computed once -> n + 1 body executions.

Dry run n = 3 (body runs counted):
  ways(3) miss -> ways(2) miss -> ways(1) miss -> ways(0) miss = 1, ways(-1) = 0, ways(-2) = 0
  ways(1) = 1 cached; ways(2) = ways(1)+ways(0)+ways(-1) = 1+1+0 = 2 (hits)
  ways(3) = 2 + 1 + 1 = 4
```

### Edge cases

```
- n = 0 -> 1, n < 0 -> 0
- two memoized functions must not share a cache
- the cache key: for one numeric arg, the number itself is a fine Map key
```

### Common mistakes

```
- memo = memoize(slowWays) where slowWays calls slowWays: only the OUTER call is cached.
- A module-level cache shared across unrelated tests.
- Using an object as cache with numeric keys (fine) but then multi-arg keys like [a, b] (becomes "a,b" by accident).
```

Full JavaScript solution with tests: [07_memoize_closure.js](../solutions/07_memoize_closure.js). Run it with `node 07_memoize_closure.js` from the solutions folder.

</details>

## Related follow-ups

- LeetCode #70 Climbing Stairs and #1137 N-th Tribonacci Number.
- LeetCode #2623 Memoize (multi-argument keys).
- Add an LRU limit to the memo cache (see Advanced Data Structures).

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
