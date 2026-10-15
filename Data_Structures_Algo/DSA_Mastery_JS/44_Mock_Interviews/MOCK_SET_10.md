# Mock Interview Set 10 — Final Onsite Simulation

**Time:** 80 minutes total. Problem 1: 30 min. Problem 2: 40 min. 10 min to review.
**Covers:** [`10_Searching`](../10_Searching/README.md), [`35_Advanced_Data_Structures`](../35_Advanced_Data_Structures/README.md), [`25_Graph_Algorithms/01_Shortest_Paths`](../25_Graph_Algorithms/01_Shortest_Paths/README.md), [`29_Dynamic_Programming/01_One_Dimensional_DP`](../29_Dynamic_Programming/01_One_Dimensional_DP/README.md)
**When:** the week before a real interview. Do it at the same time of day as your interview.

**Rules**

- Treat it as the real thing: camera on or a friend watching, no notes, plain editor without autocomplete.
- Problem 1 is design-style (class + methods). Problem 2 is a graph problem that is really a DP.
- Talk the whole time. Silence longer than 30 seconds costs points in the [rubric](RUBRIC.md).
- No hints unless your interviewer gives one. If alone, open a hint only at the half-time mark and deduct one point from problem solving.

---

## Problem 1 — Time Based Key-Value Store (LeetCode 981, Medium) — 30 min

**Links:** [LeetCode #981](https://leetcode.com/problems/time-based-key-value-store/) · [curriculum statement + hints](../10_Searching/03_Problems/02_Medium/15_time_based_key_value_store.md) (open after the mock)

Design `TimeMap` with:

- `set(key, value, timestamp)`: store `value` for `key` at `timestamp`.
- `get(key, timestamp)`: return the value set for `key` at the **largest** timestamp `<= timestamp`, or `""` if none.

All `set` calls for a key come with strictly increasing timestamps.

```
const tm = new TimeMap();
tm.set('foo', 'bar', 1);
tm.get('foo', 1);    // "bar"
tm.get('foo', 3);    // "bar"   (latest at or before 3 is time 1)
tm.set('foo', 'bar2', 4);
tm.get('foo', 4);    // "bar2"
tm.get('foo', 5);    // "bar2"
tm.get('foo', 0);    // ""
```

**Clarifying questions you should ask**

- Are timestamps per key strictly increasing? (yes -> appending keeps each list sorted)
- Unknown key? (return `""`)
- Read-heavy or write-heavy? (affects whether you would pick a balanced tree)

<details>
<summary>Hints</summary>

1. `Map<key, Array<[timestamp, value]>>`. Because timestamps increase, every list stays sorted by just pushing.
2. `get` is "last element with time <= t" -> binary search (upper bound minus one).
3. Write the binary search carefully: `lo = 0, hi = len`; while `lo < hi`: if `arr[mid][0] <= t` then `lo = mid + 1` else `hi = mid`. Answer index `lo - 1`.
4. Edge: `lo - 1 === -1` means nothing at or before `t`.

</details>

**Expected complexity:** `set` O(1), `get` O(log n) per key, O(total sets) space.

**Follow-up questions an interviewer may ask**

- Timestamps not increasing? (sorted insertion O(n), or a balanced BST / skip list for O(log n))
- Delete a key at a time? (tombstone entries)
- Huge history: keep only the last N versions? (ring buffer per key)
- How would this look as a frontend undo history? (same structure: versions by time)

---

## Problem 2 — Cheapest Flights Within K Stops (LeetCode 787, Medium) — 40 min

**Links:** [LeetCode #787](https://leetcode.com/problems/cheapest-flights-within-k-stops/) · [curriculum statement + hints](../25_Graph_Algorithms/01_Shortest_Paths/03_Problems/02_Medium/02_cheapest_flights_within_k_stops.md) (open after the mock)

There are `n` cities and directed flights `[from, to, price]`. Return the cheapest price from `src` to `dst` using
**at most `k` stops** (so at most `k + 1` flights), or `-1` if impossible.

```
Input: n = 4, flights = [[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]], src = 0, dst = 3, k = 1
Output: 700   Explanation: 0 -> 1 -> 3; the cheaper 0 -> 1 -> 2 -> 3 (400) uses 2 stops
Input: n = 3, flights = [[0,1,100],[1,2,100],[0,2,500]], src = 0, dst = 2, k = 1   Output: 200
Input: same, k = 0                                                                  Output: 500
```

**Clarifying questions you should ask**

- Stops count intermediate cities only? (yes: `k` stops = `k + 1` edges)
- Prices non-negative? (yes)
- Cycles possible? (yes, they never help with non-negative prices, but your code must terminate)

<details>
<summary>Hints</summary>

1. Plain Dijkstra on cities is wrong: the cheapest way to reach a city may use too many stops, while a pricier way with fewer stops leads to the answer.
2. DP over the number of edges: `cost[e][v]` = cheapest price to reach `v` using at most `e` edges. This is Bellman-Ford limited to `k + 1` rounds.
3. Each round must read from the **previous** round's array (copy it first). Otherwise one round can chain several edges.
4. Alternative: Dijkstra / BFS on states `(city, stopsUsed)`. Explain both; code the one you trust.

</details>

**Expected complexity:** O(k · E) time, O(n) space for the round-limited Bellman-Ford.

**Follow-up questions an interviewer may ask**

- Return the route. (keep a parent per round)
- What if `k` is huge (no limit)? (plain Dijkstra, O(E log V))
- Why does copying the array matter? Show a 3-node example where it breaks.
- Same problem with a coupon that halves one flight. (state `(city, stops, couponUsed)`)

---

## Self-review (10 min)

- [ ] I explained the binary search boundaries and tested `get` before the first `set` time.
- [ ] I explained why plain Dijkstra fails for the stop limit (with a concrete example).
- [ ] I copied the previous round in Bellman-Ford (or explained my state-space alternative).
- [ ] I talked continuously and summarized complexity at the end of each problem.
- [ ] I finished both problems within time.

---

## You finished all ten sets

- Compute your average rubric score across sets 07–10. Average ≥ 3 in every category means you are interview-ready.
- Re-do [MOCK_SET_04](MOCK_SET_04.md) and [MOCK_SET_09](MOCK_SET_09.md) in a month with no hints as a final check.
- Keep the skills fresh with [45_Revision_And_Spaced_Repetition](../45_Revision_And_Spaced_Repetition/) and log everything in [PROBLEM_TRACKER.md](../PROBLEM_TRACKER.md).

Fill in the [self-review template](SELF_REVIEW_TEMPLATE.md) and score yourself with the [rubric](RUBRIC.md).
