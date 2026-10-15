# Recursive Palindrome

| | |
|---|---|
| **Topic** | Recursion Fundamentals |
| **Difficulty** | Easy |
| **Pattern** | two-index recursion |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | Original exercise |
| **Solution file** | [02_recursive_palindrome.js](../solutions/02_recursive_palindrome.js) — open only after a real attempt |

## Problem

Return true if string s reads the same forwards and backwards, considering only
letters and digits and ignoring case. Solve it RECURSIVELY. The recursive version
must run in O(n) time: it may not create a new string on each call.

## Examples

```
Input: "racecar"                          Output: true
Input: "Was it a car or a cat I saw?"     Output: true
Input: "abca"                             Output: false
Input: ""                                 Output: true
Input: ".,!"                              Output: true   (nothing to compare)
```

## Constraints & clarifying questions

```
- Length up to 2000 -> recursion depth at most n (each skip or compare is one frame), safe in Node (limit ~10k small frames).
- Unicode letters? (assume ASCII letters and digits)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 20 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** *Two pointers written as recursion*. See section 9 (slicing trap) in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (recursion with slicing)   O(n^2) time, O(n^2) total allocation. Clean the string once, then: isPal(t) = t.length < 2 || (t[0] === t.at(-1) && isPal(t.slice(1, -1))). Looks O(n) but every slice copies up to n characters -> n/2 copies of size ~n.

</details>

<details><summary>Hint 3</summary>

**The key idea.** Pass two indices `lo` and `hi` instead of creating smaller strings. Skip non-alphanumeric characters by moving one index, compare lowercase characters, and stop when `lo >= hi`. Every call is O(1) work.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- empty string or only punctuation -> true
- single character -> true
- mixed case "Aa" -> true
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (recursion with slicing)   O(n^2) time, O(n^2) total allocation

```
Clean the string once, then: isPal(t) = t.length < 2 || (t[0] === t.at(-1) && isPal(t.slice(1, -1))).
Looks O(n) but every slice copies up to n characters -> n/2 copies of size ~n.
```

### APPROACH 2 — Optimal (recursion on two indices)   O(n) time, O(n) stack

```
check(lo, hi):
  - skip non-alphanumeric characters by moving lo right or hi left (recursive step)
  - lo >= hi -> true (zero or one character left)
  - compare lowercase s[lo], s[hi]; if equal, check(lo + 1, hi - 1)
No copying: each call does O(1) work.

Dry run "abca":
  check(0,3): 'a' vs 'a' equal -> check(1,2)
  check(1,2): 'b' vs 'c' differ -> false
```

### Edge cases

```
- empty string or only punctuation -> true
- single character -> true
- mixed case "Aa" -> true
```

### Common mistakes

```
- Slicing in every call (hidden O(n^2)).
- Base case lo === hi only: with even length lo jumps past hi and never equals it -> use lo >= hi.
- Recursing on punctuation skip with large runs of punctuation (fine here, but each skip is a frame).
```

Full JavaScript solution with tests: [02_recursive_palindrome.js](../solutions/02_recursive_palindrome.js). Run it with `node 02_recursive_palindrome.js` from the solutions folder.

</details>

## Related follow-ups

- LeetCode #125 Valid Palindrome.
- LeetCode #680 Valid Palindrome II (one deletion allowed).
- LeetCode #234 Palindrome Linked List (recursive approach).

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
