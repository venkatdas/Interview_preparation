# Encode and Decode Strings

| | |
|---|---|
| **Topic** | Strings |
| **Difficulty** | Medium |
| **Pattern** | length-prefix encoding |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #271 — https://leetcode.com/problems/encode-and-decode-strings/ |
| **Solution file** | [09_encode_and_decode_strings.js](../solutions/09_encode_and_decode_strings.js) — open only after a real attempt |

## Problem

Design encode(list) -> string and decode(string) -> list so that
decode(encode(list)) returns the original list of strings, for ANY strings
(they may contain any character, including whatever separator you pick).

## Examples

```
Input: ["hello","world"]   encode -> "5#hello5#world"   decode -> ["hello","world"]
Input: [""]                encode -> "0#"               decode -> [""]
Input: []                  encode -> ""                 decode -> []
```

## Constraints & clarifying questions

```
- Can strings contain any character, including my delimiter? (yes, that is the point)
- Can the list contain empty strings? (yes; must round-trip)
- Is the empty list distinguishable from [""]? (yes: "" vs "0#")
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *length-prefix encoding* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(total length) time, O(total) space. Join with a separator that is "unlikely" to appear, e.g.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (length prefix)   O(total length) time, O(total) space. Write each string as "&lt;length>#&lt;string>".

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- [""]          -> "0#" -> [""]
- ["#", "1#"]   -> "1##2#1#" decodes correctly because lengths drive the parsing
- multi-digit lengths ("12#...") handled by scanning for '#'
- this is the format used by many real protocols (netstrings, HTTP Content-Length)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(total length) time, O(total) space

```
Join with a separator that is "unlikely" to appear, e.g. a rare Unicode char.
Breaks as soon as an input contains that character. We implement an escaping variant
instead: escape '\' as '\\' and ',' as '\,', then join with ','. Correct, but decoding
needs a character-by-character scan with escape handling.
```

### APPROACH 2 — Optimal (length prefix)   O(total length) time, O(total) space

```
Write each string as "<length>#<string>". The decoder reads digits up to the '#',
knows exactly how many characters to take, and jumps over them - so it never looks
INSIDE a string for a delimiter. That is why '#' inside the data is harmless.

Dry run decoding "5#hello2#hi":
  i=0: read "5" up to '#' -> length 5 -> take "hello", i = 2 + 5 = 7
  i=7: read "2" up to '#' -> length 2 -> take "hi",    i = 9 + 2 = 11 = end
  ["hello","hi"]
```

### Edge cases

```
- [""]          -> "0#" -> [""]
- ["#", "1#"]   -> "1##2#1#" decodes correctly because lengths drive the parsing
- multi-digit lengths ("12#...") handled by scanning for '#'
- this is the format used by many real protocols (netstrings, HTTP Content-Length)
```

Full JavaScript solution with tests: [09_encode_and_decode_strings.js](../solutions/09_encode_and_decode_strings.js). Run it with `node 09_encode_and_decode_strings.js` from the solutions folder.

</details>

## Common mistakes

- Joining with a delimiter like "," that can appear inside the strings themselves.
- Parsing the length prefix with a single character, which breaks for strings longer than 9 characters.
- Losing empty strings, or confusing an empty list with a list containing one empty string.

## Related follow-ups

- [String Compression](11_string_compression.md) — another length-encoded format
- [Decode String](../../../16_Stacks/03_Problems/02_Medium/08_decode_string.md) — decoding a nested format with a stack
- Serialize and Deserialize Binary Tree (LeetCode #297) — the same design question for trees

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
