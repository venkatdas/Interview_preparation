# Accounts Merge

| | |
|---|---|
| **Topic** | Union-Find Basics |
| **Difficulty** | Medium |
| **Pattern** | map-based UF on emails |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #721 — https://leetcode.com/problems/accounts-merge/ |
| **Solution file** | [06_accounts_merge.js](../solutions/06_accounts_merge.js) — open only after a real attempt |

## Problem

accounts[i] = [name, email1, email2, ...]. Two accounts belong to the same person if
they share at least one email (names can repeat for different people). Merge them:
return each person as [name, sorted emails...]. Output order of people does not matter.

## Examples

```
Input: [["John","johnsmith@mail.com","john_newyork@mail.com"],
        ["John","johnsmith@mail.com","john00@mail.com"],
        ["Mary","mary@mail.com"],
        ["John","johnnybravo@mail.com"]]
Output: [["John","john00@mail.com","john_newyork@mail.com","johnsmith@mail.com"],
         ["Mary","mary@mail.com"],
         ["John","johnnybravo@mail.com"]]
Explanation: the first two Johns share johnsmith@mail.com; the third John is someone else.
```

## Constraints & clarifying questions

```
- Same name, no shared email = different people? (yes)
- Emails sorted lexicographically inside each account? (yes)
- Can one account list the same email twice? (possible, dedupe)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *map-based UF on emails* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Alternative (DFS over an email graph)   O(total emails * log) time. Build adjacency: each account's first email links to all its other emails.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Union-Find on ACCOUNT INDICES)   O(total emails * alpha + sort). 1.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- single account -> itself, emails sorted
- chain merging: A shares with B, B shares with C -> all three merge
- duplicate email inside one account
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Alternative (DFS over an email graph)   O(total emails * log) time

```
Build adjacency: each account's first email links to all its other emails. DFS from
each unvisited email collects a component; sort it. Shown as `dfsVersion`.
```

### APPROACH 2 — Optimal (Union-Find on ACCOUNT INDICES)   O(total emails * alpha + sort)

```
1. emailToAccount: email -> first account index that had it.
     When an email is seen again in account i, union(i, that first account).
  2. Group emails by find(accountIndex).
  3. For each group: [name of the root account, ...sorted emails].
Union on indices keeps the UnionFind small (n accounts) instead of one node per email.

Dry run on the example:
  account 0: johnsmith -> 0, john_newyork -> 0
  account 1: johnsmith already -> union(1, 0); john00 -> 1
  account 2: mary -> 2
  account 3: johnnybravo -> 3
  roots: 0 {johnsmith, john_newyork, john00}, 2 {mary}, 3 {johnnybravo}
```

### Edge cases

```
- single account -> itself, emails sorted
- chain merging: A shares with B, B shares with C -> all three merge
- duplicate email inside one account
```

Full JavaScript solution with tests: [06_accounts_merge.js](../solutions/06_accounts_merge.js). Run it with `node 06_accounts_merge.js` from the solutions folder.

</details>

## Common mistakes

- Merging accounts just because the names match; only a shared EMAIL proves it is the same person.
- Forgetting to sort the emails in each merged account.
- Losing which name belongs to a group; remember the owner name per email (or per root).

## Related follow-ups

- [Number of Connected Components](01_number_of_connected_components.md)
- [Smallest String With Swaps](08_smallest_string_with_swaps.md)
- Synonymous Sentences (LeetCode #1258)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
