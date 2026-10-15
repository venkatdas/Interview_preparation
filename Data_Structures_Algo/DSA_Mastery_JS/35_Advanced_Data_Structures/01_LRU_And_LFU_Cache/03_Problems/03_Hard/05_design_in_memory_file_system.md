# Design In-Memory File System

| | |
|---|---|
| **Topic** | LRU and LFU Caches |
| **Difficulty** | Hard |
| **Pattern** | trie of path segments |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #588 — https://leetcode.com/problems/design-in-memory-file-system/ |
| **Solution file** | [05_design_in_memory_file_system.js](../solutions/05_design_in_memory_file_system.js) — open only after a real attempt |

## Problem

Implement a tiny file system:
  - ls(path): if path is a file, return [fileName]; if a directory, return the names of
    its files and sub-directories in LEXICOGRAPHIC order
  - mkdir(path): create the directory and every missing parent
  - addContentToFile(path, content): create the file if needed, APPEND content
  - readContentFromFile(path): return the content
Paths are absolute, start with "/", and "/" is the root.

## Examples

```
ls("/") -> []
mkdir("/a/b/c"); addContentToFile("/a/b/c/d", "hello"); ls("/") -> ["a"]
readContentFromFile("/a/b/c/d") -> "hello"; ls("/a/b/c") -> ["d"]; ls("/a/b/c/d") -> ["d"]
```

## Constraints & clarifying questions

```
- Names are lowercase letters; paths have no trailing slash except root
- Can a file and a directory have the same name in one folder? (assume no)
- Must ls be sorted? (yes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *trie of path segments* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(total paths) per op. Keep a Map of full path -> {isFile, content}.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Trie of path segments)   O(path length) per op (+ sort for ls). Each node = { children: Map name -> node, isFile, content }.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- ls("/") on an empty system -> []
- appending twice concatenates
- mkdir of an existing directory is a no-op
- ls on a file returns the file name, not the full path
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(total paths) per op

```
Keep a Map of full path -> {isFile, content}. ls("/a") = scan every key, keep those whose
parent is "/a", take the next segment, dedupe and sort. mkdir inserts every prefix.
```

### APPROACH 2 — Optimal (Trie of path segments)   O(path length) per op (+ sort for ls)

```
Each node = { children: Map name -> node, isFile, content }. Walking a path means
following one child per segment. This is a trie (../../../22_Tries/) whose "characters"
are folder names.
  mkdir: walk, creating missing children
  addContentToFile: walk creating, mark the last node as a file, append
  ls: walk; if file -> [lastSegment]; else sorted keys of children

Dry run: mkdir("/a/b/c")
  root.children: {} -> create a -> a.children create b -> b.children create c
  addContentToFile("/a/b/c/d", "hello"): walk a,b,c; create d; d.isFile = true; d.content = "hello"
  ls("/a/b/c") -> keys of c.children = ["d"]
  ls("/a/b/c/d") -> d is a file -> ["d"]
```

### Edge cases

```
- ls("/") on an empty system -> []
- appending twice concatenates
- mkdir of an existing directory is a no-op
- ls on a file returns the file name, not the full path
```

Full JavaScript solution with tests: [05_design_in_memory_file_system.js](../solutions/05_design_in_memory_file_system.js). Run it with `node 05_design_in_memory_file_system.js` from the solutions folder.

</details>

## Common mistakes

- Splitting `"/"` into `["", ""]` and creating an empty-named child; filter out empty path segments.
- `ls` on a file path must return just that file's name, not the contents of its parent.
- Forgetting to return directory listings in lexicographic order.

## Related follow-ups

- [Tries](../../../../22_Tries/README.md)
- Design File System (LeetCode #1166)
- Simplify Path (LeetCode #71)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
