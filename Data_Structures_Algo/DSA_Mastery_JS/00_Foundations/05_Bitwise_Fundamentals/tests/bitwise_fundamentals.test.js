const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const bits = require('../02_Implementations/bits');
const twos = require('../03_Problems/solutions/01_twos_complement_width');
const int32 = require('../03_Problems/solutions/02_simulate_toint32');
const flags = require('../03_Problems/solutions/04_permission_flags');
const shift = require('../03_Problems/solutions/05_shift_division');
const big = require('../03_Problems/solutions/06_bigint_bit_fields');

function mulberry32(a) { return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

describe('bits.js', () => {
  it('handles normal case', () => {
    assert.equal(bits.toBinary(10, 8), '00001010');
    assert.equal(bits.getBit(10, 1), 1);
    assert.equal(bits.setBit(10, 0), 11);
    assert.equal(bits.clearBit(10, 3), 2);
    assert.equal(bits.toggleBit(10, 2), 14);
  });
  it('handles zero / empty-ish input', () => {
    assert.equal(bits.toBinary(0, 1), '0');
    assert.equal(bits.lowMask(0), 0);
    assert.equal(bits.bigPopcount(0n), 0);
    assert.equal(bits.toInt32(NaN), 0);
  });
  it('handles negatives and the 32-bit boundary', () => {
    assert.equal(bits.toBinary(-1, 32), '1'.repeat(32));
    assert.equal(bits.fromBinary('1'.repeat(32)), -1);
    assert.equal(bits.toInt32(2 ** 31), -(2 ** 31));
    assert.equal(bits.toUint32(-1), 2 ** 32 - 1);
    assert.equal(bits.extractField(0x80000000 | 0, 31, 1), 1);
  });
  it('matches built-in conversions on random inputs', () => {
    const rand = mulberry32(61);
    for (let t = 0; t < 500; t++) {
      const x = (rand() - 0.5) * 2 ** Math.floor(rand() * 70);
      assert.equal(bits.toInt32(x), x | 0);
      assert.equal(bits.toUint32(x), x >>> 0);
      const n = (Math.floor(rand() * 2 ** 32) - 2 ** 31) | 0;
      assert.equal(bits.toBinary(n, 32), (n >>> 0).toString(2).padStart(32, '0'));
    }
  });
});

describe('selected solutions', () => {
  it("two's complement edge widths", () => {
    assert.equal(twos.optimal.encode(-(2 ** 31), 32), twos.bruteForce.encode(-(2 ** 31), 32));
    assert.equal(twos.optimal.decode('10'), -2);
  });
  it('ToInt32 simulation on extreme values', () => {
    for (const x of [Number.MAX_VALUE, -Number.MAX_VALUE, Number.MIN_VALUE, 2 ** 31 - 0.5]) {
      assert.deepEqual(int32.optimal(x), { int32: x | 0, uint32: x >>> 0 });
    }
  });
  it('permission masks agree with the Set model', () => {
    const ops = [['toggle', 'SHARE'], ['grant', 'READ'], ['hasAll', ['READ', 'SHARE']], ['revoke', 'SHARE'], ['hasAll', ['READ', 'SHARE']], ['value']];
    assert.deepEqual(flags.optimal(ops), flags.bruteForce(ops));
    assert.deepEqual(flags.optimal(ops), [true, false, 1]);
  });
  it('shift division at int32 extremes', () => {
    for (const n of [2 ** 31 - 1, -(2 ** 31), -1, 0, 1]) for (let k = 0; k < 32; k++) {
      assert.deepEqual(shift.optimal(n, k), shift.bruteForce(n, k));
    }
  });
  it('bigint fields round trip', () => {
    const f = { timestamp: 123456789012n, machine: 513n, sequence: 7n };
    assert.deepEqual(big.optimal.unpack(big.optimal.pack(f)), f);
  });
});
