# LRU & LFU Caches — Quiz

Back to the [topic README](../README.md).

**1. (Predict) LRU capacity 2: put(1,1), put(2,2), get(1), put(3,3), get(2), get(3). Outputs of the gets?**

<details><summary>Answer</summary>

`get(1) = 1`, `get(2) = -1` (2 was evicted by put(3,3)), `get(3) = 3`.
</details>

**2. (Predict) LFU capacity 2: put(1,1), put(2,2), get(1), get(2), put(3,3). Which key is evicted?**

<details><summary>Answer</summary>

Both 1 and 2 have frequency 2. Tie → least recently used → key **1** is evicted (2 was used more recently).
</details>

**3. (Multiple choice) Time complexity of `get` and `put` in the hash map + doubly linked list LRU:**
a) O(log n)  b) O(1)  c) O(n)  d) amortised O(log n)

<details><summary>Answer</summary>

b) O(1) for both.
</details>

**4. (Spot the bug)**

```js
get(key) {
  if (!this.map.has(key)) return -1;
  return this.map.get(key).value;
}
```

<details><summary>Answer</summary>

A hit does not refresh recency. The node must be moved to the most-recent end (or, with the `Map` shortcut, deleted and re-set).
</details>

**5. (Spot the bug)**

```js
put(key, value) {
  if (this.map.size === this.capacity) this.evictLRU();
  this.map.set(key, value);
}
```

<details><summary>Answer</summary>

If `key` already exists, the cache is not really growing, but this evicts something anyway. Check for an existing key first (update + refresh), and evict only for a new key.
</details>

**6. (Define the state) In O(1) LFU, what does `minFreq` mean?**

<details><summary>Answer</summary>

The smallest access count among keys currently in the cache, so the eviction victim is in bucket `minFreq`.
</details>

**7. (Multiple choice) After inserting a brand-new key into an LFU cache, `minFreq` becomes:**
a) unchanged  b) minFreq + 1  c) 1  d) the max frequency

<details><summary>Answer</summary>

c) 1 — the new key has been used once.
</details>

**8. (Complexity) Naive array-based LRU (scan to find the key, splice to move it)?**

<details><summary>Answer</summary>

O(n) per `get` and `put`, O(capacity) space.
</details>

**9. (Spot the bug) LRU evicts the victim node from the list but `this.map.size` keeps growing.**

<details><summary>Answer</summary>

The victim's key is never deleted from the map: add `this.map.delete(victim.key)`.
</details>

**10. (Multiple choice) Why is a singly linked list not enough for LRU?**
a) it uses more memory  b) removing a middle node needs its predecessor, O(n) to find  c) it cannot hold keys  d) it is not iterable

<details><summary>Answer</summary>

b)
</details>

**11. (Predict) LFU capacity 0: put(1,1), get(1)?**

<details><summary>Answer</summary>

`-1` — nothing can be stored.
</details>

## Mastery checklist

- [ ] I can code an LRU cache with the `Map` shortcut in under 5 minutes.
- [ ] I can code the hash map + doubly linked list LRU with sentinels in under 20 minutes.
- [ ] I can explain and code LFU with frequency buckets and `minFreq`.
- [ ] I can dry-run a sequence of get/put by hand for both LRU and LFU.
- [ ] I can discuss TTL expiry and LRU vs LFU trade-offs.
