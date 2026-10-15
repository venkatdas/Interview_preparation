// node:test suite for 02_Implementations/review_scheduler.js
// Run: node --test 45_Revision_And_Spaced_Repetition/tests/review_scheduler.test.js
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const os = require('node:os');
const { execFileSync } = require('node:child_process');

const S = require('../02_Implementations/review_scheduler');
const SCRIPT = path.join(__dirname, '..', '02_Implementations', 'review_scheduler.js');
const EXAMPLE = path.join(__dirname, '..', '02_Implementations', 'review-log.example.json');

function mulberry32(seed) {
  return function rand() {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const day = S.parseDate;

describe('dates', () => {
  it('parses and formats in UTC whole days, across month/year/leap boundaries', () => {
    assert.equal(day('2026-01-01') - day('2025-12-31'), 1);
    assert.equal(S.formatDate(day('2028-02-28') + 1), '2028-02-29');
    assert.equal(S.formatDate(day('2026-03-29') + 1), '2026-03-30'); // a European DST change day
  });
  it('rejects malformed and impossible dates', () => {
    for (const bad of ['2026-2-1', '2026/01/01', '2026-02-30', '2026-13-01', '', null, 20260101]) {
      assert.throws(() => S.parseDate(bad));
    }
  });
});

describe('scheduleFor / nextStep', () => {
  it('normal: all grade-2 reviews land on day 1, 3, 7, 14, 30, 60, then mastered', () => {
    const e = { problem: 'P', reviews: [{ date: '2026-05-01', grade: 2 }] };
    const offsets = [];
    for (let k = 0; k < 6; k++) {
      const s = S.scheduleFor(e);
      assert.equal(s.mastered, false);
      offsets.push(s.dueDay - day('2026-05-01'));
      e.reviews.push({ date: S.formatDate(s.dueDay), grade: 2 });
    }
    assert.deepEqual(offsets, [1, 3, 7, 14, 30, 60]);
    const done = S.scheduleFor(e);
    assert.equal(done.mastered, true);
    assert.equal(done.dueDay, null);
  });
  it('first entry always schedules the next day, whatever its grade', () => {
    for (const grade of [0, 1, 2, 3]) {
      const s = S.scheduleFor({ problem: 'P', reviews: [{ date: '2026-05-01', grade }] });
      assert.equal(S.formatDate(s.dueDay), '2026-05-02');
    }
  });
  it('grade 0 resets to step 0; grade 1 repeats the gap; grade 3 skips a step', () => {
    const base = [{ date: '2026-05-01', grade: 2 }, { date: '2026-05-02', grade: 2 }, { date: '2026-05-04', grade: 2 }];
    assert.equal(S.scheduleFor({ problem: 'P', reviews: [...base, { date: '2026-05-08', grade: 0 }] }).step, 0);
    assert.equal(S.scheduleFor({ problem: 'P', reviews: [...base, { date: '2026-05-08', grade: 1 }] }).step, 2);
    assert.equal(S.scheduleFor({ problem: 'P', reviews: [...base, { date: '2026-05-08', grade: 3 }] }).step, 4);
    const reset = S.scheduleFor({ problem: 'P', reviews: [...base, { date: '2026-05-08', grade: 0 }] });
    assert.equal(S.formatDate(reset.dueDay), '2026-05-09');
  });
  it('duplicates: same-day reviews are applied in file order; unsorted input is sorted by date', () => {
    const sameDay = S.scheduleFor({ problem: 'P', reviews: [
      { date: '2026-05-01', grade: 2 }, { date: '2026-05-02', grade: 0 }, { date: '2026-05-02', grade: 2 },
    ] });
    assert.equal(sameDay.step, 1); // reset by the 0, then advanced by the later 2
    const shuffled = S.scheduleFor({ problem: 'P', reviews: [
      { date: '2026-05-04', grade: 2 }, { date: '2026-05-01', grade: 2 }, { date: '2026-05-02', grade: 2 },
    ] });
    assert.equal(shuffled.step, 2);
    assert.equal(S.formatDate(shuffled.dueDay), '2026-05-08');
  });
  it('random: the step always stays within [0, MASTERED_STEP] and matches a direct replay', () => {
    const rand = mulberry32(45);
    for (let t = 0; t < 300; t++) {
      let d = day('2026-01-01') + Math.floor(rand() * 100);
      const reviews = [];
      let step = 0;
      const n = 1 + Math.floor(rand() * 10);
      for (let k = 0; k < n; k++) {
        const grade = Math.floor(rand() * 4);
        reviews.push({ date: S.formatDate(d), grade });
        if (k > 0) step = grade === 0 ? 0 : grade === 1 ? step : Math.min(step + (grade === 2 ? 1 : 2), S.MASTERED_STEP);
        d += Math.floor(rand() * 20);
      }
      const s = S.scheduleFor({ problem: 'R', reviews });
      assert.equal(s.step, step);
      assert.ok(s.step >= 0 && s.step <= S.MASTERED_STEP);
      assert.equal(s.mastered, step === S.MASTERED_STEP);
      if (!s.mastered) assert.equal(s.dueDay, s.lastDay + S.GAPS[s.step]);
    }
  });
});

describe('dueOn / upcoming / stats', () => {
  const log = [
    { problem: 'B', topic: 't', reviews: [{ date: '2026-01-01', grade: 1 }] },  // due 01-02
    { problem: 'A', reviews: [{ date: '2026-01-03', grade: 2 }] },              // due 01-04
    { problem: 'C', reviews: [{ date: '2026-01-05', grade: 0 }] },              // due 01-06
  ];
  it('normal: lists due items, most overdue first, ties by name', () => {
    const due = S.dueOn(log, day('2026-01-04'));
    assert.deepEqual(due.map((x) => [x.problem, x.overdueDays, x.dueDate]), [['B', 2, '2026-01-02'], ['A', 0, '2026-01-04']]);
    assert.deepEqual(S.upcoming(log, day('2026-01-04'), 7).map((x) => [x.problem, x.inDays]), [['C', 2]]);
    assert.deepEqual(S.stats(log), { total: 3, mastered: 0 });
  });
  it('empty log: nothing due, nothing upcoming', () => {
    assert.deepEqual(S.dueOn([], day('2026-01-04')), []);
    assert.deepEqual(S.upcoming([], day('2026-01-04'), 7), []);
    assert.match(S.formatReport([], day('2026-01-04')), /Nothing due today/);
  });
  it('duplicates: two entries with the same problem name are both listed', () => {
    const dup = [log[0], { ...log[0] }];
    assert.equal(S.dueOn(dup, day('2026-01-10')).length, 2);
  });
  it('invalid input is rejected with a helpful message', () => {
    assert.throws(() => S.validateLog({}), /array/);
    assert.throws(() => S.validateLog([{ reviews: [] }]), /problem/);
    assert.throws(() => S.validateLog([{ problem: 'X', reviews: [] }]), /non-empty/);
    assert.throws(() => S.validateLog([{ problem: 'X', reviews: [{ date: '2026-01-01', grade: 1.5 }] }]), /grade/);
    assert.throws(() => S.validateLog([{ problem: 'X', reviews: [{ date: 'yesterday', grade: 1 }] }]), /X.*date/);
  });
  it('the example log is valid and gives a stable plan for 2026-10-15', () => {
    const example = JSON.parse(fs.readFileSync(EXAMPLE, 'utf8'));
    assert.ok(S.validateLog(example));
    const due = S.dueOn(example, day('2026-10-15'));
    assert.equal(due[0].problem, 'Coin Change');
    assert.equal(S.stats(example).mastered, 1);
  });
});

describe('CLI', () => {
  it('prints the plan for a log file and a fixed date', () => {
    const out = execFileSync(process.execPath, [SCRIPT, EXAMPLE, '--today', '2026-10-15'], { encoding: 'utf8' });
    assert.match(out, /Review plan for 2026-10-15/);
    assert.match(out, /DUE NOW \(6\)/);
  });
  it('with no arguments runs the self-test and prints a ✓ line', () => {
    const out = execFileSync(process.execPath, [SCRIPT], { encoding: 'utf8', cwd: os.tmpdir() });
    assert.match(out, /✓ review_scheduler.js self-test passed/);
  });
  it('exits with code 1 and an error message on a bad log', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'review-'));
    const bad = path.join(dir, 'bad.json');
    fs.writeFileSync(bad, JSON.stringify([{ problem: 'X', reviews: [{ date: '2026-01-01', grade: 9 }] }]));
    try {
      execFileSync(process.execPath, [SCRIPT, bad], { encoding: 'utf8', stdio: 'pipe' });
      assert.fail('expected a non-zero exit');
    } catch (err) {
      assert.equal(err.status, 1);
      assert.match(err.stderr, /grade must be an integer 0-3/);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });
  it('parseArgs validates options', () => {
    assert.deepEqual(S.parseArgs(['log.json', '--upcoming', '3']), { file: 'log.json', today: null, upcoming: 3 });
    assert.throws(() => S.parseArgs(['a.json', 'b.json']));
    assert.throws(() => S.parseArgs(['a.json', '--upcoming', '-1']));
  });
});
