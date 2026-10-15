# Find All Anagrams in a String

| | |
|---|---|
| **Topic** | Hashing (Hash Maps and Sets) |
| **Difficulty** | Medium |
| **Pattern** | frequency + window |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #438 — https://leetcode.com/problems/find-all-anagrams-in-a-string/ |
| **Solution file** | [13_find_all_anagrams.js](../solutions/13_find_all_anagrams.js) — open only after a real attempt |

## Problem

Given strings s and p, return all start indices of p's anagrams in s.

## Examples

```
Input: s = "cbaebabacd", p = "abc"   Output: [0, 6]   Explanation: "cba" at 0, "bac" at 6
Input: s = "abab", p = "ab"          Output: [0, 1, 2]
```

## Constraints & clarifying questions

```
- Lowercase letters only? (yes -> 26-slot arrays work; we use Map to show hashing)
- p longer than s? (then no answers, return [])
- Overlapping matches allowed? (yes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *frequency + window* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n * m) time, O(m) space. For every window of length m in s, count its letters and compare with p's counts.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (frequency map + fixed window, track "matched" count)   O(n) time, O(k) space. Hashing view: we never rebuild counts.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- p longer than s -> []
- s === p -> [0]
- p with repeated letters ("aab")
- No match at all -> []
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n * m) time, O(m) space

```
For every window of length m in s, count its letters and compare with p's counts.
Each comparison costs O(m).
```

### APPROACH 2 — Optimal (frequency map + fixed window, track "matched" count)   O(n) time, O(k) space

```
Hashing view: we never rebuild counts. Keep a Map `need` = counts of p. Keep a counter
`matched` = how many distinct letters currently have exactly the right count.
Slide a window of size m over s:
  - add s[right]: decrement need[ch]. If it becomes 0 -> matched++. If it goes from 0 to -1 -> matched--.
  - remove s[left] when window is too big: increment need[ch]. If it becomes 0 -> matched++;
    if it went from 0 to 1 -> matched--.
  - window is an anagram when matched === number of distinct letters in p.
Each character enters and leaves once -> O(n). Comparing maps every time would be O(26n).

Dry run on s = "abab", p = "ab": need {a:1, b:1}, distinct = 2
  r=0 'a': need a:0 -> matched 1
  r=1 'b': need b:0 -> matched 2, window [0,1] size 2 == m -> record 0
  r=2 'a': need a:-1 -> matched 1; window too big, remove s[0]='a': need a:0 -> matched 2 -> record 1
  r=3 'b': need b:-1 -> matched 1; remove s[1]='b': need b:0 -> matched 2 -> record 2
  result [0, 1, 2]
```

### Edge cases

```
- p longer than s -> []
- s === p -> [0]
- p with repeated letters ("aab")
- No match at all -> []
```

Full JavaScript solution with tests: [13_find_all_anagrams.js](../solutions/13_find_all_anagrams.js). Run it with `node 13_find_all_anagrams.js` from the solutions folder.

</details>

## Common mistakes

- Recounting every window from scratch (O(n·m)) instead of adding one char and removing one.
- Comparing two count objects with `===`; compare a "matches" counter or the arrays element by element.
- Forgetting the case where p is longer than s (answer is empty).

## Related follow-ups

- [Find All Anagrams in a String (Sliding Window)](../../../07_Sliding_Window/03_Problems/02_Medium/07_find_all_anagrams.md) — the window view
- [Permutation in String](../../../07_Sliding_Window/03_Problems/02_Medium/06_permutation_in_string.md) — return true on the first match
- [Minimum Window Substring](../../../07_Sliding_Window/03_Problems/03_Hard/14_minimum_window_substring.md) — variable-size coverage window

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
