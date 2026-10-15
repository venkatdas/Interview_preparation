# Time Complexity — Quiz

Answer first, then open. Concepts: [CONCEPTS.md](../01_Concepts/CONCEPTS.md).

### Q1. Complexity

```js
for (let i = 1; i < n; i *= 2) console.log(i);
```

<details><summary>Answer</summary>

O(log n): i doubles each step.

</details>

### Q2. Complexity

```js
for (let i = 0; i < n; i++) for (let j = 0; j < 100; j++) work();
```

<details><summary>Answer</summary>

O(n). The inner loop is a constant 100.

</details>

### Q3. Multiple choice — simplify O(3n² + 50n log n + 1000)

A) O(n log n)  B) O(n²)  C) O(3n²)  D) O(n³)

<details><summary>Answer</summary>

**B.**

</details>

### Q4. Complexity

```js
for (let i = 0; i < n; i++) for (let j = i; j < n; j++) count++;
```

<details><summary>Answer</summary>

O(n²) (n(n + 1)/2 iterations).

</details>

### Q5. Spot the hidden cost

```js
const result = [];
for (const x of arr) if (!result.includes(x)) result.push(x);
```

<details><summary>Answer</summary>

`includes` is O(n), so the whole loop is O(n²). Use a `Set`: O(n).

</details>

### Q6. Complexity — recursion

```js
function f(n) { if (n <= 1) return 1; return f(n - 1) + f(n - 1); }
```

<details><summary>Answer</summary>

O(2^n): each call makes two calls, n levels deep.

</details>

### Q7. Complexity — recursion

```js
function g(n) { if (n <= 1) return 1; return g(n / 2) + 1; }
```

<details><summary>Answer</summary>

O(log n).

</details>

### Q8. Multiple choice — n ≤ 10^5 in the constraints suggests an intended complexity of

A) O(2^n)  B) O(n³)  C) O(n²)  D) O(n log n)

<details><summary>Answer</summary>

**D.**

</details>

### Q9. Complexity — two inputs

```js
for (const a of listA) for (const b of listB) if (a === b) common++;
```

<details><summary>Answer</summary>

O(n · m) where n and m are the list lengths.

</details>

### Q10. Predict the count

How many times does `count++` run for n = 8?

```js
for (let i = n; i > 0; i = Math.floor(i / 2)) for (let j = 0; j < i; j++) count++;
```

<details><summary>Answer</summary>

8 + 4 + 2 + 1 = 15, which is less than 2n. The loop is O(n), not O(n log n).

</details>

### Q11. Spot the mistake in this analysis

"Merge sort calls itself twice, so it is O(2^n)."

<details><summary>Answer</summary>

Each call works on half the input, so the depth is log n, not n. Each level does O(n) work: O(n log n). Branching factor alone does not decide the complexity; the input size per call matters.

</details>

### Q12. Multiple choice — amortized O(1) means

A) every operation is O(1)  B) the average over random inputs is O(1)  C) the total cost of any sequence of n operations is O(n)  D) the best case is O(1)

<details><summary>Answer</summary>

**C.**

</details>

## Mastery checklist

- [ ] I can read a loop or recursion and state its Big-O with a reason.
- [ ] I know the common classes (1, log n, n, n log n, n², 2^n, n!) with an example of each.
- [ ] I can spot hidden O(n) built-ins inside loops.
- [ ] I can map input constraints to the intended complexity.
- [ ] I scored at least 10/12 on this quiz.
