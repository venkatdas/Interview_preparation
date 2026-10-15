# Stacks — Quiz

Try first, then open the answer. Re-read [CONCEPTS.md](../01_Concepts/CONCEPTS.md) for anything you missed. See also: [Interview questions](INTERVIEW_QUESTIONS.md).

---

**1. (Predict the output)**

```js
const s = [];
s.push(1); s.push(2); s.pop(); s.push(3); s.push(4); s.pop();
console.log(s, s[s.length - 1]);
```

<details><summary>Answer</summary>`[ 1, 3 ] 3`.</details>

**2. (Multiple choice)** Which is NOT a natural stack problem?
A) Valid parentheses  B) Undo in an editor  C) Serving customers in arrival order  D) Next greater element

<details><summary>Answer</summary>C — arrival order is FIFO, a queue.</details>

**3. (Complexity)** Monotonic stack next-greater-element over n numbers: total time?

<details><summary>Answer</summary>O(n). Each index is pushed once and popped at most once.</details>

**4. (Spot the bug)**

```js
function isValid(s) {
  const st = [], pair = { ')': '(', ']': '[', '}': '{' };
  for (const c of s) {
    if (c in pair) { if (st.pop() !== pair[c]) return false; }
    else st.push(c);
  }
  return true;
}
```

<details><summary>Answer</summary>It returns `true` for `"(("` because it never checks the stack is empty at the end. Return `st.length === 0`.</details>

**5. (Predict the output)** Evaluate RPN `["4", "13", "5", "/", "+"]`.

<details><summary>Answer</summary>`6`. 13 / 5 truncates to 2, then 4 + 2.</details>

**6. (Spot the bug)** Min stack push:

```js
push(v) { this.s.push(v); if (!this.mins.length || v < this.min()) this.mins.push(v); }
pop()   { const v = this.s.pop(); if (v === this.min()) this.mins.pop(); return v; }
```

<details><summary>Answer</summary>`<` should be `<=`. With pushes 1, 1 then one pop, the min stack loses its only 1 and `getMin` is wrong.</details>

**7. (Multiple choice)** Two-stack queue: after `push 1, push 2, pop, push 3`, which stack holds 3?
A) out  B) in  C) both  D) neither

<details><summary>Answer</summary>B. The pop moved 1 and 2 to `out` and popped 1; new pushes always go to `in`.</details>

**8. (Complexity)** Using `arr.unshift` / `arr.shift` as push/pop for n operations costs?

<details><summary>Answer</summary>O(n²) total in the worst case, because each is O(n). Use `push`/`pop`.</details>

**9. (Predict the output)** Daily temperatures for `[73, 74, 75, 71, 69, 72, 76, 73]`?

<details><summary>Answer</summary>`[1, 1, 4, 2, 1, 1, 0, 0]`.</details>

**10. (Predict the output)** Asteroid collision `[5, 10, -5]` and `[8, -8]`.

<details><summary>Answer</summary>`[5, 10]` and `[]`. Equal sizes destroy each other.</details>

**11. (Spot the bug)** Decode string:

```js
if (ch === '[') { countStack.push(num); strStack.push(cur); num = 0; }
else if (ch === ']') { cur = strStack.pop() + cur.repeat(countStack.pop()); }
else if (/\d/.test(ch)) num = Number(ch);
else cur += ch;
```

<details><summary>Answer</summary>`num = Number(ch)` breaks multi-digit counts like `12[a]`. Use `num = num * 10 + Number(ch)`. (Also `cur` should be reset to `''` when pushing at `[`.)</details>

**12. (Multiple choice)** Largest Rectangle in Histogram: what order does the stack keep?
A) decreasing heights  B) increasing heights  C) sorted by index descending  D) any order

<details><summary>Answer</summary>B. A lower bar triggers pops of taller bars.</details>

---

## Mastery checklist

- [ ] I can implement a stack with an array and explain why push/pop must be at the end.
- [ ] I can solve Valid Parentheses, Min Stack and Queue using Stacks without hints.
- [ ] I can write the monotonic stack loop for next greater element and explain why it is O(n).
- [ ] I can evaluate RPN and a basic calculator (+ - * /) with a stack, handling multi-digit numbers.
- [ ] I can convert a recursive DFS into an iterative one with an explicit stack.
