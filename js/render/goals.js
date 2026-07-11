'use strict';

/* ============================================================
   GOALS — raised neon goals, corner ramps, ceiling corners.
   ============================================================ */

/* raised neon goal, in the colors of the PLAYER defending it */
function drawGoal(left, t) {
  // player 0 defends the left goal, player 1 the right one.
  // In the menus (no match): FRANCE 🇫🇷 on the left, ARGENTINA 🇦🇷 on the right
  const pl = state
    ? PLAYERS[state.cars[left ? 0 : 1].char]
    : (left ? (PLAYERS.mbappe || PLAYERS.classic) : (PLAYERS.messi || PLAYERS.classic2));
  const neon = pl.neon;
  const x0 = left ? 0 : POST_R;              // structure column
  const cw = left ? POST_L : W - POST_R;
  const mouthX = left ? WALL : POST_R;       // opening
  const mouthW = GOAL_W;

  // structure column (floor to ceiling)
  const g = ctx.createLinearGradient(x0, 0, x0 + cw, 0);
  g.addColorStop(left ? 0 : 1, '#0d1430');
  g.addColorStop(left ? 1 : 0, '#222f55');
  ctx.fillStyle = g;
  ctx.fillRect(x0, CEIL, cw, H - CEIL);

  // ----- tower cladding (no more empty area!) -----
  // horizontal panels with seams
  ctx.strokeStyle = 'rgba(0,0,0,0.45)'; ctx.lineWidth = 2;
  for (let y = CEIL + 40; y < H; y += 46) {
    ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x0 + cw, y); ctx.stroke();
  }
  ctx.strokeStyle = 'rgba(255,255,255,0.05)';
  ctx.beginPath(); ctx.moveTo(x0 + cw / 2, CEIL); ctx.lineTo(x0 + cw / 2, H); ctx.stroke();
  // bright highlights on some panels (metal effect)
  ctx.fillStyle = 'rgba(255,255,255,0.035)';
  for (let y = CEIL + 40; y < H; y += 92) ctx.fillRect(x0 + 4, y + 3, cw - 8, 40);

  // big vertical neon strip along the outer edge
  ctx.save();
  ctx.shadowColor = neon; ctx.shadowBlur = 10;
  ctx.strokeStyle = neon; ctx.lineWidth = 3;
  ctx.globalAlpha = 0.8;
  const edgeX = left ? x0 + 8 : x0 + cw - 8;
  ctx.beginPath(); ctx.moveTo(edgeX, CEIL + 14); ctx.lineTo(edgeX, H - 10); ctx.stroke();
  ctx.restore();

  // row of small blinking lights at the top of the tower
  for (let i = 0; i < 4; i++) {
    const ly = CEIL + 24;
    const lx = x0 + 14 + i * (cw - 28) / 3;
    ctx.fillStyle = Math.sin(t * 3 + i * 1.6 + (left ? 0 : 2)) > 0 ? neon : '#232f55';
    circle(lx, ly, 3); ctx.fill();
  }

  // hazard stripes at the base of the tower
  ctx.save();
  ctx.beginPath(); ctx.rect(x0, H - 26, cw, 26); ctx.clip();
  ctx.fillStyle = 'rgba(255,210,0,0.5)';
  for (let x = x0 - 26; x < x0 + cw + 26; x += 22) {
    ctx.beginPath();
    ctx.moveTo(x, H); ctx.lineTo(x + 11, H - 26); ctx.lineTo(x + 22, H - 26); ctx.lineTo(x + 11, H);
    ctx.closePath(); ctx.fill();
  }
  ctx.restore();

  // glowing chevrons under the opening
  ctx.strokeStyle = neon; ctx.lineWidth = 4; ctx.globalAlpha = 0.5;
  for (let i = 0; i < 3; i++) {
    const y = GOAL_BOT + 22 + i * 22;
    ctx.beginPath();
    ctx.moveTo(x0 + cw * 0.25, y + 8);
    ctx.lineTo(x0 + cw * 0.5, y - 4);
    ctx.lineTo(x0 + cw * 0.75, y + 8);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  // the player's country FLAG, hung on the tower above their goal
  pl.drawFlag(x0 + cw * 0.14, GOAL_TOP - 64, cw * 0.72, 42);

  // CLEAN opening: just a slight darkening, nothing else inside
  ctx.fillStyle = 'rgba(0,3,10,0.35)';
  ctx.fillRect(mouthX, GOAL_TOP, mouthW, GOAL_H);

  // ===== clearly VISIBLE goal entrance: just two small neon lips =====
  const fx = left ? POST_L : POST_R;
  ctx.save();
  const pulse = 0.7 + 0.3 * Math.sin(t * 4 + (left ? 0 : 2));
  ctx.shadowColor = neon; ctx.shadowBlur = 10 * pulse;
  ctx.strokeStyle = neon; ctx.lineWidth = 4; ctx.lineCap = 'round';
  ctx.beginPath(); // upper lip
  ctx.moveTo(fx, GOAL_TOP); ctx.lineTo(left ? fx - 22 : fx + 22, GOAL_TOP);
  ctx.stroke();
  ctx.beginPath(); // lower lip
  ctx.moveTo(fx, GOAL_BOT); ctx.lineTo(left ? fx - 22 : fx + 22, GOAL_BOT);
  ctx.stroke();
  ctx.restore();

  // ===== LIGHT EXPLOSION when a goal is scored =====
  if (state && state.phase === 'goal') {
    const scoredLeft = state.scorer === 1; // player 2 scores into the left goal
    if (scoredLeft === left) {
      const prog = clamp((2.4 - state.phaseT) / 2.4, 0, 1); // 0 → 1 during the celebration
      // the goal flashes
      ctx.globalAlpha = (0.5 + 0.3 * Math.sin(t * 20)) * (1 - prog * 0.6);
      ctx.fillStyle = neon;
      ctx.fillRect(mouthX, GOAL_TOP, mouthW, GOAL_H);
      // circular shockwave expanding from the goal
      const cx2 = fx, cy2 = (GOAL_TOP + GOAL_BOT) / 2;
      for (let ring = 0; ring < 2; ring++) {
        const rp = clamp(prog * 1.6 - ring * 0.25, 0, 1);
        if (rp <= 0 || rp >= 1) continue;
        ctx.globalAlpha = (1 - rp) * 0.7;
        ctx.strokeStyle = ring === 0 ? '#fff' : neon;
        ctx.lineWidth = 6 - ring * 2;
        circle(cx2, cy2, 20 + rp * 420); ctx.stroke();
      }
      // column of light rising to the sky
      ctx.globalAlpha = (1 - prog) * 0.35;
      const beam = ctx.createLinearGradient(0, 0, 0, GOAL_TOP);
      beam.addColorStop(0, 'rgba(255,255,255,0)');
      beam.addColorStop(1, neon);
      ctx.fillStyle = beam;
      ctx.fillRect(mouthX - 6, 0, mouthW + 12, GOAL_TOP);
      ctx.globalAlpha = 1;
    }
  }
}

/* curved corner ramp: the ball rides it up to the goal */
function drawRamp(left, t) {
  const neon = left ? '#19c5ff' : '#ff9100';
  const C = left
    ? { x: POST_L + RAMP_W, y: FLOOR - RAMP_H }
    : { x: POST_R - RAMP_W, y: FLOOR - RAMP_H };

  // solid body: narrow curve rising up to the goal entrance
  ctx.fillStyle = '#1a2450';
  ctx.beginPath();
  if (left) {
    ctx.moveTo(POST_L, FLOOR);
    ctx.lineTo(POST_L, FLOOR - RAMP_H);
    ctx.ellipse(C.x, C.y, RAMP_W, RAMP_H, 0, Math.PI, Math.PI / 2, true);
  } else {
    ctx.moveTo(POST_R, FLOOR);
    ctx.lineTo(POST_R, FLOOR - RAMP_H);
    ctx.ellipse(C.x, C.y, RAMP_W, RAMP_H, 0, 0, Math.PI / 2, false);
  }
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.5)'; ctx.lineWidth = 2; ctx.stroke();

  // subtle neon edge along the curve
  ctx.save();
  ctx.shadowColor = neon; ctx.shadowBlur = 6;
  ctx.strokeStyle = neon; ctx.lineWidth = 3;
  ctx.globalAlpha = 0.7;
  ctx.beginPath();
  if (left) ctx.ellipse(C.x, C.y, RAMP_W, RAMP_H, 0, Math.PI, Math.PI / 2, true);
  else ctx.ellipse(C.x, C.y, RAMP_W, RAMP_H, 0, 0, Math.PI / 2, false);
  ctx.stroke();
  ctx.restore();
}

/* TOP curve: same as the bottom one, from the ceiling to the goal's upper lip */
function drawTopCorner(left) {
  const neon = left ? '#19c5ff' : '#ff9100';
  const C = left
    ? { x: POST_L + RAMP_W, y: CEIL + TOPC_H }
    : { x: POST_R - RAMP_W, y: CEIL + TOPC_H };

  // solid corner fill
  ctx.fillStyle = '#1a2450';
  ctx.beginPath();
  if (left) {
    ctx.moveTo(POST_L, CEIL + TOPC_H);
    ctx.ellipse(C.x, C.y, RAMP_W, TOPC_H, 0, Math.PI, Math.PI * 1.5, false);
    ctx.lineTo(POST_L, CEIL);
  } else {
    ctx.moveTo(POST_R, CEIL + TOPC_H);
    ctx.ellipse(C.x, C.y, RAMP_W, TOPC_H, 0, 0, -Math.PI / 2, true);
    ctx.lineTo(POST_R, CEIL);
  }
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.5)'; ctx.lineWidth = 2; ctx.stroke();

  // neon edge along the curve
  ctx.save();
  ctx.shadowColor = neon; ctx.shadowBlur = 6;
  ctx.strokeStyle = neon; ctx.lineWidth = 3;
  ctx.globalAlpha = 0.7;
  ctx.beginPath();
  if (left) ctx.ellipse(C.x, C.y, RAMP_W, TOPC_H, 0, Math.PI, Math.PI * 1.5, false);
  else ctx.ellipse(C.x, C.y, RAMP_W, TOPC_H, 0, 0, -Math.PI / 2, true);
  ctx.stroke();
  ctx.restore();
}
