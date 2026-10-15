# Mini Lisp Evaluator

| | |
|---|---|
| **Topic** | Recursion |
| **Difficulty** | Hard |
| **Pattern** | mutual recursion + scope chain |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md), [recursion_patterns.js evaluateArithmetic](../../02_Implementations/recursion_patterns.js) |
| **Source** | Original exercise |
| **Solution file** | [14_mini_lisp_evaluator.js](../solutions/14_mini_lisp_evaluator.js) — open only after a real attempt |

## Problem

Evaluate a tiny Lisp-like language and return the integer result. An expression is:
  - an integer, possibly negative:            42, -7
  - a variable name (starts with a letter):    x, total1
  - (add e1 e2 ...)   sum of 1+ expressions
  - (mul e1 e2 ...)   product of 1+ expressions
  - (sub e1 e2)       e1 - e2
  - (if c t f)        evaluates t if c != 0, otherwise f (only ONE branch is evaluated)
  - (let v1 e1 v2 e2 ... body)
                      binds v1 = e1, then v2 = e2 (e2 may use v1), ..., then evaluates
                      body. Bindings are visible only inside this let (lexical scope);
                      an inner let can shadow an outer variable.
Using an unbound variable is an error (throw).

## Examples

```
"(add 1 2 3)"                               -> 6
"(let x 2 (mul x 5))"                       -> 10
"(let x 2 (add (let x 3 x) x))"             -> 5     inner x = 3 shadows, outer x = 2
"(let x 1 y (add x 2) (mul x y))"           -> 3     y sees x
"(if (sub 2 2) (undefinedVar) 7)"           -> 7     dead branch never evaluated
```

## Constraints & clarifying questions

```
- Input well-formed? (assume yes except for unbound variables) Whitespace: single or
  multiple spaces. Length up to 10^4, nesting depth up to ~500.
- Results fit in a safe integer.
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 45 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** A grammar with nested lists = *recursive descent*: one function per kind of thing (expression, list), calling each other (mutual recursion).

</details>

<details><summary>Hint 2</summary>

**Start simple.** Tokenize, build a nested-array tree, then evaluate recursively. For `let`, copy the environment object so shadowing cannot leak out.

</details>

<details><summary>Hint 3</summary>

**The key idea.** Avoid copying: keep ONE map from name to a stack of values. `let` pushes its bindings and pops them when it ends. To tell bindings from the body: a name NOT followed by `)` starts a binding.

</details>

<details><summary>Hint 4</summary>

**Edge cases.** `if` must not evaluate the dead branch (write a `skip()` that steps over a balanced expression). Negative numbers. A variable used after its `let` ended must throw.

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (tokens + copy the whole environment on every let)

```
  O(n * V) time where V = live variables, O(n * V) space
Tokenize, then recursively evaluate. Each let creates a fresh copy {...env} so that
shadowing cannot leak outwards. Copying is what makes it slow for many variables.
```

### APPROACH 2 — Optimal (recursive descent + shared scope with an undo log)

```
  O(n) time, O(n) space
Tokenize once. Parsing and evaluating happen in the same recursive pass over the token
array with one shared index. Variables live in ONE Map from name -> stack of values.
A let pushes each binding and remembers the names; when the let ends it pops them.
Lookup is O(1) (top of that name's stack) and no environment is ever copied.
The dead branch of an if must still be SKIPPED in the token stream: skip() walks over a
balanced sub-expression without evaluating it (so unbound names there are fine).
Mutual recursion: evaluate() calls evalList(), which calls evaluate() for each argument.

Dry run "(let x 2 (add (let x 3 x) x))":
  evaluate '(' -> evalList: op = let
    binding x = evaluate '2' = 2              scope: x -> [2]
    next token is '(' and is not followed by a value pair -> it is the body
    evaluate body (add ...):
      arg1 (let x 3 x): push x=3 -> x -> [2,3]; body x = 3; pop -> x -> [2]   => 3
      arg2 x = 2
      add = 5
    pop x -> scope empty, return 5

How do we tell a binding from the body inside let? After the let keyword, read pairs:
if the current token is a NAME and the token after it is not ')', it is a binding name.
Otherwise the current token starts the body.
```

### Complexity

| Approach | Time | Space |
|---|---|---|
| AST + copied environments | O(n * V) | O(n * V) |
| one-pass recursive descent + undo log | O(n) | O(n) |

### Edge cases

```
- negative literals "-7" (a token that starts with '-')
- shadowing and restoring after an inner let
- variable used outside its let -> throw ReferenceError
- if with an unevaluated branch containing an unbound variable
```

### Common mistakes

- Evaluating both branches of `if` (side effects / errors in the dead branch).
- Forgetting to pop let bindings, so a variable leaks out of its scope.
- Treating the body of `let x 1 x` as another binding (`x` followed by `)` is the body).
- Copying the environment in every call (quadratic).

Full JavaScript solution with tests: [14_mini_lisp_evaluator.js](../solutions/14_mini_lisp_evaluator.js). Run it with `node 14_mini_lisp_evaluator.js` from the solutions folder.

</details>

## Related follow-ups

- Parse Lisp Expression (LeetCode #736)
- Basic Calculator III (LeetCode #772)
- Mini Parser (LeetCode #385)
- Number of Atoms (LeetCode #726)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Write down the recursive PROMISE you used in one sentence. If you could not state it, re-solve.
- Re-solve from scratch in 3 days, then in 1 week.
