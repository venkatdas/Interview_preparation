# Monotonic Stacks & Queues — Quiz

Try first, then open the answer. Re-read [CONCEPTS.md](../01_Concepts/CONCEPTS.md) for anything you missed. See also: [Interview questions](INTERVIEW_QUESTIONS.md).

---

**1. (Multiple choice)** For "next greater element", the stack (bottom → top) is:
A) increasing  B) decreasing  C) sorted by index descending  D) unordered

<details><summary>Answer</summary>B. A larger incoming value pops smaller tops.</details>

**2. (Predict the output)** Next greater element (value, or -1) for `[2, 7, 3, 5, 4, 6, 8]`.

<details><summary>Answer</summary>`[7, 8, 5, 6, 6, 8, -1]`.</details>

**3. (Complexity)** A monotonic stack over n elements performs at most how many pops in total?

<details><summary>Answer</summary>n. So the algorithm is O(n).</details>

**4. (Spot the bug)** Previous smaller element:

```js
for (let i = 0; i < n; i++) {
  while (st.length && nums[st.at(-1)] > nums[i]) st.pop();
  res[i] = st.length ? st.at(-1) : -1;
  st.push(i);
}
```

<details><summary>Answer</summary>With `>`, an equal value stays on the stack and is reported as "smaller". For strictly smaller, pop with `>=`.</details>

**5. (Predict the output)** Largest rectangle for `[2, 1, 5, 6, 2, 3]`.

<details><summary>Answer</summary>`10` (bars 5 and 6, width 2).</details>

**6. (Multiple choice)** Sliding window minimum: which deque order?
A) decreasing front→back  B) increasing front→back  C) any  D) sorted by index

<details><summary>Answer</summary>B. The front is the minimum.</details>

**7. (Predict the output)** Stock spanner prices `100, 80, 60, 70, 60, 75, 85` → spans?

<details><summary>Answer</summary>`1, 1, 1, 2, 1, 4, 6`.</details>

**8. (Spot the bug)** Histogram width after popping index `top` at position `i`:

```js
const width = i - top;
```

<details><summary>Answer</summary>The rectangle extends left past `top` to the element after the new stack top. Width is `stack.length ? i - stack.at(-1) - 1 : i`.</details>

**9. (Complexity)** Maximal Rectangle on an R × C binary matrix with the histogram method?

<details><summary>Answer</summary>O(R · C) time, O(C) extra space.</details>

**10. (Multiple choice)** Sum of Subarray Minimums uses `left[i]` (distance to previous smaller) and `right[i]` (distance to next smaller-or-equal). Why the asymmetry?
A) speed  B) avoid counting a subarray twice when equal minimums exist  C) handle negatives  D) it is a typo

<details><summary>Answer</summary>B.</details>

**11. (Predict the output)** Sliding window max `[9, 8, 7, 6]`, k = 2.

<details><summary>Answer</summary>`[9, 8, 7]`.</details>

**12. (Spot the bug)** Deque window max:

```js
for (let i = 0; i < n; i++) {
  while (dq.length && nums[dq.at(-1)] <= nums[i]) dq.pop();
  dq.push(i);
  if (i >= k - 1) out.push(nums[dq[0]]);
}
```

<details><summary>Answer</summary>The front is never expired: add `if (dq[0] <= i - k) dq.shift();` (or advance a head pointer) before reading the front.</details>

---

## Mastery checklist

- [ ] I can write next/previous greater/smaller in all four variants and pick strict vs non-strict on purpose.
- [ ] I can explain the O(n) amortized argument.
- [ ] I can solve Largest Rectangle in Histogram and Maximal Rectangle from scratch.
- [ ] I can write a monotonic deque for window max/min and use it to speed up a DP (Jump Game VI).
- [ ] I can recognize "nearest bigger/smaller" or "contribution of each element as min/max" in a new problem.
