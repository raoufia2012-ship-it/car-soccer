'use strict';

/* ============================================================
   CHARACTER SELECT — country picker with ◀ ▶ arrows.
   Vs AI: one big picker. 2 players: TWO pickers side by side.
   ============================================================ */

/* ----- COSMETIC body stats (select screen only) -----
   Purely informative: NEVER influences the real physics (identical
   for every car, see game/car-physics.js). It just gives each car
   style some character on the select screen. Scale 1-5. */
const CAR_STATS = {
  speed:   { label: 'SUPERCAR',   speed: 5, accel: 3, boost: 4, control: 3 },
  muscle:  { label: 'MUSCLE CAR', speed: 3, accel: 5, boost: 3, control: 3 },
  formula: { label: 'FORMULA',    speed: 5, accel: 4, boost: 3, control: 5 },
  buggy:   { label: 'BUGGY',      speed: 3, accel: 4, boost: 3, control: 5 },
  suv:     { label: '4x4',        speed: 2, accel: 3, boost: 4, control: 4 },
  limo:    { label: 'LIMOUSINE',  speed: 4, accel: 2, boost: 5, control: 2 }
};
const RANK_INFO = {
  legend: { label: '⭐ LEGEND', color: '#ffd700' },
  pro:    { label: '🔷 PRO', color: '#cfe0ff' },
  normal: { label: 'NORMAL', color: '#9aa5c0' }
};

let chooseMode = 'ai';
let chooseIdx = [0, 1]; // P1's and P2's selection index

// picker ORDER: FRANCE first, then ARGENTINA, then the countries
// with the biggest fanbases, the classics at the end
const CHOOSE_ORDER = [
  'mbappe',       // 🇫🇷 FRANCE
  'messi',        // 🇦🇷 ARGENTINA
  'ronaldo',      // 🇵🇹 PORTUGAL
  'neymar',       // 🇧🇷 BRAZIL
  'kane',         // 🏴 ENGLAND
  'haaland',      // 🇳🇴 NORWAY
  'son',          // 🇰🇷 SOUTH KOREA
  'modric',       // 🇭🇷 CROATIA
  'vandijk',      // 🇳🇱 NETHERLANDS
  'lewandowski',  // 🇵🇱 POLAND
  'pedri',        // 🇪🇸 SPAIN
  'hakimi',       // 🇲🇦 MOROCCO
  'mane',         // 🇸🇳 SENEGAL
  'mitoma',       // 🇯🇵 JAPAN
  'pulisic',      // 🇺🇸 USA
  'shaqiri',      // 🇨🇭 SWITZERLAND
  'ryan',         // 🇦🇺 AUSTRALIA
  'mobutu',       // 🇨🇩 ZAIRE 👑
  'classic', 'classic2'
];
function chooseIds() {
  // (players added later that aren't in the list go at the end)
  return CHOOSE_ORDER.filter(id => PLAYERS[id])
    .concat(Object.keys(PLAYERS).filter(k => !CHOOSE_ORDER.includes(k)));
}

/* special effect (particles) when a LEGEND character is shown —
   fired ONCE per selection change, never continuously: zero cost
   the rest of the time, so no mobile performance concern. */
function pickFX(who) {
  const ids = chooseIds();
  const pl = PLAYERS[ids[chooseIdx[who]]];
  if (pl.tier !== 'legend') return;
  const cxc = chooseMode === '2p' ? (who === 0 ? W * 0.26 : W * 0.74) : W / 2;
  const cy = chooseMode === '2p' ? 415 : 430;
  burst(cxc, cy, pl.neon, 8, 200);
  burst(cxc, cy, '#ffd700', 6, 160);
}

function openChoose(m) {
  chooseMode = m;
  chooseIdx = [0, 1];
  choosePickT = [0, 0];
  scene = 'choose';
  sfx('click');
  pickFX(0);
  if (m === '2p') pickFX(1);
}
function chooseMove(who, d) {
  const n = chooseIds().length;
  chooseIdx[who] = (chooseIdx[who] + d + n) % n;
  choosePickT[who] = 0; // restart the car arrival animation
  sfx('click');
  pickFX(who);
}
// keyboard keys on the select screen
function chooseKey(k) {
  if (chooseMode === '2p') {
    if (k === 'a' || k === 'q') chooseMove(0, -1);
    if (k === 'd') chooseMove(0, 1);
    if (k === 'arrowleft') chooseMove(1, -1);
    if (k === 'arrowright') chooseMove(1, 1);
  } else {
    if (k === 'arrowleft' || k === 'a' || k === 'q') chooseMove(0, -1);
    if (k === 'arrowright' || k === 'd') chooseMove(0, 1);
  }
}
function chooseConfirm() {
  const ids = chooseIds();
  p1Char = ids[chooseIdx[0]];
  if (chooseMode === '2p') {
    p2Char = ids[chooseIdx[1]];
    // if both picked the same country, P2 takes the next one
    if (p2Char === p1Char) p2Char = ids[(chooseIdx[1] + 1) % ids.length];
  } else {
    // the AI takes another country at random
    const others = ids.filter(k => k !== p1Char && !k.startsWith('classic'));
    p2Char = others.length ? pick(others) : (p1Char === 'classic2' ? 'classic' : 'classic2');
  }
  // preparation screen before kickoff (see drawVS): shows both cars,
  // gives time to read, and waits for a real click on START
  vsPending = chooseMode;
  prepLaunchT = -1;
  scene = 'vs';
  sfx('click');
}

/* back to the select screen FROM the preparation screen: the selection
   already made is kept (unlike openChoose which starts over) */
function backToChoose() {
  scene = 'choose';
  sfx('click');
}

function drawChoose(t) {
  drawArena(t);
  ctx.fillStyle = 'rgba(0,0,0,0.62)'; ctx.fillRect(0, 0, W, H);

  if (chooseMode === '2p') { drawChoose2P(t); return; }

  const ids = chooseIds();
  const pl = PLAYERS[ids[chooseIdx[0]]];
  const tier = pl.tier || 'normal';
  const rank = RANK_INFO[tier];
  const legend = tier === 'legend';
  const cstat = CAR_STATS[pl.carShape || 'speed'];

  // arrival animation progress (0 → 1) since the last change
  const e = Math.min(1, choosePickT[0] / 0.45);
  const bounce = easeOutBack(e);   // suspension: slight overshoot then settle
  const flagE = clamp((choosePickT[0] - 0.06) / 0.3, 0, 1);

  /* ----- TOP: the country (flag dropping into place + name) ----- */
  ctx.save();
  ctx.globalAlpha = flagE;
  pl.drawFlag(W / 2 - 90, 46 - (1 - flagE) * 24, 180, 105);
  ctx.restore();
  bigText(pl.country, W / 2, 190, 44, pl.neon);
  bigText(pl.name + (pl.number ? ' · ' + pl.number : ''), W / 2, 240, 30, '#fff', 4);
  // rank (LEGEND / PRO / NORMAL)
  ctx.font = '900 18px "Segoe UI"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillStyle = rank.color;
  ctx.fillText(rank.label, W / 2, 268);

  /* ----- CENTER: the car on its glowing podium ----- */
  // halo in the country's color (stronger and wider for a LEGEND)
  const glowR = legend ? 260 : 220, glowA = legend ? '88' : '55';
  const glow = ctx.createRadialGradient(W / 2, 430, 20, W / 2, 430, glowR);
  glow.addColorStop(0, pl.neon + glowA);
  glow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(W / 2 - glowR, 240 - (legend ? 20 : 0), glowR * 2, 320 + (legend ? 40 : 0));
  // extra pulsing halo reserved for LEGENDS: a spectacular presentation
  if (legend) {
    ctx.globalAlpha = 0.25 + 0.15 * Math.sin(t * 5);
    ctx.strokeStyle = pl.neon; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.ellipse(W / 2, 496, 210 + Math.sin(t * 5) * 6, 30, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.globalAlpha = 1;
    // a few subtle sparks drifting up (zero cost: no global particles)
    for (let i = 0; i < 5; i++) {
      const sp = (t * 0.6 + i / 5) % 1;
      ctx.globalAlpha = (1 - sp) * 0.5;
      ctx.fillStyle = i % 2 ? pl.neon : '#ffd700';
      circle(W / 2 + Math.sin(i * 2.1 + t) * 160, 500 - sp * 260, 2.5); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
  // podium
  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  ctx.beginPath(); ctx.ellipse(W / 2, 496, 200, 26, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = pl.neon; ctx.lineWidth = 2; ctx.globalAlpha = 0.6;
  ctx.beginPath(); ctx.ellipse(W / 2, 496, 200, 26, 0, 0, Math.PI * 2); ctx.stroke();
  ctx.globalAlpha = 1;
  // the car SLIDES in (with a little suspension bounce), then keeps
  // gently bobbing once parked, like before
  const dummy = makeCar(0, false, pl.id);
  dummy.x = 0;
  dummy.y = FLOOR - 18 - Math.abs(Math.sin(t * 3)) * 10;
  dummy.onGround = false;
  ctx.save();
  ctx.translate(W / 2 + (1 - bounce) * 260, 430);
  ctx.scale(2.7, 2.7);
  ctx.translate(0, -(FLOOR - 18));
  drawCar(dummy, t);
  ctx.restore();
  // the little driver, standing on the podium next to his car, waves hello
  drawPlayerFigure(pl, W / 2 + 110, 500, 1.1, t);

  /* ----- LEFT PANEL: body stats ----- */
  ctx.textAlign = 'left';
  ctx.font = '900 14px "Segoe UI"'; ctx.fillStyle = pl.neon;
  ctx.fillText(cstat.label, 46, 300);
  drawStatBar(46, 330, 168, 'SPEED', cstat.speed, pl.neon);
  drawStatBar(46, 368, 168, 'ACCEL', cstat.accel, pl.neon);
  drawStatBar(46, 406, 168, 'BOOST', cstat.boost, pl.neon);
  drawStatBar(46, 444, 168, 'CONTROL', cstat.control, pl.neon);

  /* ----- RIGHT PANEL: fun fact ----- */
  if (pl.fact) {
    ctx.font = 'italic 14px "Segoe UI"'; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    const lines = wrapText('"' + pl.fact + '"', 170);
    lines.forEach((line, i) => ctx.fillText(line, 984, 330 + i * 20));
  }

  /* ----- THE 2 ARROWS ◀ ▶ ----- */
  for (const side of [-1, 1]) {
    const ax = W / 2 + side * 330, ay = 400;
    const hover = Math.hypot(mouse.x - ax, mouse.y - ay) < 46;
    ctx.fillStyle = hover ? '#ffd200' : 'rgba(255,255,255,0.12)';
    circle(ax, ay, 44); ctx.fill();
    ctx.strokeStyle = hover ? '#fff' : 'rgba(255,255,255,0.5)'; ctx.lineWidth = 3;
    circle(ax, ay, 44); ctx.stroke();
    bigText(side < 0 ? '◀' : '▶', ax, ay + 2, 38, hover ? '#111' : '#fff', 3);
    clickRegions.push({ x: ax - 46, y: ay - 46, w: 92, h: 92, fn: () => chooseMove(0, side) });
  }

  // position in the list (e.g. 3 / 18)
  ctx.font = 'bold 15px "Segoe UI"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.fillText((chooseIdx[0] + 1) + ' / ' + ids.length, W / 2, 540);

  /* ----- BOTTOM: confirm or go back ----- */
  drawButton(W / 2 - 130, H - 120, 260, 56, '✔ SELECT', chooseConfirm, true);
  drawButton(W / 2 - 100, H - 54, 200, 42, '← BACK', backToMenu);
}

/* ----- 2-PLAYER MODE: two pickers side by side ----- */
function drawChoose2P(t) {
  const ids = chooseIds();
  bigText('CHOOSE YOUR COUNTRIES!', W / 2, 44, 36, '#fff');
  // divider line in the middle
  ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(W / 2, 80); ctx.lineTo(W / 2, H - 140); ctx.stroke();

  for (let who = 0; who < 2; who++) {
    const cxc = who === 0 ? W * 0.26 : W * 0.74; // panel center
    const pl = PLAYERS[ids[chooseIdx[who]]];
    const tag = who === 0 ? '#2979ff' : '#ff9100';
    const tier = pl.tier || 'normal';
    const rank = RANK_INFO[tier];
    const legend = tier === 'legend';
    const cstat = CAR_STATS[pl.carShape || 'speed'];

    // THIS player's arrival animation progress (0 → 1)
    const e = Math.min(1, choosePickT[who] / 0.4);
    const bounce = easeOutBack(e);
    const flagE = clamp((choosePickT[who] - 0.05) / 0.28, 0, 1);
    const side = who === 0 ? 1 : -1; // arrives from the outer edge of its panel

    // PLAYER 1 / PLAYER 2 tag
    bigText(who === 0 ? 'PLAYER 1' : 'PLAYER 2', cxc, 92, 26, tag, 4);
    // flag (fade-in) + country at the top
    ctx.save(); ctx.globalAlpha = flagE;
    pl.drawFlag(cxc - 65, 112 - (1 - flagE) * 16, 130, 76);
    ctx.restore();
    bigText(pl.country, cxc, 214, 26, pl.neon, 4);
    bigText(pl.name + (pl.number ? ' · ' + pl.number : ''), cxc, 248, 20, '#fff', 3);
    ctx.font = '900 13px "Segoe UI"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = rank.color; ctx.fillText(rank.label, cxc, 266);

    // halo (stronger for a LEGEND) + car sliding in
    const glowR = legend ? 190 : 160;
    const glow = ctx.createRadialGradient(cxc, 390, 15, cxc, 390, glowR);
    glow.addColorStop(0, pl.neon + (legend ? '66' : '44'));
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(cxc - glowR, 275, glowR * 2, 195);
    if (legend) { // a few subtle sparks, zero cost (no global particles)
      for (let i = 0; i < 3; i++) {
        const sp = (t * 0.6 + i / 3 + who * 0.3) % 1;
        ctx.globalAlpha = (1 - sp) * 0.5;
        ctx.fillStyle = i % 2 ? pl.neon : '#ffd700';
        circle(cxc + Math.sin(i * 2.3 + t + who) * 110, 460 - sp * 190, 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
    const dummy = makeCar(0, false, pl.id);
    dummy.x = 0;
    dummy.y = FLOOR - 18 - Math.abs(Math.sin(t * 3 + who)) * 8;
    dummy.onGround = false;
    ctx.save();
    ctx.translate(cxc + (1 - bounce) * side * 170, 390);
    ctx.scale(1.6, 1.6);
    ctx.translate(0, -(FLOOR - 18));
    drawCar(dummy, t);
    ctx.restore();

    // the panel's ◀ ▶ arrows
    for (const arrSide of [-1, 1]) {
      const ax = cxc + arrSide * 190, ay = 370;
      const hover = Math.hypot(mouse.x - ax, mouse.y - ay) < 36;
      ctx.fillStyle = hover ? '#ffd200' : 'rgba(255,255,255,0.12)';
      circle(ax, ay, 34); ctx.fill();
      ctx.strokeStyle = hover ? '#fff' : 'rgba(255,255,255,0.5)'; ctx.lineWidth = 2.5;
      circle(ax, ay, 34); ctx.stroke();
      bigText(arrSide < 0 ? '◀' : '▶', ax, ay + 2, 28, hover ? '#111' : '#fff', 3);
      clickRegions.push({ x: ax - 36, y: ay - 36, w: 72, h: 72, fn: () => chooseMove(who, arrSide) });
    }

    // compact mini stats (2×2) + short fun fact
    drawStatBar(cxc - 108, 480, 96, 'SPD', cstat.speed, pl.neon);
    drawStatBar(cxc + 12, 480, 96, 'ACC', cstat.accel, pl.neon);
    drawStatBar(cxc - 108, 502, 96, 'BST', cstat.boost, pl.neon);
    drawStatBar(cxc + 12, 502, 96, 'CTL', cstat.control, pl.neon);
    if (pl.fact) {
      ctx.font = 'italic 11px "Segoe UI"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillStyle = 'rgba(255,255,255,0.75)';
      ctx.fillText(wrapText('"' + pl.fact + '"', 230)[0], cxc, 524);
    }
    // each player's keys reminder
    ctx.font = 'bold 13px "Segoe UI"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.fillText(who === 0 ? 'A / D to change' : '← / → to change', cxc, 541);
  }

  drawButton(W / 2 - 130, H - 118, 260, 56, '▶ PLAY!', chooseConfirm, true);
  drawButton(W / 2 - 100, H - 52, 200, 42, '← BACK', backToMenu);
}
