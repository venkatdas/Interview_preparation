# Jump Game VI

| | |
|---|---|
| **Topic** | DP Optimizations (Advanced) |
| **Difficulty** | Medium |
| **Pattern** | monotonic deque over dp |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #1696 — https://leetcode.com/problems/jump-game-vi/ |
| **Solution file** | [01_jump_game_vi.js](../solutions/01_jump_game_vi.js) — open only after a real attempt |
| **Interview frequency** | Occasional at top-tier companies; the standard "follow-up: make the O(n·k) DP linear" question. |

## Problem

You stand on index 0 of an integer array `nums`. In one move you may jump forward by
1 to k positions (never past the last index). Your score is the sum of `nums[i]` over every
index you land on, including the first and the last index. Return the maximum score you can
have when you arrive at index `n - 1`.

## Examples

```
Input: nums = [1,-1,-2,4,-7,3], k = 2    Output: 7    Explanation: 0 -> 1 -> 3 -> 5 = 1 - 1 + 4 + 3
Input: nums = [10,-5,-2,4,0,3], k = 3    Output: 17   Explanation: 0 -> 3 -> 5
Input: nums = [5], k = 1                 Output: 5    Explanation: already at the end
```

## Constraints & clarifying questions

```
- 1 <= n, k <= 1e5, -1e4 <= nums[i] <= 1e4
- Must I land on the last index? (yes, its value always counts)
- Values can be negative? (yes - you cannot just "take everything")
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 40 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** DP on the index you are standing on, then a *sliding window maximum* over the dp array. Re-read the deque section of [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** `dp[i] = nums[i] + max(dp[i-k], ..., dp[i-1])`. Write this O(n·k) version first and confirm it on the examples.

</details>

<details><summary>Hint 3</summary>

**The key idea.** The inner max is over the last k dp values — a window that slides by one each step. Keep a deque of indices with decreasing dp: the front is the max; an index that is older and not better than the newest can be thrown away forever.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.** n = 1 (no jumps), k >= n, all-negative arrays. Do not use `Array.shift()` — it is O(n).

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force DP   O(n·k) time, O(n) space

```
dp[0] = nums[0]
dp[i] = nums[i] + max(dp[j]) for j in [max(0, i-k), i-1]
answer dp[n-1]
```

### APPROACH 2 — Optimal (monotonic deque)   O(n) time, O(k) space

```
for each i >= 1:
  pop front while front < i - k           (left the window)
  dp[i] = nums[i] + dp[front]
  pop back while dp[back] <= dp[i]         (older and not better -> useless)
  push i
```

Dry run on nums = [1,-1,-2,4,-7,3], k = 2:

```
i=0  dp=1    deque [0:1]
i=1  dp=0    deque [0:1, 1:0]
i=2  dp=-1   deque [0:1, 1:0, 2:-1]
i=3  drop 0; front 1 -> dp=4; pop 2,1   deque [3:4]
i=4  dp=-3   deque [3:4, 4:-3]
i=5  dp=7    deque [5:7]          answer 7
```

### Complexity

Each index is pushed once and popped at most once: O(n) time; deque holds at most k+1 indices.

### Edge cases

```
- n = 1          -> nums[0]
- k >= n         -> window is the whole prefix
- all negative   -> fewest, least-negative stops
```

### Common mistakes

- `Array.shift()` as the deque pop: hidden O(n) per call.
- Window bound off by one: allowed predecessors are `i-k .. i-1`.

Full JavaScript solution with tests: [01_jump_game_vi.js](../solutions/01_jump_game_vi.js). Run it with `node 01_jump_game_vi.js` from the solutions folder.

</details>

## Related follow-ups

- Sliding Window Maximum (LeetCode 239)
- Constrained Subsequence Sum (LeetCode 1425) — problem 03 here
- Jump Game VII (LeetCode 1871)
- Shortest Subarray with Sum at Least K (LeetCode 862)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
