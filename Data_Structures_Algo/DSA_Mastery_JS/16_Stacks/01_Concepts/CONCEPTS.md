# Stacks

> **Prerequisites:** [Arrays](../../03_Arrays/README.md) (push/pop at the end), [Linked Lists](../../15_Linked_Lists/README.md) (for the linked stack), [Strings](../../04_Strings/README.md) (parsing problems), [Time Complexity](../../01_Complexity_Analysis/01_Time_Complexity/README.md) (amortized analysis).

A **stack** is a list where you can only add or remove from **one end**, called the **top**.
Think of a stack of plates: you put a new plate on top, and you take a plate from the top.
The last plate you put on is the first one you take off. This rule is called **LIFO**
(Last In, First Out).

---

## Why it matters / when to use

Reach for a stack when the problem has any of these signals:

- "Most recent", "last opened", "undo", "go back" (browser history, editor undo)
- Matching pairs that open and close: brackets `()[]{}`, HTML tags
- You need to **reverse** something (push everything, pop everything)
- Processing something **nested**: expressions, folders, function calls (the call stack!)
- "Next greater / next smaller element", "previous smaller" → **monotonic stack**
- Converting recursion to iteration (DFS, tree traversals)

---

## How it works

```
push(1)   push(2)   push(3)     pop() -> 3     peek() -> 2

                      | 3 |                       
            | 2 |     | 2 |      | 2 |          | 2 |
  | 1 |     | 1 |     | 1 |      | 1 |          | 1 |
  -----     -----     -----      -----          -----
```

Only the top is visible. To reach `1` you must first pop `3` and `2`.

In JavaScript an **array** is already a perfect stack: `push` adds to the end, `pop` removes from the end,
both in O(1). We still write a `Stack` class in interviews to show we understand the abstraction
(and to hide operations like `shift` that are NOT allowed on a stack).

---

## Pseudocode

```
STACK with an array:
    push(x):  arr.append(x)                 # O(1) amortized
    pop():    if empty: error; return arr.removeLast()
    peek():   return arr[last] (or undefined if empty)

MATCHING BRACKETS(s):
    st = []
    for ch in s:
        if ch is an opener: st.push(ch)
        else if st is empty or st.pop() is not the partner of ch: return false
    return st is empty

MONOTONIC STACK - next greater element(nums):
    ans = [-1] * n; st = []                 # holds indices, values decreasing
    for i in 0..n-1:
        while st not empty and nums[i] > nums[st.top]:
            ans[st.pop()] = nums[i]
        st.push(i)
    return ans
```

---

## Operations & complexity

| Operation | Time | Space | Note |
|-----------|------|-------|------|
| push(x)   | O(1) | O(1)  | add to top |
| pop()     | O(1) | O(1)  | remove & return top; error/undefined if empty |
| peek()    | O(1) | O(1)  | look at top without removing |
| isEmpty() | O(1) | O(1)  | |
| size()    | O(1) | O(1)  | |
| search    | O(n) | O(1)  | stacks are not for searching |

Total space for n items: O(n).

---

## JavaScript implementation

Full code with tests: `stack.js`. Core idea:

```js
class Stack {
  #items = [];
  push(value) { this.#items.push(value); return this; }
  pop()       { return this.#items.pop(); }
  peek()      { return this.#items[this.#items.length - 1]; }
  isEmpty()   { return this.#items.length === 0; }
  size()      { return this.#items.length; }
}
```

`stack.js` also contains a **linked-list based stack** (what you'd write if arrays weren't dynamic)
and a **MinStack** (O(1) `getMin`).

---

## Dry run

**Valid parentheses on `"{[()]}"`:**

| i | ch | action | stack after |
|---|---|---|---|
| 0 | { | push | { |
| 1 | [ | push | { [ |
| 2 | ( | push | { [ ( |
| 3 | ) | pop "(" matches | { [ |
| 4 | ] | pop "[" matches | { |
| 5 | } | pop "{" matches | (empty) |
| end | | stack empty | **true** |

**Next greater element on `[2, 1, 2, 4, 3]`** (stack holds indices):

| i | nums[i] | pops (index → answer) | stack after (values) |
|---|---|---|---|
| 0 | 2 | - | [2] |
| 1 | 1 | - | [2, 1] |
| 2 | 2 | 1 → 2 | [2, 2] |
| 3 | 4 | 2 → 4, 0 → 4 | [4] |
| 4 | 3 | - | [4, 3] |

Leftovers get -1. Answer: `[4, 2, 4, -1, -1]`.

---

## Patterns / variations

### 1. Matching / balancing (push opener, pop on closer)

```js
function isBalanced(s) {
  const pairs = { ')': '(', ']': '[', '}': '{' };
  const stack = [];
  for (const ch of s) {
    if ('([{'.includes(ch)) stack.push(ch);
    else if (stack.pop() !== pairs[ch]) return false;
  }
  return stack.length === 0;
}
```
Use when: brackets, tags, "valid" string checks.

### 2. Monotonic stack (next greater / smaller element)

Keep the stack **always increasing** (or decreasing). When a new element breaks the order,
pop and *resolve* the popped elements - the new element is their answer.

```js
function nextGreater(nums) {
  const result = new Array(nums.length).fill(-1);
  const stack = []; // indices, values strictly decreasing from bottom to top
  for (let i = 0; i < nums.length; i++) {
    while (stack.length && nums[stack[stack.length - 1]] < nums[i]) {
      result[stack.pop()] = nums[i];
    }
    stack.push(i);
  }
  return result;
}
```
Use when: "next greater", "days until warmer", "largest rectangle in histogram",
"stock span", "trapping rain water". Each index is pushed & popped once → O(n).

### 3. Two stacks (one for values, one for metadata)

MinStack keeps a second stack of running minimums. Queue-via-two-stacks moves items from
`in` to `out` only when `out` is empty (amortized O(1)).

### 4. Expression evaluation

Operands on one stack, operators on another (shunting-yard), or Reverse Polish Notation
with a single stack.

### 5. Replace recursion

Any recursive DFS can become a loop with an explicit stack. Push the start, loop
`while (stack.length)`, pop, process, push children.

---

## Alternatives (brute force vs optimized)

| Problem shape | Brute force | Stack-based | Note |
|---|---|---|---|
| Matching brackets | Repeatedly delete `()`, `[]`, `{}` pairs: O(n²) | One pass with a stack: O(n) | |
| Next greater element | For each i scan right: O(n²) | Monotonic stack: O(n) | |
| Min in a stack | Scan the stack on each `getMin`: O(n) | Extra min stack: O(1) | Costs O(n) extra memory |
| Expression evaluation | `eval` (unsafe, not allowed) or recursive descent | Operand/operator stacks | Recursive descent is a fine alternative for parentheses |
| Trapping rain water | For each bar find max left/right: O(n²) | Monotonic stack O(n), or two pointers O(n) with O(1) space | Two pointers is often simpler |
| Deep recursion | Recursive function | Explicit stack loop | Avoids JS stack overflow |

---

## Common mistakes & edge cases

- Calling `pop()` on an empty stack. Always check `isEmpty()` or `stack.length` first.
- Forgetting the final check: after the loop, a balanced-brackets stack must be **empty**.
- Using `shift()`/`unshift()` - those are O(n) and are queue operations, not stack ones.
- Monotonic stack: decide **strict** (`<`) vs **non-strict** (`<=`) comparison carefully;
  duplicates change the answer.
- Storing **indices** instead of values in a monotonic stack when you need distances/widths.

---

## When this does NOT apply

- **First-in-first-out order** (BFS, task processing in arrival order): use a queue.
- **You need the min/max of a sliding window** where items leave from the front: use a monotonic **deque**, not a stack.
- **Random access to the middle** of the collection: use an array or a balanced structure.
- **"Next greater" with arbitrary deletions or updates**: a stack only works for a single left-to-right (or right-to-left) sweep; use a segment tree or ordered set.
- **Priority order** (always take the smallest/largest): use a heap.

---

## Interview tips

- Say "LIFO" and give the plate analogy in one sentence, then move on.
- When you see nested/matching/"most recent" wording, say: "This looks like a stack problem."
- For monotonic stack problems, state the invariant out loud: "My stack stays decreasing,
  so when I see something bigger, everything smaller on top is resolved."
- Always mention that each element is pushed and popped at most once → amortized O(n).

---

## Problems in this folder

| # | Problem | Difficulty | Pattern | File |
|---|---------|------------|---------|------|
| 01 | Valid Parentheses | Easy | matching | 03_Problems/solutions/01_valid_parentheses.js |
| 02 | Min Stack | Medium | two stacks | 03_Problems/solutions/02_min_stack.js |
| 03 | Implement Queue using Stacks | Easy | two stacks | 03_Problems/solutions/03_queue_using_stacks.js |
| 04 | Evaluate Reverse Polish Notation | Medium | expression eval | 03_Problems/solutions/04_evaluate_rpn.js |
| 05 | Daily Temperatures | Medium | monotonic stack | 03_Problems/solutions/05_daily_temperatures.js |
| 06 | Next Greater Element I & II | Easy/Medium | monotonic stack (circular) | 03_Problems/solutions/06_next_greater_element.js |
| 07 | Simplify Path | Medium | stack of segments | 03_Problems/solutions/07_simplify_path.js |
| 08 | Decode String | Medium | nested stack | 03_Problems/solutions/08_decode_string.js |
| 09 | Remove K Digits | Medium | monotonic stack (greedy) | 03_Problems/solutions/09_remove_k_digits.js |
| 10 | Asteroid Collision | Medium | simulation | 03_Problems/solutions/10_asteroid_collision.js |
| 11 | Basic Calculator II | Medium | expression eval | 03_Problems/solutions/11_basic_calculator.js |
| 12 | Largest Rectangle in Histogram | Hard | monotonic stack | 03_Problems/solutions/12_largest_rectangle_histogram.js |
| 13 | Trapping Rain Water (stack version) | Hard | monotonic stack | 03_Problems/solutions/13_trapping_rain_water.js |

---

## Practice more

Easy: Baseball Game (682), Backspace String Compare (844), Remove All Adjacent Duplicates (1047),
Make The String Great (1544)

Medium: Online Stock Span (901), Car Fleet (853), Validate Stack Sequences (946),
Exclusive Time of Functions (636), 132 Pattern (456), Sum of Subarray Minimums (907),
Generate Parentheses (22), Minimum Remove to Make Valid Parentheses (1249)

Hard: Basic Calculator (224), Maximal Rectangle (85), Longest Valid Parentheses (32)
