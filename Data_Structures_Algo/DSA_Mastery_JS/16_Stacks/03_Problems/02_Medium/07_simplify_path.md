# Simplify Path

| | |
|---|---|
| **Topic** | Stacks |
| **Difficulty** | Medium |
| **Pattern** | stack of segments |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #71 — https://leetcode.com/problems/simplify-path/ |
| **Solution file** | [07_simplify_path.js](../solutions/07_simplify_path.js) — open only after a real attempt |

## Problem

Given an absolute Unix file path, return its canonical form:
  - starts with a single '/'
  - directories separated by exactly one '/'
  - no trailing '/' (except the root itself)
  - '.' (current dir) is removed, '..' (parent dir) goes up one level
  - going above the root stays at the root

## Examples

```
Input: "/home/"                 Output: "/home"
Input: "/../"                   Output: "/"        Explanation: can't go above root
Input: "/home//foo/"            Output: "/home/foo"
Input: "/a/./b/../../c/"        Output: "/c"
Input: "/a/...//b"              Output: "/a/.../b"  Explanation: "..." is a valid directory name
```

## Constraints & clarifying questions

```
- Always absolute (starts with '/')? (yes)
- Are names like "..." or ".hidden" real directories? (yes - only exactly "." and ".." are special)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *stack of segments* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (string rewriting)   O(n^2) time. Repeatedly apply regex replacements: collapse "//", remove "/./", resolve "/name/../".

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (split + stack of directory names)   O(n) time, O(n) space. Split on '/'.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- "/" alone, "/../" -> "/"
- many consecutive slashes
- ".." when already at the root (pop on empty: just ignore)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (string rewriting)   O(n^2) time

```
Repeatedly apply regex replacements: collapse "//", remove "/./", resolve
"/name/../". Loop until nothing changes. Fiddly and slow.
```

### APPROACH 2 — Optimal (split + stack of directory names)   O(n) time, O(n) space

```
Split on '/'. For each part:
  ""  or "."  -> ignore
  ".."        -> pop (if the stack isn't empty)
  anything    -> push (a directory name)
Join the stack with '/' and prepend '/'.

Dry run on "/a/./b/../../c/":
  parts: ["", "a", ".", "b", "..", "..", "c", ""]
  "a"  push       [a]
  "."  skip
  "b"  push       [a,b]
  ".." pop        [a]
  ".." pop        []
  "c"  push       [c]
  result "/" + "c" = "/c"
```

### Edge cases

```
- "/" alone, "/../" -> "/"
- many consecutive slashes
- ".." when already at the root (pop on empty: just ignore)
```

Full JavaScript solution with tests: [07_simplify_path.js](../solutions/07_simplify_path.js). Run it with `node 07_simplify_path.js` from the solutions folder.

</details>

## Common mistakes

- Treating `...` as "go up" (it is a normal directory name).
- Popping from an empty stack on `..` at the root.
- Producing an empty string instead of `/` for the root.

## Related follow-ups

- [Decode String](08_decode_string.md)
- [Valid Parentheses](../01_Easy/01_valid_parentheses.md)
- Design In-Memory File System (LeetCode #588)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
