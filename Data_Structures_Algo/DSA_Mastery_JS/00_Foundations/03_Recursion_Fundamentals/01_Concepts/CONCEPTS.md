# Recursion Fundamentals

**Recursion** means a function solves a problem by calling itself on a **smaller version of the same problem**,
until the problem is so small that the answer is obvious (the **base case**).
It is the engine behind trees, graphs (DFS), divide and conquer, backtracking and dynamic programming,
so getting comfortable with it now pays off in almost every later topic.

---

## 1. Prerequisites (Essential)

- [JavaScript for DSA](../../01_JavaScript_For_DSA/README.md): section 8 there introduces the call stack limit in one paragraph; this guide goes deep.
- [Programming Fundamentals](../../02_Programming_Fundamentals/README.md): references, copying (`[...path]`) and closures (memo).
- Helpful: [Mathematics for DSA](../../04_Mathematics_For_DSA/README.md) (powers, digits, modulo).

---

## 2. Intuition (Essential)

To solve a problem recursively you only need to answer three questions:

1. **What is the smallest input I can answer directly?** (base case)
2. **How do I make the input smaller?** (the recursive call must move toward the base case)
3. **If I magically had the answer for the smaller input, how do I build my answer?** (combine step)

The "magic" in step 3 is called the **leap of faith**: you trust the recursive call to be correct (exactly like you trust `Math.max` to be correct) and only reason about one level.
Induction in maths is the same idea; see [Proof of Correctness](../../../02_Problem_Solving_Fundamentals/05_Proof_Of_Correctness/README.md).

---

## 3. Mental model / analogy + visuals (Essential)

**Russian dolls.** To count the dolls, open the outer one and ask "how many dolls are inside this smaller doll?" plus one. The smallest doll (nothing inside) is the base case.

**The call stack.** Every call gets a **frame** (its own parameters and local variables). Frames are pushed when a call starts and popped when it returns.

```
factorial(3)
  = 3 * factorial(2)
        = 2 * factorial(1)
              = 1            <- base case, start returning

call stack over time (top on the right):

push f(3)      [f(3)]
push f(2)      [f(3), f(2)]
push f(1)      [f(3), f(2), f(1)]
f(1) returns 1 [f(3), f(2)]          f(2) computes 2 * 1 = 2
f(2) returns 2 [f(3)]                f(3) computes 3 * 2 = 6
f(3) returns 6 []
```

**The recursion tree.** When a function calls itself more than once, the calls form a tree. Its size is the running time.

```
fib(4)
├── fib(3)
│   ├── fib(2)
│   │   ├── fib(1) = 1
│   │   └── fib(0) = 0
│   └── fib(1) = 1
└── fib(2)              <- computed AGAIN: memoization removes this repeat
    ├── fib(1) = 1
    └── fib(0) = 0

9 calls for n = 4; about 1.6^n calls in general. The tree's HEIGHT (n) is the stack depth.
```

Two numbers matter: **number of nodes** in the tree = time; **height** of the tree = maximum stack depth = extra space.

---

## 4. Why it exists (what problem it solves) (Essential)

Some problems are **self-similar**: a tree is a node plus smaller trees, a nested array is a list of values and smaller nested arrays,
"all subsets of n items" is "subsets without item n" plus "subsets with item n". For these, a loop needs you to manage a stack of "where was I"
by hand. Recursion lets the language keep that stack for you, so the code mirrors the definition of the problem.

---

## 5. How it works, step by step

### 5.1 Writing a recursive function (Essential)

```
1. Write the signature and say in words what it RETURNS for any valid input.
2. Handle the base case(s) first: return directly.
3. Make the problem smaller (n - 1, n / 2, rest of the array, a child node).
4. Call yourself on the smaller problem(s) and TRUST the result.
5. Combine and return.
6. Check: does every path reach a base case? What is the depth? How many calls?
```

### 5.2 Kinds of recursion (Essential)

| Kind | Shape | Example | Calls (time) | Depth (space) |
|---|---|---|---|---|
| Linear | one call per level | factorial, sum of array | O(n) | O(n) |
| Halving | one call on half | fast power, binary search | O(log n) | O(log n) |
| Binary / tree | two calls per level | naive fib, all subsets | O(2^n) | O(n) |
| Divide and conquer | two calls on halves | merge sort | O(n log n) with O(n) merge | O(log n) |
| Multiple / backtracking | k calls per level | permutations | O(n!) | O(n) |

### 5.3 Head vs tail recursion (Advanced)

- **Head / non-tail recursion:** work happens *after* the recursive call returns (`return n * f(n - 1)`). The frame must stay alive to do the multiply.
- **Tail recursion:** the recursive call is the very last thing (`return f(n - 1, acc * n)`). In theory the engine can reuse the frame (**tail call optimization, TCO**).

**JavaScript reality:** ES2015 specifies proper tail calls, but **V8 (Node, Chrome) does not implement them**. A tail-recursive function in Node uses one frame per call and overflows exactly like the non-tail version. `02_Implementations/stack_depth.js` proves this with an assertion. Only Safari's JavaScriptCore implements it.

### 5.4 The stack depth limit in Node (Essential)

Each frame uses stack memory; Node's default stack is about 1 MB (V8's `--stack-size` in KB, ~984 by default).
That gives roughly **10,000 frames** for a small function (the exact number depends on how many locals and arguments each frame holds).
Exceeding it throws `RangeError: Maximum call stack size exceeded`.

Measure it yourself:

```js
function measureMaxDepth() {
  let depth = 0;
  function dive() { depth++; dive(); }
  try { dive(); } catch (e) { if (!(e instanceof RangeError)) throw e; }
  return depth;
}
```

Run `node 02_Implementations/stack_depth.js` to see your machine's number. Rule of thumb for interviews: **recursion depth up to ~1e4 is fine, 1e5 or more needs iteration** (e.g. DFS on a 1e5-node path graph, a linked list of 1e5 nodes, a 300 × 300 grid flood fill).

### 5.5 Converting recursion to iteration with an explicit stack (Essential)

Any recursion can be simulated with your own array as the stack, because that is all the engine is doing.

- **Easy case (no work after the call, or order does not matter):** push the start, `while (stack.length)` pop, process, push the smaller subproblems. Used for DFS, flood fill, deep sums.
- **General case (work after the call):** push *frames* that remember where you were: `{ args, stage }`. Stage 0 = "just entered", stage 1 = "first child returned", and so on. This is exactly what the engine stores (the return address).

```js
// recursive: postorder sum of a tree
function sum(node) { if (!node) return 0; return node.val + sum(node.left) + sum(node.right); }

// iterative with explicit stack (order of additions does not matter here)
function sumIter(root) {
  let total = 0; const stack = root ? [root] : [];
  while (stack.length) {
    const node = stack.pop();
    total += node.val;
    if (node.right) stack.push(node.right);
    if (node.left) stack.push(node.left);
  }
  return total;
}
```

### 5.6 Trampolines (Advanced)

A **trampoline** turns a tail-recursive function into a loop without rewriting its logic: instead of calling itself, the function **returns a thunk** (a zero-argument function that will make the next call). A driver loop keeps calling thunks until a non-function value appears.

```js
function trampoline(fn) {
  return (...args) => {
    let result = fn(...args);
    while (typeof result === 'function') result = result();
    return result;
  };
}
const sumTo = trampoline(function go(n, acc = 0) {
  return n === 0 ? acc : () => go(n - 1, acc + n);   // return the NEXT step, don't take it
});
sumTo(1e6); // fine: stack depth stays 1
```

Trade-off: it allocates one closure per step (slower), and it only works for tail calls. For non-tail recursion, use an explicit stack.

### 5.7 Memoization (Essential)

When the recursion tree has repeated subtrees (same arguments reached many times), cache results by arguments. This turns naive fib from O(1.6^n) to O(n). It is the doorway to [Dynamic Programming](../../../29_Dynamic_Programming/01_Concepts/OVERVIEW.md).

---

## 6. Pseudocode

```
solve(problem):
  if problem is small enough:          // base case
    return direct answer
  parts = split problem into smaller problems
  results = [solve(p) for p in parts]  // leap of faith
  return combine(results)

iterative version:
  stack = [initial frame]
  while stack not empty:
    frame = pop
    if frame is base case: record answer
    else: push frames for the smaller problems (reverse order if output order matters)
```

---

## 7. JavaScript implementation

- [`02_Implementations/recursion_basics.js`](../02_Implementations/recursion_basics.js): factorial, sum of an array, a call tracer that prints the call stack with indentation, a recursion-tree builder that counts calls and depth, and memoized fib.
- [`02_Implementations/stack_depth.js`](../02_Implementations/stack_depth.js): `measureMaxDepth`, proof that tail calls are not optimized in V8, explicit-stack conversions (linear and general frame-based), and `trampoline`.

---

## 8. Dry run on a concrete example

`sumDigits(4096)` where `sumDigits(n) = n < 10 ? n : (n % 10) + sumDigits(Math.floor(n / 10))`:

| Call | n | n % 10 | recursive call | returns |
|---|---|---|---|---|
| 1 | 4096 | 6 | sumDigits(409) | 6 + 13 = **19** |
| 2 | 409 | 9 | sumDigits(40) | 9 + 4 = 13 |
| 3 | 40 | 0 | sumDigits(4) | 0 + 4 = 4 |
| 4 | 4 | — | base case | 4 |

Depth = number of digits = 4. Calls = 4. Time O(d), space O(d) for the stack.

---

## 9. Edge cases

- **Missing or unreachable base case**: `f(n) = f(n - 2)` with odd n skips `n === 0` and runs forever (until RangeError). Use `n <= 0`.
- **Negative or zero input**: decide what `f(0)` and `f(-1)` mean before writing the recursion.
- **Deep input**: 1e5 levels → convert to iteration.
- **Shared mutable state**: a `path` array mutated across calls must be copied when stored, and undone after the call (backtracking).
- **Slicing in every call** (`f(arr.slice(1))`) silently turns O(n) into O(n²) time and space. Pass indices instead.

---

## 10. Complexity analysis

| Recursion | Time | Space (stack) | Why |
|---|---|---|---|
| factorial / sum of array (indices) | O(n) | O(n) | n frames, O(1) work each |
| sum of array with `slice(1)` | O(n²) | O(n²) total allocation | each level copies the rest |
| fast power (halving) | O(log n) | O(log n) | exponent halves |
| naive fib | O(φ^n) ≈ O(1.6^n) | O(n) | tree of calls, height n |
| memoized fib | O(n) | O(n) | each n computed once |
| all subsets / binary strings | O(2^n · n) | O(n) | 2^n leaves, copy of length n at each |
| explicit stack version | same as recursive | same, but on the heap | no RangeError |
| trampoline | same | O(1) stack, one thunk per step | thunks are heap objects |

General rule: **time = (number of calls) × (work per call)**, **space = (max depth) × (frame size) + extra allocations**.
For a full treatment of recurrences (master theorem) see [Big O, Omega, Theta](../../../01_Complexity_Analysis/03_Big_O_Omega_Theta/README.md).

---

## 11. Alternatives (trade-offs)

| Approach | Pros | Cons |
|---|---|---|
| Plain recursion | shortest, mirrors the definition | stack limit ~1e4 in Node; repeated work if subproblems overlap |
| Recursion + memo | removes repeats | still stack-limited; memo memory |
| Explicit stack | no stack limit; full control (pause, early exit) | more code; order bookkeeping |
| Bottom-up loop (DP) | fastest, no stack, often O(1) space | must know the evaluation order |
| Trampoline | keeps tail-recursive style without overflow | only tail calls; slower |

---

## 12. Common mistakes (and why they happen)

1. **No base case / wrong base case** → infinite recursion. Always write the base case first.
2. **Not moving toward the base case** (`f(n)` calls `f(n)` with the same arguments).
3. **Forgetting `return`** on the recursive call (`f(n - 1)` instead of `return f(n - 1)`), so the function returns `undefined`.
4. **Slicing arrays/strings every call** → hidden O(n²).
5. **Mutating shared state without undoing it** (backtracking bugs), or storing it without copying.
6. **Believing tail recursion is safe in Node.** It is not.
7. **Using a global counter or memo** that is not reset between test cases.
8. **Recomputing overlapping subproblems** (exponential time) when a memo would make it linear.

---

## 13. Patterns / variations with templates

**Linear (process first, recurse on rest), with an index**
```js
function sum(arr, i = 0) { if (i === arr.length) return 0; return arr[i] + sum(arr, i + 1); }
```

**Two pointers recursion (shrink from both ends)**
```js
function isPal(s, lo = 0, hi = s.length - 1) { if (lo >= hi) return true; return s[lo] === s[hi] && isPal(s, lo + 1, hi - 1); }
```

**Halving**
```js
function pow(x, n) { if (n === 0) return 1; const h = pow(x, n >> 1); return n % 2 ? h * h * x : h * h; }
```

**Choose / don't choose (generate)**
```js
function gen(n, path = [], out = []) { if (path.length === n) { out.push(path.join('')); return out; }
  for (const c of '01') { path.push(c); gen(n, path, out); path.pop(); } return out; }
```

**Recursion on nested structure**
```js
function deepSum(x) { return Array.isArray(x) ? x.reduce((s, y) => s + deepSum(y), 0) : x; }
```

**Memoized recursion**
```js
function countPaths(r, c, memo = new Map()) { if (r === 0 || c === 0) return 1; const k = r + ',' + c;
  if (!memo.has(k)) memo.set(k, countPaths(r - 1, c, memo) + countPaths(r, c - 1, memo)); return memo.get(k); }
```

---

## 14. Recognition clues

**Use recursion when:**
- the input is recursive: trees, nested arrays/objects, expressions, file systems;
- the problem says "all combinations / permutations / subsets / paths" (→ [Backtracking](../../../13_Backtracking/README.md));
- the answer for n is naturally defined from answers for smaller n (→ memo / DP);
- divide and conquer: split in halves, solve, merge (→ [Divide and Conquer](../../../30_Divide_And_Conquer/README.md)).

**Do NOT use (plain) recursion when:**
- depth can reach 1e5 or more (long linked lists, path-shaped graphs, big grids) → explicit stack or loop;
- a simple loop is clearer (summing an array);
- subproblems overlap heavily and you have no memo → exponential time.

---

## 15. Interview application

**Talk track:**
- "My function returns X for the subarray starting at i. Base case: i equals n, return 0."
- "I trust the recursive call for i + 1, then add arr[i]."
- "Time is calls × work = O(n). Space is the stack depth, O(n). With n up to 1e5 that could overflow in Node, so I can convert to an explicit stack if you'd like."
- "These subproblems repeat (same (r, c) reached from two directions), so I'll memoize."

**What to clarify:** maximum input size (stack depth!), whether nesting can be deep, whether mutation of input is OK, and expected output order.

---

## 16. Problems in this topic

| # | Problem | Difficulty | Focus |
|---|---|---|---|
| 01 | [Sum of Digits](../03_Problems/01_Easy/01_sum_of_digits.md) | Easy | base case, linear recursion |
| 02 | [Recursive Palindrome](../03_Problems/01_Easy/02_recursive_palindrome.md) | Easy | indices instead of slicing |
| 03 | [Reverse an Array Recursively](../03_Problems/01_Easy/03_reverse_array_recursive.md) | Easy | two-pointer recursion, in place |
| 04 | [Modular Power](../03_Problems/02_Medium/04_modular_power.md) | Medium | halving, O(log n) depth, BigInt |
| 05 | [Count Paths in a Small Grid](../03_Problems/02_Medium/05_grid_paths.md) | Medium | recursion tree, memoization |
| 06 | [Binary Strings Without Adjacent Ones](../03_Problems/02_Medium/06_binary_strings_no_adjacent_ones.md) | Medium | generate with pruning |
| 07 | [Depth-Weighted Deep Sum](../03_Problems/02_Medium/07_depth_weighted_sum.md) | Medium | nested recursion → explicit stack |
| 08 | [Tower of Hanoi, Iteratively](../03_Problems/03_Hard/08_hanoi_explicit_stack.md) | Hard | general recursion → frame stack |

**Practice more (LeetCode):** 509 Fibonacci Number, 344 Reverse String, 206 Reverse Linked List (recursive), 50 Pow(x, n), 62 Unique Paths, 63 Unique Paths II, 339 Nested List Weight Sum, 779 K-th Symbol in Grammar, 1922 Count Good Numbers, 21 Merge Two Sorted Lists (recursive).
