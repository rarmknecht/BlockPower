/**
 * Core game engine for Block Power.
 * Handles board representation, collision bounds, move validation, and win detection.
 */

/**
 * @typedef {Object} Vehicle
 * @property {string} id - Unique identifier (e.g. 'hero', 'v1')
 * @property {'hero'|'jeep'|'residential'|'commercial'} category - Vehicle category
 * @property {'h'|'v'} dir - Orientation: 'h' (horizontal) or 'v' (vertical)
 * @property {number} len - Length in grid cells (2 or 3)
 * @property {number} row - Top-left row index (0-based)
 * @property {number} col - Top-left column index (0-based)
 * @property {string} [color] - Optional color theme key
 * @property {string} [label] - Optional display label
 */

/**
 * @typedef {Object} LevelConfig
 * @property {string} id
 * @property {string} name
 * @property {'Starter'|'City Grid'|'Freight Yard'|'Master Jam'} difficulty
 * @property {number} rows
 * @property {number} cols
 * @property {number} exitRow - Row index of the exit gate on the right wall
 * @property {number} par - Optimal minimum moves
 * @property {Vehicle[]} vehicles
 */

/**
 * Clone a list of vehicles.
 * @param {Vehicle[]} vehicles
 * @returns {Vehicle[]}
 */
export function cloneVehicles(vehicles) {
  return vehicles.map((v) => ({ ...v }));
}

/**
 * Build a 2D occupancy grid where each cell holds the vehicle index or -1 if empty.
 * @param {number} rows
 * @param {number} cols
 * @param {Vehicle[]} vehicles
 * @returns {number[][]}
 */
export function buildOccupancyGrid(rows, cols, vehicles) {
  const grid = Array.from({ length: rows }, () => Array(cols).fill(-1));
  for (let idx = 0; idx < vehicles.length; idx++) {
    const v = vehicles[idx];
    for (let k = 0; k < v.len; k++) {
      const r = v.dir === 'v' ? v.row + k : v.row;
      const c = v.dir === 'h' ? v.col + k : v.col;
      if (r >= 0 && r < rows && c >= 0 && c < cols) {
        grid[r][c] = idx;
      }
    }
  }
  return grid;
}

/**
 * Validate a level configuration for out-of-bounds or overlapping vehicles.
 * @param {LevelConfig} level
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateLevel(level) {
  const { rows, cols, exitRow, vehicles } = level;
  if (exitRow < 0 || exitRow >= rows) {
    return { valid: false, error: `exitRow ${exitRow} out of bounds for ${rows} rows` };
  }

  const grid = Array.from({ length: rows }, () => Array(cols).fill(null));
  let heroCount = 0;

  for (const v of vehicles) {
    if (v.category === 'hero') {
      heroCount++;
      if (v.dir !== 'h') {
        return { valid: false, error: `Hero vehicle ${v.id} must be horizontal` };
      }
      if (v.row !== exitRow) {
        return { valid: false, error: `Hero vehicle ${v.id} row ${v.row} != exitRow ${exitRow}` };
      }
    }

    for (let k = 0; k < v.len; k++) {
      const r = v.dir === 'v' ? v.row + k : v.row;
      const c = v.dir === 'h' ? v.col + k : v.col;
      if (r < 0 || r >= rows || c < 0 || c >= cols) {
        return { valid: false, error: `Vehicle ${v.id} out of bounds at (${r}, ${c})` };
      }
      if (grid[r][c] !== null) {
        return { valid: false, error: `Overlap at (${r}, ${c}) between ${grid[r][c]} and ${v.id}` };
      }
      grid[r][c] = v.id;
    }
  }

  if (heroCount !== 1) {
    return { valid: false, error: `Expected 1 hero vehicle, found ${heroCount}` };
  }

  return { valid: true };
}

/**
 * Compute the valid [minPos, maxPos] range (row for 'v', col for 'h') for a vehicle.
 * For the hero vehicle, if the path to the right wall is clear, maxPos allows
 * sliding to the exit threshold (cols - hero.len + 1) or (cols - hero.len) depending on escape.
 * Here: standard grid positions are [0 .. cols - v.len], and if hero can escape,
 * we also report `canEscape: true`.
 *
 * @param {number} rows
 * @param {number} cols
 * @param {Vehicle[]} vehicles
 * @param {number} vehicleIndex
 * @returns {{ min: number, max: number, canEscape: boolean }}
 */
export function getSlideBounds(rows, cols, vehicles, vehicleIndex) {
  const grid = buildOccupancyGrid(rows, cols, vehicles);
  const v = vehicles[vehicleIndex];

  if (v.dir === 'h') {
    let min = v.col;
    while (min > 0 && grid[v.row][min - 1] === -1) {
      min--;
    }
    let max = v.col;
    while (max + v.len < cols && grid[v.row][max + v.len] === -1) {
      max++;
    }
    const canEscape = v.category === 'hero' && max + v.len === cols;
    return { min, max, canEscape };
  } else {
    let min = v.row;
    while (min > 0 && grid[min - 1][v.col] === -1) {
      min--;
    }
    let max = v.row;
    while (max + v.len < rows && grid[max + v.len][v.col] === -1) {
      max++;
    }
    return { min, max, canEscape: false };
  }
}

/**
 * Check if the hero vehicle currently has a clear path to the exit (or has reached the right edge).
 * @param {number} cols
 * @param {Vehicle[]} vehicles
 * @param {number} rows
 * @returns {boolean}
 */
export function isHeroAtExit(rows, cols, vehicles) {
  const hero = vehicles.find((v) => v.category === 'hero');
  if (!hero) return false;
  return hero.col + hero.len === cols;
}

/**
 * Apply a move to a cloned vehicles array if valid.
 * @param {number} rows
 * @param {number} cols
 * @param {Vehicle[]} vehicles
 * @param {number} vehicleIndex
 * @param {number} newPos - New col (if 'h') or new row (if 'v')
 * @returns {{ moved: boolean, vehicles: Vehicle[], escaped: boolean }}
 */
export function applyMove(rows, cols, vehicles, vehicleIndex, newPos) {
  const { min, max } = getSlideBounds(rows, cols, vehicles, vehicleIndex);
  const clamped = Math.max(min, Math.min(max, newPos));
  const v = vehicles[vehicleIndex];
  const currentPos = v.dir === 'h' ? v.col : v.row;

  if (clamped === currentPos) {
    return { moved: false, vehicles, escaped: false };
  }

  const next = cloneVehicles(vehicles);
  if (v.dir === 'h') {
    next[vehicleIndex].col = clamped;
  } else {
    next[vehicleIndex].row = clamped;
  }

  const escaped =
    next[vehicleIndex].category === 'hero' &&
    next[vehicleIndex].col + next[vehicleIndex].len === cols;

  return { moved: true, vehicles: next, escaped };
}
