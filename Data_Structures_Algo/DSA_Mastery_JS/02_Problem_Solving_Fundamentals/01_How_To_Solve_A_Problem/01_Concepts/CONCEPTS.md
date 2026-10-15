# How to Approach Problems

Solving a coding interview problem is not about knowing a magic trick. It is a **repeatable
process**. Think of it like a pilot's checklist: the pilot does not "wing it" on each flight,
they walk the same steps every time so nothing is forgotten under pressure. This folder gives
you that checklist. You will use it for every single problem in this curriculum.

---

## Prerequisites

- [JavaScript For DSA](../../../00_Foundations/01_JavaScript_For_DSA/README.md): you need to write code without fighting the language.
- [Time Complexity](../../../01_Complexity_Analysis/01_Time_Complexity/README.md) and [Space Complexity](../../../01_Complexity_Analysis/02_Space_Complexity/README.md): the "E" (evaluate) step needs them.

---

## Why it matters / when to use

Use this process **every time** you see a new problem. Signs you need it most:

- You read a problem and your mind goes blank
- You jump into code, then realise 5 minutes later you misunderstood the question
- You know the brute force but cannot see how to make it faster
- You finish coding and have no idea whether it actually works
- The interviewer says "can you do better?" and you freeze

Interviewers grade the **process** as much as the final answer. A clean process with a
slower solution often scores higher than a lucky fast solution with no explanation.

---

## How it works

The framework is called **UMPIRE**. Six steps, in order:

```
  U  Understand   ->  restate the problem, ask questions, write examples
  M  Match        ->  which data structure / pattern does this smell like?
  P  Plan         ->  brute force first, then optimize; write pseudocode
  I  Implement    ->  write clean code from the plan
  R  Review       ->  dry-run on an example, trace line by line
  E  Evaluate     ->  time & space complexity, trade-offs, follow-ups
```

Typical time split in a 45-minute interview: U+M 5-8 min, P 8-10 min, I 15 min, R+E 5-8 min.

### U - Understand (never skip this)

1. **Restate** the problem in your own words. "So I'm given an array of numbers and a target,
   and I need to return the two indices whose values add up to the target."
2. **Ask clarifying questions.** Good ones to keep in your pocket:
   - What is the input type and size? (n up to 10? 10^5? 10^9?) This decides what complexity is acceptable.
   - Can the input be empty? One element? `null`?
   - Are there duplicates? Negative numbers? Zero?
   - Is the input sorted?
   - Exactly one answer, or could there be many / none? What do I return when none?
   - Should I return indices or values? Does order matter?
   - Can I modify the input in place?
   - For strings: only lowercase a-z? Unicode? Case sensitive? Spaces?
3. **Write 2-3 examples by hand**, including one small edge case. Work out the expected
   outputs manually. If you cannot compute the answer by hand, you do not understand the problem.

### M - Match

Look for signals in the wording and connect them to tools you know:

| Signal in the problem | Think about |
|---|---|
| "pair / two numbers that sum to", "seen before", "count occurrences" | Hash map / set (05_Hashing) |
| sorted array, "find", "minimum x such that" | Binary search (10_Searching) |
| "substring / subarray", "longest / shortest window" | Sliding window (07_Sliding_Window) |
| sorted + pair, palindrome, "from both ends" | Two pointers (06_Two_Pointers) |
| "sum of range", "subarray sum equals" | Prefix sum (08_Prefix_Sums_And_Difference_Arrays) |
| "next greater", matching brackets, "most recent" | Stack (16_Stacks) |
| "top k", "k smallest", "merge k", "median of stream" | Heap (19_Heaps_And_Priority_Queues) |
| "all combinations / permutations / subsets" | Backtracking (13_Backtracking) |
| "minimum cost", "number of ways", "can we reach", choices overlap | Dynamic programming (29_Dynamic_Programming) |
| grid, "connected", "shortest path", "islands" | BFS / DFS (23_Graphs, 09_Matrix_And_Multidimensional_Arrays) |
| "prefix", "autocomplete", many words | Trie (22_Tries) |
| intervals, "overlap", "merge meetings" | Sort by start (31_Intervals) |

You do not need to be right on the first guess. Say it out loud: "This looks like a sliding
window problem because I need the longest substring with a property."

### P - Plan

1. **Brute force first.** Always. Say it in one or two sentences with its complexity.
   "I could try every pair, that's O(n^2)." This proves you understand the problem and gives
   you a fallback if the clever idea fails.
2. **Find the waste.** Ask: what work does the brute force repeat? What information does it
   throw away that it could remember? That answer is usually the optimization.
   - Repeated lookups -> store them in a hash map
   - Re-scanning a window -> slide it, add one, remove one
   - Re-computing the same sub-problem -> memoize / DP
   - Checking every element when the data is sorted -> binary search
3. **Write pseudocode** or 4-6 bullet points before real code. Agree on the plan with the
   interviewer. If they nod, implement. If they frown, ask why before writing code.

### I - Implement

- Write the function signature first, then the main loop, then the edge-case guards.
- Use **descriptive names**: `left`, `right`, `windowSum`, `seen`, not `l`, `r`, `s`, `m`.
- Keep helper functions small. If a piece of logic has a name, make it a function.
- Keep talking while you type: "Now I'm moving the left pointer because the window is invalid."
- Do not optimize prematurely. Get it correct, then clean up.

### R - Review

- **Dry-run by hand** on one normal example and one edge case. Trace every variable line by
  line. Do this BEFORE claiming you are done. Most bugs are found here.
- Check: off-by-one on loop bounds, `<` vs `<=`, empty input, single element, the last element
  of the loop, integer overflow, returning the wrong thing (index vs value).
- Then run the real tests (`node file.js`).

### E - Evaluate

- State **time and space complexity** and explain why in one sentence each.
- Mention the trade-off you made ("I used O(n) extra memory to get O(n) time").
- Think about follow-ups: "What if the input does not fit in memory?", "What if it is a stream?",
  "What if it is called millions of times?"

---

## Pseudocode

The UMPIRE loop as pseudocode you can follow on every problem:

```
solve(problem):
    UNDERSTAND: restate it; list inputs, outputs, constraints; ask 3 clarifying questions; write 2-3 examples incl. an edge case
    MATCH:      look for signals (sorted? pairs? contiguous? "all ways"? "minimum"?) -> candidate patterns
    PLAN:       brute force first + its complexity; find the repeated work; plan the optimal in 4-6 bullets; agree with the interviewer
    IMPLEMENT:  write clean code with good names; talk while you type
    REVIEW:     dry run one normal example and one edge case line by line; fix bugs
    EVALUATE:   state time and space; mention trade-offs and follow-ups
```

---

## Dry run on a concrete example

UMPIRE applied to "Contains Duplicate" (`[1, 2, 3, 1]` → true):

| step | what you say or write | output of the step |
|---|---|---|
| U | "Return true if any value appears twice. Can the array be empty? (yes, return false)" | examples: `[1,2,3,1]` → true, `[]` → false |
| M | "Have I seen this before?" is the seen-set signal | pattern: hash set |
| P | brute force: compare all pairs O(n²); repeated work = re-scanning; plan: one pass with a `Set` | 3-line plan |
| I | `for (const x of nums) { if (seen.has(x)) return true; seen.add(x); } return false;` | code |
| R | trace `[1,2,3,1]`: seen = {1}, {1,2}, {1,2,3}, then 1 is found → true | bug-free trace |
| E | "O(n) time, O(n) space; sorting gives O(1) extra space at O(n log n) time" | complexity + trade-off |

---

## Operations & complexity

Not a data structure, but here is the "budget" rule of thumb that drives the Plan step.
Roughly 10^8 simple operations run in about one second in JavaScript.

| Input size n | Acceptable complexity | Typical approach |
|---|---|---|
| n <= 10 | O(n!) | permutations, brute force everything |
| n <= 20 | O(2^n) | subsets, bitmask |
| n <= 500 | O(n^3) | triple loops, some DP |
| n <= 5,000 | O(n^2) | nested loops, 2D DP |
| n <= 10^6 | O(n log n) or O(n) | sorting, hashing, sliding window, heap |
| n >= 10^8 | O(log n) or O(1) | binary search, math formula |

Ask for the constraints early so you know which row you are in.

---

## JavaScript implementation

Two runnable files live next to this README:

- `02_Implementations/problem_template.js` - a commented skeleton. **Copy it for every new problem** you solve.
  It forces you to write the understanding, examples, brute force, optimal, tests.
- `02_Implementations/example_walkthrough.js` - Two Sum solved by walking through all six UMPIRE steps,
  with the brute force and the optimal version, and a dry run in the comments.

Minimal shape of every problem file in this curriculum:

```js
/** header comment: PROBLEM, EXAMPLES, CLARIFYING QUESTIONS, APPROACHES, EDGE CASES */
function bruteForce(input) { /* obvious, slow, correct */ }
function optimal(input)    { /* fast, clean, commented */ }
// ---------- tests ----------
const assert = require('assert');
assert.deepStrictEqual(optimal(/* ... */), /* expected */);
console.log('✓ NN-name passed');
module.exports = { optimal, bruteForce };
```

---

## Patterns / variations

### 1. The "what is repeated?" question (brute force -> optimal)

```js
// brute force: for every i, scan everything before it   -> O(n^2)
for (let i = 0; i < nums.length; i++)
  for (let j = 0; j < i; j++)
    if (nums[j] === target - nums[i]) return [j, i];

// the inner loop REPEATS a lookup. Remember instead of re-scanning -> O(n)
const seen = new Map();
for (let i = 0; i < nums.length; i++) {
  if (seen.has(target - nums[i])) return [seen.get(target - nums[i]), i];
  seen.set(nums[i], i);
}
```
Use when: the brute force has an inner loop that searches for something.

### 2. Talking out loud (script you can reuse)

```
"Let me make sure I understand: ... Is that right?"
"A few questions: can it be empty? duplicates? what should I return if ...?"
"The brute force would be ..., which is O(...). Let me see if we can do better."
"The repeated work here is ..., so if I store ... I can avoid it."
"Plan: 1) ... 2) ... 3) ... Does that sound reasonable?"
"Let me trace through example ... [trace]. Looks right."
"Time is O(...) because ..., space is O(...) because ..."
```

### 3. Testing checklist (write these before you say "done")

```js
// 1. the example from the problem statement
// 2. empty input / zero / null-ish          -> [] "" 0
// 3. one element                            -> [5]
// 4. two elements (smallest "interesting")  -> [1, 2]
// 5. all the same                           -> [3, 3, 3]
// 6. negatives, zeros, very large numbers
// 7. already sorted / reverse sorted
// 8. answer at the very start / very end
// 9. no answer exists (what should you return?)
```

### 4. When you are stuck

- Solve a **smaller** version (n = 1, n = 2). What changes when n grows by one?
- Solve it **by hand** and watch what your brain does. That is often the algorithm.
- **Sort** the input and see if the problem gets easier.
- Draw it. Arrays as boxes, trees as trees, pointers as arrows.
- Say what you are stuck on. Interviewers give hints to people who communicate.

---

## Alternatives and trade-offs

| Approach | When it helps | Risk |
|---|---|---|
| UMPIRE (this guide) | every new problem, especially under interview pressure | feels slow at first; it gets faster with practice |
| Jump straight to code | problems you have solved many times | missed edge cases, wrong problem solved |
| Pattern lists / flashcards | recognising the right technique quickly | memorising without understanding breaks on twists |
| Test-first (write asserts before code) | tricky edge cases, take-home tasks | uses time in a live interview |

---

## Common mistakes & edge cases

- Coding before understanding. The single most common failure.
- Not asking about input size, then picking an approach that is too slow (or too complex for a tiny n).
- Forgetting to state the brute force. It is free points and a safety net.
- Silent coding. The interviewer cannot give credit for thoughts they cannot hear.
- Declaring "done" without a dry run. Always trace one example.
- Not handling empty / single-element input.
- Returning the wrong shape (values instead of indices, string instead of array).
- Mutating the input when told not to (or not mutating when told to do it in place).

---

## When this does NOT apply

- **Pure knowledge questions** ("What is the time complexity of a heap push?") do not need the full loop; answer directly and explain why.
- **System design rounds** follow a different structure (requirements, APIs, data model, scaling).
- **Very easy warm-ups**: compress U/M/P into one sentence, but still do the R (dry run) step.
- The loop does not replace practice; it only organises what you already know.

---

## Interview tips

- Treat the interviewer as a teammate, not a judge. Agree on the plan before coding.
- If you know the optimal immediately, still mention the brute force in one sentence.
- Write the complexity at the top of your function as a comment. It shows discipline.
- If you run out of time, explain what you would do next. Partial credit is real.
- Practice with a timer. 25 minutes for medium problems. Speed comes from repetition of the
  process, not from memorizing answers.
- After every practice problem, write down: what pattern it was, what you missed, what the key
  insight was. Keep a log. Review it weekly.

---

## Problems in this folder

| # | Problem | Difficulty | Pattern | File |
|---|---------|------------|---------|------|
| - | Problem template (copy for every new problem) | - | UMPIRE skeleton | 02_Implementations/problem_template.js |
| - | Two Sum, walked through UMPIRE step by step | Easy | hash map | 02_Implementations/example_walkthrough.js |

---

## Practice more

Use these to practice the **process** (they are all easy, so focus on talking and testing):

Easy: Two Sum (1), Valid Anagram (242), Contains Duplicate (217), Best Time to Buy and Sell
Stock (121), Valid Palindrome (125), Reverse Linked List (206), Maximum Subarray (53),
Climbing Stairs (70), Merge Two Sorted Lists (21), Binary Search (704)

Medium (try the full 45-minute simulation): Longest Substring Without Repeating Characters (3),
Group Anagrams (49), Product of Array Except Self (238), 3Sum (15), Top K Frequent Elements (347)
