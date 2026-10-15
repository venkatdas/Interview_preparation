# Decode String (recursive)

| | |
|---|---|
| **Topic** | Recursion |
| **Difficulty** | Medium |
| **Pattern** | recursive descent with shared index |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md), [Stacks version](../../../16_Stacks/03_Problems/02_Medium/08_decode_string.md) |
| **Source** | LeetCode #394 — https://leetcode.com/problems/decode-string/ (statement paraphrased in our own words) |
| **Solution file** | [09_decode_string_recursive.js](../solutions/09_decode_string_recursive.js) — open only after a real attempt |

## Problem

An encoded string uses the rule k[inner]: inner is repeated exactly k times.
Brackets can nest. Return the decoded string. (Solved with a stack in
16_Stacks; here the call stack does that job for us.)

## Examples

```
"3[a]2[bc]"     -> "aaabcbc"
"3[a2[c]]"      -> "accaccacc"
"2[abc]3[cd]ef" -> "abcabccdcdcdef"
```

## Constraints & clarifying questions

```
- Input always valid? (yes). k can have several digits (e.g. 10[a]).
- Letters are lowercase; digits only appear as repeat counts.
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 35 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** Nested brackets = nested calls. The call stack replaces the explicit stack from the Stacks topic.

</details>

<details><summary>Hint 2</summary>

**Start simple.** Repeatedly find an innermost `k[letters]` and expand it, until no brackets remain.

</details>

<details><summary>Hint 3</summary>

**The key idea.** Keep ONE shared index. `decode()` reads letters and groups until it hits `]` or the end. On a digit: read the full number, skip `[`, call `decode()` for the inside, skip `]`, repeat the result.

</details>

<details><summary>Hint 4</summary>

**Edge cases.** Multi-digit counts (`10[a]`), letters after a group, empty string.

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (expand innermost bracket repeatedly)   O(output * depth) time

```
Find an innermost "k[letters]" with a regex, replace it with letters.repeat(k), and
repeat until no brackets remain. Simple, but rescans the whole string each round.
```

### APPROACH 2 — Optimal (recursive descent, shared index)   O(output) time, O(depth) stack

```
PROMISE: decode() reads from position i until the end or an unmatched ']' and returns
the decoded text for that stretch, leaving i just past what it consumed.
  letter  -> append it
  digit   -> read the whole number k, skip '[', inner = decode() (recursion for the
             nested part), skip ']', append inner.repeat(k)
  ']'     -> stop: our caller owns this bracket

Dry run "3[a2[c]]":
  decode@0: read 3, skip '[', inner = decode@2
    decode@2: 'a' -> "a"; read 2, skip '[', inner = decode@5
      decode@5: 'c' -> "c"; sees ']' at 6 -> return "c"
    skip ']' -> "a" + "cc" = "acc"; sees ']' at 7 -> return "acc"
  skip ']' -> "acc" x 3 = "accaccacc"
```

### Complexity

| Approach | Time | Space |
|---|---|---|
| innermost replace | O(output * depth) | O(output) |
| recursive descent | O(output) | O(depth) stack + output |

### Edge cases

```
- multi-digit counts: "10[a]"
- letters after a group: "2[a]bc"
- empty string -> ""
```

### Common mistakes

- Reading only one digit of the count.
- Passing the index by value (each call needs to advance the SAME position - use a closure or return [value, index]).
- Consuming the `]` inside the inner call AND the outer call.

Full JavaScript solution with tests: [09_decode_string_recursive.js](../solutions/09_decode_string_recursive.js). Run it with `node 09_decode_string_recursive.js` from the solutions folder.

</details>

## Related follow-ups

- Number of Atoms (LeetCode #726)
- Basic Calculator (LeetCode #224)
- Mini Parser (LeetCode #385)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Write down the recursive PROMISE you used in one sentence. If you could not state it, re-solve.
- Re-solve from scratch in 3 days, then in 1 week.
