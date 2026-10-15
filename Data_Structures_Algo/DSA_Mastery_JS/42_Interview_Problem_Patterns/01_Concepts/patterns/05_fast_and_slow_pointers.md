# 05. Fast & Slow Pointers

Two pointers move along a sequence at different speeds: `slow` takes one step, `fast` takes two.
If the sequence loops, `fast` laps `slow` and they meet. If it does not loop, `fast` reaches the
end first, and at that moment `slow` is in the middle. This is **Floyd's tortoise and hare**. It
finds cycles, cycle starts and midpoints with O(1) extra memory.

The "sequence" does not have to be a linked list. Any function `next = f(x)` defines one: an
array where `next = nums[i]`, or a number where `next = sumOfDigitSquares(x)`.

**Teaches in depth:** [Linked Lists](../../../15_Linked_Lists/README.md), [Classic techniques](../../../41_Advanced_Algorithm_Design/01_Classic_Techniques/README.md)

---

## 1. Recognition clues

| Words in the problem | Why it hints at fast & slow |
|---|---|
| "detect a cycle", "loops forever" | fast laps slow only if there is a cycle |
| "where does the cycle begin" | Floyd phase 2 |
| "middle of the linked list" | when fast ends, slow is at the middle |
| "palindrome linked list", "reorder list" | find the middle, reverse the second half |
| "n+1 numbers in 1..n, find the duplicate, O(1) space" | index -> value forms a linked list with a cycle |
| "happy number", "repeated process ends or loops" | the process is a sequence with a possible cycle |

**Constraint hints**

- "O(1) extra space" + cycle question -> Floyd instead of a visited `Set`.
- "Do not modify the array" + duplicate -> Floyd instead of negative marking or cyclic sort.

## 2. When it applies (preconditions)

- Each element has **exactly one** next element (a functional graph). Then the path from any start is a "rho" shape: a tail and then a cycle.
- You can call `next` repeatedly and compare elements for identity (`===` on nodes or values).

## 3. When it does NOT apply

- **General graphs** where a node has several neighbors. Cycle detection in a directed graph needs DFS with colors ([15](15_topological_sort.md)); undirected needs union-find or DFS with a parent check.
- **Duplicates without the 1..n structure.** `nums = [7, 100, 7]`: `nums[100]` is out of range, so "index -> value" is not a valid next pointer. Use a `Set` or sort.
- **You need the whole cycle content quickly** and memory is fine: a `Set` of visited nodes is simpler to write and explain.

## 4. The template

```js
function hasCycle(head) {
  let slow = head;
  let fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}

function cycleStart(head) {
  let slow = head;
  let fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) {                           // phase 2: one pointer restarts from head
      let p = head;
      while (p !== slow) { p = p.next; slow = slow.next; }
      return p;
    }
  }
  return null;
}

function findDuplicateFloyd(nums) {
  let slow = nums[0];
  let fast = nums[0];
  do { slow = nums[slow]; fast = nums[nums[fast]]; } while (slow !== fast);
  slow = nums[0];
  while (slow !== fast) { slow = nums[slow]; fast = nums[fast]; }
  return slow;
}
```

Tested in [templates.js](../../02_Implementations/templates.js) (`hasCycle`, `middleNode`), [pattern_templates.js](../../02_Implementations/pattern_templates.js) (`cycleStart`, `findDuplicateFloyd`, `reachesTarget`) and [tests/patterns.test.js](../../tests/patterns.test.js).

**Why phase 2 works.** Let the tail have length `a` and the cycle length `c`. When they meet,
slow walked `a + b`, fast walked `2(a + b)`, and the difference `a + b` is a multiple of `c`. So
walking `a` more steps from the meeting point lands exactly on the cycle start, and so does walking `a` steps from the head.

**Dry run** `findDuplicateFloyd([1, 3, 4, 2, 2])` (path 0 -> 1 -> 3 -> 2 -> 4 -> 2 ...):

| step | slow | fast |
|---|---|---|
| start | 1 | 1 |
| 1 | 3 | 2 |
| 2 | 2 | 2 (meet) |
| phase 2 | 1 -> 3 -> 2 | 2 -> 4 -> 2 -> answer 2 |

## 5. Variations

- **Middle node:** run until `fast` is null; for even length this gives the second middle.
- **Palindrome list:** middle, reverse second half, compare, (optionally) restore.
- **Happy number:** `reachesTarget(n, digitSquares, 1)`.
- **Cycle length:** after meeting, keep one pointer still and count steps until the other returns.
- **k-th from the end:** a "gap" variant — move `fast` k steps first, then both at speed 1.

## 6. Common pitfalls

1. Checking `fast.next.next` without checking `fast` and `fast.next` first -> `TypeError`.
2. Comparing node **values** instead of node **references** in linked lists (`slow.val === fast.val` gives false cycles with duplicate values).
3. In the array version, starting `slow` and `fast` at index 0 but forgetting that index 0 is never a target (values are 1..n) — that is why 0 is a safe entry point.
4. Using `while` instead of `do...while` in the array version: they start equal, so the loop would exit at once.
5. For even-length lists, being unsure which middle you get. Decide (first or second) and adjust the loop condition (`fast.next && fast.next.next` gives the first middle).

## 7. Representative problems

| # | Problem | Difficulty | Why this pattern | Page |
|---|---|---|---|---|
| 1 | Linked List Cycle | Easy | detect a cycle | [statement](../../../15_Linked_Lists/03_Problems/01_Easy/03_linked_list_cycle.md) · [solution](../../../15_Linked_Lists/03_Problems/solutions/03_linked_list_cycle.js) |
| 2 | Middle of the Linked List | Easy | fast ends, slow is middle | [statement](../../../15_Linked_Lists/03_Problems/01_Easy/05_middle_of_linked_list.md) · [solution](../../../15_Linked_Lists/03_Problems/solutions/05_middle_of_linked_list.js) |
| 3 | Palindrome Linked List | Easy | middle + reverse | [statement](../../../15_Linked_Lists/03_Problems/01_Easy/07_palindrome_linked_list.md) · [solution](../../../15_Linked_Lists/03_Problems/solutions/07_palindrome_linked_list.js) |
| 4 | Happy Number | Easy | number sequence cycle | [statement](../../../00_Foundations/04_Mathematics_For_DSA/03_Problems/01_Easy/05_happy_number.md) · [solution](../../../00_Foundations/04_Mathematics_For_DSA/03_Problems/solutions/05_happy_number.js) |
| 5 | Linked List Cycle II | Medium | Floyd phase 2 | [statement](../../../15_Linked_Lists/03_Problems/02_Medium/04_linked_list_cycle_ii.md) · [solution](../../../15_Linked_Lists/03_Problems/solutions/04_linked_list_cycle_ii.js) |
| 6 | Remove Nth Node From End | Medium | gap pointers | [statement](../../../15_Linked_Lists/03_Problems/02_Medium/06_remove_nth_from_end.md) · [solution](../../../15_Linked_Lists/03_Problems/solutions/06_remove_nth_from_end.js) |
| 7 | Reorder List | Medium | middle + reverse + merge | [statement](../../../15_Linked_Lists/03_Problems/02_Medium/14_reorder_list.md) · [solution](../../../15_Linked_Lists/03_Problems/solutions/14_reorder_list.js) |
| 8 | Find the Duplicate Number | Medium | array as linked list | [statement](../../../03_Arrays/03_Problems/02_Medium/18_find_the_duplicate_number.md) · [solution](../../../03_Arrays/03_Problems/solutions/18_find_the_duplicate_number.js) |
| 9 | Find the Duplicate Number (classic techniques) | Medium | same trick, deeper proof | [statement](../../../41_Advanced_Algorithm_Design/01_Classic_Techniques/03_Problems/02_Medium/02_find_the_duplicate_number.md) · [solution](../../../41_Advanced_Algorithm_Design/01_Classic_Techniques/03_Problems/solutions/02_find_the_duplicate_number.js) |

## 8. Self-check

**Q1.** Why must `fast` move exactly twice as fast (not three times) for the cycle-start proof?

<details><summary>Answer</summary>

The proof uses "fast walked twice the distance of slow", so the extra distance equals slow's distance `a + b`, which is a multiple of the cycle length. Other speeds still detect a cycle but break the simple "restart from head, walk at speed 1" step.

</details>

**Q2.** Why is `nums[0]` a safe starting point in Find the Duplicate Number?

<details><summary>Answer</summary>

Values are in 1..n, so no element points back to index 0. Index 0 is on the tail, never inside the cycle, so the cycle entry (the duplicate value) is well defined.

</details>

**Q3.** For `1 -> 2 -> 3 -> 4`, which node does `middleNode` return?

<details><summary>Answer</summary>

Node 3, the second middle. `fast` goes 1 -> 3 -> null (after 2 steps); `slow` goes 1 -> 2 -> 3.

</details>

---

Previous: [04. Prefix Sums & Difference Arrays](04_prefix_sums_and_difference_arrays.md) · Next: [06. Binary Search & Search on the Answer](06_binary_search_and_search_on_answer.md) · [Pattern index](../../README.md)
