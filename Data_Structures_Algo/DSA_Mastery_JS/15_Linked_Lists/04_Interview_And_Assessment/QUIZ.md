# Linked Lists — Quiz

Try first, then open the answer. Re-read [CONCEPTS.md](../01_Concepts/CONCEPTS.md) for anything you missed. See also: [Interview questions](INTERVIEW_QUESTIONS.md).

---

**1. (Complexity)** Singly linked list with head and tail pointers. Cost of: push to tail, pop from tail, get(i)?

<details><summary>Answer</summary>push O(1), pop O(n) (must find the node before the tail), get(i) O(i) = O(n).</details>

**2. (Predict the output)**

```js
class N { constructor(v, n = null) { this.val = v; this.next = n; } }
let head = new N(1, new N(2, new N(3)));
let prev = null, curr = head;
while (curr) { const nx = curr.next; curr.next = prev; prev = curr; curr = nx; }
console.log(prev.val, head.val, head.next);
```

<details><summary>Answer</summary>`3 1 null`. `head` still points at node 1, which is now the tail.</details>

**3. (Spot the bug)**

```js
function reverse(head) {
  let prev = null;
  while (head) { head.next = prev; prev = head; head = head.next; }
  return prev;
}
```

<details><summary>Answer</summary>`head.next` is overwritten before it is saved, so `head = head.next` jumps back to `prev` and the loop stops after one node. Save `const next = head.next` first.</details>

**4. (Multiple choice)** Which needs a doubly linked list to be O(1)?
A) push to tail  B) remove a node given only a reference to it  C) insert at head  D) traverse forward

<details><summary>Answer</summary>B (you need `prev` to relink). A, C and D are O(1)/O(n) for singly lists too.</details>

**5. (Predict the output)** With `while (fast && fast.next) { slow = slow.next; fast = fast.next.next; }`, both starting at head of `1→2→3→4`, what is `slow.val`?

<details><summary>Answer</summary>`3` — the second middle for even length.</details>

**6. (Spot the bug)** Delete all nodes with value `x`:

```js
function removeAll(head, x) {
  let curr = head;
  while (curr && curr.next) {
    if (curr.next.val === x) curr.next = curr.next.next;
    else curr = curr.next;
  }
  return head;
}
```

<details><summary>Answer</summary>The head itself is never checked: `removeAll([x, 1], x)` keeps the first `x`. Use a dummy node before head and return `dummy.next`.</details>

**7. (Complexity)** Merging k sorted lists with a min-heap, total N nodes: time?

<details><summary>Answer</summary>O(N log k). Each node is pushed and popped once in a heap of size ≤ k.</details>

**8. (Multiple choice)** Floyd's cycle detection uses how much extra space?
A) O(1)  B) O(log n)  C) O(n)  D) O(n²)

<details><summary>Answer</summary>A. A Set of visited nodes would be O(n).</details>

**9. (Predict the output)**

```js
const a = { val: 1, next: null };
const b = { val: 1, next: null };
console.log(a === b, a.val === b.val);
```

<details><summary>Answer</summary>`false true`. "Intersection" problems compare node identity (`===`), not values.</details>

**10. (Spot the bug)** Remove Nth from end:

```js
function removeNth(head, n) {
  let fast = head, slow = head;
  for (let i = 0; i < n; i++) fast = fast.next;
  while (fast.next) { fast = fast.next; slow = slow.next; }
  slow.next = slow.next.next;
  return head;
}
```

<details><summary>Answer</summary>When n equals the length, `fast` becomes null and `fast.next` throws; the head can never be removed. Start both at a dummy node, advance fast n + 1 times, loop while `fast`, return `dummy.next`.</details>

**11. (Complexity)** Checking palindrome by reversing the second half in place: time and extra space?

<details><summary>Answer</summary>O(n) time, O(1) extra space.</details>

**12. (Multiple choice)** Rotate a list right by k where k can be 2·10^9 and length is 5. What must you do first?
A) Rotate one step at a time k times  B) Compute `k % length`  C) Convert to an array  D) Use recursion

<details><summary>Answer</summary>B. Then find the new tail at `length - k % length - 1` and relink once.</details>

---

## Mastery checklist

- [ ] I can reverse a list iteratively and recursively without looking, and explain each pointer move.
- [ ] I use a dummy head by habit whenever the head might change.
- [ ] I can apply fast/slow pointers for middle, cycle detection and cycle start, and prove why the start works.
- [ ] I can implement an LRU cache with a Map and a doubly linked list.
- [ ] I test empty, single-node, two-node and head/tail cases before saying "done".
