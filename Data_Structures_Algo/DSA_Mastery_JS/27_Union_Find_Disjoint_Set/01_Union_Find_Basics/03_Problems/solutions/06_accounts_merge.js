/**
 * 06. Accounts Merge   (LeetCode 721 — Medium)
 *
 * PROBLEM
 * accounts[i] = [name, email1, email2, ...]. Two accounts belong to the same person if
 * they share at least one email (names can repeat for different people). Merge them:
 * return each person as [name, sorted emails...]. Output order of people does not matter.
 *
 * EXAMPLES
 * Input: [["John","johnsmith@mail.com","john_newyork@mail.com"],
 *         ["John","johnsmith@mail.com","john00@mail.com"],
 *         ["Mary","mary@mail.com"],
 *         ["John","johnnybravo@mail.com"]]
 * Output: [["John","john00@mail.com","john_newyork@mail.com","johnsmith@mail.com"],
 *          ["Mary","mary@mail.com"],
 *          ["John","johnnybravo@mail.com"]]
 * Explanation: the first two Johns share johnsmith@mail.com; the third John is someone else.
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Same name, no shared email = different people? (yes)
 * - Emails sorted lexicographically inside each account? (yes)
 * - Can one account list the same email twice? (possible, dedupe)
 *
 * APPROACH 1 — Alternative (DFS over an email graph)   O(total emails * log) time
 * Build adjacency: each account's first email links to all its other emails. DFS from
 * each unvisited email collects a component; sort it. Shown as `dfsVersion`.
 *
 * APPROACH 2 — Optimal (Union-Find on ACCOUNT INDICES)   O(total emails * alpha + sort)
 *   1. emailToAccount: email -> first account index that had it.
 *      When an email is seen again in account i, union(i, that first account).
 *   2. Group emails by find(accountIndex).
 *   3. For each group: [name of the root account, ...sorted emails].
 * Union on indices keeps the UnionFind small (n accounts) instead of one node per email.
 *
 * Dry run on the example:
 *   account 0: johnsmith -> 0, john_newyork -> 0
 *   account 1: johnsmith already -> union(1, 0); john00 -> 1
 *   account 2: mary -> 2
 *   account 3: johnnybravo -> 3
 *   roots: 0 {johnsmith, john_newyork, john00}, 2 {mary}, 3 {johnnybravo}
 *
 * EDGE CASES
 * - single account -> itself, emails sorted
 * - chain merging: A shares with B, B shares with C -> all three merge
 * - duplicate email inside one account
 */

const { UnionFind } = require('../../02_Implementations/union_find');

function dfsVersion(accounts) {
  const adj = new Map();
  const emailToName = new Map();
  const link = (a, b) => {
    if (!adj.has(a)) adj.set(a, []);
    if (!adj.has(b)) adj.set(b, []);
    adj.get(a).push(b);
    adj.get(b).push(a);
  };
  for (const [name, ...emails] of accounts) {
    for (const email of emails) {
      emailToName.set(email, name);
      if (!adj.has(email)) adj.set(email, []);
      link(emails[0], email);
    }
  }
  const visited = new Set();
  const result = [];
  for (const start of adj.keys()) {
    if (visited.has(start)) continue;
    const group = [];
    const stack = [start];
    visited.add(start);
    while (stack.length) {
      const email = stack.pop();
      group.push(email);
      for (const next of adj.get(email)) if (!visited.has(next)) { visited.add(next); stack.push(next); }
    }
    result.push([emailToName.get(start), ...group.sort()]);
  }
  return result;
}

function optimal(accounts) {
  const n = accounts.length;
  const uf = new UnionFind(n);
  const emailOwner = new Map();                   // email -> account index seen first
  accounts.forEach(([, ...emails], index) => {
    for (const email of emails) {
      if (emailOwner.has(email)) uf.union(index, emailOwner.get(email));
      else emailOwner.set(email, index);
    }
  });

  const groups = new Map();                       // root index -> emails
  for (const [email, index] of emailOwner) {
    const root = uf.find(index);
    if (!groups.has(root)) groups.set(root, []);
    groups.get(root).push(email);
  }

  const result = [];
  for (const [root, emails] of groups) {
    result.push([accounts[root][0], ...emails.sort()]);
  }
  return result;
}

// ---------- tests ----------
const assert = require('assert');
const normalize = (res) => res.map((a) => a.join(',')).sort();
for (const solve of [dfsVersion, optimal]) {
  const input = [
    ['John', 'johnsmith@mail.com', 'john_newyork@mail.com'],
    ['John', 'johnsmith@mail.com', 'john00@mail.com'],
    ['Mary', 'mary@mail.com'],
    ['John', 'johnnybravo@mail.com'],
  ];
  assert.deepStrictEqual(normalize(solve(input)), normalize([
    ['John', 'john00@mail.com', 'john_newyork@mail.com', 'johnsmith@mail.com'],
    ['Mary', 'mary@mail.com'],
    ['John', 'johnnybravo@mail.com'],
  ]));
  assert.deepStrictEqual(normalize(solve([['A', 'b@x', 'a@x']])), ['A,a@x,b@x']);
  assert.deepStrictEqual(normalize(solve([['A', 'a1'], ['A', 'a2', 'a1'], ['A', 'a3', 'a2']])), ['A,a1,a2,a3']);
  assert.deepStrictEqual(normalize(solve([['A', 'a1'], ['B', 'b1']])), ['A,a1', 'B,b1']);
  assert.deepStrictEqual(normalize(solve([['A', 'a1', 'a1']])), ['A,a1']);
}
console.log('✓ 06-accounts-merge passed');

module.exports = { optimal, dfsVersion };
