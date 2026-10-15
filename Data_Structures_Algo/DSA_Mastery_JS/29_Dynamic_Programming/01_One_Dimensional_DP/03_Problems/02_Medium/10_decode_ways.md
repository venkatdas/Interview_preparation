# Decode Ways

| | |
|---|---|
| **Topic** | 1D Dynamic Programming |
| **Difficulty** | Medium |
| **Pattern** | count ways, look back 1 and 2 |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #91 — https://leetcode.com/problems/decode-ways/ |
| **Solution file** | [10_decode_ways.js](../solutions/10_decode_ways.js) — open only after a real attempt |

## Problem

'A' -> "1", 'B' -> "2", ..., 'Z' -> "26". Given a string of digits,
count how many ways it can be decoded into letters.

## Examples

```
Input: "12"    Output: 2   Explanation: "AB" (1 2) or "L" (12)
Input: "226"   Output: 3   Explanation: "BZ" (2 26), "VF" (22 6), "BBF" (2 2 6)
Input: "06"    Output: 0   Explanation: "06" is not valid (leading zero)
```

## Constraints & clarifying questions

```
- 1 <= s.length <= 100, only digits
- Is "0" alone decodable? (no) Is "10" decodable? (yes, as "J")

DP DEFINITION
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *count ways, look back 1 and 2* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(2^n) time, O(n) space. At each position, try taking 1 digit (if not '0') and 2 digits (if 10..26).

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 4 — Space optimized   O(n) time, O(1) space. 

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- "0"   -> 0
- "10"  -> 1
- "100" -> 0 (the second 0 has nothing valid to pair with)
- "27"  -> 1 (27 > 26, only "2","7")
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(2^n) time, O(n) space

```
At each position, try taking 1 digit (if not '0') and 2 digits (if 10..26).
```

### APPROACH 2 — Memoization   O(n) time, O(n) space


### APPROACH 3 — Tabulation   O(n) time, O(n) space

```
Dry run, s = "226":
  i    : 0   1    2     3
  dp   : 1   1    2     3
  dp[2]: '2' ok -> dp[1]=1 ; "22" ok -> dp[0]=1 ; total 2
  dp[3]: '6' ok -> dp[2]=2 ; "26" ok -> dp[1]=1 ; total 3
```

### APPROACH 4 — Space optimized   O(n) time, O(1) space


### DP definition

```
STATE:       dp[i] = number of ways to decode the first i characters s[0..i-1]
RECURRENCE:  dp[i] = (s[i-1] != '0' ? dp[i-1] : 0)                // one digit
+ (10 <= s[i-2..i-1] <= 26 ? dp[i-2] : 0)       // two digits
BASE CASES:  dp[0] = 1 (empty string: one way, decode nothing), dp[1] = s[0] != '0' ? 1 : 0
ANSWER:      dp[n]
```

### Edge cases

```
- "0"   -> 0
- "10"  -> 1
- "100" -> 0 (the second 0 has nothing valid to pair with)
- "27"  -> 1 (27 > 26, only "2","7")
```

Full JavaScript solution with tests: [10_decode_ways.js](../solutions/10_decode_ways.js). Run it with `node 10_decode_ways.js` from the solutions folder.

</details>

## Common mistakes

- Treating "0" as a valid single-digit code. A lone 0 has no letter, so it can only join the previous digit as "10" or "20".
- Accepting two-digit codes with a leading zero like "06", or codes above 26.
- Setting `dp[0] = 0`. The empty prefix has exactly one decoding, so `dp[0] = 1`.

## Related follow-ups

- [Climbing Stairs](../01_Easy/02_climbing_stairs.md)
- [Word Break](17_word_break.md)
- Decode Ways II (LeetCode 639)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
