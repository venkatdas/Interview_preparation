# New 21 Game

| | |
|---|---|
| **Topic** | Probability and Randomization |
| **Difficulty** | Hard (LeetCode Medium) |
| **Pattern** | probability DP + sliding-window sum |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #837 — https://leetcode.com/problems/new-21-game/ (statement paraphrased, not copied) |
| **Solution file** | [10_new_21_game.js](../solutions/10_new_21_game.js) — open only after a real attempt |

## Problem

Alice starts at 0 points. While her score is less than `k` she draws a card worth a uniform random integer in 1..`maxPts` and adds it. She stops as soon as her score is at least `k`. Return the probability that her final score is at most `n`.

## Examples

```
n = 10, k = 1,  maxPts = 10 -> 1.0      (one draw, always 1..10)
n = 6,  k = 1,  maxPts = 10 -> 0.6      (one draw, 6 of 10 values are <= 6)
n = 21, k = 17, maxPts = 10 -> 0.73278
```

## Constraints & clarifying questions

```
- 0 <= k <= n <= 1e4, 1 <= maxPts <= 1e4 -> O(n * maxPts) = 1e8 is too slow
- k = 0 -> she never draws
- Answers within 1e-5 are accepted
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** Probability DP over the score. See Pattern F in section 13 of [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** Let p[x] be the probability she ever has exactly x points. p[0] = 1, and p[x] = (1/maxPts) * sum of p[x - j] for j in 1..maxPts, counting only previous scores below k (she only draws from those). Answer = sum of p[x] for k <= x <= n.

</details>

<details><summary>Hint 3</summary>

**The key idea.** The inner sum covers a sliding window of the last maxPts scores that are below k. Keep a running windowSum: add p[x] if x < k, subtract p[x - maxPts] when it leaves the window (only if it was below k). Each p[x] is then O(1).

</details>

<details><summary>Hint 4</summary>

**Edge cases.** k = 0 -> 1. If n >= k - 1 + maxPts, every final score is <= n -> 1. Scores >= k never feed later scores.

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (DP with inner loop)   O(n * maxPts) time, O(n) space

```
for x in 1..n:
    p[x] = (1/maxPts) * sum(p[x-j] for j in 1..maxPts if 0 <= x-j < k)
answer = sum(p[x] for x in k..n)
```

### APPROACH 2 — Optimal (Sliding-window probability DP)   O(n) time, O(n) space

```
if k == 0 or n >= k - 1 + maxPts: return 1
p[0] = 1, windowSum = 1, answer = 0
for x in 1..n:
    p[x] = windowSum / maxPts
    if x < k: windowSum += p[x] else answer += p[x]
    if 0 <= x - maxPts < k: windowSum -= p[x - maxPts]
return answer
```

### Dry run

```
n = 6, k = 1, maxPts = 10
  p[0] = 1, windowSum = 1
  x = 1..6: p[x] = 1/10; x >= k so answer += 0.1 each; nothing leaves the window
  answer = 0.6
```

### Complexity

- Brute force: O(n * maxPts) time, O(n) space
- Optimal: O(n) time, O(n) space

### Edge cases

```
- k = 0 -> 1
- n >= k + maxPts - 1 -> 1
- k = n -> only the exact landing scores count
```

### Common mistakes

- Adding p[x] to the window even when x >= k (those are final scores, she stops there).
- Forgetting the "x - maxPts < k" check when removing from the window.
- Thinking in terms of "the probability of winning from score s" without base cases; both directions work but must be consistent.

Full JavaScript solution with tests: [10_new_21_game.js](../solutions/10_new_21_game.js). Run it with `node 10_new_21_game.js` from the solutions folder.

</details>

## Related follow-ups

- Soup Servings (LeetCode 808)
- Dice Roll Simulation (LeetCode 1223)
- Number of Dice Rolls With Target Sum (LeetCode 1155)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
