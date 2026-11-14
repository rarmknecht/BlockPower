import { LEVELS } from './levels.js';
import { cloneVehicles, getSlideBounds, applyMove } from './engine.js';
import { getNextHint } from './solver.js';
import { renderVehicleSVG } from './vehicles.js';
import { sound } from './audio.js';

const STORAGE_KEY = 'block_power_progress_v1';

const COLOR_NAMES = {
  slate: 'gray',
  forest: 'green',
  cobalt: 'blue',
  amber: 'orange',
  teal: 'teal',
  indigo: 'indigo',
  lime: 'lime',
  violet: 'purple',
};

const FOCUSABLE = 'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])';

/** Human-readable vehicle name, used for screen reader labels. */
function vehicleName(v) {
  if (v.category === 'hero') return 'Red Jeep';
  const color = COLOR_NAMES[v.color] || '';
  let kind = 'jeep';
  if (v.category === 'residential') kind = v.len === 3 ? 'utility van' : 'pickup truck';
  if (v.category === 'commercial') kind = 'freight truck';
  return `${color} ${kind}`.trim();
}

class BlockPowerApp {
  constructor() {
    this.levelIndex = 0;
    this.vehicles = [];
    this.history = [];
    this.moves = 0;
    this.selectedIdx = -1;
    this.won = false;
    this.cellSize = 56;
    this.progress = this.loadProgress();
    /** Index of the vehicle whose keyboard nudges are being merged into one move, or -1. */
    this.nudgeIdx = -1;
    /** @type {HTMLElement[]} Stack of open modals (top = last). */
    this.openModals = [];
    /** @type {Map<HTMLElement, Element|null>} Element to restore focus to when a modal closes. */
    this.returnFocus = new Map();

    // DOM refs
    this.boardFrame = document.querySelector('.board-frame');
    this.boardEl = document.getElementById('board');
    this.gridCellsEl = document.getElementById('grid-cells');
    this.exitGateEl = document.getElementById('exit-gate');
    this.hintGhostEl = document.getElementById('hint-ghost');
    this.vehiclesLayerEl = document.getElementById('vehicles-layer');
    this.statusEl = document.getElementById('sr-status');

    this.hudTierEl = document.getElementById('hud-tier');
    this.hudLevelNameEl = document.getElementById('hud-level-name');
    this.hudGridSizeEl = document.getElementById('hud-grid-size');
    this.hudMovesEl = document.getElementById('hud-moves');
    this.hudParEl = document.getElementById('hud-par');
    this.hudBestEl = document.getElementById('hud-best');

    this.btnUndo = document.getElementById('btn-undo');
    this.btnReset = document.getElementById('btn-reset');
    this.btnHint = document.getElementById('btn-hint');
    this.btnPrev = document.getElementById('btn-prev-level');
    this.btnNext = document.getElementById('btn-next-level');
    this.btnLevels = document.getElementById('btn-levels');
    this.btnSound = document.getElementById('btn-sound');
    this.btnHelp = document.getElementById('btn-help');

    this.modalLevels = document.getElementById('modal-levels');
    this.levelsListEl = document.getElementById('levels-list');
    this.modalWin = document.getElementById('modal-win');
    this.winStarsEl = document.getElementById('win-stars');
    this.winSubtitleEl = document.getElementById('win-subtitle');
    this.btnWinNext = document.getElementById('btn-win-next');
    this.modalHelp = document.getElementById('modal-help');

    /** @type {{ idx: number, pointerId: number, startX: number, startY: number, origPos: number, min: number, max: number, el: HTMLElement } | null} */
    this.drag = null;

    this.renderLegend();
    this.bindEvents();
    this.observeResize();
    this.loadLevel(0);
  }

  loadProgress() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  saveProgress() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.progress));
    } catch {
      // Ignore storage quota errors
    }
  }

  get currentLevel() {
    return LEVELS[this.levelIndex];
  }

  /** Draw the vehicle shapes in the How to Play legend using the real artwork. */
  renderLegend() {
    const samples = {
      hero: { category: 'hero', dir: 'h', len: 2 },
      jeep: { category: 'jeep', dir: 'h', len: 2, color: 'slate' },
      residential: { category: 'residential', dir: 'h', len: 3, color: 'slate' },
      commercial: { category: 'commercial', dir: 'h', len: 3, color: 'slate' },
    };
    document.querySelectorAll('[data-legend]').forEach((slot) => {
      const v = samples[slot.dataset.legend];
      if (!v) return;
      const inner = document.createElement('span');
      inner.style.width = `${v.len * 28}px`;
      inner.innerHTML = renderVehicleSVG(v);
      slot.appendChild(inner);
    });
  }

  bindEvents() {
    this.btnUndo.addEventListener('click', () => this.undo());
    this.btnReset.addEventListener('click', () => this.resetLevel());
    this.btnHint.addEventListener('click', () => this.showHint());
    this.btnPrev.addEventListener('click', () => {
      const prev = (this.levelIndex - 1 + LEVELS.length) % LEVELS.length;
      this.loadLevel(prev);
    });
    this.btnNext.addEventListener('click', () => {
      const next = (this.levelIndex + 1) % LEVELS.length;
      this.loadLevel(next);
    });

    this.btnLevels.addEventListener('click', () => this.openLevelsModal());
    this.btnHelp.addEventListener('click', () => this.openModal(this.modalHelp));
    this.btnSound.addEventListener('click', () => this.toggleSound());

    document.getElementById('btn-win-replay').addEventListener('click', () => {
      this.closeModal(this.modalWin, false);
      this.resetLevel();
      this.focusSelectedVehicle();
    });
    this.btnWinNext.addEventListener('click', () => {
      this.closeModal(this.modalWin, false);
      const next = (this.levelIndex + 1) % LEVELS.length;
      this.loadLevel(next);
      this.focusSelectedVehicle();
    });

    // Modal close buttons & backdrop clicks
    document.querySelectorAll('[data-close]').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.closeModal(document.getElementById(btn.dataset.close));
      });
    });
    [this.modalLevels, this.modalWin, this.modalHelp].forEach((backdrop) => {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) this.closeModal(backdrop);
      });
    });

    // Global pointer move/up for smooth dragging even outside vehicle bounds
    window.addEventListener('pointermove', (e) => this.onPointerMove(e));
    window.addEventListener('pointerup', (e) => this.onPointerUp(e));
    window.addEventListener('pointercancel', (e) => this.onPointerUp(e));

    // Keyboard controls
    window.addEventListener('keydown', (e) => this.onKeyDown(e));
  }

  observeResize() {
    const ro = new ResizeObserver(() => this.layoutBoard());
    ro.observe(this.boardFrame);
  }

  toggleSound() {
    const nextMuted = !sound.muted;
    sound.setMuted(nextMuted);
    document.getElementById('icon-sound-on').classList.toggle('hidden', nextMuted);
    document.getElementById('icon-sound-off').classList.toggle('hidden', !nextMuted);
    this.btnSound.setAttribute('aria-label', nextMuted ? 'Unmute sound' : 'Mute sound');
  }

  // ---------- Modals ----------

  openModal(modal, focusTarget) {
    if (!modal.classList.contains('hidden')) return;
    this.returnFocus.set(modal, document.activeElement);
    modal.classList.remove('hidden');
    this.openModals.push(modal);
    const target = focusTarget || modal.querySelector(FOCUSABLE);
    if (target) target.focus({ preventScroll: true });
  }

  /**
   * @param {HTMLElement} modal
   * @param {boolean} [restoreFocus=true] - Return focus to whatever opened the modal.
   */
  closeModal(modal, restoreFocus = true) {
    if (modal.classList.contains('hidden')) return;
    modal.classList.add('hidden');
    this.openModals = this.openModals.filter((m) => m !== modal);
    const prev = this.returnFocus.get(modal);
    this.returnFocus.delete(modal);
    if (!restoreFocus) return;
    if (prev && prev instanceof HTMLElement && document.contains(prev) && prev !== document.body) {
      prev.focus({ preventScroll: true });
    } else {
      this.focusSelectedVehicle();
    }
  }

  get topModal() {
    return this.openModals[this.openModals.length - 1] || null;
  }

  /** Keep Tab focus cycling inside the open modal. */
  trapFocus(e, modal) {
    const items = Array.from(modal.querySelectorAll(FOCUSABLE)).filter(
      (el) => el.offsetParent !== null
    );
    if (items.length === 0) {
      e.preventDefault();
      return;
    }
    const first = items[0];
    const last = items[items.length - 1];
    const active = document.activeElement;
    if (e.shiftKey && (active === first || !modal.contains(active))) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && (active === last || !modal.contains(active))) {
      e.preventDefault();
      first.focus();
    }
  }

  // ---------- Level lifecycle ----------

  loadLevel(index) {
    const boardHadFocus = this.vehiclesLayerEl.contains(document.activeElement);

    this.levelIndex = index;
    const lvl = this.currentLevel;
    this.vehicles = cloneVehicles(lvl.vehicles);
    this.history = [];
    this.moves = 0;
    this.selectedIdx = this.vehicles.findIndex((v) => v.category === 'hero');
    this.nudgeIdx = -1;
    this.won = false;
    this.drag = null;

    this.clearHint();
    this.buildGrid();
    this.layoutBoard();
    this.renderVehicles();
    this.updateHUD();

    if (boardHadFocus) this.focusSelectedVehicle();
  }

  resetLevel() {
    this.loadLevel(this.levelIndex);
    this.announce('Level reset.');
  }

  undo() {
    if (this.history.length === 0 || this.won) return;
    this.vehicles = this.history.pop();
    this.moves = Math.max(0, this.moves - 1);
    this.nudgeIdx = -1;
    this.clearHint();
    this.syncVehiclePositions();
    this.updateHUD();
    this.announce(`Undone. Moves: ${this.moves}.`);
    sound.playSlide();
  }

  buildGrid() {
    const { rows, cols, exitRow } = this.currentLevel;
    this.gridCellsEl.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    this.gridCellsEl.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    this.gridCellsEl.innerHTML = '';

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cell = document.createElement('div');
        cell.className = 'grid-cell' + (r === exitRow ? ' exit-lane' : '');
        this.gridCellsEl.appendChild(cell);
      }
    }
  }

  layoutBoard() {
    const { rows, cols, exitRow } = this.currentLevel;
    const rect = this.boardFrame.getBoundingClientRect();
    const availW = Math.max(180, rect.width - 24);
    const availH = Math.max(180, rect.height - 16);

    this.cellSize = Math.floor(Math.min(availW / cols, availH / rows));
    const boardW = this.cellSize * cols;
    const boardH = this.cellSize * rows;

    // +12px accounts for 6px border on each side
    this.boardEl.style.width = `${boardW + 12}px`;
    this.boardEl.style.height = `${boardH + 12}px`;

    this.exitGateEl.style.top = `${exitRow * this.cellSize}px`;
    this.exitGateEl.style.height = `${this.cellSize}px`;

    this.syncVehiclePositions();
  }

  renderVehicles() {
    this.vehiclesLayerEl.innerHTML = '';
    this.vehicles.forEach((v, idx) => {
      const el = document.createElement('div');
      el.className = 'vehicle';
      el.dataset.idx = String(idx);
      el.setAttribute('role', 'button');
      el.innerHTML = renderVehicleSVG(v);
      el.addEventListener('pointerdown', (e) => this.onPointerDown(e, idx, el));
      el.addEventListener('focus', () => this.selectVehicle(idx));
      this.vehiclesLayerEl.appendChild(el);
    });
    this.syncVehiclePositions();
  }

  syncVehiclePositions() {
    const cs = this.cellSize;
    const children = this.vehiclesLayerEl.children;
    for (let i = 0; i < this.vehicles.length; i++) {
      const v = this.vehicles[i];
      const el = children[i];
      if (!el) continue;
      el.style.left = `${v.col * cs}px`;
      el.style.top = `${v.row * cs}px`;
      el.style.width = `${(v.dir === 'h' ? v.len : 1) * cs}px`;
      el.style.height = `${(v.dir === 'v' ? v.len : 1) * cs}px`;
      const selected = i === this.selectedIdx;
      el.classList.toggle('selected', selected);
      // Roving tabindex: only the selected vehicle is in the page tab order.
      el.tabIndex = selected ? 0 : -1;
      el.setAttribute('aria-pressed', String(selected));
      el.setAttribute(
        'aria-label',
        `${vehicleName(v)}, slides ${v.dir === 'h' ? 'left and right' : 'up and down'}, row ${v.row + 1}, column ${v.col + 1}`
      );
    }
  }

  selectVehicle(idx) {
    if (idx === this.selectedIdx) return;
    this.selectedIdx = idx;
    this.nudgeIdx = -1;
    this.syncVehiclePositions();
  }

  focusSelectedVehicle() {
    const el = this.vehiclesLayerEl.children[this.selectedIdx];
    if (el) el.focus({ preventScroll: true });
  }

  /** Vehicle indices in reading order (top-to-bottom, left-to-right). */
  vehicleReadingOrder() {
    return this.vehicles
      .map((v, i) => i)
      .sort((a, b) => {
        const va = this.vehicles[a];
        const vb = this.vehicles[b];
        return va.row - vb.row || va.col - vb.col;
      });
  }

  // ---------- Pointer input ----------

  onPointerDown(e, idx, el) {
    if (this.won) return;
    e.preventDefault();
    this.clearHint();

    this.selectVehicle(idx);
    el.focus({ preventScroll: true });

    const { rows, cols } = this.currentLevel;
    const v = this.vehicles[idx];
    const bounds = getSlideBounds(rows, cols, this.vehicles, idx);

    this.drag = {
      idx,
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      origPos: v.dir === 'h' ? v.col : v.row,
      min: bounds.min,
      max: bounds.max,
      el,
    };

    el.classList.add('dragging');
  }

  onPointerMove(e) {
    if (!this.drag || e.pointerId !== this.drag.pointerId) return;
    const { idx, startX, startY, origPos, min, max, el } = this.drag;
    const v = this.vehicles[idx];
    const cs = this.cellSize;

    const deltaPx = v.dir === 'h' ? e.clientX - startX : e.clientY - startY;
    const minPx = min * cs;
    const maxPx = max * cs;
    const clampedPx = Math.max(minPx, Math.min(maxPx, origPos * cs + deltaPx));

    if (v.dir === 'h') {
      el.style.left = `${clampedPx}px`;
    } else {
      el.style.top = `${clampedPx}px`;
    }
  }

  onPointerUp(e) {
    if (!this.drag || e.pointerId !== this.drag.pointerId) return;
    const { idx, startX, startY, origPos, min, max, el } = this.drag;
    const v = this.vehicles[idx];
    const cs = this.cellSize;

    el.classList.remove('dragging');
    this.drag = null;

    const deltaPx = v.dir === 'h' ? e.clientX - startX : e.clientY - startY;
    const targetPos = Math.round(
      Math.max(min, Math.min(max, origPos + deltaPx / cs))
    );

    this.commitMove(idx, targetPos);
  }

  // ---------- Keyboard input ----------

  onKeyDown(e) {
    // Dialogs own the keyboard while open.
    const modal = this.topModal;
    if (modal) {
      if (e.key === 'Escape') {
        e.preventDefault();
        this.closeModal(modal);
      } else if (e.key === 'Tab') {
        this.trapFocus(e, modal);
      }
      return;
    }

    if (e.altKey) return;
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;

    if (e.ctrlKey || e.metaKey) {
      if (key === 'z' && !e.shiftKey) {
        e.preventDefault();
        this.undo();
      }
      return;
    }

    if (key === 'h') {
      e.preventDefault();
      this.showHint();
      return;
    }
    if (key === 'u') {
      e.preventDefault();
      this.undo();
      return;
    }

    // Tab / Shift+Tab steps through vehicles in reading order while the board has focus;
    // past the first or last vehicle, focus leaves the board normally.
    if (key === 'Tab') {
      const active = document.activeElement;
      if (!this.vehiclesLayerEl.contains(active) || this.won) return;
      const order = this.vehicleReadingOrder();
      const pos = order.indexOf(Number(active.dataset.idx));
      const nextPos = pos + (e.shiftKey ? -1 : 1);
      if (pos === -1 || nextPos < 0 || nextPos >= order.length) return;
      e.preventDefault();
      this.selectVehicle(order[nextPos]);
      this.focusSelectedVehicle();
      return;
    }

    if (this.won || this.selectedIdx < 0) return;

    const v = this.vehicles[this.selectedIdx];
    let delta = 0;
    if (v.dir === 'h') {
      if (key === 'ArrowLeft' || key === 'a') delta = -1;
      if (key === 'ArrowRight' || key === 'd') delta = 1;
    } else {
      if (key === 'ArrowUp' || key === 'w') delta = -1;
      if (key === 'ArrowDown' || key === 's') delta = 1;
    }
    // Keep arrow keys from scrolling the page even when they don't apply to this vehicle.
    if (key.startsWith('Arrow')) e.preventDefault();
    if (delta === 0) return;

    e.preventDefault();
    this.clearHint();
    const curPos = v.dir === 'h' ? v.col : v.row;
    let target = curPos + delta;
    if (e.shiftKey) {
      const { rows, cols } = this.currentLevel;
      const bounds = getSlideBounds(rows, cols, this.vehicles, this.selectedIdx);
      target = delta < 0 ? bounds.min : bounds.max;
    }
    this.commitMove(this.selectedIdx, target, { merge: true });
  }

  // ---------- Moves ----------

  /**
   * @param {number} idx
   * @param {number} targetPos
   * @param {{ merge?: boolean }} [opts] - merge: fold consecutive keyboard slides of the
   *   same vehicle into a single move (a slide of any distance is one move).
   */
  commitMove(idx, targetPos, { merge = false } = {}) {
    const { rows, cols } = this.currentLevel;
    const prevSnapshot = cloneVehicles(this.vehicles);
    const res = applyMove(rows, cols, this.vehicles, idx, targetPos);

    if (!res.moved) {
      this.syncVehiclePositions();
      return;
    }

    const continuing = merge && this.nudgeIdx === idx && this.history.length > 0;
    if (!continuing) {
      this.history.push(prevSnapshot);
      this.moves++;
    }
    this.vehicles = res.vehicles;
    this.nudgeIdx = merge ? idx : -1;

    if (continuing) {
      // Nudged back to where this move started: it no longer counts.
      const start = this.history[this.history.length - 1][idx];
      const now = this.vehicles[idx];
      if (start.row === now.row && start.col === now.col) {
        this.history.pop();
        this.moves--;
        this.nudgeIdx = -1;
      }
    }

    this.syncVehiclePositions();
    this.updateHUD();

    if (res.escaped) {
      this.handleWin(idx);
    } else {
      this.announce(`Moves: ${this.moves}.`);
      sound.playSlide();
    }
  }

  handleWin(heroIdx) {
    this.won = true;
    sound.playWin();

    const heroEl = this.vehiclesLayerEl.children[heroIdx];
    if (heroEl) {
      heroEl.classList.add('escaped');
      heroEl.style.left = `${(this.currentLevel.cols + 0.6) * this.cellSize}px`;
    }

    const par = this.currentLevel.par;
    const stars = this.moves <= par ? 3 : this.moves <= Math.ceil(par * 1.45) ? 2 : 1;

    // Save best score
    const lvlId = this.currentLevel.id;
    const prev = this.progress[lvlId];
    if (!prev || this.moves < prev.bestMoves) {
      this.progress[lvlId] = { bestMoves: this.moves, stars };
      this.saveProgress();
    } else if (stars > prev.stars) {
      this.progress[lvlId].stars = stars;
      this.saveProgress();
    }

    this.updateHUD();
    this.announce(`Red Jeep escaped in ${this.moves} moves. ${stars} of 3 stars.`);

    setTimeout(() => {
      this.winStarsEl.textContent = '★'.repeat(stars) + '☆'.repeat(3 - stars);
      this.winStarsEl.setAttribute('aria-label', `${stars} of 3 stars`);
      this.winSubtitleEl.textContent = `Cleared in ${this.moves} moves (Par ${par})`;
      this.openModal(this.modalWin, this.btnWinNext);
    }, 520);
  }

  showHint() {
    if (this.won) return;
    this.clearHint();

    const { rows, cols } = this.currentLevel;
    const hint = getNextHint(rows, cols, this.vehicles);
    if (!hint) {
      this.announce('No hint available from this position.');
      return;
    }

    sound.playHint();
    const v = this.vehicles[hint.vehicleIndex];
    const el = this.vehiclesLayerEl.children[hint.vehicleIndex];
    if (el) el.classList.add('hint-active');

    // Select the hinted vehicle so keyboard players can act on it right away.
    const keepFocus = this.vehiclesLayerEl.contains(document.activeElement);
    this.selectVehicle(hint.vehicleIndex);
    if (keepFocus) this.focusSelectedVehicle();

    const cs = this.cellSize;
    const targetRow = v.dir === 'v' ? hint.toPos : v.row;
    const targetCol = v.dir === 'h' ? hint.toPos : v.col;

    this.hintGhostEl.style.left = `${targetCol * cs + 4}px`;
    this.hintGhostEl.style.top = `${targetRow * cs + 4}px`;
    this.hintGhostEl.style.width = `${(v.dir === 'h' ? v.len : 1) * cs - 8}px`;
    this.hintGhostEl.style.height = `${(v.dir === 'v' ? v.len : 1) * cs - 8}px`;
    this.hintGhostEl.classList.remove('hidden');

    const dirWord =
      v.dir === 'h' ? (hint.toPos > hint.fromPos ? 'right' : 'left') : hint.toPos > hint.fromPos ? 'down' : 'up';
    const dist = Math.abs(hint.toPos - hint.fromPos);
    this.announce(`Hint: move the ${vehicleName(v)} ${dirWord} ${dist} ${dist === 1 ? 'space' : 'spaces'}.`);
  }

  clearHint() {
    this.hintGhostEl.classList.add('hidden');
    Array.from(this.vehiclesLayerEl.children).forEach((el) => {
      el.classList.remove('hint-active');
    });
  }

  /** Post a message to the screen-reader live region. */
  announce(text) {
    if (!this.statusEl) return;
    this.statusEl.textContent = '';
    // Re-set on the next frame so repeated identical messages are still read.
    requestAnimationFrame(() => {
      this.statusEl.textContent = text;
    });
  }

  updateHUD() {
    const lvl = this.currentLevel;
    this.hudTierEl.textContent = lvl.difficulty;
    this.hudLevelNameEl.textContent = `${this.levelIndex + 1}. ${lvl.name}`;
    this.hudGridSizeEl.textContent = `${lvl.rows}×${lvl.cols} ${lvl.rows === lvl.cols ? 'Square' : 'Rectangle'} Lot`;
    this.hudMovesEl.textContent = String(this.moves);
    this.hudParEl.textContent = String(lvl.par);

    const saved = this.progress[lvl.id];
    this.hudBestEl.textContent = saved ? String(saved.bestMoves) : '—';

    this.btnUndo.disabled = this.history.length === 0 || this.won;
  }

  openLevelsModal() {
    this.levelsListEl.innerHTML = '';
    const tiers = ['Starter', 'City Grid', 'Freight Yard', 'Master Jam'];
    let activeCard = null;

    for (const tier of tiers) {
      const group = document.createElement('div');
      const title = document.createElement('div');
      title.className = 'tier-group-title';
      title.textContent = tier;
      group.appendChild(title);

      const grid = document.createElement('div');
      grid.className = 'tier-grid';

      LEVELS.forEach((lvl, idx) => {
        if (lvl.difficulty !== tier) return;
        const saved = this.progress[lvl.id];
        const card = document.createElement('button');
        card.type = 'button';
        card.className = 'level-card' + (idx === this.levelIndex ? ' active' : '');
        if (idx === this.levelIndex) {
          card.setAttribute('aria-current', 'true');
          activeCard = card;
        }
        card.setAttribute(
          'aria-label',
          `Level ${idx + 1}, ${lvl.name}, ${lvl.rows} by ${lvl.cols}, par ${lvl.par}, ` +
            (saved ? `best ${saved.bestMoves} moves, ${saved.stars} of 3 stars` : 'unsolved')
        );

        const starsStr = saved ? '★'.repeat(saved.stars) + '☆'.repeat(3 - saved.stars) : '☆☆☆';
        card.innerHTML = `
          <div class="level-card-top">
            <span>#${idx + 1} · ${lvl.rows}×${lvl.cols}</span>
            <span class="level-card-stars">${starsStr}</span>
          </div>
          <div class="level-card-name">${lvl.name}</div>
          <div class="level-card-top">
            <span>Par ${lvl.par}</span>
            <span>${saved ? `Best ${saved.bestMoves}` : 'Unsolved'}</span>
          </div>
        `;
        card.addEventListener('click', () => {
          this.closeModal(this.modalLevels, false);
          this.loadLevel(idx);
          this.focusSelectedVehicle();
        });
        grid.appendChild(card);
      });

      group.appendChild(grid);
      this.levelsListEl.appendChild(group);
    }

    this.openModal(this.modalLevels, activeCard);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new BlockPowerApp();
});
