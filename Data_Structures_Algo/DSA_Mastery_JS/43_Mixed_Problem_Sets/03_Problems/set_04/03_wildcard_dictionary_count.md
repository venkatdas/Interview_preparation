# Wildcard Dictionary Count

| | |
|---|---|
| **Set** | [Mixed Set 04](README.md) — problem 03 of 5 |
| **Difficulty** | Medium |
| **Time box** | 25 minutes (then open Hint 1) |
| **Source** | Original exercise |
| **Solution file** | [03_wildcard_dictionary_count.js](solutions/03_wildcard_dictionary_count.js) — open only after a real attempt |

> The topic is hidden on purpose. Part of the skill being trained is recognizing the pattern on your own.

## Problem

A crossword helper has a dictionary `words` (lowercase, may contain duplicates — each
copy counts). For each pattern in `patterns`, count how many dictionary words match it.
A pattern has lowercase letters and '?' characters; '?' matches exactly one letter.
A word matches only if it has the same length as the pattern.

## Examples

```
Input: words = ["cat", "car", "cut", "cart"], patterns = ["c?t", "ca?", "????", "?"]
Output: [2, 2, 1, 0]
Input: words = [], patterns = ["a"]   Output: [0]
```

## Constraints & clarifying questions

```
- Up to 10^4 words of length <= 20, up to 10^4 patterns; few '?' per pattern usually.
- Duplicates in the dictionary count separately? (yes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 25 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1 — which patterns?</summary>

**Pattern.** Trie with end-counts + DFS that branches on wildcards. See [Tries](../../../22_Tries/README.md) and [Backtracking](../../../13_Backtracking/README.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** Compare each pattern with every word letter by letter.

</details>

<details><summary>Hint 3</summary>

**The key idea.** Store the dictionary in a trie where each node counts the words that end there. A letter follows one edge; "?" follows every edge.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- empty pattern -> counts empty words in the dictionary
- pattern longer than every word -> 0 (DFS dies quickly)
- all '?' -> number of words with exactly that length
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(P * W * L) time, O(1) extra space

```
For each pattern compare against every word character by character.
```

### APPROACH 2 — Optimal (trie with end-counts + DFS that branches on '?')   build O(W * L), query O(L) without '?' and O(26^q * L) worst case with q wildcards

```
Insert every word into a trie; each node stores how many words END there. To answer a
pattern, DFS from the root: a letter follows one child; '?' follows every child. When the
pattern is used up, add that node's end-count. Shared prefixes are walked once instead of
once per word, and branches that do not exist are never explored.

Dry run on pattern "c?t" with words cat, car, cut, cart:
  root -c-> node(c)
  '?' -> children a, u
    a -> 't'? child t exists, end-count 1  (cat)
    u -> 't'? child t exists, end-count 1  (cut)
  total 2
```

### Edge cases

```
- empty pattern -> counts empty words in the dictionary
- pattern longer than every word -> 0 (DFS dies quickly)
- all '?' -> number of words with exactly that length
```

### Common mistakes

```
- Storing a boolean isEnd instead of a count: duplicates get lost.
- Counting words that merely START with the pattern (check the end-count, not "node exists").
```

Full JavaScript solution with tests: [03_wildcard_dictionary_count.js](solutions/03_wildcard_dictionary_count.js). Run it with `node solutions/03_wildcard_dictionary_count.js` from this folder.

</details>

## Related follow-ups

- "*" matches any run of letters
- Return the matching words in lexicographic order
- Add and remove words between queries

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Write down which pattern you did NOT see at first. That is the one to drill.
- Fill in the set's reflection checklist in [QUIZ.md](../../04_Interview_And_Assessment/QUIZ.md).
- Re-solve from scratch in 3 days, then in 1 week.
