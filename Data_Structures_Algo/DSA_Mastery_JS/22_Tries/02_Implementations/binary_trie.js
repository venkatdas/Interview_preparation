/**
 * Binary trie (bitwise trie) in JavaScript.
 *
 * Instead of letters, each node has at most TWO children: bit 0 and bit 1.
 * A number is inserted as its binary string from the MOST significant bit down.
 *
 *                 root
 *               /      \
 *             0          1        <- bit 30 (or bits-1)
 *           /   \      /   \
 *          0     1    0     1     <- bit 29
 *          ...
 *
 * Why? To answer "which inserted number gives the MAXIMUM XOR with x?" in O(bits):
 * walk down from the top bit; at every level try to go to the OPPOSITE bit of x
 * (that makes the XOR bit a 1, and a 1 in a higher position beats any lower bits).
 * If the opposite child does not exist, settle for the same bit.
 *
 * Operations: insert O(bits), maxXor O(bits). Space O(n * bits) nodes worst case.
 */

class BinaryTrie {
  // bits = 31 handles non-negative 32-bit signed ints (bit 31 is the sign bit).
  constructor(bits = 31) {
    this.bits = bits;
    this.root = { children: [null, null] }; // children[0], children[1]
  }

  insert(num) {
    let node = this.root;
    for (let bit = this.bits - 1; bit >= 0; bit--) {
      const b = (num >> bit) & 1;
      if (!node.children[b]) node.children[b] = { children: [null, null] };
      node = node.children[b];
    }
    return this;
  }

  // Maximum of (num XOR y) over all inserted y. Trie must be non-empty.
  maxXor(num) {
    let node = this.root;
    let result = 0;
    for (let bit = this.bits - 1; bit >= 0; bit--) {
      const b = (num >> bit) & 1;
      const wanted = 1 - b; // opposite bit makes this XOR bit a 1
      if (node.children[wanted]) {
        result |= 1 << bit;
        node = node.children[wanted];
      } else {
        node = node.children[b];
      }
    }
    return result;
  }
}

// ---------- self-test ----------
// Only runs when executed directly (node trie.js), not when required by a problem file.
if (require.main === module) {
const assert = require('assert');

const trie = new BinaryTrie();
const nums = [3, 10, 5, 25, 2, 8];
for (const n of nums) trie.insert(n);

// compare against brute force for several queries
for (const query of [0, 1, 5, 25, 31, 100]) {
  let expected = 0;
  for (const n of nums) expected = Math.max(expected, query ^ n);
  assert.strictEqual(trie.maxXor(query), expected);
}

// a trie with a single element: maxXor(x) must be x ^ that element
const single = new BinaryTrie().insert(7);
assert.strictEqual(single.maxXor(7), 0);
assert.strictEqual(single.maxXor(0), 7);

// small bit width still works
const small = new BinaryTrie(4).insert(0b1010).insert(0b0011);
assert.strictEqual(small.maxXor(0b0101), 0b1111); // 0101 ^ 1010

console.log('✓ binary-trie.js self-test passed');
}

module.exports = { BinaryTrie };
