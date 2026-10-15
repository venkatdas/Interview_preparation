# Problem Sets & Study Plan

This folder is the **"how do I actually practice?"** part of the curriculum.
Every other folder ([03_Arrays](../../03_Arrays/README.md) ... [42_Interview_Problem_Patterns](../../42_Interview_Problem_Patterns/README.md)) teaches a topic.
This folder tells you **what order to learn it in, what to solve, and how to know you are ready**.

Think of it as the gym schedule. The other folders are the equipment.

---

## What is in this folder

| File / folder | What it is for |
|---------------|----------------|
| [STUDY_PLAN_12_WEEKS.md](STUDY_PLAN_12_WEEKS.md) | Week-by-week plan from scratch to advanced. Also a 4-week plan and a 1-week crash plan. |
| [CORE_75_PROBLEMS.md](CORE_75_PROBLEMS.md) | 75 classic interview problems, grouped by topic, each linked to its page in this curriculum, with checkboxes. |
| [SPACED_REPETITION_SCHEDULE.md](SPACED_REPETITION_SCHEDULE.md) | When to re-solve (day 1, 3, 7, 14, 30, 60), how to grade recall 0–3, what to do on failure. |
| [FLASHCARDS.md](FLASHCARDS.md), [COMPLEXITY_CHEATSHEET.md](COMPLEXITY_CHEATSHEET.md), [JAVASCRIPT_PITFALLS_CHEATSHEET.md](JAVASCRIPT_PITFALLS_CHEATSHEET.md) | Quick-recall material for daily and weekly reviews. |
| [MASTERY_ASSESSMENTS.md](MASTERY_ASSESSMENTS.md) | Three cumulative written tests (after roadmap stages 4, 7 and 10). |
| [Pattern to problem map](../../42_Interview_Problem_Patterns/01_Concepts/PATTERN_TO_PROBLEM_MAP.md) | ~25 patterns: how to recognize each one, which template to use, and 5–8 problems to practice it. Full lessons: [42_Interview_Problem_Patterns](../../42_Interview_Problem_Patterns/README.md). |
| `PROGRESS.md` and `PROBLEM_TRACKER.md` (curriculum root) | One checklist per topic, and one row per problem attempt. Tick boxes as you go. |
| [44_Mock_Interviews](../../44_Mock_Interviews) | Six 60-minute mock interviews (2 problems each) with hidden hints and follow-up questions. |
| [templates.js](../../42_Interview_Problem_Patterns/02_Implementations/templates.js) | Copy-paste snippets to memorize: heap, union-find, trie, binary search, BFS/DFS, Dijkstra, LRU... Runs with `node`. |
| [review_scheduler.js](../02_Implementations/review_scheduler.js) | Tells you which problems to re-solve today from a JSON log of your reviews. |
| `tests/run-all-files.js` (curriculum root) | Runs every `.js` file in the whole curriculum and reports pass/fail (`npm run test:all-files`). |

---

## How to practice (the method)

Reading solutions feels productive. It is not. The only thing that works is
**solving problems yourself, then re-solving them later**. Here is the loop.

### 1. Timebox every problem: 25–35 minutes

- Set a timer. 25 min for Easy/Medium, 35 min for Hard.
- Timer rings and you have nothing? Read the hints (not the solution). Give it 10 more minutes.
- Still nothing? Read the solution, close it, and **write it from memory**. Mark the problem as "needs re-solve".

### 2. Always write the brute force first

- Say it out loud: "Brute force is try every pair, O(n^2)."
- Write 3–5 lines of it if you can. It proves you understood the problem and often reveals the pattern.
- Then ask: "What work am I repeating?" That question leads to the optimal solution more often than any trick.

### 3. Follow the same 5 steps every time

```
1. Restate the problem in one sentence. Ask 2 clarifying questions (empty input? duplicates? size?).
2. Walk through one example by hand.
3. Brute force: state it + complexity.
4. Optimize: name the pattern ("this is sliding window because..."). State complexity.
5. Code it. Then dry-run on the example and on one edge case.
```

The [How To Solve A Problem](../../02_Problem_Solving_Fundamentals/01_How_To_Solve_A_Problem/README.md) topic covers this in depth.

### 4. Spaced repetition: re-solve after 3 days, 1 week, 1 month

Your brain forgets a solution in about 3 days. Re-solving at growing intervals makes it stick.

| When | What to do | Time |
|------|-----------|------|
| Day 0 | Solve it (or learn it from the solution). | 25–35 min |
| Day 3 | Re-solve from a blank file. No peeking. | 10–15 min |
| Day 7 | Re-solve again. If it takes > 15 min, reset the clock to Day 0. | 10 min |
| Day 30 | Final re-solve. If it flows, the problem is "done". | 5–10 min |

Keep a simple list (a note, `PROBLEM_TRACKER.md` at the curriculum root, or a JSON log for
[review_scheduler.js](../02_Implementations/review_scheduler.js)) with the problem name and the next re-solve date.
The full schedule, with grades 0–3, is in [SPACED_REPETITION_SCHEDULE.md](SPACED_REPETITION_SCHEDULE.md). Every study day starts with the re-solves that are due, **then** new problems.

### 5. Run your code

Every problem file in this curriculum ends with asserts. Do the same for your own solutions:

```js
const assert = require('assert');
assert.deepStrictEqual(twoSum([2, 7, 11, 15], 9), [0, 1]);
console.log('✓ passed');
```

Writing the tests forces you to think about edge cases, which is exactly what interviewers probe.

---

## How to track progress

1. Open `PROGRESS.md` (curriculum root). Tick the boxes for each topic as you finish them.
2. Open [CORE_75_PROBLEMS.md](CORE_75_PROBLEMS.md) (and later each topic's "Practice more" list). Tick the checkbox when you solve a problem
   **without looking at a solution**. Not before.
3. Keep a "re-solve queue" at the top of your tracker (see the spaced-repetition table above).
4. After each mock interview set, write 3 lines: what went well, what went wrong, what to study next.

A simple rule for "am I ready?":

- **Entry-level / mid-level:** the [core 75](CORE_75_PROBLEMS.md) done, at least 60 of them re-solved after a week.
- **Senior / big-tech:** the core 75 plus every Medium/Hard problem in the Essential topics, all 6 mock sets completed under time, comfortable explaining complexity.

---

## The "I'm stuck" protocol

Being stuck is normal. Being stuck for an hour is wasted time. Use this ladder, one rung at a time.

```
Stuck for 5 min?
  -> Re-read the problem. Draw the example on paper. Did you miss a constraint?

Stuck for 10 min?
  -> Ask the pattern questions:
     "Is the input sorted?"          -> two pointers / binary search
     "Contiguous subarray/substring?" -> sliding window / prefix sum
     "Need fast lookup?"              -> hash map / set
     "Nested / most recent?"          -> stack
     "Shortest path / levels?"        -> BFS
     "All combinations?"              -> backtracking
     "Optimal value, overlapping subproblems?" -> DP
     (full list: 42_Interview_Problem_Patterns/README.md, decision flowchart)

Stuck for 20 min?
  -> Write the brute force, even if it is slow. Then look for the repeated work.

Stuck for 25-35 min (timer rings)?
  -> Open the Hints on the problem page, one at a time. Read only the first approach in the walkthrough.

Still stuck after hints?
  -> Read the full solution. Close it. Rewrite it from memory. Add the problem to your re-solve queue
     with a "Day 0" date of today. This is NOT a failure; it is how you learn a new pattern.
```

Never spend more than 45 minutes on one problem in a single sitting. Move on and come back on Day 3.

---

## Running the code

```bash
# from the curriculum root
node 42_Interview_Problem_Patterns/02_Implementations/templates.js          # helper snippets self-test
node 45_Revision_And_Spaced_Repetition/02_Implementations/review_scheduler.js my-log.json   # what to review today
npm run test:all-files                                                        # run EVERY .js file, report pass/fail
```

`npm run test:all-files` exits with code `1` if any file fails, so you can use it as a sanity check
after editing any solution.

---

## Suggested daily rhythm (2 hours)

| Minutes | Activity |
|---------|----------|
| 0–20 | Re-solve problems that are due today (spaced repetition). |
| 20–50 | Read the README of the current topic, run its implementation file. |
| 50–110 | Solve 2 new problems from that topic's `03_Problems/` folder, timeboxed. |
| 110–120 | Update the tracker. Write one sentence: what pattern did I learn today? |

Weekends (4 hours): same rhythm, plus one timed mock problem and a review of the week's patterns.
