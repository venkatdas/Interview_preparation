# Stream of Characters

| | |
|---|---|
| **Topic** | Tries |
| **Difficulty** | Hard |
| **Pattern** | reversed trie |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #1032 — https://leetcode.com/problems/stream-of-characters/ |
| **Solution file** | [09_stream_of_characters.js](../solutions/09_stream_of_characters.js) — open only after a real attempt |

## Problem

Design a class StreamChecker built from a list of words. Characters arrive
one at a time through query(letter). After each letter, return true if some
SUFFIX of everything received so far is one of the words.

## Examples

```
words = ["cd","f","kl"]
query('a') -> false, query('b') -> false, query('c') -> false,
query('d') -> true  ("cd" is a suffix of "abcd")
query('e') -> false, query('f') -> true ("f"), ...
query('k') -> false, query('l') -> true ("kl")
```

## Constraints & clarifying questions

```
- Lowercase only? (yes)
- Max word length? (LeetCode: 200 -> we only need to keep the last 200 letters)
- Up to 40,000 queries -> each query must be fast.
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *reversed trie* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n * L) per query. Keep the whole stream in a string.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Trie of REVERSED words + walk backwards)   O(maxLen) per query. The question is "does some suffix match a word".

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- single-letter word -> true the moment that letter arrives
- same letter repeated with word "aa" -> true from the 2nd 'a' on
- stream longer than maxLen -> we trim, answers still correct
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n * L) per query

```
Keep the whole stream in a string. After each letter, for every word check
stream.endsWith(word).
```

### APPROACH 2 — Optimal (Trie of REVERSED words + walk backwards)   O(maxLen) per query

```
The question is "does some suffix match a word". A suffix read backwards is a
prefix of the reversed stream. So:
  - insert every word REVERSED into a trie
  - keep the last maxLen letters of the stream (older ones can never matter)
  - on query, walk from the newest letter backwards through the trie; if we
    ever hit an isEnd node -> true; if the path breaks -> false

Dry run: words cd, f, kl -> trie contains "dc", "f", "lk".
  stream "abcd": walk d -> c (isEnd!) -> true
  stream "abcde": 'e' not a root child -> false
```

### Edge cases

```
- single-letter word -> true the moment that letter arrives
- same letter repeated with word "aa" -> true from the 2nd 'a' on
- stream longer than maxLen -> we trim, answers still correct
```

Full JavaScript solution with tests: [09_stream_of_characters.js](../solutions/09_stream_of_characters.js). Run it with `node 09_stream_of_characters.js` from the solutions folder.

</details>

## Common mistakes

- Inserting words forwards and re-checking every start position (O(L²) per query).
- Keeping the whole stream instead of only the last maxLength characters.
- Stopping at the first trie node instead of at the first `isEnd`.

## Related follow-ups

- [Implement Trie](../02_Medium/01_implement_trie.md)
- [Word Search II](10_word_search_ii.md)
- Aho–Corasick automaton (multi-pattern matching)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
