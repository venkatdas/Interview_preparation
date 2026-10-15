# Remove Boxes

| | |
|---|---|
| **Topic** | Interval DP |
| **Difficulty** | Hard |
| **Pattern** | 3D interval state (l, r, k) |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #546 — https://leetcode.com/problems/remove-boxes/ |
| **Solution file** | [08_remove_boxes.js](../solutions/08_remove_boxes.js) — open only after a real attempt |

## Problem

You have boxes in a row, each with a colour (a number). In one move you remove a
contiguous group of k boxes of the same colour and score k * k points. After removal
the remaining boxes close the gap. Return the maximum total score.

## Examples

```
Input: [1, 3, 2, 2, 2, 3, 4, 3, 1]   Output: 23
  Explanation: remove [2,2,2] -> 9, then [3,3,3] -> 9 (they became adjacent),
               then [1,1] -> 4, then [4] -> 1. Total 23.
Input: [1, 1, 1]   Output: 9
Input: [1]         Output: 1
```

## Constraints & clarifying questions

```
- 1 <= n <= 100, 1 <= colour <= 100
- Must every box be removed? (yes, until the row is empty)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *3D interval state (l, r, k)* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (plain recursion)   O(exponential) time, O(n) space. Try every maximal group of equal adjacent boxes as the next removal, build the new array, recurse.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Memo / Tabulation (Interval DP with a THIRD dimension)   O(n^4) time, O(n^3) space. Why a plain dp[l][r] fails: the best way to handle boxes[r] may be to SAVE it and remove it together with equal boxes that sit to the right of r (which were kept from an outer range).

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- Single box -> 1
- All same colour -> n^2
- All distinct -> n
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (plain recursion)   O(exponential) time, O(n) space

```
Try every maximal group of equal adjacent boxes as the next removal, build the new
array, recurse. Only feasible for n <= 8.
```

### APPROACH 2 — Memo / Tabulation (Interval DP with a THIRD dimension)   O(n^4) time, O(n^3) space

```
Why a plain dp[l][r] fails: the best way to handle boxes[r] may be to SAVE it and
remove it together with equal boxes that sit to the right of r (which were kept from
an outer range). The range alone does not know how many such boxes are waiting.
So we add that count to the state.

  STATE      dp[l][r][k] = max score for boxes[l..r] given that there are k extra boxes
                           of colour boxes[r] immediately to the right of r (already
                           attached, not yet scored)
  RECURRENCE Option A: remove boxes[r] together with its k attached friends now:
               dp[l][r][k] = (k + 1)^2 + dp[l][r-1][0]
             Option B: for some m in [l, r-1] with boxes[m] === boxes[r]: first clear
               boxes[m+1..r-1] completely, so boxes[m] touches boxes[r] and its k friends.
               dp[l][r][k] = max( dp[l][m][k + 1] + dp[m+1][r-1][0] )
  BASE CASES dp[l][r][k] = 0 when l > r
  ANSWER     dp[0][n-1][0]

Dry run on [1, 2, 1]:
  f(0,2,0):  option A: 1^2 + f(0,1,0)
                f(0,1,0): A: 1 + f(0,0,0) = 1 + 1 = 2 ; no m with boxes[m]==2 -> 2
                => 1 + 2 = 3
             option B: m=0 (boxes[0]==boxes[2]==1): f(0,0,1) + f(1,1,0)
                f(0,0,1): A: (1+1)^2 + f(0,-1,0) = 4 -> 4
                f(1,1,0): 1
                => 5
             answer 5  (remove the 2 first, then [1,1] for 4)

Small optimization used in all versions: boxes equal to boxes[r] directly left of r
can always be merged with it (they are never worth splitting). We leave that out of
the brute-force to keep it literal, but the DP stays correct without it too.
```

### Edge cases

```
- Single box -> 1
- All same colour -> n^2
- All distinct -> n
```

Full JavaScript solution with tests: [08_remove_boxes.js](../solutions/08_remove_boxes.js). Run it with `node 08_remove_boxes.js` from the solutions folder.

</details>

## Common mistakes

- Using only `dp[l][r]`; the answer also depends on how many boxes equal to `boxes[r]` (or `boxes[l]`) are glued on, so a third dimension k is required.
- Not first absorbing the run of equal boxes at the edge into k, which multiplies the work.
- Allocating a full n^3 table eagerly in JS when a memo Map keyed by `l,r,k` is simpler.

## Related follow-ups

- [Strange Printer](07_strange_printer.md)
- [Burst Balloons](06_burst_balloons.md)
- Zuma Game (LeetCode #488)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
