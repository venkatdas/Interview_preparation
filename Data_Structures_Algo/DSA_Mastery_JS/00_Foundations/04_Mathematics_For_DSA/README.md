# Mathematics for DSA

**Prerequisites:** [Foundations/01 JavaScript For DSA](../01_JavaScript_For_DSA/README.md)

## How to study this topic

1. Read [01_Concepts/CONCEPTS.md](01_Concepts/CONCEPTS.md) top to bottom (intuition, how it works, complexity, patterns, mistakes, interview tips).
2. Open each file in [02_Implementations](02_Implementations) and run it: `node 02_Implementations/<file>.js`. Then close it and re-implement from memory.
3. Solve the problems in order: Easy, then Medium, then Hard. Each problem page has the statement and staged hints; the solution lives in a separate file.
4. Take the [quiz](04_Interview_And_Assessment/QUIZ.md) and practise the [interview questions](04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md) in [04_Interview_And_Assessment](04_Interview_And_Assessment), and tick the boxes in `PROGRESS.md` only when you meet the mastery criteria.
5. Run this topic's tests: `npm run test:topic 00_Foundations` (from the curriculum root).

**Self-check:** [Quiz](04_Interview_And_Assessment/QUIZ.md) (with a mastery checklist) · [Interview questions](04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md) (with model answers) · [Tests](tests)

## Contents

| Section | What is inside |
|---|---|
| [01_Concepts](01_Concepts) | theory, visual explanations, operations and complexity, patterns, common mistakes, interview tips |
| [02_Implementations](02_Implementations) | `math_utils.js` |
| [03_Problems](03_Problems) | 9 problems with hints; solutions in `03_Problems/solutions` |
| [04_Interview_And_Assessment](04_Interview_And_Assessment) | interview questions and a self-assessment quiz |
| [tests](tests) | node:test suites for the implementations |

## Problems

| # | Problem | Difficulty | Pattern | Statement | Solution |
|---|---|---|---|---|---|
| 01 | Palindrome Number | Easy | digit reversal | [statement](03_Problems/01_Easy/01_palindrome_number.md) | [solution](03_Problems/solutions/01_palindrome_number.js) |
| 02 | Reverse Integer | Medium | digit reversal + overflow | [statement](03_Problems/02_Medium/02_reverse_integer.md) | [solution](03_Problems/solutions/02_reverse_integer.js) |
| 03 | Excel Sheet Column Number & Column Title | Easy | base conversion (bijective base 26) | [statement](03_Problems/01_Easy/03_excel_sheet_column_number.md) | [solution](03_Problems/solutions/03_excel_sheet_column_number.js) |
| 04 | Add Digits | Easy | digital root formula | [statement](03_Problems/01_Easy/04_add_digits.md) | [solution](03_Problems/solutions/04_add_digits.js) |
| 05 | Happy Number | Easy | Floyd cycle detection | [statement](03_Problems/01_Easy/05_happy_number.md) | [solution](03_Problems/solutions/05_happy_number.js) |
| 06 | Pow | Medium | fast exponentiation | [statement](03_Problems/02_Medium/06_pow_x_n.md) | [solution](03_Problems/solutions/06_pow_x_n.js) |
| 07 | Sqrt | Easy | binary search on the answer | [statement](03_Problems/01_Easy/07_sqrt_x.md) | [solution](03_Problems/solutions/07_sqrt_x.js) |
| 08 | Count Primes | Medium | Sieve of Eratosthenes | [statement](03_Problems/02_Medium/08_count_primes.md) | [solution](03_Problems/solutions/08_count_primes.js) |
| 09 | Factorial Trailing Zeroes | Medium | counting factors of 5 | [statement](03_Problems/02_Medium/09_factorial_trailing_zeroes.md) | [solution](03_Problems/solutions/09_factorial_trailing_zeroes.js) |

