'use strict';

/* ============================================================
   PLAYER: RONALDO 🇵🇹
   His car, his colors, his flag and his goals, all in PORTUGAL
   style. (To add a player: copy this file, change the colors
   and the flag, and add it to index.html.)
   ============================================================ */

PLAYERS.ronaldo = {
  id: 'ronaldo',
  name: 'RONALDO',
  country: 'PORTUGAL',
  number: '7',

  /* car colors */
  body: '#d32f2f',      // Portugal red
  accent: '#0a6b3d',    // Portugal green
  /* neon color of HIS goal */
  neon: '#ff4545',

  /* the star's look */
  skin: '#d9a066',
  hair: '#14100a',
  hairStyle: 'quiff',  // his strict cut with the front quiff
  carShape: 'muscle',  // the Comandante's muscle car

  /* prestige: he is a LEGEND (gold trim + neon on the car) */
  tier: 'legend',
  wc: 0,

  /* fun fact shown on the character select screen */
  fact: 'Never skips leg day. Or a header.',

  /* the REAL Portuguese flag: green 2/5, red 3/5, yellow armillary
     sphere (a ring, not a disc!) + white shield with a red border */
  drawFlag(x, y, w, h) {
    // green stripe (2/5) and red stripe (3/5)
    ctx.fillStyle = '#046a38';
    ctx.fillRect(x, y, w * 0.4, h);
    ctx.fillStyle = '#da291c';
    ctx.fillRect(x + w * 0.4, y, w * 0.6, h);

    const cx2 = x + w * 0.4, cy2 = y + h / 2, r = h * 0.27;
    // ARMILLARY SPHERE: big yellow ring (not a filled disc!)
    ctx.strokeStyle = '#ffe900'; ctx.lineWidth = Math.max(2, h * 0.07);
    circle(cx2, cy2, r); ctx.stroke();
    // ... crossed by a tilted ring
    ctx.lineWidth = Math.max(1.5, h * 0.045);
    ctx.beginPath();
    ctx.ellipse(cx2, cy2, r, r * 0.38, -0.5, 0, Math.PI * 2);
    ctx.stroke();
    // ... and an equator line
    ctx.beginPath();
    ctx.moveTo(cx2 - r, cy2); ctx.lineTo(cx2 + r, cy2);
    ctx.stroke();

    // SHIELD in the center: red around, white inside (shield shape)
    const sw = h * 0.26, sh2 = h * 0.32;
    ctx.fillStyle = '#da291c';
    ctx.beginPath();
    ctx.moveTo(cx2 - sw / 2, cy2 - sh2 / 2);
    ctx.lineTo(cx2 + sw / 2, cy2 - sh2 / 2);
    ctx.lineTo(cx2 + sw / 2, cy2 + sh2 * 0.15);
    ctx.quadraticCurveTo(cx2 + sw / 2, cy2 + sh2 / 2, cx2, cy2 + sh2 / 2);
    ctx.quadraticCurveTo(cx2 - sw / 2, cy2 + sh2 / 2, cx2 - sw / 2, cy2 + sh2 * 0.15);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.moveTo(cx2 - sw * 0.3, cy2 - sh2 * 0.3);
    ctx.lineTo(cx2 + sw * 0.3, cy2 - sh2 * 0.3);
    ctx.lineTo(cx2 + sw * 0.3, cy2 + sh2 * 0.05);
    ctx.quadraticCurveTo(cx2 + sw * 0.3, cy2 + sh2 * 0.32, cx2, cy2 + sh2 * 0.32);
    ctx.quadraticCurveTo(cx2 - sw * 0.3, cy2 + sh2 * 0.32, cx2 - sw * 0.3, cy2 + sh2 * 0.05);
    ctx.closePath(); ctx.fill();
    // the 5 small blue shields (the quinas) in a cross
    ctx.fillStyle = '#003399';
    const q = Math.max(1.2, h * 0.04);
    for (const [qx, qy] of [[0, 0], [-0.6, 0], [0.6, 0], [0, -0.55], [0, 0.55]]) {
      ctx.fillRect(cx2 + qx * sw * 0.28 - q / 2, cy2 - sh2 * 0.05 + qy * sh2 * 0.28 - q / 2, q, q * 1.3);
    }

    // flag border
    ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);
  }
};
