# Time Complexity — Interview Questions

Answer out loud, then open the model answer. Theory: [CONCEPTS.md](../01_Concepts/CONCEPTS.md).

### 1. What does Big-O actually describe?

<details><summary>Model answer</summary>

An upper bound on how the running time grows as the input size grows, ignoring constant factors and lower-order terms. O(n) means "at most proportional to n for large n". It says nothing about the speed on small inputs or the exact number of milliseconds.

</details>

### 2. Big-O vs Big-Theta vs Big-Omega?

<details><summary>Model answer</summary>

O is an upper bound, Ω a lower bound, Θ a tight bound (both). Linear search is O(n) and Ω(1) overall; its worst case is Θ(n). In interviews "O" is used loosely to mean the tight worst-case bound, but you should know the difference.

</details>

### 3. Why do we drop constants and lower-order terms?

<details><summary>Model answer</summary>

For large n the dominant term decides growth: 3n² + 100n + 7 behaves like n² once n is big, and constants depend on hardware and language. Dropping them makes the comparison between algorithms independent of machine details.

</details>

### 4. How do you analyse nested loops whose inner bound depends on the outer index?

<details><summary>Model answer</summary>

Sum the inner iterations: for `j` from `i + 1` to `n`, the total is (n − 1) + (n − 2) + ... + 0 = n(n − 1)/2, which is O(n²). If the inner loop halves each time (`j *= 2`), it is O(log n) per outer step, so O(n log n) total.

</details>

### 5. Why is binary search O(log n) and merge sort O(n log n)?

<details><summary>Model answer</summary>

Binary search halves the range each step: log2 n steps. Merge sort halves the array log2 n times (the recursion depth), and each level does O(n) total merging work. Recurrence T(n) = 2T(n/2) + O(n) solves to O(n log n).

</details>

### 6. What is amortized analysis? Give an example.

<details><summary>Model answer</summary>

The average cost per operation over a worst-case sequence of operations. Dynamic array `push` is occasionally O(n) when it resizes, but doubling makes total copying less than 2n over n pushes, so each push is amortized O(1). It is a guarantee over sequences, not an average over random inputs.

</details>

### 7. What is the complexity of naive recursive Fibonacci and how does memoization change it?

<details><summary>Model answer</summary>

Naive: each call makes two calls, the tree has about φ^n nodes, so O(φ^n) ≈ O(1.618^n), commonly stated as O(2^n). Memoized: each n from 0 to n is computed once with O(1) extra work, so O(n) time and O(n) space.

</details>

### 8. Which JavaScript built-ins hide linear loops?

<details><summary>Model answer</summary>

`includes`, `indexOf`, `find`, `some`, `slice`, `splice`, `shift`, `unshift`, `concat`, spread `[...a]`, `join`, `split`, `Object.keys`, string `+` in some cases, and `sort` (O(n log n)). Calling them inside a loop multiplies the cost.

</details>

### 9. Given n = 10^5, which complexities pass in about one second?

<details><summary>Model answer</summary>

Roughly 10^8 simple operations per second is a safe rule. O(n log n) ≈ 1.7 × 10^6 and O(n) easily pass; O(n²) = 10^10 does not. Use constraints to guess the intended complexity: n ≤ 20 → exponential is fine; n ≤ 10^3 → O(n²); n ≤ 10^5–10^6 → O(n log n) or O(n).

</details>

### 10. Best, average and worst case of quicksort?

<details><summary>Model answer</summary>

Best and average O(n log n) (balanced partitions); worst O(n²) when the pivot is always the smallest or largest (e.g. sorted input with a first/last pivot). A random pivot makes the expected time O(n log n) for every input.

</details>

### 11. What is the complexity of an algorithm with two inputs, like comparing two lists?

<details><summary>Model answer</summary>

Keep both variables: nested loops over lists of sizes n and m are O(n · m), not O(n²). Two separate loops are O(n + m). Only merge them if the sizes are known to be related.

</details>

### 12. How would you reduce an O(n²) solution to O(n)?

<details><summary>Model answer</summary>

Find the repeated work in the inner loop. Common fixes: replace an inner search with a hash map lookup, use two pointers on sorted data, maintain a running value (sliding window, prefix sums), or precompute something in one pass and reuse it.

</details>
