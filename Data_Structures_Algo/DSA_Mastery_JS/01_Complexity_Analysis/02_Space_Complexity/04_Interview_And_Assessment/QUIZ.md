# Space Complexity — Quiz

Answer first, then open. Concepts: [CONCEPTS.md](../01_Concepts/CONCEPTS.md).

### Q1. Space complexity

```js
function sum(arr) { let t = 0; for (const x of arr) t += x; return t; }
```

<details><summary>Answer</summary>

O(1) auxiliary space.

</details>

### Q2. Space complexity

```js
function sum(arr, i = 0) { return i === arr.length ? 0 : arr[i] + sum(arr, i + 1); }
```

<details><summary>Answer</summary>

O(n) for the call stack.

</details>

### Q3. Space complexity

```js
function sum(arr) { return arr.length === 0 ? 0 : arr[0] + sum(arr.slice(1)); }
```

<details><summary>Answer</summary>

O(n²) peak: n frames are alive at once and frame k holds a slice of length n − k. Time is O(n²) too.

</details>

### Q4. Multiple choice — a frequency map over a string of length n with an unknown alphabet uses

A) O(1)  B) O(k) where k is the number of distinct characters  C) O(n²)  D) O(log n)

<details><summary>Answer</summary>

**B** (at most O(n)).

</details>

### Q5. Predict the output

```js
const a = [1, 2, 3];
const b = a.reverse();
console.log(a === b, a.join(''));
```

<details><summary>Answer</summary>

`true 321`. `reverse` is in place and returns the same array (O(1) extra space).

</details>

### Q6. Space complexity — recursive binary search

<details><summary>Answer</summary>

O(log n) stack. The iterative version is O(1).

</details>

### Q7. Spot the issue

"My solution is O(1) space because I only use one `Set`."

<details><summary>Answer</summary>

A `Set` that can hold up to n elements is O(n) space. The number of variables does not matter; their size does.

</details>

### Q8. Multiple choice — which DP space optimisation is valid for "number of paths in a grid" where each cell uses the cell above and the cell to the left?

A) keep one row of length cols  B) keep only one number  C) keep one column of length rows only if you iterate by rows  D) none

<details><summary>Answer</summary>

**A.** Update `row[c] += row[c - 1]` from left to right.

</details>

### Q9. Space complexity — merge sort

<details><summary>Answer</summary>

O(n) for the merge buffers, plus O(log n) recursion stack.

</details>

### Q10. Predict the behaviour

```js
function depth(n) { return n === 0 ? 0 : 1 + depth(n - 1); }
depth(1e6);
```

<details><summary>Answer</summary>

It throws `RangeError: Maximum call stack size exceeded`. The stack limit is far below 10^6 frames; use a loop.

</details>

### Q11. Space complexity — BFS on an n × n grid

<details><summary>Answer</summary>

O(n²) for the visited set (the queue can also hold O(n) to O(n²) cells).

</details>

### Q12. Multiple choice — which uses the least auxiliary memory for "reverse an array"?

A) `[...a].reverse()`  B) `a.map((_, i) => a[a.length - 1 - i])`  C) two-pointer swap in place  D) `a.slice().reverse()`

<details><summary>Answer</summary>

**C.** O(1); the others are O(n).

</details>

## Mastery checklist

- [ ] I distinguish auxiliary from total space and state whether the output is counted.
- [ ] I count recursion depth as space.
- [ ] I can spot hidden copies (`slice`, spread, `concat`, `map`) in code.
- [ ] I know common space optimisations (in place, rolling rows, iteration instead of recursion).
- [ ] I scored at least 10/12 on this quiz.
