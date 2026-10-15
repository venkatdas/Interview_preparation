# Count and Say

| | |
|---|---|
| **Topic** | Strings |
| **Difficulty** | Medium |
| **Pattern** | run-length, iteration |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #38 — https://leetcode.com/problems/count-and-say/ |
| **Solution file** | [17_count_and_say.js](../solutions/17_count_and_say.js) — open only after a real attempt |

## Problem

The count-and-say sequence starts with "1". Each next term is produced by READING the
previous term out loud: group consecutive equal digits and say "<count><digit>".
Return the n-th term (1-indexed).

## Examples

```
Input: 1   Output: "1"
Input: 2   Output: "11"     Explanation: "1" is read as "one 1"
Input: 3   Output: "21"     Explanation: "11" is "two 1s"
Input: 4   Output: "1211"   Explanation: "21" is "one 2, one 1"
Input: 5   Output: "111221" Explanation: "1211" is "one 1, one 2, two 1s"
```

## Constraints & clarifying questions

```
- n >= 1? (yes, 1 <= n <= 30)
- Can a run be longer than 9? (never in this sequence - the max digit is 3)
- Recursive or iterative? (either; iterative avoids call-stack worries)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *run-length, iteration* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n * L) time, O(L) space   (L = length of the n-th term). Recursion: countAndSay(n) = say(countAndSay(n - 1)).

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (iterative run-length encoding)   O(n * L) time, O(L) space. Start with "1".

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- n = 1         -> "1" (no iterations)
- the term length grows roughly 1.3x per step; n = 30 is ~4500 chars, fine
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n * L) time, O(L) space   (L = length of the n-th term)

```
Recursion: countAndSay(n) = say(countAndSay(n - 1)). The `say` step is built with
a global regex that captures runs, (\d)\1* , replacing each run with its length + digit.
(Note: the literal regex cannot be written inside this comment because it contains the
comment-closing sequence - a tiny JS gotcha worth knowing.)
Correct, but regex hides the actual logic the interviewer wants to see.
```

### APPROACH 2 — Optimal (iterative run-length encoding)   O(n * L) time, O(L) space

```
Start with "1". Repeat n - 1 times: scan the current term with an index, count how many
times the current digit repeats, push `count` and `digit` into an output array, continue
after the run. Join and loop. Each term is produced in one linear pass.

Dry run building term 4 from "21":
  i=0 digit '2', run length 1 -> push "1","2"
  i=1 digit '1', run length 1 -> push "1","1"
  "1211"
Then term 5 from "1211":
  '1' x1 -> "11", '2' x1 -> "12", '1' x2 -> "21"  -> "111221"
```

### Edge cases

```
- n = 1         -> "1" (no iterations)
- the term length grows roughly 1.3x per step; n = 30 is ~4500 chars, fine
```

Full JavaScript solution with tests: [17_count_and_say.js](../solutions/17_count_and_say.js). Run it with `node 17_count_and_say.js` from the solutions folder.

</details>

## Common mistakes

- Off-by-one on n: term 1 is "1", so you build n - 1 times, not n.
- Forgetting to flush the last run after the inner loop ends.
- Concatenating with `+=` inside nested loops is fine for small n, but using an array and `join` is cleaner and faster.

## Related follow-ups

- [String Compression](11_string_compression.md) — the same run-length encoding, in place
- [Zigzag Conversion](16_zigzag_conversion.md) — string simulation
- Look-and-say growth (OEIS A005150) — why the strings grow by about 30% per step

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
