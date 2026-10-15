# Server Peak Demand

| | |
|---|---|
| **Topic** | Interview Problem Patterns — "which pattern is this?" drill |
| **Difficulty** | Medium |
| **Pattern** | identify it yourself first (answer inside the walkthrough) |
| **Prerequisites** | [Pattern index](../../README.md) |
| **Source** | Original exercise |
| **Solution file** | [04_server_peak_demand.js](../solutions/04_server_peak_demand.js) — open only after a real attempt |

## Problem

`jobs[i] = [start, end, cpu]`: a job uses `cpu` cores during the half-open time range
`[start, end)`. Return the largest total number of cores in use at any single moment.

## Examples

```
Input: jobs = [[0, 10, 2], [5, 15, 3], [10, 20, 1]]   Output: 5   (time 5..10 uses 2 + 3)
Input: jobs = [[1, 3, 4], [3, 5, 4]]                  Output: 4   (back to back, no overlap)
Input: jobs = []                                      Output: 0
```

## Constraints & clarifying questions

```
- 0 <= n <= 10^5, 0 <= start < end <= 10^9, 1 <= cpu <= 10^4
- Half-open ranges: a job ending at t does not overlap one starting at t.
- Times up to 10^9: you cannot allocate an array indexed by time.
```

## Step 0: name the pattern before you code

Write these three lines down **before** opening any hint (give yourself 3 minutes):

1. **Pattern:** which of the 22 patterns in the [pattern index](../../README.md) is this? Which words in the statement told you?
2. **Target complexity:** given the constraints, what time and space should the optimal solution have?
3. **Brute force:** what is the simplest correct solution and its complexity?

Then check your guess:

<details><summary>Pattern and target complexity (check after writing yours)</summary>

**Pattern:** Sweep line over start/end events. Lesson: [Intervals & Sweep Line](../../01_Concepts/patterns/08_intervals_and_sweep_line.md).

**Target:** O(n log n) time, O(n) space.

</details>

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Recognition.** Clue words: "at any single moment", "maximum total", intervals with huge coordinates.

</details>

<details><summary>Hint 2</summary>

**Start simple.** Brute force: the peak happens at some job's start time. For each start time, add up the jobs active then. O(n^2).

</details>

<details><summary>Hint 3</summary>

**The key idea.** Turn each job into two events: `(start, +cpu)` and `(end, -cpu)`. Sort by time and walk with a running total; the answer is the largest running total.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.** Edge case: at equal times process ends before starts (half-open). Sort by `time`, then by `delta` ascending.

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force

For each job start s, sum cpu of jobs with start <= s < end. O(n^2) time, O(1) space.

### APPROACH 2 — Optimal (Sweep line over start/end events)

```
events = [(start, +cpu), (end, -cpu)] for every job
sort by time, ends first on ties
running += delta; best = max(best, running)
```

### Dry run

```
[[0,10,2],[5,15,3],[10,20,1]]
  events (0,+2) (5,+3) (10,-2) (10,+1) (15,-3) (20,-1)
  running 2, 5, 3, 4, 1, 0 -> best 5
```

### Complexity

O(n log n) to sort 2n events, O(n) space.

### Common mistakes

- Processing a start before an end at the same time, overcounting back-to-back jobs.
- Default `sort()` on arrays compares strings ("10" < "5").

Full JavaScript solution with tests: [04_server_peak_demand.js](../solutions/04_server_peak_demand.js). Run it with `node 04_server_peak_demand.js` from the solutions folder.

</details>

## Related follow-ups

- [statement](../../../31_Intervals/03_Problems/02_Medium/09_meeting_rooms_ii.md) · [solution](../../../31_Intervals/03_Problems/solutions/09_meeting_rooms_ii.js)
- [statement](../../../31_Intervals/03_Problems/02_Medium/10_car_pooling.md) · [solution](../../../31_Intervals/03_Problems/solutions/10_car_pooling.js)
- Pattern lesson: [Intervals & Sweep Line](../../01_Concepts/patterns/08_intervals_and_sweep_line.md)

## After solving

- Did you name the pattern correctly in Step 0? If not, write down the clue you missed in your notes.
- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Log the attempt in `PROBLEM_TRACKER.md` and re-solve it in 3 days, then in 1 week.
