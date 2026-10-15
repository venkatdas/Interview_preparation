/**
 * 05. Bus Routes   (LeetCode 815 — Hard)
 *
 * PROBLEM
 * routes[i] is the list of stops that bus i cycles through forever. You start at stop
 * `source` (not on a bus) and want to reach stop `target`. Return the minimum number of
 * BUSES you must take, or -1 if impossible.
 *
 * EXAMPLES
 * Input: routes = [[1,2,7],[3,6,7]], source = 1, target = 6   Output: 2
 * Explanation: bus 0 from 1 to 7, then bus 1 from 7 to 6.
 * Input: routes = [[7,12],[4,5,15],[6],[15,19],[9,12,13]], source = 15, target = 12
 * Output: -1
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - source === target -> 0 buses
 * - Up to 500 routes, 10^5 total stops -> BFS over stops per route change is fine,
 *   O(routes^2) route-graph building is also fine
 *
 * THE TRICK: count BUSES, not stops. So BFS where one "step" = boarding one bus.
 *
 * APPROACH 1 — Alternative (BFS on the ROUTE graph)   O(R^2 * S) build + O(R^2) BFS
 * Node = route. Two routes are adjacent if they share a stop. Start from all routes
 * containing source, BFS until a route containing target; answer = number of routes on
 * the path. Shown as `routeGraphVersion` - this is the "BFS on routes" idea by the book.
 *
 * APPROACH 2 — Optimal (BFS on stops, expanding whole routes)   O(total stops)
 *   1. stopToRoutes: stop -> list of route indices.
 *   2. BFS level by level over stops; from each stop, for every route through it that we
 *      have NOT used yet, mark the route used and push all its stops.
 *   3. Each level = one more bus. The first level where we see target is the answer.
 * Marking routes as used (not just stops) is what keeps it linear.
 *
 * Dry run routes [[1,2,7],[3,6,7]], 1 -> 6:
 *   level 1 (1 bus): from stop 1 take route 0 -> stops 2, 7
 *   level 2 (2 buses): from 7 take route 1 -> stops 3, 6 -> target found -> 2
 *
 * EDGE CASES
 * - source === target -> 0 (check before anything)
 * - source or target on no route -> -1
 * - target on the same route as source -> 1
 */

function routeGraphVersion(routes, source, target) {
  if (source === target) return 0;
  const n = routes.length;
  const sets = routes.map((r) => new Set(r));
  const adj = Array.from({ length: n }, () => []);
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const shares = [...sets[i]].some((stop) => sets[j].has(stop));
      if (shares) { adj[i].push(j); adj[j].push(i); }
    }
  }
  const dist = new Array(n).fill(-1);
  const queue = [];
  for (let i = 0; i < n; i++) if (sets[i].has(source)) { dist[i] = 1; queue.push(i); }
  let head = 0;
  while (head < queue.length) {
    const route = queue[head++];
    if (sets[route].has(target)) return dist[route];
    for (const next of adj[route]) {
      if (dist[next] === -1) { dist[next] = dist[route] + 1; queue.push(next); }
    }
  }
  return -1;
}

function optimal(routes, source, target) {
  if (source === target) return 0;
  const stopToRoutes = new Map();
  routes.forEach((stops, routeIndex) => {
    for (const stop of stops) {
      if (!stopToRoutes.has(stop)) stopToRoutes.set(stop, []);
      stopToRoutes.get(stop).push(routeIndex);
    }
  });
  if (!stopToRoutes.has(source) || !stopToRoutes.has(target)) return -1;

  const usedRoute = new Array(routes.length).fill(false);
  const seenStop = new Set([source]);
  let frontier = [source];
  let buses = 0;
  while (frontier.length) {
    buses++;                                       // boarding one more bus
    const next = [];
    for (const stop of frontier) {
      for (const routeIndex of stopToRoutes.get(stop)) {
        if (usedRoute[routeIndex]) continue;       // a route is only worth riding once
        usedRoute[routeIndex] = true;
        for (const reachable of routes[routeIndex]) {
          if (reachable === target) return buses;
          if (!seenStop.has(reachable)) { seenStop.add(reachable); next.push(reachable); }
        }
      }
    }
    frontier = next;
  }
  return -1;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [routeGraphVersion, optimal]) {
  assert.strictEqual(solve([[1, 2, 7], [3, 6, 7]], 1, 6), 2);
  assert.strictEqual(solve([[7, 12], [4, 5, 15], [6], [15, 19], [9, 12, 13]], 15, 12), -1);
  assert.strictEqual(solve([[1, 2, 3]], 2, 2), 0);
  assert.strictEqual(solve([[1, 2, 3]], 1, 3), 1);
  assert.strictEqual(solve([[1, 2], [2, 3], [3, 4]], 1, 4), 3);
  assert.strictEqual(solve([[1, 2], [3, 4]], 1, 4), -1);
  assert.strictEqual(solve([[1, 7], [3, 5]], 5, 5), 0);
}
console.log('✓ 05-bus-routes passed');

module.exports = { optimal, routeGraphVersion };
