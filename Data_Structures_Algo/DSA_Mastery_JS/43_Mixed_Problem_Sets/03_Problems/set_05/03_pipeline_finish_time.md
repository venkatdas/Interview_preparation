# Pipeline Finish Time

| | |
|---|---|
| **Set** | [Mixed Set 05](README.md) — problem 03 of 5 |
| **Difficulty** | Medium |
| **Time box** | 25 minutes (then open Hint 1) |
| **Source** | Original exercise |
| **Solution file** | [03_pipeline_finish_time.js](solutions/03_pipeline_finish_time.js) — open only after a real attempt |

> The topic is hidden on purpose. Part of the skill being trained is recognizing the pattern on your own.

## Problem

A build pipeline has n tasks (0..n-1); task i takes durations[i] minutes. deps lists
pairs [a, b]: task a must FINISH before task b can START. Any number of tasks can run
in parallel. Return the minimum total time to finish every task, or -1 if the
dependencies contain a cycle.

## Examples

```
Input: n = 4, durations = [3, 2, 5, 1], deps = [[0, 2], [1, 2], [2, 3]]   Output: 9   Explanation: 3 -> 5 -> 1
Input: n = 2, durations = [1, 1], deps = [[0, 1], [1, 0]]                 Output: -1
Input: n = 3, durations = [4, 2, 7], deps = []                           Output: 7
```

## Constraints & clarifying questions

```
- n up to 10^5, deps up to 10^5. Durations positive integers.
- Unlimited workers? (yes — otherwise this becomes a scheduling problem)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 25 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1 — which patterns?</summary>

**Pattern.** Topological sort (Kahn) + DP on the DAG (longest path). See [Topological Sorting](../../../26_Topological_Sorting/README.md) and [1-D DP](../../../29_Dynamic_Programming/01_One_Dimensional_DP/README.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** Repeatedly relax "finish[b] ≥ finish[a] + duration[b]" for n rounds; if it still changes, there is a cycle.

</details>

<details><summary>Hint 3</summary>

**The key idea.** In topological order every prerequisite is final before a task is processed, so each task's start time is the max finish of its prerequisites.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- no deps -> max duration
- self-dependency [i, i] -> cycle -> -1
- disconnected chains -> the longest chain wins
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n * (n + E)) time, O(n) space

```
Relax repeatedly: finish[i] = durations[i] + max(finish[a]) over deps into i. Repeat n
rounds (like Bellman-Ford). If round n still changes something there is a cycle.
```

### APPROACH 2 — Optimal (Kahn's topological sort + DP on the DAG = longest path)   O(n + E) time, O(n + E) space

```
Process tasks in topological order. When a task is popped its earliest start is final,
so finish[i] = start[i] + durations[i]; push that start time to each successor:
start[next] = max(start[next], finish[i]). Answer = max finish. If fewer than n tasks
were popped, a cycle blocked them -> -1.

Dry run on example 1:
  indegree [0,0,2,1]   queue [0,1]
  pop 0: finish 3 -> start[2]=3      pop 1: finish 2 -> start[2]=max(3,2)=3, indeg[2]=0 push
  pop 2: finish 3+5=8 -> start[3]=8  pop 3: finish 9
  answer 9
```

### Edge cases

```
- no deps -> max duration
- self-dependency [i, i] -> cycle -> -1
- disconnected chains -> the longest chain wins
```

### Common mistakes

```
- Summing all durations (ignores parallelism).
- Taking the min instead of the max over prerequisites.
```

Full JavaScript solution with tests: [03_pipeline_finish_time.js](solutions/03_pipeline_finish_time.js). Run it with `node solutions/03_pipeline_finish_time.js` from this folder.

</details>

## Related follow-ups

- Only W workers available (heap-based simulation, no longer exact in general)
- Return the critical path
- Which single task, if sped up by 1, reduces the total?

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Write down which pattern you did NOT see at first. That is the one to drill.
- Fill in the set's reflection checklist in [QUIZ.md](../../04_Interview_And_Assessment/QUIZ.md).
- Re-solve from scratch in 3 days, then in 1 week.
