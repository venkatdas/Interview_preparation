# Sorting — Quiz

Answer first, then open. Concepts: [CONCEPTS.md](../01_Concepts/CONCEPTS.md).

### Q1. Predict the output

```js
console.log([5, 25, 100, 1].sort());
```

<details><summary>Answer</summary>

`[1, 100, 25, 5]`. String comparison.

</details>

### Q2. Multiple choice — which sort is stable?

A) quicksort (Lomuto)  B) heap sort  C) merge sort  D) selection sort

<details><summary>Answer</summary>

**C.**

</details>

### Q3. Complexity — quicksort with the last element as pivot on already sorted input

<details><summary>Answer</summary>

O(n²) time and O(n) recursion depth: every partition peels off one element.

</details>

### Q4. Spot the bug (comparator)

```js
people.sort((a, b) => a.age > b.age);
```

<details><summary>Answer</summary>

The comparator returns a boolean (true/false → 1/0), never a negative number, so the order is unreliable. Use `(a, b) => a.age - b.age`.

</details>

### Q5. Multiple choice — worst-case time of counting sort for n integers in range [0, k)

A) O(n log n)  B) O(n + k)  C) O(n·k)  D) O(k log k)

<details><summary>Answer</summary>

**B.**

</details>

### Q6. Predict the output (merge step)

Merging `[1, 4, 7]` and `[2, 4, 6]` taking from the left on ties. What is the order, and which 4 comes first?

<details><summary>Answer</summary>

`1 2 4 4 6 7`, with the 4 from the left array first. Taking the left element on ties is what makes merge sort stable.

</details>

### Q7. Spot the bug (merge sort)

```js
function mergeSort(a) {
  const mid = Math.floor(a.length / 2);
  return merge(mergeSort(a.slice(0, mid)), mergeSort(a.slice(mid)));
}
```

<details><summary>Answer</summary>

No base case: for length 1, `slice(1)` is empty and `slice(0, 0)` is empty, but `mergeSort([x])` calls `mergeSort([x])` again (mid = 0, right half = `[x]`) forever. Add `if (a.length <= 1) return a;`.

</details>

### Q8. Complexity — quickselect average and worst case

<details><summary>Answer</summary>

Average O(n), worst O(n²). Random pivots make the worst case very unlikely.

</details>

### Q9. Predict the output

```js
const nums = [3, 30, 34, 5, 9].map(String).sort((a, b) => (b + a).localeCompare(a + b));
console.log(nums.join(''));
```

<details><summary>Answer</summary>

`9534330`. (`localeCompare` works here because all characters are digits; a plain `<` comparison is safer in general.)

</details>

### Q10. Multiple choice — best algorithm for "sort an array of 10 million ages (0–120)"

A) quicksort  B) merge sort  C) counting sort  D) bubble sort

<details><summary>Answer</summary>

**C.** O(n + 121).

</details>

### Q11. Spot the bug (Meeting Rooms II with sorted starts and ends)

```js
if (starts[i] <= ends[e]) rooms++; else e++;
```

<details><summary>Answer</summary>

A meeting starting exactly when another ends can reuse that room; the condition should be `starts[i] < ends[e]` to open a new room. With `<=`, `[[1,5],[5,10]]` needs 2 rooms instead of 1.

</details>

### Q12. Complexity — what is the extra space of in-place quicksort?

<details><summary>Answer</summary>

O(log n) on average for the recursion stack (O(n) in the worst case). Recursing into the smaller side first and looping on the larger side guarantees O(log n).

</details>

## Mastery checklist

- [ ] I can state time, space and stability for bubble, insertion, selection, merge, quick, heap, counting and radix sort.
- [ ] I can write merge sort and quicksort (with random pivot) from memory.
- [ ] I can write correct comparators, including multi-key sorts.
- [ ] I can use quickselect for k-th element and merge sort for counting inversions.
- [ ] I scored at least 10/12 on this quiz.
