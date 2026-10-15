# Combinatorics

Combinatorics is the math of **counting without listing**. Instead of generating every path, string or
tree and counting them one by one (exponential), you find a formula or a small DP that gives the count
directly. Interviews use it in "how many ways" questions (grid paths, BST shapes, sorted strings,
arrangements of letters), and competitive programming adds a twist: the answer is huge, so you return it
modulo 1e9+7 and need factorial tables, modular inverses and, in JavaScript, exact multiplication that
does not fall into the 2^53 trap. The basics (what nCr is, Pascal's row, small factorials) are already in
[Mathematics for DSA](../00_Foundations/04_Mathematics_For_DSA/README.md); this topic goes deeper.

**Prerequisites:** [Mathematics for DSA](../00_Foundations/04_Mathematics_For_DSA/README.md), [Number Theory](../36_Number_Theory/README.md) (modular inverse), [Backtracking](../13_Backtracking/README.md) (the brute force you are replacing), [Dynamic Programming overview](../29_Dynamic_Programming/01_Concepts/OVERVIEW.md) (counting DP)

## Essential vs Advanced

| Level | What it covers | Who needs it |
|---|---|---|
| **Essential** | counting principles, permutations/combinations (with and without repetition), Pascal's triangle, multiplicative nCr with BigInt, stars and bars, Catalan numbers, next / k-th permutation, counting with DP | everyone preparing for top-tier interviews |
| **Advanced — competitive programming** | nCr mod p with factorial + inverse-factorial tables, inclusion–exclusion over bitmasks, derangements mod p, multinomials mod p, closed forms for playlist-style counts | contests, online assessments with "return modulo 1e9+7" |

Every heading in [CONCEPTS.md](01_Concepts/CONCEPTS.md) is tagged **[Essential]** or **[Advanced — competitive programming]**.

## How to study this topic

1. Read [01_Concepts/CONCEPTS.md](01_Concepts/CONCEPTS.md) top to bottom (intuition, how it works, complexity, patterns, mistakes, interview tips). Do the Essential sections first; come back for the Advanced ones.
2. Open [02_Implementations/combinatorics.js](02_Implementations/combinatorics.js) and run it: `node 02_Implementations/combinatorics.js`. Then close it and re-implement `nCrExact`, `ModCombinatorics` and `kthPermutation` from memory.
3. Solve the problems in order: Easy, then Medium, then Hard. Each problem page has the statement and staged hints; the solution lives in a separate file.
4. Take the quiz and interview questions in [04_Interview_And_Assessment](04_Interview_And_Assessment) and tick the Mastery checklist only when it is honestly true.
5. Run this topic's tests: `npm run test:topic 37_Combinatorics` (from the curriculum root), or just the suite: `node --test 37_Combinatorics/tests/combinatorics.test.js`.

## Contents

| Section | What is inside |
|---|---|
| [01_Concepts](01_Concepts/CONCEPTS.md) | the 16-step teaching guide: counting principles to inclusion–exclusion, with Essential/Advanced labels |
| [02_Implementations](02_Implementations/combinatorics.js) | `combinatorics.js`: exact BigInt counts, safe `mulMod`, `ModCombinatorics` tables, Catalan, derangements, stars and bars, inclusion–exclusion, next / k-th permutation |
| [03_Problems](03_Problems) | 9 problems with staged hints; solutions in `03_Problems/solutions` |
| [04_Interview_And_Assessment](04_Interview_And_Assessment) | [interview questions](04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md) and a [self-assessment quiz](04_Interview_And_Assessment/QUIZ.md) |
| [tests](tests/combinatorics.test.js) | node:test suite for the implementation and selected solutions |

## Problems

| # | Problem | Difficulty | Pattern | Statement | Solution |
|---|---|---|---|---|---|
| 01 | Pascal's Triangle | Easy | Pascal's rule C(r,c)=C(r-1,c-1)+C(r-1,c) | [statement](03_Problems/01_Easy/01_pascals_triangle.md) | [solution](03_Problems/solutions/01_pascals_triangle.js) |
| 02 | Unique Paths | Medium | binomial coefficient C(m+n-2, m-1) | [statement](03_Problems/02_Medium/02_unique_paths.md) | [solution](03_Problems/solutions/02_unique_paths.js) |
| 03 | Count Sorted Vowel Strings | Medium | stars and bars | [statement](03_Problems/02_Medium/03_count_sorted_vowel_strings.md) | [solution](03_Problems/solutions/03_count_sorted_vowel_strings.js) |
| 04 | Unique Binary Search Trees | Medium | Catalan numbers | [statement](03_Problems/02_Medium/04_unique_binary_search_trees.md) | [solution](03_Problems/solutions/04_unique_binary_search_trees.js) |
| 05 | Distribute Candies Among Children II | Medium | stars and bars + inclusion–exclusion | [statement](03_Problems/02_Medium/05_distribute_candies_among_children_ii.md) | [solution](03_Problems/solutions/05_distribute_candies_among_children_ii.js) |
| 06 | Derangements Count | Medium | derangement recurrence / inclusion–exclusion | [statement](03_Problems/02_Medium/06_derangements_count.md) | [solution](03_Problems/solutions/06_derangements_count.js) |
| 07 | Permutation Sequence | Hard | factorial number system (k-th permutation) | [statement](03_Problems/03_Hard/07_permutation_sequence.md) | [solution](03_Problems/solutions/07_permutation_sequence.js) |
| 08 | Count Anagrams | Hard | multinomial mod p with factorial + inverse factorial tables | [statement](03_Problems/03_Hard/08_count_anagrams.md) | [solution](03_Problems/solutions/08_count_anagrams.js) |
| 09 | Number of Music Playlists | Hard | counting DP (new vs reused item) | [statement](03_Problems/03_Hard/09_number_of_music_playlists.md) | [solution](03_Problems/solutions/09_number_of_music_playlists.js) |
