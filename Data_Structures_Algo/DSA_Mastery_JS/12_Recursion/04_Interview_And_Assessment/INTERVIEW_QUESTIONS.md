# Recursion — Interview Questions

Answer each question out loud first (aim for 1–2 minutes), then open the model answer.
Back to the [topic README](../README.md) · [Concepts](../01_Concepts/CONCEPTS.md)

### 1. What are the three things every recursive function needs?
<details><summary>Model answer</summary>

A clear **promise** (what the function returns for its parameters), one or more **base cases**
answered directly, and a **recursive step** that calls itself on a *strictly smaller* input and
combines the result. If the input does not shrink toward a base case, the recursion never ends.
</details>

### 2. What is the "leap of faith" and why does it work?
<details><summary>Model answer</summary>

When writing the recursive step you assume the call on the smaller input already returns the
correct answer, instead of tracing it. This is mathematical induction: if the base cases are
right and each step is right *given* correct smaller answers, every input is correct. It keeps
you from drowning in call-by-call tracing.
</details>

### 3. How do you find the time and space complexity of a recursive function?
<details><summary>Model answer</summary>

Draw the recursion tree. Time = number of nodes × work per node (or use the master theorem for
T(n) = aT(n/b) + f(n)). Space = maximum depth × frame size, plus any memo or output. Example: naive
Fibonacci has ~1.6^n nodes (time) but depth n (space O(n)).
</details>

### 4. Why does `pow(x, n/2) * pow(x, n/2)` not give O(log n)?
<details><summary>Model answer</summary>

It makes two calls per level, so the tree doubles at each of log n levels: 2^(log n) = n calls,
O(n) time. Compute `half = pow(x, n/2)` once and use `half * half`: one call per level, O(log n).
</details>

### 5. When does memoization help, and how is it related to dynamic programming?
<details><summary>Model answer</summary>

It helps when the recursion tree has **overlapping subproblems**: the same arguments are asked
for many times. Caching each result makes every distinct state cost one computation, so the time
becomes (number of states) × (work per state). Memoized recursion IS top-down DP; filling a table
in dependency order is bottom-up DP.
</details>

### 6. What is the space complexity of recursively reversing a linked list? Can you improve it?
<details><summary>Model answer</summary>

O(n) for the call stack (one frame per node), even though no data structure is allocated. The
iterative three-pointer version (prev, cur, next) uses O(1) extra space. For lists longer than
~10^4 nodes the recursive version can also overflow Node's stack.
</details>

### 7. JavaScript and tail calls: is `return helper(i + 1, acc + x)` safe for n = 10^6?
<details><summary>Model answer</summary>

No. Tail-call optimisation is in the spec but only Safari's engine implements it; V8 (Node,
Chrome) does not, so each call still adds a frame and you get `RangeError: Maximum call stack size exceeded`.
Convert to a loop (a tail call is just a loop in disguise) or use a trampoline that returns thunks.
</details>

### 8. What is mutual recursion? Give a real use.
<details><summary>Model answer</summary>

Two or more functions that call each other, e.g. `isEven(n) -> isOdd(n-1) -> isEven(n-2)`.
Real use: recursive-descent parsers, with one function per grammar rule (`expr` calls `term`,
`term` calls `factor`, `factor` calls `expr` for parentheses). They share one index into the input.
</details>

### 9. Why use a helper function with extra parameters instead of slicing arrays?
<details><summary>Model answer</summary>

`arr.slice(1)` copies the array every call, turning an O(n) recursion into O(n^2) time and memory.
A helper that carries an index (and maybe an accumulator or shared output array) keeps each call
O(1) and the public signature clean.
</details>

### 10. When generating all structures (e.g. all BSTs), why must the empty case return `[null]` instead of `[]`?
<details><summary>Model answer</summary>

The results are built with nested loops over left and right options. `[null]` means "exactly one
way: the empty tree", so a root with no left child still pairs with every right option. `[]` means
"zero ways", which makes the cross product empty and loses every tree with an empty side.
</details>

### 11. How would you explain the minimax recursion in Predict the Winner?
<details><summary>Model answer</summary>

Define diff(i, j) = the best (my score − opponent's score) the player to move can force on
nums[i..j]. Taking nums[i] leaves the opponent to move on [i+1, j], and their best advantage counts
against me: nums[i] − diff(i+1, j). Take the max of the two ends. Memoize on (i, j): O(n^2).
</details>

### 12. Recursion vs iteration: how do you decide in an interview?
<details><summary>Model answer</summary>

Prefer recursion when the data or definition is recursive (trees, nested input, generate-all),
because correctness is easier to argue. Prefer iteration when a simple loop works, when depth can
be very large, or when you need O(1) extra space. Mention the trade-off explicitly and offer the
other version as a follow-up.
</details>

### 13. How does divide and conquer differ from plain "first + rest" recursion?
<details><summary>Model answer</summary>

First + rest shrinks by one element: depth O(n). Divide and conquer splits into parts of a
constant fraction (halves): depth O(log n), and with independent subproblems (merge sort, rangeMax)
the work can be balanced. That also makes deep inputs safe for the call stack.
</details>

### 14. How do you protect against stack overflow if the input might be deep?
<details><summary>Model answer</summary>

Options: rewrite with an explicit stack (DFS, tree traversal), rewrite tail recursion as a loop,
use a trampoline, restructure to halve the input (depth log n), or process iteratively bottom-up
(DP tables). In Node you can also raise `--stack-size`, but that is not acceptable in an interview
answer on its own.
</details>
