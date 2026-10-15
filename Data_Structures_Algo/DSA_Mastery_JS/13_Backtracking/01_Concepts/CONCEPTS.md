# Recursion & Backtracking

> **Prerequisites:** [Recursion](../../12_Recursion/README.md), [JavaScript for DSA](../../00_Foundations/01_JavaScript_For_DSA/README.md) (functions, closures, arrays), [Time Complexity](../../01_Complexity_Analysis/01_Time_Complexity/README.md) (exponential growth), [Arrays](../../03_Arrays/README.md), [Strings](../../04_Strings/README.md). "How it works" below also reviews recursion.

**Recursion** is when a function solves a problem by calling **itself** on a smaller version of
the same problem. Think of Russian nesting dolls: to open the whole set you open one doll, and
inside is... a smaller set of dolls, which you open the same way, until you reach the tiny
solid doll that does not open (the base case).

**Backtracking** is recursion used to **explore every possible choice**: try one option, go
deeper, and if it does not work out, undo it ("back track") and try the next option. Think of
walking through a maze: at each fork pick a path; if it dead-ends, walk back to the fork and
try the other one.

---

## Why it matters / when to use

Reach for recursion when the problem has any of these signals:

- The data is **nested or self-similar**: trees, nested arrays, folders inside folders, JSON
- "Do X for the whole thing" can be written as "do X for the first part, then the same X for the rest"
- Divide and conquer: merge sort, quick sort, binary search (see `11_Sorting`, `10_Searching`)
- The problem definition is itself recursive: factorial, Fibonacci, Tower of Hanoi

Reach for **backtracking** when you see:

- "Generate **all** ..." (all subsets, all permutations, all combinations, all paths)
- "Find **any** valid arrangement" under constraints (N-Queens, Sudoku, word search)
- "How many ways ..." with a small input (n <= ~15..20)
- Choices at each step, and a choice can turn out to be wrong later
- Exponential answer size: the output itself is 2^n or n! things, so no "fast" algorithm exists

---

## How it works

### The two parts of every recursive function

```js
function solve(problem) {
  if (problem is tiny)      return directAnswer;        // 1. BASE CASE    - stops the recursion
  const smaller = shrink(problem);
  const sub     = solve(smaller);                        // 2. RECURSIVE CASE - trust it works
  return combine(sub, problem);                          //    then build the full answer
}
```

Missing the base case = infinite recursion = `RangeError: Maximum call stack size exceeded`.

### The call stack, traced

Every call gets its own **frame** (its own copy of the parameters and local variables).
A call cannot finish until the call it made finishes. The frames pile up like plates (a stack!).

```js
function factorial(n) {
  if (n <= 1) return 1;          // base case
  return n * factorial(n - 1);   // recursive case
}
factorial(4)
```

```
going DOWN (calls pile up)               coming back UP (frames return)

factorial(4)                              factorial(4) = 4 * 6  = 24   <- final
  waits for factorial(3)                    factorial(3) = 3 * 2 = 6
    waits for factorial(2)                    factorial(2) = 2 * 1 = 2
      waits for factorial(1)                    factorial(1) = 1   (base case)

call stack at the deepest point:
  | factorial(1) |   <- top, returns first
  | factorial(2) |
  | factorial(3) |
  | factorial(4) |   <- bottom, returns last
  ----------------
```

Depth of the stack = **space complexity** of the recursion (here O(n)).

### How to think recursively: "trust the function"

Beginners try to trace every call in their head and get lost. Do this instead:

1. Decide what the function **promises** ("`sum(arr, i)` returns the sum of `arr[i..end]`").
2. Write the base case (the smallest input where the promise is trivially true).
3. For the general case, **assume the recursive call already keeps its promise** on the smaller
   input, and just do the one extra step that turns the smaller answer into the full answer.

That is it. This is called the *leap of faith* or the *recursive leap*. It works because of
mathematical induction: if the base case is right and each step is right, every case is right.

```js
// promise: returns arr[i] + arr[i+1] + ... + arr[last]
function sum(arr, i = 0) {
  if (i === arr.length) return 0;        // nothing left -> 0
  return arr[i] + sum(arr, i + 1);       // my element + (trust) the sum of the rest
}
```

### Recursion tree & complexity

Draw the calls as a tree. **Time = number of nodes x work per node. Space = height of the tree.**

```
fib(5)                                   naive Fibonacci: each call makes 2 calls
├── fib(4)                               height = n, nodes ~ 2^n
│   ├── fib(3)                           -> O(2^n) time, O(n) space
│   │   ├── fib(2)
│   │   │   ├── fib(1)
│   │   │   └── fib(0)
│   │   └── fib(1)
│   └── fib(2)
│       ├── fib(1)
│       └── fib(0)
└── fib(3)        <- fib(3) is computed AGAIN. Same input, same answer. Wasted work.
    ├── fib(2)
    │   ├── fib(1)
    │   └── fib(0)
    └── fib(1)
```

Rules of thumb:

| Shape of recursion | Example | Time |
|---|---|---|
| one call, input shrinks by 1 | factorial, sum of array | O(n) |
| one call, input halves | binary search | O(log n) |
| two calls, input halves, O(n) merge | merge sort | O(n log n) |
| two calls, input shrinks by 1 | naive fib, subsets | O(2^n) |
| n calls, input shrinks by 1 | permutations | O(n!) |

### Memoization teaser (full story in `29_Dynamic_Programming`)

In the fib tree, `fib(3)` is computed twice, `fib(2)` three times... Cache every answer in a
Map keyed by the input, and each input is solved once: O(2^n) becomes O(n).

```js
function fib(n, memo = new Map()) {
  if (n <= 1) return n;
  if (memo.has(n)) return memo.get(n);
  const result = fib(n - 1, memo) + fib(n - 2, memo);
  memo.set(n, result);
  return result;
}
```

Memoization only helps when the same sub-problem repeats (**overlapping subproblems**).
Backtracking problems that generate *all* outputs usually cannot be memoized, because the
output itself is exponential. Word Break II (problem 16) is the exception that shows when it can.

### Head vs tail recursion

```js
// HEAD recursion: recurse FIRST, work after. Work happens while unwinding.
function printReversed(n) {
  if (n === 0) return;
  printReversed(n - 1);
  console.log(n);              // prints 1,2,3...  (the deepest frame prints first)
}

// TAIL recursion: work FIRST, recursive call is the very last thing.
function printDown(n) {
  if (n === 0) return;
  console.log(n);              // prints n, n-1, ...
  printDown(n - 1);            // nothing happens after this returns
}
```

Tail recursion is easy to turn into a loop because there is nothing to do when the call returns.
Some languages optimize tail calls automatically. **JavaScript engines (V8/Node) do not**, so a
tail-recursive function still uses O(n) stack frames.

### Converting recursion to iteration

Two options:

1. **Tail recursive?** Replace the call with a loop that reassigns the parameters.
2. **Otherwise** use an explicit stack (an array) that stores what each frame would have stored.

```js
// recursive                              // iterative with an explicit stack
function flatten(arr) {                   function flattenIter(arr) {
  const out = [];                           const out = [];
  for (const x of arr) {                    const stack = [...arr].reverse(); // keep order
    if (Array.isArray(x))                   while (stack.length) {
      out.push(...flatten(x));                const x = stack.pop();
    else out.push(x);                         if (Array.isArray(x)) stack.push(...[...x].reverse());
  }                                           else out.push(x);
  return out;                               }
}                                           return out;
                                          }
```

### The JS stack limit (~10k frames)

Node's default stack allows roughly **10,000 - 12,000** simple frames. Recursing down a
linked list of 100,000 nodes or `sum(arr)` on a 1e5 array will crash with
`RangeError: Maximum call stack size exceeded`. How to handle it:

- Prefer iteration when depth can be O(n) and n can be large (linked lists, long arrays).
- Recursion is safe when depth is O(log n) (binary search, balanced trees, merge sort) or when
  n is small by the problem's nature (backtracking: n <= 20).
- Trees: a degenerate (linked-list-shaped) tree of 1e5 nodes can overflow a recursive DFS.
  Use an explicit stack if the constraints allow deep trees.
- Last resort: `node --stack-size=65500 file.js` (not available in interview platforms).

---

## Backtracking

### The template: choose, explore, un-choose

```js
function backtrack(path, choicesLeft) {
  if (path is a complete answer) {       // base case: record it
    results.push([...path]);             // COPY, because path keeps changing
    return;
  }
  for (const choice of choicesLeft) {
    if (choice is not allowed) continue; // PRUNE: skip dead ends early
    path.push(choice);                   // 1. CHOOSE
    backtrack(path, choicesLeft without choice); // 2. EXPLORE
    path.pop();                          // 3. UN-CHOOSE (restore state for the next sibling)
  }
}
```

Full generic version with helpers: `backtracking_template.js`.

### Decision tree diagram

Subsets of `[1, 2, 3]`: at each element decide **take it** or **skip it**.

```
                                 []
                   take 1 /              \ skip 1
                       [1]                    []
              take 2 /    \ skip 2     take 2 /   \ skip 2
               [1,2]      [1]           [2]       []
            t3 /  \ s3  t3 / \ s3    t3 / \ s3  t3 / \ s3
        [1,2,3] [1,2]  [1,3] [1]  [2,3] [2]   [3]  []

8 leaves = 2^3 subsets. Height = 3 = n. Space O(n), time O(n * 2^n) (copying each leaf).
```

Permutations of `[1, 2, 3]`: at each level pick **any unused** element.

```
                        []
          /              |              \
        [1]             [2]             [3]
       /   \           /   \           /   \
    [1,2] [1,3]     [2,1] [2,3]     [3,1] [3,2]
      |     |         |     |         |     |
  [1,2,3][1,3,2]  [2,1,3][2,3,1]  [3,1,2][3,2,1]

6 leaves = 3! permutations. Branching shrinks 3, 2, 1.
```

### Subsets vs permutations vs combinations

| Want | Order matters? | Size fixed? | Loop starts at | Count | Example from [1,2,3] |
|---|---|---|---|---|---|
| Subsets | no | no (any size) | `start` index | 2^n | [], [1], [1,2], [1,2,3], [1,3], [2], [2,3], [3] |
| Combinations (choose k) | no | yes, k | `start` index | C(n,k) | k=2: [1,2], [1,3], [2,3] |
| Permutations | yes | yes, n | `0` with a `used[]` array | n! | [1,2,3], [1,3,2], [2,1,3], ... |

The single most important rule: **if order does not matter, pass a `start` index and only look
forward** (never go back to an earlier element). That is what prevents `[1,2]` and `[2,1]`
from both appearing. If order matters, loop from 0 every time and track `used`.

### Handling duplicates: sort, then skip

Input `[1, 2, 2]`: naive subsets gives `[1,2]` twice. Fix: sort, and inside the loop skip an
element that equals the previous element **at the same tree level**:

```js
nums.sort((a, b) => a - b);
for (let i = start; i < nums.length; i++) {
  if (i > start && nums[i] === nums[i - 1]) continue;   // same value already tried at this level
  ...
}
```

Why `i > start` and not `i > 0`? Because taking `2, 2` down the tree (different levels) is a
legit subset `[2,2]`. We only block the *sibling* branch that would start the same way.
For permutations, the condition is `if (i > 0 && nums[i] === nums[i-1] && !used[i-1]) continue;`.

### Pruning

Cutting off branches that cannot lead to an answer. The earlier you cut, the fewer nodes you visit.

- Combination Sum: `if (remaining < 0) return;` and since the array is sorted, `break` as soon as
  `candidates[i] > remaining`.
- Combinations: `if (path.length + (n - i + 1) < k) break;` (not enough elements left).
- N-Queens: keep Sets of attacked columns / diagonals, O(1) check instead of scanning the board.
- Generate Parentheses: only add `)` when `close < open`.

### Copy vs push/pop

| Style | Code | Pros / cons |
|---|---|---|
| mutate + undo | `path.push(x); go(); path.pop();` | O(1) per step, must remember to undo; **copy on record** `results.push([...path])` |
| copy on every call | `go([...path, x])` | simpler, no undo, but O(n) copy per call. Fine for n <= 20. |

The classic bug: `results.push(path)` without copying. Every result then points to the same
array, which ends up empty after all the pops.

For grids (Word Search, Sudoku) you cannot copy the board every call. Mutate the cell, recurse,
restore the cell. That is "push/pop" applied to a 2D array.

---

## Pseudocode

```
BACKTRACK(state, path):
    if path is a complete answer:
        record a COPY of path
        return                      # (or return true for "find one")
    for each choice available from state:
        if choice breaks a rule:    # prune early
            continue
        apply choice  (path.push, mark used, update counters)
        BACKTRACK(next state, path)
        undo choice   (path.pop, unmark, restore counters)

RECURSION (general):
    f(input):
        if input is tiny: return direct answer       # base case
        smaller = shrink(input)                       # must make progress
        return combine(f(smaller), current step)      # trust f on smaller input
```

---

## Operations & complexity

| Pattern | Time | Space (stack) | Note |
|---|---|---|---|
| Subsets | O(n * 2^n) | O(n) | 2^n results, O(n) to copy each |
| Permutations | O(n * n!) | O(n) | n! results |
| Combinations C(n,k) | O(k * C(n,k)) | O(k) | |
| Combination Sum | O(n^(T/m)) roughly | O(T/m) | T = target, m = smallest candidate |
| N-Queens | O(n!) | O(n) | pruning makes it far faster in practice |
| Word Search | O(m*n * 3^L) | O(L) | L = word length, 3 directions after the first |
| Sudoku | O(9^(empty cells)) worst | O(81) | pruning does almost all the work |

---

## JavaScript implementation

Full runnable code: `recursion_basics.js` (10 classic recursive functions) and
`backtracking_template.js` (the generic template, plus subsets / permutations / combinations
built from it). Core shapes:

```js
// subsets: start index, record every node
function subsets(nums) {
  const results = [];
  function go(start, path) {
    results.push([...path]);
    for (let i = start; i < nums.length; i++) {
      path.push(nums[i]);
      go(i + 1, path);
      path.pop();
    }
  }
  go(0, []);
  return results;
}

// permutations: used[] array, record only full-length paths
function permutations(nums) {
  const results = [];
  const used = new Array(nums.length).fill(false);
  function go(path) {
    if (path.length === nums.length) { results.push([...path]); return; }
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue;
      used[i] = true;  path.push(nums[i]);
      go(path);
      used[i] = false; path.pop();
    }
  }
  go([]);
  return results;
}
```

---

## Dry run

**Subsets of `[1, 2, 3]`** with the start-index template (record every node):

| Step | Call | start | path before loop | Recorded | Next action |
|---|---|---|---|---|---|
| 1 | go(0, []) | 0 | [] | [] | push 1 |
| 2 | go(1, [1]) | 1 | [1] | [1] | push 2 |
| 3 | go(2, [1,2]) | 2 | [1,2] | [1,2] | push 3 |
| 4 | go(3, [1,2,3]) | 3 | [1,2,3] | [1,2,3] | loop empty, return; pop 3, pop 2 |
| 5 | back in go(1) | 1 | [1] | - | push 3 |
| 6 | go(3, [1,3]) | 3 | [1,3] | [1,3] | return; pop 3, pop 1 |
| 7 | back in go(0) | 0 | [] | - | push 2 |
| 8 | go(2, [2]) | 2 | [2] | [2] | push 3 |
| 9 | go(3, [2,3]) | 3 | [2,3] | [2,3] | return; pop 3, pop 2 |
| 10 | back in go(0) | 0 | [] | - | push 3 |
| 11 | go(3, [3]) | 3 | [3] | [3] | return; pop 3 |

Result: `[[], [1], [1,2], [1,2,3], [1,3], [2], [2,3], [3]]` — 8 = 2^3 subsets. Notice `path` is back to `[]` at the end: every push was matched by a pop.

---

## Patterns / variations

### 1. Take / skip (binary choice per element)

```js
function go(i, path) {
  if (i === nums.length) { results.push([...path]); return; }
  go(i + 1, path);                 // skip nums[i]
  path.push(nums[i]);
  go(i + 1, path);                 // take nums[i]
  path.pop();
}
```
Use when: subsets, 0/1 knapsack style decisions, "pick or not pick".

### 2. For-loop over candidates with a start index

```js
function go(start, path) {
  results.push([...path]);
  for (let i = start; i < nums.length; i++) {
    path.push(nums[i]); go(i + 1, path); path.pop();
  }
}
```
Use when: subsets, combinations, combination sum (pass `i` instead of `i + 1` to allow reuse).

### 3. Used-array (order matters)

```js
for (let i = 0; i < nums.length; i++) {
  if (used[i]) continue;
  used[i] = true; path.push(nums[i]);
  go(path);
  used[i] = false; path.pop();
}
```
Use when: permutations, arranging items, scheduling.

### 4. Build a string position by position

```js
function go(index, current) {
  if (index === digits.length) { results.push(current); return; }
  for (const letter of letters[digits[index]]) go(index + 1, current + letter);
}
```
Use when: Letter Combinations, Generate Parentheses, Restore IP Addresses. Strings are immutable
in JS so `current + letter` is already a copy: no pop needed.

### 5. Partition a string / array (cut positions)

```js
function go(start, parts) {
  if (start === s.length) { results.push([...parts]); return; }
  for (let end = start; end < s.length; end++) {
    const piece = s.slice(start, end + 1);
    if (!isValid(piece)) continue;
    parts.push(piece); go(end + 1, parts); parts.pop();
  }
}
```
Use when: Palindrome Partitioning, Word Break II, Restore IP Addresses.

### 6. Grid DFS with mark / unmark

```js
function go(row, col, index) {
  if (index === word.length) return true;
  if (out of bounds || board[row][col] !== word[index]) return false;
  const saved = board[row][col];
  board[row][col] = '#';                      // mark visited
  const found = go(row+1,col,index+1) || go(row-1,col,index+1) ||
                go(row,col+1,index+1) || go(row,col-1,index+1);
  board[row][col] = saved;                    // unmark
  return found;
}
```
Use when: Word Search, Sudoku, islands with backtracking, path finding with constraints.

### 7. Find one solution (return boolean) vs collect all

When you only need *one* answer (Sudoku, Word Search, N-Queens "does a solution exist"),
return `true` as soon as a recursive call succeeds so the search stops immediately.

---

## Alternatives (brute force vs optimized)

| Approach | When it wins | Trade-off |
|---|---|---|
| **Backtracking with pruning** (this topic) | Need every valid arrangement, n small, constraints can kill branches early | Exponential worst case, but pruning makes it practical |
| **Generate-and-test** (build every candidate, then filter) | Tiny inputs, quick to write as a reference | Wastes work on candidates that broke a rule at step 1 |
| **Bitmask enumeration** (`for mask in 0..2^n-1`) | Subsets with n ≤ ~20, no recursion needed | Only fits "take / skip" choices; no early pruning |
| **Iterative BFS-style building** (start with `[[]]`, extend each) | Subsets / letter combinations without recursion depth worries | Holds a whole level in memory at once |
| **Memoization / DP** | Only a count, a yes/no or a best value is needed and states repeat | Cannot list exponentially many answers any faster |
| **Explicit stack** instead of recursion | Very deep recursion (10k+ frames) | Code is longer; you manage the "undo" by hand |

---

## Common mistakes & edge cases

- **No base case** or a base case that is never reached (e.g. `n - 2` steps skipping 0 for odd n).
- **Pushing `path` without copying** - all results alias the same array.
- **Forgetting the un-choose step** (`pop()`, `used[i] = false`, restore the grid cell).
- Using `start = 0` for subsets/combinations - you get `[1,2]` and `[2,1]` as duplicates.
- Duplicate handling without sorting first - the skip trick only works on sorted input.
- Combination Sum: passing `i + 1` when reuse is allowed (or `i` when it is not).
- `results.push(path.join(''))` vs `results.push(path)` - decide what the output type is early.
- Deep recursion on big linear input (linked list of 1e5) - stack overflow. Use a loop.
- Returning `undefined` from a "find one" search because you forgot `return` in front of the
  recursive call (`if (go(...)) return true;`).
- Empty input: subsets of `[]` is `[[]]` (one empty subset), permutations of `[]` is `[[]]`.

---

## When this does NOT apply

- **Only a count or best value is asked** and states repeat (number of paths in a grid, coin change ways): use DP, not full enumeration.
- **n is large** (10^4+): an exponential search will not finish; look for greedy, DP, two pointers or sorting.
- **A greedy choice is provably safe** (interval scheduling, jump game reachability): no need to try alternatives.
- **The structure is a graph with shared states** (shortest path, reachability): BFS/DFS with a visited set visits each state once, while backtracking re-visits states along different paths.
- **Recursion depth equals input size in the 10^5 range** (linked lists, big arrays): use a loop or explicit stack to avoid stack overflow.

---

## Interview tips

- Start by stating the output size: "There are 2^n subsets, so any algorithm is at least
  O(2^n); backtracking is the right tool." Interviewers love hearing you know *why* it is slow.
- Say the three words: **choose, explore, un-choose**. Then write the template skeleton first,
  fill in the base case and the loop second.
- Draw a 2-3 level decision tree on the whiteboard. It makes the `start` index and the duplicate
  skip obvious to both you and the interviewer.
- Clarify: Can the input have duplicates? Can an element be reused? Does order matter? Do they
  want all solutions, one solution, or just the count?
- Mention pruning as an improvement *after* the correct version works.
- If they ask "can you avoid the recursion?", explain the explicit-stack conversion and the
  Node stack limit.

---

## Problems in this folder

| # | Problem | Difficulty | Pattern | File |
|---|---------|------------|---------|------|
| 01 | Subsets | Medium | start index, record every node | 03_Problems/solutions/01_subsets.js |
| 02 | Subsets II | Medium | sort + skip duplicates | 03_Problems/solutions/02_subsets_ii.js |
| 03 | Permutations | Medium | used array | 03_Problems/solutions/03_permutations.js |
| 04 | Permutations II | Medium | used array + skip duplicates | 03_Problems/solutions/04_permutations_ii.js |
| 05 | Combinations | Medium | start index, fixed size k, pruning | 03_Problems/solutions/05_combinations.js |
| 06 | Combination Sum | Medium | reuse allowed (pass i), prune on remaining | 03_Problems/solutions/06_combination_sum.js |
| 07 | Combination Sum II | Medium | no reuse, sort + skip duplicates | 03_Problems/solutions/07_combination_sum_ii.js |
| 08 | Letter Combinations of a Phone Number | Medium | build string position by position | 03_Problems/solutions/08_letter_combinations_phone.js |
| 09 | Generate Parentheses | Medium | constrained string building | 03_Problems/solutions/09_generate_parentheses.js |
| 10 | Palindrome Partitioning | Medium | partition with cut positions | 03_Problems/solutions/10_palindrome_partitioning.js |
| 11 | Word Search | Medium | grid DFS mark/unmark | 03_Problems/solutions/11_word_search.js |
| 12 | N-Queens | Hard | row by row with attacked sets | 03_Problems/solutions/12_n_queens.js |
| 13 | Sudoku Solver | Hard | find one solution, return boolean | 03_Problems/solutions/13_sudoku_solver.js |
| 14 | Restore IP Addresses | Medium | string partition with 4 parts | 03_Problems/solutions/14_restore_ip_addresses.js |
| 15 | Expression Add Operators | Hard | string building with running value + last operand | 03_Problems/solutions/15_expression_add_operators.js |
| 16 | Word Break II | Hard | backtracking + memoization | 03_Problems/solutions/16_word_break_ii.js |

---

## Practice more

Easy: Fibonacci Number (509), Power of Two (231), Reverse String (344), Climbing Stairs (70),
Binary Tree Paths (257)

Medium: Letter Case Permutation (784), Beautiful Arrangement (526), Partition to K Equal Sum
Subsets (698), Matchsticks to Square (473), Combination Sum III (216), Target Sum (494),
Unique Paths III (980), Splitting a String Into Descending Consecutive Values (1849),
All Paths From Source to Target (797), Permutation Sequence (60)

Hard: N-Queens II (52), Word Search II (212, uses a Trie), Remove Invalid Parentheses (301),
Wildcard Matching (44), Regular Expression Matching (10)
