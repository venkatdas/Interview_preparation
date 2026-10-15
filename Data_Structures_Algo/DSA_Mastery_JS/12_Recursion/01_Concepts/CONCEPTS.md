# Recursion — Concepts Guide

Recursion is solving a problem by solving **smaller copies of the same problem** and
combining their answers. This guide is the full recursion topic: how to *decompose* a
problem, how multiple recursive calls behave, how recursion works on arrays, strings,
linked lists and trees, and how memoization turns slow recursion into dynamic programming.

> The very first steps (what a call stack is, factorial, a first base case) are in
> [00_Foundations/03_Recursion_Fundamentals](../../00_Foundations/03_Recursion_Fundamentals/README.md).
> The classic warm-ups (factorial, naive Fibonacci, Tower of Hanoi, binary strings) are
> already implemented in [13_Backtracking/02_Implementations/recursion_basics.js](../../13_Backtracking/02_Implementations/recursion_basics.js).
> This page does not repeat them; it builds on them.

---

## 1. Prerequisites  (Essential)

- [Recursion fundamentals](../../00_Foundations/03_Recursion_Fundamentals/README.md) — call stack, base case, factorial
- [JavaScript for DSA](../../00_Foundations/01_JavaScript_For_DSA/README.md) — closures, default parameters, `Map`
- [Complexity Analysis](../../01_Complexity_Analysis/) — Big-O, recursion trees
- [Linked Lists](../../15_Linked_Lists/README.md) — `ListNode`, `next` pointers
- [Sorting](../../11_Sorting/README.md) — merge sort / quick sort are recursive algorithms you have already seen

Next topics that depend on this one: [Backtracking](../../13_Backtracking/README.md),
[Trees](../../20_Trees/01_Binary_Trees/README.md), [Divide and Conquer](../../30_Divide_And_Conquer/README.md),
[Dynamic Programming](../../29_Dynamic_Programming/01_Concepts/OVERVIEW.md).

---

## 2. Intuition  (Essential)

Imagine you are in a queue for a concert and want to know your position. You cannot see the
front. So you ask the person ahead: "what is your position?". They ask the person ahead of
them, and so on. The first person knows the answer ("1") without asking anyone. Each answer
travels back, and every person adds 1.

That is recursion:

- **Base case**: the first person answers directly.
- **Recursive case**: everyone else asks a *smaller* version of the question and does a tiny
  bit of work (add 1) on the answer.

The magic trick for writing recursion is the **leap of faith**: when you write
`position(me) = position(personAhead) + 1`, you do NOT trace what happens inside
`position(personAhead)`. You *trust* that it returns the right answer, because it is the same
function on a smaller input. Your only jobs are:

1. Say exactly what the function returns (its **promise**).
2. Handle the smallest inputs directly (**base cases**).
3. Use the promise on smaller inputs to finish the current input (**recursive step**).

---

## 3. Mental model, analogy and visuals  (Essential)

### The call stack as a stack of sticky notes

Every call gets its own sticky note (stack frame) with its own local variables. A new call puts
a note on top. A `return` removes the top note and hands its value to the note below.

```
sumList([4, 7, 1])            promise: sum of arr[i..end]

call sumList(i=0)    ┌──────────────┐
  call sumList(i=1)  │ i=3 -> 0     │  <- base case, returns first
    call sumList(i=2)│ i=2 -> 1 + 0 │
      call (i=3)     │ i=1 -> 7 + 1 │
                     │ i=0 -> 4 + 8 │  <- returns 12 last
                     └──────────────┘
Going DOWN: calls are pushed.   Coming UP: results are combined.
```

### The recursion tree (multiple recursion)

When a function calls itself more than once, the calls form a **tree**, not a chain.

```
                    paths(2,2)
                  /            \
            paths(1,2)        paths(2,1)
            /      \           /      \
      paths(0,2) paths(1,1) paths(1,1) paths(2,0)     <- paths(1,1) appears twice!
                  /    \     /    \
                 ...   ...  ...   ...
```

- **Time** ≈ number of nodes in this tree × work per node.
- **Space** ≈ the tree's **height** (only one root-to-leaf path is on the stack at a time).
- Repeated nodes (like `paths(1,1)`) are a signal: **memoize** and you have dynamic programming.

### Shapes of recursion you will meet

```
linear (one call)       halving (one call)       branching (2+ calls)      generate (loops of calls)
  f(n)                   f(n)                      f(n)                     build(lo,hi)
   |                      |                       /    \                   /  |  \
  f(n-1)                f(n/2)                f(n-1)  f(n-2)          root=lo  ...  root=hi
   |                      |                                          L x R    L x R   L x R
  ...  depth n          ... depth log n       ~2^n nodes              Catalan many results
```

---

## 4. Why it exists (what problem it solves)  (Essential)

Many problems are **self-similar**: the big problem *contains* smaller problems of the same kind.

| Data / problem | The smaller copy inside it |
|---|---|
| array `[a, ...rest]` | `rest` is an array |
| string | any substring / the string without its ends |
| linked list | `head.next` is a linked list |
| binary tree | `root.left` and `root.right` are trees |
| nested data (JSON, brackets, file system) | each nested part has the same shape |
| "how many ways / best way" | the choice you make leaves a smaller instance |

For these, a loop forces you to manage a stack or index bookkeeping by hand. Recursion lets the
**language's call stack** do it, so the code reads like the definition of the problem. It is
the foundation of backtracking, tree algorithms, divide and conquer, and top-down DP.

---

## 5. How it works, step by step  (Essential)

The **recipe** for designing any recursive function:

1. **Write the promise** as a comment: "`f(x)` returns ... for input `x`". Be precise about what
   the parameters mean (for example "`i` is the first index still to look at").
2. **Find the smallest inputs** you can answer without recursion: empty array, `null` node,
   `n === 0`, `lo > hi`. These are the base cases. Usually one or two.
3. **Shrink**: decide how the input gets smaller (one element less, half the range, the left and
   right subtree, `n - 2`, ...). Every call MUST move toward a base case.
4. **Combine**: assume the smaller calls already fulfil the promise; write how to build *your*
   answer from theirs.
5. **Check** on the smallest non-base input by hand (for example a list of 2 nodes).
6. **Measure** time (count nodes of the recursion tree) and space (depth of the tree).
7. **Improve**: overlapping calls → memo; too deep → iterate, halve, or trampoline.

### The 10 decomposition patterns in this topic

| # | Pattern | Shape | Example in `recursion_patterns.js` | Problem |
|---|---|---|---|---|
| 1 | first + rest | linear | `sumList`, `maxOfArray` | 02 |
| 2 | multiple recursion | branching | `countBinaryTreeShapes`, `gridPathsNaive` | 01, 13 |
| 3 | arrays/strings with indices | linear / two-ended | `reverseRange`, `isPalindromeStr`, `binarySearchRec` | 05, 12 |
| 4 | linked lists | linear | `reverseListRec`, `listLength` | 03, 04, 06 |
| 5 | trees | branching | `treeHeight`, `mirrorTree` | 11 |
| 6 | divide and conquer | halving | `rangeMax`, `fastPow` | 07, 08, 10 |
| 7 | memoization | branching → linear | `memoize`, `gridPathsMemo` | 01, 10, 13 |
| 8 | recursion vs iteration | — | `inorderIterative`, `trampoline` | 03 |
| 9 | mutual recursion | two+ functions | `isEven/isOdd`, `evaluateArithmetic` | 09, 14 |
| 10 | accumulators / helpers | tail-style | `sumWithAccumulator`, `collectLeaves` | 14 |
| 11 | generating structures | loops of calls | `allTreeShapes`, `allParenthesizations` | 10, 11, 12 |

---

## 6. Pseudocode  (Essential)

### Generic recursive function

```
function solve(input):
    if input is a base case:
        return the direct answer
    smaller = shrink(input)                  // one or more smaller inputs
    partial = solve(smaller)                 // LEAP OF FAITH
    return combine(input, partial)
```

### Memoized (top-down DP)

```
memo = empty map
function solve(state):
    if state is a base case: return answer
    if state in memo: return memo[state]
    result = combine(solve(sub1), solve(sub2), ...)
    memo[state] = result
    return result
```

### Generate all structures

```
function build(range):
    if range is empty: return [EMPTY]          // one way to build nothing - not []
    results = []
    for each choice of the "root"/"split" in range:
        for L in build(left part):
            for R in build(right part):
                results.add(make(choice, L, R))
    return results
```

### Helper with accumulator

```
function publicApi(input):
    function helper(position, acc):
        if position is past the end: return acc
        return helper(next position, acc updated with current element)
    return helper(start, initialAcc)
```

---

## 7. JavaScript implementation  (Essential)

All patterns are implemented, commented and self-tested in
[02_Implementations/recursion_patterns.js](../02_Implementations/recursion_patterns.js).
Run it: `node 12_Recursion/02_Implementations/recursion_patterns.js`.

The core shapes:

```js
// first + rest, with an index instead of slice (slice copies -> O(n^2))
function sumList(arr, i = 0) {
  if (i >= arr.length) return 0;
  return arr[i] + sumList(arr, i + 1);
}

// recursion on a linked list: trust the rest, then fix pointers
function reverseListRec(head) {
  if (head === null || head.next === null) return head;
  const newHead = reverseListRec(head.next);
  head.next.next = head;
  head.next = null;
  return newHead;
}

// memoization wrapper: recursive calls go through the wrapper
function memoize(fn, keyFn = (...a) => a.join(',')) {
  const cache = new Map();
  const wrapped = (...args) => {
    const key = keyFn(...args);
    if (!cache.has(key)) cache.set(key, fn(wrapped, ...args));
    return cache.get(key);
  };
  return wrapped;
}
const gridPaths = memoize((self, r, c) => (r === 0 || c === 0 ? 1 : self(r - 1, c) + self(r, c - 1)));

// generating structures: all full parenthesizations
function allParenthesizations(items) {
  if (items.length === 1) return [items[0]];
  const out = [];
  for (let k = 1; k < items.length; k++)
    for (const L of allParenthesizations(items.slice(0, k)))
      for (const R of allParenthesizations(items.slice(k))) out.push(`(${L}${R})`);
  return out;
}
```

---

## 8. Dry run on a concrete example  (Essential)

`reverseListRec` on `1 -> 2 -> 3`. The table shows each frame when it **returns** (bottom-up).

| Step | Frame (head) | `newHead` from the call below | Pointer changes | List seen from `newHead` |
|---|---|---|---|---|
| 1 | head = 3 | — (base case, `3.next` is null) | none | `3` |
| 2 | head = 2 | 3 | `2.next.next = 2` → `3.next = 2`; `2.next = null` | `3 -> 2` |
| 3 | head = 1 | 3 | `1.next.next = 1` → `2.next = 1`; `1.next = null` | `3 -> 2 -> 1` |

Second dry run — multiple recursion with memo, `gridPathsMemo(2, 2)`:

| Call | Memo hit? | Computes | Stored |
|---|---|---|---|
| (2,2) | no | (1,2) + (2,1) | — |
| (1,2) | no | (0,2)=1 + (1,1) | — |
| (1,1) | no | (0,1)=1 + (1,0)=1 = 2 | (1,1)=2 |
| (1,2) | — | 1 + 2 = 3 | (1,2)=3 |
| (2,1) | no | (1,1) **hit = 2** + (2,0)=1 = 3 | (2,1)=3 |
| (2,2) | — | 3 + 3 = 6 | (2,2)=6 |

---

## 9. Edge cases  (Essential)

- **Empty input**: empty array, empty string, `null` list/tree, `n = 0`. Usually a base case.
- **Single element**: often a second base case (`head.next === null`, `lo === hi`).
- **Negative or zero where you divide/shrink**: `isPowerOf(0, 3)` recurses forever without a guard.
- **Deep inputs**: Node's default stack allows roughly 10,000 frames (depends on frame size).
  A linked list of 10^5 nodes or a degenerate tree will throw `RangeError: Maximum call stack size exceeded`.
- **Shared mutable state**: a memo or output array declared outside the function survives
  between calls; reset it per top-level call.
- **Generating structures**: "empty" must return `[null]` / `['']` (one way), not `[]` (zero ways).
- **Big numbers**: results that grow fast (Fibonacci, powers) exceed 2^53; use `BigInt` or a modulus.

---

## 10. Complexity analysis  (Essential)

Rule: **time = (number of calls) × (work per call)**, **space = (max depth) × (frame size) + extra structures**.

| Recursion shape | Time | Space (stack) | Why |
|---|---|---|---|
| linear, O(1) work (`sumList`) | O(n) | O(n) | n calls in a chain |
| linear with `slice` each call | O(n^2) | O(n^2) total allocated | each slice copies up to n |
| halving, one call (`fastPow`, binary search) | O(log n) | O(log n) | input halves each time |
| halving, two calls + O(n) work (merge sort) | O(n log n) | O(log n) + O(n) buffers | log n levels × O(n) each |
| halving, two calls + O(1) work (`rangeMax`) | O(n) | O(log n) | tree with ~2n nodes |
| two calls on n-1 and n-2 (naive fib) | O(φ^n) ≈ O(1.6^n) | O(n) | tree of exponential size, depth n |
| same with memo | O(n) | O(n) | each state solved once |
| tree traversal | O(n) | O(h), h = height | each node once; h is log n (balanced) to n (skewed) |
| interval memo (i, j) | O(n^2) states × work | O(n^2) | Predict the Winner |
| generate all BSTs / parenthesizations | O(Catalan(n) × n) | output size | must list every result |

**Catalan numbers** 1, 1, 2, 5, 14, 42, 132, 429, 1430 count binary tree shapes, full
parenthesizations, balanced bracket strings. They grow like 4^n / n^1.5.

**Master theorem shortcut** for T(n) = a·T(n/b) + O(n^d):
d > log_b a → O(n^d); d = log_b a → O(n^d log n); d < log_b a → O(n^(log_b a)).

---

## 11. Alternatives: brute force vs optimized, recursion vs iteration  (Essential)

| Situation | Recursive version | Alternative | Pick |
|---|---|---|---|
| Overlapping subproblems | plain recursion: exponential | memoized recursion (top-down DP) or a table (bottom-up DP) | memo first (easy), bottom-up for O(1)-space tricks |
| Linear recursion on long input | elegant, but O(n) stack, may overflow | a `for` loop | loop in production; recursion for clarity in interviews if n is small |
| Tree traversal | 3 lines | explicit stack | recursion unless the tree can be very deep |
| Tail-recursive function | JS has no tail-call optimisation (only Safari) | loop, or a **trampoline** | loop |
| Nested grammar / parsing | recursive descent (mutual recursion) | explicit stack (see 16_Stacks) | recursion: matches the grammar |
| Generate all structures | natural | iterative is awkward | recursion |

Why iteration can be faster in JS: each call allocates a frame and the engine cannot always
inline recursive calls. Why recursion is still worth it: correctness is easier to argue (the
promise), and many problems (trees, grammars, backtracking) are recursive by nature.

---

## 12. Common mistakes (and why they happen)

1. **Missing or wrong base case** → infinite recursion / stack overflow. Happens when you think
   about the "normal" case first. Fix: write base cases first, test the smallest input.
2. **Not shrinking the input** (e.g. `f(n)` calls `f(n)` when `n` is 0 and you divide by 3).
3. **Using `slice`/spread in every call** → hidden O(n) copies → O(n^2). Pass indices instead.
4. **Ignoring the return value** of the recursive call (`reverse(head.next);` with no assignment).
5. **Calling the same subproblem twice** instead of storing it: `pow(x, n/2) * pow(x, n/2)` is
   O(n), not O(log n).
6. **Memo key collisions**: `` `${a}${b}` `` makes (1, 23) and (12, 3) the same key. Use a separator.
7. **Global mutable state** not reset between calls (memo, result arrays, counters).
8. **Returning `[]` instead of `[null]`** for an empty structure when generating combinations.
9. **Tracing every call in your head** instead of trusting the promise; you get lost and add
   needless special cases.
10. **Forgetting JavaScript's stack limit** for inputs of 10^4–10^5 depth.

---

## 13. Patterns / variations with templates  (Essential + Advanced)

### A. First + rest (Essential)
```js
function f(arr, i = 0) {
  if (i === arr.length) return BASE;
  return combine(arr[i], f(arr, i + 1));
}
```

### B. Two ends inward — strings, palindromes, building from the inside out (Essential)
```js
function f(s, lo = 0, hi = s.length - 1) {
  if (lo >= hi) return BASE;
  return check(s[lo], s[hi]) && f(s, lo + 1, hi - 1);
}
// generative version (Strobogrammatic): build(m) = wrap every pair around build(m - 2)
```

### C. Linked list: trust the rest, then fix pointers (Essential)
```js
function f(head) {
  if (!head || !head.next) return head;
  const rest = f(head.next /* or head.next.next */);
  /* relink head (and head.next) with rest */
  return newHead;
}
```

### D. Tree: combine children (Essential)
```js
function f(node) {
  if (!node) return BASE;
  const L = f(node.left), R = f(node.right);
  return combine(node.val, L, R);
}
```

### E. Halving / fast power (Essential)
```js
function pow(b, e) {
  if (e === 0) return 1;
  const half = pow(b, Math.floor(e / 2));   // ONE call
  return e % 2 ? half * half * b : half * half;
}
```

### F. Recurse on the parent (Advanced) — K-th Symbol, Elimination Game
The answer for position k at level n depends on position ~k/2 at level n-1. Depth O(n), no
need to build the levels.

### G. Multiple recursion + memo = top-down DP (Essential)
```js
const memo = new Map();
function f(state) {
  if (isBase(state)) return baseValue;
  const key = keyOf(state);
  if (memo.has(key)) return memo.get(key);
  const res = best(...choices.map((c) => f(next(state, c))));
  memo.set(key, res);
  return res;
}
```

### H. Minimax with score difference (Advanced)
```js
// best (me - opponent) for the player to move on nums[i..j]
diff(i, j) = i === j ? nums[i] : max(nums[i] - diff(i+1, j), nums[j] - diff(i, j-1))
```

### I. Mutual recursion / recursive descent (Advanced)
One function per grammar rule; each rule calls the rules it contains. Keep a **shared index**
(closure variable) so all functions advance through the same input.
```js
function parse(s) {
  let i = 0;
  function expr()   { let v = term();   while (s[i] === '+') { i++; v += term(); }   return v; }
  function term()   { let v = factor(); while (s[i] === '*') { i++; v *= factor(); } return v; }
  function factor() { if (s[i] === '(') { i++; const v = expr(); i++; return v; } return readNumber(); }
  return expr();
}
```

### J. Helper with accumulator (Essential)
Hide extra parameters (index, running total, output array) in an inner helper so the public
API stays clean, and avoid concatenating arrays on the way up.

### K. Generate all structures (Advanced) — split, recurse on both sides, cross product
Different Ways to Add Parentheses, Unique BSTs II, All Possible Full Binary Trees.

### L. Trampoline for very deep tail recursion (Advanced)
```js
const trampoline = (fn) => (...args) => { let r = fn(...args); while (typeof r === 'function') r = r(); return r; };
const sumTo = trampoline(function step(n, acc = 0) { return n === 0 ? acc : () => step(n - 1, acc + n); });
```

---

## 14. Recognition clues

**Use recursion when:**
- The input is recursive: trees, linked lists, nested lists/brackets, JSON, file systems.
- The problem statement defines something in terms of itself ("row n is built from row n-1",
  "an expression is a number or (expression op expression)").
- You must **generate all** structures/arrangements (all trees, all parenthesizations).
- Optimal play / "best result" where each choice leaves a smaller instance (then add memo).
- A divide-and-conquer split gives independent halves (merge sort, fast power, rangeMax).

**Recursion is NOT the best tool when:**
- A simple loop does it (sum, max, linear scan) and n can be large (stack overflow risk).
- Depth can reach 10^5+ (long linked lists, skewed trees) → iterative or explicit stack.
- There are overlapping subproblems and you did not memoize → exponential time.
- You need to explore choices and **undo** them → that is backtracking ([13_Backtracking](../../13_Backtracking/README.md)),
  a special case of recursion with its own template.
- The state is huge and tabulation with rolling arrays saves memory → bottom-up DP.

---

## 15. Interview application

**Talk track** (say this out loud):
1. "Let me define the function: `f(...)` returns ... ." (the promise)
2. "Base cases: when ..., the answer is ... ."
3. "Recursive case: I trust `f` on the smaller input ... and combine by ... ."
4. "The recursion tree has ... nodes with O(...) work each, depth ..., so time ..., space ... ."
5. "I see repeated states ..., so I will memoize on (...)." (if relevant)
6. "Depth could reach n = ...; if that is a concern I can convert to iteration by ... ."

**Clarify before coding:**
- Input size → is recursion depth safe? (≈ 10^4 frames in Node by default)
- Are values large → BigInt / modulus?
- May I mutate the input (linked list relinking, in-place reversal)?
- For "return all": does order matter, are duplicates kept?

**Interviewers love to ask:** "What is the space complexity?" (do not forget the call stack),
"Can you do it iteratively?", "What if the input is 10^6 long?", "Why is this exponential?".

---

## 16. Problems in this topic

| # | Problem | Difficulty | Pattern |
|---|---|---|---|
| 01 | [Fibonacci Number with Memoization](../03_Problems/01_Easy/01_fibonacci_memo.md) | Easy | multiple recursion + memo |
| 02 | [Power of Three / Power of Four](../03_Problems/01_Easy/02_power_of_three_four.md) | Easy | shrink by a factor |
| 03 | [Reverse Linked List (recursive)](../03_Problems/01_Easy/03_reverse_linked_list.md) | Easy | linked list recursion |
| 04 | [Merge Two Sorted Lists (recursive)](../03_Problems/01_Easy/04_merge_two_sorted_lists.md) | Easy | linked list recursion |
| 05 | [Pascal's Triangle II](../03_Problems/01_Easy/05_pascals_triangle_ii.md) | Easy | recursion on previous row |
| 06 | [Swap Nodes in Pairs](../03_Problems/02_Medium/06_swap_nodes_in_pairs.md) | Medium | linked list, step of 2 |
| 07 | [K-th Symbol in Grammar](../03_Problems/02_Medium/07_kth_symbol_in_grammar.md) | Medium | recurse on the parent |
| 08 | [Count Good Numbers](../03_Problems/02_Medium/08_count_good_numbers.md) | Medium | fast power |
| 09 | [Decode String (recursive)](../03_Problems/02_Medium/09_decode_string_recursive.md) | Medium | recursive descent |
| 10 | [Different Ways to Add Parentheses](../03_Problems/02_Medium/10_different_ways_to_add_parentheses.md) | Medium | divide and conquer + memo |
| 11 | [Unique Binary Search Trees II](../03_Problems/02_Medium/11_unique_binary_search_trees_ii.md) | Medium | generate structures |
| 12 | [Strobogrammatic Number II](../03_Problems/02_Medium/12_strobogrammatic_number_ii.md) | Medium | build inside out |
| 13 | [Predict the Winner](../03_Problems/02_Medium/13_predict_the_winner.md) | Medium | minimax + memo |
| 14 | [Mini Lisp Evaluator](../03_Problems/03_Hard/14_mini_lisp_evaluator.md) | Hard | mutual recursion + scopes |

### Practice more (well-known LeetCode titles)

- Climbing Stairs (#70), Pow(x, n) (#50), Power of Two (#231)
- Reverse Linked List II (#92), Reverse Nodes in k-Group (#25), Palindrome Linked List (#234)
- Maximum Depth of Binary Tree (#104), Invert Binary Tree (#226), Same Tree (#100)
- Elimination Game (#390), Find the Winner of the Circular Game (#1823)
- Flatten Nested List Iterator (#341), Nested List Weight Sum (#339), Mini Parser (#385)
- All Possible Full Binary Trees (#894), Unique Binary Search Trees (#96)
- Parse Lisp Expression (#736), Basic Calculator (#224), Number of Atoms (#726)
- Stone Game (#877), Can I Win (#464), Strobogrammatic Number III (#248)
