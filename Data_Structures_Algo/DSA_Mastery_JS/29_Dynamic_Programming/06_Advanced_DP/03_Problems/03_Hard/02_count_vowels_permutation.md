# Count Vowels Permutation

| | |
|---|---|
| **Topic** | Advanced DP (Bitmask, Tree, Digit, State Machine) |
| **Difficulty** | Hard |
| **Pattern** | state machine |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #1220 — https://leetcode.com/problems/count-vowels-permutation/ |
| **Solution file** | [02_count_vowels_permutation.js](../solutions/02_count_vowels_permutation.js) — open only after a real attempt |

## Problem

Count strings of length n made of the vowels a, e, i, o, u that obey these rules:
  a -> only e may follow
  e -> a or i
  i -> a, e, o, u (anything but i)
  o -> i or u
  u -> a
Return the count modulo 1e9 + 7.

## Examples

```
Input: n = 1   Output: 5     Explanation: "a","e","i","o","u"
Input: n = 2   Output: 10    Explanation: ae, ea, ei, ia, ie, io, iu, oi, ou, ua
Input: n = 5   Output: 68
```

## Constraints & clarifying questions

```
- 1 <= n <= 2 * 10^4, so O(n) is fine, O(n^2) is not.
- Answer must be taken modulo 1e9 + 7 (the real counts explode fast).
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *state machine* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (plain recursion)   O(5 * 2^n) time, O(n) space. count(position, lastVowel): try every vowel allowed after lastVowel and recurse.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — State machine DP   O(5 * n) = O(n) time, O(n) or O(1) space. This is a "state machine" DP: the state is "which vowel did I end with".

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- n = 1 -> 5
- large n -> take modulo at every addition
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (plain recursion)   O(5 * 2^n) time, O(n) space

```
count(position, lastVowel): try every vowel allowed after lastVowel and recurse.
Branching factor is up to 4, so it is exponential. Fine for n <= 10 in tests.
```

### APPROACH 2 — State machine DP   O(5 * n) = O(n) time, O(n) or O(1) space

```
This is a "state machine" DP: the state is "which vowel did I end with".
```

### DP definition

```
STATE      dp[len][v] = number of valid strings of length len that END with vowel v.
RECURRENCE dp[len][v] = sum of dp[len - 1][p] for every vowel p that may be followed by v.
It is easier to flip the rules into "who can come BEFORE me":
             a <- e, i, u
             e <- a, i
             i <- e, o
             o <- i
             u <- i, o
BASE CASES dp[1][v] = 1 for every vowel.
ANSWER     sum of dp[n][v] over all v.
Dry run (columns a e i o u):
  len 1 : 1 1 1 1 1            sum 5
  len 2 : a=e+i+u=3, e=a+i=2, i=e+o=2, o=i=1, u=i+o=2   -> 3 2 2 1 2   sum 10
  len 3 : a=2+2+2=6, e=3+2=5, i=2+1=3, o=2, u=2+1=3     -> 6 5 3 2 3   sum 19
```

### Edge cases

```
- n = 1 -> 5
- large n -> take modulo at every addition
```

Full JavaScript solution with tests: [02_count_vowels_permutation.js](../solutions/02_count_vowels_permutation.js). Run it with `node 02_count_vowels_permutation.js` from the solutions folder.

</details>

## Common mistakes

- Reading the rules in the wrong direction ("a may be followed by e" means `next[e] += cur[a]`).
- Applying the modulo only at the end; intermediate sums overflow Number precision for large n.
- Allocating an n x 5 table when 5 rolling counters are enough.

## Related follow-ups

- [Count Numbers with Unique Digits](../02_Medium/01_count_numbers_with_unique_digits.md)
- Knight Dialer (LeetCode #935)
- [Number of Ways to Stay in the Same Place](03_number_of_ways_to_stay_in_same_place.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
