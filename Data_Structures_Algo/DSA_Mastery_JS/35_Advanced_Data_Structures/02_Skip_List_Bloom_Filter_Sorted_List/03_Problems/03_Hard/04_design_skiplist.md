# Design Skiplist

| | |
|---|---|
| **Topic** | Skip List, Bloom Filter and Sorted List |
| **Difficulty** | Hard |
| **Pattern** | skip list from scratch |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #1206 — https://leetcode.com/problems/design-skiplist/ |
| **Solution file** | [04_design_skiplist.js](../solutions/04_design_skiplist.js) — open only after a real attempt |

## Problem

Implement a Skiplist with search(target), add(num) and erase(num) (erase returns false
if num is absent; duplicates are allowed and erase removes one copy). Operations must
run in O(log n) on average, without using built-in sorted structures.

## Examples

```
add(1); add(2); add(3); search(0) -> false; add(4); search(1) -> true;
erase(0) -> false; erase(1) -> true; search(1) -> false
```

## Constraints & clarifying questions

```
- Values 0..2*10^4, up to 5*10^4 calls
- Duplicates allowed? (yes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *skip list from scratch* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (sorted array)   O(log n) search, O(n) add/erase. Binary search for the position; splice to insert/remove.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Skip list)   expected O(log n) for all three. A sorted linked list with extra "express" levels.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- erase on an empty list -> false
- duplicates: add(1) twice, erase(1) once -> search(1) still true
- search on an empty list -> false
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (sorted array)   O(log n) search, O(n) add/erase

```
Binary search for the position; splice to insert/remove. Simple, and honestly fast in
JS for this input size, but it is not what the problem is testing.
```

### APPROACH 2 — Optimal (Skip list)   expected O(log n) for all three

```
A sorted linked list with extra "express" levels. Each node gets a random height
(coin flips, p = 1/2). Search walks from the top level: move right while next.value <
target, otherwise drop one level. Add walks the same path while recording the last node
visited on every level (predecessors), then links the new node in on levels 0..height.
Erase walks the path and unlinks the node on every level where the predecessor points to it.

Dry run: add 1, 2, 3 (heights say 0, 1, 0), then search(2):
  level 1: HEAD -> 2 -> null
  level 0: HEAD -> 1 -> 2 -> 3 -> null
  search(2): level 1: HEAD.next = 2, not < 2 -> drop; level 0: HEAD.next = 1 < 2 -> move;
             next = 2, not < 2 -> stop; candidate = 2 -> true
```

### Edge cases

```
- erase on an empty list -> false
- duplicates: add(1) twice, erase(1) once -> search(1) still true
- search on an empty list -> false
```

Full JavaScript solution with tests: [04_design_skiplist.js](../solutions/04_design_skiplist.js). Run it with `node 04_design_skiplist.js` from the solutions folder.

</details>

## Common mistakes

- Not recording the predecessor on EVERY level before inserting, so higher levels are linked wrongly.
- On erase, unlinking on levels the node is not part of (stop when `update[i].next[i] !== node`).
- Forgetting duplicates are allowed: `erase` removes only one copy.

## Related follow-ups

- [LRU Cache](../../../01_LRU_And_LFU_Cache/03_Problems/02_Medium/01_lru_cache.md) (another linked-structure design)
- [Linked Lists](../../../../15_Linked_Lists/README.md)
- Design a Leaderboard (LeetCode #1244)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
