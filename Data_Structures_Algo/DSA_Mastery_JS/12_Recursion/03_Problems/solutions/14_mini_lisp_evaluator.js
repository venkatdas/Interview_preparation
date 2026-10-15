/**
 * 14. Mini Lisp Evaluator   (Original — Hard)
 *
 * PROBLEM
 * Evaluate a tiny Lisp-like language and return the integer result. An expression is:
 *   - an integer, possibly negative:            42, -7
 *   - a variable name (starts with a letter):    x, total1
 *   - (add e1 e2 ...)   sum of 1+ expressions
 *   - (mul e1 e2 ...)   product of 1+ expressions
 *   - (sub e1 e2)       e1 - e2
 *   - (if c t f)        evaluates t if c != 0, otherwise f (only ONE branch is evaluated)
 *   - (let v1 e1 v2 e2 ... body)
 *                       binds v1 = e1, then v2 = e2 (e2 may use v1), ..., then evaluates
 *                       body. Bindings are visible only inside this let (lexical scope);
 *                       an inner let can shadow an outer variable.
 * Using an unbound variable is an error (throw).
 *
 * EXAMPLES
 * "(add 1 2 3)"                               -> 6
 * "(let x 2 (mul x 5))"                       -> 10
 * "(let x 2 (add (let x 3 x) x))"             -> 5     inner x = 3 shadows, outer x = 2
 * "(let x 1 y (add x 2) (mul x y))"           -> 3     y sees x
 * "(if (sub 2 2) (undefinedVar) 7)"           -> 7     dead branch never evaluated
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Input well-formed? (assume yes except for unbound variables) Whitespace: single or
 *   multiple spaces. Length up to 10^4, nesting depth up to ~500.
 * - Results fit in a safe integer.
 *
 * APPROACH 1 — Brute force (tokens + copy the whole environment on every let)
 *   O(n * V) time where V = live variables, O(n * V) space
 * Tokenize, then recursively evaluate. Each let creates a fresh copy {...env} so that
 * shadowing cannot leak outwards. Copying is what makes it slow for many variables.
 *
 * APPROACH 2 — Optimal (recursive descent + shared scope with an undo log)
 *   O(n) time, O(n) space
 * Tokenize once. Parsing and evaluating happen in the same recursive pass over the token
 * array with one shared index. Variables live in ONE Map from name -> stack of values.
 * A let pushes each binding and remembers the names; when the let ends it pops them.
 * Lookup is O(1) (top of that name's stack) and no environment is ever copied.
 * The dead branch of an if must still be SKIPPED in the token stream: skip() walks over a
 * balanced sub-expression without evaluating it (so unbound names there are fine).
 * Mutual recursion: evaluate() calls evalList(), which calls evaluate() for each argument.
 *
 * Dry run "(let x 2 (add (let x 3 x) x))":
 *   evaluate '(' -> evalList: op = let
 *     binding x = evaluate '2' = 2              scope: x -> [2]
 *     next token is '(' and is not followed by a value pair -> it is the body
 *     evaluate body (add ...):
 *       arg1 (let x 3 x): push x=3 -> x -> [2,3]; body x = 3; pop -> x -> [2]   => 3
 *       arg2 x = 2
 *       add = 5
 *     pop x -> scope empty, return 5
 *
 * How do we tell a binding from the body inside let? After the let keyword, read pairs:
 * if the current token is a NAME and the token after it is not ')', it is a binding name.
 * Otherwise the current token starts the body.
 *
 * EDGE CASES
 * - negative literals "-7" (a token that starts with '-')
 * - shadowing and restoring after an inner let
 * - variable used outside its let -> throw ReferenceError
 * - if with an unevaluated branch containing an unbound variable
 */

function tokenize(s) {
  return s.replace(/\(/g, ' ( ').replace(/\)/g, ' ) ').trim().split(/\s+/).filter(Boolean);
}
const isNumber = (t) => /^-?\d+$/.test(t);
const isName = (t) => /^[a-zA-Z][a-zA-Z0-9]*$/.test(t);

// ---------- brute force: build an AST, evaluate with copied environments ----------
function bruteForce(src) {
  const tokens = tokenize(src);
  let i = 0;
  function parse() {
    const t = tokens[i++];
    if (t !== '(') return t;
    const list = [];
    while (tokens[i] !== ')') list.push(parse());
    i++;
    return list;
  }
  function evalNode(node, env) {
    if (typeof node === 'string') {
      if (isNumber(node)) return Number(node);
      if (!(node in env)) throw new ReferenceError(`unbound variable ${node}`);
      return env[node];
    }
    const [op, ...args] = node;
    if (op === 'add') return args.reduce((s, a) => s + evalNode(a, env), 0);
    if (op === 'mul') return args.reduce((p, a) => p * evalNode(a, env), 1);
    if (op === 'sub') return evalNode(args[0], env) - evalNode(args[1], env);
    if (op === 'if') return evalNode(args[0], env) !== 0 ? evalNode(args[1], env) : evalNode(args[2], env);
    if (op === 'let') {
      const scope = { ...env };              // the expensive copy
      for (let k = 0; k + 1 < args.length; k += 2) scope[args[k]] = evalNode(args[k + 1], scope);
      return evalNode(args[args.length - 1], scope);
    }
    throw new SyntaxError(`unknown operator ${op}`);
  }
  return evalNode(parse(), Object.create(null));
}

// ---------- optimal: one recursive pass, shared scope with undo ----------
function optimal(src) {
  const tokens = tokenize(src);
  const scope = new Map();                   // name -> stack of values
  let i = 0;

  function lookup(name) {
    const stack = scope.get(name);
    if (!stack || stack.length === 0) throw new ReferenceError(`unbound variable ${name}`);
    return stack[stack.length - 1];
  }
  function skip() {                          // step over one expression without evaluating
    if (tokens[i++] !== '(') return;
    let depth = 1;
    while (depth > 0) {
      const t = tokens[i++];
      if (t === '(') depth++; else if (t === ')') depth--;
    }
  }
  function evaluate() {
    const t = tokens[i];
    if (t === '(') { i++; return evalList(); }
    i++;
    return isNumber(t) ? Number(t) : lookup(t);
  }
  function evalList() {                      // called just after '('; consumes the ')'
    const op = tokens[i++];
    let result;
    if (op === 'add' || op === 'mul') {
      result = op === 'add' ? 0 : 1;
      while (tokens[i] !== ')') result = op === 'add' ? result + evaluate() : result * evaluate();
    } else if (op === 'sub') {
      const a = evaluate();
      result = a - evaluate();
    } else if (op === 'if') {
      if (evaluate() !== 0) { result = evaluate(); skip(); }
      else { skip(); result = evaluate(); }
    } else if (op === 'let') {
      const bound = [];
      while (isName(tokens[i]) && tokens[i + 1] !== ')') {
        const name = tokens[i++];
        const value = evaluate();            // may read earlier bindings of this let
        if (!scope.has(name)) scope.set(name, []);
        scope.get(name).push(value);
        bound.push(name);
      }
      result = evaluate();                   // body
      for (const name of bound) scope.get(name).pop();   // undo: restore outer scope
    } else {
      throw new SyntaxError(`unknown operator ${op}`);
    }
    i++;                                     // consume ')'
    return result;
  }

  const value = evaluate();
  if (i !== tokens.length) throw new SyntaxError('trailing tokens');
  return value;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve('(add 1 2 3)'), 6);
  assert.strictEqual(solve('(let x 2 (mul x 5))'), 10);
  assert.strictEqual(solve('(let x 2 (add (let x 3 x) x))'), 5);
  assert.strictEqual(solve('(let x 1 y (add x 2) (mul x y))'), 3);
  assert.strictEqual(solve('(if (sub 2 2) (undefinedVar) 7)'), 7);
  assert.strictEqual(solve('-7'), -7);
  assert.strictEqual(solve('(let a 5 (let b (sub a 8) (mul a b)))'), -15);
  assert.throws(() => solve('(add (let z 1 z) z)'), ReferenceError);
}
// deep nesting: 400 levels of (add 1 ...)
const deep = '(add 1 '.repeat(400) + '0' + ')'.repeat(400);
assert.strictEqual(optimal(deep), 400);

// randomized: generator knows the true value, both solvers must agree with it
let seed = 2024;
const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
const pick = (arr) => arr[Math.floor(rnd() * arr.length)];
function gen(depth, env) {
  const names = Object.keys(env);
  if (depth === 0 || rnd() < 0.25) {
    if (names.length && rnd() < 0.5) { const v = pick(names); return [v, env[v]]; }
    const n = Math.floor(rnd() * 19) - 9;
    return [String(n), n];
  }
  const kind = pick(['add', 'mul', 'sub', 'if', 'let']);
  if (kind === 'add' || kind === 'mul') {
    const k = kind === 'mul' ? 2 : 1 + Math.floor(rnd() * 3);
    const parts = Array.from({ length: k }, () => gen(depth - 1, env));
    const val = parts.reduce((acc, p) => (kind === 'add' ? acc + p[1] : acc * p[1]), kind === 'add' ? 0 : 1);
    return [`(${kind} ${parts.map((p) => p[0]).join(' ')})`, val];
  }
  if (kind === 'sub') {
    const a = gen(depth - 1, env), b = gen(depth - 1, env);
    return [`(sub ${a[0]} ${b[0]})`, a[1] - b[1]];
  }
  if (kind === 'if') {
    const c = gen(depth - 1, env), t = gen(depth - 1, env), f = gen(depth - 1, env);
    return [`(if ${c[0]} ${t[0]} ${f[0]})`, c[1] !== 0 ? t[1] : f[1]];
  }
  const local = { ...env };
  let text = '(let';
  const count = 1 + Math.floor(rnd() * 2);
  for (let k = 0; k < count; k++) {
    const name = pick(['x', 'y', 'z']);
    const [et, ev] = gen(depth - 1, local);
    local[name] = ev;
    text += ` ${name} ${et}`;
  }
  const [bt, bv] = gen(depth - 1, local);
  return [`${text} ${bt})`, bv];
}
for (let t = 0; t < 300; t++) {
  const [text, value] = gen(4, {});
  assert.strictEqual(optimal(text), value, text);
  assert.strictEqual(bruteForce(text), value, text);
}
console.log('✓ 14_mini_lisp_evaluator passed');

module.exports = { optimal, bruteForce, tokenize };
