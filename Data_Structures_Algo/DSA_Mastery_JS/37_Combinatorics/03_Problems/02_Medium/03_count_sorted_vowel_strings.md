# Count Sorted Vowel Strings

| | |
|---|---|
| **Topic** | Combinatorics |
| **Difficulty** | Medium |
| **Pattern** | stars and bars |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #1641 — https://leetcode.com/problems/count-sorted-vowel-strings/ |
| **Solution file** | [03_count_sorted_vowel_strings.js](../solutions/03_count_sorted_vowel_strings.js) — open only after a real attempt |

## Problem

Count the strings of length `n` that use only the letters a, e, i, o, u and whose letters
never go backwards in the alphabet (each letter is equal to or after the one before it).

## Examples

```
Input: n = 1    Output: 5
Input: n = 2    Output: 15
Input: n = 33   Output: 66045
```

## Constraints & clarifying questions

```
- 1 <= n <= 50
- Repeats allowed? (yes, "aa" is sorted)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** Combinations *with repetition*. Read *Stars and bars* in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** DP over the last letter: a new letter w may follow any letter v <= w.

</details>

<details><summary>Hint 3</summary>

**The key idea.** A sorted string is fixed once you know how many a's, e's, i's, o's and u's it has. Count solutions of x1+...+x5 = n with x >= 0: C(n+4, 4).

</details>

<details><summary>Hint 4</summary>

**Edge cases.** (n+1)(n+2)(n+3)(n+4) is divisible by 24 because it is a product of 4 consecutive integers, so integer division is exact.

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(25 n) time, O(1) space

```
dp[v] = sorted strings ending in vowel v. next[w] = dp[0] + ... + dp[w].
```

### APPROACH 2 — Optimal (stars and bars)   O(1) time, O(1) space

```
answer = C(n + 4, 4) = (n+1)(n+2)(n+3)(n+4) / 24
```

### Dry run

```
n = 2: (3*4*5*6) / 24 = 360 / 24 = 15
```

### Complexity

- Brute force: O(25 n) time, O(1) space
- Optimal: O(1) time, O(1) space

### Edge cases

```
- n = 1 -> 5
- n = 50 -> 316251
```

### Common mistakes

- Using C(n+5, 5) or C(n+4, 5): count bars carefully, 5 bins need 4 bars.
- Enumerating 5^n strings (too slow for n = 50).

Full JavaScript solution with tests: [03_count_sorted_vowel_strings.js](../solutions/03_count_sorted_vowel_strings.js). Run it with `node 03_count_sorted_vowel_strings.js` from the solutions folder.

</details>

## Related follow-ups

- Combination Sum IV vs combinations with repetition (LeetCode #377)
- Distribute Candies Among Children II (problem 05 here)
- Number of non-decreasing arrays of length n with values in [1, m] — C(n+m-1, n)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
