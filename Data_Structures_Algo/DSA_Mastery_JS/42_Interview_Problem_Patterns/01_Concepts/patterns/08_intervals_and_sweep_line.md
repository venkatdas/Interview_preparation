# 08. Intervals & Sweep Line

Interval problems give you ranges `[start, end]`: meetings, bookings, segments. Almost all of
them start the same way: **sort by start** (or by end), then walk once and compare the current
interval with the last one you kept.

A **sweep line** is the other big tool: turn every interval into two events, `(start, +1)` and
`(end, -1)`, sort the events by time, and walk them while keeping a running count. The maximum
running count is "how many overlap at the busiest moment".

**Teaches in depth:** [Intervals](../../../31_Intervals/README.md), [Greedy Algorithms](../../../28_Greedy_Algorithms/README.md)

---

## 1. Recognition clues

| Words in the problem | Why it hints at intervals / sweep |
|---|---|
| "merge overlapping intervals" | sort by start, extend the last one |
| "insert a new interval" into sorted ones | three phases: left, overlap, right |
| "minimum meeting rooms", "max concurrent", "busiest time" | sweep line count (or a min-heap of end times) |
| "intersection of two interval lists" | two pointers, advance the one that ends first |
| "free time", "gaps" | merge, then read the gaps |
| "can attend all meetings" | sort, check adjacent pairs |
| "calendar booking" online | sorted structure or a sweep over a map of deltas |

**Constraint hints**

- n up to 10^5 -> O(n log n) for the sort is the expected cost.
- Coordinates up to 10^9 -> you cannot use an array indexed by time; use events (sweep) or coordinate compression.

## 2. When it applies (preconditions)

- Each item is a range on a single line (time, positions).
- The question is about overlap, coverage, or count over time.
- Clarify **closed vs half-open**: do `[1, 2]` and `[2, 3]` overlap? Meetings usually say no (half-open), merge problems usually say yes (closed).

## 3. When it does NOT apply

- **Weighted selection.** "Pick non-overlapping jobs to maximize *profit*". Jobs (start, end, profit):
  `[1, 3, 1]`, `[2, 5, 100]`, `[4, 6, 1]`. Greedy by earliest end takes jobs 1 and 3 (profit 2), but
  job 2 alone gives 100. Counting is greedy; weighting is DP. Use DP + binary search (Maximum Profit in Job Scheduling).
- **2D rectangles.** Overlap of rectangles needs a 2D approach (geometry or a segment tree sweep), not a 1D merge.
- **Queries "what covers point p?" mixed with updates** at scale -> an interval tree or segment tree.

## 4. The template

```js
function mergeIntervals(intervals) {
  const sorted = intervals.map((x) => x.slice()).sort((a, b) => a[0] - b[0]);
  const out = [];
  for (const cur of sorted) {
    const last = out[out.length - 1];
    if (last && cur[0] <= last[1]) last[1] = Math.max(last[1], cur[1]);
    else out.push(cur);
  }
  return out;
}

// Sweep line: max number of intervals [s, e) active at once (Meeting Rooms II)
function maxOverlap(intervals) {
  const events = [];
  for (const [s, e] of intervals) { events.push([s, 1]); events.push([e, -1]); }
  events.sort((a, b) => a[0] - b[0] || a[1] - b[1]);   // at equal time, process ends (-1) first
  let active = 0;
  let best = 0;
  for (const [, delta] of events) { active += delta; best = Math.max(best, active); }
  return best;
}
```

Tested in [pattern_templates.js](../../02_Implementations/pattern_templates.js) (`mergeIntervals`, `insertInterval`, `maxOverlap`) and [tests/patterns.test.js](../../tests/patterns.test.js).

**Dry run** `maxOverlap([[0, 30], [5, 10], [15, 20]])`. Events sorted:
`(0,+1) (5,+1) (10,-1) (15,+1) (20,-1) (30,-1)` -> active 1, 2, 1, 2, 1, 0 -> answer 2.

## 5. Variations

- **Insert interval:** copy all that end before the new start; merge all that start before the new end; copy the rest (`insertInterval`, O(n), no sort).
- **Meeting rooms with a heap:** sort by start, keep a min-heap of end times; pop when the earliest end <= current start.
- **Interval intersections:** two pointers; intersection is `[max(starts), min(ends)]` if valid; advance the one that ends first.
- **Remove covered intervals:** sort by start asc, end desc; count those whose end exceeds the max end so far.
- **Employee free time:** merge everything, then the gaps between merged intervals.
- **Difference map for bookings:** `Map<time, delta>`, sorted keys, running sum (My Calendar II/III, Car Pooling).

## 6. Common pitfalls

1. Not sorting first, or sorting with the default (string) comparator.
2. Merging with `last[1] = cur[1]` instead of `Math.max(last[1], cur[1])`: `[1, 10]` then `[2, 3]` would shrink the interval.
3. Tie order in a sweep: if ends must be processed before starts at the same time (half-open), sort `-1` before `+1`.
4. Mutating the input intervals when merging (`last[1] = ...` edits the caller's array). Copy first, as the template does.
5. Confusing `<` and `<=` for "touching" intervals. Write the rule down after clarifying.

## 7. Representative problems

| # | Problem | Difficulty | Why this pattern | Page |
|---|---|---|---|---|
| 1 | Meeting Rooms | Easy | sort + adjacent check | [statement](../../../31_Intervals/03_Problems/01_Easy/01_meeting_rooms.md) · [solution](../../../31_Intervals/03_Problems/solutions/01_meeting_rooms.js) |
| 2 | Merge Intervals | Medium | sort by start + extend | [statement](../../../31_Intervals/03_Problems/02_Medium/03_merge_intervals.md) · [solution](../../../31_Intervals/03_Problems/solutions/03_merge_intervals.js) |
| 3 | Insert Interval | Medium | three phases | [statement](../../../31_Intervals/03_Problems/02_Medium/04_insert_interval.md) · [solution](../../../31_Intervals/03_Problems/solutions/04_insert_interval.js) |
| 4 | Interval List Intersections | Medium | two pointers | [statement](../../../31_Intervals/03_Problems/02_Medium/05_interval_list_intersections.md) · [solution](../../../31_Intervals/03_Problems/solutions/05_interval_list_intersections.js) |
| 5 | Non-overlapping Intervals | Medium | greedy by end | [statement](../../../31_Intervals/03_Problems/02_Medium/06_non_overlapping_intervals.md) · [solution](../../../31_Intervals/03_Problems/solutions/06_non_overlapping_intervals.js) |
| 6 | Minimum Number of Arrows | Medium | greedy by end | [statement](../../../31_Intervals/03_Problems/02_Medium/07_minimum_number_of_arrows.md) · [solution](../../../31_Intervals/03_Problems/solutions/07_minimum_number_of_arrows.js) |
| 7 | Meeting Rooms II | Medium | sweep / heap of ends | [statement](../../../31_Intervals/03_Problems/02_Medium/09_meeting_rooms_ii.md) · [solution](../../../31_Intervals/03_Problems/solutions/09_meeting_rooms_ii.js) |
| 8 | Car Pooling | Medium | sweep with weights | [statement](../../../31_Intervals/03_Problems/02_Medium/10_car_pooling.md) · [solution](../../../31_Intervals/03_Problems/solutions/10_car_pooling.js) |
| 9 | My Calendar II | Medium | delta map sweep | [statement](../../../31_Intervals/03_Problems/02_Medium/12_my_calendar_ii.md) · [solution](../../../31_Intervals/03_Problems/solutions/12_my_calendar_ii.js) |
| 10 | Employee Free Time | Hard | merge then gaps | [statement](../../../31_Intervals/03_Problems/03_Hard/14_employee_free_time.md) · [solution](../../../31_Intervals/03_Problems/solutions/14_employee_free_time.js) |

## 8. Self-check

**Q1.** Meetings `[[1, 5], [5, 8]]`. One room or two? What decides it in `maxOverlap`?

<details><summary>Answer</summary>

One room (half-open meetings). The tie rule sorts the end event `(5, -1)` before the start `(5, +1)`, so the count drops to 0 before going back to 1.

</details>

**Q2.** Why does merge sort by start, not by end?

<details><summary>Answer</summary>

Sorting by start guarantees that anything overlapping the last merged interval comes next. With sort by end, `[[2, 3], [1, 10]]` would leave `[2, 3]` and `[1, 10]` unmerged unless you look backward.

</details>

**Q3.** What is the cost of Meeting Rooms II with a sweep line?

<details><summary>Answer</summary>

O(n log n) time to sort 2n events, O(n) space for the events.

</details>

---

Previous: [07. Sorting + Greedy Selection](07_sorting_and_greedy_selection.md) · Next: [09. Monotonic Stack & Queue](09_monotonic_stack_and_queue.md) · [Pattern index](../../README.md)
