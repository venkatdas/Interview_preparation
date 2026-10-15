# DSA Mastery in JavaScript

A folder-by-folder Data Structures & Algorithms course in JavaScript, from absolute scratch to advanced interview level.
Every topic has a theory guide, runnable implementations, problems with staged hints, separate solutions, a quiz, interview questions, and tests.

| What | Where |
|---|---|
| Study order, stages, mastery criteria | [ROADMAP.md](ROADMAP.md) |
| How to solve any problem (15-step workflow + worked example) | [HOW_TO_SOLVE_A_PROBLEM.md](HOW_TO_SOLVE_A_PROBLEM.md) |
| Every topic and every problem, linked | [INDEX.md](INDEX.md) |
| Topic checkboxes | [PROGRESS.md](PROGRESS.md) |
| Per-problem log (attempts, hints, review dates, notes) | [PROBLEM_TRACKER.md](PROBLEM_TRACKER.md) |

> Not finished yet: a few folders were stopped mid-write. See [Unfinished parts](#unfinished-parts) at the bottom.

---

## Setup

1. Install Node.js 22 or newer from https://nodejs.org (check with `node --version`).
2. No `npm install` is needed. There are no dependencies.
3. Run commands from this folder (`DSA_Mastery_JS`).

## Running code and tests

```bash
node 03_Arrays/02_Implementations/dynamic_array.js     # run one file; it prints a ✓ line when its checks pass
npm run run two_sum                                     # run a file by partial name
npm run test:topic 03_Arrays                            # one topic: all its files + its node:test suite
npm run test:topic 16                                   # same, by number
npm test                                                # every node:test suite in the repo
npm run test:all-files                                  # run every implementation and solution file
npm run check:links                                     # verify Markdown links
npm run index                                           # rebuild INDEX.md, PROGRESS.md, PROBLEM_TRACKER.md (keeps your ticks and notes)
```

---

## How every topic folder is organized

```
NN_Topic_Name/
├── README.md                     start here: prerequisites, study steps, problem table
├── 01_Concepts/CONCEPTS.md       the lesson: intuition, visuals, pseudocode, dry run, complexity, patterns, mistakes, interview tips
├── 02_Implementations/*.js       the data structure / algorithm written from scratch, with self-tests
├── 03_Problems/
│   ├── 01_Easy/  02_Medium/  03_Hard/     problem statements with hints (no solution code)
│   └── solutions/*.js                     full solutions: brute force + optimal + tests
├── 04_Interview_And_Assessment/  INTERVIEW_QUESTIONS.md, QUIZ.md (answers hidden)
└── tests/*.test.js               node:test suite
```

Big topics (Trees, Graph Algorithms, Dynamic Programming, Range Queries, Advanced Algorithms) contain sub-topic folders with the same layout.

---

## How to solve a problem

Use this every time, in practice and in interviews. The full version with a checklist and a worked Two Sum example is in [HOW_TO_SOLVE_A_PROBLEM.md](HOW_TO_SOLVE_A_PROBLEM.md).

1. **Restate** the problem in your own words.
2. **Inputs, outputs, constraints.** Note the size of n, value ranges, sorted or not, duplicates, empty input.
3. **Clarify** anything ambiguous: ties, no-answer cases, invalid input.
4. **Work examples by hand**, including a tiny one you invent.
5. **Write the brute force.** Starting with the simplest solution is always fine.
6. **State its time and space complexity.**
7. **Find the bottleneck.** What work is repeated? What do you search for again and again?
8. **Match a pattern or data structure** that removes the bottleneck. The signal table in the guide and [42_Interview_Problem_Patterns](42_Interview_Problem_Patterns/README.md) help here.
9. **Describe the optimized approach** in words before coding.
10. **Prove it is correct.** State the invariant and why nothing is skipped.
11. **Dry run** the optimized approach on an example.
12. **List edge cases** and make sure the plan handles them.
13. **Implement cleanly** with descriptive names.
14. **Re-check complexity** on the real code.
15. **Explain it** in 60 seconds: approach, why it works, complexity, trade-offs.

Use the constraints to pick a target complexity:

| n up to | Target complexity |
|---|---|
| 20 | O(2^n) is fine (backtracking, bitmask) |
| 500 | O(n³) |
| 5,000 | O(n²) |
| 10^5 – 10^6 | O(n log n) or O(n) |
| 10^9 and above | O(log n) or O(1) (math, binary search) |

### Working a problem page without spoiling it

1. Open the statement page in `03_Problems/<level>/`. Do not open `solutions/` yet.
2. Spend up to 30 minutes on your own. Write a brute force in a scratch file and run it with `node`.
3. Still stuck? Open **one** hint, then try again. Each hint reveals a little more.
4. After solving, compare with the solution file and run it with `node`.
5. Log the attempt in [PROBLEM_TRACKER.md](PROBLEM_TRACKER.md), including how many hints you used.

---

## Following the roadmap

[ROADMAP.md](ROADMAP.md) has 12 stages with time budgets and a checkpoint for each, plus 4-week and 1-week compressed plans. Inside a stage, study topics in folder-number order. Finish each topic in this order: concepts, then implementations (re-type them from memory), then Easy, Medium and Hard problems, then the quiz.

A topic counts as **mastered** when you can do all five of these:
- Explain it to a beginner.
- Implement it from memory.
- Solve an unseen variation.
- List the edge cases before coding.
- Justify the complexity.

Only then tick it in [PROGRESS.md](PROGRESS.md).

## Revising

- Re-solve every problem where you needed hints after 3 days, 1 week, and 1 month. Record the dates in the tracker's Review columns.
- Once a week, redo one quiz from an older topic and one problem from [43_Mixed_Problem_Sets](43_Mixed_Problem_Sets/README.md), which hides the topic.
- From Stage 11 on, run one timed mock from [44_Mock_Interviews](44_Mock_Interviews/README.md) every week.
- [45_Revision_And_Spaced_Repetition](45_Revision_And_Spaced_Repetition/01_Concepts/HOW_TO_PRACTICE.md) has the practice method, the 12-week plan and a core problem list.

## Topics

| Stage | Folders |
|---|---|
| 1. Foundations | [00_Foundations](00_Foundations) |
| 2. Complexity & problem solving | [01_Complexity_Analysis](01_Complexity_Analysis), [02_Problem_Solving_Fundamentals](02_Problem_Solving_Fundamentals) |
| 3. Arrays, strings, hashing, basic patterns | [03_Arrays](03_Arrays/README.md), [04_Strings](04_Strings/README.md), [05_Hashing](05_Hashing/README.md), [06_Two_Pointers](06_Two_Pointers/README.md), [07_Sliding_Window](07_Sliding_Window/README.md), [08_Prefix_Sums_And_Difference_Arrays](08_Prefix_Sums_And_Difference_Arrays/README.md), [09_Matrix_And_Multidimensional_Arrays](09_Matrix_And_Multidimensional_Arrays/README.md) |
| 4. Searching, sorting, recursion | [10_Searching](10_Searching/README.md), [11_Sorting](11_Sorting/README.md), [12_Recursion](12_Recursion/README.md), [13_Backtracking](13_Backtracking/README.md), [14_Bit_Manipulation](14_Bit_Manipulation/README.md) |
| 5. Linear structures & heaps | [15_Linked_Lists](15_Linked_Lists/README.md), [16_Stacks](16_Stacks/README.md), [17_Queues_And_Deques](17_Queues_And_Deques/README.md), [18_Monotonic_Stacks_And_Queues](18_Monotonic_Stacks_And_Queues/README.md), [19_Heaps_And_Priority_Queues](19_Heaps_And_Priority_Queues/README.md) |
| 6. Trees | [20_Trees](20_Trees), [21_Binary_Search_Trees](21_Binary_Search_Trees/README.md), [22_Tries](22_Tries/README.md) |
| 7. Graphs | [23_Graphs](23_Graphs/README.md), [24_Graph_Traversal](24_Graph_Traversal/README.md), [25_Graph_Algorithms](25_Graph_Algorithms/README.md), [26_Topological_Sorting](26_Topological_Sorting/README.md), [27_Union_Find_Disjoint_Set](27_Union_Find_Disjoint_Set/README.md) |
| 8. Greedy & intervals | [28_Greedy_Algorithms](28_Greedy_Algorithms/README.md), [31_Intervals](31_Intervals/README.md) |
| 9. Dynamic programming | [29_Dynamic_Programming](29_Dynamic_Programming/README.md) |
| 10. Advanced | [30_Divide_And_Conquer](30_Divide_And_Conquer/README.md), [32_Meet_In_The_Middle](32_Meet_In_The_Middle/README.md), [33_String_Algorithms_Advanced](33_String_Algorithms_Advanced/README.md), [34_Range_Query_Data_Structures](34_Range_Query_Data_Structures/README.md), [35_Advanced_Data_Structures](35_Advanced_Data_Structures/README.md), [36_Number_Theory](36_Number_Theory/README.md), [37_Combinatorics](37_Combinatorics/README.md), [38_Probability_And_Randomization](38_Probability_And_Randomization/README.md), [39_Geometric_Algorithms](39_Geometric_Algorithms/README.md), [40_Online_Algorithms](40_Online_Algorithms/README.md), [41_Advanced_Algorithm_Design](41_Advanced_Algorithm_Design) |
| 11. Patterns & mixed practice | [42_Interview_Problem_Patterns](42_Interview_Problem_Patterns/README.md), [43_Mixed_Problem_Sets](43_Mixed_Problem_Sets/README.md) |
| 12. Mocks & revision | [44_Mock_Interviews](44_Mock_Interviews/README.md), [45_Revision_And_Spaced_Repetition](45_Revision_And_Spaced_Repetition) |

## Adding your own problems

1. Copy an existing statement page and solution file in the topic's `03_Problems` folder. Use the next number and a snake_case name.
2. The solution file needs `bruteForce`, `optimal`, asserts, a `✓` line and `module.exports`. It must pass `node <file>`.
3. Run `npm run index` to add it to INDEX.md, PROGRESS.md and PROBLEM_TRACKER.md.
4. Platform problems are paraphrased and link to the official page. Problem statements are never copied.

---

## Unfinished parts

Generation was stopped before these were done. Everything else passes its checks:

| Check | Result |
|---|---|
| Runnable files | 787 of 787 pass |
| node:test tests | 2,054 of 2,054 pass |

| Folder | Status | Missing |
|---|---|---|
| `02_Problem_Solving_Fundamentals/02_Brute_Force` | Partial | `README.md`, problem statement pages, interview questions, quiz, and tests. It has the concepts page and 3 solution files. |
| `02_Problem_Solving_Fundamentals/03_Optimization` | Not started | Whole topic: bottlenecks, precomputation, trading space for time. |
| `02_Problem_Solving_Fundamentals/04_Invariants` | Not started | Whole topic: loop invariants for binary search, two pointers, windows and heaps. |
| `02_Problem_Solving_Fundamentals/05_Proof_Of_Correctness` | Not started | Whole topic: induction, exchange arguments, counterexamples. [HOW_TO_SOLVE_A_PROBLEM.md](HOW_TO_SOLVE_A_PROBLEM.md) step 10 covers the basics for now. |
| `45_Revision_And_Spaced_Repetition` | Partial | `README.md`, spaced-repetition schedule page, flashcards, complexity cheat sheet, JavaScript pitfalls cheat sheet, mastery assessments, and quiz. It has the practice guide, 12-week plan, core problem list and review scheduler. |
| Parent index READMEs | Missing | `00_Foundations`, `01_Complexity_Analysis`, `02_Problem_Solving_Fundamentals`, `20_Trees`, `41_Advanced_Algorithm_Design`. Their sub-topic folders have READMEs; use [INDEX.md](INDEX.md) to navigate. |
| Broken links | 20 | All inside the partial folders above and one link in PROBLEM_TRACKER.md to the missing schedule page. Run `npm run check:links` to list them. |
| Problem page titles | Cosmetic | Some titles lost text in parentheses during reorganizing. For example, "Sqrt(x)" shows as "Sqrt" and "Pow(x, n)" shows as "Pow". |
| ✓ output lines | Cosmetic | A few files print old kebab-case names, for example `✓ two-pointer-templates.js`. |
