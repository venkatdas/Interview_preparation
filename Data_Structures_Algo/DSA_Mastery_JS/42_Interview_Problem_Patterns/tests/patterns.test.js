// node:test suite for every interview template in 02_Implementations/templates.js and
// 02_Implementations/pattern_templates.js, plus edge cases for several drill solutions.
// Each template is tested on a normal input, an empty input, duplicates, and random inputs
// compared against a slow but obviously-correct reference. Run: node --test tests/patterns.test.js
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

const T = require('../02_Implementations/templates');
const P = require('../02_Implementations/pattern_templates');

// ---------- helpers ----------
function mulberry32(seed) {
  return function rand() {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rng = (seed) => {
  const r = mulberry32(seed);
  const int = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
  return { r, int, arr: (n, lo, hi) => Array.from({ length: n }, () => int(lo, hi)) };
};
const num = (a, b) => a - b;
const sortedCopy = (a) => a.slice().sort(num);
const key2 = (arrs) => arrs.map((x) => JSON.stringify(x)).sort();
function allSubarrays(a) {
  const out = [];
  for (let i = 0; i < a.length; i++) for (let j = i; j < a.length; j++) out.push(a.slice(i, j + 1));
  return out;
}
function allSubsetsIdx(n) {
  const out = [];
  for (let m = 0; m < (1 << n); m++) { const s = []; for (let i = 0; i < n; i++) if (m & (1 << i)) s.push(i); out.push(s); }
  return out;
}
function bstFromValues(values) { // insert in order; duplicates ignored
  let root = null;
  for (const v of values) {
    if (!root) { root = new T.TreeNode(v); continue; }
    let n = root;
    while (true) {
      if (v === n.val) break;
      const side = v < n.val ? 'left' : 'right';
      if (!n[side]) { n[side] = new T.TreeNode(v); break; }
      n = n[side];
    }
  }
  return root;
}
function randomTree(g, size) { // arbitrary (not BST) tree with values 0..9
  if (size === 0) return null;
  const leftSize = g.int(0, size - 1);
  return new T.TreeNode(g.int(0, 9), randomTree(g, leftSize), randomTree(g, size - 1 - leftSize));
}
function floydWarshall(n, edges) {
  const d = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 0 : Infinity)));
  for (const [u, v, w] of edges) d[u][v] = Math.min(d[u][v], w);
  for (let k = 0; k < n; k++) for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    if (d[i][k] + d[k][j] < d[i][j]) d[i][j] = d[i][k] + d[k][j];
  }
  return d;
}

// =====================================================================
describe('MinHeap', () => {
  it('normal: pops in ascending order; custom comparator gives a max-heap', () => {
    const h = new T.MinHeap();
    [5, 3, 8, 1].forEach((x) => h.push(x));
    assert.deepEqual([h.pop(), h.pop(), h.pop(), h.pop()], [1, 3, 5, 8]);
    const mx = new T.MinHeap((a, b) => b - a);
    [5, 3, 8].forEach((x) => mx.push(x));
    assert.equal(mx.pop(), 8);
  });
  it('empty: pop and peek return undefined, size 0', () => {
    const h = new T.MinHeap();
    assert.equal(h.pop(), undefined);
    assert.equal(h.peek(), undefined);
    assert.equal(h.size(), 0);
  });
  it('duplicates', () => {
    const h = new T.MinHeap();
    [2, 2, 1, 1, 2].forEach((x) => h.push(x));
    const out = []; while (h.size()) out.push(h.pop());
    assert.deepEqual(out, [1, 1, 2, 2, 2]);
  });
  it('matches a sorted array model on random push/pop sequences', () => {
    const g = rng(11);
    for (let t = 0; t < 200; t++) {
      const h = new T.MinHeap(); const model = [];
      for (let op = 0; op < 30; op++) {
        if (g.r() < 0.6) { const x = g.int(-20, 20); h.push(x); model.push(x); model.sort(num); }
        else assert.equal(h.pop(), model.shift());
      }
    }
  });
});

describe('UnionFind and countComponents', () => {
  it('normal', () => {
    const uf = new T.UnionFind(4);
    assert.equal(uf.union(0, 1), true);
    assert.equal(uf.connected(0, 1), true);
    assert.equal(uf.count, 3);
    assert.equal(P.countComponents(5, [[0, 1], [3, 4]]), 3);
  });
  it('empty: n = 0 has 0 components, no edges means n components', () => {
    assert.equal(new T.UnionFind(0).count, 0);
    assert.equal(P.countComponents(0, []), 0);
    assert.equal(P.countComponents(3, []), 3);
  });
  it('duplicates: repeated and self edges do not change the count', () => {
    const uf = new T.UnionFind(3);
    uf.union(0, 1); assert.equal(uf.union(1, 0), false); assert.equal(uf.union(2, 2), false);
    assert.equal(uf.count, 2);
    assert.equal(P.countComponents(3, [[0, 1], [0, 1], [2, 2]]), 2);
  });
  it('random graphs: union-find count equals DFS count', () => {
    const g = rng(12);
    for (let t = 0; t < 200; t++) {
      const n = g.int(1, 12);
      const edges = Array.from({ length: g.int(0, 15) }, () => [g.int(0, n - 1), g.int(0, n - 1)]);
      const uf = new T.UnionFind(n);
      edges.forEach(([a, b]) => uf.union(a, b));
      assert.equal(uf.count, P.countComponents(n, edges));
    }
  });
});

describe('Trie', () => {
  it('normal', () => {
    const tr = new T.Trie();
    tr.insert('apple');
    assert.equal(tr.search('apple'), true);
    assert.equal(tr.search('app'), false);
    assert.equal(tr.startsWith('app'), true);
  });
  it('empty: empty trie and empty prefix', () => {
    const tr = new T.Trie();
    assert.equal(tr.search('a'), false);
    assert.equal(tr.startsWith(''), true);
    assert.equal(tr.search(''), false);
    tr.insert('');
    assert.equal(tr.search(''), true);
  });
  it('duplicates: inserting the same word twice is harmless', () => {
    const tr = new T.Trie();
    tr.insert('ab'); tr.insert('ab');
    assert.equal(tr.search('ab'), true);
  });
  it('matches a word-list model on random words', () => {
    const g = rng(13);
    for (let t = 0; t < 100; t++) {
      const word = () => Array.from({ length: g.int(0, 4) }, () => 'abc'[g.int(0, 2)]).join('');
      const words = Array.from({ length: g.int(0, 8) }, word);
      const tr = new T.Trie(); words.forEach((w) => tr.insert(w));
      for (let q = 0; q < 10; q++) {
        const s = word();
        assert.equal(tr.search(s), words.includes(s));
        assert.equal(tr.startsWith(s), s === '' || words.some((w) => w.startsWith(s))); // '' is a prefix of the (possibly empty) trie
      }
    }
  });
});

describe('binary search family (binarySearch, lowerBound, upperBound, binarySearchOnAnswer, searchRotated)', () => {
  it('normal', () => {
    assert.equal(T.binarySearch([1, 3, 5, 7], 5), 2);
    assert.equal(T.lowerBound([1, 3, 5], 4), 2);
    assert.equal(T.upperBound([1, 3, 5], 3), 2);
    assert.equal(T.binarySearchOnAnswer(1, 100, (x) => x * x >= 50), 8);
    assert.equal(P.searchRotated([4, 5, 6, 7, 0, 1, 2], 6), 2);
  });
  it('empty array', () => {
    assert.equal(T.binarySearch([], 1), -1);
    assert.equal(T.lowerBound([], 1), 0);
    assert.equal(T.upperBound([], 1), 0);
    assert.equal(P.searchRotated([], 1), -1);
    assert.equal(T.binarySearchOnAnswer(5, 5, () => true), 5);
  });
  it('duplicates: lower/upper bound bracket the run of equal values', () => {
    const a = [1, 2, 2, 2, 3];
    assert.equal(T.lowerBound(a, 2), 1);
    assert.equal(T.upperBound(a, 2), 4);
    assert.equal(a[T.binarySearch(a, 2)], 2);
  });
  it('random: match linear scans', () => {
    const g = rng(14);
    for (let t = 0; t < 300; t++) {
      const a = sortedCopy(g.arr(g.int(0, 12), 0, 10));
      const x = g.int(-1, 11);
      const lb = a.findIndex((v) => v >= x);
      const ub = a.findIndex((v) => v > x);
      assert.equal(T.lowerBound(a, x), lb === -1 ? a.length : lb);
      assert.equal(T.upperBound(a, x), ub === -1 ? a.length : ub);
      const bs = T.binarySearch(a, x);
      assert.equal(bs === -1 ? !a.includes(x) : a[bs] === x, true);
      const threshold = g.int(0, 20);
      assert.equal(T.binarySearchOnAnswer(0, 20, (v) => v >= threshold), threshold);
      // rotated distinct array
      const distinct = [...new Set(a)];
      const k = distinct.length ? g.int(0, distinct.length - 1) : 0;
      const rot = distinct.slice(k).concat(distinct.slice(0, k));
      assert.equal(P.searchRotated(rot, x), rot.indexOf(x));
    }
  });
});

describe('grid templates (bfsGrid, countIslands, DIRECTIONS)', () => {
  it('normal', () => {
    const d = T.bfsGrid([[0, 0, 0], [1, 1, 0], [0, 0, 0]], 0, 0);
    assert.equal(d[2][0], 6);
    assert.equal(T.countIslands([[1, 0, 1], [0, 0, 1]]), 2);
    assert.equal(T.DIRECTIONS.length, 4);
  });
  it('empty / minimal grids', () => {
    assert.equal(T.countIslands([[]]), 0);
    assert.deepEqual(T.bfsGrid([[0]], 0, 0), [[0]]);
  });
  it('duplicates: all-land grid is one island; all-water is zero', () => {
    assert.equal(T.countIslands([[1, 1], [1, 1]]), 1);
    assert.equal(T.countIslands([[0, 0], [0, 0]]), 0);
  });
  it('random grids: BFS distances match Bellman-style relaxation; islands match union-find', () => {
    const g = rng(15);
    for (let t = 0; t < 150; t++) {
      const R = g.int(1, 6); const C = g.int(1, 6);
      const grid = Array.from({ length: R }, () => Array.from({ length: C }, () => (g.r() < 0.35 ? 1 : 0)));
      grid[0][0] = 0;
      const ref = Array.from({ length: R }, () => new Array(C).fill(Infinity));
      ref[0][0] = 0;
      for (let changed = true; changed;) {
        changed = false;
        for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) {
          if (grid[r][c] === 1 || ref[r][c] === Infinity) continue;
          for (const [dr, dc] of T.DIRECTIONS) {
            const nr = r + dr; const nc = c + dc;
            if (nr < 0 || nc < 0 || nr >= R || nc >= C || grid[nr][nc] === 1) continue;
            if (ref[r][c] + 1 < ref[nr][nc]) { ref[nr][nc] = ref[r][c] + 1; changed = true; }
          }
        }
      }
      const got = T.bfsGrid(grid, 0, 0);
      for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) assert.equal(got[r][c], ref[r][c] === Infinity ? -1 : ref[r][c]);
      // islands of 1s
      const uf = new T.UnionFind(R * C); let land = 0;
      for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) {
        if (grid[r][c] !== 1) continue;
        land++;
        if (r + 1 < R && grid[r + 1][c] === 1) uf.union(r * C + c, (r + 1) * C + c);
        if (c + 1 < C && grid[r][c + 1] === 1) uf.union(r * C + c, r * C + c + 1);
      }
      assert.equal(T.countIslands(grid), uf.count - (R * C - land));
    }
  });
});

describe('graph traversal (buildAdjList, bfsGraph, dfsGraph, dijkstra, bellmanFord)', () => {
  it('normal', () => {
    const g = T.buildAdjList(4, [[0, 1], [1, 2], [2, 3]]);
    assert.equal(T.bfsGraph(g, 0).get(3), 3);
    assert.deepEqual(T.dfsGraph(g, 0).sort(num), [0, 1, 2, 3]);
    const w = new Map([[0, [[1, 5], [2, 1]]], [1, []], [2, [[1, 1]]]]);
    assert.equal(T.dijkstra(w, 0).get(1), 2);
    assert.deepEqual(P.bellmanFord(3, [[0, 1, 4], [1, 2, -2]], 0), [0, 4, 2]);
  });
  it('empty: single isolated node', () => {
    assert.deepEqual([...T.bfsGraph(new Map(), 0)], [[0, 0]]);
    assert.deepEqual(T.dfsGraph(new Map(), 0), [0]);
    assert.deepEqual([...T.dijkstra(new Map(), 0)], [[0, 0]]);
    assert.deepEqual(P.bellmanFord(1, [], 0), [0]);
    assert.equal(T.buildAdjList(0, []).size, 0);
  });
  it('duplicates: parallel edges and cycles', () => {
    const g = T.buildAdjList(3, [[0, 1], [0, 1], [1, 2], [2, 0]]);
    assert.equal(T.bfsGraph(g, 0).get(2), 1);
    assert.equal(T.dfsGraph(g, 0).length, 3);
    assert.equal(P.bellmanFord(2, [[0, 1, 1], [1, 0, -3]], 0), null);
  });
  it('random graphs: BFS = unit-weight Bellman-Ford, Dijkstra = Floyd-Warshall, DFS reaches the BFS set', () => {
    const g = rng(16);
    for (let t = 0; t < 150; t++) {
      const n = g.int(1, 8);
      const und = Array.from({ length: g.int(0, 12) }, () => [g.int(0, n - 1), g.int(0, n - 1)]);
      const adj = T.buildAdjList(n, und);
      const bfs = T.bfsGraph(adj, 0);
      const unit = P.bellmanFord(n, und.flatMap(([a, b]) => [[a, b, 1], [b, a, 1]]), 0);
      for (let v = 0; v < n; v++) assert.equal(bfs.has(v) ? bfs.get(v) : Infinity, unit[v]);
      assert.deepEqual(T.dfsGraph(adj, 0).sort(num), [...bfs.keys()].sort(num));

      const wEdges = Array.from({ length: g.int(0, 15) }, () => [g.int(0, n - 1), g.int(0, n - 1), g.int(0, 9)]);
      const wg = new Map(Array.from({ length: n }, (_, i) => [i, []]));
      wEdges.forEach(([u, v, w]) => wg.get(u).push([v, w]));
      const dj = T.dijkstra(wg, 0);
      const fw = floydWarshall(n, wEdges);
      const bf = P.bellmanFord(n, wEdges, 0);
      for (let v = 0; v < n; v++) {
        assert.equal(dj.has(v) ? dj.get(v) : Infinity, fw[0][v]);
        assert.equal(bf[v], fw[0][v]);
      }
    }
  });
});

describe('topological sort (topoSortKahn, topoSortDFS, isTopologicalOrder)', () => {
  it('normal', () => {
    const e = [[0, 1], [0, 2], [1, 3], [2, 3]];
    assert.ok(P.isTopologicalOrder(4, e, T.topoSortKahn(4, e)));
    assert.ok(P.isTopologicalOrder(4, e, P.topoSortDFS(4, e)));
  });
  it('empty graph', () => {
    assert.deepEqual(T.topoSortKahn(0, []), []);
    assert.deepEqual(P.topoSortDFS(0, []), []);
    assert.deepEqual(T.topoSortKahn(2, []).sort(num), [0, 1]);
  });
  it('duplicates and cycles', () => {
    assert.ok(P.isTopologicalOrder(2, [[0, 1], [0, 1]], T.topoSortKahn(2, [[0, 1], [0, 1]])));
    assert.deepEqual(T.topoSortKahn(1, [[0, 0]]), []);
    assert.deepEqual(P.topoSortDFS(3, [[0, 1], [1, 2], [2, 1]]), []);
  });
  it('random: DAGs give valid orders; Kahn and DFS agree on cycle detection', () => {
    const g = rng(17);
    for (let t = 0; t < 200; t++) {
      const n = g.int(1, 8);
      const dag = [];
      for (let e = 0; e < g.int(0, 12); e++) { const a = g.int(0, n - 1); const b = g.int(0, n - 1); if (a < b) dag.push([a, b]); }
      assert.ok(P.isTopologicalOrder(n, dag, T.topoSortKahn(n, dag)));
      assert.ok(P.isTopologicalOrder(n, dag, P.topoSortDFS(n, dag)));
      const any = Array.from({ length: g.int(0, 10) }, () => [g.int(0, n - 1), g.int(0, n - 1)]);
      const k = T.topoSortKahn(n, any); const d = P.topoSortDFS(n, any);
      assert.equal(k.length === 0, d.length === 0);
      if (k.length) { assert.ok(P.isTopologicalOrder(n, any, k)); assert.ok(P.isTopologicalOrder(n, any, d)); }
    }
  });
});

describe('two pointers (twoPointersOppositeEnds, dedupeSorted, threeSum)', () => {
  it('normal', () => {
    assert.deepEqual(T.twoPointersOppositeEnds([1, 2, 4, 7], 9), [1, 3]);
    assert.deepEqual(P.dedupeSorted([1, 1, 2]), [1, 2]);
    assert.deepEqual(P.threeSum([-1, 0, 1, 2, -1, -4]), [[-1, -1, 2], [-1, 0, 1]]);
  });
  it('empty', () => {
    assert.equal(T.twoPointersOppositeEnds([], 1), null);
    assert.deepEqual(P.dedupeSorted([]), []);
    assert.deepEqual(P.threeSum([]), []);
  });
  it('duplicates', () => {
    assert.deepEqual(T.twoPointersOppositeEnds([3, 3], 6), [0, 1]);
    assert.deepEqual(P.dedupeSorted([2, 2, 2]), [2]);
    assert.deepEqual(P.threeSum([0, 0, 0, 0]), [[0, 0, 0]]);
  });
  it('random: match brute force', () => {
    const g = rng(18);
    for (let t = 0; t < 200; t++) {
      const a = sortedCopy(g.arr(g.int(0, 10), -5, 5));
      const target = g.int(-6, 6);
      const res = T.twoPointersOppositeEnds(a, target);
      const exists = a.some((x, i) => a.some((y, j) => j > i && x + y === target));
      assert.equal(res !== null, exists);
      if (res) assert.equal(a[res[0]] + a[res[1]], target);
      assert.deepEqual(P.dedupeSorted(a), [...new Set(a)]);
      const brute = new Set();
      for (let i = 0; i < a.length; i++) for (let j = i + 1; j < a.length; j++) for (let k = j + 1; k < a.length; k++) {
        if (a[i] + a[j] + a[k] === 0) brute.add(JSON.stringify([a[i], a[j], a[k]].sort(num)));
      }
      assert.deepEqual(key2(P.threeSum(g.r() < 0.5 ? a : a.slice().reverse())), [...brute].sort());
    }
  });
});

describe('linked list templates (hasCycle, middleNode, reverseList, cycleStart, list builders)', () => {
  it('normal', () => {
    const l = T.arrayToList([1, 2, 3, 4, 5]);
    assert.equal(T.middleNode(l).val, 3);
    assert.equal(T.hasCycle(l), false);
    assert.deepEqual(T.listToArray(T.reverseList(T.arrayToList([1, 2, 3]))), [3, 2, 1]);
  });
  it('empty list', () => {
    assert.equal(T.arrayToList([]), null);
    assert.deepEqual(T.listToArray(null), []);
    assert.equal(T.hasCycle(null), false);
    assert.equal(T.middleNode(null), null);
    assert.equal(T.reverseList(null), null);
    assert.equal(P.cycleStart(null), null);
  });
  it('duplicates: equal values do not fool reference-based cycle checks', () => {
    const l = T.arrayToList([7, 7, 7, 7]);
    assert.equal(T.hasCycle(l), false);
    assert.equal(P.cycleStart(l), null);
  });
  it('random lists with and without cycles', () => {
    const g = rng(19);
    for (let t = 0; t < 200; t++) {
      const vals = g.arr(g.int(1, 10), 0, 3);
      const head = T.arrayToList(vals);
      assert.deepEqual(T.listToArray(T.reverseList(T.arrayToList(vals))), vals.slice().reverse());
      let mid = head; for (let i = 0; i < Math.floor(vals.length / 2); i++) mid = mid.next;
      assert.equal(T.middleNode(head), mid);
      const nodes = []; for (let n = head; n; n = n.next) nodes.push(n);
      if (g.r() < 0.5) {
        const entry = nodes[g.int(0, nodes.length - 1)];
        nodes[nodes.length - 1].next = entry;
        assert.equal(T.hasCycle(head), true);
        assert.equal(P.cycleStart(head), entry);
      } else {
        assert.equal(T.hasCycle(head), false);
        assert.equal(P.cycleStart(head), null);
      }
    }
  });
});

describe('fast & slow on arrays and functions (findDuplicateFloyd, reachesTarget)', () => {
  const digitSquares = (x) => String(x).split('').reduce((s, d) => s + d * d, 0);
  const happyRef = (x) => { const seen = new Set(); while (x !== 1 && !seen.has(x)) { seen.add(x); x = digitSquares(x); } return x === 1; };
  it('normal', () => {
    assert.equal(P.findDuplicateFloyd([3, 1, 3, 4, 2]), 3);
    assert.equal(P.reachesTarget(7, digitSquares, 1), true);
  });
  it('smallest input (n = 1: [1, 1])', () => {
    assert.equal(P.findDuplicateFloyd([1, 1]), 1);
    assert.equal(P.reachesTarget(1, digitSquares, 1), true);
  });
  it('duplicates: the repeated value may appear many times', () => {
    assert.equal(P.findDuplicateFloyd([2, 2, 2, 2, 2]), 2);
  });
  it('random arrays and happy numbers', () => {
    const g = rng(20);
    for (let t = 0; t < 200; t++) {
      const n = g.int(1, 12);
      const dup = g.int(1, n);
      const a = Array.from({ length: n }, (_, i) => i + 1);
      const extra = g.int(1, n);                     // replace some values by more copies of dup
      a.push(dup);
      for (let k = 0; k < extra - 1; k++) { const i = g.int(0, a.length - 1); a[i] = dup; }
      for (let i = a.length - 1; i > 0; i--) { const j = g.int(0, i); [a[i], a[j]] = [a[j], a[i]]; }
      if (new Set(a).size === a.length) continue;
      assert.equal(P.findDuplicateFloyd(a), dup);
      const x = g.int(1, 500);
      assert.equal(P.reachesTarget(x, digitSquares, 1), happyRef(x));
    }
  });
});

describe('subsets / permutations / combinationSum / subsetsBitmask', () => {
  it('normal', () => {
    assert.equal(T.subsets([1, 2, 3]).length, 8);
    assert.equal(P.permutations([1, 2, 3]).length, 6);
    assert.deepEqual(P.combinationSum([2, 3, 5], 8), [[2, 2, 2, 2], [2, 3, 3], [3, 5]]);
    assert.equal(P.subsetsBitmask([1, 2]).length, 4);
  });
  it('empty input', () => {
    assert.deepEqual(T.subsets([]), [[]]);
    assert.deepEqual(P.permutations([]), [[]]);
    assert.deepEqual(P.subsetsBitmask([]), [[]]);
    assert.deepEqual(P.combinationSum([], 3), []);
    assert.deepEqual(P.combinationSum([2], 0), [[]]);
  });
  it('duplicates in input: subsets keep positions, so copies appear', () => {
    assert.equal(T.subsets([1, 1]).length, 4);
    assert.equal(P.permutations([1, 1]).length, 2);
  });
  it('random: subsets match bitmask subsets; permutations are n! distinct; combinationSum matches DP count', () => {
    const g = rng(21);
    for (let t = 0; t < 60; t++) {
      const n = g.int(0, 6);
      const nums = [...new Set(g.arr(n, 1, 9))];
      assert.deepEqual(key2(T.subsets(nums).map((s) => s.slice().sort(num))), key2(P.subsetsBitmask(nums).map((s) => s.slice().sort(num))));
      const perms = P.permutations(nums.slice(0, 5));
      let fact = 1; for (let i = 2; i <= Math.min(nums.length, 5); i++) fact *= i;
      assert.equal(perms.length, fact);
      assert.equal(new Set(perms.map((p) => p.join(','))).size, fact);
      const target = g.int(0, 15);
      const combos = P.combinationSum(nums, target);
      const ways = new Array(target + 1).fill(0); ways[0] = 1;
      for (const c of nums) for (let a = c; a <= target; a++) ways[a] += ways[a - c];
      assert.equal(combos.length, ways[target]);
      combos.forEach((c) => assert.equal(c.reduce((s, x) => s + x, 0), target));
    }
  });
});

describe('sliding window (longestUniqueSubstring, maxSumFixedWindow, longestWithAtMostKDistinct, minSubarrayLenAtLeast)', () => {
  it('normal', () => {
    assert.equal(T.longestUniqueSubstring('abcabcbb'), 3);
    assert.equal(P.maxSumFixedWindow([1, 4, 2, 10], 2), 12);
    assert.equal(P.longestWithAtMostKDistinct('eceba'.split(''), 2), 3);
    assert.equal(P.minSubarrayLenAtLeast([1, 4, 4], 4), 1);
  });
  it('empty', () => {
    assert.equal(T.longestUniqueSubstring(''), 0);
    assert.equal(P.maxSumFixedWindow([], 1), -Infinity);
    assert.equal(P.longestWithAtMostKDistinct([], 2), 0);
    assert.equal(P.minSubarrayLenAtLeast([], 1), 0);
  });
  it('duplicates', () => {
    assert.equal(T.longestUniqueSubstring('bbbb'), 1);
    assert.equal(P.longestWithAtMostKDistinct([5, 5, 5], 1), 3);
    assert.equal(P.maxSumFixedWindow([2, 2, 2], 3), 6);
  });
  it('random: match brute force over all subarrays', () => {
    const g = rng(22);
    for (let t = 0; t < 200; t++) {
      const a = g.arr(g.int(0, 12), 1, 5);
      const s = a.map((x) => 'abcde'[x - 1]).join('');
      const subs = allSubarrays(a);
      assert.equal(T.longestUniqueSubstring(s), Math.max(0, ...subs.filter((x) => new Set(x).size === x.length).map((x) => x.length)));
      const k = g.int(0, 4);
      const fixed = subs.filter((x) => x.length === k).map((x) => x.reduce((p, q) => p + q, 0));
      assert.equal(P.maxSumFixedWindow(a, k), fixed.length ? Math.max(...fixed) : -Infinity);
      assert.equal(P.longestWithAtMostKDistinct(a, k), Math.max(0, ...subs.filter((x) => new Set(x).size <= k).map((x) => x.length)));
      const target = g.int(1, 15);
      const lens = subs.filter((x) => x.reduce((p, q) => p + q, 0) >= target).map((x) => x.length);
      assert.equal(P.minSubarrayLenAtLeast(a, target), lens.length ? Math.min(...lens) : 0);
    }
  });
});

describe('monotonic stack / queue (nextGreater, previousSmallerIndex, slidingWindowMax)', () => {
  it('normal', () => {
    assert.deepEqual(T.nextGreater([2, 1, 5, 3]), [5, 5, -1, -1]);
    assert.deepEqual(P.previousSmallerIndex([4, 2, 6]), [-1, -1, 1]);
    assert.deepEqual(P.slidingWindowMax([1, 3, 2, 5], 2), [3, 3, 5]);
  });
  it('empty', () => {
    assert.deepEqual(T.nextGreater([]), []);
    assert.deepEqual(P.previousSmallerIndex([]), []);
    assert.deepEqual(P.slidingWindowMax([], 2), []);
    assert.deepEqual(P.slidingWindowMax([1, 2], 0), []);
  });
  it('duplicates: equal values are not "greater" or "smaller"', () => {
    assert.deepEqual(T.nextGreater([3, 3, 3]), [-1, -1, -1]);
    assert.deepEqual(P.previousSmallerIndex([3, 3, 3]), [-1, -1, -1]);
    assert.deepEqual(P.slidingWindowMax([3, 3, 3], 2), [3, 3]);
  });
  it('random: match O(n^2) / O(nk) references', () => {
    const g = rng(23);
    for (let t = 0; t < 200; t++) {
      const a = g.arr(g.int(0, 15), 0, 6);
      assert.deepEqual(T.nextGreater(a), a.map((x, i) => { for (let j = i + 1; j < a.length; j++) if (a[j] > x) return a[j]; return -1; }));
      assert.deepEqual(P.previousSmallerIndex(a), a.map((x, i) => { for (let j = i - 1; j >= 0; j--) if (a[j] < x) return j; return -1; }));
      const k = g.int(1, 5);
      const ref = []; for (let i = 0; i + k <= a.length; i++) ref.push(Math.max(...a.slice(i, i + k)));
      assert.deepEqual(P.slidingWindowMax(a, k), ref);
    }
  });
});

describe('prefix sums & difference arrays (buildPrefixSum, countSubarraysWithSum, applyRangeAdds, buildPrefix2D)', () => {
  it('normal', () => {
    assert.deepEqual(T.buildPrefixSum([1, 2, 3]), [0, 1, 3, 6]);
    assert.equal(T.countSubarraysWithSum([1, 1, 1], 2), 2);
    assert.deepEqual(P.applyRangeAdds(3, [[0, 1, 5]]), [5, 5, 0]);
    assert.equal(P.buildPrefix2D([[1, 2], [3, 4]])(0, 0, 1, 1), 10);
  });
  it('empty', () => {
    assert.deepEqual(T.buildPrefixSum([]), [0]);
    assert.equal(T.countSubarraysWithSum([], 0), 0);
    assert.deepEqual(P.applyRangeAdds(0, []), []);
    assert.deepEqual(P.applyRangeAdds(2, []), [0, 0]);
  });
  it('duplicates and zeros: k = 0 counts every zero-sum subarray', () => {
    assert.equal(T.countSubarraysWithSum([0, 0, 0], 0), 6);
    assert.deepEqual(P.applyRangeAdds(2, [[0, 1, 1], [0, 1, 1]]), [2, 2]);
  });
  it('random (with negatives): match brute force', () => {
    const g = rng(24);
    for (let t = 0; t < 200; t++) {
      const a = g.arr(g.int(0, 12), -3, 3);
      const k = g.int(-4, 4);
      const pre = T.buildPrefixSum(a);
      for (let i = 0; i < a.length; i++) for (let j = i; j < a.length; j++) {
        assert.equal(pre[j + 1] - pre[i], a.slice(i, j + 1).reduce((s, x) => s + x, 0));
      }
      assert.equal(T.countSubarraysWithSum(a, k), allSubarrays(a).filter((x) => x.reduce((s, y) => s + y, 0) === k).length);
      const n = g.int(1, 8);
      const ups = Array.from({ length: g.int(0, 6) }, () => { const l = g.int(0, n - 1); return [l, g.int(l, n - 1), g.int(-5, 5)]; });
      const naive = new Array(n).fill(0); ups.forEach(([l, r, d]) => { for (let i = l; i <= r; i++) naive[i] += d; });
      assert.deepEqual(P.applyRangeAdds(n, ups), naive);
      const R = g.int(1, 4); const C = g.int(1, 4);
      const m = Array.from({ length: R }, () => g.arr(C, -5, 5));
      const q = P.buildPrefix2D(m);
      const r1 = g.int(0, R - 1); const r2 = g.int(r1, R - 1); const c1 = g.int(0, C - 1); const c2 = g.int(c1, C - 1);
      let s = 0; for (let r = r1; r <= r2; r++) for (let c = c1; c <= c2; c++) s += m[r][c];
      assert.equal(q(r1, c1, r2, c2), s);
    }
  });
});

describe('LRUCache', () => {
  it('normal: evicts the least recently used key', () => {
    const c = new T.LRUCache(2);
    c.put(1, 1); c.put(2, 2); c.get(1); c.put(3, 3);
    assert.equal(c.get(2), -1);
    assert.equal(c.get(1), 1);
  });
  it('empty cache returns -1', () => {
    assert.equal(new T.LRUCache(1).get(5), -1);
  });
  it('duplicates: re-putting a key updates value and recency', () => {
    const c = new T.LRUCache(2);
    c.put(1, 1); c.put(2, 2); c.put(1, 10); c.put(3, 3);
    assert.equal(c.get(1), 10);
    assert.equal(c.get(2), -1);
  });
  it('random operations match an array model', () => {
    const g = rng(25);
    for (let t = 0; t < 100; t++) {
      const cap = g.int(1, 4);
      const c = new T.LRUCache(cap); const model = []; // [key, value], most recent last
      for (let op = 0; op < 40; op++) {
        const key = g.int(0, 5);
        const idx = model.findIndex((e) => e[0] === key);
        if (g.r() < 0.5) {
          const expected = idx === -1 ? -1 : model[idx][1];
          if (idx !== -1) model.push(model.splice(idx, 1)[0]);
          assert.equal(c.get(key), expected);
        } else {
          const val = g.int(0, 99);
          if (idx !== -1) model.splice(idx, 1);
          model.push([key, val]);
          if (model.length > cap) model.shift();
          c.put(key, val);
        }
      }
    }
  });
});

describe('tree templates (arrayToTree, treeToArray, maxDepth, levelOrder, inorderIterative, isValidBST)', () => {
  it('normal', () => {
    const t = T.arrayToTree([3, 9, 20, null, null, 15, 7]);
    assert.equal(P.maxDepth(t), 3);
    assert.deepEqual(P.levelOrder(t), [[3], [9, 20], [15, 7]]);
    assert.deepEqual(P.inorderIterative(t), [9, 3, 15, 20, 7]);
    assert.equal(P.isValidBST(t), false);
    assert.deepEqual(T.treeToArray(t), [3, 9, 20, null, null, 15, 7]);
  });
  it('empty tree', () => {
    assert.equal(T.arrayToTree([]), null);
    assert.deepEqual(T.treeToArray(null), []);
    assert.equal(P.maxDepth(null), 0);
    assert.deepEqual(P.levelOrder(null), []);
    assert.deepEqual(P.inorderIterative(null), []);
    assert.equal(P.isValidBST(null), true);
  });
  it('duplicates: a BST with an equal child is not valid (strict BST)', () => {
    assert.equal(P.isValidBST(new T.TreeNode(2, new T.TreeNode(2))), false);
    assert.equal(P.isValidBST(new T.TreeNode(2, null, new T.TreeNode(2))), false);
  });
  it('random trees: round trip, depth, levels and BST validity match references', () => {
    const g = rng(26);
    const depthRef = (n) => (n ? 1 + Math.max(depthRef(n.left), depthRef(n.right)) : 0);
    const inorderRef = (n, out = []) => { if (n) { inorderRef(n.left, out); out.push(n.val); inorderRef(n.right, out); } return out; };
    for (let t = 0; t < 200; t++) {
      const tree = g.r() < 0.5 ? bstFromValues(g.arr(g.int(0, 10), 0, 20)) : randomTree(g, g.int(0, 10));
      const arr = T.treeToArray(tree);
      assert.deepEqual(T.treeToArray(T.arrayToTree(arr)), arr);
      assert.equal(P.maxDepth(tree), depthRef(tree));
      const ino = inorderRef(tree);
      assert.deepEqual(P.inorderIterative(tree), ino);
      assert.deepEqual(P.levelOrder(tree).flat().length, ino.length);
      assert.equal(P.levelOrder(tree).length, depthRef(tree));
      assert.equal(P.isValidBST(tree), ino.every((v, i) => i === 0 || ino[i - 1] < v));
    }
  });
});

describe('memoize, gcd, lcm, fastPower', () => {
  it('normal', () => {
    let calls = 0;
    const sq = T.memoize((x) => { calls++; return x * x; });
    assert.equal(sq(4), 16); assert.equal(sq(4), 16);
    assert.equal(calls, 1);
    assert.equal(T.gcd(12, 18), 6);
    assert.equal(T.lcm(4, 6), 12);
    assert.equal(T.fastPower(3, 5), 243);
  });
  it('empty / zero cases', () => {
    const f = T.memoize(() => 42);
    assert.equal(f(), 42);
    assert.equal(T.gcd(0, 0), 0);
    assert.equal(T.gcd(0, 9), 9);
    assert.equal(T.fastPower(7, 0), 1);
    assert.equal(T.fastPower(7, 0, 13), 1);
  });
  it('duplicates: gcd(a, a) = a; memo caches falsy results too', () => {
    assert.equal(T.gcd(9, 9), 9);
    let calls = 0;
    const zero = T.memoize(() => { calls++; return 0; });
    zero(1); zero(1);
    assert.equal(calls, 1);
  });
  it('random: gcd/lcm vs brute force, fastPower vs BigInt', () => {
    const g = rng(27);
    for (let t = 0; t < 200; t++) {
      const a = g.int(1, 200); const b = g.int(1, 200);
      let ref = 1; for (let d = 1; d <= Math.min(a, b); d++) if (a % d === 0 && b % d === 0) ref = d;
      assert.equal(T.gcd(a, b), ref);
      assert.equal(T.lcm(a, b), (a * b) / ref);
      const base = g.int(0, 50); const exp = g.int(0, 60); const mod = g.int(2, 1_000_000_007);
      assert.equal(T.fastPower(base, exp, mod), Number((BigInt(base) ** BigInt(exp)) % BigInt(mod)));
      const smallExp = g.int(0, 10);
      assert.equal(T.fastPower(g.int(0, 9), smallExp) >= 0, true);
    }
  });
});

describe('hash map templates (frequencyMap, twoSumHash, groupByKey)', () => {
  it('normal', () => {
    assert.equal(P.frequencyMap([1, 2, 1]).get(1), 2);
    assert.deepEqual(P.twoSumHash([1, 5, 3], 8), [1, 2]);
    assert.deepEqual(P.groupByKey(['ab', 'ba', 'c'], (w) => [...w].sort().join('')), [['ab', 'ba'], ['c']]);
  });
  it('empty', () => {
    assert.equal(P.frequencyMap([]).size, 0);
    assert.equal(P.twoSumHash([], 1), null);
    assert.deepEqual(P.groupByKey([], String), []);
  });
  it('duplicates and key types: 1 and "1" stay separate', () => {
    const f = P.frequencyMap([1, '1', 1]);
    assert.equal(f.get(1), 2); assert.equal(f.get('1'), 1);
    assert.deepEqual(P.twoSumHash([4, 4], 8), [0, 1]);
    assert.equal(P.twoSumHash([4], 8), null);
  });
  it('random: match brute force', () => {
    const g = rng(28);
    for (let t = 0; t < 200; t++) {
      const a = g.arr(g.int(0, 12), -5, 5);
      const f = P.frequencyMap(a);
      for (const x of new Set(a)) assert.equal(f.get(x), a.filter((y) => y === x).length);
      const target = g.int(-8, 8);
      const res = P.twoSumHash(a, target);
      const exists = a.some((x, i) => a.some((y, j) => j > i && x + y === target));
      assert.equal(res !== null, exists);
      if (res) { assert.ok(res[0] < res[1]); assert.equal(a[res[0]] + a[res[1]], target); }
      const groups = P.groupByKey(a, (x) => Math.abs(x));
      assert.equal(groups.flat().length, a.length);
      groups.forEach((grp) => assert.equal(new Set(grp.map(Math.abs)).size, 1));
    }
  });
});

describe('greedy & intervals (maxNonOverlapping, minBoats, mergeIntervals, insertInterval, maxOverlap)', () => {
  it('normal', () => {
    assert.equal(P.maxNonOverlapping([[1, 2], [2, 3], [1, 3]]), 2);
    assert.equal(P.minBoats([1, 2], 3), 1);
    assert.deepEqual(P.mergeIntervals([[1, 4], [4, 5]]), [[1, 5]]);
    assert.deepEqual(P.insertInterval([[1, 3], [6, 9]], [2, 5]), [[1, 5], [6, 9]]);
    assert.equal(P.maxOverlap([[1, 4], [2, 5], [3, 6]]), 3);
  });
  it('empty', () => {
    assert.equal(P.maxNonOverlapping([]), 0);
    assert.equal(P.minBoats([], 5), 0);
    assert.deepEqual(P.mergeIntervals([]), []);
    assert.deepEqual(P.insertInterval([], [1, 2]), [[1, 2]]);
    assert.equal(P.maxOverlap([]), 0);
  });
  it('duplicates: identical intervals', () => {
    assert.equal(P.maxNonOverlapping([[1, 2], [1, 2]]), 1);
    assert.deepEqual(P.mergeIntervals([[1, 2], [1, 2]]), [[1, 2]]);
    assert.equal(P.maxOverlap([[1, 2], [1, 2]]), 2);
    assert.equal(P.minBoats([2, 2, 2], 4), 2);
  });
  it('random: match brute force (subsets / pairings / repeated merging / point counting)', () => {
    const g = rng(29);
    const minBoatsRef = (people, limit) => {
      const best = (rest) => {
        if (rest.length === 0) return 0;
        const [x, ...others] = rest;
        let b = 1 + best(others);
        others.forEach((y, i) => { if (x + y <= limit) b = Math.min(b, 1 + best(others.filter((_, j) => j !== i))); });
        return b;
      };
      return best(people);
    };
    for (let t = 0; t < 150; t++) {
      const ivs = Array.from({ length: g.int(0, 7) }, () => { const s = g.int(0, 10); return [s, s + g.int(1, 5)]; });
      let bestCount = 0;
      for (const idx of allSubsetsIdx(ivs.length)) {
        const chosen = idx.map((i) => ivs[i]).sort((a, b) => a[0] - b[0]);
        if (chosen.every((x, i) => i === 0 || chosen[i - 1][1] <= x[0])) bestCount = Math.max(bestCount, chosen.length);
      }
      assert.equal(P.maxNonOverlapping(ivs), bestCount);
      // merge by repeated pairwise merging
      let ref = ivs.map((x) => x.slice());
      for (let merged = true; merged;) {
        merged = false;
        outer: for (let i = 0; i < ref.length; i++) for (let j = i + 1; j < ref.length; j++) {
          if (ref[i][0] <= ref[j][1] && ref[j][0] <= ref[i][1]) {
            ref[i] = [Math.min(ref[i][0], ref[j][0]), Math.max(ref[i][1], ref[j][1])];
            ref.splice(j, 1); merged = true; break outer;
          }
        }
      }
      ref.sort((a, b) => a[0] - b[0]);
      assert.deepEqual(P.mergeIntervals(ivs), ref);
      const nw = [g.int(0, 12), 0]; nw[1] = nw[0] + g.int(0, 4);
      assert.deepEqual(P.insertInterval(ref, nw), P.mergeIntervals([...ref, nw]));
      let peak = 0;
      for (let x = 0; x <= 16; x++) peak = Math.max(peak, ivs.filter(([s, e]) => s <= x && x < e).length);
      assert.equal(P.maxOverlap(ivs), peak);
      const people = g.arr(g.int(0, 6), 1, 5);
      const limit = Math.max(5, g.int(1, 9));
      assert.equal(P.minBoats(people, limit), minBoatsRef(people, limit));
    }
  });
});

describe('heaps: kthLargest, topKFrequent, mergeKSorted', () => {
  it('normal', () => {
    assert.equal(P.kthLargest([7, 1, 5], 1), 7);
    assert.deepEqual(P.topKFrequent([3, 3, 1], 1), [3]);
    assert.deepEqual(P.mergeKSorted([[1, 3], [2]]), [1, 2, 3]);
  });
  it('empty', () => {
    assert.equal(P.kthLargest([], 1), undefined);
    assert.deepEqual(P.topKFrequent([], 2), []);
    assert.deepEqual(P.mergeKSorted([]), []);
    assert.deepEqual(P.mergeKSorted([[], []]), []);
  });
  it('duplicates', () => {
    assert.equal(P.kthLargest([5, 5, 5], 2), 5);
    assert.deepEqual(P.topKFrequent([1, 2, 2, 1], 2), [1, 2]);
    assert.deepEqual(P.mergeKSorted([[1, 1], [1]]), [1, 1, 1]);
  });
  it('random: match sorting', () => {
    const g = rng(30);
    for (let t = 0; t < 200; t++) {
      const a = g.arr(g.int(1, 15), -5, 5);
      const k = g.int(1, a.length);
      assert.equal(P.kthLargest(a, k), sortedCopy(a).reverse()[k - 1]);
      const f = P.frequencyMap(a);
      const kk = g.int(1, f.size);
      const ref = [...f].sort((x, y) => y[1] - x[1] || x[0] - y[0]).slice(0, kk).map((e) => e[0]);
      assert.deepEqual(P.topKFrequent(a, kk), ref);
      const lists = Array.from({ length: g.int(0, 5) }, () => sortedCopy(g.arr(g.int(0, 5), 0, 9)));
      assert.deepEqual(P.mergeKSorted(lists), sortedCopy(lists.flat()));
    }
  });
});

describe('dynamic programming (houseRobber, knapsack01, coinChangeMin, lcsLength, lisLength)', () => {
  it('normal', () => {
    assert.equal(P.houseRobber([1, 2, 3, 1]), 4);
    assert.equal(P.knapsack01([2, 3], [3, 4], 5), 7);
    assert.equal(P.coinChangeMin([2, 5], 9), 3);
    assert.equal(P.lcsLength('abc', 'abd'), 2);
    assert.equal(P.lisLength([0, 1, 0, 3, 2, 3]), 4);
  });
  it('empty', () => {
    assert.equal(P.houseRobber([]), 0);
    assert.equal(P.knapsack01([], [], 10), 0);
    assert.equal(P.coinChangeMin([1, 2], 0), 0);
    assert.equal(P.coinChangeMin([], 3), -1);
    assert.equal(P.lcsLength('', 'abc'), 0);
    assert.equal(P.lisLength([]), 0);
  });
  it('duplicates', () => {
    assert.equal(P.lisLength([7, 7, 7]), 1);
    assert.equal(P.lcsLength('aaa', 'aa'), 2);
    assert.equal(P.houseRobber([5, 5, 5]), 10);
    assert.equal(P.knapsack01([1, 1], [1, 1], 1), 1);
  });
  it('random: match exponential brute force', () => {
    const g = rng(31);
    const lcsRef = (a, b) => (!a.length || !b.length ? 0 : a[0] === b[0] ? 1 + lcsRef(a.slice(1), b.slice(1)) : Math.max(lcsRef(a.slice(1), b), lcsRef(a, b.slice(1))));
    for (let t = 0; t < 150; t++) {
      const a = g.arr(g.int(0, 9), 0, 9);
      let rob = 0; let lis = 0;
      for (const idx of allSubsetsIdx(a.length)) {
        if (idx.every((x, i) => i === 0 || idx[i - 1] + 1 < x)) rob = Math.max(rob, idx.reduce((s, i) => s + a[i], 0));
        if (idx.every((x, i) => i === 0 || a[idx[i - 1]] < a[x])) lis = Math.max(lis, idx.length);
      }
      assert.equal(P.houseRobber(a), rob);
      assert.equal(P.lisLength(a), lis);
      const n = g.int(0, 7);
      const w = g.arr(n, 1, 6); const v = g.arr(n, 0, 9); const W = g.int(0, 15);
      let best = 0;
      for (const idx of allSubsetsIdx(n)) {
        if (idx.reduce((s, i) => s + w[i], 0) <= W) best = Math.max(best, idx.reduce((s, i) => s + v[i], 0));
      }
      assert.equal(P.knapsack01(w, v, W), best);
      const coins = [...new Set(g.arr(g.int(1, 3), 1, 7))];
      const amount = g.int(0, 25);
      const dist = new Map([[0, 0]]); const q = [0];
      for (let h = 0; h < q.length; h++) for (const c of coins) {
        const nx = q[h] + c;
        if (nx <= amount && !dist.has(nx)) { dist.set(nx, dist.get(q[h]) + 1); q.push(nx); }
      }
      assert.equal(P.coinChangeMin(coins, amount), dist.has(amount) ? dist.get(amount) : -1);
      const s1 = g.arr(g.int(0, 6), 0, 2).join(''); const s2 = g.arr(g.int(0, 6), 0, 2).join('');
      assert.equal(P.lcsLength(s1, s2), lcsRef(s1, s2));
    }
  });
});

describe('bit manipulation (popcount, singleNumber, subsetsBitmask, isPowerOfTwo)', () => {
  it('normal', () => {
    assert.equal(P.popcount(7), 3);
    assert.equal(P.singleNumber([2, 9, 2]), 9);
    assert.equal(P.isPowerOfTwo(1024), true);
  });
  it('empty / zero', () => {
    assert.equal(P.popcount(0), 0);
    assert.equal(P.singleNumber([]), 0);
    assert.deepEqual(P.subsetsBitmask([]), [[]]);
    assert.equal(P.isPowerOfTwo(0), false);
  });
  it('duplicates and negatives', () => {
    assert.equal(P.singleNumber([-3, 4, 4]), -3);
    assert.equal(P.popcount(-1), 32);
    assert.equal(P.isPowerOfTwo(-8), false);
    assert.equal(P.subsetsBitmask([1, 1]).length, 4);
  });
  it('random: match string / loop references', () => {
    const g = rng(32);
    for (let t = 0; t < 300; t++) {
      const x = g.int(0, 2 ** 31 - 1);
      assert.equal(P.popcount(x), [...x.toString(2)].filter((c) => c === '1').length);
      let p = 1; while (p < x) p *= 2;
      assert.equal(P.isPowerOfTwo(x), x > 0 && p === x);
      const singles = g.arr(g.int(0, 6), -50, 50);
      const lone = g.int(-50, 50);
      const arr = [...singles, ...singles, lone];
      for (let i = arr.length - 1; i > 0; i--) { const j = g.int(0, i); [arr[i], arr[j]] = [arr[j], arr[i]]; }
      assert.equal(P.singleNumber(arr), lone);
    }
  });
});

describe('matrix traversal (spiralOrder, rotateClockwise)', () => {
  it('normal', () => {
    assert.deepEqual(P.spiralOrder([[1, 2], [3, 4]]), [1, 2, 4, 3]);
    assert.deepEqual(P.rotateClockwise([[1, 2, 3], [4, 5, 6], [7, 8, 9]]), [[7, 4, 1], [8, 5, 2], [9, 6, 3]]);
  });
  it('empty', () => {
    assert.deepEqual(P.spiralOrder([]), []);
    assert.deepEqual(P.spiralOrder([[]]), []);
    assert.deepEqual(P.rotateClockwise([]), []);
  });
  it('duplicates and single row / column', () => {
    assert.deepEqual(P.spiralOrder([[1, 1, 1]]), [1, 1, 1]);
    assert.deepEqual(P.spiralOrder([[1], [2], [3]]), [1, 2, 3]);
    assert.deepEqual(P.rotateClockwise([[5, 5], [5, 5]]), [[5, 5], [5, 5]]);
  });
  it('random: spiral matches a turn-right simulation; rotation matches the index formula; input not mutated', () => {
    const g = rng(33);
    for (let t = 0; t < 150; t++) {
      const R = g.int(1, 6); const C = g.int(1, 6);
      const m = Array.from({ length: R }, () => g.arr(C, 0, 9));
      const seen = Array.from({ length: R }, () => new Array(C).fill(false));
      const ref = []; let r = 0; let c = 0; let d = 0;
      const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];
      for (let i = 0; i < R * C; i++) {
        ref.push(m[r][c]); seen[r][c] = true;
        const nr = r + dirs[d][0]; const nc = c + dirs[d][1];
        if (nr < 0 || nc < 0 || nr >= R || nc >= C || seen[nr][nc]) d = (d + 1) % 4;
        r += dirs[d][0]; c += dirs[d][1];
      }
      assert.deepEqual(P.spiralOrder(m), ref);
      const n = g.int(1, 5);
      const sq = Array.from({ length: n }, () => g.arr(n, 0, 9));
      const copy = sq.map((row) => row.slice());
      const rot = P.rotateClockwise(sq);
      for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) assert.equal(rot[i][j], sq[n - 1 - j][i]);
      assert.deepEqual(sq, copy);
    }
  });
});

describe('subarray vs subsequence (maxSubarraySum, isSubsequence)', () => {
  it('normal', () => {
    assert.equal(P.maxSubarraySum([1, -2, 3, 4]), 7);
    assert.equal(P.isSubsequence('abc', 'ahbgdc'), true);
  });
  it('empty', () => {
    assert.equal(P.maxSubarraySum([]), -Infinity);
    assert.equal(P.isSubsequence('', 'abc'), true);
    assert.equal(P.isSubsequence('a', ''), false);
  });
  it('duplicates and all-negative', () => {
    assert.equal(P.maxSubarraySum([-3, -1, -2]), -1);
    assert.equal(P.isSubsequence('aa', 'ab'), false);
    assert.equal(P.isSubsequence('aa', 'aba'), true);
  });
  it('random: match brute force', () => {
    const g = rng(34);
    for (let t = 0; t < 200; t++) {
      const a = g.arr(g.int(1, 10), -5, 5);
      assert.equal(P.maxSubarraySum(a), Math.max(...allSubarrays(a).map((x) => x.reduce((s, y) => s + y, 0))));
      const tt = g.arr(g.int(0, 8), 0, 2).join('');
      const s = g.arr(g.int(0, 4), 0, 2).join('');
      const ref = allSubsetsIdx(tt.length).some((idx) => idx.map((i) => tt[i]).join('') === s);
      assert.equal(P.isSubsequence(s, tt), ref);
    }
  });
});

describe('string matching (prefixFunction, kmpSearchAll)', () => {
  it('normal', () => {
    assert.deepEqual(P.prefixFunction('abab'), [0, 0, 1, 2]);
    assert.deepEqual(P.kmpSearchAll('hello world', 'o'), [4, 7]);
  });
  it('empty', () => {
    assert.deepEqual(P.prefixFunction(''), []);
    assert.deepEqual(P.kmpSearchAll('', 'a'), []);
    assert.deepEqual(P.kmpSearchAll('ab', ''), [0, 1, 2]);
  });
  it('duplicates: overlapping matches are all reported', () => {
    assert.deepEqual(P.kmpSearchAll('aaaa', 'aa'), [0, 1, 2]);
    assert.deepEqual(P.prefixFunction('aaaa'), [0, 1, 2, 3]);
  });
  it('random: match naive definitions', () => {
    const g = rng(35);
    for (let t = 0; t < 200; t++) {
      const s = g.arr(g.int(0, 10), 0, 1).map((x) => 'ab'[x]).join('');
      const pi = s.split('').map((_, i) => {
        for (let len = i; len > 0; len--) if (s.slice(0, len) === s.slice(i - len + 1, i + 1)) return len;
        return 0;
      });
      assert.deepEqual(P.prefixFunction(s), pi);
      const p = g.arr(g.int(1, 3), 0, 1).map((x) => 'ab'[x]).join('');
      const ref = []; for (let i = 0; i + p.length <= s.length; i++) if (s.startsWith(p, i)) ref.push(i);
      assert.deepEqual(P.kmpSearchAll(s, p), ref);
    }
  });
});

describe('state-space search (bfsStates, nQueensCount)', () => {
  it('normal: known N-Queens counts', () => {
    assert.deepEqual([1, 2, 3, 4, 5, 6, 7, 8].map(P.nQueensCount), [1, 0, 0, 2, 10, 4, 40, 92]);
    assert.equal(P.bfsStates(1, (x) => x === 10, (x) => [x + 1, x * 2]), 4); // 1 -> 2 -> 4 -> 5 -> 10
  });
  it('empty: start is already the goal; n = 0 queens has one (empty) placement', () => {
    assert.equal(P.bfsStates('x', () => true, () => []), 0);
    assert.equal(P.nQueensCount(0), 1);
  });
  it('duplicates: neighbors repeating the same state are visited once; unreachable goal -> -1', () => {
    assert.equal(P.bfsStates(0, (x) => x === 2, (x) => [x + 1, x + 1, x]), 2);
    assert.equal(P.bfsStates(0, (x) => x === 99, (x) => (x < 5 ? [x + 1] : [])), -1);
  });
  it('random: bfsStates equals bfsGraph on the explicit state graph', () => {
    const g = rng(36);
    for (let t = 0; t < 150; t++) {
      const N = g.int(1, 30);
      const a = g.int(1, 4); const b = g.int(2, 3);
      const next = (x) => [x + a, x * b, x - 1].filter((y) => y >= 0 && y <= N);
      const goal = g.int(0, N);
      const graph = new Map(); for (let x = 0; x <= N; x++) graph.set(x, next(x));
      const dist = T.bfsGraph(graph, 0);
      assert.equal(P.bfsStates(0, (x) => x === goal, next), dist.has(goal) ? dist.get(goal) : -1);
    }
  });
});

// ---------- drill solutions: extra edge cases ----------
describe('drill solutions (03_Problems/solutions)', () => {
  const badge = require('../03_Problems/solutions/01_badge_scan_repeat');
  const pairs = require('../03_Problems/solutions/02_playlist_pairs');
  const build = require('../03_Problems/solutions/05_build_rounds');
  const battery = require('../03_Problems/solutions/08_smallest_battery');
  const calm = require('../03_Problems/solutions/09_calm_streak');
  const gym = require('../03_Problems/solutions/10_gym_passes');
  it('badge scan: huge k behaves like "any repeat"', () => {
    assert.equal(badge.optimal(['a', 'b', 'c', 'a'], 1e9), 3);
    assert.equal(badge.optimal(['a'], 5), -1);
  });
  it('playlist pairs: large input counts n(n-1)/2 when everything fits', () => {
    const n = 20000;
    assert.equal(pairs.optimal(new Array(n).fill(1), 2), (n * (n - 1)) / 2);
  });
  it('build rounds: a long chain needs n rounds', () => {
    const n = 1000;
    const deps = Array.from({ length: n - 1 }, (_, i) => [i, i + 1]);
    assert.equal(build.optimal(n, deps), n);
  });
  it('smallest battery: stops >= n - 1 gives the max segment', () => {
    assert.equal(battery.optimal([3, 9, 2, 7], 10), 9);
    assert.equal(battery.optimal([5], 0), 5);
  });
  it('calm streak: large d covers everything, d = 0 finds the longest equal run', () => {
    assert.equal(calm.optimal([5, -5, 100, 3], 1e9), 4);
    assert.equal(calm.optimal([1, 2, 2, 2, 3, 3], 0), 3);
  });
  it('gym passes: a single long cheap pass covers everything', () => {
    assert.equal(gym.optimal([1, 50, 100, 365], [[1, 10], [365, 15]]), 15);
  });
});
