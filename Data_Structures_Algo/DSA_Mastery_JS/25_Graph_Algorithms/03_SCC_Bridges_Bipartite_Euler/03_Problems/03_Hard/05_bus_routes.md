# Bus Routes

| | |
|---|---|
| **Topic** | Advanced Graph Algorithms (SCC, Bridges, Bipartite, Euler) |
| **Difficulty** | Hard |
| **Pattern** | BFS on routes |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #815 — https://leetcode.com/problems/bus-routes/ |
| **Solution file** | [05_bus_routes.js](../solutions/05_bus_routes.js) — open only after a real attempt |

## Problem

routes[i] is the list of stops that bus i cycles through forever. You start at stop
`source` (not on a bus) and want to reach stop `target`. Return the minimum number of
BUSES you must take, or -1 if impossible.

## Examples

```
Input: routes = [[1,2,7],[3,6,7]], source = 1, target = 6   Output: 2
Explanation: bus 0 from 1 to 7, then bus 1 from 7 to 6.
Input: routes = [[7,12],[4,5,15],[6],[15,19],[9,12,13]], source = 15, target = 12
Output: -1
```

## Constraints & clarifying questions

```
- source === target -> 0 buses
- Up to 500 routes, 10^5 total stops -> BFS over stops per route change is fine,
  O(routes^2) route-graph building is also fine

THE TRICK: count BUSES, not stops. So BFS where one "step" = boarding one bus.
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *BFS on routes* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Alternative (BFS on the ROUTE graph)   O(R^2 * S) build + O(R^2) BFS. Node = route.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (BFS on stops, expanding whole routes)   O(total stops). 1.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- source === target -> 0 (check before anything)
- source or target on no route -> -1
- target on the same route as source -> 1
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Alternative (BFS on the ROUTE graph)   O(R^2 * S) build + O(R^2) BFS

```
Node = route. Two routes are adjacent if they share a stop. Start from all routes
containing source, BFS until a route containing target; answer = number of routes on
the path. Shown as `routeGraphVersion` - this is the "BFS on routes" idea by the book.
```

### APPROACH 2 — Optimal (BFS on stops, expanding whole routes)   O(total stops)

```
1. stopToRoutes: stop -> list of route indices.
  2. BFS level by level over stops; from each stop, for every route through it that we
     have NOT used yet, mark the route used and push all its stops.
  3. Each level = one more bus. The first level where we see target is the answer.
Marking routes as used (not just stops) is what keeps it linear.

Dry run routes [[1,2,7],[3,6,7]], 1 -> 6:
  level 1 (1 bus): from stop 1 take route 0 -> stops 2, 7
  level 2 (2 buses): from 7 take route 1 -> stops 3, 6 -> target found -> 2
```

### Edge cases

```
- source === target -> 0 (check before anything)
- source or target on no route -> -1
- target on the same route as source -> 1
```

Full JavaScript solution with tests: [05_bus_routes.js](../solutions/05_bus_routes.js). Run it with `node 05_bus_routes.js` from the solutions folder.

</details>

## Common mistakes

- Not returning 0 immediately when source === target.
- BFS over stops while counting stops instead of buses; the answer counts BUSES taken.
- Re-scanning a whole route every time a stop is reached; mark each route visited once.

## Related follow-ups

- [Word Ladder](../../../../24_Graph_Traversal/03_Problems/03_Hard/18_word_ladder.md)
- [Open the Lock](../../../../24_Graph_Traversal/03_Problems/02_Medium/17_open_the_lock.md)
- [Shortest Path Visiting All Nodes](10_shortest_path_visiting_all_nodes.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
