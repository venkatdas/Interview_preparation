# LRU Cache

| | |
|---|---|
| **Topic** | LRU and LFU Caches |
| **Difficulty** | Medium |
| **Pattern** | DLL + Map (and Map-order trick) |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #146 — https://leetcode.com/problems/lru-cache/ |
| **Solution file** | [01_lru_cache.js](../solutions/01_lru_cache.js) — open only after a real attempt |

## Problem

Design a cache with a fixed capacity:
  - get(key): return the value, or -1 if absent. Counts as a "use".
  - put(key, value): insert or update. If inserting makes the cache exceed capacity,
    evict the LEAST RECENTLY USED key first.
Both must run in O(1) average time.

## Examples

```
LRUCache(2); put(1,1); put(2,2); get(1) -> 1; put(3,3) evicts 2; get(2) -> -1;
put(4,4) evicts 1; get(1) -> -1; get(3) -> 3; get(4) -> 4
```

## Constraints & clarifying questions

```
- Does get count as a use? (yes) Does put on an existing key count as a use? (yes)
- Capacity >= 1? (yes for this problem; capacity 0 should still not crash)
- Keys: integers; values: integers (any hashable type works with a Map)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *DLL + Map (and Map-order trick)* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n) per operation. Keep an array of entries ordered from least to most recently used.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Doubly linked list + hash map)   O(1) per operation. We need two things in O(1): find a key (-> Map), and move an entry to the "most recent" end or drop the "least recent" end (-> doubly linked list, because unlinking a node in the middle is O(1) when you have pointers to both neighbours).

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- put on an existing key must NOT evict anything and must refresh recency
- capacity 1 (every new key evicts the previous one)
- get on a missing key must not change the order
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n) per operation

```
Keep an array of entries ordered from least to most recently used. get = linear search,
move the entry to the end. put = linear search / update / push, shift() to evict.
Correct, but every operation scans the array.
```

### APPROACH 2 — Optimal (Doubly linked list + hash map)   O(1) per operation

```
We need two things in O(1): find a key (-> Map), and move an entry to the "most recent"
end or drop the "least recent" end (-> doubly linked list, because unlinking a node in
the middle is O(1) when you have pointers to both neighbours).
  Map: key -> node.  List: head <-> ... <-> tail, with dummy head/tail so there are no
  null checks. head.next is the LRU node, tail.prev is the MRU node.
  get: lookup node, unlink, re-link before tail.
  put: if present, update + move to tail; else if full, unlink head.next and delete its
       key from the Map; then create node, link before tail, add to Map.

Dry run (capacity 2):
  put(1,1):  list H <-> 1 <-> T              map {1}
  put(2,2):  list H <-> 1 <-> 2 <-> T        map {1,2}
  get(1):    move 1 to tail: H <-> 2 <-> 1 <-> T   -> 1
  put(3,3):  full; LRU = head.next = 2, unlink, map.delete(2); add 3:
             H <-> 1 <-> 3 <-> T             map {1,3}
  get(2):    not in map -> -1

A JS-only shortcut: a Map keeps insertion order, so delete+set moves a key to the end and
map.keys().next().value is the oldest. See LRUCacheMap in ../lru-cache.js. Mention it as a
trick, but be ready to write the linked list version.
```

### Edge cases

```
- put on an existing key must NOT evict anything and must refresh recency
- capacity 1 (every new key evicts the previous one)
- get on a missing key must not change the order
```

Full JavaScript solution with tests: [01_lru_cache.js](../solutions/01_lru_cache.js). Run it with `node 01_lru_cache.js` from the solutions folder.

</details>

## Common mistakes

- Forgetting that `get` also counts as a use: a hit must move the key to the most-recent end.
- Updating an existing key's value without refreshing its recency (or, worse, evicting when the key already exists).
- In the linked-list version, removing the node from the list but not deleting its key from the map (or the other way round).

## Related follow-ups

- [LFU Cache](../03_Hard/02_lfu_cache.md)
- [Design Browser History](03_design_browser_history.md)
- Design Linked List (LeetCode #707)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
