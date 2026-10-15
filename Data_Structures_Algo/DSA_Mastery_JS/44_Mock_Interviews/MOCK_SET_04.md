# Mock Interview Set 04 — Trees & Graphs

**Time:** 60 minutes total. Problem 1: 25 min. Problem 2: 30 min. 5 min to review.
**Covers:** [`21_Binary_Search_Trees`](../21_Binary_Search_Trees/README.md), [`26_Topological_Sorting`](../26_Topological_Sorting/README.md)
**When:** end of week 8 (12-week plan) or end of week 3 (4-week plan)

**Rules**

- Timer on. Draw a small tree / graph before coding.
- Brute force first, then name the pattern.
- Open the Hints only when the problem's time is half gone and you have nothing.

---

## Problem 1 — Validate Binary Search Tree (LeetCode 98, Medium) — 25 min

**Links:** [LeetCode #98](https://leetcode.com/problems/validate-binary-search-tree/) · [curriculum statement + hints](../21_Binary_Search_Trees/03_Problems/02_Medium/07_validate_bst.md) (open after the mock)

Given the root of a binary tree, determine whether it is a valid BST:
every node's left subtree holds only values **less than** the node, the right subtree only values **greater than** the node,
and both subtrees are also BSTs.

```
Input:    2          Output: true
         / \
        1   3

Input:    5          Output: false   Explanation: 4 is in the right subtree of 5 but 4 < 5
         / \
        1   4
           / \
          3   6
```

**Clarifying questions you should ask**

- Are duplicates allowed? (no; strictly less / strictly greater)
- Value range? (can include the full 32-bit range, so do not use `Infinity` carelessly if the language has fixed ints; in JS `-Infinity`/`Infinity` are fine)
- Empty tree? (valid)

<details>
<summary>Hints</summary>

1. The classic wrong answer: check only `node.left.val < node.val < node.right.val`. The second example breaks it. Say why.
2. Each node must be inside a range `(low, high)` inherited from its ancestors. Going left tightens `high`; going right tightens `low`.
3. `isValid(node, low, high)`: null -> true; `node.val <= low || node.val >= high` -> false; recurse with `(low, node.val)` and `(node.val, high)`.
4. Alternative: in-order traversal of a BST is strictly increasing. Keep `prev` and check `prev < current`.

</details>

**Expected complexity:** O(n) time, O(h) space for recursion (h = height, O(n) worst case).

**Follow-up questions an interviewer may ask**

- Do it iteratively (explicit stack with `(node, low, high)` tuples, or iterative in-order).
- How would you find the kth smallest in a BST? (in-order with a counter, 230)
- Two nodes of a BST were swapped. Recover the tree (99). (in-order, find the two out-of-order spots)
- Why does the in-order approach need `prev` and not just a sorted array? (O(n) space vs O(h))

---

## Problem 2 — Course Schedule (LeetCode 207, Medium) — 30 min

**Links:** [LeetCode #207](https://leetcode.com/problems/course-schedule/) · [curriculum statement + hints](../26_Topological_Sorting/03_Problems/02_Medium/01_course_schedule.md) (open after the mock)

There are `numCourses` courses labeled `0` to `numCourses - 1`. `prerequisites[i] = [a, b]` means you must take course `b`
before course `a`. Return `true` if you can finish all courses.

```
Input: numCourses = 2, prerequisites = [[1, 0]]          Output: true    (0 then 1)
Input: numCourses = 2, prerequisites = [[1, 0], [0, 1]]  Output: false   (cycle)
Input: numCourses = 3, prerequisites = []                Output: true
```

**Clarifying questions you should ask**

- Can there be duplicate prerequisite pairs? (possibly; they do not change the answer)
- Can a course depend on itself? (treat `[a, a]` as a cycle)
- Size? (up to 2000 courses, 5000 edges; O(V + E) expected)

<details>
<summary>Hints</summary>

1. "Prerequisites" + "can you finish" = "does this directed graph have a cycle?" Say that sentence.
2. Build an adjacency list `b -> [a, ...]` and an `inDegree` array.
3. Kahn's algorithm: queue all nodes with in-degree 0; pop, count it, decrement each neighbor's in-degree, push neighbors that reach 0. Finished all `numCourses`? -> no cycle.
4. Alternative: DFS with three colors (unvisited / visiting / done). Seeing a "visiting" node again means a cycle.

</details>

**Expected complexity:** O(V + E) time, O(V + E) space.

**Follow-up questions an interviewer may ask**

- Return a valid order (Course Schedule II, 210). (the order Kahn pops nodes)
- What if there are multiple valid orders; return the lexicographically smallest? (use a min-heap instead of a queue)
- Minimum number of semesters if you can take any number of courses per semester? (BFS levels = longest path in a DAG, 1136)
- How would you detect the cycle's nodes, not just its existence? (DFS with recursion stack, or nodes never popped by Kahn)

---

## Self-review (5 min)

- [ ] I explained why checking only direct children is wrong for the BST.
- [ ] I passed bounds down (or kept `prev` in in-order) without a global mutable bug.
- [ ] I translated "prerequisites" to "cycle detection in a directed graph" out loud.
- [ ] I built the adjacency list with the edge direction correct (`b -> a`).
- [ ] I finished both problems within time.

Write 3 lines: what went well, what went wrong, what to review next.
