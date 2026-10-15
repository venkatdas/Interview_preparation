# Deep Equal

| | |
|---|---|
| **Topic** | Programming Fundamentals |
| **Difficulty** | Medium |
| **Pattern** | parallel structural recursion |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | Original exercise |
| **Solution file** | [06_deep_equal.js](../solutions/06_deep_equal.js) — open only after a real attempt |

## Problem

Write deepEqual(a, b) that returns true when a and b have the same structure and
values. Rules:
  - primitives: equal if SameValueZero equal (NaN equals NaN, 0 equals -0, 1 !== '1')
  - arrays: same length and equal elements in the same order
  - plain objects: same set of own keys (order does NOT matter) and equal values;
    { a: undefined } is NOT equal to {} (the key is missing on one side)
  - an array is never equal to an object
Inputs contain only primitives, arrays and plain objects (no cycles).

## Examples

```
Input: { a: [1, { b: 2 }] }, { a: [1, { b: 2 }] }  Output: true
Input: { x: 1, y: 2 }, { y: 2, x: 1 }              Output: true   (key order ignored)
Input: [1, 2], { 0: 1, 1: 2 }                      Output: false
Input: { a: undefined }, {}                         Output: false
Input: NaN, NaN                                     Output: true
```

## Constraints & clarifying questions

```
- Can there be cycles? (not in this version; see the implementation file for a cycle-safe one)
- Should key order matter? (no)
- How should NaN and -0 compare? (SameValueZero)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** *Equality semantics* plus a *parallel walk* of two structures. Re-read section 5.6 (equality table) in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (canonical serialisation)   O(N log N) time, O(N) space. Convert each value to a canonical string: objects with SORTED keys, arrays in order, and primitives tagged with their type (so 1 and '1' differ and NaN, undefined survive, which JSON.stringify would lose). Compare the two strings.

</details>

<details><summary>Hint 3</summary>

**The key idea.** Walk both values together. Primitives: SameValueZero. Objects: both must be arrays or both not; compare lengths / key counts; check every key of `a` is an own key of `b`; recurse; return false at the first mismatch.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- null vs {}            -> false (typeof null === 'object' trap)
- undefined-valued key vs missing key -> false
- [] vs {}              -> false
- sparse vs undefined   -> out of scope (inputs are dense)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (canonical serialisation)   O(N log N) time, O(N) space

```
Convert each value to a canonical string: objects with SORTED keys, arrays in
order, and primitives tagged with their type (so 1 and '1' differ and NaN, undefined
survive, which JSON.stringify would lose). Compare the two strings.
Correct for this input domain, but it always builds two full strings, even when
the first element already differs.
```

### APPROACH 2 — Optimal (parallel recursive walk)   O(N) time, O(depth) space

```
Walk both values together and return false at the FIRST difference:
  1. SameValueZero equal -> true
  2. either is not an object (or is null) -> false
  3. Array.isArray differs -> false
  4. arrays: compare lengths, then each index
  5. objects: compare key counts, check every key of a exists in b (hasOwnProperty), recurse

Dry run {x:[1,2]} vs {x:[1,3]}:
  objects, 1 key each, 'x' in both -> recurse [1,2] vs [1,3]
  arrays length 2 = 2 -> 1 vs 1 ok -> 2 vs 3 differ -> false (stop)
```

### Edge cases

```
- null vs {}            -> false (typeof null === 'object' trap)
- undefined-valued key vs missing key -> false
- [] vs {}              -> false
- sparse vs undefined   -> out of scope (inputs are dense)
```

### Common mistakes

```
- JSON.stringify(a) === JSON.stringify(b): key order matters, undefined disappears, NaN becomes null.
- Checking only a's keys exist in b (b may have extra keys) -> compare counts too.
- Using === for primitives (NaN fails).
```

Full JavaScript solution with tests: [06_deep_equal.js](../solutions/06_deep_equal.js). Run it with `node 06_deep_equal.js` from the solutions folder.

</details>

## Related follow-ups

- LeetCode #2628 JSON Deep Equal.
- LeetCode #100 Same Tree (the same idea on binary trees).
- Extend deepEqual to handle cycles by remembering pairs already being compared.

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
