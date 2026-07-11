'use strict';

/* ============================================================
   CAR PHYSICS — Rocket League-style driving, plus boost pads.
   ============================================================ */

/* ----- update one car -----
   inp = { left, right, jump, boost, down, holdJump }; jump must be a
   single-frame "rising edge".
   - On the ground: left/right accelerates. Pressing BEHIND you =
     reverse (white lights + beep). Keep pressing and the car U-turns.
   - In the air: pull back = nose up, push forward = nose-dive.
   - TURBO: thrust along the nose → you can FLY and come back down.
   - Double jump = dodge in the held direction (somersault). */
function updateCar(car, inp, dt) {
  const steer = (inp.right ? 1 : 0) - (inp.left ? 1 : 0);
  const rel = steer * car.dir; // 1 = toward the nose, -1 = backwards
  car.throttle = steer;
  car.boosting = !!inp.boost && car.boost > 0;

  if (car.onGround) {
    car.reversing = false;
    if (steer !== 0) {
      // INSTANT U-TURN: the car flips around immediately
      car.dir = steer;
      // if we were rolling the other way, big brake + skid
      const against = car.vx * steer < 0;
      car.vx += steer * CAR_ACCEL * (against ? 2.6 : 1) * dt;
      if (against && Math.abs(car.vx) > 150) { // skid smoke
        dust(car.x + steer * car.w / 2, FLOOR - 4, -steer);
        dust(car.x, FLOOR - 4, -steer);
      }
      if (Math.abs(car.vx) > 200 && Math.random() < 0.5) {
        dust(car.x - car.dir * car.w / 2, FLOOR - 4, car.dir);
      }
    } else {
      car.vx *= Math.pow(0.25, dt); // friction
    }
    car.rot *= Math.pow(0.0005, dt); // the car levels back out
  } else {
    // air control: pull back = nose up, push forward = dive
    if (rel !== 0) car.rot += rel * 4.6 * dt;
    car.rot = clamp(car.rot, -2.1, 2.1);
    car.vx += steer * CAR_ACCEL * 0.22 * dt; // slight lateral control in the air
    // S: fast DESCENT (quick dive toward the floor)
    if (inp.down) {
      car.vy += 2800 * dt;
      car.rot += (0.9 - car.rot) * 4 * dt; // the nose visibly dips
    }
  }
  // S on the ground: REVERSE (backing up without turning around)
  if (inp.down && car.onGround && steer === 0) {
    car.vx -= car.dir * CAR_ACCEL * 0.85 * dt;
    // capped reverse speed (like a real reverse gear)
    if (car.vx * car.dir < -CAR_MAX * 0.65) car.vx = -car.dir * CAR_MAX * 0.65;
    car.reversing = true;
    beepReverse(car.x);
  }

  // ----- TURBO 🔥: thrust along the nose direction -----
  if (car.boosting) {
    const nx = car.dir * Math.cos(car.rot); // nose vector
    const ny = Math.sin(car.rot);
    car.vx += nx * 1550 * dt;
    car.vy += ny * 1550 * dt;
    car.boost = Math.max(0, car.boost - 36 * dt);
    if (!car.wasBoosting) {
      sfx('boost', car.x);
      // small ignition spark: gives the turbo weight the moment it kicks in
      burst(car.x - car.dir * car.w * 0.4, car.y, '#ffd200', 5, 180);
    }
  } else if (car.onGround) {
    car.boost = Math.min(100, car.boost + 12 * dt); // slow recharge on the ground
  }
  car.wasBoosting = car.boosting;

  const maxSp = car.boosting ? 920 : CAR_MAX; // supersonic while boosting!
  car.vx = clamp(car.vx, -maxSp, maxSp);
  car.vy = clamp(car.vy, -900, 1100);

  // ----- jump + double-jump dodge -----
  if (inp.jump) {
    if (car.onGround) {
      car.vy = CAR_JUMP;
      car.onGround = false;
      car.jumps = 1;
      sfx('jump', car.x);
    } else if (car.jumps < 2) {
      car.jumps = 2;
      car.flipT = 0.5; // somersault!
      sfx('flip', car.x);
      if (steer !== 0) { // directional dodge (air dash)
        car.vx += steer * 430;
        car.vy = Math.min(car.vy, -240);
      } else {
        car.vy = CAR_JUMP * 0.8; // vertical double jump
      }
    }
  }

  // ----- FLIGHT ▬▬▬▬: hold jump in the air to climb -----
  // The gauge drains while flying; when it's empty you come back down.
  // It refills to 100 in ~3 seconds as soon as you stop flying.
  car.flying = false;
  if (!car.onGround && inp.holdJump && car.fly > 0) {
    car.vy -= (GRAV_CAR + 620) * dt;      // GENTLE, controlled climb
    if (car.vy < -400) car.vy = -400;     // capped climb speed
    car.fly = Math.max(0, car.fly - 95 * dt); // the gauge drains FAST (~1s of flight)
    car.flying = true;
  } else {
    car.fly = Math.min(100, car.fly + 34 * dt); // full recharge in ~3s
  }

  // gravity + movement
  car.vy += GRAV_CAR * dt * (car.boosting ? 0.75 : 1); // turbo carries you a bit
  car.x += car.vx * dt;
  car.y += car.vy * dt;
  car.flipT = Math.max(0, car.flipT - dt);

  // floor
  if (car.y >= FLOOR - car.h / 2 - 8) {
    if (!car.onGround && car.vy > 500) { burst(car.x, FLOOR - 6, '#ccc', 5, 150); sfx('thud', car.x); }
    // cosmetic landing squash (visual only, see drawCar): the harder
    // the fall, the more the car "absorbs" the shock by flattening
    if (!car.onGround && car.vy > 260) car.squashT = clamp(car.vy / 1300, 0.15, 1);
    car.y = FLOOR - car.h / 2 - 8;
    car.vy = 0;
    car.onGround = true;
    car.jumps = 0;
    car.flipT = 0;
  }
  // ----- walls, ceiling, and ENTERING THE GOALS -----
  const half = car.w / 2;
  // goal floor: the car can land INSIDE the goal (goalkeeper!)
  if ((car.x < POST_L + 6 || car.x > POST_R - 6) && car.vy >= 0 &&
      car.y >= GOAL_BOT - car.h / 2 - 8 && car.y < GOAL_BOT + 34) {
    car.y = GOAL_BOT - car.h / 2 - 8;
    car.vy = 0;
    car.onGround = true;
    car.jumps = 0;
  }
  const inMouthCar = car.y > GOAL_TOP + 12 && car.y < GOAL_BOT - 2;
  if (inMouthCar) {
    // at mouth height: we go INSIDE the goal, stopped by the back net
    if (car.x < WALL + 22) { car.x = WALL + 22; car.vx = Math.abs(car.vx) * 0.2; }
    if (car.x > W - WALL - 22) { car.x = W - WALL - 22; car.vx = -Math.abs(car.vx) * 0.2; }
  } else if (car.y > CEIL + TOPC_H && car.y < FLOOR - RAMP_H) {
    // small straight strip between the two curves (outside the mouth)
    if (car.x < POST_L + half) { car.x = POST_L + half; car.vx = Math.abs(car.vx) * 0.3; }
    if (car.x > POST_R - half) { car.x = POST_R - half; car.vx = -Math.abs(car.vx) * 0.3; }
  }
  if (car.y < CEIL + 20) { car.y = CEIL + 20; car.vy = Math.abs(car.vy) * 0.3; }
  rampCar(car, dt);      // curved bottom corner ramps
  topCornerCar(car);     // rounded ceiling corners

  // wheel spin (purely visual)
  car.wheelRot += car.vx * dt / 10;

  // decay of the cosmetic effects (landing squash, shot recoil)
  car.squashT = Math.max(0, car.squashT - dt * 6);
  car.kickT = Math.max(0, car.kickT - dt * 8);
}

/* reverse beep-beep (rate-limited so it doesn't get annoying) */
let lastBeep = 0;
function beepReverse(x) {
  const now = performance.now();
  if (now - lastBeep < 450) return;
  lastBeep = now;
  tone(880, 880, 0.09, 'square', 0.06, panOf(x));
}

/* ----- boost pads on the pitch ----- */
function updatePads(dt) {
  for (const p of state.pads) {
    if (!p.active) {
      p.t -= dt;
      if (p.t <= 0) p.active = true;
      continue;
    }
    for (const car of state.cars) {
      if (Math.abs(car.x - p.x) < 42 && car.y > FLOOR - 80) {
        p.active = false;
        p.t = 5; // respawns after 5 seconds
        car.boost = Math.min(100, car.boost + 40);
        burst(p.x, p.y - 10, '#ffd200', 8, 220);
        sfx('pad', p.x);
        break;
      }
    }
  }
}
