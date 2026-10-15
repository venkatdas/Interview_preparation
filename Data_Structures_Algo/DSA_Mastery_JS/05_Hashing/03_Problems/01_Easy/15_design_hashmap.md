# Design HashMap

| | |
|---|---|
| **Topic** | Hashing (Hash Maps and Sets) |
| **Difficulty** | Easy |
| **Pattern** | implementation |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #706 — https://leetcode.com/problems/design-hashmap/ |
| **Solution file** | [15_design_hashmap.js](../solutions/15_design_hashmap.js) — open only after a real attempt |

## Problem

Design a HashMap without using any built-in hash table library.
Implement put(key, value), get(key) (-1 if missing) and remove(key).
Keys and values are non-negative integers.

## Examples

```
put(1, 1); put(2, 2); get(1) -> 1; get(3) -> -1; put(2, 1); get(2) -> 1;
remove(2); get(2) -> -1
```

## Constraints & clarifying questions

```
- Key range? (0 <= key <= 10^6 on LeetCode -> a direct array of size 10^6+1 works, but
  it's the "cheat" answer; the interviewer wants buckets + hash function)
- How many operations? (up to 10^4)
- Should it resize? (nice to have; we implement it)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *implementation* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (direct-address array)   O(1) time, O(maxKey) space. Allocate an array of size maxKey + 1 and index directly.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (buckets with separate chaining + resizing)   O(1) average, O(n) space. - buckets: array of lists of [key, value] - hash(key) = key % buckets.length - put: find key in its bucket -> update, else push; count++, resize when load > 0.75 - get: scan the bucket - remove: splice from the bucket - resize: double buckets, re-insert all pa

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- get on a missing key -> -1
- put on an existing key overwrites (count must NOT grow)
- remove on a missing key does nothing
- key 0
- many colliding keys (multiples of the bucket count)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (direct-address array)   O(1) time, O(maxKey) space

```
Allocate an array of size maxKey + 1 and index directly. Works only because keys are
small non-negative integers; wastes memory and can't handle strings or huge keys.
```

### APPROACH 2 — Optimal (buckets with separate chaining + resizing)   O(1) average, O(n) space

```
- buckets: array of lists of [key, value]
  - hash(key) = key % buckets.length
  - put: find key in its bucket -> update, else push; count++, resize when load > 0.75
  - get: scan the bucket
  - remove: splice from the bucket
  - resize: double buckets, re-insert all pairs (indexes change with the modulus)

Dry run with 4 buckets: put(1,1) -> bucket 1; put(5,5) -> 5 % 4 = 1 -> same bucket
  (collision, chain [[1,1],[5,5]]); get(5) -> bucket 1, scan, find 5 -> 5.
  put(2,2), put(3,3) -> count 4, load 4/4 = 1.0 > 0.75 -> resize to 8:
  1 -> bucket 1, 5 -> bucket 5 (no longer collide), 2 -> 2, 3 -> 3.
```

### Edge cases

```
- get on a missing key -> -1
- put on an existing key overwrites (count must NOT grow)
- remove on a missing key does nothing
- key 0
- many colliding keys (multiples of the bucket count)
```

Full JavaScript solution with tests: [15_design_hashmap.js](../solutions/15_design_hashmap.js). Run it with `node 15_design_hashmap.js` from the solutions folder.

</details>

## Common mistakes

- Not updating the value when `put` is called with an existing key, creating a duplicate entry in the bucket.
- Using a negative hash (from `%` on a negative number) as an array index.
- Deleting from a bucket while iterating it with indices, which skips the next entry.

## Related follow-ups

- Design HashSet (LeetCode #705) — the same structure without values
- LRU Cache (LeetCode #146) — hash map plus a doubly linked list
- [Time Based Key-Value Store](../../../10_Searching/03_Problems/02_Medium/15_time_based_key_value_store.md) — a map whose values are sorted lists

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
