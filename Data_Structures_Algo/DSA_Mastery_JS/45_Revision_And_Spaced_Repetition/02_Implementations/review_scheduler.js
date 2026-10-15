/**
 * review_scheduler.js — a tiny spaced-repetition CLI for solved problems.
 *
 * USAGE
 *   node review_scheduler.js <log.json> [--today YYYY-MM-DD] [--upcoming N]
 *   node review_scheduler.js                (no arguments: runs the self-test + a demo)
 *
 * LOG FORMAT (JSON array; see review-log.example.json)
 *   [
 *     { "problem": "Two Sum", "topic": "05_Hashing", "link": "05_Hashing/03_Problems/01_Easy/01_two_sum.md",
 *       "reviews": [ { "date": "2026-10-01", "grade": 2 }, { "date": "2026-10-02", "grade": 3 } ] }
 *   ]
 *   The FIRST review is the day you first solved (or studied) the problem.
 *
 * GRADES (how well you recalled it, 0-3)
 *   0 = blank / needed the full solution      -> back to step 0 (review again tomorrow)
 *   1 = solved with hints or way over time     -> stay on the same step (repeat the same gap)
 *   2 = solved alone, some hesitation          -> next step
 *   3 = solved alone, fast and clean           -> skip one step (two steps forward)
 *
 * SCHEDULE
 *   If every review is graded 2, reviews land on day 1, 3, 7, 14, 30, 60 after the first solve.
 *   The gap after reaching step s is GAPS[s] days: [1, 2, 4, 7, 16, 30]  (cumulative 1, 3, 7, 14, 30, 60).
 *   Passing step 5 (the day-60 review) marks the problem MASTERED: it leaves the queue.
 *   The first entry always starts at step 0, so the first review is always the next day.
 *
 * WHY UTC: dates are parsed as UTC midnight and compared in whole days, so daylight-saving
 * changes and the machine's timezone can never shift a due date by one day.
 */

const fs = require('fs');
const path = require('path');

const GAPS = [1, 2, 4, 7, 16, 30];   // gap (days) to the next review when sitting on step s
const MASTERED_STEP = GAPS.length;   // reaching this step means "done"
const DAY_MS = 24 * 60 * 60 * 1000;

// ---------- date helpers (UTC, whole days) ----------
function parseDate(text) {
  if (typeof text !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    throw new Error(`invalid date "${text}" (expected YYYY-MM-DD)`);
  }
  const [y, m, d] = text.split('-').map(Number);
  const ms = Date.UTC(y, m - 1, d);
  const back = new Date(ms);
  // Date.UTC silently rolls 2026-02-30 into March; reject that.
  if (back.getUTCFullYear() !== y || back.getUTCMonth() !== m - 1 || back.getUTCDate() !== d) {
    throw new Error(`invalid calendar date "${text}"`);
  }
  return ms / DAY_MS; // integer day number since 1970-01-01
}

function formatDate(dayNumber) {
  return new Date(dayNumber * DAY_MS).toISOString().slice(0, 10);
}

function todayDayNumber() {
  const now = new Date();
  return Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / DAY_MS; // the user's local calendar day
}

// ---------- validation ----------
function validateLog(log) {
  if (!Array.isArray(log)) throw new Error('log must be a JSON array');
  log.forEach((entry, i) => {
    const where = `entry ${i}${entry && entry.problem ? ` ("${entry.problem}")` : ''}`;
    if (!entry || typeof entry !== 'object') throw new Error(`${where}: must be an object`);
    if (typeof entry.problem !== 'string' || entry.problem.trim() === '') throw new Error(`${where}: "problem" must be a non-empty string`);
    if (!Array.isArray(entry.reviews) || entry.reviews.length === 0) throw new Error(`${where}: "reviews" must be a non-empty array`);
    entry.reviews.forEach((r, j) => {
      if (!r || typeof r !== 'object') throw new Error(`${where}, review ${j}: must be an object`);
      try { parseDate(r.date); } catch (e) { throw new Error(`${where}, review ${j}: ${e.message}`); }
      if (!Number.isInteger(r.grade) || r.grade < 0 || r.grade > 3) throw new Error(`${where}, review ${j}: grade must be an integer 0-3`);
    });
  });
  return true;
}

// ---------- core logic ----------
/** Step after a review with this grade (not used for the very first entry). */
function nextStep(step, grade) {
  if (grade === 0) return 0;
  if (grade === 1) return step;
  if (grade === 2) return Math.min(step + 1, MASTERED_STEP);
  return Math.min(step + 2, MASTERED_STEP); // grade 3
}

/**
 * Replays one problem's reviews (sorted by date; same-day reviews keep their file order).
 * Returns { step, lastDay, dueDay, mastered }.
 */
function scheduleFor(entry) {
  const reviews = entry.reviews
    .map((r, i) => ({ day: parseDate(r.date), grade: r.grade, i }))
    .sort((a, b) => a.day - b.day || a.i - b.i);
  let step = 0;
  reviews.forEach((r, idx) => {
    step = idx === 0 ? 0 : nextStep(step, r.grade);
  });
  const lastDay = reviews[reviews.length - 1].day;
  const mastered = step >= MASTERED_STEP;
  return { step, lastDay, dueDay: mastered ? null : lastDay + GAPS[step], mastered };
}

/** Everything due on or before `today` (a day number), most overdue first, then by name. */
function dueOn(log, today) {
  validateLog(log);
  return log
    .map((entry) => ({ entry, s: scheduleFor(entry) }))
    .filter(({ s }) => !s.mastered && s.dueDay <= today)
    .map(({ entry, s }) => ({
      problem: entry.problem,
      topic: entry.topic || '',
      link: entry.link || '',
      step: s.step,
      dueDate: formatDate(s.dueDay),
      overdueDays: today - s.dueDay,
    }))
    .sort((a, b) => b.overdueDays - a.overdueDays || a.problem.localeCompare(b.problem));
}

/** Items due in (today, today + days], soonest first. */
function upcoming(log, today, days) {
  validateLog(log);
  return log
    .map((entry) => ({ entry, s: scheduleFor(entry) }))
    .filter(({ s }) => !s.mastered && s.dueDay > today && s.dueDay <= today + days)
    .map(({ entry, s }) => ({ problem: entry.problem, dueDate: formatDate(s.dueDay), inDays: s.dueDay - today }))
    .sort((a, b) => a.inDays - b.inDays || a.problem.localeCompare(b.problem));
}

function stats(log) {
  validateLog(log);
  const all = log.map(scheduleFor);
  return { total: all.length, mastered: all.filter((s) => s.mastered).length };
}

function formatReport(log, today, upcomingDays = 7) {
  const due = dueOn(log, today);
  const soon = upcoming(log, today, upcomingDays);
  const { total, mastered } = stats(log);
  const lines = [`Review plan for ${formatDate(today)} — ${total} problems tracked, ${mastered} mastered`, ''];
  if (due.length === 0) lines.push('Nothing due today. Solve something new!');
  else {
    lines.push(`DUE NOW (${due.length}):`);
    for (const d of due) {
      const late = d.overdueDays === 0 ? 'due today' : `${d.overdueDays} day(s) overdue`;
      lines.push(`  - ${d.problem}${d.topic ? ` [${d.topic}]` : ''} — step ${d.step}, ${late}${d.link ? ` — ${d.link}` : ''}`);
    }
  }
  if (soon.length) {
    lines.push('', `COMING UP (next ${upcomingDays} days):`);
    for (const s of soon) lines.push(`  - ${s.problem} — ${s.dueDate} (in ${s.inDays} day(s))`);
  }
  lines.push('', 'Grade each review 0-3 and append { "date": "YYYY-MM-DD", "grade": N } to that problem.');
  return lines.join('\n');
}

function parseArgs(argv) {
  const opts = { file: null, today: null, upcoming: 7 };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--today') opts.today = parseDate(argv[++i]);
    else if (argv[i] === '--upcoming') {
      opts.upcoming = Number(argv[++i]);
      if (!Number.isInteger(opts.upcoming) || opts.upcoming < 0) throw new Error('--upcoming must be a non-negative integer');
    } else if (!opts.file) opts.file = argv[i];
    else throw new Error(`unexpected argument "${argv[i]}"`);
  }
  return opts;
}

function runCli(argv) {
  const opts = parseArgs(argv);
  const log = JSON.parse(fs.readFileSync(path.resolve(opts.file), 'utf8'));
  return formatReport(log, opts.today === null ? todayDayNumber() : opts.today, opts.upcoming);
}

module.exports = {
  GAPS, MASTERED_STEP, parseDate, formatDate, validateLog, nextStep, scheduleFor,
  dueOn, upcoming, stats, formatReport, parseArgs, runCli,
};

// ---------- CLI / self-test ----------
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length > 0) {
    try {
      console.log(runCli(args));
    } catch (err) {
      console.error(`error: ${err.message}`);
      process.exit(1);
    }
  } else {
    const assert = require('assert');
    // dates
    assert.strictEqual(formatDate(parseDate('2026-03-01') - 1), '2026-02-28');
    assert.strictEqual(parseDate('2026-10-16') - parseDate('2026-10-15'), 1);
    assert.throws(() => parseDate('2026-02-30'));
    assert.throws(() => parseDate('15/10/2026'));
    // perfect run hits day 1, 3, 7, 14, 30, 60 and then mastered
    const start = parseDate('2026-01-01');
    const entry = { problem: 'P', reviews: [{ date: '2026-01-01', grade: 2 }] };
    const seen = [];
    for (let k = 0; k < 6; k++) {
      const s = scheduleFor(entry);
      seen.push(s.dueDay - start);
      entry.reviews.push({ date: formatDate(s.dueDay), grade: 2 });
    }
    assert.deepStrictEqual(seen, [1, 3, 7, 14, 30, 60]);
    assert.strictEqual(scheduleFor(entry).mastered, true);
    // grade 0 resets, grade 1 repeats, grade 3 skips
    assert.strictEqual(nextStep(4, 0), 0);
    assert.strictEqual(nextStep(3, 1), 3);
    assert.strictEqual(nextStep(3, 3), 5);
    assert.strictEqual(nextStep(5, 3), MASTERED_STEP);
    // due list ordering and empty log
    const log = [
      { problem: 'B', reviews: [{ date: '2026-01-01', grade: 1 }] },          // due 01-02
      { problem: 'A', reviews: [{ date: '2026-01-03', grade: 2 }] },          // due 01-04
      { problem: 'C', reviews: [{ date: '2026-01-05', grade: 0 }] },          // due 01-06
    ];
    const due = dueOn(log, parseDate('2026-01-04'));
    assert.deepStrictEqual(due.map((d) => [d.problem, d.overdueDays]), [['B', 2], ['A', 0]]);
    assert.deepStrictEqual(dueOn([], parseDate('2026-01-04')), []);
    assert.throws(() => validateLog([{ problem: 'X', reviews: [{ date: '2026-01-01', grade: 4 }] }]));
    // demo on the example log with a fixed date, so the output is stable
    const example = JSON.parse(fs.readFileSync(path.join(__dirname, 'review-log.example.json'), 'utf8'));
    validateLog(example);
    console.log(formatReport(example, parseDate('2026-10-15')));
    console.log('');
    console.log('✓ review_scheduler.js self-test passed');
  }
}
