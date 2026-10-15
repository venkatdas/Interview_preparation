# Divide and Conquer: Interview Questions

Answer each question out loud first, then open the model answer.
Back to the [topic README](../README.md) · [concepts guide](../01_Concepts/CONCEPTS.md) · [quiz](QUIZ.md)

---

### 1. What are the three steps of divide and conquer? Which one usually holds the real idea?

<details><summary>Model answer</summary>

**Divide** the input into smaller pieces, **conquer** each piece recursively down to a base
case, **combine** the piece answers. The combine step holds the insight: for example in
inversion counting, cross pairs are counted in bulk while merging.

</details>

### 2. State the master theorem in plain words and apply it to merge sort.

<details><summary>Model answer</summary>

For `T(n) = a·T(n/b) + f(n)`, compare the combine work `f(n)` with `n^(log_b a)` (the number of
leaves). If leaves dominate, `T = Θ(n^(log_b a))`. If they are equal, multiply by `log n`.
If the combine dominates, `T = Θ(f(n))`. Merge sort: `a = 2, b = 2, f(n) = n`,
`n^(log_2 2) = n`, equal, so `Θ(n log n)`.

</details>

### 3. How is divide and conquer different from dynamic programming?

<details><summary>Model answer</summary>

Both split into sub-problems. D&C sub-problems are usually **disjoint** (the two halves of an
array), so each is solved once. DP sub-problems **overlap**, so results are cached. D&C plus
a memo table is top-down DP: Different Ways to Add Parentheses is the classic example.

</details>

### 4. Explain how to count inversions in O(n log n).

<details><summary>Model answer</summary>

Merge sort the array. Inversions are inside the left half, inside the right half, or cross
pairs. During the merge, when an element from the right half is taken before `left[i]`, it is
smaller than every remaining left element, so add `left.length - i` at once. The merge is
O(n), the recurrence is `2T(n/2) + n`, so O(n log n).

</details>

### 5. Maximum Subarray by D&C: how do you compute the crossing case, and why is Kadane better?

<details><summary>Model answer</summary>

The crossing subarray must include `mid` and `mid + 1`. Scan left from `mid` for the best
suffix sum, scan right from `mid + 1` for the best prefix sum, and add them. That is O(n) per
level, so O(n log n) total. Kadane does it in one O(n) pass with O(1) space. The D&C version is
useful because it generalises: with segment trees you can answer the same question for any
range after updates.

</details>

### 6. How does fast exponentiation work, and what are the edge cases in Pow(x, n)?

<details><summary>Model answer</summary>

`x^n = (x^(n/2))^2`, times `x` when `n` is odd, so only O(log n) multiplications. Iteratively,
read the bits of `n`. Edge cases: `n = 0` gives 1; negative `n` means `1 / x^|n|` (in 32-bit
languages `-(-2^31)` overflows); `x = 0` with negative `n` is undefined; huge `n` with
`x = ±1`. Compute the half power once, not twice, or it becomes O(n).

</details>

### 7. Merge k sorted lists: compare sequential merging, pairwise D&C and a min-heap.

<details><summary>Model answer</summary>

Sequential (merge list 1 with 2, then with 3...) is O(N·k) because early elements are copied
k times. Pairwise D&C merges in log k rounds, each touching N elements: O(N log k), O(log k)
stack. A min-heap of k heads is also O(N log k) with O(k) extra space, and works for streams.

</details>

### 8. Median of two sorted arrays in O(log(min(m, n))): what are you binary searching for?

<details><summary>Model answer</summary>

A cut `i` in the shorter array and `j = (m + n + 1) / 2 - i` in the longer one, so the left
side holds half of all elements. The cut is correct when `A[i-1] <= B[j]` and
`B[j-1] <= A[i]` (use ±Infinity past the edges). Then the median comes from the max of the
left side and the min of the right side. If `A[i-1] > B[j]`, move the cut left; otherwise right.

</details>

### 9. When does a recursion that "splits" NOT give a good complexity?

<details><summary>Model answer</summary>

When the split is unbalanced (`T(n) = T(n-1) + n` is O(n²), like quick sort with a bad
pivot), when the combine step is too expensive (`2T(n/2) + n²` is O(n²)), or when
sub-problems overlap and are recomputed (naive Fibonacci is exponential).

</details>

### 10. Why is quick sort O(n log n) on average but O(n²) in the worst case?

<details><summary>Model answer</summary>

Partition is O(n). If the pivot splits roughly in half, there are log n levels: O(n log n).
If the pivot is always the min or max (sorted input with first-element pivot), each level
removes only one element: n levels of O(n) work, O(n²). A random pivot makes the bad case
extremely unlikely.

</details>

### 11. Explain the Skyline problem with divide and conquer.

<details><summary>Model answer</summary>

Split the buildings in half, compute each half's skyline (a list of `[x, height]` key points),
then merge the two skylines like merge sort: walk both lists by x, keep the current height of
each side, and at every x the skyline height is the max of the two. Emit a point only when that
max changes. Recurrence `2T(n/2) + n`, so O(n log n).

</details>

### 12. What is the space cost of recursive D&C, and when does it matter in JavaScript?

<details><summary>Model answer</summary>

Recursion depth is O(log n) for balanced splits, which is tiny. Extra memory comes from copies:
merge sort with `slice()` allocates O(n) per level, but at most O(n) is alive at once. Depth
matters when splits are unbalanced: around 10^4 nested calls can overflow the JS stack, so
prefer indices over slices and iterative versions when depth can grow linearly.

</details>

### 13. Give a D&C idea that beats the obvious algorithm: Karatsuba or closest pair.

<details><summary>Model answer</summary>

Karatsuba multiplies two n-digit numbers with three half-size products (`ac`, `bd`,
`(a+b)(c+d)`) instead of four, so `T(n) = 3T(n/2) + n` = O(n^1.585) instead of O(n²).
Closest pair: sort by x, solve each half, then only check points within distance `d` of the
split line, sorted by y, each against at most 7 neighbours: O(n log n) instead of O(n²).

</details>

### 14. Different Ways to Add Parentheses: what is the recursion and how many results can there be?

<details><summary>Model answer</summary>

For every operator, split into left and right expressions, recursively get all values of each
side, and combine every pair with the operator. The base case is a plain number. The number of
results follows the Catalan numbers, so the output itself is exponential. Memoise by substring
to avoid recomputing the same sub-expression.

</details>
