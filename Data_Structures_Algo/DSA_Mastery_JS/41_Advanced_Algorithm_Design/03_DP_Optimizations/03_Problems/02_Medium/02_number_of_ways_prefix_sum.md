# Number of Ways to Reach the Target

| | |
|---|---|
| **Topic** | DP Optimizations (Advanced) |
| **Difficulty** | Medium |
| **Pattern** | prefix-sum transition |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | Original exercise |
| **Solution file** | [02_number_of_ways_prefix_sum.js](../solutions/02_number_of_ways_prefix_sum.js) — open only after a real attempt |
| **Interview frequency** | Occasional; the prefix-sum-over-dp trick appears inside many counting problems (Jump Game VII, LeetCode 1977). |

## Problem

A robot starts on tile 0 of a corridor and wants to stop exactly on tile `target`. Each
move goes forward by any whole distance `d` with `minJump <= d <= maxJump`. Some tiles are
broken (given as a list `broken`); the robot may never land on a broken tile. Count the
different move sequences that end exactly on `target`, modulo 1_000_000_007.

## Examples

```
Input: target = 4, minJump = 1, maxJump = 2, broken = []    Output: 5   (1111, 112, 121, 211, 22)
Input: target = 5, minJump = 2, maxJump = 3, broken = [4]   Output: 2   (0-2-5, 0-3-5)
Input: target = 6, minJump = 2, maxJump = 2, broken = [4]   Output: 0   (every path needs tile 4)
Input: target = 0, minJump = 1, maxJump = 3, broken = []    Output: 1   (the empty sequence)
```

## Constraints & clarifying questions

```
- 0 <= target <= 1e5, 1 <= minJump <= maxJump <= 1e5
- Can tile 0 be broken? (if so, answer 0)
- Does order matter? (yes: 1+2 and 2+1 are different sequences)
- Return the count modulo 1e9+7
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 40 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** Counting DP whose transition sums a *contiguous range* of earlier states. See "Prefix-sum transition" in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** `dp[i] = sum of dp[i-d]` for d in [minJump, maxJump] (0 if tile i is broken). That is O(target · range).

</details>

<details><summary>Hint 3</summary>

**The key idea.** The terms are `dp[i-maxJump .. i-minJump]` — one contiguous block. Maintain `pre[x] = dp[0] + ... + dp[x-1]` while you go, then the block sum is a single subtraction.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.** Clip the left end at 0, skip when `i - minJump < 0`, add MOD before `%` after subtracting, and handle a broken tile 0 or broken target.

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force DP   O(target · (maxJump - minJump + 1)) time, O(target) space

```
dp[0] = 1
dp[i] = 0 if broken, else sum over d in [minJump, maxJump], d <= i, of dp[i-d]
```

### APPROACH 2 — Optimal (prefix sums over dp)   O(target + |broken|) time, O(target) space

```
pre[0] = 0, pre[1] = dp[0] = 1
for i in 1..target:
  right = i - minJump, left = max(0, i - maxJump)
  dp[i] = (not broken and right >= 0) ? pre[right+1] - pre[left] : 0
  pre[i+1] = pre[i] + dp[i]
```

Dry run on target = 5, minJump = 2, maxJump = 3, broken = [4]:

```
i | range | dp[i]              | pre
0 |  -    | 1                  | [0,1]
1 | none  | 0                  | [0,1,1]
2 | [0,0] | pre[1]-pre[0] = 1  | [0,1,1,2]
3 | [0,1] | pre[2]-pre[0] = 1  | [0,1,1,2,3]
4 | broken| 0                  | [0,1,1,2,3,3]
5 | [2,3] | pre[4]-pre[2] = 2  | answer 2
```

### Complexity

O(1) per tile after the Set of broken tiles is built: O(target + |broken|).

### Edge cases

```
- target = 0           -> 1
- tile 0 or target broken -> 0
- negative difference under the modulus -> (a - b + MOD) % MOD
```

### Common mistakes

- Reading `pre[i - maxJump]` with a negative index (undefined -> NaN).
- Updating `pre` before `dp[i]` is final.

Full JavaScript solution with tests: [02_number_of_ways_prefix_sum.js](../solutions/02_number_of_ways_prefix_sum.js). Run it with `node 02_number_of_ways_prefix_sum.js` from the solutions folder.

</details>

## Related follow-ups

- Climbing Stairs (LeetCode 70) — the special case minJump = 1, maxJump = 2
- Jump Game VII (LeetCode 1871)
- Number of Dice Rolls With Target Sum (LeetCode 1155) — same trick per die
- Number of Ways to Separate Numbers (LeetCode 1977)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
