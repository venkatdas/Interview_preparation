# Heaps & Priority Queues — Quiz

Try first, then open the answer. Re-read [CONCEPTS.md](../01_Concepts/CONCEPTS.md) for anything you missed. See also: [Interview questions](INTERVIEW_QUESTIONS.md).

---

**1. (Multiple choice)** In an array-based heap, the parent of index 9 is at:
A) 3  B) 4  C) 5  D) 8

<details><summary>Answer</summary>B. `(9 - 1) >> 1 = 4`.</details>

**2. (Predict the output)** Push 5, 3, 8, 1 into an empty min-heap (array storage, sift-up). What is the array?

<details><summary>Answer</summary>`[1, 3, 8, 5]`. After 5, 3 → `[3, 5]`; 8 → `[3, 5, 8]`; 1 goes to index 3, swaps with 5 then 3.</details>

**3. (Complexity)** Building a heap by bottom-up heapify vs n pushes?

<details><summary>Answer</summary>O(n) vs O(n log n).</details>

**4. (Spot the bug)** Sift down:

```js
while (2 * i + 1 < n) {
  const c = 2 * i + 1;
  if (a[c] < a[i]) { [a[c], a[i]] = [a[i], a[c]]; i = c; } else break;
}
```

<details><summary>Answer</summary>It only looks at the left child. It must swap with the **smaller** of both children, or the heap property breaks.</details>

**5. (Multiple choice)** To keep the k largest of a stream, you use:
A) max-heap of size k  B) min-heap of size k  C) sorted array  D) stack

<details><summary>Answer</summary>B.</details>

**6. (Complexity)** Top K Frequent Elements with a size-k heap after counting with a Map?

<details><summary>Answer</summary>O(n log k). (Bucket sort by frequency gives O(n).)</details>

**7. (Predict the output)**

```js
const a = [3, 1, 2];
a.sort();
console.log(a, [10, 9, 1].sort());
```

<details><summary>Answer</summary>`[1, 2, 3] [1, 10, 9]`. Default sort compares strings — always pass `(x, y) => x - y`, including inside heap comparators.</details>

**8. (Multiple choice)** Which is NOT O(log n) on a binary heap of size n?
A) push  B) pop  C) peek  D) arbitrary delete with a known index

<details><summary>Answer</summary>C — peek is O(1). (D is O(log n) when you know the index; finding it is O(n).)</details>

**9. (Spot the bug)** Median finder:

```js
addNum(x) { if (x < this.low.peek()) this.low.push(x); else this.high.push(x); }
```

<details><summary>Answer</summary>No rebalancing: sizes can drift apart so the tops are no longer the middle. After each insert, move a top across if the sizes differ by more than 1. (Also `low.peek()` is undefined on the first insert.)</details>

**10. (Complexity)** Merging k sorted lists with N total nodes using a heap?

<details><summary>Answer</summary>O(N log k) time, O(k) heap space.</details>

**11. (Predict the output)** Last Stone Weight on `[2, 7, 4, 1, 8, 1]`?

<details><summary>Answer</summary>`1`.</details>

**12. (Multiple choice)** Heap sort is:
A) stable and in place  B) unstable and in place  C) stable and O(n) space  D) O(n²) worst case

<details><summary>Answer</summary>B.</details>

---

## Mastery checklist

- [ ] I can write a MinHeap class with a comparator (push, pop, peek, siftUp, siftDown) in under 10 minutes.
- [ ] I can explain why heapify is O(n) and why heap push/pop are O(log n).
- [ ] I know when to use a size-k min-heap vs sort vs quickselect for top-k.
- [ ] I can implement the two-heap median and merge k sorted lists.
- [ ] I recognize greedy-with-heap problems (sticks, IPO, meeting rooms, scheduling).
