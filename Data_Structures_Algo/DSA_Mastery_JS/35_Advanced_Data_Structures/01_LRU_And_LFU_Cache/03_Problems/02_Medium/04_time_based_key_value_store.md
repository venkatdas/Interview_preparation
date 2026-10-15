# Time Based Key-Value Store

| | |
|---|---|
| **Topic** | LRU and LFU Caches |
| **Difficulty** | Medium |
| **Pattern** | Map + binary search on sorted timestamps |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #981 — https://leetcode.com/problems/time-based-key-value-store/ |
| **Solution file** | [04_time_based_key_value_store.js](../solutions/04_time_based_key_value_store.js) — open only after a real attempt |

## Problem

Design TimeMap with
  - set(key, value, timestamp): store value for key at that time
  - get(key, timestamp): return the value with the LARGEST stored timestamp <= timestamp,
    or "" if there is none.
Timestamps passed to set for the same key are strictly increasing.

## Examples

```
set("foo", "bar", 1); get("foo", 1) -> "bar"; get("foo", 3) -> "bar"
set("foo", "bar2", 4); get("foo", 4) -> "bar2"; get("foo", 5) -> "bar2"; get("foo", 0) -> ""
```

## Constraints & clarifying questions

```
- Are timestamps strictly increasing per key? (yes -> the list is already sorted, no sort needed)
- Up to 2 * 10^5 calls -> O(n) get is too slow in the worst case
- Values are strings; "" means not found
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *Map + binary search on sorted timestamps* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(1) set, O(n) get. Map key -> array of [timestamp, value].

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Map + binary search on the sorted timestamps)   O(1) set, O(log n) get. Because timestamps arrive in increasing order, each key's array is sorted for free.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- key never set -> ""
- timestamp earlier than the first set -> ""
- timestamp exactly equal to a stored one -> that value
- timestamp later than everything -> last value
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(1) set, O(n) get

```
Map key -> array of [timestamp, value]. get scans the array for the last timestamp <= t.
```

### APPROACH 2 — Optimal (Map + binary search on the sorted timestamps)   O(1) set, O(log n) get

```
Because timestamps arrive in increasing order, each key's array is sorted for free.
get = find the rightmost index whose timestamp <= t (an "upper bound minus one").

Dry run: foo -> [[1,"bar"],[4,"bar2"]]; get("foo", 3)
  lo=0, hi=1: mid=0, ts 1 <= 3 -> answer "bar", lo=1
  lo=1, hi=1: mid=1, ts 4 > 3 -> hi=0; stop -> "bar"
get("foo", 0): mid=0, ts 1 > 0 -> hi=-1 -> never found -> ""
```

### Edge cases

```
- key never set -> ""
- timestamp earlier than the first set -> ""
- timestamp exactly equal to a stored one -> that value
- timestamp later than everything -> last value
```

Full JavaScript solution with tests: [04_time_based_key_value_store.js](../solutions/04_time_based_key_value_store.js). Run it with `node 04_time_based_key_value_store.js` from the solutions folder.

</details>

## Common mistakes

- Searching for an exact timestamp; `get` wants the largest timestamp `<=` the query (an upper-bound style binary search).
- Sorting the list on every `set`, although timestamps arrive strictly increasing, so appending keeps it sorted.
- Returning `undefined` or `null` instead of the empty string when no earlier value exists.

## Related follow-ups

- [Binary search](../../../../10_Searching/README.md)
- Snapshot Array (LeetCode #1146)
- Online Election (LeetCode #911)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
