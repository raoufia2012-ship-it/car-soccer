'use strict';

/* ============================================================
   PLAYERS REGISTRY — every playable character lives in PLAYERS.
   Each player brings a car color scheme, a country, a flag drawn
   in code, and the neon color of their goal. The two "classic"
   cars below are the default picks.

   To add a player: copy js/players/ronaldo.js, change the colors
   and the flag, then add the file to index.html.
   ============================================================ */

const PLAYERS = {};
let p1Char = 'classic', p2Char = 'classic2'; // currently selected characters

PLAYERS.classic = {
  id: 'classic', name: 'CLASSIC', country: 'CAR SOCCER', number: '',
  body: '#2979ff', accent: '#0d47a1', neon: '#19c5ff',
  fact: 'The original car soccer icon — no country, all attitude.',
  drawFlag(x, y, w, h) {
    ctx.fillStyle = '#2979ff'; ctx.fillRect(x, y, w, h);
    ctx.fillStyle = '#fff'; circle(x + w / 2, y + h / 2, h * 0.28); ctx.fill();
    ctx.fillStyle = '#222'; circle(x + w / 2, y + h / 2, h * 0.1); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);
  }
};
PLAYERS.classic2 = {
  id: 'classic2', name: 'CLASSIC', country: 'CAR SOCCER', number: '',
  body: '#ff9100', accent: '#bf360c', neon: '#ff9100',
  fact: 'Orange and proud. Rival to the Classic since day one.',
  drawFlag(x, y, w, h) {
    ctx.fillStyle = '#ff9100'; ctx.fillRect(x, y, w, h);
    ctx.fillStyle = '#fff'; circle(x + w / 2, y + h / 2, h * 0.28); ctx.fill();
    ctx.fillStyle = '#222'; circle(x + w / 2, y + h / 2, h * 0.1); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);
  }
};

/* ----- shorthand to declare a national player ----- */
function WC(id, name, number, country, body, accent, neon, drawFlag) {
  PLAYERS[id] = { id, name, number, country, body, accent, neon, drawFlag };
}

/* ----- flag helpers: horizontal / vertical stripes + border ----- */
function flagBorder(x, y, w, h) {
  ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.lineWidth = 2;
  ctx.strokeRect(x, y, w, h);
}
function hBands(x, y, w, h, cols) { // horizontal stripes
  cols.forEach((c, i) => {
    ctx.fillStyle = c;
    ctx.fillRect(x, y + h * i / cols.length, w, h / cols.length + 0.5);
  });
  flagBorder(x, y, w, h);
}
function vBands(x, y, w, h, cols) { // vertical stripes
  cols.forEach((c, i) => {
    ctx.fillStyle = c;
    ctx.fillRect(x + w * i / cols.length, y, w / cols.length + 0.5, h);
  });
  flagBorder(x, y, w, h);
}

/* filled / outlined stars, used by flags and world-champion decals */
function drawStar(cx, cy, r) {
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const a = -Math.PI / 2 + i * Math.PI * 2 / 5;
    const a2 = a + Math.PI / 5;
    ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
    ctx.lineTo(cx + Math.cos(a2) * r * 0.45, cy + Math.sin(a2) * r * 0.45);
  }
  ctx.closePath(); ctx.fill();
}
function strokeStar(cx, cy, r) {
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const a = -Math.PI / 2 + i * Math.PI * 2 / 5;
    const a2 = a + Math.PI / 5;
    ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
    ctx.lineTo(cx + Math.cos(a2) * r * 0.45, cy + Math.sin(a2) * r * 0.45);
  }
  ctx.closePath(); ctx.stroke();
}
