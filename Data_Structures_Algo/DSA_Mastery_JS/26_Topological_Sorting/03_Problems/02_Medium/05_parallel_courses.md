# Parallel Courses

| | |
|---|---|
| **Topic** | Topological Sorting |
| **Difficulty** | Medium |
| **Pattern** | Kahn levels |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #1136 — https://leetcode.com/problems/parallel-courses/ |
| **Solution file** | [05_parallel_courses.js](../solutions/05_parallel_courses.js) — open only after a real attempt |

## Problem

n courses labelled 1..n. relations[i] = [prev, next] means prev must be taken before
next. In one semester you can take ANY number of courses as long as their prerequisites
were taken in earlier semesters. Return the minimum number of semesters to finish all
courses, or -1 if impossible (cycle).

## Examples

```
Input: n = 3, relations = [[1,3],[2,3]]         Output: 2   (sem 1: 1 and 2; sem 2: 3)
Input: n = 3, relations = [[1,2],[2,3],[3,1]]   Output: -1  (cycle)
```

## Constraints & clarifying questions

```
- 1-indexed labels? (yes - convert to 0-indexed or allocate n + 1)
- Unlimited courses per semester? (yes)

The answer is the number of LEVELS in Kahn's algorithm = length of the longest path
in the DAG (in nodes).
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *Kahn levels* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Alternative (DFS + memo: longest path ending at each node)   O(V + E). depth(node) = 1 + max(depth(prereq)) over prerequisites; memoise.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Kahn's algorithm, level by level)   O(V + E) time, O(V + E). 1.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- no relations -> 1 semester
- a chain of n courses -> n semesters
- cycle -> -1
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Alternative (DFS + memo: longest path ending at each node)   O(V + E)

```
depth(node) = 1 + max(depth(prereq)) over prerequisites; memoise. Detect cycles with
a gray marker. Answer = max depth. Shown as `dfsVersion`.
```

### APPROACH 2 — Optimal (Kahn's algorithm, level by level)   O(V + E) time, O(V + E)

```
1. in-degree + adjacency.
  2. queue = all in-degree-0 courses (semester 1).
  3. Each outer iteration processes the whole current queue = one semester.
  4. Count semesters; if processed < n -> -1.

Dry run n=3, [[1,3],[2,3]]:
  indeg [_,0,0,1]  level 1: [1,2] -> indeg[3]=0 -> level 2: [3]  -> 2 semesters
```

### Edge cases

```
- no relations -> 1 semester
- a chain of n courses -> n semesters
- cycle -> -1
```

Full JavaScript solution with tests: [05_parallel_courses.js](../solutions/05_parallel_courses.js). Run it with `node 05_parallel_courses.js` from the solutions folder.

</details>

## Common mistakes

- Counting nodes processed instead of BFS levels; the answer is the number of levels (semesters).
- Forgetting the cycle check: if not every course is taken, return -1.
- Using 0-based indexing on 1-based course labels without adjusting array sizes.

## Related follow-ups

- [Course Schedule II](02_course_schedule_ii.md)
- Parallel Courses III (LeetCode #2050)
- Parallel Courses II (LeetCode #1494)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
