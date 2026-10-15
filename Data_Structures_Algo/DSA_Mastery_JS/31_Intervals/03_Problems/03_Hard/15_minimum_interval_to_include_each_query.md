# Minimum Interval to Include Each Query

| | |
|---|---|
| **Topic** | Intervals and Sweep Line |
| **Difficulty** | Hard |
| **Pattern** | offline queries + heap |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #1851 — https://leetcode.com/problems/minimum-interval-to-include-each-query/ |
| **Solution file** | [15_minimum_interval_to_include_each_query.js](../solutions/15_minimum_interval_to_include_each_query.js) — open only after a real attempt |

## Problem

Given intervals [left, right] (inclusive) and queries q, for each query return the SIZE
(right - left + 1) of the smallest interval that contains q, or -1 if none does.

## Examples

```
Input: intervals = [[1,4],[2,4],[3,6],[4,4]], queries = [2,3,4,5]   Output: [3,3,1,4]
  Explanation: q=2 -> [2,4] size 3; q=3 -> [2,4] size 3; q=4 -> [4,4] size 1; q=5 -> [3,6] size 4
Input: intervals = [[2,3],[2,5],[1,8],[20,25]], queries = [2,19,5,22]   Output: [2,-1,4,6]
```

## Constraints & clarifying questions

```
- Answers must be in the ORIGINAL query order? (yes - so remember indices when sorting)
- n, q up to 10^5 -> O(n * q) is too slow
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *offline queries + heap* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n * q) time, O(1) extra. For each query, scan every interval, keep the smallest size among those containing it.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (offline: sort queries + sort intervals + min-heap by size)   O((n + q) log(n + q)) time, O(n + q) space. Process queries in increasing order (keeping their original index).

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- query smaller than every left -> -1
- query larger than every right -> -1 (heap drains)
- duplicate queries -> same answer
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n * q) time, O(1) extra

```
For each query, scan every interval, keep the smallest size among those containing it.
```

### APPROACH 2 — Optimal (offline: sort queries + sort intervals + min-heap by size)   O((n + q) log(n + q)) time, O(n + q) space

```
Process queries in increasing order (keeping their original index). Sort intervals by
left. Walk a pointer over intervals: push every interval whose left <= q into a min-heap
keyed by size (store [size, right]). Then pop from the heap while the top's right < q
(those intervals ended before q and can never serve a later, larger query either). The
heap top (if any) is the answer for q.
Why it works: once an interval's left <= q it stays eligible for all bigger queries until
its right is passed; sizes do not change; so the heap always holds exactly the
"started but not yet ended" intervals, and the min is the smallest one containing q.

Dry run on intervals [[1,4],[2,4],[3,6],[4,4]], queries [2,3,4,5]:
  q=2: push [1,4] (size 4), [2,4] (size 3). top size 3 right 4 >= 2 -> 3
  q=3: push [3,6] (size 4). top 3 -> 3
  q=4: push [4,4] (size 1). top 1 -> 1
  q=5: top [4,4] right 4 < 5 pop; [2,4] right 4 < 5 pop; [1,4] pop; [3,6] right 6 -> 4
  -> [3,3,1,4]
```

### Edge cases

```
- query smaller than every left -> -1
- query larger than every right -> -1 (heap drains)
- duplicate queries -> same answer
```

Full JavaScript solution with tests: [15_minimum_interval_to_include_each_query.js](../solutions/15_minimum_interval_to_include_each_query.js). Run it with `node 15_minimum_interval_to_include_each_query.js` from the solutions folder.

</details>

## Common mistakes

- Sorting queries and losing their original positions in the answer.
- Popping intervals by size instead of removing those whose right end is already left of the query.
- Off-by-one in the size: inclusive ends mean `right - left + 1`.

## Related follow-ups

- [Meeting Rooms II](../02_Medium/09_meeting_rooms_ii.md)
- [Car Pooling](../02_Medium/10_car_pooling.md)
- Number of Flowers in Full Bloom (LeetCode #2251)
- [The Skyline Problem](../../../30_Divide_And_Conquer/03_Problems/03_Hard/08_the_skyline_problem.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
