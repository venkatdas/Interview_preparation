# Frog Jump

| | |
|---|---|
| **Topic** | Advanced DP (Bitmask, Tree, Digit, State Machine) |
| **Difficulty** | Hard |
| **Pattern** | memo with Map key `${i},${k}` |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #403 — https://leetcode.com/problems/frog-jump/ |
| **Solution file** | [04_frog_jump.js](../solutions/04_frog_jump.js) — open only after a real attempt |

## Problem

A frog crosses a river on stones placed at the given sorted positions. It starts on
stone 0 with a first jump of exactly 1 unit. If its last jump was k units, the next
jump must be k - 1, k or k + 1 units (and only forward, landing on a stone).
Can the frog reach the last stone?

## Examples

```
Input: [0,1,3,5,6,8,12,17]    Output: true
  Explanation: 0->1 (1), 1->3 (2), 3->5 (2), 5->8 (3), 8->12 (4), 12->17 (5)
Input: [0,1,2,3,4,8,9,11]     Output: false   Explanation: the gap 4 -> 8 is too big
```

## Constraints & clarifying questions

```
- 2 <= n <= 2000, stones strictly increasing, stones[0] = 0.
- The first jump must be exactly 1, so if stones[1] != 1 the answer is false.
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *memo with Map key `${i},${k}`* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (plain recursion)   O(3^n) time, O(n) space. canCross(index, lastJump): try jumps lastJump - 1, lastJump, lastJump + 1, look up whether a stone exists at that position (Map position -> index), recurse.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 3 — Tabulation with a set of jump sizes per stone   O(n^2) time, O(n^2) space. dp[i] = Set of jump sizes that can land ON stone i.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- stones[1] !== 1 -> false immediately
- two stones [0,1] -> true
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (plain recursion)   O(3^n) time, O(n) space

```
canCross(index, lastJump): try jumps lastJump - 1, lastJump, lastJump + 1, look up
whether a stone exists at that position (Map position -> index), recurse.
```

### APPROACH 2 — Memoised recursion (Map key trick)   O(n^2) time, O(n^2) space

### APPROACH 3 — Tabulation with a set of jump sizes per stone   O(n^2) time, O(n^2) space

```
dp[i] = Set of jump sizes that can land ON stone i. Process stones left to right:
for every k in dp[i], for step in {k-1, k, k+1} (step > 0), if stones[i] + step is a
stone j, add step to dp[j]. Answer: dp[last] is non-empty.

Dry run [0,1,3,5,6,8,12,17]:
  dp[0] = {0}  (pretend we arrived with jump 0 so the first jump can be 1)
  stone 0 (pos 0): k=0 -> step 1 -> pos 1 is stone 1 -> dp[1] = {1}
  stone 1 (pos 1): k=1 -> steps 1,2 -> pos 2 (no stone), pos 3 -> dp[2] = {2}
  stone 2 (pos 3): k=2 -> steps 1,2,3 -> pos 4 no, pos 5 -> dp[3]={2}, pos 6 -> dp[4]={3}
  ...continues until dp[7] gets a value -> true
```

### DP definition

```
STATE      reach(i, k) = can we reach the end standing on stone i, having arrived
with a jump of size k?
RECURRENCE reach(i, k) = OR over step in {k-1, k, k+1}, step > 0:
there is a stone j at stones[i] + step  AND  reach(j, step)
BASE CASES reach(last, anything) = true.
The jump size k can be at most i (you add at most 1 per stone), so there are at most
n * n states. Key the memo with `${i},${k}`.
```

### Edge cases

```
- stones[1] !== 1 -> false immediately
- two stones [0,1] -> true
```

Full JavaScript solution with tests: [04_frog_jump.js](../solutions/04_frog_jump.js). Run it with `node 04_frog_jump.js` from the solutions folder.

</details>

## Common mistakes

- Forgetting that the first jump must be exactly 1.
- Allowing a jump of size 0 (k - 1 when k = 1), which makes the frog stay in place forever.
- Searching for the next stone with a linear scan; keep a Map from position to stone index.

## Related follow-ups

- [Jump Game](../../../01_One_Dimensional_DP/03_Problems/02_Medium/11_jump_game.md)
- [Jump Game II](../../../01_One_Dimensional_DP/03_Problems/02_Medium/12_jump_game_ii.md)
- Jump Game V (LeetCode #1340)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
