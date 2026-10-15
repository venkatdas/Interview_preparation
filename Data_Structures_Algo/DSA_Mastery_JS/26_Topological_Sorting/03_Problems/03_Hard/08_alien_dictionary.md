# Alien Dictionary

| | |
|---|---|
| **Topic** | Topological Sorting |
| **Difficulty** | Hard |
| **Pattern** | build edges + Kahn |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #269 — https://leetcode.com/problems/alien-dictionary/ |
| **Solution file** | [08_alien_dictionary.js](../solutions/08_alien_dictionary.js) — open only after a real attempt |

## Problem

You get a list of words sorted according to an unknown alphabet (the "alien" order).
Derive the order of the letters. Return any valid order as a string, or "" if the
words are inconsistent (contradiction / cycle, or an invalid prefix case). Letters
that appear in the words but have no ordering constraint may go anywhere.

## Examples

```
Input: ["wrt","wrf","er","ett","rftt"]   Output: "wertf"
Input: ["z","x"]                          Output: "zx"
Input: ["z","x","z"]                      Output: ""   (z < x and x < z)
Input: ["abc","ab"]                       Output: ""   (a longer word cannot come
                                                       before its own prefix)
```

## Constraints & clarifying questions

```
- Lowercase letters only? (yes)
- Multiple valid answers accepted? (yes)
- Is ["ab", "abc"] valid? (yes - prefix FIRST is fine)

HOW TO GET EDGES: compare each ADJACENT pair of words. The first position where they
differ gives one fact: word1[i] -> word2[i]. Only the first difference counts!
  "wrt" vs "wrf": t -> f        "wrf" vs "er": w -> e
  "er"  vs "ett": r -> t        "ett" vs "rftt": e -> r
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *build edges + Kahn* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Alternative (DFS post-order with 3 colours)   O(C + total letters). Build the same graph, run DFS topological sort; a gray hit means contradiction -> "".

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (edges + Kahn)   O(total letters + C) time, O(C) space  (C &lt;= 26). 1.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- single word -> its unique letters in any order
- ["abc","ab"] -> "" (invalid prefix)
- duplicate words -> no edge, fine
- letters with no constraints must still appear in the output
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Alternative (DFS post-order with 3 colours)   O(C + total letters)

```
Build the same graph, run DFS topological sort; a gray hit means contradiction -> "".
Shown as `dfsVersion`.
```

### APPROACH 2 — Optimal (edges + Kahn)   O(total letters + C) time, O(C) space  (C &lt;= 26)

```
1. Collect every letter that appears (nodes), in-degree 0.
  2. For each adjacent pair, add the first-difference edge; if no difference and word1
     is longer -> return "".
  3. Kahn's algorithm. If fewer letters come out than exist -> "".

Dry run on ["wrt","wrf","er","ett","rftt"]:
  letters {w,r,t,f,e}; edges t->f, w->e, r->t, e->r
  indeg: w0 r1 t1 f1 e1  queue [w]
  pop w -> "w", e becomes 0;  pop e -> "we", r 0;  pop r -> "wer", t 0;
  pop t -> "wert", f 0;  pop f -> "wertf". 5 letters = 5 -> "wertf"
```

### Edge cases

```
- single word -> its unique letters in any order
- ["abc","ab"] -> "" (invalid prefix)
- duplicate words -> no edge, fine
- letters with no constraints must still appear in the output
```

Full JavaScript solution with tests: [08_alien_dictionary.js](../solutions/08_alien_dictionary.js). Run it with `node 08_alien_dictionary.js` from the solutions folder.

</details>

## Common mistakes

- Comparing more than the FIRST differing character of two adjacent words; only the first difference gives an ordering edge.
- Missing the invalid prefix case: a longer word before its own prefix (`"abc"` before `"ab"`) means no valid order.
- Forgetting letters that appear in words but in no edge; they still belong in the output.
- Adding the same edge twice and double-counting in-degree (use a Set per letter).

## Related follow-ups

- [Course Schedule II](../02_Medium/02_course_schedule_ii.md)
- [Sequence Reconstruction](../02_Medium/06_sequence_reconstruction.md)
- Verifying an Alien Dictionary (LeetCode #953)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
