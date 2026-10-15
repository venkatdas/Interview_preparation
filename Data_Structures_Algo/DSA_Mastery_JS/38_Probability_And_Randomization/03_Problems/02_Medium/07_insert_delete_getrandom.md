# Insert Delete GetRandom O(1)

| | |
|---|---|
| **Topic** | Probability and Randomization |
| **Difficulty** | Medium |
| **Pattern** | array + Map, swap-remove |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #380 — https://leetcode.com/problems/insert-delete-getrandom-o1/ (statement paraphrased, not copied) |
| **Solution file** | [07_insert_delete_getrandom.js](../solutions/07_insert_delete_getrandom.js) — open only after a real attempt |

## Problem

Design a set of integers supporting, in average O(1) time each:

- `insert(val)`: add `val` if it is not present. Return true if it was added.
- `remove(val)`: remove `val` if present. Return true if it was removed.
- `getRandom()`: return a uniformly random current element (called only when the set is non-empty).

## Examples

```
insert(1) -> true
remove(2) -> false
insert(2) -> true
getRandom() -> 1 or 2 (each 1/2)
remove(1) -> true
insert(2) -> false
getRandom() -> 2
```

## Constraints & clarifying questions

```
- Duplicates? (no; the duplicates version is LeetCode 381)
- getRandom on an empty set? (never called; we return undefined)
- Average O(1) is fine (Map operations are average O(1))
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** Combine two structures: an array (O(1) random index) and a Map (O(1) lookup). See Pattern E in section 13 of [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** A JS Set does insert/remove/has in O(1). What does getRandom cost if you must convert it to an array each time?

</details>

<details><summary>Hint 3</summary>

**The key idea.** Store values in an array and value -> index in a Map. To remove from the middle in O(1), move the LAST element into the hole, update its index in the Map, then pop.

</details>

<details><summary>Hint 4</summary>

**Edge cases.** Removing the element that is already last (it moves onto itself). Inserting an existing value. Removing a missing value.

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (Set + copy for getRandom)   insert/remove O(1), getRandom O(n)

```
Use a Set. getRandom: Array.from(set)[floor(rng() * size)].
```

### APPROACH 2 — Optimal (Array + Map with swap-remove)   O(1) average per operation, O(n) space

```
insert(v): if map has v -> false; map[v] = arr.length; arr.push(v)
remove(v): if missing -> false
           hole = map[v]; last = arr[arr.length-1]
           arr[hole] = last; map[last] = hole
           arr.pop(); map.delete(v)          // delete LAST
getRandom: arr[floor(rng() * arr.length)]
```

### Dry run

```
insert 10, 20, 30 -> arr [10,20,30], map {10:0, 20:1, 30:2}
remove 10: hole 0, last 30 -> arr [30,20,30] -> pop -> [30,20]
           map {20:1, 30:0}
getRandom -> arr[0] or arr[1], each 1/2
```

### Complexity

- Brute force: insert/remove O(1), getRandom O(n)
- Optimal: O(1) average per operation, O(n) space

### Edge cases

```
- remove the only element -> arr [], map {}
- remove last element -> it is copied onto itself; deleting from the map AFTER updating keeps it correct
- insert duplicate -> false, no change
```

### Common mistakes

- Using arr.splice(hole, 1): O(n) and it invalidates every later index in the map.
- Deleting map[v] before setting map[last] = hole: when v is last, you re-insert a removed value.
- Using indexOf to find the position: O(n).

Full JavaScript solution with tests: [07_insert_delete_getrandom.js](../solutions/07_insert_delete_getrandom.js). Run it with `node 07_insert_delete_getrandom.js` from the solutions folder.

</details>

## Related follow-ups

- Insert Delete GetRandom O(1) - Duplicates allowed (LeetCode 381)
- LRU Cache (LeetCode 146): another "two structures together" design
- Random Pick with Blacklist (LeetCode 710)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
