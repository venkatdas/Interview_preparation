# Segmentation Ways

| | |
|---|---|
| **Set** | [Mixed Set 06](README.md) — problem 03 of 5 |
| **Difficulty** | Hard |
| **Time box** | 30 minutes (then open Hint 1) |
| **Source** | Original exercise |
| **Solution file** | [03_segmentation_ways.js](solutions/03_segmentation_ways.js) — open only after a real attempt |

> The topic is hidden on purpose. Part of the skill being trained is recognizing the pattern on your own.

## Problem

A message `s` lost its spaces. Given a dictionary `words` (distinct, non-empty,
lowercase), count how many different ways s can be split into a sequence of dictionary
words (each word may be used any number of times). Return the count modulo 1_000_000_007.

## Examples

```
Input: s = "catsand", words = ["cat", "cats", "and", "sand"]   Output: 2   Explanation: cat|sand, cats|and
Input: s = "aaa", words = ["a", "aa"]                            Output: 3   Explanation: a|a|a, a|aa, aa|a
Input: s = "", words = ["a"]                                     Output: 1   Explanation: the empty split
```

## Constraints & clarifying questions

```
- |s| up to 10^4, dictionary up to 10^4 words, word length up to 100.
- The count can be astronomically large, which is why it is returned modulo 10^9 + 7.
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1 — which patterns?</summary>

**Pattern.** DP over positions + a trie to enumerate dictionary words starting at each position. See [DP on strings](../../../29_Dynamic_Programming/03_Strings_And_Sequences/README.md) and [Tries](../../../22_Tries/README.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** Plain recursion: try each word as a prefix of the rest. Exponential.

</details>

<details><summary>Hint 3</summary>

**The key idea.** ways[i] depends only on ways[j] for j > i. From position i, walk the trie along s; each word end at j adds ways[j + 1].

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- s = "" -> 1
- no split possible -> 0
- huge counts -> apply % MOD at each addition
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   exponential time, O(n) recursion depth

```
Recursively try every dictionary word as a prefix of the remaining string, no memo.
```

### APPROACH 2 — Optimal (DP over positions + trie walk for the next word)   O(n * L) time, O(total dictionary size + n) space

```
ways[i] = number of ways to split s[i..]. ways[n] = 1. For i from n-1 down to 0, walk
the trie from s[i] forward; every time the walk reaches a word end at position j,
add ways[j + 1]. The trie stops the walk as soon as no word continues, so each
position costs at most L (longest word) steps instead of trying every word.

Dry run on "aaa", words ["a", "aa"]:
  ways[3] = 1
  i=2: "a" ends -> +ways[3]=1                      ways[2] = 1
  i=1: "a" -> +ways[2]=1, "aa" -> +ways[3]=1      ways[1] = 2
  i=0: "a" -> +ways[1]=2, "aa" -> +ways[2]=1      ways[0] = 3
```

### Edge cases

```
- s = "" -> 1
- no split possible -> 0
- huge counts -> apply % MOD at each addition
```

### Common mistakes

```
- Returning a boolean (that is the "can it be split" problem).
- Using s.slice in the inner loop (O(L) per slice -> O(n * L^2)).
```

Full JavaScript solution with tests: [03_segmentation_ways.js](solutions/03_segmentation_ways.js). Run it with `node solutions/03_segmentation_ways.js` from this folder.

</details>

## Related follow-ups

- Return all segmentations (LeetCode #140)
- Minimum number of words
- Each word has a cost: minimum total cost

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Write down which pattern you did NOT see at first. That is the one to drill.
- Fill in the set's reflection checklist in [QUIZ.md](../../04_Interview_And_Assessment/QUIZ.md).
- Re-solve from scratch in 3 days, then in 1 week.
