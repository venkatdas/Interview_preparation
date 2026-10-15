/**
 * 07. Search Suggestions System   (LeetCode 1268 — Medium)
 *
 * PROBLEM
 * Given a list of products and a searchWord, after typing each character of
 * searchWord return up to 3 product names that start with the typed prefix,
 * in lexicographic order. Return an array of these lists (one per character).
 *
 * EXAMPLES
 * products = ["mobile","mouse","moneypot","monitor","mousepad"], searchWord = "mouse"
 * Output: [
 *   ["mobile","moneypot","monitor"],   // "m"
 *   ["mobile","moneypot","monitor"],   // "mo"
 *   ["mouse","mousepad"],              // "mou"
 *   ["mouse","mousepad"],              // "mous"
 *   ["mouse","mousepad"]               // "mouse"
 * ]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Lowercase only? (yes)
 * - Fewer than 3 matches -> return what exists (possibly empty list).
 * - Duplicates in products? (assume unique)
 *
 * APPROACH 1 — Brute force   O(L * n * L) time
 * Sort products. For each prefix, filter products that start with it, take 3.
 *
 * APPROACH 2 — Optimal (Trie + DFS with early stop)   O(total chars) build, O(L * (L + 3)) query
 * Insert all products. Walk the trie one char of searchWord at a time; at each
 * node run a DFS that visits children in SORTED order and stops as soon as 3
 * words are collected. Once the path breaks, every later answer is [].
 * (Alternative optimal: sort + binary search for the prefix's lower bound.)
 *
 * Dry run: "mou" -> walk m,o,u to node (u). DFS sorted: s -> e(end) "mouse",
 *   e -> p -> a -> d(end) "mousepad". Only 2 found -> ["mouse","mousepad"].
 *
 * EDGE CASES
 * - searchWord has no matching products at all -> array of empty lists
 * - a product equals a prefix -> it is included (node.isEnd checked first)
 * - exactly 3 matches / more than 3 -> capped at 3
 */

function bruteForce(products, searchWord) {
  const sorted = [...products].sort();
  const result = [];
  let prefix = '';
  for (const ch of searchWord) {
    prefix += ch;
    result.push(sorted.filter((p) => p.startsWith(prefix)).slice(0, 3));
  }
  return result;
}

function optimal(products, searchWord) {
  const root = { children: new Map(), isEnd: false };
  for (const product of products) {
    let node = root;
    for (const ch of product) {
      if (!node.children.has(ch)) node.children.set(ch, { children: new Map(), isEnd: false });
      node = node.children.get(ch);
    }
    node.isEnd = true;
  }

  // collect up to 3 words below `node`, smallest first
  function collect(node, path, out) {
    if (out.length === 3) return;
    if (node.isEnd) out.push(path);
    const letters = [...node.children.keys()].sort();
    for (const ch of letters) {
      if (out.length === 3) return;
      collect(node.children.get(ch), path + ch, out);
    }
  }

  const result = [];
  let node = root;
  let prefix = '';
  for (const ch of searchWord) {
    prefix += ch;
    node = node ? node.children.get(ch) : null; // once null, stays null
    if (!node) { result.push([]); continue; }
    const suggestions = [];
    collect(node, prefix, suggestions);
    result.push(suggestions);
  }
  return result;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(
    solve(['mobile', 'mouse', 'moneypot', 'monitor', 'mousepad'], 'mouse'),
    [
      ['mobile', 'moneypot', 'monitor'],
      ['mobile', 'moneypot', 'monitor'],
      ['mouse', 'mousepad'],
      ['mouse', 'mousepad'],
      ['mouse', 'mousepad'],
    ]
  );
  assert.deepStrictEqual(solve(['havana'], 'havana'), [
    ['havana'], ['havana'], ['havana'], ['havana'], ['havana'], ['havana'],
  ]);
  assert.deepStrictEqual(solve(['bags', 'baggage', 'banner', 'box', 'cloths'], 'bags'), [
    ['baggage', 'bags', 'banner'], ['baggage', 'bags', 'banner'], ['baggage', 'bags'], ['bags'],
  ]);
  assert.deepStrictEqual(solve(['havana'], 'tatiana'), [[], [], [], [], [], [], []]);
  assert.deepStrictEqual(solve(['a', 'ab', 'abc', 'abcd'], 'ab'), [['a', 'ab', 'abc'], ['ab', 'abc', 'abcd']]);
}
console.log('✓ 07-search-suggestions-system passed');

module.exports = { optimal, bruteForce };
