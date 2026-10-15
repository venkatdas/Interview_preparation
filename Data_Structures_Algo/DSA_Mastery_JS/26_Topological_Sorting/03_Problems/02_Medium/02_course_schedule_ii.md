# Course Schedule II

| | |
|---|---|
| **Topic** | Topological Sorting |
| **Difficulty** | Medium |
| **Pattern** | Kahn order |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #210 — https://leetcode.com/problems/course-schedule-ii/ |
| **Solution file** | [02_course_schedule_ii.js](../solutions/02_course_schedule_ii.js) — open only after a real attempt |

## Problem

Same setup as Course Schedule: [a, b] means b before a. Return ANY valid order in
which all courses can be taken, or [] if impossible.

## Examples

```
Input: 2, [[1,0]]                       Output: [0,1]
Input: 4, [[1,0],[2,0],[3,1],[3,2]]     Output: [0,1,2,3] or [0,2,1,3]
Input: 1, []                            Output: [0]
Input: 2, [[1,0],[0,1]]                 Output: []
```

## Constraints & clarifying questions

```
- Any valid order accepted? (yes)
- Return [] on a cycle, not null? (yes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *Kahn order* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Alternative (DFS post-order)   O(V + E) time, O(V) space. DFS with three colours; push a node when it FINISHES; reverse at the end.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Kahn's algorithm)   O(V + E) time, O(V + E) space. Exactly Course Schedule I, but keep the popped nodes in an `order` array and return it (or [] if order.length &lt; numCourses).

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- no prerequisites -> [0, 1, ..., n-1]
- self loop -> []
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Alternative (DFS post-order)   O(V + E) time, O(V) space

```
DFS with three colours; push a node when it FINISHES; reverse at the end. Return [] if
a gray node is revisited. Same complexity as Kahn, just the recursive flavour; shown as
`dfsVersion` because a slower "brute force" adds nothing here.
```

### APPROACH 2 — Optimal (Kahn's algorithm)   O(V + E) time, O(V + E) space

```
Exactly Course Schedule I, but keep the popped nodes in an `order` array and return it
(or [] if order.length < numCourses).

Dry run 4, [[1,0],[2,0],[3,1],[3,2]]:
  indeg [0,1,1,2], queue [0]
  pop 0 -> order [0], push 1, 2
  pop 1 -> order [0,1]; pop 2 -> order [0,1,2], indeg[3] = 0 push 3
  pop 3 -> order [0,1,2,3]  length 4 -> return
```

### Edge cases

```
- no prerequisites -> [0, 1, ..., n-1]
- self loop -> []
```

Full JavaScript solution with tests: [02_course_schedule_ii.js](../solutions/02_course_schedule_ii.js). Run it with `node 02_course_schedule_ii.js` from the solutions folder.

</details>

## Common mistakes

- Returning a partial order when there is a cycle; the answer must be an empty array if not every course was output.
- Returning the DFS finish order without reversing it.
- Reversing the edge direction, which produces a valid-looking but backwards order.

## Related follow-ups

- [Course Schedule](01_course_schedule.md)
- [Parallel Courses](05_parallel_courses.md)
- [Alien Dictionary](../03_Hard/08_alien_dictionary.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
