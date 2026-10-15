# Advanced String Algorithms — Quiz

Try each question on paper, then open the answer. Back to the [topic README](../README.md).

**1. (Compute) What is the LPS array of `"abacaba"`?**

<details><summary>Answer</summary>

`[0, 0, 1, 0, 1, 2, 3]`. The whole string has border `"aba"` (length 3).
</details>

**2. (Compute) What is the Z array of `"aabxaab"` (with z[0] = n)?**

<details><summary>Answer</summary>

`[7, 1, 0, 0, 3, 1, 0]`. Position 4 starts `"aab"`, which matches the prefix for 3 characters.
</details>

**3. (Multiple choice) KMP search over a text of length n with a pattern of length m runs in:**
a) O(n·m)  b) O(n log m)  c) O(n + m)  d) O(m^2 + n)

<details><summary>Answer</summary>

c) O(n + m) — O(m) to build LPS, O(n) amortized to scan.
</details>

**4. (Spot the bug) LPS builder:**

```js
let len = 0;
for (let i = 1; i < p.length; ) {
  if (p[i] === p[len]) lps[i++] = ++len;
  else if (len > 0) len = lps[len];
  else lps[i++] = 0;
}
```

<details><summary>Answer</summary>

The fallback must be `len = lps[len - 1]`. `lps[len]` refers to a prefix one character too long and can loop forever or give wrong values.
</details>

**5. (Spot the bug) Rolling hash step in JavaScript:**

```js
h = (h - text.charCodeAt(i) * high) % M;
h = (h * B + text.charCodeAt(i + m)) % M;
```

<details><summary>Answer</summary>

After the subtraction `h` can be negative (JS `%` keeps the sign). Add `if (h < 0) h += M;` before multiplying.
</details>

**6. (Multiple choice) A string `s` of length 12 has `lps[11] = 8`. Is it a repetition of a smaller block?**
a) yes, block length 4  b) yes, block length 8  c) no  d) cannot tell

<details><summary>Answer</summary>

a) Period `p = 12 - 8 = 4` and `12 % 4 === 0`, so yes, a block of length 4 repeated 3 times.
</details>

**7. (Define the state) In Manacher's algorithm, what do `center` and `right` represent?**

<details><summary>Answer</summary>

`center` is the center of the palindrome (in the `#`-transformed string) whose right edge reaches furthest; `right` is that right edge. Positions inside it reuse their mirror's radius.
</details>

**8. (Complexity) Longest duplicate substring with binary search on length + rolling hash costs?**

<details><summary>Answer</summary>

O(n log n) expected time: log n lengths, each checked in O(n) with a hash set. O(n) space.
</details>

**9. (Multiple choice) Why do we put a separator in `pattern + '#' + text` before computing Z?**
a) to speed things up  b) so no z value can exceed m  c) because Z needs odd length  d) to avoid negative hashes

<details><summary>Answer</summary>

b) Without a separator, a match could extend past the pattern into the text and give z values larger than m, or match across the boundary.
</details>

**10. (Predict the output) `kmpSearch("aaaaa", "aaa")` returns?**

<details><summary>Answer</summary>

`[0, 1, 2]` — KMP reports overlapping matches because after a full match it continues from `j = lps[m-1]`.
</details>

**11. (Complexity) Building a suffix array by prefix doubling with a comparison sort costs?**

<details><summary>Answer</summary>

O(n log^2 n): log n doubling rounds, each an O(n log n) sort. Kasai's LCP afterwards is O(n).
</details>

**12. (Multiple choice) Which problem is best solved by the Z-function directly?**
a) Sum of the LCP of s with each of its suffixes  b) Longest palindromic substring  c) Distinct echo substrings  d) Repeated string match

<details><summary>Answer</summary>

a) The answer is simply `sum(z)` with `z[0] = n` (Sum of Scores of Built Strings).
</details>

**13. (Spot the bug) Shortest palindrome:** `const t = s + reverse(s); k = lps(t).at(-1);`

<details><summary>Answer</summary>

Missing separator. For `s = "aa"`, `t = "aaaa"` and the border is 3, longer than `s`. Use `s + '#' + reverse(s)`.
</details>

## Mastery checklist

- [ ] I can build the LPS table by hand for a 7-character pattern and explain the fallback.
- [ ] I can code KMP search (with overlapping matches) from memory in under 10 minutes.
- [ ] I can code a rolling hash in JavaScript without negative-modulo or precision bugs.
- [ ] I can use the Z-function or LPS to answer border / period / prefix-suffix questions.
- [ ] I can explain when to reach for Manacher, binary search + hashing, or a suffix array.
