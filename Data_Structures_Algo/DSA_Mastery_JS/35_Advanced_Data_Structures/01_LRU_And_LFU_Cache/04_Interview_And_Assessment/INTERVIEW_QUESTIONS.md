# LRU & LFU Caches — Interview Questions

Answer out loud first, then open the model answer. Back to the [topic README](../README.md) · [concepts guide](../01_Concepts/CONCEPTS.md).

### 1. Why does an O(1) LRU cache need both a hash map and a doubly linked list?

<details><summary>Model answer</summary>

The hash map finds a key's node in O(1). The doubly linked list keeps recency order and lets you unlink any node in O(1) (you have its prev and next) and append it at the "most recent" end in O(1). The least recently used key is always at the other end. Neither structure alone gives O(1) for both lookup and reordering.
</details>

### 2. Why doubly linked and not singly linked?

<details><summary>Model answer</summary>

To remove a node from the middle you need its predecessor. In a singly linked list finding it is O(n). With a `prev` pointer it is O(1).
</details>

### 3. What are sentinel (dummy) head and tail nodes for?

<details><summary>Model answer</summary>

They guarantee every real node has a non-null `prev` and `next`, so unlink and insert need no special cases for an empty list, the first node or the last node. Fewer branches means fewer bugs.
</details>

### 4. How does the JavaScript `Map` shortcut work, and is it acceptable?

<details><summary>Model answer</summary>

`Map` iterates in insertion order. On every access you delete the key and set it again, which moves it to the end; the least recent key is `map.keys().next().value`. All operations are O(1) on average. Mention it, but be ready to write the linked-list version, because many interviewers want the language-independent design.
</details>

### 5. Why must the map store the key inside the list node?

<details><summary>Model answer</summary>

When you evict the node at the LRU end you must also delete its entry from the map. The node is all you have at that moment, so it must know its own key.
</details>

### 6. Walk through `put` when the key already exists.

<details><summary>Model answer</summary>

Update the value, then move the node to the most-recent end. Do not evict anything, because the size does not change. A common bug is evicting first and then discovering the key was already present.
</details>

### 7. How does an O(1) LFU cache work?

<details><summary>Model answer</summary>

Keep `key -> {value, freq}`, a map `freq -> ordered set of keys` (insertion order = recency within that frequency), and `minFreq`. A hit moves the key from bucket `f` to bucket `f+1`; if bucket `f` becomes empty and `f == minFreq`, increase `minFreq`. To evict, take the oldest key in bucket `minFreq`. A new key always has frequency 1, so set `minFreq = 1`.
</details>

### 8. Why can `minFreq` only ever go up by exactly one during a touch?

<details><summary>Model answer</summary>

A touch moves one key from frequency f to f+1. If that emptied the minimum bucket, the moved key now sits in bucket f+1, so the new minimum is exactly f+1. The only other change to `minFreq` is a new insert, which resets it to 1.
</details>

### 9. How are ties broken in LFU, and why does it matter?

<details><summary>Model answer</summary>

Among keys with the smallest frequency, evict the least recently used one. Without a rule the behaviour is not deterministic and the expected outputs fail. Ordered sets (or a linked list per bucket) give recency order inside a bucket for free.
</details>

### 10. What if O(log n) is acceptable for LFU?

<details><summary>Model answer</summary>

Use a min-heap (or ordered set) keyed by `(freq, lastUsedTime)` plus a hash map. Updating a key's priority needs lazy deletion or an indexed heap. It is easier to get right but not O(1).
</details>

### 11. How would you add time-to-live (TTL) expiry?

<details><summary>Model answer</summary>

Store an expiry time with each entry. On `get`, treat expired entries as missing and remove them (lazy expiry). Optionally keep a min-heap by expiry time to clean up in the background. Eviction under capacity pressure still follows LRU.
</details>

### 12. LRU vs LFU — when is each better?

<details><summary>Model answer</summary>

LRU adapts quickly to changing access patterns and is simple; a one-time scan can flush it. LFU keeps long-term popular items, but old popular items can stay forever (cache pollution) unless frequencies decay. Real systems often use hybrids (e.g. LRU-K, TinyLFU).
</details>

### 13. What edge cases would you test?

<details><summary>Model answer</summary>

Capacity 0 (LFU on LeetCode: store nothing), capacity 1, `get` on a missing key, `put` on an existing key (update + recency), repeated gets of the same key, eviction right after an update, and a random comparison against a naive array cache.
</details>
