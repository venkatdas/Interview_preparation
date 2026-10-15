# Palindrome Pairs

| | |
|---|---|
| **Topic** | Tries |
| **Difficulty** | Hard |
| **Pattern** | reversed trie + palindrome checks |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #336 — https://leetcode.com/problems/palindrome-pairs/ |
| **Solution file** | [11_palindrome_pairs.js](../solutions/11_palindrome_pairs.js) — open only after a real attempt |

## Problem

Given a list of UNIQUE words, return all pairs of indices [i, j] (i != j)
such that words[i] + words[j] is a palindrome.

## Examples

```
Input: ["abcd","dcba","lls","s","sssll"]
Output: [[0,1],[1,0],[3,2],[2,4]]
  Explanation: "abcddcba", "dcbaabcd", "slls", "llssssll"
Input: ["bat","tab","cat"]   Output: [[0,1],[1,0]]
Input: ["a",""]              Output: [[0,1],[1,0]]
```

## Constraints & clarifying questions

```
- Words unique? (yes)
- Empty string allowed? (yes - it pairs with every palindrome word, both orders)
- Order of output pairs? (any; tests sort)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *reversed trie + palindrome checks* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n^2 * L) time. Try every ordered pair (i, j), concatenate, check palindrome.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Trie of reversed words)   O(n * L^2) time, O(n * L) space. Key insight: for words[i] + words[j] to be a palindrome, split words[i] into prefix + suffix.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- "" in the list: pairs with every palindrome in both orders
- a word that is itself a palindrome does NOT pair with itself (i != j)
- two words that are reverses of each other -> both [i,j] and [j,i]
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^2 * L) time

```
Try every ordered pair (i, j), concatenate, check palindrome.
```

### APPROACH 2 — Optimal (Trie of reversed words)   O(n * L^2) time, O(n * L) space

```
Key insight: for words[i] + words[j] to be a palindrome, split words[i] into
prefix + suffix. If `suffix` is itself a palindrome, we need words[j] to be
the REVERSE of `prefix` (and symmetric cases where words[j] is longer).

Build a trie of every word REVERSED. Each node stores:
  - wordIndex: index of the word ending here (or -1)
  - palindromeBelow: list of indices of words whose REMAINING part (below
    this node, in reversed-insert terms) is a palindrome
Then for each word w (index i), walk w forward through the trie:
  Case A: while walking, if we land on a node with wordIndex j (j != i) and
          the rest of w (not yet walked) is a palindrome -> pair [i, j].
          (w is the longer word: w = reverse(words[j]) + palindrome)
  Case B: after walking all of w, if we are at a node, every j in
          node.palindromeBelow -> pair [i, j].
          (words[j] is the longer word: words[j] = reverse(w) + palindrome,
           reversed that is palindrome + w... matches the trie walk)

Dry run: words ["lls","s"]  trie of reversed: "sll", "s"
  walk "lls" (i=0): l? root has 's' only -> stop. At root before walking,
    palindromeBelow of root would contain nothing special. No pair from here
    in case A. Case B: path broke, nothing.
  walk "s" (i=1): root -s-> node. node.wordIndex=1 (itself, skip).
    node.palindromeBelow: when inserting "sll" reversed we recorded at node 's'
    that remaining "ll" is a palindrome -> index 0. Case B -> pair [1,0]
    -> "s" + "lls" = "slls". Correct.
```

### Edge cases

```
- "" in the list: pairs with every palindrome in both orders
- a word that is itself a palindrome does NOT pair with itself (i != j)
- two words that are reverses of each other -> both [i,j] and [j,i]
```

Full JavaScript solution with tests: [11_palindrome_pairs.js](../solutions/11_palindrome_pairs.js). Run it with `node 11_palindrome_pairs.js` from the solutions folder.

</details>

## Common mistakes

- Checking all pairs with string concatenation (O(n²·L)).
- Missing the empty-string word, which pairs with every palindrome.
- Counting a word paired with itself.

## Related follow-ups

- [Valid Palindrome](../../../04_Strings/03_Problems/01_Easy/02_valid_palindrome.md) (04_Strings)
- [Longest Palindromic Substring](../../../04_Strings/03_Problems/02_Medium/07_longest_palindromic_substring.md) (04_Strings)
- [Implement Trie](../02_Medium/01_implement_trie.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
