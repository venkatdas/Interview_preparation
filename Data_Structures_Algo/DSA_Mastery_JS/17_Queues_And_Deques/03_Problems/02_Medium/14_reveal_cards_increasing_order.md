# Reveal Cards In Increasing Order

| | |
|---|---|
| **Topic** | Queues and Deques |
| **Difficulty** | Medium |
| **Pattern** | reverse simulation with deque |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #950 — https://leetcode.com/problems/reveal-cards-in-increasing-order/ |
| **Solution file** | [14_reveal_cards_increasing_order.js](../solutions/14_reveal_cards_increasing_order.js) — open only after a real attempt |

## Problem

You have a deck of unique integers. You reveal cards with this process:
  1. take the top card, reveal it
  2. move the next top card to the bottom of the deck
  3. repeat until empty
Return an ordering of the deck so that the revealed cards come out in
increasing order.

## Examples

```
Input: [17,13,11,2,3,5,7]   Output: [2,13,3,11,5,17,7]
  reveal 2, move 13 down ; reveal 3, move 11 down ; reveal 5, move 17 down ;
  reveal 7, move 13 down ; reveal 11, move 17 down ; reveal 13 ; reveal 17
Input: [1,1000]             Output: [1,1000]
```

## Constraints & clarifying questions

```
- Values unique? (yes)
- Any valid ordering, or a specific one? (only one exists, since the process is deterministic)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *reverse simulation with deque* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (simulate the reveal on index positions)   O(n^2) time with shift, O(n) space. Sort the cards.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (reverse the process with a deque)   O(n log n) time (sort), O(n) space. Run the process BACKWARDS.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- single card
- two cards
- already sorted input (output is still interleaved)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (simulate the reveal on index positions)   O(n^2) time with shift, O(n) space

```
Sort the cards. Simulate the reveal process on a queue of INDICES
0..n-1: the k-th revealed index gets the k-th smallest card. This is already
the standard idea; it's "brute" only because we use array shift() (O(n)).
```

### APPROACH 2 — Optimal (reverse the process with a deque)   O(n log n) time (sort), O(n) space

```
Run the process BACKWARDS. The last card revealed is the largest. Undo each
step: "move top to bottom" undone is "move bottom to top"; "reveal top"
undone is "put the card on top".
  for each card from largest to smallest:
    if the deque is not empty: move the BACK card to the FRONT
    push the card to the FRONT

Dry run on sorted [2,3,5,7,11,13,17], processed from 17 down:
  17          deque [17]
  13          move back to front: [17] ; push front: [13,17]
  11          [17,13] -> [11,17,13]
  7           [13,11,17] -> [7,13,11,17]
  5           [17,7,13,11] -> [5,17,7,13,11]
  3           [11,5,17,7,13] -> [3,11,5,17,7,13]
  2           [13,3,11,5,17,7] -> [2,13,3,11,5,17,7]   matches
```

### Edge cases

```
- single card
- two cards
- already sorted input (output is still interleaved)
```

Full JavaScript solution with tests: [14_reveal_cards_increasing_order.js](../solutions/14_reveal_cards_increasing_order.js). Run it with `node 14_reveal_cards_increasing_order.js` from the solutions folder.

</details>

## Common mistakes

- Simulating the forward process on values instead of on positions.
- Forgetting to sort the deck first.
- Off-by-one in the "move next card to bottom" step at the last card.

## Related follow-ups

- [Dota2 Senate](13_dota2_senate.md)
- Find the Winner of the Circular Game (LeetCode #1823)
- [Implement Stack using Queues](../01_Easy/01_stack_using_queues.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
