# LFU Cache

| | |
|---|---|
| **Topic** | LRU and LFU Caches |
| **Difficulty** | Hard |
| **Pattern** | frequency buckets + minFreq |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #460 — https://leetcode.com/problems/lfu-cache/ |
| **Solution file** | [02_lfu_cache.js](../solutions/02_lfu_cache.js) — open only after a real attempt |

## Problem

Design a cache with fixed capacity where eviction removes the LEAST FREQUENTLY USED
key; if several keys tie on frequency, evict the least RECENTLY used among them.
  - get(key): value or -1; increases the key's use counter
  - put(key, value): insert/update (also counts as a use); evict first if full
Both in O(1) average time.

## Examples

```
LFUCache(2); put(1,1); put(2,2); get(1) -> 1 (freq 1:2, 2:1); put(3,3) evicts 2;
get(2) -> -1; get(3) -> 3 (freq 3:2); put(4,4): 1 and 3 tie on freq 2, 1 is older -> evict 1;
get(1) -> -1; get(3) -> 3; get(4) -> 4
```

## Constraints & clarifying questions

```
- Capacity can be 0 (then put does nothing)
- Updating an existing key's value counts as a use
- Do we evict on get? (never; only when inserting a NEW key into a full cache)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *frequency buckets + minFreq* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n) per operation. Array of {key, value, freq, lastUsed}.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Frequency buckets + minFreq)   O(1) per operation. keyToNode: Map key -> {key, value, freq} buckets:   Map freq -> Set of keys (JS Set keeps insertion order => first = least recent) minFreq:   smallest frequency present touch(node): remove key from bucket[freq]; if that bucket is now empty and freq === minFreq

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- capacity 0
- repeated puts on the same key (frequency keeps growing, nothing evicted)
- all keys have equal frequency -> behaves like LRU
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n) per operation

```
Array of {key, value, freq, lastUsed}. get/put scan the array. Evict by scanning for the
minimum (freq, lastUsed) pair.
```

### APPROACH 2 — Optimal (Frequency buckets + minFreq)   O(1) per operation

```
keyToNode: Map key -> {key, value, freq}
buckets:   Map freq -> Set of keys (JS Set keeps insertion order => first = least recent)
minFreq:   smallest frequency present
touch(node): remove key from bucket[freq]; if that bucket is now empty and freq === minFreq,
  minFreq++; freq++; add key to bucket[freq] (at the end = most recent).
put new key when full: victim = first key of bucket[minFreq]; delete it; then insert the
  new key into bucket[1] and set minFreq = 1.

Dry run (capacity 2):
  put(1,1): buckets {1: [1]}            minFreq 1
  put(2,2): buckets {1: [1, 2]}         minFreq 1
  get(1):   bucket1 = [2], bucket2 = [1]  (bucket 1 not empty -> minFreq stays 1)
  put(3,3): full; victim = first of bucket[1] = 2; evict; insert 3: {1: [3], 2: [1]}, minFreq 1
  get(3):   {2: [1, 3]} bucket 1 emptied and 1 === minFreq -> minFreq 2
  put(4,4): full; victim = first of bucket[2] = 1; {2: [3]} then {1: [4], 2: [3]} minFreq 1
```

### Edge cases

```
- capacity 0
- repeated puts on the same key (frequency keeps growing, nothing evicted)
- all keys have equal frequency -> behaves like LRU
```

Full JavaScript solution with tests: [02_lfu_cache.js](../solutions/02_lfu_cache.js). Run it with `node 02_lfu_cache.js` from the solutions folder.

</details>

## Common mistakes

- Breaking frequency ties arbitrarily; among the least-frequent keys you must evict the least recently used one.
- Not updating `minFreq` after a touch empties the smallest bucket, or not resetting it to 1 on a new insert.
- Ignoring capacity 0, where `put` must store nothing.

## Related follow-ups

- [LRU Cache](../02_Medium/01_lru_cache.md)
- All O(1) Data Structure (LeetCode #432)
- Maximum Frequency Stack (LeetCode #895)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
