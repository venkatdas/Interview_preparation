# Keys and Rooms

| | |
|---|---|
| **Topic** | Graph Traversal (BFS and DFS) |
| **Difficulty** | Medium |
| **Pattern** | DFS reachability |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #841 — https://leetcode.com/problems/keys-and-rooms/ |
| **Solution file** | [04_keys_and_rooms.js](../solutions/04_keys_and_rooms.js) — open only after a real attempt |

## Problem

There are n rooms 0..n-1. Room 0 is unlocked, all others are locked. rooms[i] is the
list of keys you find in room i (a key is just a room number). Starting in room 0,
can you enter every room?

## Examples

```
Input: [[1],[2],[3],[]]      Output: true    Explanation: 0 -> 1 -> 2 -> 3
Input: [[1,3],[3,0,1],[2],[0]] Output: false   Explanation: nobody has a key to room 2
```

## Constraints & clarifying questions

```
- Can a room contain a key to itself or duplicates? (yes, harmless)
- Is room 0 always open? (yes)

This is "is every node reachable from node 0" on a DIRECTED graph (room i -> key j).
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *DFS reachability* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (repeat until no new room opens)   O(n^2 + total keys) time. Keep a set of open rooms.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (DFS from room 0)   O(n + k) time, O(n) space  (k = total keys). 1.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- n = 1 -> true (room 0 is open)
- rooms[0] empty with n > 1 -> false
- keys forming cycles (0 -> 1 -> 0) -> visited set prevents looping
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (repeat until no new room opens)   O(n^2 + total keys) time

```
Keep a set of open rooms. Loop: for every open room, add all its keys. Stop when a full
pass opens nothing new. Up to n passes, each scanning all open rooms.
```

### APPROACH 2 — Optimal (DFS from room 0)   O(n + k) time, O(n) space  (k = total keys)

```
1. visited = {0}, stack = [0]
  2. pop a room, for each key: if the room is unvisited, mark and push
  3. answer = visited.size === n

Dry run on [[1,3],[3,0,1],[2],[0]]:
  stack [0] visited {0}
  pop 0: keys 1,3 -> push both      visited {0,1,3}
  pop 3: key 0 already seen
  pop 1: keys 3,0,1 all seen
  stack empty, visited.size = 3 !== 4 -> false
```

### Edge cases

```
- n = 1 -> true (room 0 is open)
- rooms[0] empty with n > 1 -> false
- keys forming cycles (0 -> 1 -> 0) -> visited set prevents looping
```

Full JavaScript solution with tests: [04_keys_and_rooms.js](../solutions/04_keys_and_rooms.js). Run it with `node 04_keys_and_rooms.js` from the solutions folder.

</details>

## Common mistakes

- Starting with all rooms marked visited or forgetting room 0 starts unlocked.
- Comparing the number of keys instead of the number of visited rooms with n.
- Revisiting rooms because keys repeat.

## Related follow-ups

- [Find if Path Exists in Graph](../01_Easy/03_find_if_path_exists.md)
- [Number of Connected Components in an Undirected Graph](07_number_of_connected_components.md)
- [Course Schedule](../../../26_Topological_Sorting/03_Problems/02_Medium/01_course_schedule.md) (26_Topological_Sorting)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
