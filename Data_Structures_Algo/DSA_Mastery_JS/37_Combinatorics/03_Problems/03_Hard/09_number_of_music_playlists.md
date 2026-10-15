# Number of Music Playlists

| | |
|---|---|
| **Topic** | Combinatorics |
| **Difficulty** | Hard |
| **Pattern** | counting DP (new vs reused item) |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #920 — https://leetcode.com/problems/number-of-music-playlists/ |
| **Solution file** | [09_number_of_music_playlists.js](../solutions/09_number_of_music_playlists.js) — open only after a real attempt |

## Problem

You have `n` different songs and want a playlist with exactly `goal` slots. Every song must
be played at least once, and a song may repeat only after `k` other songs have been played
since its last play. Count the playlists modulo 1e9+7.

## Examples

```
Input: n = 3, goal = 3, k = 1   Output: 6
Input: n = 2, goal = 3, k = 0   Output: 6
Input: n = 2, goal = 3, k = 1   Output: 2   ([1,2,1], [2,1,2])
```

## Constraints & clarifying questions

```
- 0 <= k < n <= goal <= 100
- Answer modulo 1e9+7
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** Counting with DP: track how many distinct items are used. Read *Counting with DP* in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** Backtrack slot by slot, blocking the last k songs, and check all songs appear at the end. Exponential.

</details>

<details><summary>Hint 3</summary>

**The key idea.** dp[i][j] = playlists of length i with exactly j distinct songs. New song: dp[i-1][j-1] * (n-j+1). Replay: dp[i-1][j] * (j-k) when j > k (the last k played are distinct and blocked).

</details>

<details><summary>Hint 4</summary>

**Edge cases.** goal = n -> n!. j <= k -> no replay allowed. Use mulMod for products of residues.

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^goal) time, O(goal) space

```
Backtrack over songs per slot, skip the last k, count sequences that use all n songs.
```

### APPROACH 2 — Optimal (counting DP)   O(goal * n) time, O(n) space

```
dp[0][0] = 1
dp[i][j] = dp[i-1][j-1]*(n-j+1) + dp[i-1][j]*max(j-k, 0)
answer dp[goal][n]
```

### Dry run

```
n = 2, goal = 3, k = 1
  i=0: [1,0,0]
  i=1: [0,2,0]
  i=2: [0,0,2]      (j=1 replay blocked since 1-1 = 0)
  i=3: [0,0,2]      (j=2: replay 2 * (2-1) = 2)   -> 2
```

### Complexity

- Brute force: O(n^goal) time, O(goal) space
- Optimal: O(goal * n) time, O(n) space

### Edge cases

```
- goal = n -> n!
- k = 0 -> any song may repeat immediately
```

### Common mistakes

- Using j choices for a replay instead of j-k.
- Allowing j > n (n-j+1 becomes 0 or negative).
- Forgetting the modulo after the addition.

Full JavaScript solution with tests: [09_number_of_music_playlists.js](../solutions/09_number_of_music_playlists.js). Run it with `node 09_number_of_music_playlists.js` from the solutions folder.

</details>

## Related follow-ups

- Inclusion–exclusion form: sum over i of (-1)^i C(n,i) (n-i)!/(n-i-k)! * (n-i-k)^(goal-k)
- Count surjections onto n items (Stirling numbers of the 2nd kind)
- Knight Dialer (LeetCode #935) — counting DP

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
