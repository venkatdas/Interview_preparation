# LRU & LFU Caches

A **cache** is a small, fast store that keeps a limited number of items. When it is full and a
new item arrives, something must be thrown out. The **eviction policy** decides what:

- **LRU** (Least Recently Used): throw out the item nobody has touched for the longest time.
  Like a bookshelf next to your desk - the book you haven't opened in months goes back to the
  library first.
- **LFU** (Least Frequently Used): throw out the item used the fewest times; on a tie, the one
  used least recently.

The interview challenge: every operation (`get`, `put`) must be **O(1)**. That rules out
scanning for "the oldest" - you have to organise the data so the victim is always at a known
place.

## Prerequisites

- [Hashing](../../../05_Hashing/README.md) — the O(1) key lookup half of every cache.
- [Linked Lists](../../../15_Linked_Lists/README.md) — the doubly linked list that keeps recency order with O(1) unlink.
- JavaScript `Map` iteration order (insertion order) — the shortcut LRU.

**Essential vs Advanced:** LRU Cache (both the `Map` shortcut and the hash map + doubly linked list version) is **Essential** — it is one of the most-asked design questions. LFU Cache (frequency buckets + `minFreq`) is **Advanced**; know the design and be able to code it in about 30 minutes.

---

## Why it matters / when to use

- "Design a cache / key-value store with a capacity and eviction" (LRU Cache is one of the
  most-asked interview questions anywhere)
- "O(1) get and put", "most recently used", "least frequently used"
- Any design problem mixing **a hash map for lookup** with **an ordering structure** for
  recency: browser history, time-based stores, rate limiters, memoisation with a size limit
- Frontend relevance: HTTP caches, memoised selectors, image caches, React Query's garbage
  collection are all bounded caches with an eviction policy

---

## How it works

### LRU = hash map + doubly linked list

Two needs, two structures:

1. Find a key in O(1) → **`Map` key → node**
2. Move a node to "most recent" and drop "least recent" in O(1) → **doubly linked list**
   (unlinking a middle node is O(1) when you hold `prev` and `next`)

```
  Map                        list (recency order)
  key -> node
  1 -> [n1]       head <-> n2(2) <-> n1(1) <-> n3(3) <-> tail
  2 -> [n2]                 ^ LRU                 ^ MRU
  3 -> [n3]

get(2):   unlink n2, re-link before tail
          head <-> n1(1) <-> n3(3) <-> n2(2) <-> tail

put(4,4)  (capacity 3, full):
          victim = head.next = n1 -> unlink, map.delete(1)
          head <-> n3(3) <-> n2(2) <-> n4(4) <-> tail
```

Two **dummy sentinels** (`head`, `tail`) mean you never check "is this the first/last node?".
Every node stores its **key** so that eviction can delete it from the Map.

### The JS-only shortcut: `Map` insertion order

A JavaScript `Map` iterates in insertion order. So:

```js
get(key):  value = map.get(key); map.delete(key); map.set(key, value)   // move to the end
evict:     map.delete(map.keys().next().value)                          // first = oldest
```

Seven lines, O(1). It is a legitimate solution in JS, but some interviewers will ask "and if
the language had no ordered map?" - so learn the linked list version too, and mention the
Map trick as a bonus. (Python's `OrderedDict`, Java's `LinkedHashMap` are the same idea.)

### LFU = frequency buckets + minFreq

```
keyToNode : key  -> { key, value, freq }
buckets   : freq -> ordered Set of keys   (first key = least recently used at that freq)
minFreq   : smallest frequency present

buckets:   1 -> { 7, 9 }      2 -> { 3 }      5 -> { 1 }        minFreq = 1
                 ^ evict this one first (lowest freq, oldest in its bucket)

get(7): remove 7 from bucket 1, freq becomes 2, add to the END of bucket 2
        1 -> { 9 }           2 -> { 3, 7 }    5 -> { 1 }
get(9): bucket 1 becomes empty and 1 === minFreq -> minFreq = 2
                             2 -> { 3, 7, 9 }  5 -> { 1 }        minFreq = 2
put(new key):  insert into bucket 1 and set minFreq = 1   (a new key is always least used)
```

**Why O(1)?** A `Set` gives O(1) add / delete / "first element". `minFreq` never needs a
search: it only increases by one when the current minimum bucket empties, and it resets to 1
when a new key is inserted. Those are the only two ways the minimum can change.

---

## Pseudocode (Essential)

```
LRU (hash map + doubly linked list with sentinels head <-> ... <-> tail; tail side = most recent)
get(key):
  if key not in map: return -1
  node = map[key]; unlink(node); addToTail(node)       # mark as most recent
  return node.value
put(key, value):
  if key in map: node = map[key]; node.value = value; unlink(node); addToTail(node); return
  if size == capacity: victim = head.next; unlink(victim); delete map[victim.key]
  node = new Node(key, value); map[key] = node; addToTail(node)

LFU (key -> {value, freq}; freq -> ordered set of keys, oldest first; minFreq)
touch(node):  move key from bucket[freq] to bucket[freq+1]; if bucket[freq] became empty and freq == minFreq: minFreq++
get(key):     if missing return -1; touch(node); return value
put(key, v):  if capacity == 0 return
              if present: update value; touch(node); return
              if full: evict the first (oldest) key of bucket[minFreq]
              insert with freq 1 into bucket[1]; minFreq = 1
```

---

## Dry run — LRU with capacity 2 (Essential)

| step | operation | result | order after (LRU → MRU) | note |
|---|---|---|---|---|
| 1 | put(1, A) | — | [1] | |
| 2 | put(2, B) | — | [1, 2] | |
| 3 | get(1) | A | [2, 1] | a hit moves 1 to the recent end |
| 4 | put(3, C) | — | [1, 3] | full: evict the LRU key 2 |
| 5 | get(2) | -1 | [1, 3] | 2 was evicted |
| 6 | put(1, A2) | — | [3, 1] | update value AND refresh recency |
| 7 | put(4, D) | — | [1, 4] | evict 3 |

LFU on the same sequence would evict differently at step 4: key 1 has frequency 2 and key 2 frequency 1, so 2 goes; at step 7 key 1 (freq 3) stays and key 3 (freq 1) is evicted.

---

## Operations & complexity

| Structure | get | put | Space | Note |
|-----------|-----|-----|-------|------|
| LRU, array scan (naive) | O(n) | O(n) | O(n) | linear search + splice |
| LRU, Map insertion order | O(1) | O(1) | O(n) | JS/Python/Java ordered map trick |
| LRU, DLL + Map | O(1) | O(1) | O(n) | interview standard |
| LFU, naive scan for min | O(n) | O(n) | O(n) | |
| LFU, freq buckets + minFreq | O(1) | O(1) | O(n) | buckets are ordered Sets / DLLs |
| Browser history (array + pointer) | O(1) | O(1) | O(n) | |
| Time-based KV (binary search) | O(log n) | O(1) | O(n) | timestamps arrive sorted |

---

## JavaScript implementation

Full code with randomized tests against naive array-based caches: `lru-cache.js`
(`LRUCacheMap`, `LRUCache`) and `lfu-cache.js` (`LFUCache`). The linked-list LRU core:

```js
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity; this.map = new Map();
    this.head = { prev: null, next: null }; this.tail = { prev: null, next: null };
    this.head.next = this.tail; this.tail.prev = this.head;
  }
  #unlink(n) { n.prev.next = n.next; n.next.prev = n.prev; }
  #linkBeforeTail(n) { n.prev = this.tail.prev; n.next = this.tail; this.tail.prev.next = n; this.tail.prev = n; }
  get(key) {
    const node = this.map.get(key); if (!node) return -1;
    this.#unlink(node); this.#linkBeforeTail(node); return node.value;
  }
  put(key, value) {
    const node = this.map.get(key);
    if (node) { node.value = value; this.#unlink(node); this.#linkBeforeTail(node); return; }
    if (this.map.size === this.capacity) { const lru = this.head.next; this.#unlink(lru); this.map.delete(lru.key); }
    const fresh = { key, value }; this.#linkBeforeTail(fresh); this.map.set(key, fresh);
  }
}
```

---

## Patterns / variations

### 1. Hash map + ordering structure

The general recipe for O(1) design problems: a `Map` answers "where is X?", a second structure
(linked list, Set, buckets, array + pointer) answers "which one is first/last?". Keep both in
sync on every operation.

### 2. Lazy deletion instead of real deletion

Browser history: `visit` does not truncate the forward entries, it just moves a `last`
pointer. Many "design" problems allow overwriting instead of deleting.

### 3. Append-only sorted log + binary search

Time Based Key-Value Store: timestamps only increase, so each key's list is already sorted;
`get` is a binary search for the rightmost timestamp `<= t` ([Searching](../../../10_Searching/README.md)).

### 4. Trie of path segments

In-Memory File System: a trie whose "characters" are folder names
([Tries](../../../22_Tries/README.md)). `ls` is "sorted children of a node".

### 5. Capacity-bounded memoisation

```js
function memoLRU(fn, capacity) {
  const cache = new LRUCacheMap(capacity);
  return (arg) => {
    const hit = cache.get(arg);
    if (hit !== -1) return hit;
    const value = fn(arg); cache.put(arg, value); return value;
  };
}
```

---

## Alternatives and trade-offs

| Design | get | put | Code | Notes |
|---|---|---|---|---|
| Array of entries, scan for victim | O(n) | O(n) | tiny | good as a brute-force reference and to state first |
| `Map` re-insertion (LRU) | O(1) | O(1) | ~15 lines | JS-specific; interviewers may ask for the "real" structure |
| Hash map + doubly linked list (LRU) | O(1) | O(1) | ~50 lines | language-independent standard answer |
| Hash map + min-heap by (freq, time) (LFU) | O(log n) | O(log n) | medium | simpler to reason about; not O(1) |
| Frequency buckets + `minFreq` (LFU) | O(1) | O(1) | ~60 lines | the expected optimal LFU |
| TTL / time-based expiry | O(1) amortised | O(1) | medium | add a timestamp and lazy deletion |

---

## When this does NOT apply

- No capacity limit — a plain `Map` is enough; eviction logic is wasted.
- Eviction depends on something other than recency/frequency (size in bytes, cost, priority) — use a heap keyed by that metric.
- You need sorted iteration or range queries over keys — use a [sorted list / skip list](../../02_Skip_List_Bloom_Filter_Sorted_List/README.md).
- Many threads/processes share the cache — concurrency control matters more than the data structure (mention it in system-design style follow-ups).

---

## Common mistakes & edge cases

- `put` on an **existing** key must update the value and refresh recency, and must **not**
  evict anything.
- Evict **before** inserting (otherwise a full cache briefly holds capacity + 1).
- Forgetting to store the **key inside the node** - eviction then cannot remove it from the Map.
- **Capacity 0**: `put` should do nothing (LFU test case). Guard it.
- LFU: forgetting to reset `minFreq = 1` on a new insert, or forgetting to delete an empty
  bucket before bumping `minFreq`.
- Map trick: `map.set` on an existing key does **not** move it - you must `delete` first.
- Time-based store: `get` must return the **latest** timestamp `<= t`, so binary search keeps
  the last candidate (`found = mid; lo = mid + 1`).

---

## Interview tips

- Open with the two-structure sentence: *"A hash map for O(1) lookup, a doubly linked list for
  O(1) reorder and eviction; the map points at list nodes."*
- Draw the list with sentinels; say "most recent at the tail, least recent after head".
- Walk through `get` and `put` on a 2-capacity example before coding.
- Mention the Map insertion-order trick as a JS bonus, then write the general version.
- For LFU explain `minFreq` before coding - that is the part interviewers probe.
- Clarify: does `get` count as a use? Does updating a key count? What about capacity 0?

---

## Problems in this folder

| # | Problem | Difficulty | Pattern | File |
|---|---------|------------|---------|------|
| 01 | LRU Cache | Medium | DLL + Map (and Map-order trick) | 03_Problems/solutions/01_lru_cache.js |
| 02 | LFU Cache | Hard | frequency buckets + minFreq | 03_Problems/solutions/02_lfu_cache.js |
| 03 | Design Browser History | Medium | array + pointer (lazy truncation) | 03_Problems/solutions/03_design_browser_history.js |
| 04 | Time Based Key-Value Store | Medium | Map + binary search on sorted timestamps | 03_Problems/solutions/04_time_based_key_value_store.js |
| 05 | Design In-Memory File System (lite) | Hard | trie of path segments | 03_Problems/solutions/05_design_in_memory_file_system.js |

---

## Practice more

Easy: Design HashMap (706), Design HashSet (705), Logger Rate Limiter (359)

Medium: LRU Cache (146), Insert Delete GetRandom O(1) (380), Design Twitter (355),
Design Underground System (1396), Design a Leaderboard (1244), Design Hit Counter (362),
Snapshot Array (1146), Design Authentication Manager (1797), Design Front Middle Back Queue (1670),
Design a Food Rating System (2353)

Hard: LFU Cache (460), All O`one Data Structure (432), Design In-Memory File System (588),
Design Search Autocomplete System (642), Max Stack (716), Insert Delete GetRandom O(1) - Duplicates (381)
