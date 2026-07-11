'use strict';

/* ============================================================
   BALL & BOOST PADS — drawing only, physics lives elsewhere.
   ============================================================ */

function drawBall(t) {
  const b = state.ball;
  // shadow
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.beginPath();
  ctx.ellipse(b.x, FLOOR - 2, b.r * clamp(1 - (FLOOR - b.y) / 500, 0.4, 1), 6, 0, 0, Math.PI * 2);
  ctx.fill();

  // glowing trail when the ball goes very fast (drawn BEFORE the ball)
  if (b.trail && b.trail.length > 1) {
    for (let i = 0; i < b.trail.length; i++) {
      const p = b.trail[i], a = (i + 1) / (b.trail.length + 1);
      ctx.globalAlpha = a * 0.3;
      ctx.fillStyle = '#fff';
      circle(p.x, p.y, b.r * (0.45 + 0.4 * a)); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  ctx.save();
  ctx.translate(b.x, b.y);
  // cosmetic contact squash (never affects the collision radius b.r)
  const sq = (b.squashT || 0) * 0.3;
  if (sq > 0.001) {
    const ang = Math.atan2(b.squashNY, b.squashNX);
    ctx.rotate(ang);
    ctx.scale(1 + sq, 1 - sq);
    ctx.rotate(-ang);
  }
  ctx.rotate(b.rot);
  ctx.fillStyle = '#fff'; circle(0, 0, b.r); ctx.fill();
  // pentagon pattern
  ctx.fillStyle = '#222';
  circle(0, 0, b.r * 0.3); ctx.fill();
  for (let i = 0; i < 5; i++) {
    const a = i * Math.PI * 2 / 5;
    circle(Math.cos(a) * b.r * 0.72, Math.sin(a) * b.r * 0.72, b.r * 0.2); ctx.fill();
  }
  ctx.strokeStyle = '#222'; ctx.lineWidth = 2.5;
  circle(0, 0, b.r); ctx.stroke();
  ctx.restore();
}

/* ----- boost refills sitting on the pitch ----- */
function drawPads(t) {
  for (const p of state.pads) {
    if (!p.active) continue;
    ctx.save();
    ctx.globalAlpha = 0.5 + 0.3 * Math.sin(t * 6 + p.x);
    ctx.fillStyle = '#ffd200';
    circle(p.x, p.y, 15 + Math.sin(t * 6) * 2); ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 16px "Segoe UI"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('⚡', p.x, p.y);
    ctx.restore();
  }
}
