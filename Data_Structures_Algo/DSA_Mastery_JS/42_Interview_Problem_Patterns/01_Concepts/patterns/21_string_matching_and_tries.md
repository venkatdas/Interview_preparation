# 21. String Matching & Trie-based Problems

Two related questions show up again and again:

- **"Where does pattern P occur in text T?"** The naive check at every position is O(n*m). **KMP**
  (prefix function) and **Rabin-Karp** (rolling hash) do it in O(n + m). The **Z-function** is a cousin of KMP.
- **"Many words, many prefix lookups."** A **trie** (prefix tree) stores words letter by letter,
  so checking a prefix costs O(length of the prefix), no matter how many words are stored. Tries
  also let a DFS search many words at once (Word Search II).

**Teaches in depth:** [Tries](../../../22_Tries/README.md), [Advanced String Algorithms](../../../33_String_Algorithms_Advanced/README.md), [Strings](../../../04_Strings/README.md)

---

## 1. Recognition clues

| Words in the problem | Tool |
|---|---|
| "find all occurrences of a pattern", "first occurrence" in O(n + m) | KMP / Z-function |
| "repeated substring pattern", "shortest palindrome", "longest happy prefix" | prefix function (borders) |
| "longest duplicate substring", "compare many substrings fast" | rolling hash + binary search |
| "starts with", "autocomplete", "search suggestions" | trie |
| "add word / search with '.' wildcard" | trie + DFS |
| "find all dictionary words in a grid" | trie + grid backtracking |
| "replace words with their shortest root" | trie walk, stop at first word end |
| "maximum XOR pair" | binary trie |

**Constraint hints**

- Text up to 10^5–10^6 and pattern up to 10^5 -> naive O(n*m) can be 10^10: use KMP.
- Up to 10^4 words and 10^4 prefix queries -> a trie answers each in O(prefix length).
- In JS, `text.indexOf(p)` is usually fast in practice, but interviews ask you to justify the worst case.

## 2. When it applies (preconditions)

- KMP: exact matching of one pattern (or a few). Characters are compared for equality only.
- Trie: a set of strings with shared prefixes, and queries walk from the start of a string.

## 3. When it does NOT apply

- **Suffix or substring-anywhere lookups with a prefix trie.** "Does any word *contain* `cat`?" A trie of words answers prefixes only. Insert all suffixes (memory heavy) or use another structure.
- **Fuzzy matching** ("within edit distance 2") — KMP does exact matches only. Use DP (edit distance) or a trie + DP walk.
- **A single lookup.** Building a trie for one `startsWith` query costs more than `word.startsWith(prefix)`.
  *Counterexample:* words `["apple"]`, one query "app": a loop with `startsWith` is O(total length) with no extra memory; the trie adds allocation for nothing.

## 4. The template

```js
// KMP prefix function: pi[i] = length of the longest proper prefix of s[0..i] that is also a suffix
function prefixFunction(s) {
  const pi = new Array(s.length).fill(0);
  for (let i = 1; i < s.length; i++) {
    let k = pi[i - 1];
    while (k > 0 && s[i] !== s[k]) k = pi[k - 1];  // fall back to the next shorter border
    if (s[i] === s[k]) k++;
    pi[i] = k;
  }
  return pi;
}

function kmpSearchAll(text, pattern) {
  if (pattern.length === 0) return Array.from({ length: text.length + 1 }, (_, i) => i);
  const pi = prefixFunction(pattern);
  const res = [];
  let k = 0;
  for (let i = 0; i < text.length; i++) {
    while (k > 0 && text[i] !== pattern[k]) k = pi[k - 1];
    if (text[i] === pattern[k]) k++;
    if (k === pattern.length) { res.push(i - k + 1); k = pi[k - 1]; }
  }
  return res;
}

// Trie (from templates.js)
class Trie {
  constructor() { this.root = { children: {}, isEnd: false }; }
  insert(word) {
    let node = this.root;
    for (const ch of word) {
      if (!node.children[ch]) node.children[ch] = { children: {}, isEnd: false };
      node = node.children[ch];
    }
    node.isEnd = true;
  }
  _walk(prefix) {
    let node = this.root;
    for (const ch of prefix) {
      node = node.children[ch];
      if (!node) return null;
    }
    return node;
  }
  search(word) { const node = this._walk(word); return node !== null && node.isEnd; }
  startsWith(prefix) { return this._walk(prefix) !== null; }
}
```

Tested in [pattern_templates.js](../../02_Implementations/pattern_templates.js) (`prefixFunction`, `kmpSearchAll`), [templates.js](../../02_Implementations/templates.js) (`Trie`) and [tests/patterns.test.js](../../tests/patterns.test.js) (KMP vs naive search and Trie vs a word list on random strings).

**Dry run** `prefixFunction("abab")`:

| i | s[i] | k before | fallback | match? | pi[i] |
|---|---|---|---|---|---|
| 1 | b | 0 | — | b vs a no | 0 |
| 2 | a | 0 | — | a vs a yes | 1 |
| 3 | b | 1 | — | b vs b yes | 2 |

## 5. Variations

- **Repeated substring pattern:** with `p = pi[n-1]`, the string repeats iff `p > 0` and `n % (n - p) === 0`.
- **Shortest palindrome:** prefix function of `s + '#' + reverse(s)`.
- **Rabin-Karp:** rolling hash `h = (h * B + code) % M`; on equal hashes, verify to avoid false positives. Use two moduli or `BigInt` to keep products below 2^53.
- **Z-function:** `z[i]` = longest common prefix of `s` and `s.slice(i)`; pattern search with `p + '$' + t`.
- **Trie with counts:** store `count` per node for "how many words start with ..." or Map Sum Pairs.
- **Word Search II:** DFS over the grid while walking the trie; delete found words to prune.

## 6. Common pitfalls

1. Using `{}` children with keys like `"constructor"` is fine here because we only read own properties set by us, but prefer `Object.create(null)` or a `Map` when keys are arbitrary.
2. Forgetting `isEnd`: "app" is a prefix of "apple" but not a word unless inserted.
3. Rolling hash overflow: `h * 31 + c` past 2^53 silently loses precision in JS. Take `%` each step and keep the base * modulus product below 2^53.
4. Building substrings in a loop (`s.slice(i, i + m) === p` at every i) — O(n*m) and lots of garbage.
5. Unicode: `s[i]` indexes UTF-16 code units; emoji are two units. `for...of` iterates code points.

## 7. Representative problems

| # | Problem | Difficulty | Why this pattern | Page |
|---|---|---|---|---|
| 1 | Find the Index of the First Occurrence | Easy | KMP | [statement](../../../33_String_Algorithms_Advanced/03_Problems/01_Easy/01_find_index_of_first_occurrence.md) · [solution](../../../33_String_Algorithms_Advanced/03_Problems/solutions/01_find_index_of_first_occurrence.js) |
| 2 | Repeated Substring Pattern | Easy | borders | [statement](../../../33_String_Algorithms_Advanced/03_Problems/01_Easy/02_repeated_substring_pattern.md) · [solution](../../../33_String_Algorithms_Advanced/03_Problems/solutions/02_repeated_substring_pattern.js) |
| 3 | Implement Trie | Medium | the structure | [statement](../../../22_Tries/03_Problems/02_Medium/01_implement_trie.md) · [solution](../../../22_Tries/03_Problems/solutions/01_implement_trie.js) |
| 4 | Add and Search Words | Medium | trie + wildcard DFS | [statement](../../../22_Tries/03_Problems/02_Medium/02_add_and_search_words.md) · [solution](../../../22_Tries/03_Problems/solutions/02_add_and_search_words.js) |
| 5 | Replace Words | Medium | shortest root in trie | [statement](../../../22_Tries/03_Problems/02_Medium/04_replace_words.md) · [solution](../../../22_Tries/03_Problems/solutions/04_replace_words.js) |
| 6 | Search Suggestions System | Medium | prefix walk | [statement](../../../22_Tries/03_Problems/02_Medium/07_search_suggestions_system.md) · [solution](../../../22_Tries/03_Problems/solutions/07_search_suggestions_system.js) |
| 7 | Longest Happy Prefix | Hard | prefix function | [statement](../../../33_String_Algorithms_Advanced/03_Problems/03_Hard/04_longest_happy_prefix.md) · [solution](../../../33_String_Algorithms_Advanced/03_Problems/solutions/04_longest_happy_prefix.js) |
| 8 | Shortest Palindrome | Hard | KMP on s#rev(s) | [statement](../../../33_String_Algorithms_Advanced/03_Problems/03_Hard/06_shortest_palindrome.md) · [solution](../../../33_String_Algorithms_Advanced/03_Problems/solutions/06_shortest_palindrome.js) |
| 9 | Longest Duplicate Substring | Hard | rolling hash + binary search | [statement](../../../33_String_Algorithms_Advanced/03_Problems/03_Hard/07_longest_duplicate_substring.md) · [solution](../../../33_String_Algorithms_Advanced/03_Problems/solutions/07_longest_duplicate_substring.js) |
| 10 | Word Search II | Hard | trie + grid DFS | [statement](../../../22_Tries/03_Problems/03_Hard/10_word_search_ii.md) · [solution](../../../22_Tries/03_Problems/solutions/10_word_search_ii.js) |

## 8. Self-check

**Q1.** Why is KMP O(n + m) even with the inner `while`?

<details><summary>Answer</summary>

`k` increases by at most 1 per character of the text and each fallback decreases it, so the total number of fallbacks is at most the total increases: O(n). Building `pi` is O(m) by the same argument.

</details>

**Q2.** What is the time to insert a word of length L into a trie, and to check a prefix of length P?

<details><summary>Answer</summary>

O(L) and O(P), independent of how many words are stored. Space is O(total characters inserted) in the worst case.

</details>

**Q3.** In Rabin-Karp, why must you compare the actual strings when hashes match?

<details><summary>Answer</summary>

Different strings can have the same hash (a collision). Comparing confirms the match. With a good modulus collisions are rare, so the expected time stays O(n + m).

</details>

---

Previous: [20. Subarray vs Subsequence](20_subarray_vs_subsequence.md) · Next: [22. State-space Search & Pruning](22_state_space_search_and_pruning.md) · [Pattern index](../../README.md)
