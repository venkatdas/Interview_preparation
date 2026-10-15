# Mock Interview Rubric

Score each category from 1 to 4 for **each problem**, then average across the set. Always write one
concrete piece of evidence next to every score ("asked about duplicates at minute 1", "silent for 4 minutes
while coding the BFS"). A score without evidence is a guess.

Back to the [mock interviews README](README.md).

---

## 1. Communication

What it measures: can the interviewer follow your thinking, and do you collect the information you need?

| Score | Descriptor | Typical evidence |
|-------|------------|------------------|
| 4 | Restates the problem, asks the clarifying questions that matter, thinks aloud the whole time, explains trade-offs without being asked, checks in at decision points. | "Before I code: n is up to 10^5, so O(n^2) is out. Shall I go with the hash-map approach?" |
| 3 | Clear most of the time; asks the main clarifying questions; short silences while coding. | Explains the plan well, goes quiet for a minute while writing a loop, then summarizes. |
| 2 | Starts coding before clarifying; long silences; the interviewer has to ask "what are you thinking?". | Discovers halfway through that the input can be empty because the interviewer mentions it. |
| 1 | Hard to follow; no clarifying questions; does not respond to hints or questions. | Codes silently for 15 minutes; answers "it works" to "why?". |

## 2. Problem solving

What it measures: how you get from the problem to a correct, efficient approach.

| Score | Descriptor | Typical evidence |
|-------|------------|------------------|
| 4 | States brute force, finds the bottleneck, names the pattern, reaches the optimal approach independently, and handles a follow-up by modifying it. | "Brute force re-scans the window; a frequency map makes each step O(1)." Then adapts to the streaming follow-up. |
| 3 | Reaches optimal or near-optimal with at most one small hint; sensible brute force first. | Needs a nudge toward "sort first", then finishes alone. |
| 2 | Needs several hints; ends with a working but sub-optimal solution. | O(n^2) solution where O(n) was expected, after two hints. |
| 1 | No working approach, or only brute force after many hints. | Cannot get past the examples. |

Self-scoring alone: each hint you open lowers this score by one (minimum 1).

## 3. Code quality

What it measures: would you approve this code in a code review?

| Score | Descriptor | Typical evidence |
|-------|------------|------------------|
| 4 | Clean structure, meaningful names, small helpers where they help, idiomatic JavaScript (`Map`, `Set`, `const`/`let`), no dead code; correct on first run or self-corrected. | `function canFinish(numCourses, prerequisites)` with `indegree`, `queue`, `taken`. |
| 3 | Readable and mostly correct; a minor slip fixed quickly. | Off-by-one in a loop bound, spotted during the dry run. |
| 2 | Works for the main case but messy: one-letter names, duplicated logic, globals; bugs found by the interviewer. | `let a = [], b = {}, c = 0` and a missing return on one path. |
| 1 | Does not run or is far from complete. | Pseudo-code mixed with half-written JS at the end of the time. |

## 4. Testing

What it measures: do you find your own bugs before the interviewer does?

| Score | Descriptor | Typical evidence |
|-------|------------|------------------|
| 4 | Dry-runs the code line by line on an example, then on 2+ edge cases chosen deliberately; finds and fixes own bugs; mentions how they would unit-test it. | "Empty array, single element, all duplicates — let me trace the second one." |
| 3 | Tests the main example and at least one edge case. | Traces example 1, then checks the empty input. |
| 2 | Tests only when asked; misses obvious edge cases. | Interviewer: "what about an empty list?" — crash. |
| 1 | No testing. | Declares "done" right after typing the last line. |

## 5. Complexity analysis

What it measures: do you know what your code costs, and why?

| Score | Descriptor | Typical evidence |
|-------|------------|------------------|
| 4 | Gives time and space for every approach, with a reason; uses amortized arguments where needed; knows when a solution is optimal (lower bound). | "Each index is pushed and popped once, so the stack work is O(n) total even with the inner while loop." |
| 3 | Correct time and space for the final solution. | "O(n log n) for the sort, O(n) extra." |
| 2 | Partly wrong or only when asked; forgets space or recursion stack. | Calls a recursive DFS O(1) space. |
| 1 | Cannot state complexity. | "It's fast." |

---

## Turning scores into a decision

| Average across the 5 categories | Meaning |
|---------------------------------|---------|
| 3.5 – 4.0 | Strong hire level. Keep doing mocks to stay sharp; increase difficulty. |
| 3.0 – 3.4 | Hire level. Fix the weakest category. |
| 2.0 – 2.9 | Not yet. Re-do the matching topic folders and the mixed sets before the next mock. |
| below 2.0 | Go back to fundamentals for the covered topics. |

Any single category at 1 is a red flag even with a good average — real interviewers often reject on one weak area.

## What to drill for each weak category

- **Communication:** record yourself solving one easy problem a day, narrating everything. Practise the first
  two minutes (restate + 3 clarifying questions) on 10 problems in a row without solving them.
- **Problem solving:** do the [mixed sets](../43_Mixed_Problem_Sets/README.md) again with stricter time boxes;
  for every problem write "brute force → bottleneck → pattern" in one line before coding.
- **Code quality:** re-write two of your old solutions after reading the curriculum's solution files; focus on
  names and helper functions.
- **Testing:** for every problem, write three edge cases before any code. Trace your code on paper with a
  variable table (like the dry runs in the solution files).
- **Complexity:** revisit [01_Complexity_Analysis](../01_Complexity_Analysis/) and state the complexity of every
  solution you read for a week, before reading the author's.
