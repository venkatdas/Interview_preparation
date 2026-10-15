# Assign Tasks to Workers with Capacities

| | |
|---|---|
| **Topic** | Network Flow (Advanced) |
| **Difficulty** | Medium |
| **Pattern** | max flow with node capacities (b-matching) |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md), [01 Maximum Bipartite Matching](01_maximum_bipartite_matching.md) |
| **Source** | Original exercise |
| **Solution file** | [04_assign_tasks_with_capacity.js](../solutions/04_assign_tasks_with_capacity.js) — open only after a real attempt |

## Problem

There are `T` tasks and `W` workers. Worker `w` can take at most `capacity[w]` tasks.
`allowed[i]` lists the workers able to do task `i`. Each task needs one worker or stays
undone. Return the maximum number of tasks that can be done.

## Examples

```
Input: capacity=[2,1], allowed=[[0],[0],[0,1],[1]]    Output: 3
Input: capacity=[1,1,1], allowed=[[0,1,2],[0],[0]]    Output: 2
Input: capacity=[0], allowed=[[0]]                    Output: 0
Input: capacity=[5], allowed=[[0],[0],[0]]            Output: 3
```

## Constraints & clarifying questions

```
- T, W <= 1000; total allowed pairs <= 2 * 10^4; capacity[w] >= 0.
- Are all tasks equally valuable? (yes; weighted -> min-cost flow)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is bipartite matching where one side can be matched more than once.
Capacities are natural in a flow network. See "Modeling recipes" in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** Brute force: for each task, leave it or give it to an allowed worker
with spare capacity; recurse. Greedy fails on `capacity=[1,1], allowed=[[0,1],[0]]`.

</details>

<details><summary>Hint 3</summary>

**The key idea.** source -> task (cap 1), task -> allowed worker (cap 1),
worker -> sink (cap = capacity[w]). Max flow = max tasks done.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- capacity 0 workers, tasks with no allowed worker
- no tasks / no workers -> 0
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O((W+1)^T) time

```
go(i): best of skipping task i, or for each allowed w with left[w] > 0: 1 + go(i+1)
```

### APPROACH 2 — Optimal (max flow)   O(V^2 · E) worst case with Dinic

```
S -> task i (1)      task i -> worker w (1)      worker w -> SINK (capacity[w])

Dry run (example 1):
  S-t0-w0-SINK  (w0 1/2)
  S-t1-w0-SINK  (w0 2/2)
  S-t2-w1-SINK  (w1 1/1)
  t3 only allows w1, which is full; t2 can't move to w0 (full). Stop. Answer 3.
```

### Alternative

Split each worker into `capacity[w]` copies and run plain matching (Kuhn). Works, but the
graph grows with total capacity; the flow model handles any capacity with one edge.

### Common mistakes

```
- Putting the capacity on task->worker edges instead of worker->sink.
- Forgetting source->task capacity 1 (a task could be "done" twice).
```

Full JavaScript solution with tests: [04_assign_tasks_with_capacity.js](../solutions/04_assign_tasks_with_capacity.js). Run it with `node 04_assign_tasks_with_capacity.js` from the solutions folder.

</details>

## Related follow-ups

- Tasks have different values -> min-cost max-flow with cost = -value.
- Every task MUST be done -> check whether max flow equals T.
- Workers have time windows -> add time-slot nodes between tasks and workers.

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
