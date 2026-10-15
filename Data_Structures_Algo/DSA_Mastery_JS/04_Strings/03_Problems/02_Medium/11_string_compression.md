# String Compression

| | |
|---|---|
| **Topic** | Strings |
| **Difficulty** | Medium |
| **Pattern** | write pointer, run-length |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #443 — https://leetcode.com/problems/string-compression/ |
| **Solution file** | [11_string_compression.js](../solutions/11_string_compression.js) — open only after a real attempt |

## Problem

Given an array of characters, compress it IN PLACE: each run of a repeated character
becomes the character followed by the run length (omit the length when it is 1).
Return the new length. Runs of 10 or more produce multiple digit characters.
Use only O(1) extra space.

## Examples

```
Input: ['a','a','b','b','c','c','c']   Output: 6, array starts with ['a','2','b','2','c','3']
Input: ['a']                           Output: 1, ['a']
Input: ['a','b','b','b','b','b','b','b','b','b','b','b','b']   Output: 4, ['a','b','1','2']
```

## Constraints & clarifying questions

```
- Is it guaranteed that compression never makes the array longer? (a run of 1 writes
  1 char, a run of k >= 2 writes at most 1 + digits(k) <= k chars, so yes)
- Does the content past the returned length matter? (no)
- Write "1" for single chars? (no - that is the other variant)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *write pointer, run-length* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n) time, O(n) space. Build the compressed string in a separate array, then copy it back over the input and return its length.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (read pointer + write pointer)   O(n) time, O(1) space. `read` scans runs; `write` marks where the next output char goes.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- []                -> 0
- ['a']             -> 1, no digit written
- run of 12         -> digits '1','2' written as separate chars
- no repeats 'abc'  -> unchanged, length 3
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n) time, O(n) space

```
Build the compressed string in a separate array, then copy it back over the input
and return its length. Simple, but violates the O(1) space requirement.
```

### APPROACH 2 — Optimal (read pointer + write pointer)   O(n) time, O(1) space

```
`read` scans runs; `write` marks where the next output char goes. For each run:
write the character, then (if length > 1) write each digit of the length.
`write` never overtakes `read` because the output of a run is never longer than the run.

Dry run on ['a','a','b','b','c','c','c']:
  read=0: run of 'a' length 2 -> chars[0]='a', chars[1]='2'  write=2, read=2
  read=2: run of 'b' length 2 -> chars[2]='b', chars[3]='2'  write=4, read=4
  read=4: run of 'c' length 3 -> chars[4]='c', chars[5]='3'  write=6, read=7 = end
  return 6
```

### Edge cases

```
- []                -> 0
- ['a']             -> 1, no digit written
- run of 12         -> digits '1','2' written as separate chars
- no repeats 'abc'  -> unchanged, length 3
```

Full JavaScript solution with tests: [11_string_compression.js](../solutions/11_string_compression.js). Run it with `node 11_string_compression.js` from the solutions folder.

</details>

## Common mistakes

- Writing counts of 1 ("a1"); a single character is written without a count.
- Writing a multi-digit count as one element ("12") instead of one character per digit ("1","2").
- Building a new output array and returning its length; the compressed characters must be written back into `chars` in place.

## Related follow-ups

- [Count and Say](17_count_and_say.md) — run-length encoding repeated n times
- [Remove Duplicates from Sorted Array](../../../03_Arrays/03_Problems/01_Easy/06_remove_duplicates_from_sorted_array.md) — read/write pointers in place
- [Encode and Decode Strings](09_encode_and_decode_strings.md) — designing a reversible encoding

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
