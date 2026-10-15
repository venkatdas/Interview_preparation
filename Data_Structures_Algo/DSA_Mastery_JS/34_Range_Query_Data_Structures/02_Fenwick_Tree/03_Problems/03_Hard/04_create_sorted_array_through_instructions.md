# Create Sorted Array through Instructions

| | |
|---|---|
| **Topic** | Fenwick Tree (Binary Indexed Tree) |
| **Difficulty** | Hard |
| **Pattern** | counting BIT, smaller & greater per insert |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #1649 — https://leetcode.com/problems/create-sorted-array-through-instructions/ |
| **Solution file** | [04_create_sorted_array_through_instructions.js](../solutions/04_create_sorted_array_through_instructions.js) — open only after a real attempt |

## Problem

You insert the numbers of `instructions` one by one into an initially empty sorted list.
Inserting instructions[i] costs min(number of elements currently < instructions[i],
number of elements currently > instructions[i]). Return the total cost modulo 1e9+7.

## Examples

```
Input: [1,5,6,2]   Output: 1
  insert 1 -> cost min(0,0)=0  [1]
  insert 5 -> cost min(1,0)=0  [1,5]
  insert 6 -> cost min(2,0)=0  [1,5,6]
  insert 2 -> cost min(1,2)=1  [1,2,5,6]
Input: [1,2,3,6,5,4]   Output: 3
```

## Constraints & clarifying questions

```
- n up to 10^5, values 1..10^5 -> values can index the BIT directly (no compression)
- Equal elements count as neither smaller nor greater
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *counting BIT, smaller & greater per insert* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n^2) time. Keep an array; for each new value count smaller and greater with a loop, then insert.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Fenwick tree of counts over values)   O(n log M), M = max value. Keep counts of inserted values in a BIT indexed by value.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- duplicates: [1,1,1] -> every insert has 0 smaller and 0 greater -> 0
- answer must be taken mod 1e9+7 (costs can reach ~n^2/4)
- n = 1 -> 0
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^2) time

```
Keep an array; for each new value count smaller and greater with a loop, then insert.
```

### APPROACH 2 — Optimal (Fenwick tree of counts over values)   O(n log M), M = max value

```
Keep counts of inserted values in a BIT indexed by value.
  smaller = prefixCount(v - 1)
  greater = inserted - prefixCount(v)
  cost += min(smaller, greater); add(v, 1)

Dry run on [1,5,6,2]:
  v=1: smaller=0, greater=0-0=0 -> 0; insert
  v=5: smaller=1, greater=1-1=0 -> 0; insert
  v=6: smaller=2, greater=2-2=0 -> 0; insert
  v=2: smaller=1, greater=3-1=2 -> 1; total 1
```

### Edge cases

```
- duplicates: [1,1,1] -> every insert has 0 smaller and 0 greater -> 0
- answer must be taken mod 1e9+7 (costs can reach ~n^2/4)
- n = 1 -> 0
```

Full JavaScript solution with tests: [04_create_sorted_array_through_instructions.js](../solutions/04_create_sorted_array_through_instructions.js). Run it with `node 04_create_sorted_array_through_instructions.js` from the solutions folder.

</details>

## Common mistakes

- Forgetting the answer is taken modulo 1e9 + 7.
- Computing "strictly greater" as `inserted - lessOrEqual` incorrectly (it is `i - count(<= x)` where i is how many were inserted before).
- Sizing the BIT by the number of instructions instead of the maximum value.

## Related follow-ups

- [Count of Smaller Numbers After Self](02_count_of_smaller_numbers_after_self.md)
- [Count Good Triplets in an Array](05_count_good_triplets_in_an_array.md)
- Sorted list with bisect ([Skip List / Sorted List](../../../../35_Advanced_Data_Structures/02_Skip_List_Bloom_Filter_Sorted_List/README.md))

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
