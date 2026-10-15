# Most Versatile Users

| | |
|---|---|
| **Set** | [Mixed Set 03](README.md) — problem 02 of 5 |
| **Difficulty** | Medium |
| **Time box** | 20 minutes (then open Hint 1) |
| **Source** | Original exercise |
| **Solution file** | [02_most_versatile_users.js](solutions/02_most_versatile_users.js) — open only after a real attempt |

> The topic is hidden on purpose. Part of the skill being trained is recognizing the pattern on your own.

## Problem

An app logs events as [user, action] pairs (strings). A user's "versatility" is the
number of DIFFERENT actions they performed. Return the k most versatile users, most
versatile first; break ties by user name in ascending (lexicographic) order.
If there are fewer than k users, return all of them.

## Examples

```
Input: logs = [["ann","view"],["bob","view"],["ann","buy"],["bob","view"],["cy","buy"]], k = 2
Output: ["ann", "bob"]   Explanation: ann 2, bob 1, cy 1 -> tie bob/cy broken by name
Input: logs = [], k = 3  Output: []
```

## Constraints & clarifying questions

```
- Up to 10^5 logs, up to 10^4 users, k usually small.
- Repeated identical events count once (distinct actions).
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 20 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1 — which patterns?</summary>

**Pattern.** Hash map of sets + a size-k heap with a custom comparator. See [Hashing](../../../05_Hashing/README.md) and [Heaps](../../../19_Heaps_And_Priority_Queues/README.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** Build counts, then sort all users by (count desc, name asc) and slice k.

</details>

<details><summary>Hint 3</summary>

**The key idea.** Keep only k candidates in a min-heap whose root is the WORST kept user. For equal counts the worse user is the one with the larger name.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- k = 0 -> []
- k > number of users -> everyone, sorted
- same action repeated -> counted once
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(U * L + U log U) time, O(U) space

```
Collect the user names; for each user scan all logs to build their action set; sort all
users by (count desc, name asc); take k.
```

### APPROACH 2 — Optimal (hash map of sets + size-k min-heap)   O(L + U log k) time, O(L + k) space

```
One pass builds Map user -> Set(actions). Then keep a heap of size k whose ROOT is the
"worst" kept user (smallest count; for equal counts the larger name). For each user,
push; if the heap grows beyond k, pop the worst. Finally sort the k survivors best-first.

Dry run on the first example (k = 2):
  map: ann{view,buy}=2, bob{view}=1, cy{buy}=1
  push ann(2)             heap [ann]
  push bob(1)             heap [bob, ann]       (bob is worst)
  push cy(1), size 3 > 2: worst is cy (count 1, name "cy" > "bob") -> pop cy
  survivors sorted: ann(2), bob(1)
```

### Edge cases

```
- k = 0 -> []
- k > number of users -> everyone, sorted
- same action repeated -> counted once
```

### Common mistakes

```
- Counting events instead of distinct actions.
- Getting the tie-break backwards inside the min-heap: the worst element among equal
  counts is the one with the LARGER name.
```

Full JavaScript solution with tests: [02_most_versatile_users.js](solutions/02_most_versatile_users.js). Run it with `node solutions/02_most_versatile_users.js` from this folder.

</details>

## Related follow-ups

- Logs arrive as a stream: answer top-k at any time
- Bucket sort when counts are small
- Rank by distinct actions in the last hour

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Write down which pattern you did NOT see at first. That is the one to drill.
- Fill in the set's reflection checklist in [QUIZ.md](../../04_Interview_And_Assessment/QUIZ.md).
- Re-solve from scratch in 3 days, then in 1 week.
