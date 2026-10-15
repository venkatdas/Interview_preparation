# Task Scheduler

| | |
|---|---|
| **Topic** | Greedy Algorithms |
| **Difficulty** | Medium |
| **Pattern** | greedy math / heap |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #621 — https://leetcode.com/problems/task-scheduler/ |
| **Solution file** | [15_task_scheduler.js](../solutions/15_task_scheduler.js) — open only after a real attempt |

## Problem

tasks is an array of uppercase letters; each letter is a task that takes one time unit.
The same task must be separated by at least n units (other tasks or idle time).
Return the minimum total time to finish all tasks.

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
- Can we reorder tasks freely? (yes)
- n = 0? (just tasks.length)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *greedy math / heap* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Simulation with a max-heap (greedy)   O(T * 26 log 26) time, O(26) space. Each round of n+1 slots: pick up to n+1 tasks with the highest remaining counts, run them, put the leftovers back.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (greedy math formula)   O(T) time, O(26) space. Let maxFreq = the highest count, and k = how many letters have that count.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- n = 0 -> tasks.length
- a single task type -> (count-1)*(n+1)+1
- many distinct tasks -> tasks.length wins over skeleton
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Simulation with a max-heap (greedy)   O(T * 26 log 26) time, O(26) space

```
Each round of n+1 slots: pick up to n+1 tasks with the highest remaining counts, run them,
put the leftovers back. Implemented below with a sorted array as a tiny "heap".
```

### APPROACH 2 — Optimal (greedy math formula)   O(T) time, O(26) space

```
Let maxFreq = the highest count, and k = how many letters have that count.
The most frequent task forces a skeleton of (maxFreq - 1) gaps, each at least n + 1 wide:
  A _ _ A _ _ A           -> (maxFreq - 1) * (n + 1) slots, plus the final A's
The last row holds the k tasks tied for max frequency. So the skeleton length is
  (maxFreq - 1) * (n + 1) + k
Every other task fits into the gaps without stretching them (shown below). If there are
MORE tasks than the skeleton has room for, no idle time is needed at all, and the answer
is simply tasks.length. So: answer = max(skeleton, tasks.length).
```

### WHY GREEDY WORKS

```
Lower bound: any schedule must be at least `skeleton` long (the most frequent task alone
forces it) and at least tasks.length long (every task takes a slot). Achievability: fill
the gaps round-robin, most frequent first; a less frequent task never needs two slots in
the same gap unless the gaps are already full, in which case we just append columns and
the total becomes tasks.length. So the lower bound is always reachable.

Dry run on AAABBB, n=2:
  maxFreq=3, k=2 -> skeleton = (3-1)*(2+1)+2 = 8;  tasks.length=6 -> max(8,6)=8
```

### Edge cases

```
- n = 0 -> tasks.length
- a single task type -> (count-1)*(n+1)+1
- many distinct tasks -> tasks.length wins over skeleton
```

Full JavaScript solution with tests: [15_task_scheduler.js](../solutions/15_task_scheduler.js). Run it with `node 15_task_scheduler.js` from the solutions folder.

</details>

## Common mistakes

- Forgetting the final `Math.max(formula, tasks.length)` - with many task types there is no idle time at all.
- Counting only ONE task with the max frequency; every task tied for max adds one slot to the last row.
- Simulating slot by slot with a sorted array each time - works but is slower than the formula or a heap.

## Related follow-ups

- Reorganize String (LeetCode #767)
- Rearrange String k Distance Apart (LeetCode #358)
- [Heaps and Priority Queues](../../../19_Heaps_And_Priority_Queues/README.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
