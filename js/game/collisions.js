'use strict';

/* ============================================================
   COLLISIONS — car vs ball (including 50-50s) and car vs car.
   ============================================================ */

/* computes the car/ball contact WITHOUT changing anything (read-only).
   Used to know whether BOTH cars touch the ball in the same frame
   before deciding how to resolve — see collideCarsBall() below. */
function carBallContact(car) {
  const b = state.ball;
  // point of the car rectangle closest to the ball center
  const cx = clamp(b.x, car.x - car.w / 2, car.x + car.w / 2);
  const cy = clamp(b.y, car.y - car.h / 2 - 8, car.y + car.h / 2 + 8);
  const dx = b.x - cx, dy = b.y - cy;
  const d = Math.hypot(dx, dy);
  if (d >= b.r || d === 0) return null;
  return { nx: dx / d, ny: dy / d, cx, cy };
}

/* applies the impact of ONE car on the ball (position, velocity,
   effects). Used when only one car touches the ball this frame. */
function applyCarBallHit(car, c) {
  const b = state.ball;
  b.x = c.cx + c.nx * (b.r + 1);
  b.y = c.cy + c.ny * (b.r + 1);

  // velocity transfer: bounce + push from the car
  const power = car.flipT > 0 ? 1.6 : 1.15; // harder hit during a somersault!
  const relvx = b.vx - car.vx, relvy = b.vy - car.vy;
  const dot = relvx * c.nx + relvy * c.ny;
  if (dot < 0) {
    b.vx -= (1 + BALL_BOUNCE) * dot * c.nx;
    b.vy -= (1 + BALL_BOUNCE) * dot * c.ny;
  }
  b.vx += car.vx * 0.8 * power;
  b.vy += car.vy * 0.6 * power - 160; // good upward lift = the ball takes off

  const impact = Math.hypot(car.vx, car.vy);
  if (impact > 250) {
    const big = impact > 480;
    sfx(big ? 'kickHard' : 'kick', b.x);
    // particles proportional to shot power: a soft touch makes a discreet
    // spray, a BIG shot a real explosion (+ golden sparks)
    const n = clamp(Math.round(impact / 90), 6, 14);
    burst(b.x - c.nx * b.r, b.y - c.ny * b.r, '#fff', n, 220 + impact * 0.3);
    if (big) {
      shake(0.2, 5);
      hitStop(0.05);
      burst(b.x - c.nx * b.r, b.y - c.ny * b.r, '#ffd200', 6, 380);
    }
    // ball squash + small visual recoil of the car (game feel, cosmetic)
    b.squashT = clamp(impact / 700, 0.15, 1);
    b.squashNX = c.nx; b.squashNY = c.ny;
    car.kickT = 0.12;
    car.kickDX = -c.nx; car.kickDY = -c.ny;
  }
}

/* ----- car/ball collision for BOTH cars at once -----
   IMPORTANT: if the two cars touch the ball in the EXACT same frame
   (ball pinched between them, a "50-50"), resolving each car one
   after the other is unstable — the first car's correction pushes
   the ball INTO the second one, which pushes it back, and so on:
   it showed up as a very visible ball "teleport"/pop. That case is
   detected and handled separately: a SINGLE combined resolution that
   cleanly ejects the ball instead of bouncing it between the cars. */
function collideCarsBall(car0, car1) {
  const b = state.ball;
  const c0 = carBallContact(car0);
  const c1 = carBallContact(car1);

  if (c0 && c1) {
    // pinched ball: eject it along the COMBINED normal (average of the
    // two contacts), taking both cars' momentum into account exactly
    // once (never two independent resolutions).
    let nx = c0.nx + c1.nx, ny = c0.ny + c1.ny;
    const nl = Math.hypot(nx, ny);
    if (nl < 1e-3) { nx = 0; ny = -1; } // cars perfectly head-on: the ball pops upward
    else { nx /= nl; ny /= nl; }
    const cx = (c0.cx + c1.cx) / 2, cy = (c0.cy + c1.cy) / 2;
    b.x = cx + nx * (b.r + 2);
    b.y = cy + ny * (b.r + 2);

    const avgVx = (car0.vx + car1.vx) / 2, avgVy = (car0.vy + car1.vy) / 2;
    const relvx = b.vx - avgVx, relvy = b.vy - avgVy;
    const dot = relvx * nx + relvy * ny;
    if (dot < 0) { b.vx -= (1 + BALL_BOUNCE) * dot * nx; b.vy -= (1 + BALL_BOUNCE) * dot * ny; }
    b.vx += avgVx * 0.8; b.vy += avgVy * 0.6 - 160;

    const impact = Math.hypot(car0.vx - car1.vx, car0.vy - car1.vy);
    if (impact > 200) {
      sfx('kick', b.x);
      burst(b.x - nx * b.r, b.y - ny * b.r, '#fff', 8, 260);
      shake(0.15, 4);
    }
    b.squashT = clamp(impact / 700, 0.15, 1);
    b.squashNX = nx; b.squashNY = ny;
  } else if (c0) {
    applyCarBallHit(car0, c0);
  } else if (c1) {
    applyCarBallHit(car1, c1);
  }
}

/* ----- car vs car collision ----- */
function collideCars(a, b) {
  const dx = b.x - a.x;
  const overlapX = a.w / 2 + b.w / 2 + 4 - Math.abs(dx);
  const dy = Math.abs(b.y - a.y);
  if (overlapX > 0 && dy < 40) {
    const dir = dx >= 0 ? 1 : -1;
    a.x -= dir * overlapX / 2;
    b.x += dir * overlapX / 2;
    // momentum exchange
    const avg = (a.vx + b.vx) / 2;
    const impact = Math.abs(a.vx - b.vx);
    a.vx = avg - dir * impact * 0.35;
    b.vx = avg + dir * impact * 0.35;
    if (impact > 350) { // big crash!
      sfx('thud', (a.x + b.x) / 2);
      shake(0.3, 8);
      hitStop(0.06);
      burst((a.x + b.x) / 2, a.y, '#ffd54a', 8, 300);
    }
  }
}
