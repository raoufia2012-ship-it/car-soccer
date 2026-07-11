'use strict';

/* ============================================================
   HUD — scoreboard, turbo/flight gauges, in-match menu button.
   ============================================================ */

/* ----- scoreboard at the top ----- */
function drawScoreboard() {
  const [c1, c2] = state.cars;
  // central panel
  ctx.fillStyle = 'rgba(0,0,0,0.65)';
  rr(W / 2 - 165, 4, 330, 68, 14); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 2;
  rr(W / 2 - 165, 4, 330, 68, 14); ctx.stroke();
  // BIG score
  bigText(state.score[0] + ' - ' + state.score[1], W / 2, 34, 48, '#fff', 5);
  // colored names
  ctx.font = '900 16px "Segoe UI"'; ctx.textBaseline = 'middle';
  ctx.textAlign = 'right'; ctx.fillStyle = c1.color;
  ctx.fillText(c1.name, W / 2 - 78, 36);
  ctx.textAlign = 'left'; ctx.fillStyle = c2.color;
  ctx.fillText(c2.name, W / 2 + 78, 36);
  // timer or target
  ctx.font = 'bold 15px "Segoe UI"'; ctx.textAlign = 'center'; ctx.fillStyle = '#ffd200';
  if (state.sudden) {
    ctx.fillText('⚡ SUDDEN DEATH ⚡', W / 2, 62);
  } else if (settings.timer > 0) {
    const tt = Math.max(0, Math.ceil(state.time));
    const mm = Math.floor(tt / 60), ss = ('0' + (tt % 60)).slice(-2);
    ctx.fillText('⏱ ' + mm + ':' + ss, W / 2, 62);
  } else {
    ctx.fillText('First to ' + settings.goals + ' ⚽', W / 2, 62);
  }
}

/* ----- both players' turbo gauges (the score sits top center) ----- */
function drawBoostBars() {
  const bars = [
    { car: state.cars[0], x: 20, left: true },
    { car: state.cars[1], x: W - 20 - 150, left: false }
  ];
  for (const b of bars) {
    // turbo gauge
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    rr(b.x, 14, 150, 14, 7); ctx.fill();
    const pct = b.car.boost / 100;
    if (pct > 0) {
      const grad = ctx.createLinearGradient(b.x, 0, b.x + 150, 0);
      grad.addColorStop(0, '#ff9100'); grad.addColorStop(1, '#ffd200');
      ctx.fillStyle = grad;
      const fw = 150 * pct;
      rr(b.left ? b.x : b.x + 150 - fw, 14, fw, 14, 7); ctx.fill();
    }
    ctx.font = 'bold 12px "Segoe UI"'; ctx.textBaseline = 'middle';
    ctx.textAlign = b.left ? 'left' : 'right';
    ctx.fillStyle = b.car.color;
    ctx.fillText('🔥 ' + b.car.name, b.left ? b.x : b.x + 150, 40);
  }
}

/* ----- FLIGHT gauge ▬▬▬▬ shown above each car ----- */
function drawFlyBars() {
  for (const car of state.cars) {
    const bx = car.x - 24, by = car.y - 62;
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    rr(bx, by, 48, 7, 3.5); ctx.fill();
    const pct = car.fly / 100;
    if (pct > 0) {
      // the gauge uses the car's color (blue / orange, like the goals)
      ctx.fillStyle = car.color;
      ctx.globalAlpha = pct > 0.25 ? 1 : 0.5 + 0.5 * Math.sin(performance.now() / 80);
      rr(bx, by, 48 * pct, 7, 3.5); ctx.fill();
      ctx.globalAlpha = 1;
    }
    // small marker while actually flying
    if (car.flying) {
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 10px "Segoe UI"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('▲', car.x, by - 7);
    }
  }
}

/* ----- ONE single ☰ button at the top: it opens the pause panel
   where everything lives (continue, sound, menu) ----- */
function drawMatchButtons() {
  const bx = W / 2 + 218, cy = 32, r = 24;
  const hover = Math.hypot(mouse.x - bx, mouse.y - cy) < r + 4;
  ctx.fillStyle = hover ? 'rgba(255,210,0,0.85)' : 'rgba(0,0,0,0.55)';
  circle(bx, cy, r); ctx.fill();
  ctx.strokeStyle = hover ? '#fff' : 'rgba(255,255,255,0.35)'; ctx.lineWidth = 2;
  circle(bx, cy, r); ctx.stroke();
  // hand-drawn ☰ icon (3 strokes)
  ctx.strokeStyle = hover ? '#111' : '#fff'; ctx.lineWidth = 3; ctx.lineCap = 'round';
  for (let i = -1; i <= 1; i++) {
    ctx.beginPath();
    ctx.moveTo(bx - 9, cy + i * 7);
    ctx.lineTo(bx + 9, cy + i * 7);
    ctx.stroke();
  }
  clickRegions.push({ x: bx - r, y: cy - r, w: r * 2, h: r * 2, fn: () => { paused = true; sfx('click'); } });
}
