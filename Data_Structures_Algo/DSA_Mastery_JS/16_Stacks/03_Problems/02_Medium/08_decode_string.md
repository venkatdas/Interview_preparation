# Decode String

| | |
|---|---|
| **Topic** | Stacks |
| **Difficulty** | Medium |
| **Pattern** | nested stack |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #394 — https://leetcode.com/problems/decode-string/ |
| **Solution file** | [08_decode_string.js](../solutions/08_decode_string.js) — open only after a real attempt |

## Problem

Decode a string where k[encoded] means "repeat encoded k times". Brackets
can be nested. Digits are only used as repeat counts.

## Examples

```
Input: "3[a]2[bc]"      Output: "aaabcbc"
Input: "3[a2[c]]"       Output: "accaccacc"
Input: "2[abc]3[cd]ef"  Output: "abcabccdcdcdef"
```

## Constraints & clarifying questions

```
- Can k have multiple digits, like 12[a]? (yes)
- Is the input always valid? (yes)
- How deep can nesting go? (arbitrary -> a stack, not a fixed set of variables)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *nested stack* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (innermost-first rewriting)   O(n * maxDepth * output) time. Find the innermost k[...] (a bracket group with no '[' inside) using a regex, expand it, repeat until there are no brackets.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (stack of [previousString, repeatCount])   O(output length) time, O(n) space. Keep `currentString` and `currentNumber` as we scan.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- no brackets at all -> return as is
- multi-digit counts
- letters after the last bracket
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (innermost-first rewriting)   O(n * maxDepth * output) time

```
Find the innermost k[...] (a bracket group with no '[' inside) using a regex,
expand it, repeat until there are no brackets. Each pass rescans the string.
```

### APPROACH 2 — Optimal (stack of [previousString, repeatCount])   O(output length) time, O(n) space

```
Keep `currentString` and `currentNumber` as we scan.
  digit  -> currentNumber = currentNumber * 10 + digit
  '['    -> push [currentString, currentNumber]; reset both (start a new scope)
  ']'    -> pop [prevString, count]; currentString = prevString + currentString.repeat(count)
  letter -> currentString += letter
The stack holds the "outside world" we must return to when a bracket closes.

Dry run on "3[a2[c]]":
  '3'  number=3
  '['  push ["", 3]           string="" number=0
  'a'  string="a"
  '2'  number=2
  '['  push ["a", 2]          string="" number=0
  'c'  string="c"
  ']'  pop ["a",2] -> string = "a" + "c"*2 = "acc"
  ']'  pop ["",3]  -> string = "" + "acc"*3 = "accaccacc"
```

### Edge cases

```
- no brackets at all -> return as is
- multi-digit counts
- letters after the last bracket
```

Full JavaScript solution with tests: [08_decode_string.js](../solutions/08_decode_string.js). Run it with `node 08_decode_string.js` from the solutions folder.

</details>

## Common mistakes

- Reading only one digit of the repeat count (`12[a]`).
- Not saving the string built so far before entering a bracket.
- Recursion without tracking the shared index correctly.

## Related follow-ups

- [Basic Calculator II](11_basic_calculator.md)
- [Valid Parentheses](../01_Easy/01_valid_parentheses.md)
- Number of Atoms (LeetCode #726)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
