# Binary Strings Without Adjacent Ones

| | |
|---|---|
| **Topic** | Recursion Fundamentals |
| **Difficulty** | Medium |
| **Pattern** | generate with pruning |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | Original exercise |
| **Solution file** | [06_binary_strings_no_adjacent_ones.js](../solutions/06_binary_strings_no_adjacent_ones.js) — open only after a real attempt |

## Problem

Given n, return ALL binary strings of length n that never contain "11", in
lexicographic order. Generate them with recursion that never builds an invalid
prefix (pruning), and explain why the number of strings is a Fibonacci number.

## Examples

```
Input: n = 1   Output: ["0", "1"]
Input: n = 2   Output: ["00", "01", "10"]
Input: n = 3   Output: ["000", "001", "010", "100", "101"]
Input: n = 0   Output: [""]     (one empty string)
```

## Constraints & clarifying questions

```
- n up to 20 -> 2^20 ~ 1e6 candidates for brute force; the valid count is fib(22) = 17711.
- Order? (lexicographic: try '0' before '1')
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** *Generate all valid strings* (a preview of backtracking). See the choose / don't-choose template in section 13 of [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (generate all, then filter)   O(2^n * n) time. Recursively generate all 2^n strings (append '0' or '1'), keep those without "11". Most of the work is wasted on strings that were already invalid after 2 characters.

</details>

<details><summary>Hint 3</summary>

**The key idea.** Grow a prefix one character at a time. '0' is always allowed; '1' only if the previous character is not '1'. Since every prefix you build is valid, every leaf is an answer, and the count follows the Fibonacci recurrence.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- n = 0 -> [""]
- n = 1 -> ["0", "1"] (no previous character to clash with)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (generate all, then filter)   O(2^n * n) time

```
Recursively generate all 2^n strings (append '0' or '1'), keep those without "11".
Most of the work is wasted on strings that were already invalid after 2 characters.
```

### APPROACH 2 — Optimal (recursion with pruning)   O(F(n+2) * n) time, O(n) stack

```
build(prefix): if prefix.length === n, record it.
  always try '0'
  try '1' only if the last character is not '1'
Each recursive call extends a VALID prefix, so every leaf is an answer: the work is
proportional to the output. Count(n) = Count(n-1) [ends after '0'] + Count(n-2) ['10' appended]
= Fibonacci, so Count(n) = fib(n + 2).

Dry run n = 3 (recursion tree, '-' = pruned):
  ""  -> "0" -> "00" -> "000", "001"
              -> "01" -> "010", "011"-
      -> "1" -> "10" -> "100", "101"
              -> "11"-
  results: 000 001 010 100 101  (5 = fib(5))
```

### Edge cases

```
- n = 0 -> [""]
- n = 1 -> ["0", "1"] (no previous character to clash with)
```

### Common mistakes

```
- Checking the whole prefix for "11" each call (O(n) extra per call): only the last char matters.
- Pushing the shared array 'path' instead of path.join('') / a copy.
- Forgetting to pop after the recursive call when using a shared array.
```

Full JavaScript solution with tests: [06_binary_strings_no_adjacent_ones.js](../solutions/06_binary_strings_no_adjacent_ones.js). Run it with `node 06_binary_strings_no_adjacent_ones.js` from the solutions folder.

</details>

## Related follow-ups

- LeetCode #22 Generate Parentheses.
- LeetCode #1415 The k-th Lexicographical String of All Happy Strings of Length n.
- LeetCode #89 Gray Code.

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
