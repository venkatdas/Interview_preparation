# Task Scheduler

| | |
|---|---|
| **Topic** | Heaps and Priority Queues |
| **Difficulty** | Medium |
| **Pattern** | greedy max-heap + cooldown queue |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #621 — https://leetcode.com/problems/task-scheduler/ |
| **Solution file** | [09_task_scheduler.js](../solutions/09_task_scheduler.js) — open only after a real attempt |

## Problem

You get a list of tasks (uppercase letters) and a cooldown n. The CPU runs one
task per unit of time or idles. Two runs of the SAME task must be at least n
units apart. Return the minimum total time to finish all tasks.

## Examples

```
Input: tasks = ["A","A","A","B","B","B"], n = 2   Output: 8
  Explanation: A B idle A B idle A B
Input: tasks = ["A","A","A","B","B","B"], n = 0   Output: 6
Input: tasks = ["A","A","A","A","A","A","B","C","D","E","F","G"], n = 2   Output: 16
  Explanation: A B C A D E A F G A idle idle A idle idle A
```

## Constraints & clarifying questions

```
- Order of tasks is free? (yes, any order)
- n can be 0? (yes -> answer is tasks.length)
- Do you need the schedule or just the length? (just the length)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *greedy max-heap + cooldown queue* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (math formula)   O(n) time, O(26) space. This is a "simpler alternative", not slower.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (greedy simulation with max-heap + cooldown queue). O(T * log 26) time, O(26) space Greedy: at each time step run the task with the HIGHEST remaining count that is not on cooldown (it is the one most likely to cause idle time later).

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- n = 0 -> tasks.length
- single task type -> (count-1)*(n+1)+1
- more distinct tasks than n+1 -> no idle at all
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (math formula)   O(n) time, O(26) space

```
This is a "simpler alternative", not slower. Let maxCount be the highest
frequency and numMax the number of tasks with that frequency. The most
frequent task forces (maxCount - 1) gaps of size n, plus the last row:
  answer = max(tasks.length, (maxCount - 1) * (n + 1) + numMax)
The max with tasks.length handles the case where there are enough other
tasks to fill every idle slot. It works but is hard to justify under pressure.
```

### APPROACH 2 — Optimal (greedy simulation with max-heap + cooldown queue)

```
O(T * log 26) time, O(26) space
Greedy: at each time step run the task with the HIGHEST remaining count
that is not on cooldown (it is the one most likely to cause idle time later).
  maxHeap  = counts of tasks ready to run
  cooldown = queue of [remainingCount, timeWhenReadyAgain]
Loop while either is non-empty:
  time++
  if heap non-empty: pop the biggest count, decrement; if > 0 push to
    cooldown with readyAt = time + n
  if cooldown front's readyAt === time: move it back to the heap
(If heap is empty we idle; time still advances.)

Dry run on AAABBB, n = 2:
  t=1 run A(3->2) cooldown=[(2,3)]     heap={3B}
  t=2 run B(3->2) cooldown=[(2,3),(2,4)] heap={}
  t=3 idle; A ready -> heap={2A}
  t=4 run A(2->1) cooldown=[(2,4)->ready B,(1,6)] heap={2B}
  t=5 run B(2->1) ...
  t=6 idle, A ready; t=7 run A; t=8 run B -> total 8
```

### Edge cases

```
- n = 0 -> tasks.length
- single task type -> (count-1)*(n+1)+1
- more distinct tasks than n+1 -> no idle at all
```

Full JavaScript solution with tests: [09_task_scheduler.js](../solutions/09_task_scheduler.js). Run it with `node 09_task_scheduler.js` from the solutions folder.

</details>

## Common mistakes

- Simulating each idle unit one by one for huge n without the counting formula.
- Forgetting that the answer is never less than the number of tasks.
- Reinserting tasks before their cooldown ends.

## Related follow-ups

- [Task Scheduler](../../../17_Queues_And_Deques/03_Problems/02_Medium/12_task_scheduler.md) (17_Queues_And_Deques)
- [Reorganize String](10_reorganize_string.md)
- Rearrange String k Distance Apart (LeetCode #358)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
