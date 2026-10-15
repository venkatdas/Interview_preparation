# Frequency Map

| | |
|---|---|
| **Topic** | Programming Fundamentals |
| **Difficulty** | Easy |
| **Pattern** | Map counting, SameValueZero |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | Original exercise |
| **Solution file** | [02_frequency_map.js](../solutions/02_frequency_map.js) — open only after a real attempt |

## Problem

Given an array of primitive values (numbers, strings, booleans, null, undefined),
return an array of [value, count] pairs, one per distinct value, in the order each
value first appears. Two values count as the same when they are SameValueZero equal:
NaN matches NaN, and 0 matches -0. The number 1 and the string '1' are different.

## Examples

```
Input:  ['a', 'b', 'a', 'c', 'b', 'a']   Output: [['a', 3], ['b', 2], ['c', 1]]
Input:  [1, '1', 1]                      Output: [[1, 2], ['1', 1]]
Input:  [NaN, 0, NaN, -0]                Output: [[NaN, 2], [0, 2]]
Input:  []                               Output: []
```

## Constraints & clarifying questions

```
- Up to 1e5 values -> O(n^2) is too slow in the worst case.
- Is order required? (yes: first appearance)
- Should 1 and '1' merge? (no)  Should NaN merge with NaN? (yes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 20 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** *Counting by key* with tricky keys. Read section 5.6 (equality) in [the concepts guide](../../01_Concepts/CONCEPTS.md): which equality does a `Map` use for keys?

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n * d) time (d = distinct values), O(d) space. Keep a list of [value, count] pairs. For each element, scan the list with a SameValueZero comparison (=== alone would never match NaN). Increment or append.

</details>

<details><summary>Hint 3</summary>

**The key idea.** A `Map` compares keys with SameValueZero (so `NaN` finds `NaN`, `0` finds `-0`), keeps number `1` and string `'1'` apart, and remembers insertion order. One pass with `map.set(x, (map.get(x) ?? 0) + 1)` is the whole solution.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- empty array          -> []
- NaN values           -> merged into one entry
- -0 then 0            -> one entry, key is the FIRST one seen (Map normalises -0 to +0)
- undefined and null   -> two different keys
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n * d) time (d = distinct values), O(d) space

```
Keep a list of [value, count] pairs. For each element, scan the list with a
SameValueZero comparison (=== alone would never match NaN). Increment or append.
```

### APPROACH 2 — Optimal (Map)   O(n) time, O(d) space

```
A Map already uses SameValueZero for keys AND remembers insertion order, so
map.set(x, (map.get(x) ?? 0) + 1) does everything. Return [...map] (entries).
A plain object would be wrong: its keys are strings, so 1 and '1' would merge
and NaN would become the key 'NaN' (which also matches the string 'NaN').

Dry run on ['a','b','a']:
  'a' -> Map{a:1}
  'b' -> Map{a:1, b:1}
  'a' -> Map{a:2, b:1}
  result [['a',2],['b',1]]
```

### Edge cases

```
- empty array          -> []
- NaN values           -> merged into one entry
- -0 then 0            -> one entry, key is the FIRST one seen (Map normalises -0 to +0)
- undefined and null   -> two different keys
```

### Common mistakes

```
- Using an object {} as the counter (string keys merge 1 and '1').
- Using indexOf to find the existing entry (indexOf uses ===, never finds NaN).
- Writing map.get(x) + 1 for a new key (undefined + 1 is NaN).
```

Full JavaScript solution with tests: [02_frequency_map.js](../solutions/02_frequency_map.js). Run it with `node 02_frequency_map.js` from the solutions folder.

</details>

## Related follow-ups

- Return the k most frequent values (LeetCode #347 Top K Frequent Elements).
- Group values by frequency (bucket sort).
- LeetCode #387 First Unique Character in a String.

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
