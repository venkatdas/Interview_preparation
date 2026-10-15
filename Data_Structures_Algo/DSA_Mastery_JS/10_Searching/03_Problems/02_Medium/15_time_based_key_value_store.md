# Time Based Key-Value Store

| | |
|---|---|
| **Topic** | Searching (Linear and Binary Search) |
| **Difficulty** | Medium |
| **Pattern** | upper bound on timestamps |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #981 — https://leetcode.com/problems/time-based-key-value-store/ |
| **Solution file** | [15_time_based_key_value_store.js](../solutions/15_time_based_key_value_store.js) — open only after a real attempt |

## Problem

Design a store with:
  set(key, value, timestamp)  - store value for key at the given timestamp
  get(key, timestamp)         - return the value set with the LARGEST timestamp <= the
                                given one, or "" if none
Timestamps passed to set are strictly increasing per key.

## Examples

```
set("foo","bar",1); get("foo",1) -> "bar"; get("foo",3) -> "bar"
set("foo","bar2",4); get("foo",4) -> "bar2"; get("foo",5) -> "bar2"; get("foo",0) -> ""
```

## Constraints & clarifying questions

```
- Are timestamps strictly increasing per key? (yes -> the list per key is already sorted)
- Up to 2 * 10^5 calls -> get must be O(log n)
- Can get ask for a key never set? (yes -> "")
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *upper bound on timestamps* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n) per get. Store a list of [timestamp, value] per key; on get, scan the whole list and keep the latest entry with timestamp &lt;= query.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (upper bound on the timestamps)   O(1) set, O(log n) get. Because timestamps arrive increasing, each key's list is sorted.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- key missing -> ""
- query before the first timestamp -> ""
- query exactly equal to a stored timestamp -> that value
- query after the last -> last value
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n) per get

```
Store a list of [timestamp, value] per key; on get, scan the whole list and keep
the latest entry with timestamp <= query.
```

### APPROACH 2 — Optimal (upper bound on the timestamps)   O(1) set, O(log n) get

```
Because timestamps arrive increasing, each key's list is sorted. get = "the LAST
entry with timestamp <= t" = upperBound(t) - 1. Binary search for the first index
whose timestamp is > t; the previous index is the answer (if it exists).

Dry run foo: [[1,"bar"],[4,"bar2"]], get(foo, 3):
  l=0 r=2 mid=1 ts 4 <= 3? no -> r=1
  l=0 r=1 mid=0 ts 1 <= 3? yes -> l=1
  upperBound = 1 -> index 0 -> "bar"
get(foo, 0): upperBound = 0 -> no previous index -> ""
```

### Edge cases

```
- key missing -> ""
- query before the first timestamp -> ""
- query exactly equal to a stored timestamp -> that value
- query after the last -> last value
```

Full JavaScript solution with tests: [15_time_based_key_value_store.js](../solutions/15_time_based_key_value_store.js). Run it with `node 15_time_based_key_value_store.js` from the solutions folder.

</details>

## Common mistakes

- Sorting the list on every `set`; timestamps arrive increasing, so just push.
- Returning the value with the closest timestamp instead of the largest one that is `<=` the query.
- Returning `undefined` instead of "" when no timestamp qualifies.

## Related follow-ups

- [Search Insert Position](../01_Easy/02_search_insert_position.md) — the upper-bound search used in `get`
- [Design HashMap](../../../05_Hashing/03_Problems/01_Easy/15_design_hashmap.md) — the map part
- Snapshot Array (LeetCode #1146) — versioned values with binary search

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
