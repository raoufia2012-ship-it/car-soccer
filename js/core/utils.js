'use strict';

/* ============================================================
   UTILS — small math and drawing helpers used everywhere.
   ============================================================ */

const rand = (a, b) => a + Math.random() * (b - a);
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

function circle(x, y, r) { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); }

function rr(x, y, w, h, r) { // rounded rectangle
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function bigText(txt, x, y, size, fill, strokeW) { // big outlined text
  ctx.save();
  ctx.font = '900 ' + size + 'px Impact, "Segoe UI", sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.lineWidth = strokeW || Math.max(3, size / 10);
  ctx.strokeStyle = '#000';
  ctx.strokeText(txt, x, y);
  ctx.fillStyle = fill;
  ctx.fillText(txt, x, y);
  ctx.restore();
}

/* wraps a text into several lines so it fits in maxWidth
   (uses whatever font the caller already set on ctx) */
function wrapText(text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  for (const w of words) {
    const test = line ? line + ' ' + w : w;
    if (line && ctx.measureText(test).width > maxWidth) { lines.push(line); line = w; }
    else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

function shake(dur, mag) { shakeT = dur; shakeDur = dur; shakeMag = mag; }

/* progress 0..1 → slightly overshoots 1 then settles back: gives the
   "suspension"/bounce feel to elements arriving on screen (menus). */
function easeOutBack(x) {
  const c1 = 1.70158, c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}

/* small stat bar (label + 5 segments) for the character select screen */
function drawStatBar(x, y, w, label, value, color) {
  ctx.font = 'bold 12px "Segoe UI"'; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  ctx.fillText(label, x, y);
  const by = y + 8, bh = 9, seg = 5, gap = 3;
  for (let i = 0; i < seg; i++) {
    const sx = x + i * (w / seg);
    ctx.fillStyle = i < value ? color : 'rgba(255,255,255,0.15)';
    rr(sx, by, w / seg - gap, bh, 2); ctx.fill();
  }
}
