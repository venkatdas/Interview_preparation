# Tries — Quiz

Try first, then open the answer. Re-read [CONCEPTS.md](../01_Concepts/CONCEPTS.md) for anything you missed. See also: [Interview questions](INTERVIEW_QUESTIONS.md).

---

**1. (Predict the output)** Insert "car", "cart", "cat". How many nodes (excluding the root)?

<details><summary>Answer</summary>5: c, a, r, t (under r), t (under a).</details>

**2. (Predict the output)** After inserting "apple" only: `search("app")`, `startsWith("app")`?

<details><summary>Answer</summary>`false true`.</details>

**3. (Complexity)** Searching a word of length L in a trie holding n words?

<details><summary>Answer</summary>O(L), independent of n.</details>

**4. (Spot the bug)**

```js
search(word) {
  let node = this.root;
  for (const ch of word) { node = node.children.get(ch); if (!node) return false; }
  return true;
}
```

<details><summary>Answer</summary>It returns true for any prefix. Return `node.isEnd`.</details>

**5. (Multiple choice)** Which problem does NOT need a trie?
A) Autocomplete  B) Longest common prefix of many queries  C) Check if a single word is in a dictionary  D) Word Search II

<details><summary>Answer</summary>C — a Set is enough.</details>

**6. (Predict the output)** Binary trie with 3 bits holding 3 (011) and 5 (101). `maxXor(6)` (110)?

<details><summary>Answer</summary>`5`. Bit 2: want 0 → take 3's branch (0); bit 1: 6 has 1, want 0, but 3 has 1 → forced; bit 0: want 1, 3 has 1 → yes. 6 ^ 3 = 5. (6 ^ 5 = 3.)</details>

**7. (Spot the bug)** Count words with prefix:

```js
insert(w) { let n = this.root; for (const c of w) { n = n.child(c); n.count++; } n.isEnd = true; }
```

<details><summary>Answer</summary>Inserting the same word twice bumps `count` twice, so the same word is counted twice. Skip the walk when the word already exists (or track a per-word multiplicity on purpose).</details>

**8. (Complexity)** Space of a trie for n words of average length L with no shared prefixes?

<details><summary>Answer</summary>O(n·L) nodes.</details>

**9. (Multiple choice)** In Word Search II, why delete a word from the trie after finding it?
A) to save memory only  B) to avoid adding the same word twice and to prune future searches  C) required by JS  D) to sort output

<details><summary>Answer</summary>B.</details>

**10. (Predict the output)** Replace Words, dictionary `["cat", "bat", "rat"]`, sentence `"the cattle was rattled by the battery"`?

<details><summary>Answer</summary>`"the cat was rat by the bat"`.</details>

**11. (Spot the bug)** Wildcard search:

```js
function dfs(node, i) {
  if (i === word.length) return true;
  const ch = word[i];
  if (ch === '.') { for (const c of node.children.values()) return dfs(c, i + 1); }
  ...
}
```

<details><summary>Answer</summary>`return` inside the loop only tries the first child. Use `if (dfs(c, i + 1)) return true;` and return false after the loop. Also the base case should return `node.isEnd`.</details>

**12. (Multiple choice)** Map children vs array(26) children: which is better for Unicode words?
A) array(26)  B) Map  C) same  D) neither works

<details><summary>Answer</summary>B.</details>

---

## Mastery checklist

- [ ] I can write a Trie class (insert, search, startsWith) in under 5 minutes.
- [ ] I can explain why `isEnd` is needed and handle words that are prefixes of other words.
- [ ] I can implement wildcard search and delete with pruning.
- [ ] I can solve Word Search II by walking the board and the trie together.
- [ ] I can build a binary trie for maximum XOR and explain the greedy choice.
