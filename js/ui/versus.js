'use strict';

/* ============================================================
   VS SCREEN — preparation screen before kickoff.
   The cars are THE main subject: big, centered, animated
   (suspension, glowing halo, slight camera drift). The player
   confirms with START MATCH — nothing is automatic. On confirm,
   a short animation sends the cars off to the pitch, then the
   match starts normally (3-2-1-GO countdown unchanged).
   ============================================================ */

const PREP_LAUNCH_DUR = 0.5; // duration of the "off to the pitch" animation

/* pressing START MATCH: starts the short "cars leave for the pitch"
   animation, then actually starts the match (see loop()) */
function launchMatch() {
  if (prepLaunchT >= 0) return; // already launched, ignore a double-click
  prepLaunchT = 0;
  sfx('go');
}

function drawVS(t) {
  const p1 = PLAYERS[p1Char], p2 = PLAYERS[p2Char];
  const is2p = vsPending === '2p';
  const launching = prepLaunchT >= 0;
  const lp = launching ? clamp(prepLaunchT / PREP_LAUNCH_DUR, 0, 1) : 0;
  const lpEase = lp * lp; // accelerates as it leaves

  // continuous slight camera drift (attract-mode): stopped during the
  // launch so the cars' exit stays sharp and readable
  const driftX = launching ? 0 : Math.sin(t * 0.5) * 5;
  const driftY = launching ? 0 : Math.cos(t * 0.35) * 3;

  ctx.save();
  ctx.translate(driftX, driftY);
  drawArena(t); // the stadium already provides animated lights (floodlights, neon)
  ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(-30, -30, W + 60, H + 60);

  const carScale = is2p ? 2.05 : 2.5;
  const leftX = is2p ? W * 0.26 : W * 0.25;
  const rightX = is2p ? W * 0.74 : W * 0.75;
  const baseY = is2p ? 400 : 415;

  // slide in (once, when the screen opens) then leave for the pitch
  // when START has been pressed
  const e = Math.min(1, sceneT / 0.5), arrEase = 1 - Math.pow(1 - e, 3);
  let c1x = launching ? leftX : -260 + (leftX + 260) * arrEase;
  let c2x = launching ? rightX : (W + 260) + (rightX - (W + 260)) * arrEase;
  const launchDrop = lpEase * 420; // the cars dive "into" the screen toward the pitch
  const launchZoom = 1 + lpEase * 0.25;

  // suspension: constant gentle bounce, out of phase between the 2 cars
  const bob1 = Math.abs(Math.sin(t * 3)) * 10;
  const bob2 = Math.abs(Math.sin(t * 3 + 1.4)) * 10;

  for (const [cx, dir, char, neon, bob] of [[c1x, 1, p1.id, p1.neon, bob1], [c2x, -1, p2.id, p2.neon, bob2]]) {
    // glowing halo behind the car, in its color (soft pulse)
    const glow = ctx.createRadialGradient(cx, baseY, 15, cx, baseY, 190);
    glow.addColorStop(0, neon + Math.floor(50 + 20 * Math.sin(t * 4)).toString(16));
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(cx - 190, baseY - 190, 380, 380);

    const car = makeCar(0, false, char); car.dir = dir; car.x = 0;
    car.y = FLOOR - 18 - bob; car.onGround = false;
    ctx.save();
    ctx.translate(cx, baseY + launchDrop);
    ctx.scale(carScale * launchZoom, carScale * launchZoom);
    ctx.translate(0, -(FLOOR - 18));
    drawCar(car, t);
    ctx.restore();
  }

  if (!launching) {
    // flags + names above each car (fade-in)
    const fe = clamp((sceneT - 0.3) / 0.3, 0, 1);
    ctx.save(); ctx.globalAlpha = fe;
    p1.drawFlag(leftX - 65, 96 - (1 - fe) * 18, 130, 74);
    p2.drawFlag(rightX - 65, 96 - (1 - fe) * 18, 130, 74);
    ctx.restore();
    bigText(is2p ? 'PLAYER 1' : 'YOU', leftX, 196, 26, '#4d79ff', 3);
    bigText(is2p ? 'PLAYER 2' : 'AI 🤖', rightX, 196, 26, '#ff9100', 3);
    bigText(p1.name, leftX, 226, 18, '#fff', 3);
    bigText(p2.name, rightX, 226, 18, '#fff', 3);

    // summary in the center: "PLAYER 1 VS PLAYER 2" (or "YOU VS AI")
    const vsPop = clamp((sceneT - 0.1) / 0.25, 0, 1);
    ctx.save();
    ctx.globalAlpha = vsPop;
    bigText(is2p ? 'PLAYER 1 VS PLAYER 2' : 'YOU VS AI', W / 2, 46, 32, '#ffd200', 4);
    ctx.restore();
    const vsScale = 0.85 + 0.15 * vsPop + 0.05 * Math.sin(t * 6) * vsPop;
    ctx.save();
    ctx.globalAlpha = vsPop * 0.9;
    ctx.translate(W / 2, is2p ? 400 : 415);
    ctx.scale(vsScale, vsScale);
    bigText('VS', 0, 0, 54, '#fff', 6);
    ctx.restore();

    // each player's controls (2-player mode only — the vs-AI screen
    // stays clean, the cars remain the main subject)
    if (is2p) {
      ctx.textAlign = 'center'; ctx.font = '900 13px "Segoe UI"'; ctx.fillStyle = '#4d79ff';
      ctx.fillText('CONTROLS', leftX, 488);
      drawKeyLine(leftX - 10, 507, 'A/D', 'move', '#fff');
      drawKeyLine(leftX - 10, 525, 'W', 'jump (hold = fly)', '#fff');
      drawKeyLine(leftX - 10, 543, 'S', 'dive / reverse', '#fff');
      drawKeyLine(leftX - 10, 561, 'SHIFT', 'turbo 🔥', '#fff');

      ctx.textAlign = 'center'; ctx.font = '900 13px "Segoe UI"'; ctx.fillStyle = '#ff9100';
      ctx.fillText('CONTROLS', rightX, 488);
      drawKeyLine(rightX - 10, 507, '←/→', 'move', '#fff');
      drawKeyLine(rightX - 10, 525, '↑', 'jump (hold = fly)', '#fff');
      drawKeyLine(rightX - 10, 543, '↓', 'dive / reverse', '#fff');
      drawKeyLine(rightX - 10, 561, 'CTRL', 'turbo 🔥', '#fff');
    }
  }

  ctx.restore(); // end of the slight camera drift

  // brief flash right before kickoff (end of the launch animation)
  if (launching && lp > 0.6) {
    ctx.fillStyle = 'rgba(255,255,255,' + ((lp - 0.6) / 0.4 * 0.85) + ')';
    ctx.fillRect(0, 0, W, H);
  }

  // buttons ALWAYS drawn outside the camera drift: their clickable
  // region stays perfectly aligned with their drawing.
  if (!launching) {
    drawButton(W / 2 - 150, H - 96, 300, 62, '▶ START MATCH', launchMatch, true);
    drawButton(24, H - 62, 140, 42, '← BACK', backToChoose);
  }
}
