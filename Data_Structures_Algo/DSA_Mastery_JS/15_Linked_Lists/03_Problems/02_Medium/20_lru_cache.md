# LRU Cache

| | |
|---|---|
| **Topic** | Linked Lists |
| **Difficulty** | Medium |
| **Pattern** | doubly linked list + Map |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #146 — https://leetcode.com/problems/lru-cache/ |
| **Solution file** | [20_lru_cache.js](../solutions/20_lru_cache.js) — open only after a real attempt |

## Problem

Design a cache with a fixed capacity that supports
  get(key)        -> value, or -1 if missing. Counts as a "use".
  put(key, value) -> insert or update. If the cache is full, evict the
                     LEAST RECENTLY USED key first.
Both operations must run in O(1) average time.

## Examples

```
LRUCache(2)
put(1,1) put(2,2) get(1)->1  put(3,3) [evicts 2]  get(2)->-1
put(4,4) [evicts 1]  get(1)->-1  get(3)->3  get(4)->4
```

## Constraints & clarifying questions

```
- Does get() count as "using" the key? (yes)
- Does put() on an existing key count as using it? (yes, and it updates the value)
- Capacity >= 1? (yes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *doubly linked list + Map* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (array of entries)   O(n) per operation. Keep an array ordered from least to most recently used.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Map + doubly linked list)   O(1) per operation, O(capacity) space. We need two things in O(1): - jump to a node by key            -> Map(key -> node) - move a node to "most recent" and remove the "least recent" -> doubly linked list Layout:  head(dummy) &lt;-> LRU ...

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- capacity 1
- put on an existing key must NOT evict anything
- get on a missing key must not change the order
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (array of entries)   O(n) per operation

```
Keep an array ordered from least to most recently used. get: find the entry
(O(n)), move it to the end. put: same search, evict index 0 if full.
Correct but O(n) per operation - fails the requirement.
```

### APPROACH 2 — Optimal (Map + doubly linked list)   O(1) per operation, O(capacity) space

```
We need two things in O(1):
  - jump to a node by key            -> Map(key -> node)
  - move a node to "most recent" and remove the "least recent" -> doubly linked list
Layout:  head(dummy) <-> LRU ... MRU <-> tail(dummy)
get:  look up node, unlink it, re-insert right before tail (most recent).
put:  if key exists -> update value and move to MRU.
      else create node, add before tail, map it;
      if size > capacity -> remove head.next (the LRU node) and delete it from the map.
Dummy head/tail mean we never check for null when linking.

Dry run, capacity 2:
  put(1,1)   list: 1
  put(2,2)   list: 1 2
  get(1)     list: 2 1         (1 moved to the MRU end)
  put(3,3)   full: evict head.next = 2.  list: 1 3
  get(2)     -1

Note: JavaScript's Map keeps insertion order, so a Map alone (delete + re-set
to move to the end, and map.keys().next() for the oldest) is also O(1).
Show that as a bonus, but interviewers want to see the linked list.
```

### Edge cases

```
- capacity 1
- put on an existing key must NOT evict anything
- get on a missing key must not change the order
```

Full JavaScript solution with tests: [20_lru_cache.js](../solutions/20_lru_cache.js). Run it with `node 20_lru_cache.js` from the solutions folder.

</details>

## Common mistakes

- Not moving a key to "most recent" on `get`, only on `put`.
- Updating an existing key without refreshing its recency, or evicting when updating instead of inserting.
- Forgetting to delete the evicted key from the map.

## Related follow-ups

- [LFU Cache](../../../35_Advanced_Data_Structures/01_LRU_And_LFU_Cache/03_Problems/03_Hard/02_lfu_cache.md) (35_Advanced_Data_Structures/01_LRU_And_LFU_Cache)
- [LRU Cache](../../../35_Advanced_Data_Structures/01_LRU_And_LFU_Cache/03_Problems/02_Medium/01_lru_cache.md) (35_Advanced_Data_Structures/01_LRU_And_LFU_Cache)
- Design Browser History (LeetCode #1472)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
