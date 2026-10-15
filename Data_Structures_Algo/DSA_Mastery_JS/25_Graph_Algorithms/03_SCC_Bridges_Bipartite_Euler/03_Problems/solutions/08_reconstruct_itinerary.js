/**
 * 08. Reconstruct Itinerary   (LeetCode 332 — Hard)
 *
 * PROBLEM
 * tickets[i] = [from, to] are airline tickets (directed edges). Starting from "JFK",
 * use EVERY ticket exactly once and return the itinerary. If several are possible,
 * return the one that is lexicographically smallest when read as a single string.
 * A valid itinerary is guaranteed to exist.
 *
 * EXAMPLES
 * Input: [["MUC","LHR"],["JFK","MUC"],["SFO","SJC"],["LHR","SFO"]]
 * Output: ["JFK","MUC","LHR","SFO","SJC"]
 * Input: [["JFK","SFO"],["JFK","ATL"],["SFO","ATL"],["ATL","JFK"],["ATL","SFO"]]
 * Output: ["JFK","ATL","JFK","SFO","ATL","SFO"]
 * Explanation: ["JFK","SFO","ATL","JFK","ATL","SFO"] also uses all tickets but is larger.
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Duplicate tickets? (yes, each is a separate edge)
 * - Always solvable? (yes - an Eulerian path from JFK exists)
 *
 * "Use every edge exactly once" = EULERIAN PATH.
 *
 * APPROACH 1 — Brute force (backtracking in lexical order)   exponential worst case
 * Sort each adjacency list. DFS from JFK trying destinations in order, marking tickets
 * used, backtracking when stuck. The first complete path found is the answer. Works, but
 * can blow up on adversarial inputs with many dead ends.
 *
 * APPROACH 2 — Optimal (Hierholzer)   O(E log E) for sorting + O(E) walk
 *   1. adjacency: from -> sorted list of destinations.
 *   2. Walk greedily from JFK, always taking the smallest unused destination.
 *   3. When a node has no unused tickets, it is DONE: append it to the result.
 *   4. The result, reversed, is the itinerary.
 * Why it works: a dead end can only be the final airport (or a loop end that gets
 * spliced in automatically by the post-order).
 *
 * Dry run example 2:
 *   adj: JFK [ATL, SFO], ATL [JFK, SFO], SFO [ATL]
 *   stack JFK -> ATL -> JFK -> SFO -> ATL -> SFO (stuck): result [SFO]
 *   back: ATL stuck -> [SFO, ATL]; SFO stuck -> [SFO, ATL, SFO]; JFK stuck -> [.., JFK]
 *   ATL stuck -> [.., ATL]; JFK stuck -> [.., JFK]
 *   reversed: JFK ATL JFK SFO ATL SFO
 *
 * EDGE CASES
 * - single ticket -> [from, to]
 * - a cycle back to JFK plus a dead end: greedy without Hierholzer would get stuck;
 *   the post-order fixes it (example 2)
 */

const { hierholzer } = require('../../02_Implementations/advanced_graph_algorithms');

function buildSortedAdj(tickets) {
  const adj = new Map();
  for (const [from, to] of tickets) {
    if (!adj.has(from)) adj.set(from, []);
    adj.get(from).push(to);
  }
  for (const list of adj.values()) list.sort();
  return adj;
}

function bruteForce(tickets) {
  const adj = buildSortedAdj(tickets);
  const used = new Map([...adj].map(([from, list]) => [from, new Array(list.length).fill(false)]));
  const path = ['JFK'];
  function dfs(airport) {
    if (path.length === tickets.length + 1) return true;
    const list = adj.get(airport) ?? [];
    const flags = used.get(airport) ?? [];
    for (let i = 0; i < list.length; i++) {
      if (flags[i] || (i > 0 && list[i] === list[i - 1] && !flags[i - 1])) continue; // skip dup
      flags[i] = true;
      path.push(list[i]);
      if (dfs(list[i])) return true;
      path.pop();
      flags[i] = false;
    }
    return false;
  }
  dfs('JFK');
  return path;
}

function optimal(tickets) {
  const adj = buildSortedAdj(tickets);
  const pointer = new Map();                     // airport -> next unused ticket index
  const itinerary = [];
  const stack = ['JFK'];
  while (stack.length) {
    const airport = stack[stack.length - 1];
    const list = adj.get(airport) ?? [];
    const i = pointer.get(airport) ?? 0;
    if (i < list.length) {
      pointer.set(airport, i + 1);               // use the smallest unused ticket
      stack.push(list[i]);
    } else {
      itinerary.push(stack.pop());               // dead end: this airport is finalised
    }
  }
  return itinerary.reverse();
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal, (t) => hierholzer(buildSortedAdj(t), 'JFK')]) {
  assert.deepStrictEqual(
    solve([['MUC', 'LHR'], ['JFK', 'MUC'], ['SFO', 'SJC'], ['LHR', 'SFO']]),
    ['JFK', 'MUC', 'LHR', 'SFO', 'SJC'],
  );
  assert.deepStrictEqual(
    solve([['JFK', 'SFO'], ['JFK', 'ATL'], ['SFO', 'ATL'], ['ATL', 'JFK'], ['ATL', 'SFO']]),
    ['JFK', 'ATL', 'JFK', 'SFO', 'ATL', 'SFO'],
  );
  assert.deepStrictEqual(solve([['JFK', 'KUL'], ['JFK', 'NRT'], ['NRT', 'JFK']]), ['JFK', 'NRT', 'JFK', 'KUL']);
  assert.deepStrictEqual(solve([['JFK', 'AAA']]), ['JFK', 'AAA']);
  assert.deepStrictEqual(solve([['JFK', 'A'], ['JFK', 'A'], ['A', 'JFK']]), ['JFK', 'A', 'JFK', 'A']);
  assert.deepStrictEqual(
    solve([['EZE', 'AXA'], ['TIA', 'ANU'], ['ANU', 'JFK'], ['JFK', 'ANU'], ['ANU', 'EZE'], ['TIA', 'ANU'], ['AXA', 'TIA'], ['TIA', 'JFK'], ['ANU', 'TIA'], ['JFK', 'TIA']]),
    ['JFK', 'ANU', 'EZE', 'AXA', 'TIA', 'ANU', 'JFK', 'TIA', 'ANU', 'TIA', 'JFK'],
  );
}
console.log('✓ 08-reconstruct-itinerary passed');

module.exports = { optimal, bruteForce };
