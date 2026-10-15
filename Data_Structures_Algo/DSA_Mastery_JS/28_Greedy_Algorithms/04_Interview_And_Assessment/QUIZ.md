# Greedy Algorithms: Quiz

Try every question before opening the answer. Score yourself honestly.
Back to the [topic README](../README.md) · [concepts guide](../01_Concepts/CONCEPTS.md) · [interview questions](INTERVIEW_QUESTIONS.md)

---

### 1. (Multiple choice) To maximise the number of non-overlapping intervals, sort by:

A) start ascending   B) length ascending   C) end ascending   D) start descending

<details><summary>Answer</summary>

**C.** Earliest end leaves the most room for the rest. (D, "latest start first", also works
by symmetry, but C is the standard answer.)

</details>

### 2. (Find the counterexample) "Sort intervals by LENGTH and take the shortest ones that fit." Break it.

<details><summary>Answer</summary>

`[[1,5],[6,10],[4,7]]`. Shortest is `[4,7]` (length 3); it overlaps both others, so greedy
gets 1. Optimal takes `[1,5]` and `[6,10]`: 2.

</details>

### 3. (Find the counterexample) "Coin change: always take the largest coin that fits." Coins `[1, 7, 10]`. Find an amount where it fails.

<details><summary>Answer</summary>

Amount 14: greedy takes 10 + 1 + 1 + 1 + 1 = 5 coins; optimal is 7 + 7 = 2 coins.

</details>

### 4. (Find the counterexample) "0/1 knapsack: take items by best value/weight ratio." Capacity 10.

<details><summary>Answer</summary>

Items (w=6, v=9) ratio 1.5, and (w=5, v=7) twice, ratio 1.4. Greedy takes the w=6 item (value
9), then a w=5 item does not fit: total 9. Optimal: both w=5 items, value 14.

</details>

### 5. (Predict the output)

```js
const { activitySelection } = require('../02_Implementations/greedy_classics');
console.log(activitySelection([[1, 3], [3, 5], [2, 4], [5, 6]]).length);
```

<details><summary>Answer</summary>

**3**: sorted by end gives `[1,3],[2,4],[3,5],[5,6]`. Take `[1,3]`, skip `[2,4]`, take `[3,5]`
(touching is allowed because the check is `start >= lastEnd`), take `[5,6]`.

</details>

### 6. (Complexity) What is the time complexity of Jump Game II with the greedy "window" approach?

<details><summary>Answer</summary>

**O(n) time, O(1) space.** One pass, tracking the current window end and the farthest reach.

</details>

### 7. (Spot the bug)

```js
function canCompleteCircuit(gas, cost) {
  let tank = 0, start = 0;
  for (let i = 0; i < gas.length; i++) {
    tank += gas[i] - cost[i];
    if (tank < 0) { start = i; tank = 0; }
  }
  return start;
}
```

<details><summary>Answer</summary>

Two bugs. (1) The restart must be `start = i + 1`: station `i` is where we ran out, so it
cannot be the start. (2) There is no global check: if `sum(gas) < sum(cost)` the answer is
`-1`, but this always returns an index.

</details>

### 8. (Spot the bug)

```js
const sizes = [10, 9, 1];
sizes.sort();
console.log(sizes);
```

<details><summary>Answer</summary>

Prints `[1, 10, 9]`. `sort()` without a comparator compares strings. Use
`sizes.sort((a, b) => a - b)`.

</details>

### 9. (Multiple choice) In Boats to Save People (max 2 per boat, weight limit), which person should you decide first?

A) the lightest   B) the heaviest   C) a random person   D) the median

<details><summary>Answer</summary>

**B.** The heaviest person needs a boat no matter what. Pair them with the lightest person if
the two fit; otherwise the heaviest goes alone.

</details>

### 10. (Predict the output) Task Scheduler with tasks `A A A B B B` and `n = 2`.

<details><summary>Answer</summary>

**8**: `(3 - 1) * (2 + 1) + 2 = 8`, schedule `A B idle A B idle A B`.

</details>

### 11. (Find the counterexample) Candy: "one left-to-right pass is enough." Break it.

<details><summary>Answer</summary>

Ratings `[3, 2, 1]`. One left pass gives `[1, 1, 1]`, but child 0 is rated higher than child 1
and must get more. Correct answer `[3, 2, 1]` = 6 candies.

</details>

### 12. (Multiple choice) Which problem is NOT solvable by a simple greedy?

A) Jump Game   B) Partition Labels   C) Weighted Interval Scheduling   D) Assign Cookies

<details><summary>Answer</summary>

**C.** With weights, taking the earliest-ending interval can lose a heavy interval. It needs DP
plus binary search.

</details>

### 13. (Complexity) Huffman coding on `n` symbols with a binary heap?

<details><summary>Answer</summary>

**O(n log n)**: `n - 1` merges, each with two pops and one push at O(log n).

</details>

### 14. (Spot the bug) Minimum arrows for balloons:

```js
points.sort((a, b) => a[1] - b[1]);
let arrows = 0, pos = -Infinity;
for (const [s, e] of points) if (s >= pos) { arrows++; pos = e; }
```

<details><summary>Answer</summary>

Balloons are closed intervals, so a balloon that starts exactly at `pos` is already burst.
The condition must be `s > pos`. With `[[1,2],[2,3]]` this code returns 2 instead of 1.

</details>

---

## Mastery checklist

- [ ] I can state the greedy-choice property and give an exchange argument for interval scheduling.
- [ ] I can break a wrong greedy with a tiny counter-example within a minute (coins, 0/1 knapsack, sort by start).
- [ ] I can solve Jump Game, Gas Station, Non-overlapping Intervals and Candy from scratch in under 15 minutes each.
- [ ] I know when to switch from greedy to DP and can explain why in one sentence.
- [ ] I always test my greedy against a brute force on small random inputs before trusting it.
