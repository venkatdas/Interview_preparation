# Maximum Bipartite Matching — Hiring Applicants

| | |
|---|---|
| **Topic** | Network Flow (Advanced) |
| **Difficulty** | Medium |
| **Pattern** | bipartite matching, augmenting paths (Kuhn) |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md), [Graph Traversal](../../../../24_Graph_Traversal/README.md) |
| **Source** | Original exercise |
| **Solution file** | [01_maximum_bipartite_matching.js](../solutions/01_maximum_bipartite_matching.js) — open only after a real attempt |

## Problem

There are `n` applicants and `m` jobs. `applicants[i]` lists the jobs applicant `i` is
qualified for. Each job goes to at most one applicant, and each applicant takes at most
one job. Return the maximum number of applicants that can be hired.

## Examples

```
Input: applicants = [[0,1],[0],[1,2]], m = 3   Output: 3   (0->1, 1->0, 2->2)
Input: applicants = [[0],[0],[0]],     m = 1   Output: 1   (one job only)
Input: applicants = [[],[1]],          m = 2   Output: 1
```

## Constraints & clarifying questions

```
- n, m up to ~1000; total qualifications up to ~10^5.
- Can a list be empty? (yes -> that applicant is never hired)
- Count only, or the assignment too? (count; the assignment falls out of matchJob[])
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** Two groups, edges only between groups, each node used at most once: this is
*maximum bipartite matching*. See "Bipartite matching" in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** Brute force: for each applicant, either skip them or give them each free
qualified job, recurse, keep the best. Exponential. Also try greedy ("first free job")
on example 1 and watch it fail when applicant 0 grabs job 0.

</details>

<details><summary>Hint 3</summary>

**The key idea.** When applicant `u` wants a job `v` that is taken by `w`, ask whether `w`
can move to some *other* job. That question is recursive (DFS). A successful chain is an
augmenting path; flipping it grows the matching by one. Mark jobs visited per search.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- n = 0 or m = 0 -> 0
- applicant with an empty list
- everybody qualified only for the same job -> 1
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(m^n) time, O(n + m) space

```
Recursively decide each applicant: skip, or take any free qualified job. Max of all.
```

### APPROACH 2 — Optimal (Kuhn's augmenting paths)   O(n * E) time, O(n + m) space

```
for each applicant u:
  run tryPlace(u) with a fresh "visited jobs" stamp
tryPlace(u): for each job v of u not visited in this search:
  mark v; if v is free OR tryPlace(owner of v) succeeds -> give v to u, return true
return false

Dry run on [[0,1],[0],[1,2]]:
  u=0: job 0 free -> 0 takes 0                               matchJob = [0,-,-]
  u=1: job 0 owned by 0 -> can 0 move? job 1 free -> yes      matchJob = [1,0,-]
  u=2: job 1 owned by 0 -> can 0 move? job 0 owned by 1 -> 1 has nothing else -> no
       job 2 free -> 2 takes 2                                matchJob = [1,0,2]  answer 3
```

Hopcroft–Karp improves this to O(E·√V) by finding many shortest augmenting paths per BFS
phase; see `02_Implementations/bipartite_matching.js`.

### Edge cases

```
- empty input -> 0
- applicant with no jobs is simply never matched
```

### Common mistakes

```
- Forgetting the visited mark -> infinite recursion when two applicants point at each other's jobs.
- Resetting visited only once for all applicants -> misses augmenting paths (answer too small).
- Greedy without augmenting -> wrong on example 1.
```

Full JavaScript solution with tests: [01_maximum_bipartite_matching.js](../solutions/01_maximum_bipartite_matching.js). Run it with `node 01_maximum_bipartite_matching.js` from the solutions folder.

</details>

## Related follow-ups

- Weighted version: maximize total salary -> min-cost flow / Hungarian algorithm.
- Each job has k openings -> see [04 Assign Tasks with Capacity](04_assign_tasks_with_capacity.md).
- Maximum Students Taking Exam -> [06](../03_Hard/06_maximum_students_taking_exam.md) (matching + König).

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
