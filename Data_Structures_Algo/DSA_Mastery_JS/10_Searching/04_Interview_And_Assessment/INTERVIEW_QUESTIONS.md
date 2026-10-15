# Searching — Interview Questions

Answer out loud, then open the model answer. Theory: [CONCEPTS.md](../01_Concepts/CONCEPTS.md).

### 1. Why is binary search O(log n)?

<details><summary>Model answer</summary>

Each comparison throws away half of the remaining range. Starting from n elements, after k steps there are n / 2^k left; it stops when that reaches 1, so k = log2 n. For a million elements that is about 20 comparisons.

</details>

### 2. What exactly does binary search require of the data?

<details><summary>Model answer</summary>

Random access (O(1) indexing) and a monotone yes/no property: for some predicate, all "no" answers come before all "yes" answers. Sorted order is the usual source of that property, but it can also be a feasibility check on an answer range (Koko Eating Bananas) or a slope (Find Peak Element).

</details>

### 3. Explain `while (lo <= hi)` vs `while (lo < hi)` and when to use each.

<details><summary>Model answer</summary>

`lo <= hi` with `hi = n − 1` searches a closed range and is for exact matches: return when found, else `lo = mid + 1` / `hi = mid − 1`, return −1 when the range is empty. `lo < hi` with `hi = n` (half-open) is for boundaries: keep `mid` as a candidate with `hi = mid`, discard with `lo = mid + 1`, and when the loop ends `lo` is the answer. Mixing the two styles causes infinite loops or off-by-one errors.

</details>

### 4. What are lower bound and upper bound, and how do you count occurrences with them?

<details><summary>Model answer</summary>

Lower bound: first index with `a[i] >= x`. Upper bound: first index with `a[i] > x`. Both can return n. The number of copies of x is `upper − lower`, and lower bound is also the insert position.

</details>

### 5. What is "binary search on the answer"? Give an example.

<details><summary>Model answer</summary>

Instead of searching an array, search the range of possible answers with a feasibility check that is monotone. Koko Eating Bananas: if speed s finishes in h hours, any faster speed also does. Binary search the smallest feasible s in `[1, max(piles)]`; each check is O(n), total O(n log max).

</details>

### 6. Why write `mid = lo + ((hi − lo) >> 1)` and when is `>> 1` dangerous in JavaScript?

<details><summary>Model answer</summary>

`lo + (hi − lo) / 2` avoids overflow in languages with fixed-size integers. In JS numbers do not overflow, but `>>` converts to a 32-bit integer, so it breaks once values pass 2^31 (for example when searching an answer range up to 10^12). Use `Math.floor((lo + hi) / 2)` for big ranges.

</details>

### 7. How do you search a rotated sorted array?

<details><summary>Model answer</summary>

At any mid, at least one half is sorted. If `a[lo] <= a[mid]`, the left half is sorted: go left if the target lies in `[a[lo], a[mid])`, else go right. Otherwise the right half is sorted: go right if the target lies in `(a[mid], a[hi]]`, else left. With duplicates, when `a[lo] === a[mid] === a[hi]` you cannot tell, so shrink both ends; the worst case becomes O(n).

</details>

### 8. How can Find Peak Element use binary search on unsorted data?

<details><summary>Model answer</summary>

Compare `a[mid]` with `a[mid + 1]`. If it is going up, a peak must exist to the right (the array eventually stops rising or ends, and the end counts as a peak). Otherwise a peak exists at mid or to its left. The predicate "slope going down at i" is monotone enough to halve the range each time.

</details>

### 9. Explain the idea behind Median of Two Sorted Arrays in O(log(min(m, n))).

<details><summary>Model answer</summary>

Binary search a cut in the shorter array; the cut in the longer one is determined so the left side has half of all elements. The cut is correct when `maxLeftA <= minRightB` and `maxLeftB <= minRightA`. If `maxLeftA` is too big, move the cut left; otherwise right. Use ±Infinity for empty sides. The median comes from the max of the left side and min of the right side.

</details>

### 10. When is linear search the better choice?

<details><summary>Model answer</summary>

Unsorted data searched once (sorting costs more than a scan), very small arrays, linked lists (no random access), or when you need every match anyway. If there are many lookups and no ordering needs, a `Set` or `Map` gives O(1) average.

</details>

### 11. How do you avoid infinite loops in boundary searches?

<details><summary>Model answer</summary>

Make sure every iteration shrinks the range. With `lo < hi` and `mid` rounded down, use `hi = mid` and `lo = mid + 1`. If you need `lo = mid` (searching the last true), round mid **up** (`lo + Math.floor((hi − lo + 1) / 2)`). Test on 1- and 2-element arrays.

</details>

### 12. How do you binary search over real numbers?

<details><summary>Model answer</summary>

Loop a fixed number of iterations (around 60–100 halves are enough for double precision) or until `hi − lo < eps`, updating `lo = mid` or `hi = mid` without ±1. Used for square roots, minimising a continuous function, or geometry answers.

</details>
