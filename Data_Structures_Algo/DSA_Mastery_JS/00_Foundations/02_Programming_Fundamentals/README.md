# Programming Fundamentals

The small building blocks every algorithm stands on, seen through a DSA lens: variables and types, loops and their boundaries (where most off-by-one bugs live), functions and pass-by-sharing, references vs values, shallow vs deep copies (spread, `structuredClone`, and the limits of the JSON trick), mutation and aliasing bugs, equality (`===`, `==`, `Object.is`, `NaN`, `-0`, comparing arrays and objects), closures for memoization, and the iteration protocol. The exercises are original and each one targets a bug that regularly costs candidates an interview.

**Prerequisites:** [JavaScript for DSA](../01_JavaScript_For_DSA/README.md). Helpful: [Mathematics for DSA](../04_Mathematics_For_DSA/README.md) (floor division and modulo).

**Next / see also:** [Recursion Fundamentals](../03_Recursion_Fundamentals/README.md), [Time Complexity](../../01_Complexity_Analysis/01_Time_Complexity/README.md)

## How to study this topic

1. Read [01_Concepts/CONCEPTS.md](01_Concepts/CONCEPTS.md) top to bottom (intuition, how it works, complexity, patterns, mistakes, interview tips).
2. Open each file in [02_Implementations](02_Implementations) and run it: `node 02_Implementations/<file>.js`. Then close it and re-implement from memory.
3. Solve the problems in order: Easy, then Medium, then Hard. Each problem page has the statement and staged hints; the solution lives in a separate file.
4. Take the quiz in [04_Interview_And_Assessment](04_Interview_And_Assessment) and tick the boxes in `PROGRESS.md` only when you meet the mastery criteria.
5. Run this topic's tests: `node --test tests/programming_fundamentals.test.js` (from this folder), or `npm run test:topic 00_Foundations` from the curriculum root to run the whole parent topic.

## Contents

| Section | What is inside |
|---|---|
| [01_Concepts](01_Concepts/CONCEPTS.md) | values vs references, copying (shallow, deep, JSON, structuredClone), equality semantics, loop boundaries, closures, iteration protocols, common mistakes, interview talk track |
| [02_Implementations](02_Implementations) | `copy_and_equality.js`, `loops_and_iteration.js` |
| [03_Problems](03_Problems) | 9 problems with hints; solutions in `03_Problems/solutions` |
| [04_Interview_And_Assessment](04_Interview_And_Assessment) | [interview questions](04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md) and a [self-assessment quiz](04_Interview_And_Assessment/QUIZ.md) |
| [tests](tests) | node:test suites for the implementations and selected solutions |

## Problems

| # | Problem | Difficulty | Pattern | Statement | Solution |
|---|---|---|---|---|---|
| 01 | Count FizzBuzz in a Range | Easy | inclusive bounds + inclusion–exclusion | [statement](03_Problems/01_Easy/01_fizzbuzz_range_count.md) | [solution](03_Problems/solutions/01_fizzbuzz_range_count.js) |
| 02 | Frequency Map | Easy | Map counting, SameValueZero | [statement](03_Problems/01_Easy/02_frequency_map.md) | [solution](03_Problems/solutions/02_frequency_map.js) |
| 03 | Chunk an Array | Easy | step loop, half-open slices | [statement](03_Problems/01_Easy/03_chunk_array.md) | [solution](03_Problems/solutions/03_chunk_array.js) |
| 04 | Rotate in Place | Medium | in-place mutation, triple reverse | [statement](03_Problems/02_Medium/04_rotate_in_place.md) | [solution](03_Problems/solutions/04_rotate_in_place.js) |
| 05 | Flatten to Depth | Medium | recursion vs explicit stack | [statement](03_Problems/02_Medium/05_flatten_depth.md) | [solution](03_Problems/solutions/05_flatten_depth.js) |
| 06 | Deep Equal | Medium | parallel structural recursion | [statement](03_Problems/02_Medium/06_deep_equal.md) | [solution](03_Problems/solutions/06_deep_equal.js) |
| 07 | Memoize with a Closure | Medium | closure cache, memoization | [statement](03_Problems/02_Medium/07_memoize_closure.md) | [solution](03_Problems/solutions/07_memoize_closure.js) |
| 08 | Lazy Range Iterable | Medium | iteration protocol, half-open ranges | [statement](03_Problems/02_Medium/08_range_iterable.md) | [solution](03_Problems/solutions/08_range_iterable.js) |
| 09 | Deep Clone with Cycles | Hard | recursive copy + WeakMap of visited | [statement](03_Problems/03_Hard/09_deep_clone.md) | [solution](03_Problems/solutions/09_deep_clone.js) |
