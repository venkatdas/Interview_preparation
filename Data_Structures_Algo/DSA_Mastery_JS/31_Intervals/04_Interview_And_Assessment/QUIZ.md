# Intervals — Self-Assessment Quiz

Answer each question on paper before opening the answer. Score 1 point per correct answer; aim for 12/14 before moving on.
Back to the [topic README](../README.md) · [Concepts](../01_Concepts/CONCEPTS.md) · [Interview questions](INTERVIEW_QUESTIONS.md)

---

### Q1 (multiple choice)
Which expression is true exactly when inclusive intervals `a` and `b` overlap?

A. `a[0] < b[0] && a[1] > b[1]`  B. `a[0] <= b[1] && b[0] <= a[1]`  C. `a[1] >= b[0]`  D. `a[0] <= b[0] || a[1] >= b[1]`

<details><summary>Answer</summary>

**B.** A only detects containment. C forgets the case where `b` lies entirely before `a` (e.g. a = [5,6], b = [1,2]).
D is true for almost any pair.

</details>

### Q2 (predict the output)
```js
merge([[1, 4], [0, 0], [4, 5], [6, 7]]);   // merge from 02_Implementations/interval_utils.js
```

<details><summary>Answer</summary>

`[[0, 0], [1, 5], [6, 7]]`. After sorting: [0,0], [1,4], [4,5], [6,7]. 1 > 0 so a new block; 4 <= 4 (touching) merges;
6 > 5 starts a new block.

</details>

### Q3 (spot the bug)
```js
function merge(intervals) {
  intervals.sort((a, b) => a[0] - b[0]);
  const out = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    if (intervals[i][0] <= intervals[i - 1][1]) out[out.length - 1][1] = intervals[i][1];
    else out.push(intervals[i]);
  }
  return out;
}
```

<details><summary>Answer</summary>

Three bugs: (1) it compares with the previous **input** interval instead of the last merged block;
(2) it assigns `= intervals[i][1]` instead of `Math.max(...)`, so `[1,10],[2,3]` becomes `[1,3]`;
(3) it crashes on empty input (`intervals[0]` is undefined, then `out` contains `undefined`). It also mutates
the input both by sorting and by editing pushed references.

</details>

### Q4 (complexity)
What is the time complexity of Insert Interval when the list is already sorted and disjoint? Would binary search improve it?

<details><summary>Answer</summary>

O(n). Binary search finds the boundaries in O(log n), but building the output array still copies O(n) elements,
so the overall bound stays O(n).

</details>

### Q5 (predict the output)
```js
sweepLineMaxOverlap([[1, 3], [3, 5], [2, 3]]);
sweepLineMaxOverlap([[1, 3], [3, 5], [2, 3]], true);
```

<details><summary>Answer</summary>

`2` and then `3`. Half-open (default): at time 2, [1,3) and [2,3) are alive; at time 3 both end before [3,5) starts.
Touching counts: at time 3 all three closed intervals contain 3.

</details>

### Q6 (find the counterexample)
"To keep the most non-overlapping intervals, sort by **start** and greedily keep each interval that does not overlap the last kept one." Give an input where this fails.

<details><summary>Answer</summary>

`[[1, 100], [2, 3], [4, 5]]`. Sorting by start keeps [1,100] and then nothing else (1 interval). The optimum keeps
[2,3] and [4,5] (2 intervals). Sorting by **end** fixes it.

</details>

### Q7 (find the counterexample)
"Keep the **shortest** interval first, then the next shortest that does not conflict." Show that this greedy is not optimal.

<details><summary>Answer</summary>

`[[1, 5], [6, 10], [4, 7]]`. The shortest is [4,7] (length 3); it conflicts with both others, so you keep 1.
The optimum keeps [1,5] and [6,10] = 2.

</details>

### Q8 (multiple choice)
Meeting Rooms II with a sweep line. At equal times, which event must come first if a meeting may start the moment another ends?

A. `+1` (start)  B. `-1` (end)  C. it does not matter

<details><summary>Answer</summary>

**B.** Processing the end first frees the room before the new meeting takes one. Processing the start first would
count `[1,5]` and `[5,8]` as needing 2 rooms.

</details>

### Q9 (complexity)
Car Pooling with locations in `0..1000` and n trips. Compare sorting events with a difference array.

<details><summary>Answer</summary>

Sorting events: O(n log n) time, O(n) space. Difference array: O(n + 1001) time and O(1001) space, no sort.
For small coordinate ranges the difference array wins; for huge coordinates you must sort (or coordinate-compress).

</details>

### Q10 (spot the bug)
Interval list intersection:
```js
while (i < A.length && j < B.length) {
  const lo = Math.max(A[i][0], B[j][0]), hi = Math.min(A[i][1], B[j][1]);
  if (lo <= hi) out.push([lo, hi]);
  i++; j++;
}
```

<details><summary>Answer</summary>

It advances both pointers every time. Only the interval that **ends first** is finished; the other may still intersect
the next interval of the opposite list. Fix: `if (A[i][1] < B[j][1]) i++; else j++;`.
Counterexample: A = [[0,10]], B = [[1,2],[5,6]] should give [[1,2],[5,6]] but the buggy loop gives only [[1,2]].

</details>

### Q11 (multiple choice)
Remove Covered Intervals sorts with `(a, b) => a[0] - b[0] || b[1] - a[1]`. Why end **descending** on ties?

A. To make the sort stable  B. So the longer interval comes first and the shorter one with the same start is detected as covered  C. It is only for speed

<details><summary>Answer</summary>

**B.** With `[1,4]` before `[1,2]`, the scan sees `[1,2]` while the max end so far is 4, so it is covered. In ascending
order `[1,2]` would be counted as uncovered and then `[1,4]` would not cover anything already counted.

</details>

### Q12 (predict the output)
```js
insert([[1, 2], [5, 6]], [2, 5]);   // insert from interval_utils.js
```

<details><summary>Answer</summary>

`[[1, 6]]`. [1,2] ends at 2, which is not `< 2`, so it joins phase 2; [5,6] starts at 5 `<= 5`, so it also merges.
Touching on both sides fuses everything.

</details>

### Q13 (complexity)
Minimum Interval to Include Each Query: brute force vs offline sweep with a heap?

<details><summary>Answer</summary>

Brute force: O(n · q). Offline: O(n log n + q log q) for the sorts plus O((n + q) log n) for heap work, i.e.
O((n + q) log(n + q)) time and O(n + q) space.

</details>

### Q14 (find the counterexample)
"For Minimum Arrows to Burst Balloons, the answer equals the number of blocks after Merge Intervals." True?

<details><summary>Answer</summary>

False. Merge joins chains, but one arrow needs a single common point. `[[1,2],[2,3],[3,4]]` merges into one block,
yet no single x lies in all three; the answer is 2 (arrows at 2 and at 3 or 4). Use greedy by end instead.

</details>

---

## Mastery checklist

- [ ] I can write the overlap condition and the intersection formula without looking, and explain `<` vs `<=`.
- [ ] I can code Merge Intervals and Insert Interval from memory in under 10 minutes, including empty input.
- [ ] I can solve Meeting Rooms II both with a sweep line and with a min-heap, and explain the tie-break.
- [ ] I can prove "sort by end" for maximum non-overlapping intervals and give a counterexample for "sort by start".
- [ ] I can recognise when to use a difference array, two pointers, or offline queries for an interval problem.
