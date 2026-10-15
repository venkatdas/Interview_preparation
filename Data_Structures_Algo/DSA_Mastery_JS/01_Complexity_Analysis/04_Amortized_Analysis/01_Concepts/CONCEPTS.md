# Amortized Analysis

Some operations are usually cheap but **occasionally expensive**: `push` on a full array copies everything,
a queue made of two stacks sometimes moves a whole stack, a hash table sometimes rehashes all keys.
**Amortized analysis** proves that over **any sequence** of n operations the **total** cost is small,
so the **average cost per operation** is small, even though a single operation can be slow.
[Time Complexity](../../01_Time_Complexity/README.md) introduced the idea in one paragraph; this topic gives you the three proof methods and makes every claim checkable with operation counters.

---

## 1. Prerequisites (Essential)

- [Time Complexity](../../01_Time_Complexity/README.md) (its short "Amortized analysis" section) and [Big O, Omega, Theta](../../03_Big_O_Omega_Theta/README.md).
- Data structures used as examples: [Arrays](../../../03_Arrays/README.md) (dynamic array), [Stacks](../../../16_Stacks/README.md), [Queues and Deques](../../../17_Queues_And_Deques/README.md), [Hashing](../../../05_Hashing/README.md), [Monotonic Stacks](../../../18_Monotonic_Stacks_And_Queues/README.md), [Union-Find](../../../27_Union_Find_Disjoint_Set/01_Union_Find_Basics/README.md). You can read this topic before them; come back after.

---

## 2. Intuition (Essential)

**A savings account.** Every cheap operation pays a little extra into a bank. When an expensive operation arrives,
the bank already holds enough to pay for it. If you can show the bank never goes negative, the true total cost
is at most the sum of what you charged, and each charge was O(1).

**Amortized ≠ average case.** Average case averages over *random inputs*. Amortized is a **worst-case guarantee for every sequence**: no randomness, no luck.
**Amortized ≠ expected.** "Expected O(1)" (hash tables) depends on random hashing; "amortized O(1)" (array push) does not.

---

## 3. Mental model / analogy + visuals (Essential)

Dynamic array doubling, cost per push (1 = write the new element, +k = copy k old elements):

```
push #:   1   2   3   4   5   6   7   8   9  ...  16  17
capacity: 1   2   4   4   8   8   8   8  16  ...  16  32
cost:     1   2   3   1   5   1   1   1   9  ...   1  17
                  ^       ^               ^            ^   spikes at powers of two
running total after n pushes < 3n   ->   amortized cost < 3 per push

cost
 17|                                                     █
   |
  9|                                 █
  5|                 █
  3|         █
  2|     █
  1| █       █   █ █ █ █ █ █   █ █ █ █ █ █ █ █ █ █ ...
   +---------------------------------------------------> push #
     rare tall spikes, but their total is a geometric series 1 + 2 + 4 + ... < 2n
```

---

## 4. Why it exists (what problem it solves) (Essential)

Worst-case-per-operation analysis is too pessimistic for these structures: it would call `push` O(n) and conclude n pushes cost O(n²), which is false.
Amortized analysis gives the **true total** cost of an algorithm that uses the structure many times, which is what you actually care about when you write
`for (...) arr.push(x)` or run a monotonic stack over an array.

It also explains *design choices*: why arrays **double** instead of growing by 10, why they shrink at **1/4** full instead of 1/2, why a two-stack queue only refills when the out-stack is **empty**.

---

## 5. How it works, step by step

### 5.1 Aggregate method (Essential)

Bound the **total** cost T(n) of any sequence of n operations directly; the amortized cost is T(n)/n.

*Dynamic array (doubling):* n pushes write n elements, and copies happen at sizes 1, 2, 4, ..., < n, so copies total < 2n. T(n) < 3n → amortized O(1).

*Monotonic stack (each element once):* every index is pushed exactly once and popped at most once, so the total number of pops over the whole run is ≤ n, even though one step can pop many. Total O(n), amortized O(1) per element.

*Binary counter:* bit i flips every 2^i increments, so n increments flip at most n + n/2 + n/4 + ... < 2n bits.

### 5.2 Accounting (banker's) method (Essential)

Charge each operation an **amortized cost** ĉ (possibly more than its real cost). The surplus is stored as **credit** on specific elements. Expensive operations are paid from credit. Requirement: **credit never goes negative.** Then Σ real ≤ Σ ĉ.

*Two-stack queue:* charge `enqueue` 3 and `dequeue` 1.
- enqueue: real cost 1 (push to `in`), store 2 credits on the element.
- transfer: each element moved from `in` to `out` costs 2 (pop + push), paid by its 2 credits. Each element is transferred **at most once** (it never goes back).
- dequeue: real cost 1 (pop from `out`). So every operation is O(1) amortized.

*Dynamic array:* charge push 3: 1 for writing itself, 1 to copy itself at the next resize, 1 to copy an "old" element that already spent its credit.

### 5.3 Potential method (Advanced)

Define a **potential** Φ(state) ≥ 0 with Φ(initial) = 0 ("stored energy"). Amortized cost = real cost + ΔΦ.
Summing over the sequence, the ΔΦ terms telescope: Σ amortized = Σ real + Φ(final) − Φ(initial) ≥ Σ real.

*Dynamic array:* Φ = 2·size − capacity (≥ 0 once at least half full).
- normal push: real 1, ΔΦ = +2 → amortized 3.
- push that doubles from capacity c (size = c): real c + 1, Φ before = 2c − c = c, after = 2(c + 1) − 2c = 2 → ΔΦ = 2 − c → amortized 3.

*Binary counter:* Φ = number of 1 bits. An increment that clears t trailing ones and sets one bit costs t + 1 and changes Φ by 1 − t → amortized 2.

*Shrinking arrays:* with "shrink to half when 1/4 full", Φ = |2·size − capacity| style potentials give amortized O(1) for any mix of push/pop. Shrinking at 1/2 full **fails**: alternating push/pop at the boundary resizes every time (thrashing).

### 5.4 Classic structures and their amortized bounds (Essential)

| Structure / algorithm | Expensive event | Why it is rare | Amortized |
|---|---|---|---|
| dynamic array push (double) | copy all on resize | resize sizes form a geometric series | O(1) |
| dynamic array pop (shrink at 1/4) | copy on shrink | need Θ(capacity) ops between resizes | O(1) |
| growth by +k instead of ×2 | copy all on resize | resizes every k pushes | **O(n/k)**, not O(1) |
| queue with two stacks | move whole `in` stack | each element moves once | O(1) |
| hash table with resize at load α | rehash all keys | table doubles → geometric | O(1) (plus expected O(1) per probe) |
| monotonic stack | pop many at once | each element popped ≤ once | O(1) per element |
| binary counter increment | flip many bits | bit i flips every 2^i | O(1) (< 2) |
| union-find (rank + path compression) | long find path | compression flattens paths | O(α(n)) ≈ O(1) |
| splay tree (Advanced) | deep access | potential = Σ log subtree sizes | O(log n) |

### 5.5 Union-find in one paragraph (Advanced)

With union by rank (or size) alone, trees have height ≤ log n, so find is O(log n) worst case. Path compression makes every node on a find path point directly at the root, so later finds are short. Together, any sequence of m operations on n elements costs O(m·α(n)), where α is the inverse Ackermann function (≤ 4 for any n you will ever see). The proof is a potential argument and is not asked in interviews; the *statement* is.

---

## 6. Pseudocode

```
aggregate:   bound TOTAL(n) for the worst sequence; amortized = TOTAL(n) / n
accounting:  pick charges c_op; show stored credit >= 0 after every operation
potential:   pick Φ >= 0, Φ0 = 0; amortized(op) = real(op) + Φ_after - Φ_before; bound it by a constant

push(x):                         // dynamic array, doubling
  if size == capacity:
     newData = allocate(2 * capacity); copy size elements    // rare, cost = size
  data[size++] = x                                           // always, cost 1
```

---

## 7. JavaScript implementation

- [`02_Implementations/amortized_structures.js`](../02_Implementations/amortized_structures.js): `DynamicArray` (configurable growth factor and shrink rule, counts copies), `TwoStackQueue` (counts moves), `ResizingHashTable` (separate chaining, doubles at load factor 0.75, counts rehash work). Self-tests assert *total work ≤ c·n* on random operation sequences.
- [`02_Implementations/amortized_algorithms.js`](../02_Implementations/amortized_algorithms.js): `BinaryCounter` (counts flips, checks the potential argument step by step), `nextGreaterCounted` (monotonic stack with push/pop counters), `UnionFind` with rank + path compression and a parent-pointer step counter.

---

## 8. Dry run on a concrete example

Two-stack queue, operations `enq 1, enq 2, enq 3, deq, enq 4, deq, deq, deq` (moves = elements moved from `in` to `out`):

| Op | in (bottom→top) | out (bottom→top) | real cost | credits stored |
|---|---|---|---|---|
| enq 1 | [1] | [] | 1 | 2 |
| enq 2 | [1,2] | [] | 1 | 4 |
| enq 3 | [1,2,3] | [] | 1 | 6 |
| deq → 1 | [] | [3,2] | 6 (3 moves ×2) + 1 | 0 |
| enq 4 | [4] | [3,2] | 1 | 2 |
| deq → 2 | [4] | [3] | 1 | 2 |
| deq → 3 | [4] | [] | 1 | 2 |
| deq → 4 | [] | [] | 2 + 1 | 0 |

Total real cost 3 + 7 + 3 × 1 + 3 = 16 ≤ charged 4 enqueues × 3 + 4 dequeues × 1 = 16. Credit never negative. ✓

---

## 9. Edge cases

- **Adversarial sequences**: amortized bounds hold for *every* sequence; check the alternating push/pop at a resize boundary.
- **Real-time systems**: amortized O(1) still allows one O(n) spike (e.g. a UI frame that triggers a rehash). If every single operation must be fast, use de-amortized (incremental) structures.
- **Persistence / undo**: if you can repeat an expensive operation on the same old state (e.g. persistent queues), banked credit gets spent twice and amortized bounds break.
- **Starting from a non-empty state**: Φ(initial) must be accounted for.

---

## 10. Complexity analysis

| Operation | Worst single op | Amortized | Total for n ops | Why |
|---|---|---|---|---|
| array push (×2 growth) | O(n) | O(1) | O(n) | copies 1+2+4+...<2n |
| array push (+k growth) | O(n) | O(n/k) | O(n²/k) | copies k+2k+3k+... ≈ n²/(2k) |
| array pop (shrink at 1/4) | O(n) | O(1) | O(n) | ≥ cap/4 ops between resizes |
| two-stack queue enq/deq | O(n) | O(1) | O(n) | each element moved once |
| hash table insert (resize ×2) | O(n) | O(1) expected | O(n) expected | rehash sizes geometric |
| monotonic stack step | O(n) | O(1) | O(n) | each element popped once |
| binary counter increment | O(log n) | O(1) | < 2n flips | Φ = number of ones |
| union-find find/union | O(log n) | O(α(n)) | O(m α(n)) | rank + compression |

Space for all of them: O(n), except dynamic arrays use up to 2× (or 4× with shrinking) the live size.

---

## 11. Alternatives (trade-offs)

| Option | Gives | Costs |
|---|---|---|
| amortized structure (array doubling) | simplest code, O(1) amortized | occasional O(n) spike |
| pre-size (`new Array(n)`), reserve capacity | no spikes when n is known | must know n |
| linked list | O(1) worst-case append | poor cache locality, O(n) indexing |
| de-amortized / incremental resize (move a few elements per op) | O(1) worst case | more complex code, two tables alive |
| deque via circular buffer | O(1) amortized both ends, no transfers | resize spikes |

---

## 12. Common mistakes (and why they happen)

1. **Calling amortized "average case".** It is a worst-case bound over sequences, no probability involved.
2. **Growing by a constant (+10)** and calling push amortized O(1). It is O(n) amortized.
3. **Shrinking at half full**: alternating push/pop at the boundary thrashes, Θ(n) per op.
4. **Two-stack queue that moves elements back** to `in` after each dequeue: every operation becomes O(n).
5. **Double-counting the monotonic-stack while loop** as O(n) per element → claiming O(n²). Count pops in total instead.
6. **Forgetting the potential must start at 0 and stay ≥ 0.**
7. **Assuming JS `Array.prototype.push` is free**: it is amortized O(1); `unshift`/`shift` are O(n) (V8 may optimize small cases, never rely on it).

---

## 13. Patterns / variations with templates

**"Each element enters and leaves once" (aggregate) — monotonic stack, two pointers, sliding window**
```js
for (let i = 0; i < n; i++) {
  while (stack.length && a[stack.at(-1)] < a[i]) stack.pop();   // total pops <= n over the WHOLE loop
  stack.push(i);                                                  // total pushes = n
}                                                                 // => O(n) total
```

**Geometric resizing**
```js
if (size === capacity) { capacity *= 2; /* copy */ }        // never capacity += K
if (size > 0 && size <= capacity / 4) { capacity /= 2; }   // shrink at 1/4, not 1/2
```

**Lazy transfer**
```js
dequeue() { if (!this.out.length) while (this.in.length) this.out.push(this.in.pop()); return this.out.pop(); }
```

**Operation counter to verify a bound**
```js
let work = 0; /* work += real cost of each op */  assert(work <= 3 * ops);
```

---

## 14. Recognition clues

**Think amortized when:**
- a loop has an inner `while` that "might run many times" but each element can be processed only once (stack/queue/pointer moves);
- a structure occasionally rebuilds itself (resize, rehash, rebalance, compaction);
- an interviewer asks "isn't that O(n²)?" about a monotonic stack or two-pointer solution.

**Amortized reasoning does NOT apply when:**
- each operation must be fast individually (latency budgets, real-time);
- the adversary can replay expensive operations (persistent data structures without laziness/memoization);
- the cheap operations do not "pay" for the expensive ones (e.g. growth by a constant).

---

## 15. Interview application

**Talk track:**
- "This looks quadratic because of the inner while, but every index is pushed once and popped at most once, so the total number of pops is at most n. Overall O(n)."
- "The out-stack is refilled only when it's empty, and each element moves from `in` to `out` exactly once, so enqueue and dequeue are amortized O(1)."
- "Array push is amortized O(1) because capacity doubles; the copies form a geometric series that sums to less than 2n."

**What to clarify:** do they need worst-case per operation (latency) or total time? Can operations be undone/replayed?

---

## 16. Problems in this topic

| # | Problem | Difficulty | Focus |
|---|---|---|---|
| 01 | [Binary Counter Bit Flips](../03_Problems/01_Easy/01_binary_counter_flips.md) | Easy | aggregate + potential |
| 02 | [Two-Stack Queue Move Count](../03_Problems/01_Easy/02_queue_two_stacks_moves.md) | Easy | accounting method |
| 03 | [Growth Policy Copy Count](../03_Problems/02_Medium/03_growth_policy_copies.md) | Medium | ×2 vs +k growth |
| 04 | [Shrink Policy Thrashing](../03_Problems/02_Medium/04_shrink_policy_thrashing.md) | Medium | adversarial sequences, shrink at 1/4 |
| 05 | [Union-Find Step Budget](../03_Problems/03_Hard/05_union_find_step_budget.md) | Hard | rank + path compression |

**Practice more (LeetCode):** 232 Implement Queue using Stacks, 155 Min Stack, 901 Online Stock Span, 739 Daily Temperatures, 84 Largest Rectangle in Histogram, 706 Design HashMap, 641 Design Circular Deque, 547 Number of Provinces, 1172 Dinner Plate Stacks, 295 Find Median from Data Stream.
