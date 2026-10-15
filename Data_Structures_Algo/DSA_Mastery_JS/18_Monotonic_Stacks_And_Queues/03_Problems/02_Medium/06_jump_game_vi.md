# Jump Game VI

| | |
|---|---|
| **Topic** | Monotonic Stacks and Queues |
| **Difficulty** | Medium |
| **Pattern** | DP + monotonic deque |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #1696 — https://leetcode.com/problems/jump-game-vi/ |
| **Solution file** | [06_jump_game_vi.js](../solutions/06_jump_game_vi.js) — open only after a real attempt |

## Problem

You start at index 0 and must reach index n - 1. From index i you may jump to any index
in [i + 1, i + k]. Your score is the sum of nums at every index you visit (including
0 and n - 1). Return the maximum score.

## Examples

```
Input: nums = [1,-1,-2,4,-7,3], k = 2   Output: 7    (1 -> -1 -> 4 -> 3)
Input: nums = [10,-5,-2,4,0,3], k = 3   Output: 17   (10 -> 4 -> 3)
Input: nums = [1,-5,-20,4,-1,3,-6,-3], k = 2   Output: 0
```

## Constraints & clarifying questions

```
- n up to 10^5, k up to n -> O(n * k) is too slow for large k
- Values can be negative; you must still reach the end
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *DP + monotonic deque* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (DP with inner loop)   O(n * k) time, O(n) space. dp[i] = nums[i] + max(dp[i-k ..

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (DP + monotonic deque = sliding window maximum)   O(n) time, O(k) space. "max of dp over the last k indices" is exactly a sliding window maximum.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- n = 1 -> nums[0]
- k >= n -> can jump straight to the end: nums[0] + nums[n-1] if that is best (deque handles it)
- all negative -> still forced to the end
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (DP with inner loop)   O(n * k) time, O(n) space

```
dp[i] = nums[i] + max(dp[i-k .. i-1]). Scan the k previous entries for each i.
```

### APPROACH 2 — Optimal (DP + monotonic deque = sliding window maximum)   O(n) time, O(k) space

```
"max of dp over the last k indices" is exactly a sliding window maximum. Keep a deque of
indices with DECREASING dp values; the front is the best previous position.
  for each i: drop front if it is < i - k; dp[i] = nums[i] + dp[front];
              pop back while dp[back] <= dp[i]; push i.

Dry run: nums = [1,-1,-2,4,-7,3], k = 2
  i=0: dp[0] = 1                       deque [0]
  i=1: front 0 -> dp = -1 + 1 = 0      deque [0,1]      (dp: 1, 0)
  i=2: front 0 -> dp = -2 + 1 = -1     deque [0,1,2]    (1, 0, -1)
  i=3: drop 0 (< 3-2); front 1 -> dp = 4 + 0 = 4; pop 2, pop 1 (both <= 4)  deque [3]
  i=4: front 3 -> dp = -7 + 4 = -3     deque [3,4]
  i=5: front 3 (3 >= 5-2 ok) -> dp = 3 + 4 = 7; pop 4   deque [3,5]
  answer dp[5] = 7
```

### Edge cases

```
- n = 1 -> nums[0]
- k >= n -> can jump straight to the end: nums[0] + nums[n-1] if that is best (deque handles it)
- all negative -> still forced to the end
```

Full JavaScript solution with tests: [06_jump_game_vi.js](../solutions/06_jump_game_vi.js). Run it with `node 06_jump_game_vi.js` from the solutions folder.

</details>

## Common mistakes

- Greedy "always jump to the biggest nearby value", which is wrong with negatives.
- O(n·k) DP that times out for large k.
- Not expiring deque indices older than i - k.

## Related follow-ups

- [Sliding Window Maximum](../../../17_Queues_And_Deques/03_Problems/03_Hard/07_sliding_window_maximum.md) (17_Queues_And_Deques)
- Constrained Subsequence Sum (LeetCode #1425)
- Jump Game (LeetCode #55)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
