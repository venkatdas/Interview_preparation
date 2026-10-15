# Sequence Reconstruction

| | |
|---|---|
| **Topic** | Topological Sorting |
| **Difficulty** | Medium |
| **Pattern** | unique topological order |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #444 — https://leetcode.com/problems/sequence-reconstruction/ |
| **Solution file** | [06_sequence_reconstruction.js](../solutions/06_sequence_reconstruction.js) — open only after a real attempt |

## Problem

nums is a permutation of 1..n. sequences is a list of subsequences of nums. Return true
if nums is the ONLY shortest supersequence consistent with all the subsequences - in
other words, the ordering constraints given by `sequences` determine nums uniquely.

## Examples

```
Input: nums = [1,2,3], sequences = [[1,2],[1,3]]         Output: false
Explanation: [1,3,2] also satisfies both subsequences.
Input: nums = [1,2,3], sequences = [[1,2],[1,3],[2,3]]   Output: true
Input: nums = [1,2,3], sequences = [[1,2]]               Output: false (3 unconstrained)
```

## Constraints & clarifying questions

```
- Can sequences contain numbers outside 1..n? (assume no / return false)
- Can a sequence be a single element? (yes, gives no edge)

Each consecutive pair (a, b) in a sequence is an edge a -> b. nums is the unique
topological order iff Kahn's queue has exactly ONE node at every step AND the order
produced equals nums.
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *unique topological order* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (check every adjacent pair of nums is forced)   O(n + total). nums is unique iff for every i, the pair (nums[i], nums[i+1]) appears as consecutive elements in some sequence.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Kahn with uniqueness check)   O(n + total length). 1.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- n = 1 with sequences [[1]] -> true
- sequence referencing a number > n -> false
- cycle in sequences -> false (Kahn stops early)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (check every adjacent pair of nums is forced)   O(n + total)

```
nums is unique iff for every i, the pair (nums[i], nums[i+1]) appears as consecutive
elements in some sequence. Collect all consecutive pairs into a set and check. Also
every sequence must be consistent with nums (positions increasing). This is elegant
but relies on a non-obvious fact; the Kahn version is the general tool.
```

### APPROACH 2 — Optimal (Kahn with uniqueness check)   O(n + total length)

```
1. Build edges from consecutive pairs; in-degree.
  2. Kahn: if the queue ever holds more than one node -> two valid orders -> false.
  3. The popped node must equal nums[index]; else false.
  4. All n nodes popped -> true.

Dry run nums [1,2,3], sequences [[1,2],[1,3],[2,3]]:
  edges 1->2, 1->3, 2->3. indeg [_,0,1,2]. queue [1] (size 1 ok) pop 1 === nums[0]
  indeg[2]=0, indeg[3]=1. queue [2] pop 2 === nums[1]. indeg[3]=0 queue [3] pop 3. true.
With sequences [[1,2],[1,3]]: after popping 1, queue [2,3] size 2 -> false.
```

### Edge cases

```
- n = 1 with sequences [[1]] -> true
- sequence referencing a number > n -> false
- cycle in sequences -> false (Kahn stops early)
```

Full JavaScript solution with tests: [06_sequence_reconstruction.js](../solutions/06_sequence_reconstruction.js). Run it with `node 06_sequence_reconstruction.js` from the solutions folder.

</details>

## Common mistakes

- Checking only that `nums` is A valid order; it must be the ONLY valid order (queue size must stay exactly 1).
- Forgetting that every adjacent pair in nums must be an edge in some sequence; that is the same uniqueness condition seen another way.
- Ignoring numbers that never appear in any sequence.

## Related follow-ups

- [Course Schedule II](02_course_schedule_ii.md)
- [Alien Dictionary](../03_Hard/08_alien_dictionary.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
