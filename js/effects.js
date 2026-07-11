'use strict';

/* ============================================================
   EFFECTS — particles, confetti, floating texts, hit-stop.
   ============================================================ */

function mkFloat(x, y, text, color, size) {
  return { x, y, text, color, size: size || 26, t: 0, dur: 1 };
}

/* perf safety net: on a very old phone we never want to pile up
   hundreds of particles (goal streaks, sudden death...). Beyond the
   cap, new particles are simply dropped (invisible in the chaos of
   an explosion) and the game stays smooth. */
const MAX_PARTICLES = 500;
function addParticle(p) {
  if (particles.length < MAX_PARTICLES) particles.push(p);
}

/* particle burst (impacts, smoke...) */
function burst(x, y, color, n, speed) {
  for (let i = 0; i < n; i++) {
    const a = rand(0, Math.PI * 2), sp = rand(60, speed || 300);
    addParticle({
      x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 60,
      t: 0, dur: rand(0.3, 0.7), r: rand(2, 5), color, grav: 800
    });
  }
}

/* big multicolored confetti rain (goal!) */
function confettiBlast(x, y) {
  const colors = ['#ffd200', '#ff5252', '#4dd0e1', '#aed581', '#ff00be', '#fff'];
  for (let i = 0; i < 80; i++) {
    const a = rand(-Math.PI, 0); // upwards
    const sp = rand(200, 700);
    addParticle({
      x: x + rand(-30, 30), y,
      vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
      t: 0, dur: rand(1, 2.2), r: rand(3, 6),
      color: pick(colors), grav: 500, conf: true
    });
  }
}

/* dust trail behind an accelerating car */
function dust(x, y, dir) {
  addParticle({
    x, y, vx: -dir * rand(40, 120), vy: rand(-50, -10),
    t: 0, dur: rand(0.2, 0.45), r: rand(2, 4.5), color: 'rgba(200,200,200,0.7)', grav: -60
  });
}

/* SHORT FREEZE of the image (2-4 frames) on a violent impact: car and
   ball freeze for a split second before the physics reaction, which
   gives the collision a real "punch" (classic arcade technique —
   hit-stop / freeze-frame). */
function hitStop(dur) { hitStopT = Math.max(hitStopT, dur); }

function updateEffects(dt) {
  for (const p of particles) {
    p.t += dt;
    p.vy += (p.grav || 0) * dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    if (p.conf) p.vx *= 0.99; // confetti floats
  }
  particles = particles.filter(p => p.t < p.dur);
  for (const fl of floaters) { fl.t += dt; fl.y -= 55 * dt; }
  floaters = floaters.filter(fl => fl.t < fl.dur);
  shakeT -= dt;
  slowT = Math.max(0, slowT - dt);
}

function drawParticlesAndFloaters() {
  for (const p of particles) {
    ctx.globalAlpha = 1 - p.t / p.dur;
    ctx.fillStyle = p.color;
    if (p.conf) { // rectangular spinning confetti
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.t * 6);
      ctx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r);
      ctx.restore();
    } else {
      circle(p.x, p.y, p.r); ctx.fill();
    }
  }
  ctx.globalAlpha = 1;
  for (const fl of floaters) {
    ctx.globalAlpha = 1 - (fl.t / fl.dur) * (fl.t / fl.dur);
    bigText(fl.text, fl.x, fl.y, fl.size, fl.color, 4);
  }
  ctx.globalAlpha = 1;
}
