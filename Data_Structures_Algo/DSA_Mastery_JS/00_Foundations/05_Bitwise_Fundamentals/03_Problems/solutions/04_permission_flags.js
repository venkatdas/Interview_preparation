/**
 * 04. Permission Flags with Masks   (Original — Medium)
 *
 * PROBLEM
 * A system has these permissions, in this bit order:
 *   READ=bit 0, WRITE=bit 1, DELETE=bit 2, SHARE=bit 3, ADMIN=bit 4
 * Implement a Permissions object over a single integer with operations:
 *   grant(name), revoke(name), toggle(name), has(name), hasAll(names), hasAny(names),
 *   list() -> names in bit order, and value() -> the integer.
 * Then process a list of operations and return the outputs of every query
 * (has/hasAll/hasAny/list/value), in order.
 *
 * EXAMPLES
 * ops: grant READ, grant WRITE, value, has DELETE, toggle READ, list, hasAny [READ, WRITE]
 * outputs: 3, false, ["WRITE"], true
 * ops: grant ADMIN, hasAll [ADMIN], revoke ADMIN, revoke ADMIN, value
 * outputs: true, 0                    (revoking twice is harmless)
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Up to 1e5 operations.
 * - Unknown permission name? (throw)
 * - hasAll([]) -> true, hasAny([]) -> false (vacuous truth)
 *
 * APPROACH 1 — Brute force (a Set of names)   O(k) per hasAll/hasAny, O(F log F) per list
 * Store granted names in a Set; list() sorts by bit order; value() sums 2^bit.
 * Readable and fine; the mask version is what low-level code (and React's lanes) do.
 *
 * APPROACH 2 — Optimal (one integer bitmask)   O(1) per grant/revoke/toggle/has, O(k) to build a query mask
 * bit(name) = 1 << index
 *   grant:  mask |= bit       revoke: mask &= ~bit      toggle: mask ^= bit
 *   has:    (mask & bit) !== 0
 *   hasAll: (mask & q) === q  where q = OR of the query bits
 *   hasAny: (mask & q) !== 0
 *   list:   walk bits 0..4 and keep the set ones
 *
 * Dry run: grant READ (00001), grant WRITE (00011) value 3; has DELETE -> 00011 & 00100 = 0 -> false;
 *   toggle READ -> 00010; list -> ["WRITE"]; hasAny [READ,WRITE]: q = 00011, 00010 & 00011 = 00010 != 0 -> true
 *
 * EDGE CASES
 * - revoke a permission not granted -> no change (& ~bit is idempotent)
 * - grant twice -> no change (| is idempotent)
 * - empty query lists
 *
 * COMMON MISTAKES
 * - mask & bit === bit without parentheses (=== binds tighter than &).
 * - Revoking with mask ^= bit (toggles it back ON if it was off).
 * - hasAll written as (mask & q) !== 0 (that is hasAny).
 */

const NAMES = ['READ', 'WRITE', 'DELETE', 'SHARE', 'ADMIN'];
const indexOf = name => {
  const i = NAMES.indexOf(name);
  if (i < 0) throw new RangeError('unknown permission ' + name);
  return i;
};

class SetPermissions {
  constructor() { this.s = new Set(); }
  grant(n) { indexOf(n); this.s.add(n); }
  revoke(n) { indexOf(n); this.s.delete(n); }
  toggle(n) { indexOf(n); if (this.s.has(n)) this.s.delete(n); else this.s.add(n); }
  has(n) { indexOf(n); return this.s.has(n); }
  hasAll(ns) { return ns.every(n => this.has(n)); }
  hasAny(ns) { return ns.some(n => this.has(n)); }
  list() { return [...this.s].sort((a, b) => indexOf(a) - indexOf(b)); }
  value() { let v = 0; for (const n of this.s) v += 2 ** indexOf(n); return v; }
}

class MaskPermissions {
  constructor() { this.mask = 0; }
  static bit(n) { return 1 << indexOf(n); }
  static query(ns) { return ns.reduce((q, n) => q | MaskPermissions.bit(n), 0); }
  grant(n) { this.mask |= MaskPermissions.bit(n); }
  revoke(n) { this.mask &= ~MaskPermissions.bit(n); }
  toggle(n) { this.mask ^= MaskPermissions.bit(n); }
  has(n) { return (this.mask & MaskPermissions.bit(n)) !== 0; }
  hasAll(ns) { const q = MaskPermissions.query(ns); return (this.mask & q) === q; }
  hasAny(ns) { return (this.mask & MaskPermissions.query(ns)) !== 0; }
  list() { return NAMES.filter((_, i) => (this.mask >> i) & 1); }
  value() { return this.mask; }
}

function run(Impl, ops) {
  const p = new Impl();
  const out = [];
  for (const [op, arg] of ops) {
    const r = p[op](arg);
    if (r !== undefined) out.push(r);
  }
  return out;
}
const bruteForce = ops => run(SetPermissions, ops);
const optimal = ops => run(MaskPermissions, ops);

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve([['grant', 'READ'], ['grant', 'WRITE'], ['value'], ['has', 'DELETE'], ['toggle', 'READ'], ['list'], ['hasAny', ['READ', 'WRITE']]]), [3, false, ['WRITE'], true]);
  assert.deepStrictEqual(solve([['grant', 'ADMIN'], ['hasAll', ['ADMIN']], ['revoke', 'ADMIN'], ['revoke', 'ADMIN'], ['value']]), [true, 0]);
  assert.deepStrictEqual(solve([['hasAll', []], ['hasAny', []], ['list']]), [true, false, []]);
  assert.throws(() => solve([['grant', 'EXECUTE']]), RangeError);
}
// the revoke-with-XOR bug
let m = 0b00010; m ^= 1 << 0;
assert.strictEqual(m, 0b00011, 'XOR "revoke" of an absent flag turns it ON');
function mulberry32(a) { return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const rand = mulberry32(54);
const kinds = ['grant', 'revoke', 'toggle', 'has', 'hasAll', 'hasAny', 'list', 'value'];
for (let t = 0; t < 300; t++) {
  const ops = Array.from({ length: 30 }, () => {
    const k = kinds[Math.floor(rand() * kinds.length)];
    const pick = () => NAMES[Math.floor(rand() * NAMES.length)];
    if (k === 'hasAll' || k === 'hasAny') return [k, Array.from({ length: Math.floor(rand() * 4) }, pick)];
    if (k === 'list' || k === 'value') return [k];
    return [k, pick()];
  });
  assert.deepStrictEqual(optimal(ops), bruteForce(ops));
}
console.log('✓ 04_permission_flags passed');

module.exports = { optimal, bruteForce, MaskPermissions };
