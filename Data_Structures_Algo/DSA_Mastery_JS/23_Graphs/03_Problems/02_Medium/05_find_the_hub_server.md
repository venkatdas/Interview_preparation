# Find the Hub Server

| | |
|---|---|
| **Topic** | Graphs (representation) |
| **Difficulty** | Medium |
| **Pattern** | universal sink in a matrix |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | Original exercise |
| **Solution file** | [05_find_the_hub_server.js](../solutions/05_find_the_hub_server.js) — open only after a real attempt |

## Problem

`n` servers are numbered `0..n-1`. `sends[i][j] = 1` means server `i` sends data to server `j`
(the diagonal is always 0). A **hub** receives data from every other server and sends data to none.
Return the hub's number, or `-1` if there is no hub. There can be at most one hub.

## Examples

```
Input: [[0,1,1],
        [0,0,1],
        [0,0,0]]
Output: 2       Explanation: servers 0 and 1 send to 2, and 2 sends nothing

Input: [[0,1],[1,0]]
Output: -1      Explanation: both servers send something

Input: [[0]]
Output: 0       Explanation: a lone server receives from "everyone else" (nobody) and sends nothing
```

## Constraints & clarifying questions

```
- Square matrix with a zero diagonal? (yes)
- n = 0? (return -1)
- Can I do better than reading the whole matrix? (yes, O(n) is possible)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** A "universal sink" question on an adjacency matrix, solved by elimination.

</details>

<details><summary>Hint 2</summary>

**Start simple.** Count in-degree and out-degree of every server from the matrix and look for in = n - 1, out = 0.

</details>

<details><summary>Hint 3</summary>

**The key idea.** Look at one cell `sends[a][b]`. Whatever its value, one of a or b can no longer be the hub. How many cells do you need to look at to leave only one candidate?

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- n = 0             -> -1
- n = 1             -> 0
- the last candidate still has to be verified (row all 0, column all 1)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force

Compute every server's in-degree and out-degree: O(n²) time. Return the server with in-degree n - 1 and out-degree 0.

### APPROACH 2 — Optimal

Keep `cand = 0`. For i = 1..n-1: if `sends[cand][i] === 1`, cand sends, so cand is out and `cand = i`; otherwise i did not receive from cand, so i is out. After one pass only cand remains; verify its row and column in O(n). Total O(n) time, O(1) space.

```
cand = 0, i = 1: sends[0][1] = 1 -> cand = 1
cand = 1, i = 2: sends[1][2] = 1 -> cand = 2
verify 2: row [0,0,0] ok; sends[0][2] = 1, sends[1][2] = 1 ok -> answer 2
```

Full JavaScript solution with tests: [05_find_the_hub_server.js](../solutions/05_find_the_hub_server.js). Run it with `node 05_find_the_hub_server.js` from the solutions folder.

</details>

## Common mistakes

- Skipping the final verification: elimination only proves that nobody else can be the hub.
- Checking `sends[i][cand]` in the elimination loop instead of `sends[cand][i]`.
- Counting the diagonal when computing degrees.

## Related follow-ups

- [Degree Report](../01_Easy/02_degree_report.md)
- Find the Town Judge (LeetCode #997)
- Find the Celebrity (LeetCode #277)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
