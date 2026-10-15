# Random Pick Index

| | |
|---|---|
| **Topic** | Classic Techniques (Kadane, Boyer-Moore, Floyd, Reservoir, Binary Lifting, Sqrt Decomposition) |
| **Difficulty** | Medium |
| **Pattern** | reservoir sampling over matches |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #398 — https://leetcode.com/problems/random-pick-index/ |
| **Solution file** | [05_random_pick_index.js](../solutions/05_random_pick_index.js) — open only after a real attempt |

## Problem

Given an array with possible duplicates, implement pick(target): return a random index i
with nums[i] === target, every valid index equally likely. The array may be too large to
use extra memory proportional to it.

## Examples

```
nums = [1,2,3,3,3]; pick(3) -> 2, 3 or 4 each with probability 1/3; pick(1) -> 0
```

## Constraints & clarifying questions

```
- target always exists
- Many pick calls vs memory limit: which matters more? (decides between the two approaches)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *reservoir sampling over matches* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (precomputed index lists)   O(n) space, O(1) per pick. Map value -> array of indices; pick a random entry.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Reservoir sampling over matching indices)   O(n) per pick, O(1) space. Scan the array; for the c-th index that equals target (c = 1, 2, ...) replace the current pick with probability 1/c.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- target occurs once -> that index always
- all elements equal -> uniform over all indices
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (precomputed index lists)   O(n) space, O(1) per pick

```
Map value -> array of indices; pick a random entry. Fast, but O(n) extra memory.
```

### APPROACH 2 — Optimal (Reservoir sampling over matching indices)   O(n) per pick, O(1) space

```
Scan the array; for the c-th index that equals target (c = 1, 2, ...) replace the current
pick with probability 1/c. Each matching index ends up chosen with probability 1/count.

Dry run on [1,2,3,3,3], pick(3):
  i=2 (1st match): pick 2 with prob 1
  i=3 (2nd match): replace with prob 1/2
  i=4 (3rd match): replace with prob 1/3 -> each of 2, 3, 4 has prob 1/3
```

### Edge cases

```
- target occurs once -> that index always
- all elements equal -> uniform over all indices
```

Full JavaScript solution with tests: [05_random_pick_index.js](../solutions/05_random_pick_index.js). Run it with `node 05_random_pick_index.js` from the solutions folder.

</details>

## Common mistakes

- Counting all elements in the reservoir, instead of only those equal to the target.
- Precomputing a Map of index lists and then claiming O(1) extra space.
- Off-by-one in the probability: the c-th match should replace the answer with probability exactly `1/c`.

## Related follow-ups

- [Linked List Random Node](04_linked_list_random_node.md)
- [Shuffle an Array](03_shuffle_an_array.md)
- Random Pick with Weight (LeetCode #528)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
