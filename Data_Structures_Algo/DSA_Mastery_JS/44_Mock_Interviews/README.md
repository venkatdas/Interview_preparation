# 44 — Mock Interviews

Ten timed mock interviews, from a 60-minute phone screen (Set 01) to an 80-minute onsite simulation (Set 10).
Each set has two problems, clarifying questions you should ask, hidden hints, the expected complexity, and the
follow-ups a real interviewer tends to ask. The point is not to *know* the answers. The point is to practise
**solving out loud, under time, while someone (or a recording) watches**.

## Prerequisites

- Finish the topic you are being tested on (each set lists what it covers).
- Sets 07–10 assume you have done the [mixed problem sets](../43_Mixed_Problem_Sets/README.md), where the topic is hidden.
- Read [HOW_TO_SOLVE_A_PROBLEM.md](../HOW_TO_SOLVE_A_PROBLEM.md) once more.

## The sets

| Set | Focus | Length | Problems |
|-----|-------|--------|----------|
| [MOCK_SET_01](MOCK_SET_01.md) | Hashing & strings | 60 min | Two Sum, Group Anagrams |
| [MOCK_SET_02](MOCK_SET_02.md) | Sliding window & backtracking | 60 min | Minimum Size Subarray Sum, Combination Sum |
| [MOCK_SET_03](MOCK_SET_03.md) | Linked lists & stacks | 60 min | Reverse Linked List, Daily Temperatures |
| [MOCK_SET_04](MOCK_SET_04.md) | Trees & graphs | 60 min | Validate BST, Course Schedule |
| [MOCK_SET_05](MOCK_SET_05.md) | Intervals & DP | 60 min | Merge Intervals, Coin Change |
| [MOCK_SET_06](MOCK_SET_06.md) | Design + BFS | 60 min | LRU Cache, Word Ladder |
| [MOCK_SET_07](MOCK_SET_07.md) | Advanced graphs | 75 min | Alien Dictionary, Network Delay Time |
| [MOCK_SET_08](MOCK_SET_08.md) | Dynamic programming | 75 min | Longest Increasing Subsequence, Edit Distance |
| [MOCK_SET_09](MOCK_SET_09.md) | Design-style data structures | 75 min | LFU Cache, Sliding-Window Rate Limiter |
| [MOCK_SET_10](MOCK_SET_10.md) | Final onsite simulation | 80 min | Time Based Key-Value Store, Cheapest Flights Within K Stops |

Also in this folder: [RUBRIC.md](RUBRIC.md) (how to score) and [SELF_REVIEW_TEMPLATE.md](SELF_REVIEW_TEMPLATE.md)
(copy it after every mock).

## How to run a mock alone

1. **Set up.** Plain editor (no autocomplete, no AI), a timer you can see, and a way to record your voice or
   screen. Close every other tab. Open only the set file and scroll so the hints are not visible.
2. **Talk the whole time**, as if an interviewer were listening. Recording yourself is the closest substitute:
   you will hear the long silences and the "umm, wait" moments you do not notice live.
3. **Follow the timing script below.** When a problem's time is half gone and you are stuck, open one hint and
   note it (it costs one point in problem solving).
4. **Run your code only at the end** of each problem, after your own dry run. Interviews rarely let you run code.
5. **Score yourself** with the [rubric](RUBRIC.md) right after, then watch/listen to the recording and score
   again. The second score is the honest one.
6. **Fill in** a copy of the [self-review template](SELF_REVIEW_TEMPLATE.md).

## How to run a mock with a friend

- **Roles.** One interviewer, one candidate. Swap roles on another day: interviewing someone teaches you what
  interviewers notice.
- **Interviewer before the session:** read the whole set, including hints and follow-ups. Prepare 2 extra
  small test cases.
- **During the session:** read the problem aloud (do not share the file). Answer clarifying questions using the
  answers in parentheses. Stay quiet while the candidate thinks; give a hint only if they are stuck for ~5
  minutes, starting with the vaguest hint. Ask at least one follow-up per problem.
- **Take notes** in four columns: what they said, what they coded, when they got stuck, what hint was given.
- **After:** score every rubric category with one concrete example for each score. Feedback order: one strength,
  the two most important improvements, one thing to drill before the next mock.

## Timing script (60-minute set: 20 + 35 + 5)

For the 75/80-minute sets, stretch each phase proportionally (the review is 10 minutes).

| Minute | Phase | What you should be doing / saying |
|--------|-------|-----------------------------------|
| 0–2   | Problem 1: understand | Restate the problem in your own words. Ask 2–3 clarifying questions (input size, edge cases, output format). |
| 2–4   | Problem 1: examples | Walk one given example by hand. Invent one edge-case example (empty, one element, duplicates). |
| 4–7   | Problem 1: brute force | Describe the brute force and its complexity. Do not code it unless asked. |
| 7–10  | Problem 1: optimize | Name the pattern. Say the optimized idea and its complexity. Get a nod (or decide yourself). |
| 10–16 | Problem 1: code | Code with clear names. Narrate: "this loop keeps the invariant that...". |
| 16–19 | Problem 1: test | Dry-run your code on the example line by line. Then the edge case. Fix bugs out loud. |
| 19–20 | Problem 1: wrap up | Final time and space complexity. One possible improvement. |
| 20–23 | Problem 2: understand | Restate, clarify, write the input/output signature. |
| 23–27 | Problem 2: examples + brute force | Hand-run an example, then state the brute force and its cost. |
| 27–33 | Problem 2: optimize | Find the bottleneck, name the pattern, state the plan and complexity. |
| 33–46 | Problem 2: code | Code in small pieces (helpers first if they make the main function obvious). |
| 46–52 | Problem 2: test | Dry-run, edge cases, fix. |
| 52–55 | Problem 2: follow-ups | Answer one follow-up from the set (out loud if alone). |
| 55–60 | Review | Rubric scores, self-review template, 3 lines: what went well, what went wrong, what to drill. |

Rules of thumb: if you are at minute 10 of a problem with no plan, code the brute force — a working slow solution
beats an unfinished fast one. If your code is not finished 3 minutes before the end, stop and explain what the
rest would do.

## Scoring rubric (summary)

Five categories, each scored 1–4. Full descriptors and examples are in [RUBRIC.md](RUBRIC.md).

| Score | Communication | Problem solving | Code quality | Testing | Complexity |
|-------|---------------|-----------------|--------------|---------|------------|
| **4 — Strong hire** | Thinks aloud throughout; clarifies before coding; explains trade-offs unprompted | Reaches the optimal approach independently; names the pattern; handles follow-ups | Clean, idiomatic, well-named, correct first time or self-corrected | Dry-runs on own examples and edge cases before being asked; finds own bugs | States exact time/space for every approach with justification; knows lower bounds |
| **3 — Hire** | Clear most of the time; brief silences; asks key questions | Optimal or near-optimal with at most one small hint | Readable and mostly correct; minor slips fixed quickly | Tests the main example and at least one edge case | Correct complexity for the final solution |
| **2 — Lean no hire** | Long silences or jumps to code; interviewer has to pull information out | Needs several hints; reaches a working but sub-optimal solution | Works for the main case; messy names or structure; bugs found by interviewer | Tests only when asked; misses obvious edge cases | Complexity stated with errors or only when asked |
| **1 — No hire** | Hard to follow; does not clarify; does not respond to hints | No working approach, or brute force only after many hints | Does not run or is far from complete | No testing | Cannot state complexity |

**Interpreting a set:** average ≥ 3.0 with no category below 2 = on track. Any category at 1 = drill it
specifically before the next mock (see "What to drill" in [RUBRIC.md](RUBRIC.md)).

## Suggested schedule

- Sets 01–06: one per topic block of the [ROADMAP](../ROADMAP.md) (the "When" line in each set tells you).
- Sets 07–10: one per week in the month before interviews, each followed by a re-do of the weakest earlier set.
- Re-run any set after 4 weeks: you should score at least one point higher in your weakest category.
