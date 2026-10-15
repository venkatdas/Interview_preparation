# Bitwise Fundamentals

A short foundation topic on how integers look in binary and how JavaScript's bitwise operators really behave: base conversions, two's complement, the ToInt32 / ToUint32 conversion every bitwise operator applies (so values above 2^31 wrap), `>>` vs `>>>`, masks for single bits and bit fields, and BigInt for anything wider than 32 bits. The problem-solving patterns (XOR tricks, Kernighan, subset masks, Gray code) live in the main Bit Manipulation topic; do this first.

**Prerequisites:** [JavaScript for DSA](../01_JavaScript_For_DSA/README.md) (section 5, bitwise cheat sheet), [Mathematics for DSA](../04_Mathematics_For_DSA/README.md), [Programming Fundamentals](../02_Programming_Fundamentals/README.md).

**Next / see also:** [Bit Manipulation](../../14_Bit_Manipulation/README.md) for the interview patterns.

## How to study this topic

1. Read [01_Concepts/CONCEPTS.md](01_Concepts/CONCEPTS.md) top to bottom (intuition, how it works, complexity, patterns, mistakes, interview tips).
2. Open each file in [02_Implementations](02_Implementations) and run it: `node 02_Implementations/<file>.js`. Then close it and re-implement from memory.
3. Solve the problems in order: Easy, then Medium, then Hard. Each problem page has the statement and staged hints; the solution lives in a separate file.
4. Take the quiz in [04_Interview_And_Assessment](04_Interview_And_Assessment) and tick the boxes in `PROGRESS.md` only when you meet the mastery criteria.
5. Run this topic's tests: `node --test tests/bitwise_fundamentals.test.js` (from this folder), or `npm run test:topic 00_Foundations` from the curriculum root to run the whole parent topic.

## Contents

| Section | What is inside |
|---|---|
| [01_Concepts](01_Concepts/CONCEPTS.md) | binary and hex, two's complement, the 32-bit conversion, `>>` vs `>>>`, masks and bit fields, BigInt bitwise, mistakes and interview talk track |
| [02_Implementations](02_Implementations) | `bits.js` |
| [03_Problems](03_Problems) | 6 problems with hints; solutions in `03_Problems/solutions` |
| [04_Interview_And_Assessment](04_Interview_And_Assessment) | [interview questions](04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md) and a [self-assessment quiz](04_Interview_And_Assessment/QUIZ.md) |
| [tests](tests) | node:test suites for the implementations and selected solutions |

## Problems

| # | Problem | Difficulty | Pattern | Statement | Solution |
|---|---|---|---|---|---|
| 01 | Two's Complement at Any Width | Easy | binary representation | [statement](03_Problems/01_Easy/01_twos_complement_width.md) | [solution](03_Problems/solutions/01_twos_complement_width.js) |
| 02 | Simulate ToInt32 and ToUint32 | Easy | modular arithmetic, 32-bit conversion | [statement](03_Problems/01_Easy/02_simulate_toint32.md) | [solution](03_Problems/solutions/02_simulate_toint32.js) |
| 03 | Binary ↔ Hex by Nibbles | Easy | base conversion by grouping | [statement](03_Problems/01_Easy/03_binary_hex_nibbles.md) | [solution](03_Problems/solutions/03_binary_hex_nibbles.js) |
| 04 | Permission Flags with Masks | Medium | bitmask as a set | [statement](03_Problems/02_Medium/04_permission_flags.md) | [solution](03_Problems/solutions/04_permission_flags.js) |
| 05 | Divide by Powers of Two with Shifts | Medium | `>>` vs `>>>`, rounding | [statement](03_Problems/02_Medium/05_shift_division.md) | [solution](03_Problems/solutions/05_shift_division.js) |
| 06 | Bit Fields in 64-bit BigInts | Medium | BigInt shifts and masks | [statement](03_Problems/02_Medium/06_bigint_bit_fields.md) | [solution](03_Problems/solutions/06_bigint_bit_fields.js) |
