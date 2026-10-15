# Distinct Echo Substrings

| | |
|---|---|
| **Topic** | Advanced String Algorithms (KMP, Z, Rolling Hash, Manacher, Suffix Array) |
| **Difficulty** | Hard |
| **Pattern** | prefix hashes, O(1) substring equality |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #1316 — https://leetcode.com/problems/distinct-echo-substrings/ |
| **Solution file** | [08_distinct_echo_substrings.js](../solutions/08_distinct_echo_substrings.js) — open only after a real attempt |

## Problem

An "echo" substring is some string concatenated with itself (a + a). Return the number
of DISTINCT echo substrings of text.

## Examples

```
Input: "abcabcabc"   Output: 3   ("abcabc", "bcabca", "cabcab")
Input: "leetcodeleetcode"   Output: 2   ("ee", "leetcodeleetcode")
```

## Constraints & clarifying questions

```
- Length up to 2000 -> O(n^2) candidates (start, half-length), each must be checked fast
- Distinct means by content, not by position
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *prefix hashes, O(1) substring equality* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n^3) time. For every start and every even length, compare the two halves character by character and put the substring in a Set.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Prefix hashes: O(1) substring comparison)   O(n^2) time, O(n) space. Precompute prefix[i] = hash of text[0..i) and powers of the base so that hash(l, r) = prefix[r] - prefix[l] * B^(r - l)   (mod M) in O(1).

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- no echoes -> 0
- "aaaa" -> "aa" and "aaaa" -> 2
- length 1 -> 0
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^3) time

```
For every start and every even length, compare the two halves character by character and
put the substring in a Set.
```

### APPROACH 2 — Optimal (Prefix hashes: O(1) substring comparison)   O(n^2) time, O(n) space

```
Precompute prefix[i] = hash of text[0..i) and powers of the base so that
  hash(l, r) = prefix[r] - prefix[l] * B^(r - l)   (mod M)
in O(1). For each start i and half-length len, the substring is an echo iff
  hash(i, i + len) === hash(i + len, i + 2 * len)
Record the hash of the whole echo (hash(i, i + 2 len) together with its length) in a Set
to count distinct ones. Collisions are extremely unlikely with a 1e9+7 modulus; a
paranoid version verifies with a real string compare when adding to the Set.
JS trap: prefix[l] * B^k is ~1e18 > 2^53 and would lose precision; use a safe mulMod.

Dry run on "abcabcabc" (n = 9):
  len = 3: i=0 "abc"=="abc" yes -> add "abcabc"; i=1 "bca"=="bca" -> add; i=2 "cab"=="cab" -> add;
           i=3 "abc"=="abc" -> "abcabc" again (same hash, Set ignores)
  len = 1, 2, 4: no equal halves -> total 3
```

### Edge cases

```
- no echoes -> 0
- "aaaa" -> "aa" and "aaaa" -> 2
- length 1 -> 0
```

Full JavaScript solution with tests: [08_distinct_echo_substrings.js](../solutions/08_distinct_echo_substrings.js). Run it with `node 08_distinct_echo_substrings.js` from the solutions folder.

</details>

## Common mistakes

- Counting the same echo substring twice when it appears at several positions; store the substring (or its hash) in a Set.
- Comparing the two halves with `slice` inside the double loop, making it O(n^3).
- Considering odd lengths; an echo string always has even length.

## Related follow-ups

- [Longest Duplicate Substring](07_longest_duplicate_substring.md)
- [Repeated Substring Pattern](../01_Easy/02_repeated_substring_pattern.md)
- Number of Distinct Substrings in a String (LeetCode #1698)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
