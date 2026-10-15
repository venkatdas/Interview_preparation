# Course Schedule

| | |
|---|---|
| **Topic** | Topological Sorting |
| **Difficulty** | Medium |
| **Pattern** | Kahn cycle check |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #207 — https://leetcode.com/problems/course-schedule/ |
| **Solution file** | [01_course_schedule.js](../solutions/01_course_schedule.js) — open only after a real attempt |

## Problem

There are numCourses courses 0..numCourses-1. prerequisites[i] = [a, b] means you must
take course b BEFORE course a. Can you finish all courses?

## Examples

```
Input: numCourses = 2, prerequisites = [[1,0]]         Output: true   (0 then 1)
Input: numCourses = 2, prerequisites = [[1,0],[0,1]]   Output: false  (cycle)
```

## Constraints & clarifying questions

```
- Direction of the pair? ([a, b] = b -> a, "b before a")
- Duplicate prerequisites? (possible, harmless)
- Courses with no prerequisites? (yes, they are free)

"Can all be finished" = "is the prerequisite graph a DAG" = "no cycle".
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *Kahn cycle check* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (DFS from every node looking for a cycle, no memo). O(V * (V + E)) time For each course run a DFS with a path set; if the path revisits a node -> cycle.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Kahn's algorithm)   O(V + E) time, O(V + E) space. 1.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- no prerequisites -> true
- self prerequisite [[0,0]] -> false
- numCourses = 1
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (DFS from every node looking for a cycle, no memo)

```
O(V * (V + E)) time
For each course run a DFS with a path set; if the path revisits a node -> cycle. Without
remembering finished (black) nodes we redo work for every start.
```

### APPROACH 2 — Optimal (Kahn's algorithm)   O(V + E) time, O(V + E) space

```
1. Build adjacency b -> a and in-degree of every course.
  2. Queue every course with in-degree 0.
  3. Pop, count it, decrement neighbours' in-degree, push those that hit 0.
  4. finished count === numCourses -> true.

Dry run numCourses=4, prereqs [[1,0],[2,0],[3,1],[3,2]]:
  adj 0:[1,2] 1:[3] 2:[3]    indeg [0,1,1,2]
  queue [0] -> pop 0, count 1, indeg [_,0,0,2] push 1,2
  pop 1, count 2, indeg[3]=1;  pop 2, count 3, indeg[3]=0 push 3
  pop 3, count 4 === 4 -> true
```

### Edge cases

```
- no prerequisites -> true
- self prerequisite [[0,0]] -> false
- numCourses = 1
```

Full JavaScript solution with tests: [01_course_schedule.js](../solutions/01_course_schedule.js). Run it with `node 01_course_schedule.js` from the solutions folder.

</details>

## Common mistakes

- Building edges in the wrong direction: `[a, b]` means b must come before a, so the edge is `b -> a`.
- Treating "visited" as "cycle" in DFS. In a directed graph only a GRAY (on-the-current-path) node means a cycle; a diamond is not a cycle.
- Forgetting courses with no prerequisites at all; they still need to be counted (they start with in-degree 0).

## Related follow-ups

- [Course Schedule II](02_course_schedule_ii.md)
- [Find Eventual Safe States](03_find_eventual_safe_states.md)
- Course Schedule IV (LeetCode #1462)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
