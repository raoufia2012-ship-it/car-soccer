'use strict';

/* ============================================================
   STADIUM — night city background and the whole arena.
   To add a stadium: write a draw function and add it to the
   STADIUMS array. (stadium picker coming later)
   ============================================================ */

const STADIUMS = [
  { name: '🌆 CITY ARENA', draw: drawStadiumCity }
];
let stadiumIndex = 0;

function drawArena(t) {
  STADIUMS[stadiumIndex].draw(t);
  // the two raised goals (shared by every stadium)
  drawGoal(true, t);
  drawGoal(false, t);
  // curved bottom corner ramps
  drawRamp(true, t);
  drawRamp(false, t);
  // rounded ceiling corners
  drawTopCorner(true);
  drawTopCorner(false);
}

/* small deterministic function for windows, crowds, stars...
   (always the same pattern, no array to store) */
function hash(n) {
  const s = Math.sin(n * 127.1) * 43758.5453;
  return s - Math.floor(s);
}

/* ----- STADIUM 1: CITY ARENA, downtown at night 🌆 ----- */
function drawStadiumCity(t) {
  /* night sky gradient */
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, '#060a1c'); g.addColorStop(0.5, '#12183a'); g.addColorStop(1, '#2a1a4a');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

  /* twinkling stars + moon */
  for (let i = 0; i < 50; i++) {
    ctx.globalAlpha = 0.3 + 0.5 * hash(i + Math.floor(t * 2) * 0.001) * (0.5 + 0.5 * Math.sin(t * 2 + i * 3));
    ctx.fillStyle = '#fff';
    ctx.fillRect(hash(i) * W, hash(i + 99) * 130 + 8, 2, 2);
  }
  ctx.globalAlpha = 1;
  ctx.fillStyle = '#f5f3ce'; circle(W - 160, 70, 24); ctx.fill();
  ctx.fillStyle = '#060a1c'; circle(W - 151, 63, 21); ctx.fill(); // crescent

  /* distant skyscrapers (2 parallax layers) */
  // far, dark layer
  ctx.fillStyle = '#0b1230';
  for (let i = 0; i < 18; i++) {
    const bw = 46 + hash(i) * 50;
    const bh = 90 + hash(i + 7) * 150;
    const bx = i * 70 - 20;
    ctx.fillRect(bx, 300 - bh, bw, bh);
  }
  // near layer with lit windows
  for (let i = 0; i < 11; i++) {
    const bw = 62 + hash(i + 30) * 60;
    const bh = 130 + hash(i + 40) * 160;
    const bx = i * 115 - 30;
    const by = 318 - bh;
    ctx.fillStyle = '#141c42';
    ctx.fillRect(bx, by, bw, bh);
    // blinking antenna on some rooftops
    if (hash(i + 55) > 0.5) {
      ctx.strokeStyle = '#3a4a7a'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(bx + bw / 2, by); ctx.lineTo(bx + bw / 2, by - 18); ctx.stroke();
      ctx.fillStyle = Math.sin(t * 3 + i) > 0 ? '#ff5252' : '#5a1a1a';
      circle(bx + bw / 2, by - 20, 2.5); ctx.fill();
    }
    // lit windows (subtle, not too many)
    for (let wx = 8; wx < bw - 10; wx += 15) {
      for (let wy = 10; wy < bh - 8; wy += 18) {
        const on = hash(i * 91 + wx * 7 + wy * 3) > 0.68;
        if (on) {
          ctx.fillStyle = hash(i + wx + wy) > 0.85 ? '#6fa8c9' : '#c9a869';
          ctx.globalAlpha = 0.5;
          ctx.fillRect(bx + wx, by + wy, 5, 7);
        }
      }
    }
    ctx.globalAlpha = 1;
  }

  /* stadium roof: dark band separating the city from the stands */
  ctx.fillStyle = '#0a1030';
  ctx.fillRect(0, 306, W, 12);
  ctx.fillStyle = 'rgba(90,120,180,0.5)';
  ctx.fillRect(0, 316, W, 2); // thin railing

  /* understated stands: crowd silhouettes in the shade, with
     staircases splitting the blocks (like a real stadium) */
  const standTop = 320, standBot = 404;
  const sg = ctx.createLinearGradient(0, standTop, 0, standBot);
  sg.addColorStop(0, '#141c42'); sg.addColorStop(1, '#0c1230');
  ctx.fillStyle = sg;
  ctx.fillRect(0, standTop, W, standBot - standTop);
  for (let row = 0; row < 3; row++) {
    const ry = 336 + row * 24;
    // tier line
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.fillRect(0, ry + 9, W, 2);
    // spectators: small dark silhouettes, a few in bright shirts
    for (let i = 0; i < 55; i++) {
      const px = 12 + i * 22 + (row % 2) * 11;
      if (px % 220 < 18) continue; // staircases between the blocks
      const lit = hash(row * 100 + i) > 0.8; // 1 in 5 wears a loud jersey
      ctx.fillStyle = lit ? ['#c9a13b', '#a34747', '#3f7f8f'][i % 3] : '#232c52';
      const wave = (state && state.phase === 'goal') ? Math.sin(t * 8 - px * 0.02) * 3 : 0;
      circle(px, ry + wave, 3); ctx.fill();          // head
      ctx.fillRect(px - 3, ry + 3 + wave, 6, 6);     // torso
    }
  }
  // a few camera flashes in the crowd ✨
  for (let i = 0; i < 3; i++) {
    const fseed = Math.floor(t * 4) + i * 13;
    if (hash(fseed) > 0.6) {
      ctx.fillStyle = '#fff';
      ctx.globalAlpha = 0.8;
      circle(hash(fseed + 1) * W, standTop + 8 + hash(fseed + 2) * 70, 1.8); ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  /* floodlight towers + light cones */
  for (const lx of [170, W - 170]) {
    ctx.strokeStyle = '#39496f'; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(lx, standTop); ctx.lineTo(lx, 84); ctx.stroke();
    ctx.fillStyle = '#fff'; ctx.globalAlpha = 0.9;
    for (let i = -1; i <= 1; i++) { circle(lx + i * 10, 80, 4); ctx.fill(); }
    ctx.globalAlpha = 0.07 + 0.02 * Math.sin(t * 2 + lx);
    ctx.fillStyle = '#cfe8ff';
    ctx.beginPath();
    ctx.moveTo(lx, 80);
    ctx.lineTo(lx - 170, FLOOR); ctx.lineTo(lx + 170, FLOOR);
    ctx.closePath(); ctx.fill();
    ctx.globalAlpha = 1;
  }

  /* fireworks during the goal celebration 🎆 */
  if (state && state.phase === 'goal') {
    for (let i = 0; i < 2; i++) {
      const fxx = hash(Math.floor(t * 3) + i * 17) * W;
      const fxy = 60 + hash(Math.floor(t * 3) + i * 31) * 120;
      const prog = (t * 3) % 1;
      ctx.globalAlpha = 1 - prog;
      ctx.strokeStyle = pick(['#ffd200', '#ff5252', '#4dd0e1', '#ff00be']);
      ctx.lineWidth = 2;
      for (let r = 0; r < 8; r++) {
        const a = r * Math.PI / 4;
        ctx.beginPath();
        ctx.moveTo(fxx + Math.cos(a) * 10 * prog * 4, fxy + Math.sin(a) * 10 * prog * 4);
        ctx.lineTo(fxx + Math.cos(a) * 22 * prog * 4, fxy + Math.sin(a) * 22 * prog * 4);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }
  }

  /* ===== FUTURISTIC FLOOR (high-tech arena, no grass) ===== */
  const fieldTop = standBot;
  // dark base with depth
  const fg = ctx.createLinearGradient(0, fieldTop, 0, H);
  fg.addColorStop(0, '#1a2456');
  fg.addColorStop(0.5, '#121a3e');
  fg.addColorStop(1, '#0a0f28');
  ctx.fillStyle = fg;
  ctx.fillRect(0, fieldTop, W, H - fieldTop);

  // neon grid in perspective (lines converging into the distance)
  ctx.strokeStyle = 'rgba(25,197,255,0.14)'; ctx.lineWidth = 1;
  for (let i = -8; i <= 8; i++) {
    ctx.beginPath();
    ctx.moveTo(W / 2 + i * 58, fieldTop);
    ctx.lineTo(W / 2 + i * 108, H);
    ctx.stroke();
  }
  // horizontal lines, more and more spaced out (perspective)
  let gy = fieldTop + 6, gstep = 7;
  while (gy < H) {
    ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke();
    gy += gstep; gstep *= 1.3;
  }

  // halfway line + big center circle in glowing NEON
  ctx.save();
  ctx.shadowColor = '#19c5ff'; ctx.shadowBlur = 12;
  ctx.strokeStyle = 'rgba(25,197,255,0.75)'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(W / 2, fieldTop + 4); ctx.lineTo(W / 2, H - 6); ctx.stroke();
  const midY = fieldTop + (H - fieldTop) / 2 + 6;
  ctx.beginPath(); ctx.ellipse(W / 2, midY, 95, 42, 0, 0, Math.PI * 2); ctx.stroke();
  ctx.restore();
  // pulsing core of the center circle
  ctx.globalAlpha = 0.4 + 0.3 * Math.sin(t * 4);
  ctx.fillStyle = '#19c5ff';
  ctx.beginPath(); ctx.ellipse(W / 2, midY, 10, 5, 0, 0, Math.PI * 2); ctx.fill();
  ctx.globalAlpha = 1;

  /* floodlight pools on the floor */
  for (const lx of [150, W / 2, W - 150]) {
    const lg = ctx.createRadialGradient(lx, FLOOR, 10, lx, FLOOR, 220);
    lg.addColorStop(0, 'rgba(210,235,255,0.09)');
    lg.addColorStop(1, 'rgba(210,235,255,0)');
    ctx.fillStyle = lg;
    ctx.fillRect(lx - 220, fieldTop, 440, H - fieldTop);
  }

  /* colored reflections of the goal neons on the floor */
  ctx.globalAlpha = 0.14;
  const rgL = ctx.createLinearGradient(POST_L, 0, POST_L + 130, 0);
  rgL.addColorStop(0, '#19c5ff'); rgL.addColorStop(1, 'rgba(25,197,255,0)');
  ctx.fillStyle = rgL; ctx.fillRect(POST_L, fieldTop, 130, H - fieldTop);
  const rgR = ctx.createLinearGradient(POST_R, 0, POST_R - 130, 0);
  rgR.addColorStop(0, '#ff9100'); rgR.addColorStop(1, 'rgba(255,145,0,0)');
  ctx.fillStyle = rgR; ctx.fillRect(POST_R - 130, fieldTop, 130, H - fieldTop);
  ctx.globalAlpha = 1;

  /* ceiling */
  ctx.fillStyle = '#2c3e66';
  ctx.fillRect(0, 0, W, CEIL);
}

/* ----- filters REMOVED: the image is shown pure, no darkening ----- */
function drawAmbience() {}
