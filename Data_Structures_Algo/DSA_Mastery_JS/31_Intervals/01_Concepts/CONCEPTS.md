# Intervals

An **interval** is a range with a start and an end: `[start, end]`. Meetings on a calendar,
a song's play window, a hotel booking, a cache entry's lifetime - all intervals. Interval
problems ask things like "do these overlap?", "merge the overlapping ones", "how many rooms
do I need?", "where are the gaps?". Almost all of them become easy once you **sort** and
**scan**, and the hard part is just being careful about overlap conditions and edge cases.

---

## Prerequisites

- [Sorting](../../11_Sorting/README.md) — every interval solution starts with a sort, and you must write custom comparators (`(a, b) => a[0] - b[0] || b[1] - a[1]`).
- [Heaps and Priority Queues](../../19_Heaps_And_Priority_Queues/README.md) — for Meeting Rooms II and offline query problems.
- [Prefix Sums and Difference Arrays](../../08_Prefix_Sums_And_Difference_Arrays/README.md) — the integer-coordinate version of the sweep line.
- Helpful: [Two Pointers](../../06_Two_Pointers/README.md) (intersection of two lists) and [Greedy Algorithms](../../28_Greedy_Algorithms/README.md) (scheduling proofs).

## Mental model (Essential)

Think of intervals as **bars on a timeline**, like meetings drawn on a calendar. Sorting by start is like laying
the bars out from left to right. Then you walk a finger along the timeline and only ever look at the bar you are
"holding" right now and the next one.

```
time:   0    2    4    6    8    10   12
        |----A----|                         A = [0,5]
             |--B--|                        B = [2,6]
                         |--C--|            C = [9,12]
holding A -> B starts before A ends -> grow to [0,6] -> C starts after 6 -> new block
```

A **sweep line** is the same finger, but instead of holding bars it keeps a counter: "+1 when a bar starts,
-1 when a bar ends". The highest the counter ever gets is the number of bars stacked at one moment.

---

## Why it matters / when to use

Reach for interval techniques when the problem has any of these signals:

- Input is pairs like `[start, end]`, `[from, to]`, `[arrival, departure]`
- "Merge", "overlap", "conflict", "double-booking", "free time", "gaps"
- "Minimum number of rooms / platforms / machines" → max concurrent intervals
- "Insert a new interval", "remove covered intervals", "non-overlapping"
- "Does a point fall inside any interval?", "which intervals contain this query?"
- Events over time: "passengers on a bus", "attacks with a duration", "how many at once"

---

## How it works

### Representation

Use a plain array `[start, end]` (what LeetCode gives you). For clarity in your own code,
destructure: `const [start, end] = interval`. Decide early whether `end` is **inclusive**
(`[1, 3]` covers 1, 2, 3) or **exclusive** (`[1, 3)` covers 1 and 2). LeetCode usually treats
`[1,3]` and `[3,5]` as **overlapping** for merging (touching counts) but as **non-overlapping**
for scheduling (a meeting ending at 3 and one starting at 3 can share a room). Read the problem.

### The overlap condition (memorise this)

Two intervals `a` and `b` overlap iff

```
a.start <= b.end  &&  b.start <= a.end        (inclusive ends; use < for exclusive)
```

Every case, drawn:

```
   a: |-----|                                  a: |-----|
   b:           |-----|      no overlap        b:     |-----|       overlap (b starts inside a)
      a.end < b.start                             a.start <= b.end && b.start <= a.end

   a:         |-----|                          a: |---------|
   b: |-----|                no overlap        b:    |---|          overlap (b inside a)
      b.end < a.start

   a:    |-----|                               a: |-----|
   b: |-----|                overlap           b:       |-----|     touching: overlap if ends are
      (a starts inside b)                               inclusive, not if exclusive
```

The two "no overlap" pictures are the only ways to miss, so
`overlap = !(a.end < b.start || b.end < a.start)`, which is the same formula. The overlapping
region, if any, is `[max(starts), min(ends)]`.

### Sort by start (usually) vs sort by end (for scheduling)

- **Sort by start** when you merge, insert, intersect, or sweep: you need to see intervals in
  the order they begin so a running "current" interval can absorb the next one.
- **Sort by end** when you pick a maximum set of non-overlapping intervals (activity selection,
  minimum arrows, non-overlapping intervals). Taking the earliest *finish* leaves the most room.
  See `28_Greedy_Algorithms/` for the proof.

### Merge pattern

```
sorted: [1,3] [2,6] [8,10] [15,18]
                 ^ 2 <= 3  -> extend current end to max(3,6) = 6
                       ^ 8 > 6 -> push [1,6], start new current [8,10]
result: [1,6] [8,10] [15,18]
```

### Insert pattern (input already sorted, non-overlapping)

Three phases: (1) push intervals that end before the new one starts; (2) merge everything that
overlaps the new one into it; (3) push the rest. O(n), no sorting.

### Sweep line / event counting

Turn each interval into two events: `+1` at start, `-1` at end. Sort events by time (ties:
process `-1` before `+1` when touching does not count as overlap). Scan, keeping a running
count. The max running count is the max number of simultaneous intervals = rooms needed.

```
[0,30] [5,10] [15,20]
events: (0,+1) (5,+1) (10,-1) (15,+1) (20,-1) (30,-1)
count :   1      2       1       2       1       0     -> max 2 rooms
```

### Min-heap of end times (Meeting Rooms II)

Sort by start. Keep a min-heap of end times of meetings currently running. For each new
meeting, pop every end time <= its start (those rooms are free), push its end. Heap size is
rooms in use; track the max. O(n log n).

### Interval trees (mention only)

When you need many "which intervals contain point x / overlap [a,b]?" queries on a changing
set, an **interval tree** (or a segment tree) answers each in O(log n + k). Rare in
interviews; know the name, then say "for this problem sorting + binary search is enough".

---

## Pseudocode (Essential)

```
MERGE(intervals):
  if intervals is empty: return []
  sort a copy of intervals by start
  result <- [first interval]
  for each interval [s, e] after the first:
    last <- last element of result
    if s <= last.end:  last.end <- max(last.end, e)   // overlap or touch: grow
    else:              append [s, e] to result         // gap: new block
  return result

MAX_CONCURRENT(intervals):           // sweep line
  events <- for each [s, e]: (s, +1) and (e, -1)
  sort events by time; on ties put -1 first (touching does not conflict)
  running <- 0, best <- 0
  for each (time, delta): running += delta; best <- max(best, running)
  return best
```

## Dry run — merge (Essential)

Input: `[[8,10], [1,3], [2,6], [15,18], [6,7]]` → sorted by start: `[1,3] [2,6] [6,7] [8,10] [15,18]`.

| Step | Current interval | last block before | Check | Action | result after |
|---|---|---|---|---|---|
| 0 | [1,3] | — | first | start result | [1,3] |
| 1 | [2,6] | [1,3] | 2 <= 3 | grow end to max(3,6)=6 | [1,6] |
| 2 | [6,7] | [1,6] | 6 <= 6 (touch) | grow end to 7 | [1,7] |
| 3 | [8,10] | [1,7] | 8 > 7 | new block | [1,7] [8,10] |
| 4 | [15,18] | [8,10] | 15 > 10 | new block | [1,7] [8,10] [15,18] |

## Dry run — sweep line for rooms

Input: `[[0,30], [5,10], [10,20], [15,25]]`, touching does not conflict.

| Event (time, delta) | running | best |
|---|---|---|
| (0, +1) | 1 | 1 |
| (5, +1) | 2 | 2 |
| (10, -1) | 1 | 2 |
| (10, +1) | 2 | 2 |
| (15, +1) | 3 | 3 |
| (20, -1) | 2 | 3 |
| (25, -1) | 1 | 3 |
| (30, -1) | 0 | 3 |

Answer: 3 rooms. Note the tie at time 10: the end is processed first, so [5,10] hands its room to [10,20].

---

## Operations & complexity

| Operation | Time | Space | Note |
|-----------|------|-------|------|
| overlap check (two intervals) | O(1) | O(1) | the formula above |
| sort intervals | O(n log n) | O(1)-O(n) | dominates almost every solution |
| merge sorted intervals | O(n) | O(n) output | |
| insert into sorted non-overlapping list | O(n) | O(n) output | no sort needed |
| max concurrent (sweep line) | O(n log n) | O(n) | 2n events |
| max concurrent (heap of ends) | O(n log n) | O(n) | |
| point query "is x booked?" on sorted list | O(log n) | O(1) | binary search |
| dynamic insert + conflict check (calendar) | O(n) per op naive, O(log n) with balanced tree | O(n) | JS has no built-in TreeMap; sorted array + splice is fine for n <= 10^3 |

---

## JavaScript implementation

Full code with tests: [`02_Implementations/interval_utils.js`](../02_Implementations/interval_utils.js). It contains `overlaps`, `merge`, `insert`, and
`sweepLineMaxOverlap`. Core of merge:

```js
function merge(intervals) {
  if (intervals.length === 0) return [];
  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
  const result = [sorted[0].slice()];
  for (let i = 1; i < sorted.length; i++) {
    const last = result[result.length - 1];
    const [start, end] = sorted[i];
    if (start <= last[1]) last[1] = Math.max(last[1], end); // overlaps/touches: extend
    else result.push([start, end]);                         // gap: start a new block
  }
  return result;
}
```

---

## Patterns / variations

### 1. Merge (sort by start, extend the current block)

See above. Use when: "merge overlapping", "union of ranges", "total covered length".

### 2. Insert (three-phase scan)

```js
function insert(intervals, newInterval) {
  const result = [];
  let i = 0;
  let [start, end] = newInterval;
  while (i < intervals.length && intervals[i][1] < start) result.push(intervals[i++]); // before
  while (i < intervals.length && intervals[i][0] <= end) {                             // overlapping
    start = Math.min(start, intervals[i][0]);
    end = Math.max(end, intervals[i][1]);
    i++;
  }
  result.push([start, end]);
  while (i < intervals.length) result.push(intervals[i++]);                           // after
  return result;
}
```

### 3. Two-pointer intersection (two sorted lists)

```js
let i = 0, j = 0;
while (i < A.length && j < B.length) {
  const start = Math.max(A[i][0], B[j][0]);
  const end = Math.min(A[i][1], B[j][1]);
  if (start <= end) result.push([start, end]);
  if (A[i][1] < B[j][1]) i++; else j++;   // drop the one that ends first
}
```
Use when: "intersection of two interval lists", "common free time".

### 4. Sweep line (events +1 / -1)

```js
const events = [];
for (const [start, end] of intervals) { events.push([start, 1]); events.push([end, -1]); }
events.sort((a, b) => a[0] - b[0] || a[1] - b[1]);   // at a tie, -1 before +1
let running = 0, best = 0;
for (const [, delta] of events) { running += delta; best = Math.max(best, running); }
```
Use when: "max simultaneous", "car pooling" (delta = passengers), "minimum platforms".
If coordinates are small (<= 10^5) use a **difference array** instead of sorting.

### 5. Heap of end times

Same answer as sweep line, but keeps the actual set of running intervals, which you need for
"assign each meeting a room number" or "minimum interval containing each query".

### 6. Greedy by end (scheduling)

```js
intervals.sort((a, b) => a[1] - b[1]);
let kept = 0, lastEnd = -Infinity;
for (const [start, end] of intervals) if (start >= lastEnd) { kept++; lastEnd = end; }
```
Use when: "max non-overlapping", "min removals", "min arrows".

### 7. Offline queries (sort queries, sweep intervals)

When asked something per query point and the queries are known up front, sort the queries and
the intervals, and move through both with a heap. Problem 15 (Minimum Interval to Include Each
Query) is the model.

---

## Alternatives and trade-offs

| Approach | Time | Space | Use when | Downside |
|---|---|---|---|---|
| Compare every pair | O(n²) | O(1) | n is tiny, or as a brute-force check | too slow for n = 10^4+ |
| Mark every unit of time (boolean / count array) | O(n · L) | O(L) | coordinates are tiny integers | L (coordinate range) may be 10^9 |
| Sort + linear scan | O(n log n) | O(n) | merge, insert, gaps, greedy selection | needs the whole input up front |
| Sweep line with sorted events | O(n log n) | O(n) | "how many at once", weighted loads | loses identity of individual intervals |
| Difference array + prefix sum | O(n + L) | O(L) | small integer coordinates (Car Pooling) | memory grows with the range |
| Min-heap of end times | O(n log n) | O(n) | need to know which intervals are active | more code than the sweep |
| Sorted list + binary search (calendar) | O(log n) search + O(n) splice | O(n) | online bookings, n ≤ ~10^4 | JS has no balanced tree built in |
| Interval tree / segment tree | O(log n + k) per query | O(n) | many dynamic overlap queries | heavy to write in an interview |

## Assumptions and limitations

- **Endpoints are numbers you can compare.** Dates/strings must be converted first.
- **Inclusive vs half-open is a decision, not a fact.** `interval_utils.js` treats ends as inclusive for
  `overlaps`/`merge`/`insert`, while `sweepLineMaxOverlap` defaults to half-open (touching does not count).
  `totalCoveredLength` measures continuous length (`end - start`), so `[2,2]` has length 0.
- **Merge and the sweep need all intervals up front.** For a stream (Data Stream as Disjoint Intervals, My Calendar)
  you need a sorted structure that supports insertion.
- **Sorting costs O(n log n)** and is the lower bound for most of these problems unless the input is already sorted
  or the coordinates are small enough for counting.
- `insert` requires its input to be sorted and non-overlapping; it does not check this.

## When intervals techniques do NOT apply

- The "intervals" are really **subarrays** defined by a condition on their contents (longest subarray with sum ≤ k).
  That is [Sliding Window](../../07_Sliding_Window/README.md) or prefix sums, not interval merging.
- You must choose intervals that **maximise a weight** (Weighted Interval Scheduling, Maximum Profit in Job
  Scheduling #1235). Greedy by end fails there; use [Dynamic Programming](../../29_Dynamic_Programming/01_Concepts/OVERVIEW.md)
  with binary search.
- Ranges are **updated and queried online many times** (Range Module, My Calendar III at large scale). A one-pass sort
  is not enough; use a [segment tree](../../34_Range_Query_Data_Structures/01_Segment_Tree/README.md) or a balanced map.
- Intervals in **2D** (rectangles) — overlap needs both axes; area of union needs a sweep plus a segment tree.

---

## Common mistakes & edge cases

- **Touching intervals**: `[1,3]` and `[3,5]`. Merge problems: they merge. Room / scheduling
  problems: no conflict. Arrows problem: one arrow at 3 bursts both. Decide `<=` vs `<` first.
- **Unsorted input**: Merge Intervals input is NOT sorted; Insert Interval input IS sorted.
  Sorting when you do not need to costs O(n log n) and may be a red flag to the interviewer.
- Sorting by start but comparing against the **last pushed** interval's end, not the previous
  input interval's end (the previous one may have been absorbed into a longer block).
- Mutating the input (`sort` in place, pushing the same array reference into the result and
  then editing it). Copy with `slice()` / spread when the result must be independent.
- Sweep line tie-breaking: for "rooms" put `-1` before `+1` at the same time; for "overlap
  counts touching" put `+1` first.
- Empty input, a single interval, all intervals identical, one giant interval covering all
  the others, negative coordinates.
- Forgetting to push the last "current" interval after the merge loop ends.

---

## Interview tips

- First sentence: "I'll sort by start and scan, keeping a current merged interval." That
  single plan solves 60% of interval questions.
- Write the overlap condition on the whiteboard before coding and ask whether touching counts.
- For "minimum rooms" say both approaches (heap of ends, or sweep line with +1/-1 events) and
  pick the sweep line - fewer lines, less to get wrong.
- Always state: O(n log n) for the sort, O(n) for the scan.
- Mention interval trees only if asked about many dynamic queries; then say you would use a
  sorted structure and binary search in practice.

---

## Problems in this folder

| # | Problem | Difficulty | Pattern | File |
|---|---------|------------|---------|------|
| 01 | Meeting Rooms | Easy | sort + adjacent check | [01_meeting_rooms.js](../03_Problems/solutions/01_meeting_rooms.js) |
| 02 | Teemo Attacking | Easy | adjacent overlap clip | [02_teemo_attacking.js](../03_Problems/solutions/02_teemo_attacking.js) |
| 03 | Merge Intervals | Medium | sort by start + merge | [03_merge_intervals.js](../03_Problems/solutions/03_merge_intervals.js) |
| 04 | Insert Interval | Medium | three-phase insert | [04_insert_interval.js](../03_Problems/solutions/04_insert_interval.js) |
| 05 | Interval List Intersections | Medium | two pointers | [05_interval_list_intersections.js](../03_Problems/solutions/05_interval_list_intersections.js) |
| 06 | Non-overlapping Intervals | Medium | greedy by end | [06_non_overlapping_intervals.js](../03_Problems/solutions/06_non_overlapping_intervals.js) |
| 07 | Minimum Number of Arrows to Burst Balloons | Medium | greedy by end | [07_minimum_number_of_arrows.js](../03_Problems/solutions/07_minimum_number_of_arrows.js) |
| 08 | Remove Covered Intervals | Medium | sort start asc, end desc | [08_remove_covered_intervals.js](../03_Problems/solutions/08_remove_covered_intervals.js) |
| 09 | Meeting Rooms II | Medium | sweep line / heap of ends | [09_meeting_rooms_ii.js](../03_Problems/solutions/09_meeting_rooms_ii.js) |
| 10 | Car Pooling | Medium | sweep line with weights | [10_car_pooling.js](../03_Problems/solutions/10_car_pooling.js) |
| 11 | My Calendar I | Medium | sorted list + overlap check | [11_my_calendar_i.js](../03_Problems/solutions/11_my_calendar_i.js) |
| 12 | My Calendar II | Medium | double-booking list | [12_my_calendar_ii.js](../03_Problems/solutions/12_my_calendar_ii.js) |
| 13 | Data Stream as Disjoint Intervals | Hard | sorted insert + merge neighbours | [13_data_stream_as_disjoint_intervals.js](../03_Problems/solutions/13_data_stream_as_disjoint_intervals.js) |
| 14 | Employee Free Time | Hard | merge all, read the gaps | [14_employee_free_time.js](../03_Problems/solutions/14_employee_free_time.js) |
| 15 | Minimum Interval to Include Each Query | Hard | offline queries + heap | [15_minimum_interval_to_include_each_query.js](../03_Problems/solutions/15_minimum_interval_to_include_each_query.js) |

---

## Practice more

Easy: Summary Ranges (228), Can Place Flowers (605, same vibe), Find the Range Intervals,
Check If All the Integers in a Range Are Covered (1893)

Medium: Minimum Platforms (classic), Maximum Population Year (1854), Count Days Spent Together
(2409), Divide Intervals Into Minimum Number of Groups (2406), Points That Intersect With Cars
(2848), Video Stitching (1024), Add Bold Tag in String (616), Range Module (715, hard in practice),
Partition Labels (763), Amount of New Area Painted Each Day (2158)

Hard: My Calendar III (732), Falling Squares (699), The Skyline Problem (218),
Number of Flowers in Full Bloom (2251), Count Integers in Intervals (2276)
