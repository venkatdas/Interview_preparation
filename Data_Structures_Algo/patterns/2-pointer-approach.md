# Two Pointers Pattern — Complete Guide 🎯

---

## What is Two Pointers?

Two Pointers is a technique where you use **two variables (pointers)** to track positions in an array and move them based on a condition.

Instead of using nested loops (O(n²)), two pointers solves problems in **O(n)** — much faster.

---

## Types of Two Pointers

### Type 1 — Opposite Direction (Left & Right)
```
left = 0
right = arr.length - 1
// move toward each other
```
```
[1, 2, 3, 4, 5]
 ↑           ↑
left        right
```

### Type 2 — Same Direction (Slow & Fast)
```
i = 0  // slow pointer
j = 0  // fast pointer
// both move forward but at different speeds
```
```
[1, 2, 3, 4, 5]
 ↑
 i
 ↑
 j
```

### Type 3 — Two Arrays (Like Merge Sorted Array)
```
i = 0  // pointer for array 1
j = 0  // pointer for array 2
// each pointer moves through its own array
```

---

## How to Recognise Two Pointers Problems 🔍

Ask yourself these questions when you see a problem:

| Question | If YES → likely Two Pointers |
|---|---|
| Is the array **sorted**? | ✅ |
| Do you need to find a **pair** of elements? | ✅ |
| Does it say **"two elements that..."**? | ✅ |
| Does it involve **comparing from both ends**? | ✅ |
| Do you need to **merge two arrays**? | ✅ |
| Does it say **remove duplicates in-place**? | ✅ |
| Does it involve **slow and fast movement**? | ✅ |

---

## Keywords That Hint Two Pointers 🔑

When you see these words in a problem — think Two Pointers:

- "sorted array"
- "find pair"
- "two elements"
- "in-place"
- "remove duplicates"
- "merge"
- "palindrome"
- "reverse"
- "target sum"
- "closest to"

---

## Template — Opposite Direction
```js
function twoPointers(arr) {
    let left = 0;
    let right = arr.length - 1;

    while (left < right) {
        // check your condition
        if (condition) {
            // do something
            left++;
        } else {
            right--;
        }
    }
}
```

## Template — Same Direction
```js
function twoPointers(arr) {
    let i = 0; // slow
    let j = 0; // fast

    while (j < arr.length) {
        // check your condition
        if (condition) {
            // do something with i
            i++;
        }
        j++; // fast always moves
    }
}
```

## Template — Two Arrays
```js
function twoPointers(arr1, arr2) {
    let i = 0; // pointer for arr1
    let j = 0; // pointer for arr2
    let result = [];

    while (i < arr1.length && j < arr2.length) {
        if (arr1[i] < arr2[j]) {
            result.push(arr1[i]);
            i++;
        } else {
            result.push(arr2[j]);
            j++;
        }
    }

    // handle remaining elements
    while (i < arr1.length) { result.push(arr1[i]); i++; }
    while (j < arr2.length) { result.push(arr2[j]); j++; }

    return result;
}
```

---

## Problems You Solved Using Two Pointers ✅

### Merge Sorted Array (LeetCode #88)
- **Type:** Two Arrays
- **Pointers:** i for nums1, j for nums2
- **Logic:** Compare both, pick smaller, move that pointer

---

## Practice Problems — Easy Level 🏋️

Solve these in order:

| # | Problem | Type | LeetCode |
|---|---|---|---|
| 1 | Merge Sorted Array | Two Arrays | #88 ✅ Done! |
| 2 | Move Zeroes | Same Direction | #283 |
| 3 | Remove Duplicates from Sorted Array | Same Direction | #26 |
| 4 | Valid Palindrome | Opposite Direction | #125 |
| 5 | Two Sum II | Opposite Direction | #167 |
| 6 | Squares of Sorted Array | Opposite Direction | #977 |

---

## The Thinking Framework for Every Two Pointer Problem 🧠

1. **Read the problem** — what is it actually asking?
2. **Is array sorted?** Do I need pairs or comparison?
3. **Which type of two pointers?** Opposite / Same / Two Arrays
4. **Solve manually** with your eyes first
5. **Write in plain English** what your brain did
6. **Convert to code** using the templates above
7. **Dry run** with the example before submitting

---

## Common Mistakes to Avoid ⚠️

- Forgetting to move the pointer after picking (`i++` or `j++`)
- Moving the wrong pointer
- Forgetting to handle remaining elements after main loop
- Not initialising pointers (`let i = 0` not `let i`)
- Using `i++` outside if/else instead of inside

---

*Remember: You already solved Merge Sorted Array using Two Pointers today. Trust the process! 💪*
