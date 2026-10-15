# Linked Lists

> **Prerequisites:** [JavaScript for DSA](../../00_Foundations/01_JavaScript_For_DSA/README.md) (objects and references), [Arrays](../../03_Arrays/README.md), [Time Complexity](../../01_Complexity_Analysis/01_Time_Complexity/README.md), [Two Pointers](../../06_Two_Pointers/README.md) (fast/slow pointers build on it).

A **linked list** is a chain of **nodes**. Each node holds a value and a **pointer** (a reference)
to the next node. There is no index: to reach the 5th item you follow four "next" arrows.
Think of a treasure hunt where every clue tells you where the next clue is. You can't skip
ahead, but you can insert a new clue anywhere just by rewriting two notes.

---

## Why it matters / when to use

Reach for a linked list (or recognise one) when:

- The problem literally gives you a `ListNode` with `.val` and `.next` (LeetCode does this a lot)
- You need **O(1) insert/remove at the front** or at a node you already hold (queues, LRU cache)
- The size changes constantly and you never need "item number i"
- You are implementing another structure: stack, queue, deque, hash-map buckets, LRU cache
- Interviewers want to see **pointer manipulation**: reverse, merge, detect cycle, find middle

Signals in a problem: "linked list", "reverse", "cycle", "middle", "k-th from the end",
"merge sorted lists", "reorder", "in place with O(1) extra space".

---

## How it works

### The node / pointer mental model

A node is just an object. The list is just a reference to the first node (the **head**).

```js
const node3 = { val: 3, next: null };
const node2 = { val: 2, next: node3 };
const node1 = { val: 1, next: node2 };
const head  = node1;
```

```
 head
  |
  v
+-----+-----+     +-----+-----+     +-----+------+
|  1  |  o--+---->|  2  |  o--+---->|  3  | null |
+-----+-----+     +-----+-----+     +-----+------+
  val   next        val   next        val   next
```

Key idea: **a pointer is just a variable that holds a reference.** `current = current.next`
does not move any node; it just makes the variable look at a different node.
`a.next = b` rewires an arrow; it is the only way the list's shape changes.

### Singly vs doubly vs circular

```
Singly:    1 -> 2 -> 3 -> null                 (next only; can't go back)

Doubly:    null <- 1 <-> 2 <-> 3 -> null       (prev and next; O(1) delete of a held node)

Circular:  1 -> 2 -> 3 -+                      (tail points back to head; no null end)
           ^____________|
```

| Kind | Extra memory | Walk backwards | Delete node you hold | Used in |
|------|--------------|----------------|----------------------|---------|
| Singly | 1 pointer/node | no | O(n) (must find prev) | most interview problems |
| Doubly | 2 pointers/node | yes | O(1) | LRU cache, deque, browser history |
| Circular | same as above | depends | depends | round-robin scheduling, ring buffers |

### Array vs linked list

| | Array | Linked list |
|---|---|---|
| Access by index | O(1) | O(n) |
| Insert/remove at front | O(n) (shift everything) | O(1) |
| Insert/remove at end | O(1) amortized | O(1) with a tail pointer (O(n) remove in singly) |
| Insert/remove in middle (node known) | O(n) | O(1) doubly / O(1) singly if you hold `prev` |
| Memory | contiguous, cache friendly | one object per node, pointer overhead |
| Search | O(n) (O(log n) if sorted) | O(n), binary search impossible |

In JavaScript you almost never use a linked list in app code (arrays are dynamic and fast).
You learn it because **interviews test pointer reasoning**, and because it underlies queues,
LRU caches and many runtime internals.

---

## Pseudocode

```
REVERSE(head):
    prev = null; curr = head
    while curr != null:
        next = curr.next          # save before overwriting
        curr.next = prev          # flip the arrow
        prev = curr; curr = next  # advance both
    return prev

MIDDLE(head):                     # fast / slow
    slow = fast = head
    while fast != null and fast.next != null:
        slow = slow.next; fast = fast.next.next
    return slow                   # second middle for even length

DELETE_ALL(head, x):              # dummy head pattern
    dummy = Node(0, head); curr = dummy
    while curr.next != null:
        if curr.next.val == x: curr.next = curr.next.next
        else: curr = curr.next
    return dummy.next
```

---

## Operations & complexity

| Operation | Time | Space | Note |
|-----------|------|-------|------|
| unshift / insert at head | O(1) | O(1) | new node points to old head |
| push / insert at tail | O(1) | O(1) | needs a tail pointer, else O(n) |
| shift / remove head | O(1) | O(1) | |
| pop / remove tail | O(n) singly, O(1) doubly | O(1) | singly must walk to find the new tail |
| get(i) / set(i) | O(n) | O(1) | walk i steps |
| insert / remove at index i | O(n) | O(1) | O(n) to find it, O(1) to rewire |
| search | O(n) | O(1) | |
| reverse | O(n) | O(1) | 3 pointers |
| find middle / cycle / nth-from-end | O(n) | O(1) | two pointers |

---

## JavaScript implementation

Full code with tests:
- `list_node.js` - the minimal `ListNode` plus `toList([..])` / `toArray(head)` helpers used by every problem file
- `singly_linked_list.js` - full `SinglyLinkedList` class (push, unshift, pop, shift, get, set, insert, remove, reverse, iterator)
- `doubly_linked_list.js` - full `DoublyLinkedList` class with O(1) `removeNode`

Core idea:

```js
class ListNode {
  constructor(val = 0, next = null) { this.val = val; this.next = next; }
}

// walk a list
let current = head;
while (current) {            // stops when current becomes null
  console.log(current.val);
  current = current.next;
}

// insert after a node
const node = new ListNode(99);
node.next = prev.next;        // 1. new node points to what prev pointed to
prev.next = node;             // 2. prev points to new node (ORDER MATTERS)

// remove the node after prev
prev.next = prev.next.next;   // skip over it; garbage collector frees it
```

---

## Dry run

**Reverse `1 → 2 → 3 → null`:**

| Step | curr | next (saved) | after `curr.next = prev` | prev (after) | curr (after) |
|---|---|---|---|---|---|
| 1 | 1 | 2 | 1 → null | 1 | 2 |
| 2 | 2 | 3 | 2 → 1 → null | 2 | 3 |
| 3 | 3 | null | 3 → 2 → 1 → null | 3 | null |
| end | null | - | - | **3 is the new head** | - |

**Fast/slow middle on `1 → 2 → 3 → 4 → 5`:**

| Round | slow | fast | loop continues? |
|---|---|---|---|
| start | 1 | 1 | fast.next = 2, yes |
| 1 | 2 | 3 | fast.next = 4, yes |
| 2 | 3 | 5 | fast.next = null, no |

Middle = **3**.

---

## Patterns / variations

### 1. Dummy (sentinel) head

The head is special: removing it or inserting before it needs an `if`. A **dummy node in
front of the head** removes every special case. Return `dummy.next` at the end.

```js
function removeElements(head, val) {
  const dummy = new ListNode(0, head);
  let prev = dummy;
  while (prev.next) {
    if (prev.next.val === val) prev.next = prev.next.next; // may remove the real head too
    else prev = prev.next;
  }
  return dummy.next;
}
```
Use when: anything that deletes/inserts near the head, merging, building a result list.

### 2. Fast & slow pointers (middle)

```js
let slow = head, fast = head;
while (fast && fast.next) {
  slow = slow.next;        // 1 step
  fast = fast.next.next;   // 2 steps
}
// slow is the middle (second middle on even length)
```
For the FIRST middle on even length, loop `while (fast.next && fast.next.next)`.
Use when: middle, palindrome, split for merge sort, reorder list.

### 3. Floyd's cycle detection (tortoise and hare)

```js
let slow = head, fast = head;
while (fast && fast.next) {
  slow = slow.next;
  fast = fast.next.next;
  if (slow === fast) return true; // compare nodes, not values
}
return false;
```
Why they must meet: once both are inside the loop, fast gains exactly 1 step on slow per
move, so the gap shrinks 1 by 1 and hits 0 within one lap. It can never "jump over".

To find the cycle **start**: after they meet, reset one pointer to head and move both 1 step
at a time; they meet at the entrance. (Proof sketch in `03_Problems/solutions/04_linked_list_cycle_ii.js`.)

### 4. Two pointers with a gap (nth from end)

```js
let fast = dummy, slow = dummy;
for (let i = 0; i <= n; i++) fast = fast.next; // gap of n+1
while (fast) { slow = slow.next; fast = fast.next; }
slow.next = slow.next.next; // slow is right before the target
```

### 5. Reversal - iterative, 3 pointers, step by step

```js
let prev = null, current = head;
while (current) {
  const next = current.next; // (a) save
  current.next = prev;       // (b) flip
  prev = current;            // (c) advance prev
  current = next;            // (d) advance current
}
return prev;
```

```
start:        prev=null   cur=1
              1 -> 2 -> 3 -> null

after (b):    null <- 1    2 -> 3 -> null      (arrow of 1 flipped)
after (c,d):  prev=1  cur=2

after (b):    null <- 1 <- 2    3 -> null
after (c,d):  prev=2  cur=3

after (b):    null <- 1 <- 2 <- 3
after (c,d):  prev=3  cur=null  -> loop ends, return prev (3)
```

Recursive version: reverse the rest, then `head.next.next = head; head.next = null`.
Costs O(n) stack; know it, but default to the iterative one.

### 6. Merging two sorted lists (dummy + tail)

```js
const dummy = new ListNode(0);
let tail = dummy;
while (a && b) {
  if (a.val <= b.val) { tail.next = a; a = a.next; }
  else                { tail.next = b; b = b.next; }
  tail = tail.next;
}
tail.next = a || b;   // attach the leftover list
return dummy.next;
```
Use when: merge two lists, merge k lists (divide & conquer), merge sort on a list.

### 7. Combining patterns

Many "medium" problems are just two or three of the above glued together:
- **Palindrome** = middle + reverse second half + compare
- **Reorder List** = middle + reverse + alternate merge
- **Sort List** = middle (split) + recursion + merge
- **LRU Cache** = doubly linked list + Map

---

## How to draw before coding

1. Draw 3 or 4 boxes with arrows. Label the head.
2. Write the pointer variables you'll use (`prev`, `current`, `next`) under the boxes.
3. Execute your algorithm **by hand** for one iteration, redrawing the arrows.
4. Check: what happens at the start (head), at the end (null), and with 0/1/2 nodes?
5. Only now write code. Every line that assigns `.next` should match an arrow you drew.

---

## Alternatives (brute force vs optimized)

| Task | Brute force | Optimized | Trade-off |
|---|---|---|---|
| Most list problems | Copy values into an array, solve with indexes, rebuild | Relink pointers in place | Array copy is O(n) extra space but much easier; say so, then optimize |
| Cycle detection | Set of visited nodes, O(n) space | Floyd fast/slow, O(1) space | Set version also gives the cycle start directly |
| Nth from end | Two passes (count length, then walk) | One pass with a gap of n between two pointers | Same O(n); one pass is the usual follow-up |
| Sort a list | Copy to array, `sort`, rebuild: O(n log n), O(n) space | Merge sort on the list: O(n log n), O(log n) or O(1) space | Array version is fine in real code |
| LRU cache | Array ordered by recency: O(n) per op | Map + doubly linked list: O(1) per op | In JS a single `Map` (insertion order) is a valid shortcut |
| Plain sequence storage | Linked list | JS array | Arrays win on cache locality and random access unless you need O(1) middle inserts with a held reference |

---

## Common mistakes & edge cases

- **Losing the rest of the list**: setting `current.next = prev` before saving `current.next`.
  Always save `next` first.
- **Null dereference**: `fast.next.next` when `fast.next` is null. Loop condition must check
  `fast && fast.next`.
- **Forgetting to cut**: after splitting a list (reorder, sort) set `middle.next = null`, or you
  create a cycle and loop forever.
- **Comparing values instead of nodes** in cycle/intersection problems. Use `===` on node objects.
- **Off-by-one in the gap**: for "nth from end" start from the dummy and move `n + 1` steps.
- **Returning `head` after reversal** (it's now the tail). Return `prev`.
- **Not using a dummy** and then writing three `if` branches for "what if the head is removed".
- **Empty list / single node**: test them every time. Most pointer bugs show up there.
- **Modifying the input** when the problem says not to (e.g. palindrome): restore it, or say
  out loud that you are mutating.

---

## When this does NOT apply

- **You need random access by index** (binary search, `arr[i]` lookups): a list costs O(n) per access.
- **Mostly appending and iterating**: a JS array is simpler and faster.
- **Memory is tight**: every node carries one or two extra pointers.
- **Very long lists processed recursively**: recursion depth equals length; use loops.
- **Problem gives an array**: don't convert to a list unless an operation (like O(1) splice with a held reference) really needs it.

---

## Interview tips

- Say the plan in terms of pointers: "I'll keep `prev` one behind so I can unlink."
- Mention the dummy node early: "I'll use a sentinel so the head isn't a special case."
- For fast/slow, state the invariant: "fast is always twice as far from the head as slow."
- For reversal, narrate the 4 lines (save, flip, advance, advance). Interviewers listen for it.
- Always give time AND space: most list algorithms are O(n) time, O(1) space, and that O(1) is
  usually the whole point of the question (vs. "copy to an array").
- Ask: "May I modify the list in place?" and "Can the list be empty?"
- Draw it. Nobody solves Reorder List or k-Group in their head.

---

## Problems in this folder

| # | Problem | Difficulty | Pattern | File |
|---|---------|------------|---------|------|
| 01 | Reverse Linked List | Easy | 3-pointer reversal (iter + recursive) | 03_Problems/solutions/01_reverse_linked_list.js |
| 02 | Merge Two Sorted Lists | Easy | dummy + tail merge | 03_Problems/solutions/02_merge_two_sorted_lists.js |
| 03 | Linked List Cycle | Easy | Floyd fast/slow | 03_Problems/solutions/03_linked_list_cycle.js |
| 04 | Linked List Cycle II | Medium | Floyd phase 2 | 03_Problems/solutions/04_linked_list_cycle_ii.js |
| 05 | Middle of the Linked List | Easy | fast/slow | 03_Problems/solutions/05_middle_of_linked_list.js |
| 06 | Remove Nth Node From End | Medium | two pointers with gap | 03_Problems/solutions/06_remove_nth_from_end.js |
| 07 | Palindrome Linked List | Easy | middle + reverse + compare | 03_Problems/solutions/07_palindrome_linked_list.js |
| 08 | Remove Linked List Elements | Easy | dummy + prev | 03_Problems/solutions/08_remove_linked_list_elements.js |
| 09 | Remove Duplicates from Sorted List (+ II) | Easy | compare with next | 03_Problems/solutions/09_remove_duplicates_sorted_list.js |
| 10 | Intersection of Two Linked Lists | Easy | two pointers switching lists | 03_Problems/solutions/10_intersection_of_two_linked_lists.js |
| 11 | Add Two Numbers | Medium | carry + dummy | 03_Problems/solutions/11_add_two_numbers.js |
| 12 | Odd Even Linked List | Medium | two chains | 03_Problems/solutions/12_odd_even_linked_list.js |
| 13 | Swap Nodes in Pairs | Medium | dummy + rewire | 03_Problems/solutions/13_swap_nodes_in_pairs.js |
| 14 | Reorder List | Medium | middle + reverse + merge | 03_Problems/solutions/14_reorder_list.js |
| 15 | Rotate List | Medium | ring and cut | 03_Problems/solutions/15_rotate_list.js |
| 16 | Copy List with Random Pointer | Medium | Map / interleave | 03_Problems/solutions/16_copy_list_with_random_pointer.js |
| 17 | Reverse Nodes in k-Group | Hard | group reversal + reconnect | 03_Problems/solutions/17_reverse_nodes_in_k_group.js |
| 18 | Merge k Sorted Lists | Hard | divide & conquer / min-heap | 03_Problems/solutions/18_merge_k_sorted_lists.js |
| 19 | Sort List | Medium | merge sort on a list | 03_Problems/solutions/19_sort_list.js |
| 20 | LRU Cache | Medium | doubly linked list + Map | 03_Problems/solutions/20_lru_cache.js |

---

## Practice more

Easy: Delete Node in a Linked List (237), Convert Binary Number in a Linked List to Integer (1290),
Merge In Between Linked Lists (1669), Design HashSet (705)

Medium: Partition List (86), Remove Duplicates from Sorted List II (82), Reverse Linked List II (92),
Split Linked List in Parts (725), Insert into a Sorted Circular Linked List (708),
Flatten a Multilevel Doubly Linked List (430), Linked List Random Node (382),
Design Linked List (707), Delete the Middle Node of a Linked List (2095),
Swapping Nodes in a Linked List (1721), Next Greater Node in Linked List (1019),
Design Browser History (1472)

Hard: LFU Cache (460), Design Skiplist (1206), All O`one Data Structure (432)
