'use strict';

/* ============================================================
   ARENA GEOMETRY — the curved corners of the stadium.
   Bottom ramps guide the ball up to the goal mouth, top corners
   round off the ceiling. Cars can CLIMB the bottom ramps like
   in Rocket League.
   ============================================================ */

/* ----- corner ramps: narrow ELLIPTICAL curves that rise the full
   height, all the way UP to the goal mouth. The ball slides along
   them and is guided straight toward the goal. -----
   Returns the contact {nx, ny, pen} or null. */
function ellipseContact(px, py, r, left, top) {
  const rx = RAMP_W;
  const ry = top ? TOPC_H : RAMP_H;
  const C = {
    x: left ? POST_L + rx : POST_R - rx,
    y: top ? CEIL + ry : FLOOR - ry
  };
  const inX = left ? px < C.x : px > C.x;
  const inY = top ? py < C.y : py > C.y;
  if (!inX || !inY) return null;
  const u = (px - C.x) / rx, v = (py - C.y) / ry;
  const d = Math.hypot(u, v);
  if (d < 1e-6) return null;
  // surface point (radial projection) + ellipse normal
  const sx = C.x + (u / d) * rx, sy = C.y + (v / d) * ry;
  let nx = (u / d) / rx, ny = (v / d) / ry;
  const nl = Math.hypot(nx, ny) || 1;
  nx /= nl; ny /= nl;
  const pen = (px - sx) * nx + (py - sy) * ny + r; // > 0 = inside the solid
  if (pen <= 0) return null;
  return { nx, ny, pen };
}

function rampBall(b) {
  for (const left of [true, false]) {
    const c = ellipseContact(b.x, b.y, b.r, left, false);
    if (!c) continue;
    b.x -= c.nx * c.pen;
    b.y -= c.ny * c.pen;
    // soft bounce: the ball slides along the curve and climbs toward the goal
    const dot = b.vx * c.nx + b.vy * c.ny;
    if (dot > 0) {
      b.vx -= (1 + BALL_BOUNCE * 0.5) * dot * c.nx;
      b.vy -= (1 + BALL_BOUNCE * 0.5) * dot * c.ny;
    }
  }
}

/* TOP curves: same as the bottom ones, from the ceiling down to the
   goal's upper lip */
function topCornerBall(b) {
  for (const left of [true, false]) {
    const c = ellipseContact(b.x, b.y, b.r, left, true);
    if (!c) continue;
    b.x -= c.nx * c.pen;
    b.y -= c.ny * c.pen;
    const dot = b.vx * c.nx + b.vy * c.ny;
    if (dot > 0) {
      b.vx -= (1 + BALL_BOUNCE * 0.5) * dot * c.nx;
      b.vy -= (1 + BALL_BOUNCE * 0.5) * dot * c.ny;
    }
  }
}

/* cars CLIMB the corner ramps, like in Rocket League: the body follows
   the curve, speed carries you up the wall, and you can jump from any
   point of the ramp. */
function rampCar(car, dt) {
  for (const left of [true, false]) {
    const c = ellipseContact(car.x, car.y, 20, left);
    if (!c) continue;
    // ----- contact with the ramp surface -----
    car.x -= c.nx * c.pen;
    car.y -= c.ny * c.pen;
    // velocity is redirected ALONG the curve (you climb, you don't bounce)
    const dot = car.vx * c.nx + car.vy * c.ny;
    if (dot > 0) { car.vx -= dot * c.nx; car.vy -= dot * c.ny; }
    // tangent pointing "up the ramp" (toward the wall/goal)
    const tx = left ? -c.ny : c.ny;
    const ty = left ? c.nx : -c.nx;
    // holding the throttle really CLIMBS the car up to the goal
    const climbDir = left ? -1 : 1;
    if (car.throttle === climbDir) {
      car.vx += tx * CAR_ACCEL * 1.1 * dt;
      car.vy += ty * CAR_ACCEL * 1.1 * dt;
    }
    // same as on the ground: you can jump, turbo recharges
    car.onGround = true;
    car.jumps = 0;
    // the body tilts to hug the curve
    const target = (car.dir === 1) ? Math.atan2(ty, tx) : Math.atan2(ty, -tx);
    car.rot += (target - car.rot) * Math.min(1, 14 * dt);
  }
}

/* cars slide along the top curves */
function topCornerCar(car) {
  for (const left of [true, false]) {
    const c = ellipseContact(car.x, car.y, 20, left, true);
    if (!c) continue;
    car.x -= c.nx * c.pen;
    car.y -= c.ny * c.pen;
    const dot = car.vx * c.nx + car.vy * c.ny;
    if (dot > 0) { car.vx -= dot * c.nx; car.vy -= dot * c.ny; }
  }
}
