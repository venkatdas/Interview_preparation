# Amortized Analysis — Self-Assessment Quiz

Answer each question before opening the answer. Back to the [topic README](../README.md).

**Q1. Multiple choice: amortized analysis gives** (a) an average over random inputs (b) a bound on the total cost of any operation sequence (c) a bound on each single operation
<details><summary>Answer</summary>(b).</details>

**Q2. How many element copies do 17 pushes cause in a doubling array starting at capacity 1?**
<details><summary>Answer</summary>1 + 2 + 4 + 8 + 16 = 31.</details>

**Q3. Growth by ×1.5 instead of ×2: still amortized O(1)? What changes?**
<details><summary>Answer</summary>Yes. Copies < n·f/(f − 1) = 3n instead of 2n: more copying, less wasted memory.</details>

**Q4. Spot the bug.**
```js
dequeue() { while (this.in.length) this.out.push(this.in.pop()); return this.out.pop(); }
```
<details><summary>Answer</summary>It refills even when `out` is not empty, so newer elements land on top of older ones and FIFO order breaks. Refill only when `out` is empty.</details>

**Q5. Complexity of this loop?**
```js
let j = 0;
for (let i = 0; i < n; i++) { while (j < n && a[j] <= a[i] + k) j++; count += j - i; }
```
<details><summary>Answer</summary>O(n): `j` only moves forward, at most n times in total (two pointers, aggregate argument).</details>

**Q6. Total bit flips to count from 0 to 16?**
<details><summary>Answer</summary>2·16 − popcount(16) = 32 − 1 = 31.</details>

**Q7. Spot the bug in this shrink rule: `if (size <= capacity / 2) capacity /= 2;`**
<details><summary>Answer</summary>Thrashing: alternating push/pop at the boundary resizes on every operation. Shrink at capacity / 4.</details>

**Q8. A potential function must satisfy which two conditions?**
<details><summary>Answer</summary>Φ(initial) = 0 (or accounted for) and Φ ≥ 0 at all times.</details>

**Q9. Push to a doubling array: worst single op and amortized?**
<details><summary>Answer</summary>Worst Θ(n) (resize), amortized Θ(1).</details>

**Q10. True or false: "the monotonic stack is O(n) on average but O(n²) in the worst case".**
<details><summary>Answer</summary>False. It is O(n) total in the worst case: each element is popped at most once.</details>

**Q11. Union-find without rank but with path compression: amortized cost?**
<details><summary>Answer</summary>O(log n) amortized per operation (rank + compression gives O(α(n))).</details>

**Q12. Why can't you claim amortized bounds for a persistent (immutable, versioned) two-stack queue?**
<details><summary>Answer</summary>The same old version with a full in-stack and empty out-stack can be dequeued repeatedly, paying the O(n) transfer each time; the stored credit is spent more than once.</details>

## Mastery checklist

- [ ] I can explain amortized vs average vs expected in one sentence each.
- [ ] I can prove array push is amortized O(1) with the aggregate, accounting and potential methods.
- [ ] I can explain why growth must be multiplicative and why shrinking happens at 1/4.
- [ ] I can defend the O(n) total of a monotonic stack or two-pointer loop when challenged.
- [ ] I can instrument a structure with counters and assert total work ≤ c·n.
