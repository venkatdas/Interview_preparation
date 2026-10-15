# Valid Parenthesis String

| | |
|---|---|
| **Topic** | Greedy Algorithms |
| **Difficulty** | Medium |
| **Pattern** | greedy min/max range |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #678 — https://leetcode.com/problems/valid-parenthesis-string/ |
| **Solution file** | [14_valid_parenthesis_string.js](../solutions/14_valid_parenthesis_string.js) — open only after a real attempt |

## Problem

A string contains '(', ')' and '*'. Each '*' may be treated as '(', ')' or an empty string.
Return true if the string can be made into a valid parentheses string.

## Examples

```
Input: "()"      Output: true
Input: "(*)"     Output: true   Explanation: '*' as empty
Input: "(*))"    Output: true   Explanation: '*' as '('
Input: ")("      Output: false
```

## Constraints & clarifying questions

```
- Empty string valid? (yes)
- Only those three characters? (yes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *greedy min/max range* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(3^k) time (k = number of '*'). Try all three meanings for each '*' and validate each resulting string.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (greedy min/max open count)   O(n) time, O(1) space. Instead of tracking one "open count", track the RANGE of possible open counts: lo = fewest opens possible so far  (treat every '*' as ')') hi = most opens possible so far    (treat every '*' as '(') '(' : lo++, hi++        ')' : lo--, hi--        '*' : lo--, h

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- "" -> true
- "*" -> true
- ")" -> false (hi goes negative)
- "(((" -> false (lo stays 3)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(3^k) time (k = number of '*')

```
Try all three meanings for each '*' and validate each resulting string.
```

### APPROACH 2 — Optimal (greedy min/max open count)   O(n) time, O(1) space

```
Instead of tracking one "open count", track the RANGE of possible open counts:
  lo = fewest opens possible so far  (treat every '*' as ')')
  hi = most opens possible so far    (treat every '*' as '(')
'(' : lo++, hi++        ')' : lo--, hi--        '*' : lo--, hi++
If hi < 0, even all-'(' interpretation fails -> false.
lo can never be useful below 0, so clamp it to 0 (a '*' that would make it negative is
just treated as empty instead). At the end, valid iff lo === 0.
```

### WHY GREEDY WORKS

```
The set of achievable open counts after each prefix is always a contiguous range [lo, hi]
(changing one '*' moves the count by 1, so no gaps). We never commit a '*' to a meaning;
we keep the whole range alive and only discard impossible counts (negative). So the final
check "0 is in the range" is exact, not a heuristic.

Dry run on "(*))":
  '(' lo=1 hi=1
  '*' lo=0 hi=2
  ')' lo=-1->0 hi=1
  ')' lo=-1->0 hi=0   -> lo === 0 -> true
```

### Edge cases

```
- "" -> true
- "*" -> true
- ")" -> false (hi goes negative)
- "(((" -> false (lo stays 3)
```

Full JavaScript solution with tests: [14_valid_parenthesis_string.js](../solutions/14_valid_parenthesis_string.js). Run it with `node 14_valid_parenthesis_string.js` from the solutions folder.

</details>

## Common mistakes

- Letting the minimum possible open count go below 0 instead of clamping it to 0.
- Not returning false immediately when the MAXIMUM open count drops below 0.
- Checking `max === 0` at the end instead of `min === 0`.

## Related follow-ups

- [Valid Parentheses](../../../16_Stacks/03_Problems/01_Easy/01_valid_parentheses.md)
- Minimum Add to Make Parentheses Valid (LeetCode #921)
- Minimum Remove to Make Valid Parentheses (LeetCode #1249)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
