// Level generator for Block Power.
// For a random board, explore its whole reachable state graph, then pick the state
// farthest (in moves) from any solved state, and verify it with the game's own solver.
//
// Usage: node tools/generate-level.mjs '<specJSON>'
//   spec: { rows, cols, exitRow, minN, maxN, minPar, maxPar, maxStates?, seconds? }
//   minN/maxN: vehicle count range (including the Red Jeep)
//   maxStates: cap on reachable positions (default 45000) so the in-game Hint
//              search (60000-state budget) always finishes from any position.
// Prints a level object (without id/name/difficulty) as JSON on stdout.
import { solveBoard } from '../js/solver.js';
import { validateLevel } from '../js/engine.js';

const spec = JSON.parse(process.argv[2]);
const { rows, cols, exitRow, minN, maxN, minPar, maxPar, maxStates = 45000, seconds = 120 } = spec;
const COLORS = ['slate', 'forest', 'cobalt', 'amber', 'teal', 'indigo', 'lime', 'violet'];
const rnd = (n) => Math.floor(Math.random() * n);

function randomBoard() {
  const grid = Array.from({ length: rows }, () => Array(cols).fill(false));
  const vs = [];
  const heroCol = rnd(cols - 3);
  vs.push({ dir: 'h', len: 2, row: exitRow, col: heroCol, category: 'hero' });
  grid[exitRow][heroCol] = grid[exitRow][heroCol + 1] = true;
  const n = minN + rnd(maxN - minN + 1);
  let tries = 0;
  while (vs.length < n && tries++ < 500) {
    const len = Math.random() < 0.3 ? 3 : 2;
    const dir = Math.random() < 0.5 ? 'h' : 'v';
    const row = rnd(dir === 'v' ? rows - len + 1 : rows);
    const col = rnd(dir === 'h' ? cols - len + 1 : cols);
    if (dir === 'h' && row === exitRow) continue; // would block the exit forever
    let ok = true;
    for (let k = 0; k < len && ok; k++) {
      const r = dir === 'v' ? row + k : row;
      const c = dir === 'h' ? col + k : col;
      if (grid[r][c]) ok = false;
    }
    if (!ok) continue;
    for (let k = 0; k < len; k++) grid[dir === 'v' ? row + k : row][dir === 'h' ? col + k : col] = true;
    vs.push({ dir, len, row, col });
  }
  return vs;
}

function neighbors(vs, pos) {
  const grid = Array.from({ length: rows }, () => Array(cols).fill(-1));
  vs.forEach((v, i) => {
    for (let k = 0; k < v.len; k++) {
      grid[v.dir === 'v' ? pos[i] + k : v.row][v.dir === 'h' ? pos[i] + k : v.col] = i;
    }
  });
  const out = [];
  vs.forEach((v, i) => {
    const lim = v.dir === 'h' ? cols : rows;
    const at = (p) => (v.dir === 'h' ? grid[v.row][p] : grid[p][v.col]);
    for (let p = pos[i] - 1; p >= 0 && at(p) === -1; p--) { const q = pos.slice(); q[i] = p; out.push(q); }
    for (let p = pos[i] + 1; p + v.len <= lim && at(p + v.len - 1) === -1; p++) { const q = pos.slice(); q[i] = p; out.push(q); }
  });
  return out;
}

/** Returns { start, dist, size } or null if the component is too big / unsolvable. */
function hardestState(vs) {
  const start = vs.map((v) => (v.dir === 'h' ? v.col : v.row));
  const seen = new Map([[start.join(','), start]]);
  const q = [start];
  for (let h = 0; h < q.length; h++) {
    for (const nb of neighbors(vs, q[h])) {
      const k = nb.join(',');
      if (!seen.has(k)) {
        seen.set(k, nb);
        q.push(nb);
        if (seen.size > maxStates) return null;
      }
    }
  }
  // Multi-source BFS from solved states (hero touching the right wall).
  const goal = cols - 2;
  const dist = new Map();
  let frontier = [];
  for (const [k, p] of seen) if (p[0] === goal) { dist.set(k, 0); frontier.push(p); }
  if (frontier.length === 0) return null;
  let best = null;
  let d = 0;
  while (frontier.length) {
    const next = [];
    for (const p of frontier) {
      for (const nb of neighbors(vs, p)) {
        const k = nb.join(',');
        if (!dist.has(k)) { dist.set(k, d + 1); next.push(nb); }
      }
    }
    if (next.length) { d++; best = next; }
    frontier = next;
  }
  if (!best) return null;
  // Among the farthest states, prefer one where the hero is furthest left.
  best.sort((a, b) => a[0] - b[0]);
  return { start: best[0], dist: d, size: seen.size };
}

function colorize(vs) {
  const cells = (v) => Array.from({ length: v.len }, (_, k) => [v.dir === 'v' ? v.row + k : v.row, v.dir === 'h' ? v.col + k : v.col]);
  vs.forEach((v, i) => {
    if (v.category === 'hero') return;
    const near = new Set();
    for (const [r, c] of cells(v)) {
      vs.forEach((o, j) => {
        if (j === i || !o.color) return;
        if (cells(o).some(([r2, c2]) => Math.abs(r - r2) + Math.abs(c - c2) === 1)) near.add(o.color);
      });
    }
    const options = COLORS.filter((c) => !near.has(c));
    v.color = (options.length ? options : COLORS)[rnd(options.length || COLORS.length)];
  });
}

const deadline = Date.now() + seconds * 1000;
let best = null;
let attempts = 0;
while (Date.now() < deadline) {
  attempts++;
  const vs = randomBoard();
  const res = hardestState(vs);
  if (!res || res.dist < minPar || res.dist > maxPar) continue;
  // Prefer the hardest within range; tie-break on vehicle count.
  if (!best || res.dist > best.res.dist) best = { vs, res };
  if (res.dist === maxPar) break;
}
if (!best) {
  console.error(`no level found after ${attempts} attempts`);
  process.exit(1);
}

const { vs, res } = best;
let vi = 0;
const vehicles = vs.map((v, i) => {
  const out = { ...v };
  if (v.dir === 'h') out.col = res.start[i]; else out.row = res.start[i];
  if (v.category === 'hero') return { id: 'hero', category: 'hero', dir: 'h', len: 2, row: out.row, col: out.col };
  out.category = v.len === 3 ? (Math.random() < 0.7 ? 'commercial' : 'residential') : (Math.random() < 0.55 ? 'jeep' : 'residential');
  return out;
});
colorize(vehicles);
const final = vehicles.map((v) =>
  v.category === 'hero' ? v : { id: `v${++vi}`, category: v.category, dir: v.dir, len: v.len, row: v.row, col: v.col, color: v.color }
);

const level = { rows, cols, exitRow, par: res.dist, vehicles: final };
const check = validateLevel(level);
const sol = solveBoard(rows, cols, final, 200000);
if (!check.valid || !sol.solvable || sol.moves.length !== res.dist) {
  console.error('verification failed', check, sol.moves.length, res.dist);
  process.exit(1);
}
console.error(`attempts=${attempts} par=${res.dist} states=${res.size} vehicles=${final.length}`);
console.log(JSON.stringify(level));
