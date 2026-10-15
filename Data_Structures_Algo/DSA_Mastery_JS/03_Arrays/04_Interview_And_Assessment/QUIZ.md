# Arrays — Quiz

Answer each question before opening the answer. Score yourself honestly; revisit [CONCEPTS.md](../01_Concepts/CONCEPTS.md) for anything you miss.

### Q1. Multiple choice — which operation is O(1) on a JavaScript array?

A) `arr.unshift(x)`  B) `arr.pop()`  C) `arr.indexOf(x)`  D) `arr.splice(0, 1)`

<details><summary>Answer</summary>

**B.** `pop` removes the last slot, nothing moves. The others shift elements or scan.

</details>

### Q2. Predict the output

```js
const grid = new Array(2).fill([]);
grid[0].push('x');
console.log(grid[1].length);
```

<details><summary>Answer</summary>

`1`. Both rows are the same array object because `fill` copies the reference.

</details>

### Q3. Complexity — what is the time complexity?

```js
for (let i = 0; i < n; i++) {
  if (arr.includes(i)) count++;
}
```

<details><summary>Answer</summary>

O(n²): `includes` is O(n) and runs n times. Put `arr` into a `Set` first to make it O(n).

</details>

### Q4. Spot the bug (Kadane)

```js
function maxSubArray(nums) {
  let cur = 0, best = 0;
  for (const x of nums) { cur = Math.max(x, cur + x); best = Math.max(best, cur); }
  return best;
}
```

<details><summary>Answer</summary>

`best` starts at 0, so an all-negative array like `[-3, -1]` returns 0 instead of -1. Initialise with `best = -Infinity` (or `nums[0]`).

</details>

### Q5. Multiple choice — rotating `[1,2,3,4,5]` right by k = 7 should give

A) `[4,5,1,2,3]`  B) `[3,4,5,1,2]`  C) an error  D) `[1,2,3,4,5]`

<details><summary>Answer</summary>

**A.** 7 % 5 = 2, so rotate right by 2.

</details>

### Q6. Predict the output

```js
const a = [1, 2, 3];
const b = a;
b.push(4);
console.log(a.length, a === b);
```

<details><summary>Answer</summary>

`4 true`. Arrays are objects; `b = a` copies the reference, not the contents.

</details>

### Q7. Spot the bug (remove in a loop)

```js
for (let i = 0; i < nums.length; i++) {
  if (nums[i] === val) nums.splice(i, 1);
}
```

<details><summary>Answer</summary>

After `splice`, the next element shifts into index `i`, but the loop moves to `i + 1`, so consecutive matches are skipped (`[2, 2]` with val 2 leaves one 2). It is also O(n²). Use a write pointer, or loop backwards.

</details>

### Q8. Complexity — amortized cost

A dynamic array doubles its capacity when full. Starting at capacity 1, how many element copies happen in total for 9 pushes?

<details><summary>Answer</summary>

Copies happen when pushing into a full array of size 1, 2, 4 and 8: 1 + 2 + 4 + 8 = 15, which is less than 2 × 9. Amortized O(1) per push.

</details>

### Q9. Multiple choice — Dutch national flag (Sort Colors). After swapping `nums[mid]` with `nums[high]` you should:

A) increment `mid` and decrement `high`  B) only decrement `high`  C) only increment `mid`  D) increment `low`

<details><summary>Answer</summary>

**B.** The value swapped in from `high` has not been examined yet, so `mid` must stay.

</details>

### Q10. Predict the output

```js
console.log([10, 1, 3].sort());
console.log([10, 1, 3].sort((a, b) => a - b));
```

<details><summary>Answer</summary>

`[1, 10, 3]` then `[1, 3, 10]`. The default sort compares strings.

</details>

### Q11. Complexity — what is the space complexity of the index-as-hash solution to "Find All Numbers Disappeared"?

<details><summary>Answer</summary>

O(1) extra space (not counting the output list): it marks presence by negating values inside the input array.

</details>

### Q12. Spot the bug (first missing positive)

```js
for (let i = 0; i < n; i++) {
  if (nums[i] > 0 && nums[i] <= n && nums[i] !== i + 1) {
    [nums[i], nums[nums[i] - 1]] = [nums[nums[i] - 1], nums[i]];
  }
}
```

<details><summary>Answer</summary>

Two bugs. (1) `if` must be `while`: after one swap, the new value at `i` may also need placing. (2) The guard must be `nums[nums[i] - 1] !== nums[i]`, otherwise duplicates loop forever once it is a `while`. Also, the destructuring evaluates `nums[i] - 1` after `nums[i]` is overwritten; save the target index in a variable first.

</details>

## Mastery checklist

- [ ] I can explain why index access is O(1) and why `push` is amortized O(1).
- [ ] I can write Kadane, write-pointer compaction and three-reversal rotation from memory without bugs.
- [ ] I can solve Two Sum, Product of Array Except Self and Sort Colors in under 15 minutes each.
- [ ] I know when index-as-hash / cyclic sort applies and when it does not.
- [ ] I scored at least 10/12 on this quiz without opening an answer early.
