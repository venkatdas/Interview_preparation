# Intervals — Interview Questions

Conceptual questions interviewers ask around interval problems. Answer out loud first, then open the model answer.
Back to the [topic README](../README.md) · [Concepts](../01_Concepts/CONCEPTS.md) · [Quiz](QUIZ.md)

---

### 1. What is the condition for two intervals `a` and `b` to overlap?

<details><summary>Model answer</summary>

`a.start <= b.end && b.start <= a.end` for inclusive ends (use `<` for half-open intervals).
It is easier to reason about the opposite: they do NOT overlap only when one ends before the other starts
(`a.end < b.start || b.end < a.start`). Negate that and you get the formula. The shared part is
`[max(starts), min(ends)]`, which is non-empty exactly when the formula is true.

</details>

### 2. Why do almost all interval solutions start by sorting? By what key?

<details><summary>Model answer</summary>

Without order, every interval might interact with every other one, so you would need O(n²) pairwise checks.
After sorting by start, an interval can only interact with the "current" block you are building, so one linear scan
is enough. Total cost: O(n log n) for the sort plus O(n) for the scan.
Sort by **start** for merging, inserting, intersecting and sweeping. Sort by **end** for "pick the maximum number of
non-overlapping intervals" (activity selection), because the earliest finish leaves the most room for the rest.

</details>

### 3. Walk me through Merge Intervals. What is the most common bug?

<details><summary>Model answer</summary>

Sort by start. Put the first interval in the result. For each next interval, compare its start with the end of the
**last interval in the result** (not the previous input interval). If `start <= last.end`, extend
`last.end = max(last.end, end)`; otherwise push a new block.
Common bugs: comparing with the previous input interval (breaks when a long interval absorbed a short one, e.g.
`[1,10],[2,3],[4,5]`), writing `last.end = end` instead of `max(...)` (breaks on containment), and forgetting that
touching intervals usually merge.

</details>

### 4. Insert Interval: why don't you need to sort, and what are the three phases?

<details><summary>Model answer</summary>

The input is already sorted and non-overlapping, so sorting again wastes O(n log n) and signals you did not read the
problem. Phase 1: copy every interval that ends before the new one starts. Phase 2: while intervals start at or before
the new end, absorb them (`start = min`, `end = max`). Push the merged new interval. Phase 3: copy the rest. O(n) time.
You can binary-search phase boundaries, but the output copy is still O(n), so it does not change the big-O.

</details>

### 5. How do you find the minimum number of meeting rooms? Give two approaches.

<details><summary>Model answer</summary>

The answer is the maximum number of meetings running at the same moment.
- **Sweep line:** turn each meeting into `(start, +1)` and `(end, -1)` events, sort by time with `-1` before `+1` on
  ties (a meeting that ends at 10 frees its room for one starting at 10), scan and track the max running count.
- **Min-heap of end times:** sort by start; for each meeting, pop the heap while its smallest end `<= start`
  (those rooms are free), push this meeting's end; the max heap size is the answer.
Both are O(n log n). The sweep is shorter; the heap is useful when you must know *which* room each meeting gets.

</details>

### 6. Why does "sort by end, keep greedily" give the maximum set of non-overlapping intervals?

<details><summary>Model answer</summary>

Exchange argument. Let `g` be the interval with the earliest end. Take any optimal solution and its first interval
`o`. Since `g.end <= o.end`, replacing `o` with `g` cannot create a conflict with the rest of that solution, so there is
an optimal solution that starts with `g`. Remove everything that overlaps `g` and repeat on the rest.
Sorting by start does NOT work: one long interval that starts first can block many short ones
(`[1,100],[2,3],[4,5]`). Minimum removals = n − (maximum kept).

</details>

### 7. Touching intervals like `[1,3]` and `[3,5]` — do they overlap?

<details><summary>Model answer</summary>

It depends on the problem, so ask. In Merge Intervals they merge into `[1,5]`. In Meeting Rooms they do not conflict
(half-open meetings `[1,3)` and `[3,5)`). In Minimum Arrows one arrow at x = 3 bursts both, so they count as overlapping.
In code this is the choice between `<` and `<=`, and in a sweep line it is the tie-break order of `+1` / `-1` events.

</details>

### 8. When would you use a difference array instead of sorting events?

<details><summary>Model answer</summary>

When coordinates are small integers (say up to 10^5 or 10^6). Add `+w` at `start` and `-w` at `end`, then take prefix
sums; each position gives the load at that point. That is O(n + range) with no sort. Car Pooling (locations ≤ 1000) is
the classic case. If coordinates are huge or real numbers, sort the 2n events instead (or coordinate-compress first).

</details>

### 9. How do you intersect two sorted lists of disjoint intervals?

<details><summary>Model answer</summary>

Two pointers. The candidate intersection is `[max(a.start, b.start), min(a.end, b.end)]`; keep it if start <= end.
Then advance the pointer whose interval ends first, because that interval cannot intersect anything later in the
other list. O(n + m) time, no sort needed.

</details>

### 10. Employee Free Time: why can you ignore which employee owns each interval?

<details><summary>Model answer</summary>

"Everyone is free" means "nobody is busy", which is the complement of the union of all busy intervals. Ownership does
not change the union. So flatten, sort by start, merge (or track `busyUntil`), and output the gaps. O(N log N), or
O(N log k) with a k-way heap merge because each employee's list is already sorted.

</details>

### 11. Design a calendar that rejects double bookings (My Calendar I). What data structure?

<details><summary>Model answer</summary>

Keep bookings sorted by start. For a new `[s, e)`, binary-search the first booking with start >= s. Only that booking
and the one just before it can collide: reject if `next.start < e` or `prev.end > s`. Insertion into a JS array is
O(n) due to `splice`, so each booking is O(log n) search + O(n) insert. In Java/C++ a TreeMap / `std::map` makes it
O(log n). For n ≤ 1000 the simple list is fine; say this trade-off out loud.

</details>

### 12. What is an "offline query" technique and when does it help with intervals?

<details><summary>Model answer</summary>

If all queries are known up front, you may answer them in any order and then put answers back in original positions.
Sorting queries lets you sweep intervals once instead of scanning all intervals per query. In Minimum Interval to Include
Each Query you sort intervals by start and queries ascending, push intervals with `start <= q` into a min-heap by size,
pop those with `end < q`, and read the heap top. O((n + q) log(n + q)) instead of O(n · q). Remember to store the
original query index.

</details>

### 13. When are interval trees or segment trees worth it?

<details><summary>Model answer</summary>

When the set of intervals changes over time and you have many queries like "which intervals contain x" or "what is the
max overlap so far" (My Calendar III, Range Module, Falling Squares). An interval tree answers overlap queries in
O(log n + k); a segment tree (often with lazy propagation and coordinate compression) handles range add + range max.
For one-shot questions, sort + scan is simpler and expected.

</details>

### 14. What edge cases do you always check for interval problems?

<details><summary>Model answer</summary>

Empty input; a single interval; identical intervals; one interval containing all others; touching endpoints; zero-length
intervals `[x, x]`; negative coordinates; unsorted input; whether the function may mutate the input (sort a copy if not);
and whether output must be in the original order.

</details>
