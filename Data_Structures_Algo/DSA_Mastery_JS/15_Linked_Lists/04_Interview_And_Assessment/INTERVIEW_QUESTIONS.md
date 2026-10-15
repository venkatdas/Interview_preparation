# Linked Lists — Interview Questions

Answer out loud first, then open the model answer. Back to the [topic README](../README.md) · [Concepts](../01_Concepts/CONCEPTS.md) · [Quiz](QUIZ.md)

---

### 1. Array vs linked list: when would you pick a linked list?

<details><summary>Model answer</summary>

Pick a linked list when you insert or delete in the middle **and already hold a reference** to the spot (O(1) relinking, no shifting), or when you need O(1) add/remove at both ends without a deque. Pick an array when you need random access by index (O(1) vs O(n)), cache-friendly iteration, or less memory per element. In JavaScript, arrays are usually faster in practice; linked lists shine inside other structures (LRU cache, queues, adjacency lists).

</details>

### 2. What is a dummy (sentinel) head and why use it?

<details><summary>Model answer</summary>

A fake node placed before the real head: `const dummy = new ListNode(0, head)`. It makes "insert/delete at the head" the same as anywhere else, so you avoid special cases; at the end return `dummy.next`. Used in merge, remove elements, remove Nth from end, partition, add two numbers.

</details>

### 3. Walk through reversing a singly linked list iteratively.

<details><summary>Model answer</summary>

Keep `prev = null`, `curr = head`. Loop: save `next = curr.next`, point `curr.next = prev`, move `prev = curr`, `curr = next`. When `curr` is null, `prev` is the new head. O(n) time, O(1) space. The recursive version uses O(n) stack and can overflow for very long lists in JS.

</details>

### 4. How does Floyd's algorithm detect a cycle, and how does it find the cycle start?

<details><summary>Model answer</summary>

Slow moves 1 step, fast moves 2. If there is a cycle, fast gains one step per round inside it and must land on slow; if fast hits null, there is no cycle. To find the start: reset one pointer to head and move both 1 step at a time; they meet at the cycle entrance. Reason: if the distance head→entry is `a` and the meeting point is `b` into the cycle of length `c`, then `2(a + b) = a + b + kc`, so `a = kc - b`: walking `a` from the meeting point lands on the entry.

</details>

### 5. How do you find the middle node in one pass?

<details><summary>Model answer</summary>

Fast/slow pointers: when fast reaches the end, slow is at the middle. With `while (fast && fast.next)` starting both at head, slow lands on the **second** middle for even lengths; start fast at `head.next` (or loop on `fast.next && fast.next.next`) to get the first middle, which is what you want before splitting for merge sort.

</details>

### 6. Remove the Nth node from the end in one pass — how?

<details><summary>Model answer</summary>

Use a dummy and two pointers. Move `fast` n + 1 steps ahead from the dummy, then move both until `fast` is null; `slow.next` is the node to remove. The dummy handles removing the original head.

</details>

### 7. Why is merge sort preferred for sorting a linked list?

<details><summary>Model answer</summary>

Merging two sorted lists needs only pointer changes, no extra array, and splitting at the middle is O(n) with fast/slow. Total O(n log n) time with O(log n) recursion (or O(1) bottom-up). Quicksort needs random access for good pivots and heap sort needs indexing, both awkward on lists.

</details>

### 8. Design an LRU cache with O(1) get and put.

<details><summary>Model answer</summary>

A hash map from key to node plus a doubly linked list ordered by recency (dummy head and tail). `get`: look up node, move it to the front. `put`: update and move, or insert at the front; if over capacity, remove the node before the dummy tail and delete its key from the map. Doubly linked because removal needs `prev` in O(1). (In JS a `Map` alone also works because it keeps insertion order: delete and re-set to refresh.)

</details>

### 9. How do you copy a list with random pointers?

<details><summary>Model answer</summary>

Option 1: a Map from old node to new node, two passes (create, then wire `next` and `random`); O(n) space. Option 2: interleave copies (`A → A' → B → B'`), set `A'.random = A.random.next`, then unweave; O(1) extra space.

</details>

### 10. How would you check if a linked list is a palindrome in O(1) extra space?

<details><summary>Model answer</summary>

Find the middle, reverse the second half in place, compare the two halves node by node, then (politely) reverse the second half back to restore the input. O(n) time, O(1) space. Copying to an array is simpler but O(n) space.

</details>

### 11. Two lists may intersect. How do you find the intersection node without extra space?

<details><summary>Model answer</summary>

Two pointers: walk `a` through list A then list B, and `b` through B then A. Both travel `lenA + lenB` steps, so they arrive at the intersection at the same time, or both reach null together if there is none. Intersection means the same node object, not equal values.

</details>

### 12. What edge cases do you always test for linked list code?

<details><summary>Model answer</summary>

Empty list (`null`), one node, two nodes, operations on the head or tail, even vs odd length, cycles where relevant, and k or n equal to the length. Also draw the pointers before and after each relink, and check that you never read `.next` of null.

</details>

### 13. Why might recursion be dangerous on linked lists in JavaScript?

<details><summary>Model answer</summary>

Recursion depth equals list length. A list of 100k nodes exceeds Node's default stack (~10k frames) and throws `RangeError`. Prefer iterative solutions in interviews unless the list is short or you mention the trade-off.

</details>
