# Linked List Random Node

| | |
|---|---|
| **Topic** | Classic Techniques (Kadane, Boyer-Moore, Floyd, Reservoir, Binary Lifting, Sqrt Decomposition) |
| **Difficulty** | Medium |
| **Pattern** | reservoir sampling, k = 1 |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #382 — https://leetcode.com/problems/linked-list-random-node/ |
| **Solution file** | [04_linked_list_random_node.js](../solutions/04_linked_list_random_node.js) — open only after a real attempt |

## Problem

Given a singly linked list, implement getRandom() that returns a node's value with every
node equally likely. Follow-up: the list is huge and its length is unknown, and you
cannot use extra space proportional to the length.

## Examples

```
list 1 -> 2 -> 3; getRandom() -> 1, 3, 2, 2, ... each with probability 1/3
```

## Constraints & clarifying questions

```
- Can we store the values in an array? (that is the easy version; the follow-up says no)
- Is the list static between calls? (yes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *reservoir sampling, k = 1* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n) space, O(1) per getRandom. Copy all values into an array once; return a random index.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Reservoir sampling, k = 1)   O(n) time per call, O(1) space. Walk the list.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- single node -> always that value
- duplicate values are fine (nodes, not values, are uniform)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n) space, O(1) per getRandom

```
Copy all values into an array once; return a random index. Simple and fine unless the
follow-up forbids O(n) memory.
```

### APPROACH 2 — Optimal (Reservoir sampling, k = 1)   O(n) time per call, O(1) space

```
Walk the list. For the i-th node (1-indexed) replace the current pick with probability
1 / i. Proof: node i is picked at step i with prob 1/i, and survives every later step j
with prob (1 - 1/j) = (j-1)/j. Product: 1/i * i/(i+1) * ... * (n-1)/n = 1/n.

Dry run on 1 -> 2 -> 3:
  i=1: pick 1 (prob 1)
  i=2: replace with 2 with prob 1/2
  i=3: replace with 3 with prob 1/3
  P(3) = 1/3; P(2) = 1/2 * 2/3 = 1/3; P(1) = 1 * 1/2 * 2/3 = 1/3
```

### Edge cases

```
- single node -> always that value
- duplicate values are fine (nodes, not values, are uniform)
```

Full JavaScript solution with tests: [04_linked_list_random_node.js](../solutions/04_linked_list_random_node.js). Run it with `node 04_linked_list_random_node.js` from the solutions folder.

</details>

## Common mistakes

- Replacing with probability `1/i` using a 0-indexed `i`, giving the first node probability 1 and dividing by zero.
- Assuming the length is known; the follow-up asks for one pass without extra space.
- Copying the list into an array and calling that "reservoir sampling".

## Related follow-ups

- [Random Pick Index](05_random_pick_index.md)
- [Shuffle an Array](03_shuffle_an_array.md)
- Random Pick with Blacklist (LeetCode #710)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
