# Online Algorithms — Concepts

Sections are labelled **[Essential]** (know these cold for interviews) or **[Advanced]**
(great for senior / infrastructure interviews and for understanding real systems).

---

## 1. Prerequisites

- [Hashing](../../05_Hashing/README.md) — maps and sets are the default state of most stream processors.
- [Sliding Window](../../07_Sliding_Window/README.md) — "the last N items / last T seconds".
- [Queues and Deques](../../17_Queues_And_Deques/README.md) — expiring old events from the front.
- [Monotonic Stacks and Queues](../../18_Monotonic_Stacks_And_Queues/README.md) — stock span, window max.
- [Heaps and Priority Queues](../../19_Heaps_And_Priority_Queues/README.md) — top-k and the streaming median.
- [LRU and LFU Cache](../../35_Advanced_Data_Structures/01_LRU_And_LFU_Cache/README.md) — caching is the classic online problem.

---

## 2. Intuition [Essential]

Most array problems are **offline**: you get the whole input, then compute. Real software is
usually **online**: data trickles in (clicks, prices, log lines) and somebody wants an answer
*now*, after every item.

That changes two things:

1. **You cannot look ahead.** A decision made now (print this log? buy the skis? evict this
   cache entry?) might look silly once the future arrives.
2. **You often cannot remember everything.** A stream can be billions of items. You want
   O(1), O(k) or O(log n) memory — a small **summary** that you update per item.

So an online algorithm is: *state* + *update(item)* + *query()*, with small state and fast update.

---

## 3. Mental model / analogy [Essential]

A cashier with a notepad. Customers come one by one. The cashier cannot see the queue outside
and the notepad has only a few lines. Whatever the manager asks ("average sale today?",
"most common item?", "how many different customers?") must be answerable from the notepad.

```
 stream:  x1  x2  x3  x4  x5  ...  (never ends, seen once, in order)
           |   |   |   |   |
           v   v   v   v   v
        +-------------------------+
        |  small state (summary)  |   update(x) : O(1) .. O(log n)
        |  e.g. count, mean, m2   |   memory    : O(1) .. O(k)
        |  heaps, k counters ...  |
        +-------------------------+
                    |
                 query()  ->  answer after every item
```

Offline vs online at a glance:

| | Offline | Online / streaming |
|---|---|---|
| Input | all at once | one item at a time |
| Look-ahead | yes | no |
| Memory | can store everything | summary, often sub-linear |
| Answers | once, at the end | after every item |
| Judged by | time / space | time / space per item, accuracy, competitive ratio |

---

## 4. Why it exists [Essential]

- **Infinite or huge data**: logs, metrics, network packets. Sorting "the input" is impossible.
- **Latency**: dashboards and rate limiters must answer within microseconds of each event.
- **Decisions under uncertainty**: caching, scheduling, renting vs buying, autoscaling. Here
  the question is not "how fast?" but "how much worse than a fortune-teller am I?" — that is
  **competitive analysis**.
- **Interview reality**: Design Hit Counter, Logger Rate Limiter, Median Finder, LRU Cache,
  Moving Average, Stock Span are all online problems. Recognising this tells you the shape of
  the answer: a class with a constructor holding state, and small per-call methods.

---

## 5. How it works, step by step

### 5.1 The recipe [Essential]

1. Decide what question must be answered after each item.
2. Ask: *what is the minimum I must remember to answer it?* (sum and count? last k values? a heap?)
3. Write `update(item)` so it keeps that state correct **incrementally**.
4. Write `query()` from the state alone.
5. If exact memory is too big, trade accuracy for memory (sketches) and state the error bound.

### 5.2 Running statistics — Welford [Essential]

Mean is easy: keep `n` and `mean`, update `mean += (x - mean) / n`.
Variance by `E[x²] - E[x]²` is a trap: with values around 10⁹ both terms are ~10¹⁸ and their
difference loses all precision. Welford keeps `m2` = sum of squared distances from the mean:

```
n += 1
delta  = x - mean          (distance to OLD mean)
mean  += delta / n
m2    += delta * (x - mean) (times distance to NEW mean)
variance = m2 / n   (sample variance m2 / (n - 1))
```

### 5.3 Moving averages [Essential]

- **Fixed window of size k**: circular buffer + running sum. Subtract the value being
  overwritten, add the new one. O(1) per item, O(k) memory.
- **Exponential moving average (EMA)**: `ema = α·x + (1-α)·ema`. O(1) memory, old values fade
  smoothly. Used for latency smoothing, TCP RTT estimates, stock indicators.
- **Time window ("last 300 seconds")**: queue of (time, count) pairs, or W circular buckets.

### 5.4 Streaming median — two heaps [Essential]

```
      low  (MAX-heap)             high (MIN-heap)
   smaller half of values       larger half of values
        [ 1  3  |5| ]  <=  [ |8|  9  12 ]
                  ^ top         ^ top
 sizes: |low| == |high|  or  |low| == |high| + 1
 median = low.top  (odd)   or  (low.top + high.top) / 2  (even)
```

`add(x)`: push into low, move low's max to high (keeps every low ≤ every high), and if high is
now bigger move its min back. O(log n) per add, O(1) per median.

### 5.5 Top-k in a stream [Essential]

Keep a **min-heap of size k**. Push each item, pop when size exceeds k. The top is the k-th
largest. O(log k) per item, O(k) memory. (Kth Largest in a Stream.)

### 5.6 Reservoir sampling [Essential]

Goal: a uniformly random sample of k items from a stream of unknown length, in O(k) memory.

```
keep the first k items
for item number i (1-based) with i > k:
    j = random integer in [0, i)
    if j < k: reservoir[j] = item       (probability k / i)
```

Why it is fair: item i enters with probability k/i. A later item t replaces one specific slot
with probability (k/t)·(1/k) = 1/t, so it survives step t with probability (t-1)/t. Multiply
from t = i+1 to n: i/n. Total: (k/i)·(i/n) = **k/n** for every item. Telescoping product!

### 5.7 Heavy hitters — Misra-Gries [Essential for the idea, Advanced for proofs]

Find every item with frequency > n/k using k-1 counters:

```
on item x:
  if x has a counter: counter[x]++
  else if a counter is free: counter[x] = 1
  else: decrement EVERY counter, delete the zeros   ("cancel k distinct items")
```

Each "decrement all" removes k different occurrences (k-1 stored ones + x). That can happen
at most n/k times, so an item that appears more than n/k times cannot be fully cancelled.
Survivors are **candidates**; estimates are low by at most n/k. A second pass gives exact counts.
With k = 2 this is the **Boyer-Moore majority vote** (Majority Element, LeetCode 169).

### 5.8 Count-Min sketch [Advanced]

A d × w grid of counters with d independent hash functions. `add(x)`: increment one cell per
row. `estimate(x)`: the **minimum** over the rows. Collisions only add, so it never
under-estimates; with w = ⌈e/ε⌉ and d = ⌈ln(1/δ)⌉ the over-estimate is ≤ εn with probability
1 - δ. Memory is independent of the number of distinct items.

```
          col:  0  1  2  3  4  5  6  7
 h1(x)=2 row1: [0  0  5  0  1  0  0  0]
 h2(x)=6 row2: [0  2  0  0  0  0  4  0]     estimate(x) = min(5, 4, 4) = 4
 h3(x)=0 row3: [4  0  0  1  0  0  0  0]
```

### 5.9 HyperLogLog — counting distinct items [Advanced]

Hash each item to 32 random-looking bits. Seeing a hash that starts with r-1 zeros is like
flipping r-1 tails in a row: you probably saw about 2^r distinct items. One observation is
noisy, so split by the first b bits into m = 2^b registers, keep the max "rank" per register
and combine with a harmonic mean: `E = α·m² / Σ 2^(-register)`. Duplicates hash identically,
so they never change anything. Error ≈ 1.04/√m: with m = 1024 registers (1 KB) about 3%.
A small-range correction (linear counting) fixes estimates when many registers are still 0.

### 5.10 Rate limiters as data structures [Essential]

| Limiter | State | Allow(t) | Trade-off |
|---|---|---|---|
| Fixed window counter | count, window id | reset when window changes | 2x burst at window edges |
| Sliding log | queue of timestamps | drop old, allow if size < limit | exact, O(limit) memory |
| Sliding window counter | two counters | weighted estimate | approximate, O(1) |
| Token bucket | tokens, lastTime | refill `(t - last)·rate`, spend 1 | allows bursts up to capacity |
| Logger (per key) | map key → next allowed | compare & set | O(keys) memory |

Pass time in as an argument (`allow(t)`) — it makes the code deterministic and testable.

### 5.11 Competitive analysis — ski rental [Essential idea]

Rent for 1/day or buy for B. You do not know how many days d you will ski.

- Offline optimum (fortune-teller): `min(d, B)`.
- Online strategy "buy on day k": pays `d` if d < k, else `(k-1) + B`.
- The **competitive ratio** is the worst case of online / optimum over every possible future.

The adversary stops the season the day you buy, so ratio(k) = (k-1+B)/min(k,B). It is
smallest at **k = B** (rent until the rent you paid would equal the price, then buy):
ratio = (2B-1)/B = **2 - 1/B**. No deterministic strategy does better; randomised buying
improves the expectation to e/(e-1) ≈ 1.58.

The same structure appears in spin-then-block locks, TCP delayed ACKs, and keeping a
server warm vs shutting it down.

### 5.12 LRU as online caching [Essential link]

Paging is the textbook online problem: requests for pages arrive, a cache holds k pages, and
on a miss you must evict without knowing future requests. The offline optimum (Belady:
evict the page used furthest in the future) needs the future. **LRU** is k-competitive
(at most k times the optimal number of misses, against an optimum with the same cache size)
and is what you implement with a hash map + doubly linked list — see
[LRU and LFU Cache](../../35_Advanced_Data_Structures/01_LRU_And_LFU_Cache/README.md).

---

## 6. Pseudocode

```
class OnlineThing:
    constructor(params):  state = small summary
    update(item):         adjust state in O(1) / O(log n)
    query():              read the answer from state

StreamingMedian.add(x):
    low.push(x); high.push(low.pop())
    if high.size > low.size: low.push(high.pop())

Reservoir.add(x):
    seen += 1
    if sample.size < k: sample.push(x)
    else: j = randInt(0, seen); if j < k: sample[j] = x

MisraGries.add(x):
    if x in C: C[x] += 1
    elif |C| < k-1: C[x] = 1
    else: for y in C: C[y] -= 1; drop zeros

TokenBucket.allow(t):
    tokens = min(cap, tokens + (t - last) * rate); last = t
    if tokens >= 1: tokens -= 1; return true
    return false
```

---

## 7. JavaScript implementation

Everything lives in [`02_Implementations/streaming.js`](../02_Implementations/streaming.js)
(MinHeap, RunningStats, StreamingMedian, Reservoir / reservoirSample, MisraGries,
CountMinSketch, HyperLogLog, MovingAverage, Ema, SlidingLogRateLimiter, TokenBucket, plus a
seeded PRNG and a 32-bit hash). The core of the two-heap median:

```js
class StreamingMedian {
  constructor() {
    this.low = new MinHeap((a, b) => b - a);   // max-heap: smaller half
    this.high = new MinHeap((a, b) => a - b);  // min-heap: larger half
  }
  add(x) {
    this.low.push(x);
    this.high.push(this.low.pop());
    if (this.high.size() > this.low.size()) this.low.push(this.high.pop());
  }
  median() {
    if (this.low.size() > this.high.size()) return this.low.peek();
    return (this.low.peek() + this.high.peek()) / 2;
  }
}
```

Run `node 02_Implementations/streaming.js` — the self-test compares every structure against a
brute-force reference on random seeded data.

---

## 8. Dry run — streaming median on 5, 15, 1, 3, 8

| step | add | low (max-heap) | high (min-heap) | sizes | median |
|---|---|---|---|---|---|
| 1 | 5 | [5] | [] | 1/0 | 5 |
| 2 | 15 | [5] | [15] | 1/1 | (5+15)/2 = 10 |
| 3 | 1 | [5, 1] | [15] | 2/1 | 5 |
| 4 | 3 | [3, 1] | [5, 15] | 2/2 | (3+5)/2 = 4 |
| 5 | 8 | [5, 3, 1] | [8, 15] | 3/2 | 5 |

Step 4 in detail: push 3 into low → [5,3,1]; move low's max 5 to high → [5,15]; sizes 2/2, done.
Step 5: push 8 into low → [8,3,1]; move 8 to high → [5,8,15]; high is bigger, move 5 back → low [5,3,1].

Dry run — Misra-Gries, k = 3 (2 counters), stream `a b a c a b d a b`:

| item | counters after | note |
|---|---|---|
| a | {a:1} | |
| b | {a:1, b:1} | |
| a | {a:2, b:1} | |
| c | {a:1} | full → decrement all, b drops |
| a | {a:2} | |
| b | {a:2, b:1} | |
| d | {a:1} | full → decrement all |
| a | {a:2} | |
| b | {a:2, b:1} | candidates a, b; exact pass: a=4 > 3 ✓, b=3 ✗ |

---

## 9. Edge cases

- Query before any item arrived (median of nothing, average of nothing): decide and document — return `undefined` or throw.
- Window not full yet: divide by the count seen, not the window size.
- Equal timestamps / out-of-order timestamps: most designs assume non-decreasing time; ask.
- Window boundaries: is an event exactly `window` ago inside or outside? (usually outside).
- k larger than the stream (reservoir returns everything; top-k returns fewer than k).
- Duplicates: HyperLogLog and sets ignore them; counters must count them.
- Floating precision on very long streams (use Welford, or periodically recompute sums).
- Unbounded keys in per-key maps (logger): add expiry or you leak memory.

---

## 10. Complexity analysis

| Structure / operation | Time per item | Space | Why |
|---|---|---|---|
| Running mean / variance (Welford) | O(1) | O(1) | three numbers updated in place |
| Fixed-window moving average | O(1) | O(k) | circular buffer + running sum |
| EMA | O(1) | O(1) | one number |
| Kth largest (min-heap of size k) | O(log k) | O(k) | heap push/pop on k items |
| Streaming median (two heaps) | O(log n) add, O(1) query | O(n) | two heaps hold all values |
| Reservoir sampling | O(1) | O(k) | one random number per item |
| Misra-Gries | O(k) worst, O(1) amortised | O(k) | decrement-all is paid for by increments |
| Count-Min sketch | O(d) | O(d·w) | one cell per row |
| HyperLogLog | O(1) | O(m) bytes | one hash, one register |
| Sliding-log limiter | O(1) amortised | O(limit) | each timestamp enqueued/dequeued once |
| Token bucket | O(1) | O(1) | lazy refill on each call |
| Hit counter (W buckets) | O(1) hit, O(W) query | O(W) | fixed bucket array |
| Online stock span | O(1) amortised | O(n) | each price pushed/popped once |

---

## 11. Alternatives (brute force vs optimized, trade-offs)

| Question | Brute force | Online / streaming answer | Trade-off |
|---|---|---|---|
| Median after each add | sort every time, O(n log n) | two heaps, O(log n) | heaps cannot delete arbitrary items cheaply |
| Average of last k | slice and sum, O(k) | running sum, O(1) | needs O(k) buffer |
| Top items by frequency | full hash map, O(distinct) memory | Misra-Gries / Count-Min, O(k) | approximate, or needs a second pass |
| Distinct count | Set, O(distinct) memory | HyperLogLog, ~1 KB | ~2–3% error |
| Random sample | store all then shuffle | reservoir, O(k) | none (exact uniform) |
| Rate limit | scan all past requests | sliding log / token bucket | memory vs exactness |

If the data is small and fits in memory, the brute force is often fine — say so in an
interview, then show the online version.

---

## 12. Common mistakes (and why they happen)

1. **Variance with `sumSq/n - mean²`** — looks right on small numbers, explodes with large ones (cancellation). Use Welford.
2. **Two heaps without the "move across" step** — pushing x straight into the smaller heap can put a big value into the low half; the halves overlap and the median is wrong.
3. **Using `Array.prototype.shift()` in hot loops** — it is O(n). Use a head index or a circular buffer.
4. **Reservoir off-by-one** — using `random(0, i]` or 0-based `i` changes the probabilities. Use j in [0, seen) where `seen` already counts the current item.
5. **Treating sketch outputs as exact** — Misra-Gries under-estimates, Count-Min over-estimates; verify if exact numbers are required.
6. **Boundary of time windows** — `>` vs `>=` decides whether an event exactly W ago counts.
7. **Updating rate-limiter state on rejected requests** — a spammer can then block themselves forever, or worse, you double-count.
8. **Reading the clock inside the data structure** — tests become flaky; pass time in.
9. **Default sort in JS** — `[10, 9, 1].sort()` is lexicographic. Always pass a comparator.

---

## 13. Patterns / variations with templates

### Template A — "class with state + update + query" [Essential]

```js
class Online {
  constructor(param) { /* smallest state that answers the query */ }
  add(x) { /* O(1) or O(log n) incremental update */ }
  query() { /* read from state only */ }
}
```

### Template B — time window with a queue [Essential]

```js
class LastWindow {
  constructor(windowMs) { this.w = windowMs; this.q = []; this.head = 0; }
  add(t) { this.q.push(t); }
  count(t) {
    while (this.head < this.q.length && this.q[this.head] <= t - this.w) this.head++;
    return this.q.length - this.head;
  }
}
```

### Template C — bounded heap for top-k [Essential]

```js
const heap = new MinHeap();
function add(x) { heap.push(x); if (heap.size() > k) heap.pop(); return heap.peek(); }
```

### Template D — monotonic stack with absorbed counts (spans) [Essential]

```js
const st = [];   // [value, absorbed]
function next(v) {
  let span = 1;
  while (st.length && st[st.length - 1][0] <= v) span += st.pop()[1];
  st.push([v, span]);
  return span;
}
```

### Template E — sketch (approximate counting) [Advanced]

```js
const cms = new CountMinSketch(width, depth);
for (const x of stream) cms.add(x);
cms.estimate('item');   // >= true count, close for heavy items
```

### Variations

- Online interval maintenance (Data Stream as Disjoint Intervals): sorted list + binary search, or a balanced tree.
- Sliding window median / max: two heaps with lazy deletion, or a monotonic deque.
- Weighted reservoir sampling (A-Res): key = random^(1/weight), keep the k largest keys in a heap.
- Exponential decay counters (trending topics): multiply all counts by a factor over time — store a global scale instead.

---

## 14. Recognition clues

**Use online / streaming thinking when you see:**

- "data stream", "called repeatedly", "design a class", "addNum / next / hit / get"
- "in the last N seconds / last k calls"
- "you cannot store all the data", "memory limited", "billions of events"
- "after each insertion return ..."
- "unknown length", "random sample", "approximately how many distinct"
- decisions now with an unknown future: rent vs buy, cache eviction, scheduling

**It does NOT apply (or is overkill) when:**

- The whole input is given once and fits in memory — sort it, use a hash map, done.
- The query needs arbitrary past items deleted or updated (then you need balanced trees,
  segment trees or [range query structures](../../34_Range_Query_Data_Structures), not a simple stream summary).
- Exact answers are required but you reach for a sketch — sketches are approximate.
- Look-ahead is allowed (then offline algorithms like sorting queries, sweep lines or
  Belady's eviction are better).

---

## 15. Interview application

**Talk track:**

1. "This is an online problem: items arrive one at a time and we answer after each one."
2. "What do I need to remember? Let me find the smallest state." (state the invariant out loud)
3. Give the brute force: "store everything and recompute: O(n) per query."
4. Give the incremental version and its per-call complexity.
5. Mention memory growth and how to bound it (expiry, fixed buckets, sketches).
6. Mention concurrency/distribution only if asked: locks per key, sharding by key, approximate counters merged across machines (Count-Min and HyperLogLog are mergeable!).

**Clarifying questions to ask:**

- Are timestamps non-decreasing? Can several events share a timestamp?
- How many calls of each method? (decides whether to make add or query cheap)
- Exact or approximate answers acceptable? What error?
- Memory limits? Number of distinct keys?
- Window boundary inclusive or exclusive?

---

## 16. Problems in this topic

| # | Problem | Difficulty | Pattern |
|---|---|---|---|
| 01 | [Moving Average from Data Stream](../03_Problems/01_Easy/01_moving_average_from_data_stream.md) | Easy | circular buffer + running sum |
| 02 | [Logger Rate Limiter](../03_Problems/01_Easy/02_logger_rate_limiter.md) | Easy | map of next-allowed time |
| 03 | [Kth Largest Element in a Stream](../03_Problems/01_Easy/03_kth_largest_in_a_stream.md) | Easy | min-heap of size k |
| 04 | [Design Hit Counter](../03_Problems/02_Medium/04_design_hit_counter.md) | Medium | circular time buckets |
| 05 | [Online Stock Span](../03_Problems/02_Medium/05_online_stock_span.md) | Medium | monotonic stack |
| 06 | [Ski Rental Simulation](../03_Problems/02_Medium/06_ski_rental_simulation.md) | Medium | competitive analysis |
| 07 | [Top-K Heavy Hitters with Misra-Gries](../03_Problems/02_Medium/07_heavy_hitters_misra_gries.md) | Medium | Misra-Gries + verify |
| 08 | [Find Median from Data Stream](../03_Problems/03_Hard/08_find_median_from_data_stream.md) | Hard | two heaps |
| 09 | [Data Stream as Disjoint Intervals](../03_Problems/03_Hard/09_data_stream_as_disjoint_intervals.md) | Hard | sorted intervals + binary search |

### Practice more

- Majority Element (LeetCode #169) and Majority Element II (LeetCode #229) — Misra-Gries with k = 2 and 3
- Linked List Random Node (LeetCode #382) — reservoir sampling with k = 1
- Random Pick Index (LeetCode #398) — reservoir sampling
- Sliding Window Median (LeetCode #480)
- Number of Recent Calls (LeetCode #933)
- Time Based Key-Value Store (LeetCode #981)
- Stream of Characters (LeetCode #1032)
- Design Twitter (LeetCode #355) — merge recent feeds with a heap
- LRU Cache (LeetCode #146) and LFU Cache (LeetCode #460)
- Finding MK Average (LeetCode #1825)
