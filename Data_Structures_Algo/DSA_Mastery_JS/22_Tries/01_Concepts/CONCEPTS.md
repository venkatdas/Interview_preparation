# Tries (Prefix Trees)

> **Prerequisites:** [Strings](../../04_Strings/README.md), [Hashing](../../05_Hashing/README.md) (Map for children), [N-ary Trees](../../20_Trees/02_N_Ary_Trees_And_Misc/README.md) (a trie is an N-ary tree keyed by characters), [Backtracking](../../13_Backtracking/README.md) (DFS with wildcard / board search), [Bit Manipulation](../../14_Bit_Manipulation/README.md) (binary trie).

A **trie** (say "try") is a tree that stores strings **one character per edge**. Words that share
a prefix share the same path from the root, so "car", "card" and "care" are stored as
`c -> a -> r` once, with the endings branching off. Think of a phone's autocomplete: as you type
`c`, `a`, `r`, it walks down the tree and shows everything hanging below the node you reached.

---

## Why it matters / when to use

Reach for a trie when the problem has any of these signals:

- "Starts with", "prefix", "autocomplete", "search suggestions", "type-ahead"
- A **dictionary of words** plus many queries against it (spell check, word games)
- "Shortest root that is a prefix of this word" (Replace Words)
- Wildcard matching with `.` on a dictionary (Add and Search Words)
- Search many words on a grid at once (Word Search II) → trie + backtracking
- "Maximum XOR of two numbers" → **binary trie** over bits
- "Does any suffix of the stream match a word" → trie of **reversed** words
- Anything where a hash set would force you to try every prefix of every string

---

## How it works

Insert `app`, `apple`, `apt`, `bat`:

```
                 (root)
                /      \
               a        b
               |        |
               p        a
             /   \      |
            p*    t*    t*
            |
            l
            |
            e*
```

`*` marks **end of word** (`isEnd = true`). Without this flag `search("ap")` would wrongly say
yes, because the path `a -> p` exists. Path exists = **prefix**; path exists AND flag set = **word**.

Each node holds:

```
{ children: Map<char, node>, isEnd: boolean }
```

Three choices for `children`:

| Representation | Pros | Cons |
|----------------|------|------|
| `Map` / plain object | any alphabet, only allocates used letters | a bit slower than an array |
| `Array(26)` | fastest, cache friendly | 26 slots per node even if 1 is used; lowercase only |
| `[null, null]` (binary) | for bits | only for numeric/XOR problems |

Use a `Map` in interviews unless the problem says "lowercase a-z only" and you want to show off.

### insert / search / startsWith walk-through

```
insert("apt"):  node = root
                'a' -> exists, go down
                'p' -> exists, go down
                't' -> missing, create, go down
                mark isEnd on the 't' node

search("ap"):   root -a-> -p->  reached a node, but isEnd is false  -> false
startsWith("ap"): same walk, path never broke                        -> true
search("apx"):  root -a-> -p-> 'x' missing                           -> false
```

Every operation walks **at most L steps** (L = length of the string). The number of words in
the trie does not matter. That is why a trie beats "loop over the dictionary" when there are
many queries.

### Deletion

Walk down to the word, clear `isEnd`. On the way back up remove any child that now has
**no children and is not a word** (otherwise you would delete `app` while removing `apple`).
Full code in `trie.js`.

### Memory trade-offs

A trie uses one node per **distinct prefix**. For a dictionary of unrelated long words it can
use more memory than a hash set (each node is an object with a Map). For words that share
prefixes (real languages, URLs, file paths) it uses less. Rule of thumb: trie when you need
**prefix** queries; hash set when you only need **exact** lookups.

### Trie vs hash set

| Need | Hash set | Trie |
|------|----------|------|
| exact word lookup | O(L) | O(L) |
| "any word with this prefix?" | O(n * L) | O(L) |
| list all words with prefix | O(n * L) | O(L + output) |
| wildcard / one-letter-off | O(n * L) | O(26^dots * L) but prunes well |
| memory | compact | one object per prefix |

---

## Pseudocode

```
Node: children (map char -> Node), isEnd = false

INSERT(word):
    node = root
    for ch in word:
        if ch not in node.children: node.children[ch] = new Node
        node = node.children[ch]
    node.isEnd = true

FIND(prefix):                     # shared by search and startsWith
    node = root
    for ch in prefix:
        node = node.children[ch]
        if node is missing: return null
    return node

SEARCH(word):      n = FIND(word);   return n != null and n.isEnd
STARTS_WITH(p):    return FIND(p) != null

COLLECT(prefix):                  # autocomplete
    start = FIND(prefix); if null: return []
    DFS(start, prefix): if node.isEnd: output path
                        for (ch, child) in node.children: DFS(child, path + ch)
```

---

## Operations & complexity

| Operation | Time | Space | Note |
|-----------|------|-------|------|
| insert(word) | O(L) | O(L) new nodes worst case | L = word length |
| search(word) | O(L) | O(1) | must check isEnd at the end |
| startsWith(prefix) | O(L) | O(1) | only the path must exist |
| delete(word) | O(L) | O(L) recursion | prune empty nodes on the way up |
| collect words with prefix | O(L + total chars below) | O(output) | DFS from the prefix node |
| count words with prefix | O(L) | O(1) | if each node stores a `count` |
| build from n words | O(n * L) | O(n * L) worst case | |

---

## JavaScript implementation

Full code with tests: `trie.js`. Core idea:

```js
class TrieNode {
  constructor() { this.children = new Map(); this.isEnd = false; }
}

class Trie {
  constructor() { this.root = new TrieNode(); }

  insert(word) {
    let node = this.root;
    for (const ch of word) {
      if (!node.children.has(ch)) node.children.set(ch, new TrieNode());
      node = node.children.get(ch);
    }
    node.isEnd = true;
  }

  #findNode(str) {               // shared walker for search & startsWith
    let node = this.root;
    for (const ch of str) {
      node = node.children.get(ch);
      if (!node) return null;
    }
    return node;
  }

  search(word)       { const n = this.#findNode(word); return n !== null && n.isEnd; }
  startsWith(prefix) { return this.#findNode(prefix) !== null; }
}
```

`trie.js` also has `delete`, `collectWordsWithPrefix` and `countWordsWithPrefix` (each node
keeps a `count` of words passing through it).

`binary_trie.js` is the **bitwise trie** used for XOR problems (see pattern 5).

---

## Dry run

**Insert "app", "apple", "bat", then search:**

| Step | Operation | Nodes walked / created | Result |
|---|---|---|---|
| 1 | insert "app" | create a, p, p; mark last p isEnd | root → a → p → p* |
| 2 | insert "apple" | walk a, p, p; create l, e; mark e isEnd | ... p* → l → e* |
| 3 | insert "bat" | create b, a, t; mark t isEnd | root → b → a → t* |
| 4 | search "app" | a → p → p, isEnd = true | **true** |
| 5 | search "appl" | a → p → p → l, isEnd = false | **false** |
| 6 | startsWith "appl" | node exists | **true** |
| 7 | search "ba" | b → a, isEnd = false | **false** |
| 8 | startsWith "c" | no child "c" at root | **false** |

(`*` marks `isEnd = true`.)

---

## Patterns / variations

### 1. Store data on nodes (not just a flag)

Instead of `isEnd`, store what you need at the end node: the full word (Word Search II), a value
(Map Sum Pairs), an index (Palindrome Pairs), a count. Saves rebuilding strings during DFS.

```js
node.word = word;        // Word Search II: push node.word, then set it to null (no duplicates)
node.sum += delta;       // Map Sum Pairs: every node on the path accumulates the key's value
```

### 2. Trie + DFS with wildcard / edit budget

```js
function search(node, word, i, changesLeft) {
  if (i === word.length) return node.isEnd && changesLeft === 0;
  for (const [ch, child] of node.children) {
    if (ch === word[i]) { if (search(child, word, i + 1, changesLeft)) return true; }
    else if (changesLeft > 0 && search(child, word, i + 1, changesLeft - 1)) return true;
  }
  return false;
}
```
Use when: `.` wildcards (Add and Search Words), "exactly one letter different" (Magic Dictionary).

### 3. Walk and stop at the first end flag

```js
function shortestRoot(root, word) {
  let node = root;
  for (let i = 0; i < word.length; i++) {
    node = node.children.get(word[i]);
    if (!node) return word;                   // no root matches
    if (node.isEnd) return word.slice(0, i + 1); // first flag = shortest root
  }
  return word;
}
```
Use when: Replace Words, "longest word built one letter at a time" (stop when a node is NOT an end).

### 4. Trie + backtracking on a grid

Walk the board and the trie **together**. Only step to a neighbour if the trie has that letter.
Mark the cell `#` while in use, restore it after. Prune trie branches that are fully found.
Use when: Word Search II, Boggle-style "find all words".

### 5. Binary (bitwise) trie for XOR

Insert numbers as 31-bit strings from the most significant bit down. To maximize `x XOR y`,
walk from the top bit and at each level go to the **opposite** bit of `x` if that child exists.
A 1 in a higher bit beats everything below, so greedy is correct.

```js
let node = root, result = 0;
for (let bit = 30; bit >= 0; bit--) {
  const b = (x >> bit) & 1, want = 1 - b;
  if (node.children[want]) { result |= 1 << bit; node = node.children[want]; }
  else node = node.children[b];
}
```
Use when: Maximum XOR of Two Numbers (421), Maximum XOR With an Element From Array (1707).

### 6. Trie of reversed words (suffix questions)

"Does any suffix of the stream match a word?" A suffix read backwards is a prefix of the
reversed stream. Insert words **reversed**, then walk from the newest character backwards.
Use when: Stream of Characters, Palindrome Pairs.

### 7. Autocomplete with sorted DFS

Visit children in sorted key order and stop after k results. Use when: Search Suggestions,
Top K autocomplete.

---

## Alternatives (brute force vs optimized)

| Need | Simple approach | Trie approach | Other options |
|---|---|---|---|
| Exact word lookup | `Set` of words: O(L) per lookup | O(L) | Set uses less memory; prefer it when no prefix queries |
| "Any word with prefix p?" | Scan all words: O(n·L) | O(|p|) | Sorted array + binary search: O(|p| log n) |
| Autocomplete top k | Filter + sort all words | Walk to prefix, DFS k words | Sorted array + binary search for the range |
| Many words on a grid | Run Word Search per word: O(words · cells · 4^L) | One DFS with a trie, pruned | - |
| Max XOR pair | All pairs O(n²) | Binary trie O(31·n) | Prefix-set greedy O(31·n) |
| Many patterns in one text | Search each pattern separately | Trie of patterns walked from each position | Aho–Corasick: O(text + matches) |

---

## Common mistakes & edge cases

- Forgetting the `isEnd` check in `search` (a prefix is not a word).
- Returning `true` from `startsWith` only when `isEnd` is set (prefix should NOT need the flag).
- Deleting a word by removing nodes blindly: that breaks longer words sharing the path.
  Only prune nodes with no children and no `isEnd`.
- Map Sum Pairs: re-inserting a key must **overwrite**, so add `newVal - oldVal`, not `newVal`.
- Word Search II: pushing the same word twice when it appears in two places; clear `node.word`.
- Word Search II: forgetting to restore the cell after backtracking.
- Binary trie: using 32 bits with `>>` on values near 2^31 gives negative numbers; use 31 bits.
- Empty string: `startsWith("")` is `true`; `search("")` is `false` unless you inserted it.

---

## When this does NOT apply

- **Only exact membership** is asked: a hash Set is simpler and lighter.
- **Huge alphabets with few shared prefixes** (random IDs, hashes): the trie is mostly unshared chains and wastes memory.
- **Substring (not prefix) queries** on one text: use a suffix array/automaton or string algorithms like KMP ([String Algorithms](../../33_String_Algorithms_Advanced/README.md)).
- **Numeric range queries** ("count values between a and b"): use a BST, Fenwick or segment tree.
- **Memory is very tight**: each node carries a Map; consider sorted arrays with binary search.

---

## Interview tips

- Say: "Each node is a Map of children plus an end-of-word flag. Every operation is O(L) in the
  length of the word, independent of how many words are stored."
- Clarify the alphabet (lowercase only? digits? unicode?) — it decides `Array(26)` vs `Map`.
- Clarify whether queries are prefix or exact — exact-only means a `Set` is simpler and fine.
- When a problem has a **dictionary + many queries** and prefix wording, say "trie" early; then
  decide what extra data each node needs (word, count, value, index).
- Write the `insert` + `findNode` walker first; `search` and `startsWith` are one-liners on top.
- For XOR problems, say "binary trie, greedy from the most significant bit" and explain why
  greedy works (higher bit wins).

---

## Problems in this folder

| # | Problem | Difficulty | Pattern | File |
|---|---------|------------|---------|------|
| 01 | Implement Trie (Prefix Tree) | Medium | core trie | 03_Problems/solutions/01_implement_trie.js |
| 02 | Design Add and Search Words | Medium | trie + wildcard DFS | 03_Problems/solutions/02_add_and_search_words.js |
| 03 | Longest Word in Dictionary | Medium | DFS through end flags | 03_Problems/solutions/03_longest_word_in_dictionary.js |
| 04 | Replace Words | Medium | stop at first end flag | 03_Problems/solutions/04_replace_words.js |
| 05 | Map Sum Pairs | Medium | values on nodes (prefix sums) | 03_Problems/solutions/05_map_sum_pairs.js |
| 06 | Implement Magic Dictionary | Medium | DFS with edit budget | 03_Problems/solutions/06_implement_magic_dictionary.js |
| 07 | Search Suggestions System | Medium | autocomplete, sorted DFS | 03_Problems/solutions/07_search_suggestions_system.js |
| 08 | Maximum XOR of Two Numbers in an Array | Medium | binary trie | 03_Problems/solutions/08_maximum_xor_two_numbers.js |
| 09 | Stream of Characters | Hard | reversed trie | 03_Problems/solutions/09_stream_of_characters.js |
| 10 | Word Search II | Hard | trie + backtracking | 03_Problems/solutions/10_word_search_ii.js |
| 11 | Palindrome Pairs | Hard | reversed trie + palindrome checks | 03_Problems/solutions/11_palindrome_pairs.js |

---

## Practice more

Easy: Longest Common Prefix (14), Index Pairs of a String (1065), Check If a Word Occurs As a
Prefix of Any Word in a Sentence (1455)

Medium: Lexicographical Numbers (386), Count Substrings That Differ by One Character (1638),
Sum of Prefix Scores of Strings (2416), Top K Frequent Words (692, trie variant),
Camelcase Matching (1023), Short Encoding of Words (820), Prefix and Suffix Search (745),
Design File System (1166), Maximum XOR With an Element From Array (1707)

Hard: Concatenated Words (472), Word Squares (425), Count Pairs With XOR in a Range (1803),
Number of Distinct Substrings in a String (1698)
