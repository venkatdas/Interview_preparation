# Online Algorithms — Interview Questions

Answer each question out loud first, then open the model answer.
Concepts: [CONCEPTS.md](../01_Concepts/CONCEPTS.md) · Code: [streaming.js](../02_Implementations/streaming.js)

---

### 1. What is the difference between an online and an offline algorithm?

<details><summary>Model answer</summary>

An offline algorithm sees the whole input before producing output, so it can sort, look ahead
and use as much memory as the input needs. An online algorithm receives the input one item at
a time and must update its answer (or make a decision) after each item without knowing the
future. Streaming algorithms are online algorithms that additionally keep memory much smaller
than the stream. Example: computing the median of a fixed array (offline, sort it) vs
answering the median after every insertion (online, two heaps).

</details>

### 2. How do you compute a running variance safely, and why not use E[x²] − E[x]²?

<details><summary>Model answer</summary>

Use Welford's algorithm: keep n, mean and m2. For each x: `delta = x - mean; mean += delta/n;
m2 += delta * (x - mean)`. Variance is m2/n (or m2/(n-1) for the sample variance).
`E[x²] − E[x]²` subtracts two huge, nearly equal numbers when values are large (for example
timestamps or prices around 10⁹), so floating-point cancellation destroys the result, and it
can even become negative. Welford only works with distances from the mean, which stay small.

</details>

### 3. Explain the two-heap median. Why do we push into one heap and then move the top to the other?

<details><summary>Model answer</summary>

A max-heap holds the smaller half, a min-heap holds the larger half, sizes equal or the low
half bigger by one; the median is on the tops. Pushing x into low and then moving low's
maximum into high guarantees the invariant "every value in low ≤ every value in high" no
matter how big x is, without comparing x to both tops by hand. Then we rebalance sizes by
moving high's minimum back if high grew bigger. Each add is O(log n), each median O(1).

</details>

### 4. How do you pick k uniformly random items from a stream of unknown length?

<details><summary>Model answer</summary>

Reservoir sampling: keep the first k items. For the i-th item (1-based, i > k) pick j uniformly
in [0, i); if j < k replace reservoir[j]. Item i enters with probability k/i and survives
each later step t with probability 1 − 1/t; the product telescopes to i/n, so overall
k/i · i/n = k/n for every item. Memory O(k), one random number per item.

</details>

### 5. How would you find all items that appear more than n/k times in a huge stream using O(k) memory?

<details><summary>Model answer</summary>

Misra-Gries with k − 1 counters: increment an existing counter, otherwise take a free one,
otherwise decrement all counters and delete zeros. Each decrement-all cancels k distinct
occurrences, which can happen at most n/k times, so any item with frequency > n/k survives.
The survivors are candidates with counts under-estimated by at most n/k; a second pass gives
exact counts and removes false positives. Boyer-Moore majority vote is the k = 2 case.

</details>

### 6. Count-Min sketch vs Misra-Gries — when would you use each?

<details><summary>Model answer</summary>

Misra-Gries is deterministic, tracks only the heavy items and under-estimates; it answers
"who are the heavy hitters?". Count-Min answers "roughly how often did item x occur?" for any
x, over-estimates (never under), is randomised, and is **mergeable** across machines by adding
the tables — ideal for distributed counting. Combine Count-Min with a small heap to track
approximate top-k.

</details>

### 7. How does HyperLogLog estimate the number of distinct elements?

<details><summary>Model answer</summary>

Hash each element to uniform bits. The position of the first 1-bit is like a run of coin
tails; observing a long run means many distinct hashes were seen (about 2^rank). One
observation is noisy, so the first b bits choose one of m = 2^b registers, each keeps the max
rank, and a bias-corrected harmonic mean combines them. Duplicates hash identically, so they
change nothing. Standard error is about 1.04/√m — roughly 2% with 2 KB — and registers merge
by taking the element-wise max, so it scales to distributed systems (Redis PFCOUNT).

</details>

### 8. What is the competitive ratio? Walk me through ski rental.

<details><summary>Model answer</summary>

The competitive ratio of an online algorithm is the worst case, over all inputs, of its cost
divided by the cost of the optimal offline algorithm that knows the future. In ski rental
(rent 1/day or buy for B), the strategy "buy on day k" pays (k−1)+B if the season reaches day k,
while the optimum pays min(d, B). The adversary ends the season right after you buy, so the
ratio is (k−1+B)/min(k,B), minimised at k = B: 2 − 1/B. So the break-even strategy never pays
more than about twice the hindsight optimum, and no deterministic strategy does better.

</details>

### 9. Why is LRU considered an online algorithm, and how good is it?

<details><summary>Model answer</summary>

Cache eviction must be decided at each miss without knowing future requests — an online
decision. The offline optimum (Belady/MIN) evicts the page used furthest in the future. LRU is
k-competitive for a cache of size k (against an optimum with the same size), which is the best
possible for deterministic algorithms, and works well in practice because of temporal locality.
Implementation: hash map + doubly linked list for O(1) get/put
([LRU and LFU Cache](../../35_Advanced_Data_Structures/01_LRU_And_LFU_Cache/README.md)).

</details>

### 10. Compare sliding-log, fixed-window and token-bucket rate limiters.

<details><summary>Model answer</summary>

Fixed window: one counter per window, O(1) memory, but allows up to 2× the limit around a
window boundary. Sliding log: queue of accepted timestamps, exact, O(limit) memory per key.
Sliding-window counter: weight the previous window's count, approximate but O(1). Token bucket:
tokens refill at a rate up to a capacity, each request spends one; it allows controlled bursts
and has O(1) state (tokens, last time). In code, pass the current time in so it is testable.

</details>

### 11. Design Hit Counter: what changes when there are millions of hits per second?

<details><summary>Model answer</summary>

Storing one entry per hit is too much memory. Group by second: either a deque of
(second, count) pairs or 300 circular buckets indexed by `t % 300`, each storing the second it
belongs to and a count. Memory becomes O(300) regardless of traffic, `hit` is O(1) and
`getHits` is O(300) (or O(1) with a running total updated on eviction). In a concurrent setting
you would use atomic counters per bucket or shard counters per thread and sum them.

</details>

### 12. Why is Online Stock Span O(1) amortised?

<details><summary>Model answer</summary>

Each price is pushed onto the monotonic stack once and popped at most once. A single call may
pop many entries, but the total number of pops over n calls is at most n, so the total work is
O(n) and the average per call is O(1). Popped entries pass their spans to today's entry so no
information is lost.

</details>

### 13. When should you NOT reach for a streaming algorithm?

<details><summary>Model answer</summary>

When the input is small and given all at once (just sort or hash it), when exact answers are
required but the proposed structure is approximate, when you need to delete or update
arbitrary past items (use balanced trees, segment trees or Fenwick trees), or when look-ahead
is allowed so an offline algorithm (processing queries in sorted order, Belady eviction) can
do strictly better.

</details>
