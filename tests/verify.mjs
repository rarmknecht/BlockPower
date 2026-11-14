import { LEVELS } from '../js/levels.js';
import { validateLevel, getSlideBounds, applyMove } from '../js/engine.js';
import { solveBoard } from '../js/solver.js';

let failures = 0;

console.log('=== Block Power Level & Engine Verification ===\n');

for (const lvl of LEVELS) {
  const check = validateLevel(lvl);
  if (!check.valid) {
    console.error(`[FAIL] ${lvl.id} (${lvl.name}): ${check.error}`);
    failures++;
    continue;
  }

  const sol = solveBoard(lvl.rows, lvl.cols, lvl.vehicles, 120000);
  if (!sol.solvable) {
    console.error(`[FAIL] ${lvl.id} (${lvl.name}): UNSOLVABLE (explored ${sol.statesExplored} states)`);
    failures++;
    continue;
  }

  // The in-game Hint button searches with a 60000-state budget; it must cope with every start position.
  const hintSol = solveBoard(lvl.rows, lvl.cols, lvl.vehicles, 60000);
  if (!hintSol.solvable) {
    console.error(`[FAIL] ${lvl.id} (${lvl.name}): Hint search budget too small (explored ${hintSol.statesExplored} states)`);
    failures++;
  }

  const parMatch = sol.moves.length === lvl.par ? 'OK' : `PAR MISMATCH (actual=${sol.moves.length}, listed=${lvl.par})`;
  if (sol.moves.length !== lvl.par) failures++;
  console.log(
    `[PASS] ${lvl.id.padEnd(11)} | ${lvl.rows}x${lvl.cols} | ${lvl.name.padEnd(20)} | Optimal: ${String(sol.moves.length).padStart(2)} moves | States: ${String(sol.statesExplored).padStart(5)} | ${parMatch}`
  );
}

// Ids and names must be unique (ids key the saved progress).
for (const field of ['id', 'name']) {
  const seen = new Set();
  for (const lvl of LEVELS) {
    if (seen.has(lvl[field])) {
      console.error(`[FAIL] Duplicate level ${field}: ${lvl[field]}`);
      failures++;
    }
    seen.add(lvl[field]);
  }
}

// Engine unit checks
const first = LEVELS[0];
const bounds = getSlideBounds(first.rows, first.cols, first.vehicles, 0);
if (bounds.min !== 0 || bounds.max !== 0) {
  console.error(`[FAIL] Engine bounds check failed on starter-1 hero: expected min=0,max=0 got ${JSON.stringify(bounds)}`);
  failures++;
}

const move1 = applyMove(first.rows, first.cols, first.vehicles, 1, 0);
if (!move1.moved || move1.vehicles[1].row !== 0) {
  console.error('[FAIL] Engine applyMove failed on starter-1 v1 -> row 0');
  failures++;
}

console.log(`\nSummary: ${LEVELS.length} levels checked, ${failures} failures.`);
if (failures > 0) process.exit(1);
