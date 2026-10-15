# Space Complexity — Interview Questions

Answer out loud, then open the model answer. Theory: [CONCEPTS.md](../01_Concepts/CONCEPTS.md).

### 1. Auxiliary space vs total space?

<details><summary>Model answer</summary>

Total space includes the input; auxiliary space is only the extra memory your algorithm allocates. When interviewers say "O(1) space" they mean auxiliary space. State which one you are giving.

</details>

### 2. Does recursion use memory even if you allocate nothing?

<details><summary>Model answer</summary>

Yes. Each active call keeps a stack frame (parameters, locals, return address). The space is O(maximum recursion depth). A recursive sum over n elements is O(n) space; recursive binary search is O(log n); the iterative versions are O(1).

</details>

### 3. Is a 26-element count array O(1) or O(n) space?

<details><summary>Model answer</summary>

O(1): its size is fixed and does not grow with the input. More precisely it is O(alphabet size), which is a constant for lowercase letters.

</details>

### 4. Does the output count toward space complexity?

<details><summary>Model answer</summary>

Usually not: returning a list of n results is required by the problem, so people report auxiliary space excluding the output. Say it explicitly: "O(1) extra space, not counting the output array".

</details>

### 5. Which JavaScript operations secretly allocate memory?

<details><summary>Model answer</summary>

`slice`, spread `[...a]`, `concat`, `map`, `filter`, `split`, `Object.keys/entries`, `JSON.stringify`, string concatenation, and `arr.slice(1)` in recursion (which creates O(n²) total copies). Passing an index instead of a sliced array avoids that.

</details>

### 6. Give examples of trading space for time.

<details><summary>Model answer</summary>

Hash map lookups in Two Sum (O(n) space to go from O(n²) to O(n) time), memoization in DP, prefix sum arrays for O(1) range queries, precomputed sieves. The reverse trade (less space, more time): sorting in place instead of hashing, or recomputing instead of caching.

</details>

### 7. How can you reduce a DP table from O(n·m) to O(m)?

<details><summary>Model answer</summary>

If each row depends only on the previous row, keep two rows (or one row updated in the right direction) instead of the full table. You lose the ability to reconstruct the path unless you store extra information.

</details>

### 8. What is the space complexity of BFS and DFS on a graph with V vertices?

<details><summary>Model answer</summary>

O(V) for the visited set, plus the queue (BFS, up to the widest level) or the stack/recursion (DFS, up to the longest path). Both are O(V) in the worst case; DFS on a long path can overflow the call stack if recursive.

</details>

### 9. Is in-place sorting O(1) space?

<details><summary>Model answer</summary>

Heap sort is O(1). Quicksort is "in place" but uses O(log n) stack on average (O(n) worst case). JavaScript's built-in sort (TimSort) can use O(n) temporary memory. Merge sort needs O(n) for merging arrays.

</details>

### 10. Why can a program run out of memory even when the space complexity looks fine?

<details><summary>Model answer</summary>

Constants matter: objects in JS have overhead (a `Map` entry costs far more than an array slot), strings are UTF-16, and garbage that has not been collected yet still counts. Also the recursion limit (~10k frames) is much lower than the heap limit.

</details>

### 11. How do you analyse the space of a recursive function that also allocates?

<details><summary>Model answer</summary>

Space = maximum over time of (stack depth × frame size + live heap allocations). For merge sort: depth O(log n), but merge buffers add O(n) at any moment, so O(n). For `sumWithSlice(arr.slice(1))`, each frame keeps a copy alive, giving O(n²) peak memory.

</details>
