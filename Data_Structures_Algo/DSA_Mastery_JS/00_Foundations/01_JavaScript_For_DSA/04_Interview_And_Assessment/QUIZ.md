# JavaScript For DSA — Quiz

Answer first, then open. Concepts: [CONCEPTS.md](../01_Concepts/CONCEPTS.md).

### Q1. Predict the output

```js
console.log([3, 20, 100].sort());
```

<details><summary>Answer</summary>

`[100, 20, 3]`. Strings compare by first character: '1' < '2' < '3'.

</details>

### Q2. Predict the output

```js
console.log(-5 % 3, ((-5 % 3) + 3) % 3);
```

<details><summary>Answer</summary>

`-2 1`.

</details>

### Q3. Multiple choice — which key type keeps the number 1 and string '1' as separate keys?

A) plain object  B) `Map`  C) both  D) neither

<details><summary>Answer</summary>

**B.**

</details>

### Q4. Spot the bug

```js
const grid = new Array(3).fill(new Array(3).fill(false));
grid[1][1] = true;
```

<details><summary>Answer</summary>

All rows are the same array, so the whole middle column becomes `true`. Use `Array.from({ length: 3 }, () => new Array(3).fill(false))`.

</details>

### Q5. Predict the output

```js
console.log(2 ** 53 === 2 ** 53 + 1, 2n ** 53n === 2n ** 53n + 1n);
```

<details><summary>Answer</summary>

`true false`. Doubles cannot represent 2^53 + 1; BigInt can.

</details>

### Q6. Complexity — what does this cost for an array of length n?

```js
while (queue.length) { const x = queue.shift(); /* O(1) work */ }
```

<details><summary>Answer</summary>

O(n²) in the worst case, because each `shift` moves all remaining elements. Use a head index.

</details>

### Q7. Spot the bug

```js
function hasNegative(nums) {
  nums.forEach((x) => { if (x < 0) return true; });
  return false;
}
```

<details><summary>Answer</summary>

`return true` only exits the callback, so the function always returns false. Use `for...of` or `nums.some(x => x < 0)`.

</details>

### Q8. Predict the output

```js
const s = new Set([1, 2, 2, 3]);
const m = new Map([[[1], 'a']]);
console.log(s.size, m.get([1]));
```

<details><summary>Answer</summary>

`3 undefined`. The array key is a different object.

</details>

### Q9. Multiple choice — which reliably copies a 2D grid so edits to the copy do not affect the original?

A) `[...grid]`  B) `grid.slice()`  C) `grid.map(row => [...row])`  D) `Object.assign([], grid)`

<details><summary>Answer</summary>

**C.** The others copy only the outer array.

</details>

### Q10. Predict the output

```js
console.log((2 ** 31) | 0, Math.trunc(2 ** 31));
```

<details><summary>Answer</summary>

`-2147483648 2147483648`. Bitwise operators wrap at 32 bits.

</details>

### Q11. Spot the bug (memoize)

```js
function memoize(fn) {
  const cache = {};
  return (n) => cache[n] || (cache[n] = fn(n));
}
```

<details><summary>Answer</summary>

Falsy results (0, '', false) are never treated as cached, so `fn` runs again every time. Use a `Map` and `cache.has(n)`.

</details>

### Q12. Predict the output

```js
for (const i in ['a', 'b']) console.log(typeof i);
```

<details><summary>Answer</summary>

`string` twice. `for...in` yields keys as strings; use `for...of` or an index loop for arrays.

</details>

## Mastery checklist

- [ ] I default to `Map`/`Set`, numeric comparators and `Array.from` for grids without thinking.
- [ ] I know the number limits (2^53 − 1, 32-bit bitwise) and when to use `BigInt`.
- [ ] I can implement a stack, an O(1) queue and memoization in plain JavaScript.
- [ ] I know which built-ins are O(n) (`shift`, `includes`, `indexOf`, `splice`, `slice`).
- [ ] I scored at least 10/12 on this quiz.
