# Minimum Window Substring

| | |
|---|---|
| **Topic** | Sliding Window |
| **Difficulty** | Hard |
| **Pattern** | variable, shortest, counts |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #76 — https://leetcode.com/problems/minimum-window-substring/ |
| **Solution file** | [14_minimum_window_substring.js](../solutions/14_minimum_window_substring.js) — open only after a real attempt |

## Problem

Given strings s and t, return the smallest substring of s that contains every
character of t (including duplicates). Return "" if none exists.

## Examples

```
Input: s = "ADOBECODEBANC", t = "ABC"   Output: "BANC"
Input: s = "a", t = "a"                 Output: "a"
Input: s = "a", t = "aa"                Output: ""   Explanation: need two a's
```

## Constraints & clarifying questions

```
- Duplicates in t must all be present? (yes: "aa" needs two a's)
- Case sensitive? (yes)
- Unique answer guaranteed? (yes on LeetCode)
- Any characters? (yes -> Map, not 26-array)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *variable, shortest, counts* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n^2 * m) time. For every (start, end) pair check whether the substring covers t by counting.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (variable window, shortest valid, with a `formed` counter)   O(|s| + |t|) time, O(k) space. need = counts of t.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- t longer than s -> ""
- s === t -> s
- t has repeated chars
- No valid window -> ""
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^2 * m) time

```
For every (start, end) pair check whether the substring covers t by counting.
Even the O(n^2) "count as you extend" version is too slow for 10^5.
```

### APPROACH 2 — Optimal (variable window, shortest valid, with a `formed` counter)   O(|s| + |t|) time, O(k) space

```
need = counts of t. required = need.size (distinct chars).
  window = counts inside [left, right]. formed = number of distinct chars whose
  window count >= need count.
  expand: window[ch]++; if window[ch] === need[ch] -> formed++
  while formed === required:                       (window is valid)
    record if smaller than best
    remove s[left]: window[ch]--; if window[ch] < need[ch] -> formed--
    left++
`formed` lets us test validity in O(1) instead of comparing maps.

Dry run on s = "ADOBECODEBANC", t = "ABC": need {A:1,B:1,C:1}, required 3
  r=0..5 "ADOBEC": A -> formed 1, B -> formed 2, C -> formed 3. Valid, len 6, best "ADOBEC".
    shrink: drop A (A count 0 < 1) -> formed 2, left=1. Invalid, stop shrinking.
  r=6..10 "DOBECODEBA": at r=10 the 'A' arrives -> formed 3. Window [1..10] len 10, not better.
    shrink: drop D, O (not needed), drop B (B count 1 -> 0) -> formed 2, left=4.
  r=11 'N': nothing.
  r=12 'C': window [4..12] "ECODEBANC" has A, B, C -> formed 3. len 9, not better.
    shrink: drop E, drop C (C count 2 -> 1, still enough), O, D, E -> window [9..12] "BANC" len 4, best.
    drop B -> formed 2, left=10. Invalid.
  end. "BANC"
```

### Edge cases

```
- t longer than s -> ""
- s === t -> s
- t has repeated chars
- No valid window -> ""
```

Full JavaScript solution with tests: [14_minimum_window_substring.js](../solutions/14_minimum_window_substring.js). Run it with `node 14_minimum_window_substring.js` from the solutions folder.

</details>

## Common mistakes

- Counting "formed" when a char count exceeds the need, instead of when it exactly reaches it.
- Building the answer substring on every shrink; store start and length, slice once at the end.
- Forgetting that t can contain repeated characters ("AA" needs two As).

## Related follow-ups

- [Find All Anagrams in a String](../02_Medium/07_find_all_anagrams.md) — fixed-size coverage
- [Minimum Size Subarray Sum](../02_Medium/05_minimum_size_subarray_sum.md) — shortest window that meets a condition
- Smallest Range Covering Elements from K Lists (LeetCode #632) — cover k lists with a window

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
