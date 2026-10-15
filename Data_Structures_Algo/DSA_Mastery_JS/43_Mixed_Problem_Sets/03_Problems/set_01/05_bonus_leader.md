# Bonus Leader

| | |
|---|---|
| **Set** | [Mixed Set 01](README.md) — problem 05 of 5 |
| **Difficulty** | Medium |
| **Time box** | 25 minutes (then open Hint 1) |
| **Source** | Original exercise |
| **Solution file** | [05_bonus_leader.js](solutions/05_bonus_leader.js) — open only after a real attempt |

> The topic is hidden on purpose. Part of the skill being trained is recognizing the pattern on your own.

## Problem

n employees sit in a row, numbered 0..n-1, each starting with 0 points. You get a list
of updates [l, r, delta]: every employee from l to r (inclusive) gains delta points
(delta may be negative). After all updates, return the index of the employee with the
most points. On a tie return the smallest index. n >= 1.

## Examples

```
Input: n = 5, updates = [[0, 2, 3], [1, 4, 2]]       Output: 1   Explanation: points [3,5,5,2,2]
Input: n = 3, updates = []                           Output: 0   Explanation: all zero, smallest index
Input: n = 4, updates = [[0, 3, -1], [2, 2, -5]]     Output: 0   Explanation: [-1,-1,-6,-1]
```

## Constraints & clarifying questions

```
- n and the number of updates up to 10^5 each, so applying each update cell by cell is too slow.
- 0 <= l <= r < n. Totals fit in a JS number.
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 25 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1 — which patterns?</summary>

**Pattern.** Difference array + prefix sum + running argmax. See [Prefix Sums & Difference Arrays](../../../08_Prefix_Sums_And_Difference_Arrays/README.md) and [Arrays](../../../03_Arrays/README.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** Brute force: apply each update to every cell in its range, then find the max.

</details>

<details><summary>Hint 3</summary>

**The key idea.** Mark only the two ends of every range (+delta at l, −delta at r+1). One prefix pass rebuilds all totals, and you can track the leader during that same pass.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- no updates           -> 0
- all totals negative  -> still pick the max (start best at -Infinity, not 0)
- r = n - 1            -> diff needs n + 1 slots
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n * q) time, O(n) space

```
Keep a points array and add delta to every cell of every range, then find the max.
```

### APPROACH 2 — Optimal (difference array + prefix sum + running argmax)   O(n + q) time, O(n) space

```
Record each update in a difference array: diff[l] += delta, diff[r + 1] -= delta.
A prefix sum over diff rebuilds the real points. Track the best value and the first
index that reached it during the same pass (use strict > so ties keep the smaller index).

Dry run on n = 5, updates = [[0,2,3],[1,4,2]]:
  diff after updates: [3, 2, 0, -3, 0, -2]
  i=0 run=3   best=3 at 0
  i=1 run=5   best=5 at 1
  i=2 run=5   tie -> keep 1
  i=3 run=2
  i=4 run=2
  answer 1
```

### Edge cases

```
- no updates           -> 0
- all totals negative  -> still pick the max (start best at -Infinity, not 0)
- r = n - 1            -> diff needs n + 1 slots
```

### Common mistakes

```
- diff array of size n: diff[r + 1] is out of range for r = n - 1 (in JS it silently grows the array; in other languages it crashes).
- Using >= when comparing: returns the LAST index of a tie.
```

Full JavaScript solution with tests: [05_bonus_leader.js](solutions/05_bonus_leader.js). Run it with `node solutions/05_bonus_leader.js` from this folder.

</details>

## Related follow-ups

- Return the top 3 employees
- Answer "who leads?" after every update (needs a segment tree)
- 2-D version on a grid of desks

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Write down which pattern you did NOT see at first. That is the one to drill.
- Fill in the set's reflection checklist in [QUIZ.md](../../04_Interview_And_Assessment/QUIZ.md).
- Re-solve from scratch in 3 days, then in 1 week.
