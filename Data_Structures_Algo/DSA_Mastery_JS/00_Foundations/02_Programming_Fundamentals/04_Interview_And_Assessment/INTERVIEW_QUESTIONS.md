# Programming Fundamentals — Interview Questions

Answer out loud first, then open the model answer. Back to the [topic README](../README.md).

**1. What is the difference between a primitive and an object when you assign it to another variable?**
<details><summary>Model answer</summary>

Assigning a primitive copies the value. Assigning an object copies the reference, so both variables point to the same object, and a mutation through one is visible through the other (aliasing). This is why `const b = a; b.push(1)` changes `a`.
</details>

**2. Is JavaScript pass-by-reference?**
<details><summary>Model answer</summary>

No, it is pass-by-sharing (call by value where the value of an object is its reference). A function can mutate the object you pass, but reassigning the parameter (`arr = [...]`) does not change the caller's variable. That is why an "in place" function must mutate, not rebind.
</details>

**3. Shallow vs deep copy: what is the difference, and which one do you need for a 2D grid?**
<details><summary>Model answer</summary>

A shallow copy creates a new outer container but shares nested objects. A deep copy recursively copies everything. For a grid of primitives you only need to copy two levels: `grid.map(row => [...row])`. `[...grid]` is not enough because the rows are shared.
</details>

**4. What does `JSON.parse(JSON.stringify(x))` get wrong?**
<details><summary>Model answer</summary>

It drops `undefined` and functions, turns `NaN` and `Infinity` into `null`, turns `Date` into a string, turns `Map` and `Set` into `{}`, throws on cycles and `BigInt`, splits shared references into separate copies, and loses prototypes. It is fine only for plain JSON data.
</details>

**5. What does `structuredClone` support, and what does it not?**
<details><summary>Model answer</summary>

It deep-copies plain objects, arrays, Map, Set, Date, RegExp, typed arrays and handles cycles and shared references. It throws on functions (and DOM nodes) and does not preserve class prototypes: class instances come back as plain objects.
</details>

**6. Explain `==`, `===`, `Object.is` and SameValueZero.**
<details><summary>Model answer</summary>

`==` coerces types (`'1' == 1`), avoid it. `===` is strict but `NaN !== NaN`. `Object.is` is like `===` except `NaN` equals `NaN` and `+0` differs from `-0`. SameValueZero (used by Map, Set and `includes`) treats `NaN` as equal to itself and `+0` equal to `-0`.
</details>

**7. Why does `new Set([[1, 2], [1, 2]])` have size 2? How do you deduplicate arrays?**
<details><summary>Model answer</summary>

Set compares objects by reference and those are two different arrays. Convert each array to a canonical primitive key, e.g. `arr.join(',')` or `JSON.stringify(arr)`, and store keys instead (sort first if order should not matter).
</details>

**8. What goes wrong with `new Array(3).fill([])`?**
<details><summary>Model answer</summary>

`fill` puts the same array reference in all three slots, so pushing into one row pushes into "all" rows. Use `Array.from({ length: 3 }, () => [])` so the factory runs once per slot.
</details>

**9. In backtracking, why do we write `result.push([...path])` instead of `result.push(path)`?**
<details><summary>Model answer</summary>

`path` is one array that is mutated by push/pop for the whole search. Pushing it stores a reference; at the end every stored entry is the same (usually empty) array. Copying takes a snapshot of the current state.
</details>

**10. How would you avoid off-by-one errors in loops?**
<details><summary>Model answer</summary>

Use half-open ranges `[lo, hi)` consistently, state the range out loud, derive bounds from what you access (`arr[i + 1]` needs `i < n - 1`; windows of size k need `start + k <= n`), and test with n = 0, 1, 2 and with the boundary values themselves.
</details>

**11. What is a closure, and where does it show up in DSA?**
<details><summary>Model answer</summary>

A function together with the variables of the scope it was created in. In DSA: memoization caches private to a function, DFS helpers that read `grid`/`visited` from the enclosing function, and comparator factories. Watch out for module-level caches that leak between test cases.
</details>

**12. What is the iteration protocol? Why is a generator object not re-iterable?**
<details><summary>Model answer</summary>

An iterable has `[Symbol.iterator]()` returning an iterator with `next()` → `{ value, done }`. `for...of`, spread and destructuring use it. A generator object is its own iterator, so once exhausted it stays done. An iterable that creates a fresh iterator on every `[Symbol.iterator]()` call (like an array or a class with a generator method) can be iterated many times.
</details>

**13. Why is `[10, 9, 1].sort()` wrong for numbers?**
<details><summary>Model answer</summary>

The default comparator converts elements to strings and compares them lexicographically, giving `[1, 10, 9]`. Always pass `(a, b) => a - b`. Also remember `sort` mutates in place; use `toSorted` or copy first if the caller's array must not change.
</details>

**14. How do you compare two objects for equality in an interview?**
<details><summary>Model answer</summary>

Write a recursive `deepEqual`: SameValueZero for primitives, check both are objects and both arrays or both not, compare lengths/key counts, check every key exists in the other with `hasOwnProperty`, recurse, return false at the first difference. Mention cycles (track visited pairs) and special types (Date, Map, Set) as extensions.
</details>
