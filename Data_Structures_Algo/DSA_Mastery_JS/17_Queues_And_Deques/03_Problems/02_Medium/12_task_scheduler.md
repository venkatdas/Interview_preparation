# Task Scheduler

| | |
|---|---|
| **Topic** | Queues and Deques |
| **Difficulty** | Medium |
| **Pattern** | max-heap + cooldown queue / counting |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #621 — https://leetcode.com/problems/task-scheduler/ |
| **Solution file** | [12_task_scheduler.js](../solutions/12_task_scheduler.js) — open only after a real attempt |

## Problem

A CPU runs tasks (letters). Each task takes 1 unit of time. Two SAME tasks
must be at least n units apart (a cooldown). The CPU can idle. Return the
minimum total time to finish all tasks.

## Examples

```
Input: tasks = [A,A,A,B,B,B], n = 2   Output: 8   Explanation: A B idle A B idle A B
Input: tasks = [A,A,A,B,B,B], n = 0   Output: 6
Input: tasks = [A,A,A,A,A,A,B,C,D,E,F,G], n = 2   Output: 16
       A B C A D E A F G A idle idle A idle idle A
```

## Constraints & clarifying questions

```
- Order of tasks is free? (yes)
- Do I return the schedule or just its length? (just the length)
- n can be 0? (yes -> answer is tasks.length)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *max-heap + cooldown queue / counting* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force / simulation (greedy with counts)   O(T * 26) time. At each time unit, run the available task (not cooling down) with the most remaining copies; if none is available, idle.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (max-heap + cooldown queue simulation)   O(T log 26) = O(T) time. The standard interview answer.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- n = 0 -> T
- single task type -> (count-1)*(n+1) + 1
- enough variety that no idle is needed
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force / simulation (greedy with counts)   O(T * 26) time

```
At each time unit, run the available task (not cooling down) with the most
remaining copies; if none is available, idle. Track each task's next
allowed time. Greedy "most frequent first" is correct here.
```

### APPROACH 2 — Optimal (max-heap + cooldown queue simulation)   O(T log 26) = O(T) time

```
The standard interview answer. Each cycle:
  - pop the task with the highest remaining count from the max-heap, run it,
    and if it still has copies left push [count-1, time + n] onto a QUEUE of
    cooling tasks (they re-enter the heap at that time)
  - if the heap is empty but the queue isn't, jump time to the queue's front
    (that's the idle time)
The queue holds tasks in the order they will become available - FIFO.
```

### APPROACH 3 — Formula (counting, O(T))

```
maxCount = highest frequency, numMax = how many tasks have that frequency
  answer = max(T, (maxCount - 1) * (n + 1) + numMax)
Intuition: the most frequent task forces (maxCount-1) gaps of size n+1
("A _ _ A _ _ A"), the other max-frequency tasks ride along at the end, and
everything else fills the gaps. If there are more tasks than gaps, no idle
time is needed and the answer is just T.

Dry run (formula) on AAABBB, n=2:  maxCount=3, numMax=2
  (3-1)*(2+1) + 2 = 8 ; max(6, 8) = 8
```

### Edge cases

```
- n = 0 -> T
- single task type -> (count-1)*(n+1) + 1
- enough variety that no idle is needed
```

Full JavaScript solution with tests: [12_task_scheduler.js](../solutions/12_task_scheduler.js). Run it with `node 12_task_scheduler.js` from the solutions folder.

</details>

## Common mistakes

- Forgetting that the answer is at least the number of tasks.
- Counting the idle gaps per task type rather than per most-frequent "frame".
- Missing ties: several task types can share the maximum frequency.

## Related follow-ups

- [Task Scheduler](../../../19_Heaps_And_Priority_Queues/03_Problems/02_Medium/09_task_scheduler.md) (19_Heaps_And_Priority_Queues)
- [Reorganize String](../../../19_Heaps_And_Priority_Queues/03_Problems/02_Medium/10_reorganize_string.md) (19_Heaps_And_Priority_Queues)
- Rearrange String k Distance Apart (LeetCode #358)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
