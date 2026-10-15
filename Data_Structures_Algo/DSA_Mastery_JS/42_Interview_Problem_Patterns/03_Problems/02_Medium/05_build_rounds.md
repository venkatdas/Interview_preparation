# Build Rounds

| | |
|---|---|
| **Topic** | Interview Problem Patterns — "which pattern is this?" drill |
| **Difficulty** | Medium |
| **Pattern** | identify it yourself first (answer inside the walkthrough) |
| **Prerequisites** | [Pattern index](../../README.md) |
| **Source** | Original exercise |
| **Solution file** | [05_build_rounds.js](../solutions/05_build_rounds.js) — open only after a real attempt |

## Problem

A monorepo has `n` packages numbered `0..n-1`. `deps[i] = [a, b]` means package `a` must be
built before package `b`. The CI system works in **rounds**: in one round it builds, in parallel,
every package whose prerequisites were all built in earlier rounds. Return the minimum number of
rounds to build everything, or `-1` if it is impossible (a circular dependency).

## Examples

```
Input: n = 4, deps = [[0,1],[0,2],[1,3],[2,3]]   Output: 3   (0 | 1,2 | 3)
Input: n = 3, deps = []                          Output: 1
Input: n = 2, deps = [[0,1],[1,0]]               Output: -1  (cycle)
Input: n = 0, deps = []                          Output: 0
```

## Constraints & clarifying questions

```
- 0 <= n <= 10^5, 0 <= deps.length <= 2 * 10^5
- Duplicate edges may appear; [a, a] is a cycle.
```

## Step 0: name the pattern before you code

Write these three lines down **before** opening any hint (give yourself 3 minutes):

1. **Pattern:** which of the 22 patterns in the [pattern index](../../README.md) is this? Which words in the statement told you?
2. **Target complexity:** given the constraints, what time and space should the optimal solution have?
3. **Brute force:** what is the simplest correct solution and its complexity?

Then check your guess:

<details><summary>Pattern and target complexity (check after writing yours)</summary>

**Pattern:** Topological sort (Kahn's algorithm, level by level). Lesson: [Topological Sort](../../01_Concepts/patterns/15_topological_sort.md).

**Target:** O(n + E) time and space.

</details>

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Recognition.** Clue words: "must be built before", "rounds in parallel", "impossible if circular".

</details>

<details><summary>Hint 2</summary>

**Start simple.** Brute force: simulate each round by scanning every unbuilt package and checking all its prerequisites. Up to O(n * (n + E)).

</details>

<details><summary>Hint 3</summary>

**The key idea.** Track in-degree (unbuilt prerequisites). Round 1 = all in-degree 0. Building a round decrements dependents; those that reach 0 form the next round. Count rounds.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.** If fewer than n packages were ever built, a cycle blocked the rest -> -1. Check n = 0 and self-loops.

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force

Repeat: collect packages whose prerequisites were all built in earlier rounds; if none and some remain -> -1. O(n * (n + E)).

### APPROACH 2 — Optimal (Topological sort (Kahn's algorithm, level by level))

```
inDegree[b]++ for each [a, b]; current = all with inDegree 0
while current not empty: rounds++; built += current.length
  next = dependents whose inDegree drops to 0
return built === n ? rounds : -1
```

### Dry run

```
n=4, [[0,1],[0,2],[1,3],[2,3]]
  inDeg [0,1,1,2]  round1 [0]
  build 0 -> inDeg[1]=0, inDeg[2]=0      round2 [1,2]
  build 1,2 -> inDeg[3]=0                round3 [3]
  built 4 -> 3 rounds
```

### Complexity

O(n + E) time and space.

### Common mistakes

- `new Array(n).fill([])` shares one adjacency array between all packages.
- Reversing the edge direction.
- Using plain topological order length instead of counting levels.

Full JavaScript solution with tests: [05_build_rounds.js](../solutions/05_build_rounds.js). Run it with `node 05_build_rounds.js` from the solutions folder.

</details>

## Related follow-ups

- [statement](../../../26_Topological_Sorting/03_Problems/02_Medium/05_parallel_courses.md) · [solution](../../../26_Topological_Sorting/03_Problems/solutions/05_parallel_courses.js)
- [statement](../../../26_Topological_Sorting/03_Problems/02_Medium/01_course_schedule.md) · [solution](../../../26_Topological_Sorting/03_Problems/solutions/01_course_schedule.js)
- Pattern lesson: [Topological Sort](../../01_Concepts/patterns/15_topological_sort.md)

## After solving

- Did you name the pattern correctly in Step 0? If not, write down the clue you missed in your notes.
- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Log the attempt in `PROBLEM_TRACKER.md` and re-solve it in 3 days, then in 1 week.
