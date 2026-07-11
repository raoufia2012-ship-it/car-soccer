'use strict';

/* ============================================================
   BALL PHYSICS — movement, bounces, goal detection.
   ============================================================ */

function updateBall(dt) {
  const b = state.ball;
  b.vy += GRAV_BALL * dt;
  b.x += b.vx * dt;
  b.y += b.vy * dt;
  b.rot += b.vx * dt / b.r; // the ball visually rolls
  b.squashT = Math.max(0, b.squashT - dt * 7); // cosmetic squash decay

  // speed limit
  const sp = Math.hypot(b.vx, b.vy);
  if (sp > BALL_MAX) { b.vx *= BALL_MAX / sp; b.vy *= BALL_MAX / sp; }

  // glowing trail when the ball goes very fast (purely visual, see drawBall):
  // above the threshold we remember the last positions, otherwise it fades fast
  if (sp > 550) {
    b.trail.push({ x: b.x, y: b.y });
    if (b.trail.length > 6) b.trail.shift();
  } else if (b.trail.length) {
    b.trail.shift();
  }

  // floor: the ball keeps its energy and springs back up nicely
  if (b.y > FLOOR - b.r) {
    const impactVy = Math.abs(b.vy);
    b.y = FLOOR - b.r;
    if (impactVy > 60) sfx('bounce', b.x);
    b.vy = -b.vy * BALL_BOUNCE;
    b.vx *= 0.99;
    // never fully glued to the ground: small permanent hop while it rolls
    if (Math.abs(b.vy) < 90 && Math.abs(b.vx) > 120) b.vy = -160;
    if (impactVy > 80) { b.squashT = clamp(impactVy / 700, 0.15, 1); b.squashNX = 0; b.squashNY = 1; }
  }
  // ceiling
  if (b.y < CEIL + b.r) { b.y = CEIL + b.r; b.vy = Math.abs(b.vy) * BALL_BOUNCE; }

  // ----- raised goals (Sideswipe style) -----
  // lips of the openings: the ball bounces off the 4 corners
  for (const [px, py] of [[POST_L, GOAL_TOP], [POST_L, GOAL_BOT], [POST_R, GOAL_TOP], [POST_R, GOAL_BOT]]) {
    const dx = b.x - px, dy = b.y - py;
    const d = Math.hypot(dx, dy);
    if (d < b.r + 5 && d > 0) {
      const nx = dx / d, ny = dy / d;
      b.x = px + nx * (b.r + 5);
      b.y = py + ny * (b.r + 5);
      const dot = b.vx * nx + b.vy * ny;
      b.vx -= 2 * dot * nx * BALL_BOUNCE;
      b.vy -= 2 * dot * ny * BALL_BOUNCE;
      sfx('bounce', b.x);
    }
  }

  // rounded TOP corners of the stadium: the ball slides along the curve
  topCornerBall(b);

  // the goal structure is a thick wall with a "door" (the mouth)
  const inMouthY = b.y > GOAL_TOP + 4 && b.y < GOAL_BOT - 4;
  if (b.y > FLOOR - RAMP_H - 2) {
    // all the way down: the small corner ramps
    rampBall(b);
  } else if (!inMouthY && b.y > CEIL + TOPC_H) {
    if (b.x < POST_L + b.r) { b.x = POST_L + b.r; b.vx = Math.abs(b.vx) * BALL_BOUNCE; sfx('bounce', b.x); }
    if (b.x > POST_R - b.r) { b.x = POST_R - b.r; b.vx = -Math.abs(b.vx) * BALL_BOUNCE; sfx('bounce', b.x); }
  } else if (inMouthY) {
    // inside the mouth: net at the back of the goal
    if (b.x < WALL + b.r * 0.5) { b.x = WALL + b.r * 0.5; b.vx = Math.abs(b.vx) * 0.2; }
    if (b.x > W - WALL - b.r * 0.5) { b.x = W - WALL - b.r * 0.5; b.vx = -Math.abs(b.vx) * 0.2; }
  }
}

/* ----- goal detection -----
   Returns 0 if the left player scores (into the right goal),
   1 if the right player scores, -1 otherwise. */
function checkGoal() {
  const b = state.ball;
  if (b.y > GOAL_TOP && b.y < GOAL_BOT) { // at mouth height
    if (b.x + b.r < POST_L - 4) return 1;   // LEFT goal → player 2 scores
    if (b.x - b.r > POST_R + 4) return 0;   // RIGHT goal → player 1 scores
  }
  return -1;
}
