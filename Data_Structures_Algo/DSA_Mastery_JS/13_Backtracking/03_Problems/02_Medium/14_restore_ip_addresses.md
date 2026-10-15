# Restore IP Addresses

| | |
|---|---|
| **Topic** | Backtracking |
| **Difficulty** | Medium |
| **Pattern** | string partition with 4 parts |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #93 — https://leetcode.com/problems/restore-ip-addresses/ |
| **Solution file** | [14_restore_ip_addresses.js](../solutions/14_restore_ip_addresses.js) — open only after a real attempt |

## Problem

Given a string of digits, return all valid IPv4 addresses that can be formed by
inserting exactly three dots. Each of the 4 parts must be 0..255 and must not have
leading zeros ("01" is invalid, "0" is fine).

## Examples

```
Input: "25525511135"   Output: ["255.255.11.135","255.255.111.35"]
Input: "0000"          Output: ["0.0.0.0"]
Input: "101023"        Output: ["1.0.10.23","1.0.102.3","10.1.0.23","10.10.2.3","101.0.2.3"]
```

## Constraints & clarifying questions

```
- Only digits in the input? (yes)
- Length < 4 or > 12 -> no answer
- "0" allowed as a part, "00"/"01" not
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *string partition with 4 parts* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(1) really (at most 3 nested loops of 3 -> 27 splits). Three nested loops choose the three dot positions (each part 1-3 chars), validate all four parts.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Backtracking: partition into exactly 4 valid parts)   O(3^4) time, O(4) stack. go(start, parts): if parts.length === 4, record if start === s.length.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- "" or shorter than 4 -> []
- longer than 12 -> []
- all zeros "0000" -> ["0.0.0.0"]; "00000" -> []
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(1) really (at most 3 nested loops of 3 -> 27 splits)

```
Three nested loops choose the three dot positions (each part 1-3 chars), validate
all four parts. Because the parts have max length 3 the work is constant.
```

### APPROACH 2 — Optimal (Backtracking: partition into exactly 4 valid parts)   O(3^4) time, O(4) stack

```
go(start, parts): if parts.length === 4, record if start === s.length. Otherwise try
a piece of length 1, 2, 3 from `start`; skip invalid pieces (leading zero, > 255),
recurse. Pruning: if the remaining characters cannot fit in the remaining parts
(fewer than 1 per part or more than 3 per part), return early.

Dry run "25525511135":
  part "2" -> rest 10 chars for 3 parts (max 9) -> prune
  part "25" -> rest 9 chars, 3 parts ok -> "5","52","525(>255 skip)"... eventually nothing fits
  part "255" -> "255" -> "11" -> "135" record; "111" -> "35" record
```

### Edge cases

```
- "" or shorter than 4 -> []
- longer than 12 -> []
- all zeros "0000" -> ["0.0.0.0"]; "00000" -> []
```

Full JavaScript solution with tests: [14_restore_ip_addresses.js](../solutions/14_restore_ip_addresses.js). Run it with `node 14_restore_ip_addresses.js` from the solutions folder.

</details>

## Common mistakes

- Accepting segments with leading zeros such as `01` or `00`.
- Accepting values above 255, or forgetting a segment can be 1 to 3 digits.
- Not pruning when the remaining characters cannot fill the remaining segments (too few or more than 3 each).

## Related follow-ups

- [Palindrome Partitioning](10_palindrome_partitioning.md)
- [Letter Combinations of a Phone Number](08_letter_combinations_phone.md)
- Validate IP Address (LeetCode #468)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
