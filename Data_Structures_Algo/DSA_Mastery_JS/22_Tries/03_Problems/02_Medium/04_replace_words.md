# Replace Words

| | |
|---|---|
| **Topic** | Tries |
| **Difficulty** | Medium |
| **Pattern** | stop at first end flag |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #648 — https://leetcode.com/problems/replace-words/ |
| **Solution file** | [04_replace_words.js](../solutions/04_replace_words.js) — open only after a real attempt |

## Problem

You get a dictionary of "roots" and a sentence. Replace every word in the
sentence that starts with a root by that root. If several roots match, use
the SHORTEST one. Return the new sentence.

## Examples

```
dictionary = ["cat","bat","rat"], sentence = "the cattle was rattled by the battery"
Output: "the cat was rat by the bat"
dictionary = ["a","b","c"], sentence = "aadsfasf absbs bbab cadsfafs"
Output: "a a b c"
```

## Constraints & clarifying questions

```
- Words separated by single spaces? (yes)
- Lowercase only? (yes)
- If no root matches, keep the word unchanged.
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *stop at first end flag* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(words * roots * L) time. For each sentence word, try every root with startsWith, keep the shortest match.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Trie, stop at first isEnd)   O(total dictionary chars + total sentence chars). Insert all roots in a trie.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- root equals the whole word -> replaced by itself
- roots that are prefixes of other roots ("a", "ab") -> "a" wins
- empty dictionary -> sentence unchanged
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(words * roots * L) time

```
For each sentence word, try every root with startsWith, keep the shortest match.
```

### APPROACH 2 — Optimal (Trie, stop at first isEnd)   O(total dictionary chars + total sentence chars)

```
Insert all roots in a trie. For each word, walk the trie char by char:
  - if we hit a node with isEnd -> the chars so far are the shortest root, return it
  - if the path breaks -> no root, return the original word
Because we stop at the FIRST isEnd, we automatically pick the shortest root.

Dry run: roots cat, bat, rat; word "cattle"
  c -> a -> t (isEnd!) -> return "cat"
word "was": w not in root.children -> return "was"
```

### Edge cases

```
- root equals the whole word -> replaced by itself
- roots that are prefixes of other roots ("a", "ab") -> "a" wins
- empty dictionary -> sentence unchanged
```

Full JavaScript solution with tests: [04_replace_words.js](../solutions/04_replace_words.js). Run it with `node 04_replace_words.js` from the solutions folder.

</details>

## Common mistakes

- Replacing with the longest root instead of the shortest.
- Checking every root against every word (O(roots · words · L)).
- Stopping at a node that exists but is not the end of a root.

## Related follow-ups

- [Implement Trie](01_implement_trie.md)
- [Longest Word in Dictionary](03_longest_word_in_dictionary.md)
- Longest Common Prefix (LeetCode #14)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
