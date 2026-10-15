# Recursion Fundamentals — Interview Questions

Answer out loud first, then open the model answer. Back to the [topic README](../README.md).

**1. What are the parts of a correct recursive function?**
<details><summary>Model answer</summary>

A clear statement of what it returns, one or more base cases answered directly, a recursive step that moves strictly toward a base case, and a combine step that builds the answer from the smaller results. Every possible input must reach a base case.
</details>

**2. What happens on the call stack when a function calls itself?**
<details><summary>Model answer</summary>

Each call pushes a new frame holding its arguments, locals and the return address. Frames are popped in reverse order as calls return. Deep recursion means many live frames; the maximum number of simultaneously live frames is the recursion depth, which is the extra space used.
</details>

**3. How deep can you recurse in Node, and what happens if you go deeper?**
<details><summary>Model answer</summary>

Roughly 10,000 frames with the default ~1 MB stack (it depends on frame size: more locals means fewer frames). Beyond that V8 throws `RangeError: Maximum call stack size exceeded`. You can measure it by recursing until the error and counting. Rule of thumb: depth above ~1e4 needs an iterative solution.
</details>

**4. Does Node optimize tail calls?**
<details><summary>Model answer</summary>

No. Proper tail calls are in the ES2015 spec, but V8 does not implement them (only Safari's engine does). A tail-recursive function still uses one frame per call in Node and overflows the same way. Use a loop, an explicit stack, or a trampoline.
</details>

**5. How do you convert any recursive function to an iterative one?**
<details><summary>Model answer</summary>

Simulate the call stack with an array. If no work happens after the recursive calls (or order doesn't matter), push subproblems and pop them in a loop. If work happens between or after calls, push frames that store the arguments plus a stage (where to resume), peek the top frame, advance its stage, and pop it when done.
</details>

**6. What is a trampoline and when would you use one?**
<details><summary>Model answer</summary>

A driver loop that repeatedly calls the thunk returned by a function until a non-function value comes back. The function returns "the next call" instead of making it, so the stack never grows. It works for tail-recursive code, at the cost of allocating a closure per step.
</details>

**7. How do you analyze the time and space of a recursive function?**
<details><summary>Model answer</summary>

Draw the recursion tree. Time = number of nodes × work per node. Space = tree height × frame size, plus any data structures allocated. For example, naive fib has ~φ^n nodes and height n: O(φ^n) time, O(n) space.
</details>

**8. Why can `f(arr.slice(1))` be a performance bug?**
<details><summary>Model answer</summary>

`slice` copies the rest of the array on every call, so a linear recursion does n + (n-1) + ... = O(n²) work and allocation. Passing an index (`f(arr, i + 1)`) keeps it O(n).
</details>

**9. When does memoization help a recursion, and when does it not?**
<details><summary>Model answer</summary>

It helps when the same arguments are reached many times (overlapping subproblems), e.g. fib, grid paths. It does not help when every call has unique arguments (e.g. generating all permutations, merge sort), because nothing repeats.
</details>

**10. What is the "leap of faith"?**
<details><summary>Model answer</summary>

When writing the recursive step, assume the recursive call already returns the correct answer for the smaller input, and only reason about how to use it. This is induction: base case proven, step proven, so it is correct for all sizes.
</details>

**11. Recursion vs iteration: which do you choose in an interview?**
<details><summary>Model answer</summary>

Recursion when the structure is recursive (trees, nested data, backtracking) and depth is safe; it is shorter and clearer. Iteration when depth can be large (1e5), when a simple loop suffices, or when the interviewer asks for O(1) extra space. Mention the trade-off out loud.
</details>

**12. Why does `fastPow` call itself once and reuse the result instead of calling twice?**
<details><summary>Model answer</summary>

`pow(x, n/2) * pow(x, n/2)` makes two calls per level: 2^(log n) = n calls, back to linear time. Storing `half = pow(x, n/2)` and squaring it keeps one call per level: O(log n).
</details>

**13. In backtracking recursion, why do you copy the path when storing it, and undo changes after the call?**
<details><summary>Model answer</summary>

The path is one shared array mutated as the search goes deeper; storing it stores a reference that keeps changing, so you store a copy. Undoing (pop) after the call restores the state the parent expects, so sibling branches start clean.
</details>
