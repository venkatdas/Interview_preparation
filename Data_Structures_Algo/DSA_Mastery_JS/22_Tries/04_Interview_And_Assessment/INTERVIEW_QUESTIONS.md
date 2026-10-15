# Tries — Interview Questions

Answer out loud first, then open the model answer. Back to the [topic README](../README.md) · [Concepts](../01_Concepts/CONCEPTS.md) · [Quiz](QUIZ.md)

---

### 1. What is a trie and what problem does it solve?

<details><summary>Model answer</summary>

A prefix tree: each edge is a character, each node represents the prefix spelled from the root, and a flag marks where a complete word ends. It answers "is this a word?" and "does any word start with this prefix?" in O(L) time, where L is the query length, independent of how many words are stored.

</details>

### 2. Why do we need an `isEnd` flag?

<details><summary>Model answer</summary>

A node existing only means some word **passes through** that prefix. Inserting "apple" creates nodes for "app", but "app" is not a word until it is inserted and its last node is marked `isEnd = true`. Without the flag, `search` and `startsWith` would be the same.

</details>

### 3. Map vs fixed array of 26 for children — trade-offs?

<details><summary>Model answer</summary>

Array of 26: fast index by `charCode - 97`, but 26 slots per node even when sparse, and only works for a fixed alphabet. Map (or object): stores only existing edges, supports any characters (Unicode, uppercase), slightly slower per lookup. In JS a `Map` is the safe default.

</details>

### 4. What are the time and space costs?

<details><summary>Model answer</summary>

Insert, search, startsWith: O(L). Space: O(total characters inserted) nodes in the worst case (no shared prefixes), times the per-node child storage. Shared prefixes save space.

</details>

### 5. Trie vs hash set of words: when is the trie worth it?

<details><summary>Model answer</summary>

A Set answers exact lookup in O(L) (hashing the string) with less memory. The trie wins when you need prefix queries (autocomplete, "any word starts with"), incremental matching character by character (Word Search II, stream of characters), wildcard search, or longest-prefix matching (replace words, IP routing).

</details>

### 6. How does Word Search II use a trie to beat running Word Search per word?

<details><summary>Model answer</summary>

Build a trie of all words, then DFS from every board cell walking the trie at the same time. If the current path is not a prefix of any word, stop immediately. One DFS explores all words together. Prune: remove found words (clear `word` at the node) and delete leaf nodes that become useless.

</details>

### 7. How do you support `.` wildcards in search?

<details><summary>Model answer</summary>

Recursive DFS on the trie: for a normal character follow that edge; for `.` try every child. Worst case O(26^L) for all dots, but in practice the trie prunes quickly. Bucketing words by length helps too.

</details>

### 8. How does a binary (bitwise) trie solve maximum XOR?

<details><summary>Model answer</summary>

Insert each number as bits from most significant to least. To maximize `x XOR y`, walk the trie with x, at each bit preferring the child with the **opposite** bit (that makes this XOR bit 1). Higher bits dominate, so greedy is optimal. O(31) per query, O(31·n) total.

</details>

### 9. How do you delete a word from a trie?

<details><summary>Model answer</summary>

Find it; if absent, do nothing. Unmark `isEnd` at its last node, decrement any per-node counters, and on the way back up remove child nodes that have no children and are not the end of another word. Never remove nodes still used by longer words.

</details>

### 10. How would you implement autocomplete returning the top 3 suggestions?

<details><summary>Model answer</summary>

Walk to the prefix node, then DFS in lexicographic child order and stop after 3 words; or store at each node a small sorted list of the top 3 words passing through it (updated on insert), giving O(L) queries. For Search Suggestions System, sorting products + binary search is a strong alternative.

</details>

### 11. Stream of characters: why insert words reversed?

<details><summary>Model answer</summary>

After each new character you must check whether some word ends at the current position: a **suffix** of the stream. Storing reversed words lets you walk the trie backwards from the newest character, stopping after at most maxWordLength steps or when the path dies.

</details>

### 12. What edge cases matter for tries?

<details><summary>Model answer</summary>

Empty string as a word or prefix, duplicate inserts (counters must not double-count), words that are prefixes of other words (`app` / `apple`), characters outside the expected alphabet, and very long words (recursion depth in DFS).

</details>
