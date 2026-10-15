# Linked List Random Node

| | |
|---|---|
| **Topic** | Probability and Randomization |
| **Difficulty** | Medium |
| **Pattern** | reservoir sampling (k = 1) |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #382 — https://leetcode.com/problems/linked-list-random-node/ (statement paraphrased, not copied) |
| **Solution file** | [03_linked_list_random_node.js](../solutions/03_linked_list_random_node.js) — open only after a real attempt |

## Problem

You get the head of a singly linked list. Implement `getRandom()`, which returns the value of a node chosen uniformly at random: every node has probability 1/n.

Follow-up: the list is extremely large, its length is unknown, and you should not use extra memory proportional to it.

## Examples

```
list: 1 -> 2 -> 3
getRandom() -> 1, 2 or 3, each with probability 1/3

list: 5 -> 5 -> 9
getRandom() -> 5 with probability 2/3 (two nodes hold 5), 9 with probability 1/3
```

## Constraints & clarifying questions

```
- Is the list fixed after construction? (yes)
- Is the length known? (follow-up: no)
- Can the list be empty? (LeetCode: no; returning undefined is a safe choice)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** Uniform pick from a stream of unknown length: *reservoir sampling*. See section 5.5 of [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** Copy all values into an array in the constructor, then pick a random index. Works, but uses O(n) memory.

</details>

<details><summary>Hint 3</summary>

**The key idea.** Walk the list. At the i-th node (1-based) replace your answer with probability 1/i. Node i survives later nodes with probability i/(i+1), (i+1)/(i+2), ..., and the product telescopes to 1/n.

</details>

<details><summary>Hint 4</summary>

**Edge cases.** One node -> always that value. Duplicate values: uniform over NODES, so a repeated value is more likely.

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (Copy to array)   O(n) build, O(1) per call, O(n) space

```
Walk once, push every value into an array, return values[floor(rng() * n)].
```

### APPROACH 2 — Optimal (Reservoir sampling)   O(n) per call, O(1) space

```
i = 0
for node in list:
    i++
    with probability 1/i: answer = node.val
return answer
```

### Dry run

```
1 -> 2 -> 3, rolls (any), 0.9, 0.2
  node 1: i=1 keep (prob 1)        answer 1
  node 2: i=2, 0.9 < 1/2? no       answer 1
  node 3: i=3, 0.2 < 1/3? yes      answer 3
```

### Complexity

- Brute force: O(n) build, O(1) per call, O(n) space
- Optimal: O(n) per call, O(1) space

### Edge cases

```
- single node -> its value
- duplicates -> probability proportional to how many nodes hold the value
- empty list -> undefined
```

### Common mistakes

- Counting the length first, then walking again: fine (two passes, O(1) space) but not a "single pass over a stream".
- Using probability 1/2 at every node: that favours the last nodes exponentially.

Full JavaScript solution with tests: [03_linked_list_random_node.js](../solutions/03_linked_list_random_node.js). Run it with `node 03_linked_list_random_node.js` from the solutions folder.

</details>

## Related follow-ups

- Random Pick Index (LeetCode 398)
- Sample k nodes uniformly (reservoir with k > 1)
- Weighted reservoir sampling (Advanced: key = rng()^(1/w))

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
