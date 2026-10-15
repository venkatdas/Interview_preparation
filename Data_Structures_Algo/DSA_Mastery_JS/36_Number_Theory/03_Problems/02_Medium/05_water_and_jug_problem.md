# Water and Jug Problem

| | |
|---|---|
| **Topic** | Number Theory (Essential) |
| **Difficulty** | Medium |
| **Pattern** | Bezout's identity / gcd |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #365 — https://leetcode.com/problems/water-and-jug-problem/ (statement paraphrased in our own words) |
| **Solution file** | [05_water_and_jug_problem.js](../solutions/05_water_and_jug_problem.js) — open only after a real attempt |

## Problem

Two empty jugs hold at most x and y liters. You may fill a jug completely, empty a jug, or pour from one into the other until the source is empty or the target is full. With an unlimited water supply, can the two jugs together contain exactly target liters?

## Examples

```
Input: x=3, y=5, target=4   Output: true
Input: x=2, y=6, target=5   Output: false   (every reachable amount is even)
Input: x=1, y=2, target=3   Output: true
```

## Constraints & clarifying questions

```
- 1 <= x, y, target <= 10^3 in the original; the math answer works for any size.
- Is target allowed to exceed x + y? (then it is impossible)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** Either a state-space BFS, or a number-theory shortcut with gcd.

</details>

<details><summary>Hint 2</summary>

**Start simple.** BFS over states (a, b) with the six moves. At most (x+1)(y+1) states.

</details>

<details><summary>Hint 3</summary>

**The key idea.** Each move changes the total water by +-x or +-y, so every total has the form a*x + b*y. Bezout's identity: those integer combinations are exactly the multiples of gcd(x, y).

</details>

<details><summary>Hint 4</summary>

**Edge cases.** target = 0 is always reachable. target > x + y never is, even if gcd divides it.

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(x * y) time and space

```
BFS from (0,0). Neighbours: fill A, fill B, empty A, empty B, pour A->B, pour B->A.
Return true when a + b === target.
```

### APPROACH 2 — Optimal (Bezout's identity)   O(log min(x, y)) time, O(1) space

```
return target <= x + y && target % gcd(x, y) === 0
Why enough: Bezout says some a*x + b*y = gcd exists; the pouring process can realise
every multiple of gcd from 0 to x + y (repeatedly fill one jug and pour into the other).
```

### Dry run

```
x=3, y=5, target=4
gcd(3,5) = 1 -> 4 % 1 === 0 and 4 <= 8 -> true
Witness: 4 = 3*3 - 5*1  (fill the 3-jug three times, empty the 5-jug once)
```

### Complexity

| Approach | Time | Space |
|---|---|---|
| BFS over states | O(x*y) | O(x*y) |
| gcd check | O(log min(x,y)) | O(1) |

### Edge cases

```
- target = 0 -> true
- target = x + y -> true (fill both)
- x = y -> only 0, x, 2x reachable
```

### Common mistakes

- Forgetting the target <= x + y capacity check.
- Running BFS with arrays of arrays as Set keys (objects compare by reference; use a string or a number key).

Full JavaScript solution with tests: [05_water_and_jug_problem.js](../solutions/05_water_and_jug_problem.js). Run it with `node 05_water_and_jug_problem.js` from the solutions folder.

</details>

## Related follow-ups

- Linear Diophantine equations a*x + b*y = c with extended Euclid (CONCEPTS)
- Check If It Is a Good Array (LeetCode 1250) — Bezout on many numbers
- Measuring Water puzzles / coin problem (Frobenius number)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
