/**
 * Top-down SVG vehicle artwork generator for Block Power.
 * Renders Red Jeep (hero), Jeeps, Residential Trucks, and Commercial Trucks.
 */

const PALETTES = {
  hero: {
    body: '#e11d48',
    dark: '#9f1239',
    light: '#fb7185',
    accent: '#fef08a',
  },
  slate: {
    body: '#475569',
    dark: '#1e293b',
    light: '#94a3b8',
    accent: '#f59e0b',
  },
  forest: {
    body: '#15803d',
    dark: '#14532d',
    light: '#4ade80',
    accent: '#fde047',
  },
  cobalt: {
    body: '#2563eb',
    dark: '#1e3a8a',
    light: '#60a5fa',
    accent: '#bae6fd',
  },
  amber: {
    body: '#d97706',
    dark: '#78350f',
    light: '#fbbf24',
    accent: '#fef3c7',
  },
  teal: {
    body: '#0d9488',
    dark: '#134e4a',
    light: '#2dd4bf',
    accent: '#ccfbf1',
  },
  indigo: {
    body: '#4f46e5',
    dark: '#312e81',
    light: '#818cf8',
    accent: '#e0e7ff',
  },
  lime: {
    body: '#65a30d',
    dark: '#365314',
    light: '#a3e635',
    accent: '#ecfccb',
  },
  violet: {
    body: '#7c3aed',
    dark: '#4c1d95',
    light: '#a78bfa',
    accent: '#ede9fe',
  },
};

/**
 * Render an inline SVG string for a vehicle.
 * Uses canonical horizontal dimensions (len * 100 x 100) and rotates 90deg for vertical vehicles.
 *
 * @param {import('./engine.js').Vehicle} v
 * @returns {string}
 */
export function renderVehicleSVG(v) {
  const palette = v.category === 'hero' ? PALETTES.hero : PALETTES[v.color] || PALETTES.cobalt;
  const W = v.len * 100;
  const H = 100;
  const vbW = v.dir === 'h' ? W : H;
  const vbH = v.dir === 'h' ? H : W;

  const inner = buildHorizontalBody(v, palette, W, H);
  const group =
    v.dir === 'h'
      ? inner
      : `<g transform="translate(${H}, 0) rotate(90)">${inner}</g>`;

  return `<svg viewBox="0 0 ${vbW} ${vbH}" width="100%" height="100%" preserveAspectRatio="none" aria-hidden="true">${group}</svg>`;
}

/**
 * Draw canonical horizontal vehicle facing right (+x).
 */
function buildHorizontalBody(v, p, W, H) {
  const padY = 10;
  const padX = 8;
  const bodyW = W - padX * 2;
  const bodyH = H - padY * 2;

  // Tires (4 wheels for 2-cell, 6 wheels for 3-cell)
  const wheelPositions = v.len === 3 ? [28, W * 0.52, W - 36] : [30, W - 38];
  const wheels = wheelPositions
    .map(
      (wx) => `
      <rect x="${wx - 11}" y="4" width="22" height="9" rx="3" fill="#0f172a"/>
      <rect x="${wx - 11}" y="${H - 13}" width="22" height="9" rx="3" fill="#0f172a"/>`
    )
    .join('');

  if (v.category === 'hero' || v.category === 'jeep') {
    const isHero = v.category === 'hero';
    return `
      ${wheels}
      <!-- Rear spare tire -->
      <rect x="2" y="34" width="9" height="32" rx="4" fill="#1e293b" stroke="#0f172a" stroke-width="1.5"/>
      <!-- Chassis -->
      <rect x="${padX + 2}" y="${padY}" width="${bodyW - 4}" height="${bodyH}" rx="14" fill="${p.body}" stroke="${p.dark}" stroke-width="3"/>
      <!-- Hood lines -->
      <rect x="${W - 56}" y="${padY + 8}" width="38" height="${bodyH - 16}" rx="6" fill="${p.light}" opacity="0.28"/>
      <!-- Windshield -->
      <rect x="${W - 76}" y="${padY + 9}" width="22" height="${bodyH - 18}" rx="5" fill="#0f172a" opacity="0.82"/>
      <!-- Roof & Roll cage -->
      <rect x="24" y="${padY + 9}" width="${W - 104}" height="${bodyH - 18}" rx="8" fill="${p.dark}" opacity="0.45"/>
      <line x1="36" y1="${padY + 14}" x2="${W - 84}" y2="${padY + 14}" stroke="${p.light}" stroke-width="3" stroke-linecap="round" opacity="0.65"/>
      <line x1="36" y1="${H - padY - 14}" x2="${W - 84}" y2="${H - padY - 14}" stroke="${p.light}" stroke-width="3" stroke-linecap="round" opacity="0.65"/>
      <!-- Headlights -->
      <rect x="${W - 14}" y="20" width="6" height="14" rx="2.5" fill="${p.accent}"/>
      <rect x="${W - 14}" y="${H - 34}" width="6" height="14" rx="2.5" fill="${p.accent}"/>
      <!-- Taillights -->
      <rect x="${padX + 2}" y="18" width="5" height="13" rx="2" fill="#fca5a5" opacity="0.85"/>
      <rect x="${padX + 2}" y="${H - 31}" width="5" height="13" rx="2" fill="#fca5a5" opacity="0.85"/>
      ${
        isHero
          ? `<polygon points="${W * 0.43},36 ${W * 0.46},45 ${W * 0.55},45 ${W * 0.48},51 ${W * 0.51},60 ${W * 0.43},54 ${W * 0.35},60 ${W * 0.38},51 ${W * 0.31},45 ${W * 0.40},45" fill="#fef08a" opacity="0.95"/>`
          : ''
      }
    `;
  }

  if (v.category === 'residential') {
    // Residential Pickup Truck (len 2) or Utility Camper Van (len 3)
    const bedWidth = v.len === 3 ? W * 0.52 : W * 0.38;
    return `
      ${wheels}
      <!-- Main Truck Body -->
      <rect x="${padX}" y="${padY}" width="${bodyW}" height="${bodyH}" rx="11" fill="${p.body}" stroke="${p.dark}" stroke-width="3"/>
      <!-- Open Pickup Bed / Residential Cargo -->
      <rect x="${padX + 7}" y="${padY + 8}" width="${bedWidth}" height="${bodyH - 16}" rx="5" fill="#1e293b" opacity="0.72"/>
      <line x1="${padX + 16}" y1="${padY + 14}" x2="${padX + bedWidth - 2}" y2="${padY + 14}" stroke="#475569" stroke-width="2.5"/>
      <line x1="${padX + 16}" y1="${H / 2}" x2="${padX + bedWidth - 2}" y2="${H / 2}" stroke="#475569" stroke-width="2.5"/>
      <line x1="${padX + 16}" y1="${H - padY - 14}" x2="${padX + bedWidth - 2}" y2="${H - padY - 14}" stroke="#475569" stroke-width="2.5"/>
      <!-- Cab Roof -->
      <rect x="${padX + bedWidth + 14}" y="${padY + 8}" width="${bodyW - bedWidth - 46}" height="${bodyH - 16}" rx="6" fill="${p.light}" opacity="0.35"/>
      <!-- Windshield -->
      <rect x="${W - 46}" y="${padY + 8}" width="18" height="${bodyH - 16}" rx="4" fill="#0f172a" opacity="0.85"/>
      <!-- Headlights -->
      <rect x="${W - 13}" y="18" width="5" height="14" rx="2" fill="${p.accent}"/>
      <rect x="${W - 13}" y="${H - 32}" width="5" height="14" rx="2" fill="${p.accent}"/>
    `;
  }

  // Commercial Truck (3-cell heavy freight / box truck)
  const trailerW = W - 82;
  return `
    ${wheels}
    <!-- Cab -->
    <rect x="${W - 76}" y="${padY + 3}" width="66" height="${bodyH - 6}" rx="10" fill="${p.dark}" stroke="#0f172a" stroke-width="2.5"/>
    <!-- Cab Windshield -->
    <rect x="${W - 34}" y="${padY + 10}" width="17" height="${bodyH - 20}" rx="4" fill="#38bdf8" opacity="0.75"/>
    <!-- Headlights -->
    <rect x="${W - 14}" y="19" width="5" height="13" rx="2" fill="#fef08a"/>
    <rect x="${W - 14}" y="${H - 32}" width="5" height="13" rx="2" fill="#fef08a"/>
    <!-- Cargo Trailer -->
    <rect x="${padX}" y="${padY - 1}" width="${trailerW}" height="${bodyH + 2}" rx="7" fill="${p.body}" stroke="${p.dark}" stroke-width="3"/>
    <!-- Ribbed Cargo Panels -->
    <rect x="${padX + 10}" y="${padY + 9}" width="${trailerW - 20}" height="${bodyH - 18}" rx="4" fill="${p.light}" opacity="0.22"/>
    <line x1="${padX + trailerW * 0.25}" y1="${padY + 6}" x2="${padX + trailerW * 0.25}" y2="${H - padY - 6}" stroke="${p.dark}" stroke-width="2.5" opacity="0.45"/>
    <line x1="${padX + trailerW * 0.5}" y1="${padY + 6}" x2="${padX + trailerW * 0.5}" y2="${H - padY - 6}" stroke="${p.dark}" stroke-width="2.5" opacity="0.45"/>
    <line x1="${padX + trailerW * 0.75}" y1="${padY + 6}" x2="${padX + trailerW * 0.75}" y2="${H - padY - 6}" stroke="${p.dark}" stroke-width="2.5" opacity="0.45"/>
    <!-- Company Stripe -->
    <rect x="${padX + 12}" y="${H / 2 - 4}" width="${trailerW - 24}" height="8" rx="3" fill="${p.accent}" opacity="0.85"/>
  `;
}
