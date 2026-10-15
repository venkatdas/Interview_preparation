# Strange Printer

| | |
|---|---|
| **Topic** | Interval DP |
| **Difficulty** | Hard |
| **Pattern** | merge equal ends |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #664 — https://leetcode.com/problems/strange-printer/ |
| **Solution file** | [07_strange_printer.js](../solutions/07_strange_printer.js) — open only after a real attempt |

## Problem

A printer can print a sequence of the SAME character over any contiguous range in one
turn, overwriting whatever is there. Starting from an empty page, return the minimum
number of turns needed to print the string s.

## Examples

```
Input: "aaabbb"   Output: 2    Explanation: print "aaa", then "bbb"
Input: "aba"      Output: 2    Explanation: print "aaa", then overwrite the middle with "b"
Input: "abcabc"   Output: 5
```

## Constraints & clarifying questions

```
- 1 <= s.length <= 100, lowercase letters
- Can a turn print a single character? (yes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *merge equal ends* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (plain recursion)   O(exponential) time, O(n) space. To print s[l..r], the first turn must print s[l] over some range s[l..k] (it is always optimal to start that turn at l).

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Memo / Tabulation (Interval DP, merge equal ends)   O(n^3) time, O(n^2) space. STATE      dp[l][r] = min turns to print s[l..r] RECURRENCE Start with dp[l][r] = 1 + dp[l+1][r]   (print s[l] alone, then the rest).

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- single char -> 1
- all same char -> 1
- all distinct -> n
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (plain recursion)   O(exponential) time, O(n) space

```
To print s[l..r], the first turn must print s[l] over some range s[l..k]
(it is always optimal to start that turn at l). Then:
  - If s[k] === s[l], the characters l and k are "free" (they come from the same turn);
    we only need s[l+1..k-1] and s[k+1..r] painted separately... this reasoning leads
    straight to the DP below, so the brute force simply tries every split.
```

### APPROACH 2 — Memo / Tabulation (Interval DP, merge equal ends)   O(n^3) time, O(n^2) space

```
STATE      dp[l][r] = min turns to print s[l..r]
  RECURRENCE Start with dp[l][r] = 1 + dp[l+1][r]   (print s[l] alone, then the rest).
             Then for every k in (l, r] with s[k] === s[l]:
               dp[l][r] = min(dp[l][r], dp[l][k-1] + dp[k+1][r])
             "The turn that prints s[l] is extended all the way to k, so s[k] costs
              nothing extra. The middle s[l+1..k-1] is painted on top (counted in
              dp[l][k-1], which includes s[l]'s turn), and s[k+1..r] is independent."
  BASE CASES dp[i][i] = 1;  dp[l][r] = 0 when l > r
  ANSWER     dp[0][n-1]

Dry run on "aba":
  len 1: dp[0][0]=1 dp[1][1]=1 dp[2][2]=1
  len 2: dp[0][1] = 1 + dp[1][1] = 2 (no k with s[k]=='a')     -> 2
         dp[1][2] = 1 + dp[2][2] = 2                             -> 2
  len 3: dp[0][2] = 1 + dp[1][2] = 3;  k=2 s[2]=='a' -> dp[0][1] + dp[3][2] = 2 + 0 = 2
         -> 2

       r=0  r=1  r=2
  l=0 [ 1 ][ 2 ][ 2 ]
  l=1 [ - ][ 1 ][ 2 ]
  l=2 [ - ][ - ][ 1 ]

Trick: collapse consecutive duplicates first ("aaabbb" -> "ab"); it never changes
the answer and makes the DP smaller.
```

### Edge cases

```
- single char -> 1
- all same char -> 1
- all distinct -> n
```

Full JavaScript solution with tests: [07_strange_printer.js](../solutions/07_strange_printer.js). Run it with `node 07_strange_printer.js` from the solutions folder.

</details>

## Common mistakes

- Not collapsing runs of equal characters first, which inflates the state space for no benefit.
- Splitting at every k instead of only where `s[k] === s[l]` (the only places where one turn can be shared).
- Forgetting the base case of a single character costing 1 turn.

## Related follow-ups

- [Remove Boxes](08_remove_boxes.md)
- [Palindrome Partitioning II](04_palindrome_partitioning_ii.md)
- Strange Printer II (LeetCode #1591)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
