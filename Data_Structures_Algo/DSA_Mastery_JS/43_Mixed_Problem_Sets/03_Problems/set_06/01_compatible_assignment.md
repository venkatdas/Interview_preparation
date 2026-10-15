# Compatible Assignment

| | |
|---|---|
| **Set** | [Mixed Set 06](README.md) — problem 01 of 5 |
| **Difficulty** | Hard |
| **Time box** | 30 minutes (then open Hint 1) |
| **Source** | Original exercise |
| **Solution file** | [01_compatible_assignment.js](solutions/01_compatible_assignment.js) — open only after a real attempt |

> The topic is hidden on purpose. Part of the skill being trained is recognizing the pattern on your own.

## Problem

n workers and n jobs. cost[w][j] is what worker w charges for job j, or null if worker w
cannot do job j. Every worker must get exactly one job and every job exactly one worker.
Return the minimum total cost, or -1 if no complete assignment exists. n <= 15.

## Examples

```
Input: [[4, 1, 3],
        [2, 0, 5],
        [3, 2, 2]]            Output: 5   Explanation: w0->j1 (1), w1->j0 (2), w2->j2 (2)
Input: [[1, null], [2, null]] Output: -1  Explanation: nobody can do job 1
Input: []                     Output: 0
```

## Constraints & clarifying questions

```
- n <= 15 (2^15 * 15 is about 500k states: fine). Costs non-negative.
- Is the matrix square? (yes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1 — which patterns?</summary>

**Pattern.** DP over bitmasks (subsets of jobs) + bit tricks. See [Advanced DP (bitmask)](../../../29_Dynamic_Programming/06_Advanced_DP/README.md) and [Bit Manipulation](../../../14_Bit_Manipulation/README.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** Backtracking: worker 0 picks any job, worker 1 any remaining job, ... O(n!).

</details>

<details><summary>Hint 3</summary>

**The key idea.** The set of used jobs fully describes the state, and its size tells you which worker is next. dp[mask] = cheapest way to fill those jobs.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- n = 0 -> 0
- a job nobody can do -> -1
- a worker who can do nothing -> -1
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n! * n) time, O(n) space

```
Try every permutation (backtracking): worker i takes any unused allowed job.
```

### APPROACH 2 — Optimal (DP over bitmasks of used jobs)   O(2^n * n) time, O(2^n) space

```
Workers are assigned in order 0, 1, 2, ... so the number of set bits in the mask tells
which worker is next: w = popcount(mask). dp[mask] = min cost to give jobs in mask to
workers 0..w-1. Transition: for each job j not in mask that worker w may do,
dp[mask | 1<<j] = min(dp[mask] + cost[w][j]). Answer dp[(1<<n) - 1].
Many different orders reach the same mask — the DP solves each mask once instead of
once per permutation (that is the n! -> 2^n saving).

Dry run on the 3x3 example (masks written as job bits j2 j1 j0):
  dp[000]=0
  worker 0: dp[001]=4, dp[010]=1, dp[100]=3
  worker 1: dp[011]=min(4+0, 1+2)=3, dp[101]=min(4+5, 3+2)=5, dp[110]=min(1+5, 3+0)=3
  worker 2: dp[111]=min(dp[011]+2, dp[101]+2, dp[110]+3) = min(5, 7, 6) = 5
  answer 5
```

### Edge cases

```
- n = 0 -> 0
- a job nobody can do -> -1
- a worker who can do nothing -> -1
```

### Common mistakes

```
- Keeping both "which worker" and "mask" as state (the worker is implied by popcount).
- Greedy (each worker takes their cheapest free job): fails, e.g. on the example.
```

Full JavaScript solution with tests: [01_compatible_assignment.js](solutions/01_compatible_assignment.js). Run it with `node solutions/01_compatible_assignment.js` from this folder.

</details>

## Related follow-ups

- n = 100 (Hungarian algorithm / min-cost flow)
- More jobs than workers
- Each worker may take up to 2 jobs

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Write down which pattern you did NOT see at first. That is the one to drill.
- Fill in the set's reflection checklist in [QUIZ.md](../../04_Interview_And_Assessment/QUIZ.md).
- Re-solve from scratch in 3 days, then in 1 week.
