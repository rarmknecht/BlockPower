/**
 * BFS Shortest-Path Solver for Block Power.
 * Computes the optimal move sequence from any board state to the exit.
 */

import { buildOccupancyGrid, cloneVehicles } from './engine.js';

/**
 * Encode vehicle positions into a compact string key for BFS visited set.
 * @param {import('./engine.js').Vehicle[]} vehicles
 * @returns {string}
 */
function encodeState(vehicles) {
  let key = '';
  for (let i = 0; i < vehicles.length; i++) {
    const v = vehicles[i];
    key += v.dir === 'h' ? v.col : v.row;
    if (i < vehicles.length - 1) key += ',';
  }
  return key;
}

/**
 * Solve a board state using Breadth-First Search.
 * Returns the optimal list of moves: [{ vehicleIndex, vehicleId, fromPos, toPos, dir }]
 * or null if unsolvable (or maxStates exceeded).
 *
 * @param {number} rows
 * @param {number} cols
 * @param {import('./engine.js').Vehicle[]} initialVehicles
 * @param {number} [maxStates=80000]
 * @returns {{ solvable: boolean, moves: Array<{ vehicleIndex: number, vehicleId: string, fromPos: number, toPos: number, dir: 'h'|'v' }>, statesExplored: number }}
 */
export function solveBoard(rows, cols, initialVehicles, maxStates = 80000) {
  const heroIdx = initialVehicles.findIndex((v) => v.category === 'hero');
  if (heroIdx === -1) {
    return { solvable: false, moves: [], statesExplored: 0 };
  }

  // Already at exit
  if (initialVehicles[heroIdx].col + initialVehicles[heroIdx].len === cols) {
    return { solvable: true, moves: [], statesExplored: 1 };
  }

  // Store positions as compact Int8Array/Array for speed
  const n = initialVehicles.length;
  const startPositions = initialVehicles.map((v) => (v.dir === 'h' ? v.col : v.row));

  const visited = new Set();
  const startKey = startPositions.join(',');
  visited.add(startKey);

  // Queue items: { pos: number[], parent: number, move: object|null }
  const queue = [{ pos: startPositions, parent: -1, move: null }];
  let head = 0;

  while (head < queue.length && visited.size < maxStates) {
    const current = queue[head];
    const pos = current.pos;

    // Build occupancy grid for current positions
    const grid = Array.from({ length: rows }, () => Array(cols).fill(-1));
    for (let i = 0; i < n; i++) {
      const v = initialVehicles[i];
      const p = pos[i];
      for (let k = 0; k < v.len; k++) {
        const r = v.dir === 'v' ? p + k : v.row;
        const c = v.dir === 'h' ? p + k : v.col;
        grid[r][c] = i;
      }
    }

    // Generate all valid 1-move transitions
    for (let i = 0; i < n; i++) {
      const v = initialVehicles[i];
      const curP = pos[i];

      if (v.dir === 'h') {
        // Slide left
        for (let np = curP - 1; np >= 0; np--) {
          if (grid[v.row][np] !== -1) break;
          const nextPos = pos.slice();
          nextPos[i] = np;
          const key = nextPos.join(',');
          if (!visited.has(key)) {
            visited.add(key);
            queue.push({
              pos: nextPos,
              parent: head,
              move: { vehicleIndex: i, vehicleId: v.id, fromPos: curP, toPos: np, dir: 'h' },
            });
          }
        }
        // Slide right
        for (let np = curP + 1; np + v.len <= cols; np++) {
          if (grid[v.row][np + v.len - 1] !== -1) break;
          const nextPos = pos.slice();
          nextPos[i] = np;

          const moveObj = { vehicleIndex: i, vehicleId: v.id, fromPos: curP, toPos: np, dir: 'h' };

          // Check win condition immediately
          if (i === heroIdx && np + v.len === cols) {
            const moves = [moveObj];
            let trace = head;
            while (trace > 0) {
              moves.push(queue[trace].move);
              trace = queue[trace].parent;
            }
            moves.reverse();
            return { solvable: true, moves, statesExplored: visited.size };
          }

          const key = nextPos.join(',');
          if (!visited.has(key)) {
            visited.add(key);
            queue.push({ pos: nextPos, parent: head, move: moveObj });
          }
        }
      } else {
        // Slide up
        for (let np = curP - 1; np >= 0; np--) {
          if (grid[np][v.col] !== -1) break;
          const nextPos = pos.slice();
          nextPos[i] = np;
          const key = nextPos.join(',');
          if (!visited.has(key)) {
            visited.add(key);
            queue.push({
              pos: nextPos,
              parent: head,
              move: { vehicleIndex: i, vehicleId: v.id, fromPos: curP, toPos: np, dir: 'v' },
            });
          }
        }
        // Slide down
        for (let np = curP + 1; np + v.len <= rows; np++) {
          if (grid[np + v.len - 1][v.col] !== -1) break;
          const nextPos = pos.slice();
          nextPos[i] = np;
          const key = nextPos.join(',');
          if (!visited.has(key)) {
            visited.add(key);
            queue.push({
              pos: nextPos,
              parent: head,
              move: { vehicleIndex: i, vehicleId: v.id, fromPos: curP, toPos: np, dir: 'v' },
            });
          }
        }
      }
    }

    head++;
  }

  return { solvable: false, moves: [], statesExplored: visited.size };
}

/**
 * Get just the next optimal move for the Hint button.
 * @param {number} rows
 * @param {number} cols
 * @param {import('./engine.js').Vehicle[]} vehicles
 * @returns {{ vehicleIndex: number, vehicleId: string, fromPos: number, toPos: number, dir: 'h'|'v' } | null}
 */
export function getNextHint(rows, cols, vehicles) {
  const result = solveBoard(rows, cols, vehicles, 60000);
  if (result.solvable && result.moves.length > 0) {
    return result.moves[0];
  }
  return null;
}

export { encodeState, cloneVehicles };
