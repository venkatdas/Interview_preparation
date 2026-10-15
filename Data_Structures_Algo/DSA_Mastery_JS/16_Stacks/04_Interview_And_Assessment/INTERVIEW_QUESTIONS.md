# Stacks — Interview Questions

Answer out loud first, then open the model answer. Back to the [topic README](../README.md) · [Concepts](../01_Concepts/CONCEPTS.md) · [Quiz](QUIZ.md)

---

### 1. What is a stack and what are its core operations' costs?

<details><summary>Model answer</summary>

A LIFO collection: the last item pushed is the first popped. `push`, `pop`, `peek`, `isEmpty`, `size` are all O(1). In JavaScript an array with `push`/`pop` is a perfectly good stack because both work at the end (amortized O(1)).

</details>

### 2. Why should you not use `shift`/`unshift` for a stack in JS?

<details><summary>Model answer</summary>

They work at the front of the array and must re-index every element: O(n) each. `push`/`pop` at the end are O(1). Keep the top of the stack at the end of the array.

</details>

### 3. What signals in a problem suggest a stack?

<details><summary>Model answer</summary>

Matching open/close pairs, "most recent unmatched", undo/back, nested structures (expressions, paths, encoded strings), reversing, simulating recursion/DFS, and "next/previous greater or smaller element" (monotonic stack).

</details>

### 4. How does a Min Stack return the minimum in O(1)?

<details><summary>Model answer</summary>

Keep a second stack of minimums (or store `[value, minSoFar]` pairs). On push, also push the new minimum (or push to the min stack when `value <= currentMin`, using `<=` so duplicates of the min are counted). On pop, pop the min stack when the popped value equals the current min. All O(1).

</details>

### 5. Explain the monotonic stack idea for "next greater element".

<details><summary>Model answer</summary>

Scan left to right and keep indices whose next greater element is not yet known, with values decreasing from bottom to top. When a new value is bigger than the top, it is the answer for the top: pop and record, repeat. Each index is pushed once and popped once, so O(n) total even though there is a nested loop.

</details>

### 6. How do you implement a queue with two stacks, and what is the amortized cost?

<details><summary>Model answer</summary>

`in` stack receives pushes. For pop/peek, if `out` is empty, move everything from `in` to `out` (reversing order), then pop from `out`. Each element moves at most once between stacks, so each operation is amortized O(1), worst case O(n) for a single transfer.

</details>

### 7. How would you evaluate an expression like `3 + 2 * 2` without `eval`?

<details><summary>Model answer</summary>

For + - * / without parentheses: scan, building the current number; when an operator or end arrives, apply the *previous* operator: `+` push num, `-` push -num, `*` / `/` pop, combine, push (truncate division toward zero). The answer is the sum of the stack. For parentheses, push the current result and sign when you see `(` and combine on `)`, or recurse.

</details>

### 8. Valid Parentheses: what are the failure cases?

<details><summary>Model answer</summary>

A closer when the stack is empty, a closer that does not match the top's type, and openers left on the stack at the end. An odd length is an early `false`.

</details>

### 9. How does a stack relate to recursion?

<details><summary>Model answer</summary>

Each recursive call pushes a frame onto the call stack; returning pops it. Any recursion can be converted to a loop with an explicit stack that stores what the frame needed (node, state). This avoids stack overflow on deep inputs (JS has roughly a 10k-frame limit).

</details>

### 10. Largest rectangle in a histogram: what does the stack hold and why is it O(n)?

<details><summary>Model answer</summary>

Indices of bars in increasing height. When a lower bar arrives, the taller bars on top can't extend further right, so pop each, and its width runs from the new top + 1 to the current index − 1. Each bar is pushed and popped once: O(n). A sentinel height 0 at the end flushes the stack.

</details>

### 11. Array-based vs linked-list-based stack — trade-offs?

<details><summary>Model answer</summary>

Array: contiguous, cache-friendly, amortized O(1) push with occasional resizing. Linked list: guaranteed O(1) push without resizing but extra pointer per item and worse locality. In JS the array is the default; the linked version is mostly a learning exercise.

</details>

### 12. In Remove K Digits, why is a greedy monotonic stack correct?

<details><summary>Model answer</summary>

A smaller digit earlier makes the number smaller more than anything later can. So while the previous digit is larger than the current one and removals remain, removing the previous digit is always better. If removals are left at the end, drop from the tail (the remaining digits are non-decreasing). Strip leading zeros and return "0" if empty.

</details>

### 13. What should you clarify before a stack-based parsing problem?

<details><summary>Model answer</summary>

Allowed characters (spaces, multi-digit numbers, negative numbers, unary minus), whether input is always valid, integer division rules (truncate toward zero), nesting depth, and output format.

</details>
