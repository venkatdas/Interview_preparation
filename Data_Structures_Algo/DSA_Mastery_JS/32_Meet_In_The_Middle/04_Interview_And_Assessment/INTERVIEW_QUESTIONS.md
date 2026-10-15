# Meet in the Middle — Interview Questions

Back to the topic: [README](../README.md) · Concepts: [CONCEPTS.md](../01_Concepts/CONCEPTS.md)

Answer each question out loud first, then open the model answer.

### 1. What is meet in the middle, in one sentence?

<details><summary>Model answer</summary>

Split the input in two halves, enumerate all partial answers of each half (2^(n/2) each), and combine
one partial answer from each side using sorting + binary search, two pointers, or hashing, so the
total cost is about 2^(n/2) instead of 2^n.

</details>

### 2. Why does it turn 2^n into roughly 2^(n/2)?

<details><summary>Model answer</summary>

Each half has 2^(n/2) subsets. Building both lists costs 2 · 2^(n/2). The combine step does one fast
lookup (O(1) hash or O(log) search) per left entry instead of scanning the whole right list, so it
costs 2^(n/2) · O(1 or n). We never form the 2^(n/2) × 2^(n/2) = 2^n pairs explicitly.

</details>

### 3. Which constraint values make you think of it?

<details><summary>Model answer</summary>

n around 30 to 45 — especially `n <= 40` — combined with huge values (so DP over sums won't fit).
At n ≤ 20 plain enumeration is enough; at n ≥ 50, 2^25+ entries per half won't fit in memory.

</details>

### 4. When would you prefer dynamic programming instead?

<details><summary>Model answer</summary>

When values (and therefore the range of possible sums) are small. Subset-sum DP is O(n · S): with
S ≤ ~10^6 it's simpler and faster. Meet in the middle is for small n and large values.

</details>

### 5. How do you combine the halves for "exact sum equals T", "closest to T", and "count ≤ T"?

<details><summary>Model answer</summary>

- Exact, counting: frequency map of right sums, add `freq[T − l]` for each left sum.
- Closest: sort right sums, binary search `T − l`, check the insertion point and its left neighbour.
- Count ≤ T: sort both, two pointers (left pointer up, right pointer down), add `j + 1` each step.

</details>

### 6. How can you get the half sums in sorted order without a sort call?

<details><summary>Model answer</summary>

Start with `[0]`. For each element x, the new list is the merge of `cur` and `cur + x`; both are
sorted, so a linear merge keeps the result sorted. Total O(2^(n/2)) instead of O(2^(n/2) · n/2).

</details>

### 7. Why must you keep duplicate sums?

<details><summary>Model answer</summary>

Different subsets with the same sum are different answers when counting. If you de-duplicate with a
Set you undercount. A Set is only fine for yes/no questions.

</details>

### 8. How do you handle "the two groups must have exactly n elements each"?

<details><summary>Model answer</summary>

Bucket each half's sums by subset size. If the group takes k items from the left it must take n − k
from the right, so only combine left bucket k with right bucket n − k. Same total work, just grouped.

</details>

### 9. Explain the 4Sum II trick in terms of meet in the middle.

<details><summary>Model answer</summary>

The four arrays split into two "halves", (A, B) and (C, D). Enumerate all n² sums of each pair, store
one side in a frequency map, and look up the negation of each sum from the other side: O(n²) instead
of O(n⁴).

</details>

### 10. What is the memory cost at n = 40, and how do you reduce it?

<details><summary>Model answer</summary>

2^20 ≈ 10^6 numbers per half, about 8 MB each as doubles. You can store only one half (e.g. the
sorted right list) and generate left sums on the fly, or use a `Float64Array` instead of a JS array
to keep memory compact and predictable.

</details>

### 11. How does Split Array With Same Average become a meet-in-the-middle problem?

<details><summary>Model answer</summary>

Equal averages force both groups to have the overall average. Subtracting it from every element
(scaled by n to stay integral) turns the question into "is there a non-empty proper subset with sum 0?",
which meet in the middle answers with a hash set, being careful not to pick the whole array.

</details>

### 12. Is meet in the middle only for subsets?

<details><summary>Model answer</summary>

No. Bidirectional BFS (search from start and goal and meet in the middle) is the graph version.
Grid path problems with XOR scores can be split on the anti-diagonal: count first-half path values
in a map per cell, then match second-half paths. Any search whose score combines from two halves works.

</details>

### 13. What are the most common bugs?

<details><summary>Model answer</summary>

Default string sort, checking only one neighbour in the closest search, de-duplicating sums when
counting, ignoring size or non-empty constraints, and accidentally reintroducing the 2^n pairing.

</details>
