# Frog Jump with Quadratic Cost

| | |
|---|---|
| **Topic** | DP Optimizations (Advanced) |
| **Difficulty** | Hard |
| **Pattern** | convex hull trick |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | Original exercise |
| **Solution file** | [06_frog_jump_quadratic_cost.js](../solutions/06_frog_jump_quadratic_cost.js) — open only after a real attempt |
| **Interview frequency** | Rare in interviews (competitive-programming technique). Expect the O(n²) DP; CHT is a bonus. |

## Problem

Stones stand at strictly increasing positions `x[0] < x[1] < ... < x[n-1]`. A frog starts
on stone 0 and must reach stone n-1, always jumping forward; it may skip any number of
stones. A jump from stone i to stone j costs `(x[j] - x[i])^2 + C`, where `C >= 0` is a fixed
take-off cost. Return the minimum total cost.

## Examples

```
Input: x = [1,2,3,4,5], C = 6     Output: 20    (1 -> 3 -> 5: 10 + 10)
Input: x = [0,1,5,6],   C = 1     Output: 21    (every stone: 2 + 17 + 2)
Input: x = [0,3,4,6],   C = 3     Output: 23    (0 -> 3 -> 4 -> 6: 12 + 4 + 7)
Input: x = [0,10],      C = 100   Output: 200
```

## Constraints & clarifying questions

```
- 1 <= n <= 2e5, 0 <= x[i] <= 1e5 strictly increasing, 0 <= C <= 1e9
- n = 1 -> 0
- Answers and intermediate products fit in a double (< 2^53)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 45 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** `dp[j] = min over i < j of dp[i] + (x[j]-x[i])^2 + C`. Expand the square and look for something of the form `m_i · x_j + b_i`. See "Convex hull trick" in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** The O(n²) DP above is correct; write it first.

</details>

<details><summary>Hint 3</summary>

**The key idea.** `dp[j] = x_j² + C + min_i( (-2·x_i)·x_j + (dp[i] + x_i²) )`. Each earlier stone is a line with slope `-2·x_i` (decreasing) and you query at `x_j` (increasing): a monotone convex hull trick — a deque of lines plus a forward-only pointer.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.** n = 1, C = 0 (step on every stone), huge C (jump directly). Remove the middle line when `(b3-b1)(m1-m2) <= (b2-b1)(m1-m3)`.

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force DP   O(n²) time, O(n) space

```
dp[0] = 0
dp[j] = min over i < j of dp[i] + (x[j] - x[i])^2 + C
```

### APPROACH 2 — Optimal (monotone convex hull trick)   O(n) time, O(n) space

```
line for stone i: m_i = -2·x_i, b_i = dp[i] + x_i²
add line of stone 0
for j in 1..n-1:
  while next line is <= front line at x_j: drop front
  dp[j] = x_j² + C + front(x_j)
  add line of stone j (pop back while the middle of the last two + new is useless)
```

Dry run on x = [1,2,3,4,5], C = 6:

```
j | hull lines (m,b)        | min at x_j | dp[j]
0 | -                       | -          | 0        add (-2,1)
1 | (-2,1)                  | -3         | 7        add (-4,11)
2 | (-2,1)(-4,11)           | -5         | 10       add (-6,19), (-4,11) removed
3 | (-2,1)(-6,19)           | -7         | 15       add (-8,31)
4 | (-2,1)(-6,19)(-8,31)    | -11        | 20       answer
```

### Complexity

Each line is added once and removed at most once; the pointer only moves forward: O(n).

### Edge cases

```
- n = 1 -> 0
- unsorted positions would need a Li Chao tree (O(n log X)) instead
```

### Common mistakes

- Using the max-envelope condition for a min problem (or vice versa).
- Overflow in the cross-multiplication when values are large (check < 2^53 or use BigInt).

Full JavaScript solution with tests: [06_frog_jump_quadratic_cost.js](../solutions/06_frog_jump_quadratic_cost.js). Run it with `node 06_frog_jump_quadratic_cost.js` from the solutions folder.

</details>

## Related follow-ups

- Frog jump with only 1- or 2-stone jumps (classic easy DP)
- Minimum cost with a Li Chao tree when positions are not sorted
- Allocate Mailboxes (LeetCode 1478)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
