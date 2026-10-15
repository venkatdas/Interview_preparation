# Strings — Interview Questions

Conceptual questions about strings in JavaScript. Answer out loud, then compare with the model answer. Theory: [CONCEPTS.md](../01_Concepts/CONCEPTS.md).

### 1. What does "strings are immutable" mean in JavaScript, and why does it matter for complexity?

<details><summary>Model answer</summary>

You cannot change a character in place: `s[0] = 'x'` silently does nothing. Every "change" (`slice`, `replace`, `+`) builds a new string. So an algorithm that edits a string character by character should convert it to an array (`[...s]`), edit the array, and `join` once at the end. It also means "O(1) extra space" is not really possible when the input is a string; the in-place versions of problems give you a character array.

</details>

### 2. Why can `s += c` inside a loop be slow, and what is the safe pattern?

<details><summary>Model answer</summary>

In theory each `+=` copies the whole string, so n appends cost O(n²). V8 often optimises this with ropes, but you cannot rely on it in an interview argument. The predictable pattern is to push pieces into an array and call `join('')` once: O(total length).

</details>

### 3. When would you use a 26-slot array instead of a `Map` for counting characters?

<details><summary>Model answer</summary>

When the alphabet is known and small (lowercase English letters). Index with `ch.charCodeAt(0) - 97`. It is faster, uses constant space, and the counts can be joined into a key for grouping. Use a `Map` when the characters are unknown, mixed case, digits or Unicode.

</details>

### 4. How do you check if two strings are anagrams, and what is the complexity of each approach?

<details><summary>Model answer</summary>

(1) Sort both and compare: O(n log n). (2) Count characters of the first, decrement with the second, check nothing goes negative (after checking equal lengths): O(n) time, O(1) space for a fixed alphabet or O(k) with a `Map`. Always check lengths first.

</details>

### 5. Explain "expand around center" for palindromes. Why are there 2n − 1 centers?

<details><summary>Model answer</summary>

Every palindrome has a center. Odd-length palindromes center on a character (n choices); even-length ones center between two characters (n − 1 choices). From each center expand outward while the characters match. Each expansion is O(n), giving O(n²) total with O(1) space, which beats checking all O(n²) substrings in O(n) each.

</details>

### 6. What is the problem with indexing `s[i]` on text containing emoji?

<details><summary>Model answer</summary>

JS strings are UTF-16. Characters outside the Basic Multilingual Plane (most emoji) take two code units, so `s.length` counts them as 2 and `s[i]` can return half a character. `[...s]` and `for...of` iterate by code point, which keeps them whole. Ask whether input is ASCII before assuming one index per character.

</details>

### 7. How would you group a list of words by anagram? What key do you use?

<details><summary>Model answer</summary>

Use a `Map` from a canonical key to a list. The key can be the sorted word (O(L log L) per word) or the 26 letter counts joined with a separator (O(L) per word). Do not use an array as a key directly: `Map` compares arrays by reference.

</details>

### 8. How do you design an encoding for a list of strings that can contain any character?

<details><summary>Model answer</summary>

Length-prefix each string: write `length + '#' + string`. To decode, read digits up to `#`, parse the length, then take exactly that many characters. A plain delimiter fails because the delimiter can appear inside the strings; escaping works too but is harder to get right.

</details>

### 9. Walk through the edge cases for implementing `atoi` (String to Integer).

<details><summary>Model answer</summary>

Skip leading spaces only; read at most one sign; read digits until a non-digit; return 0 if no digits; clamp to [−2³¹, 2³¹ − 1]. Clamp while accumulating, because very long digit strings lose precision as a double. Avoid returning `-0`. Do not use `parseInt` if the interviewer wants the state machine.

</details>

### 10. How do you multiply two numbers given as strings without converting them to numbers?

<details><summary>Model answer</summary>

Grade-school multiplication into an array of length m + n. Digit `i` of the first and digit `j` of the second contribute `a[i] * b[j]` to position `i + j + 1` with carry into `i + j`. Process from the right, then strip leading zeros (return "0" if everything is zero). O(m·n) time.

</details>

### 11. Substring vs subsequence: why does the difference matter for choosing an algorithm?

<details><summary>Model answer</summary>

A substring is contiguous, so sliding windows, two pointers and center expansion work. A subsequence can skip characters, so the choices multiply and you usually need DP (Longest Common Subsequence, Edit Distance) or a greedy pointer scan (Is Subsequence).

</details>

### 12. How do you compare strings in JavaScript and what does `localeCompare` add?

<details><summary>Model answer</summary>

`<`, `>` and `===` compare UTF-16 code units, so `'B' < 'a'` is true (uppercase codes are smaller). `localeCompare` compares according to language rules (accents, case), which is what you want for user-facing sorting but slower and usually unnecessary in algorithm problems.

</details>
