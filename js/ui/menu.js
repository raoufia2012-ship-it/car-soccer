'use strict';

/* ============================================================
   MENU & SETTINGS screens.
   ============================================================ */

/* animated demo behind the menu: a bouncing ball */
let demoBall = { x: 300, y: 100, vx: 260, vy: 0 };
function updateDemo(dt) {
  demoBall.vy += 900 * dt;
  demoBall.x += demoBall.vx * dt;
  demoBall.y += demoBall.vy * dt;
  if (demoBall.y > FLOOR - 30) { demoBall.y = FLOOR - 30; demoBall.vy = -Math.abs(demoBall.vy) * 0.9; }
  if (demoBall.x < 60 || demoBall.x > W - 60) demoBall.vx *= -1;
}

function drawMenu(t) {
  drawArena(t);
  // demo ball
  ctx.save();
  ctx.translate(demoBall.x, demoBall.y);
  ctx.rotate(t * 3);
  ctx.fillStyle = '#fff'; circle(0, 0, 30); ctx.fill();
  ctx.fillStyle = '#222'; circle(0, 0, 9); ctx.fill();
  ctx.strokeStyle = '#222'; ctx.lineWidth = 2.5; circle(0, 0, 30); ctx.stroke();
  ctx.restore();

  // (no dark filter: the menu stays bright)
  const wob = Math.sin(t * 2) * 5;
  bigText('CAR SOCCER', W / 2, 140 + wob, 92, '#ffd200');
  bigText('🚗 ⚽ 🚗', W / 2, 212, 36, '#fff');

  drawButton(W / 2 - 140, 280, 280, 58, '▶ PLAY (vs AI)', () => openChoose('ai'), true);
  drawButton(W / 2 - 140, 355, 280, 58, '👥 2 PLAYERS', () => openChoose('2p'));
  drawButton(W / 2 - 140, 430, 280, 58, '⚙️ SETTINGS', () => { scene = 'settings'; sfx('click'); });

  ctx.font = 'bold 15px "Segoe UI"'; ctx.textAlign = 'center'; ctx.lineWidth = 3;
  ctx.strokeStyle = 'rgba(0,0,0,0.55)'; ctx.fillStyle = 'rgba(255,255,255,0.92)';
  ctx.strokeText('P1: W jump (HOLD W = FLY ▲) · A/D move · S dive · SHIFT turbo 🔥', W / 2, H - 60);
  ctx.fillText('P1: W jump (HOLD W = FLY ▲) · A/D move · S dive · SHIFT turbo 🔥', W / 2, H - 60);
  ctx.strokeText('P2: ↑ jump/fly · ←/→ move · ↓ dive · CTRL turbo', W / 2, H - 36);
  ctx.fillText('P2: ↑ jump/fly · ←/→ move · ↓ dive · CTRL turbo', W / 2, H - 36);
}

function drawSettings(t) {
  drawArena(t);
  ctx.fillStyle = 'rgba(0,0,0,0.55)'; ctx.fillRect(0, 0, W, H);
  bigText('SETTINGS', W / 2, 110, 56, '#fff');

  // each button cycles through the possible values
  drawButton(W / 2 - 190, 200, 380, 58, '⚽ Goals to win: ' + settings.goals, () => {
    settings.goals = settings.goals === 3 ? 5 : settings.goals === 5 ? 10 : 3;
    saveSettings(); sfx('click');
  });
  drawButton(W / 2 - 190, 278, 380, 58, '⏱ Match time: ' + (settings.timer / 60) + ' MIN', () => {
    settings.timer = settings.timer === 60 ? 120 : settings.timer === 120 ? 180 : 60;
    saveSettings(); sfx('click');
  });
  drawButton(W / 2 - 190, 356, 380, 58, muted ? '🔇 Sound: OFF' : '🔊 Sound: ON', () => {
    toggleMute(); sfx('click');
  });
  drawButton(W / 2 - 140, 455, 280, 58, '← BACK', backToMenu, true);
}
