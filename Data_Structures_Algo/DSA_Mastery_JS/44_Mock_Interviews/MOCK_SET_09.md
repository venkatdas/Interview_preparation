# Mock Interview Set 09 — Design-style Data Structures

**Time:** 75 minutes total. Problem 1: 40 min. Problem 2: 25 min. 10 min to review.
**Covers:** [`35_Advanced_Data_Structures`](../35_Advanced_Data_Structures/README.md), [`17_Queues_And_Deques`](../17_Queues_And_Deques/README.md), [`05_Hashing`](../05_Hashing/README.md), [`15_Linked_Lists`](../15_Linked_Lists/README.md)
**When:** after [MOCK_SET_06](MOCK_SET_06.md) (which had LRU Cache) and [MOCK_SET_08](MOCK_SET_08.md)

**Rules**

- Timer on. Design questions are graded on **API clarity, invariants and tests** as much as on speed.
- Before coding, write the class skeleton (method names, what each returns) and the data structures you will keep.
- State the complexity of every method.
- Write at least three asserts that exercise eviction / limits.
- Score yourself afterwards with the [rubric](RUBRIC.md).

---

## Problem 1 — LFU Cache (LeetCode 460, Hard) — 40 min

**Links:** [LeetCode #460](https://leetcode.com/problems/lfu-cache/) · [curriculum statement + hints](../35_Advanced_Data_Structures/01_LRU_And_LFU_Cache/03_Problems/03_Hard/02_lfu_cache.md) (open after the mock)

Design a cache with a fixed `capacity` and two methods, both O(1) on average:

- `get(key)`: return the value if present (and count this as a use), else `-1`.
- `put(key, value)`: insert or update (an update also counts as a use). If inserting a new key into a full cache,
  first evict the key with the **lowest use count**; among ties, evict the **least recently used** one.

```
const c = new LFUCache(2);
c.put(1, 1); c.put(2, 2);
c.get(1);      // 1      counts: key1=2, key2=1
c.put(3, 3);   // evicts key 2 (count 1)
c.get(2);      // -1
c.get(3);      // 3      counts: key1=2, key3=2
c.put(4, 4);   // tie at count 2 -> evict the least recently used: key 1
c.get(1);      // -1
c.get(3);      // 3
c.get(4);      // 4
```

**Clarifying questions you should ask**

- Capacity 0? (every `put` is a no-op, `get` returns -1)
- Does `put` on an existing key count as a use? (yes)
- Thread safety / concurrency? (not needed, but mention it)

<details>
<summary>Hints</summary>

1. Start from LRU: a hash map plus an ordered list gives "least recently used" in O(1). LFU needs that **per frequency**.
2. Keep `keyToNode` (key -> {value, freq}) and `freqToKeys` (freq -> ordered set of keys, oldest first). In JS a `Map` keeps insertion order, so `freqToKeys.get(f)` can be a `Map` or `Set`.
3. Track `minFreq`. On a use: remove the key from bucket `f`, add it to bucket `f + 1`; if bucket `f` became empty and `f === minFreq`, then `minFreq++`.
4. On insert of a new key: evict the first (oldest) key of bucket `minFreq` if full, then insert with `freq = 1` and set `minFreq = 1`.

</details>

**Expected complexity:** O(1) average for `get` and `put`, O(capacity) space.

**Follow-up questions an interviewer may ask**

- Why can `minFreq` only drop back to 1, never to some other smaller value? (only a brand-new key has a smaller frequency, and it has 1)
- Implement it without `Map` insertion order (doubly linked list per frequency).
- What changes if items also expire after T seconds? (timestamps + lazy expiry on access, or a min-heap by expiry)
- LRU vs LFU: when is each better for a browser image cache? (LRU adapts fast to new pages; LFU protects popular assets but can hold stale "once popular" items)

---

## Problem 2 — Sliding-Window Rate Limiter (Original, Medium) — 25 min

**Links:** queue technique in [`17_Queues_And_Deques`](../17_Queues_And_Deques/README.md) · related LeetCode problems: [Design Hit Counter #362](https://leetcode.com/problems/design-hit-counter/), [Logger Rate Limiter #359](https://leetcode.com/problems/logger-rate-limiter/)

Design `RateLimiter(limit, windowMs)` with one method `allow(userId, timestamp)` that returns `true` if the request
is allowed. A user may make at most `limit` **allowed** requests in any window of `windowMs` milliseconds:
a request at time `t` is allowed if fewer than `limit` allowed requests of that user have timestamps in
`(t - windowMs, t]`. Rejected requests do not count. Timestamps for each user arrive in non-decreasing order.

```
const rl = new RateLimiter(2, 1000);
rl.allow('a', 0);     // true
rl.allow('a', 500);   // true
rl.allow('a', 900);   // false  (two allowed in (-100, 900])
rl.allow('b', 900);   // true   (users are independent)
rl.allow('a', 1000);  // true   (the request at 0 left the window (0, 1000])
rl.allow('a', 1001);  // false  (500 and 1000 are inside (1, 1001])
```

**Clarifying questions you should ask**

- Is the window boundary inclusive or exclusive? (as defined above; say it out loud)
- Do rejected requests count? (no)
- Millions of users: is memory a concern? (yes — discuss cleanup)

<details>
<summary>Hints</summary>

1. Per user, keep a queue of allowed timestamps. `Map<userId, number[]>`.
2. On a request: pop from the front while `front <= t - windowMs`. Then if `queue.length < limit`, push `t` and return `true`.
3. Use a head index instead of `shift()` (which is O(n) on JS arrays), and compact the array occasionally.
4. Memory: delete a user's entry when its queue becomes empty; memory is O(limit) per active user.

</details>

**Expected complexity:** O(1) amortized per call (each timestamp is pushed and popped once), O(users × limit) space.

**Follow-up questions an interviewer may ask**

- Token bucket instead (allows bursts, O(1) memory per user): refill `rate × elapsed`, cap at capacity.
- Fixed window counter: simpler, but allows 2× limit around a boundary. Explain why.
- Distributed across servers? (shared store like Redis with atomic increments; sliding window via sorted sets)
- Timestamps out of order? (a min-heap per user, or reject old timestamps)

---

## Self-review (10 min)

- [ ] I wrote the class skeleton and named the invariants before coding.
- [ ] My LFU updated `minFreq` correctly on both `get` and `put`, including capacity 0.
- [ ] My rate limiter never used `Array.prototype.shift` in a hot loop (or I explained the cost).
- [ ] I wrote asserts for eviction ties and for the exact window boundary.
- [ ] I finished both problems within time.

Fill in the [self-review template](SELF_REVIEW_TEMPLATE.md) and score yourself with the [rubric](RUBRIC.md).
