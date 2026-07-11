'use strict';

/* ============================================================
   MAIN — the 60 FPS loop: updates, scene routing, transitions.
   ============================================================ */

const FADE_DUR = 0.22; // fade-in duration when entering a screen
let last = performance.now();
let lastScene = scene, wasPaused = false;

function loop(now) {
  const dt = Math.min(0.033, (now - last) / 1000); // capped dt (inactive tab)
  last = now;
  const t = now / 1000;

  // detect scene/pause changes to trigger the entry fades
  if (scene !== lastScene) { sceneT = 0; lastScene = scene; } else sceneT += dt;
  if (paused !== wasPaused) { pauseT = 0; wasPaused = paused; } else if (paused) pauseT += dt;
  btnPressT = Math.max(0, btnPressT - dt); // button click micro-animation

  // launch animation running (cars left for the pitch): once it ends,
  // the real match starts (3-2-1-GO countdown included)
  if (scene === 'vs' && prepLaunchT >= 0) {
    prepLaunchT += dt;
    if (prepLaunchT > PREP_LAUNCH_DUR) startMatch(vsPending);
  }

  // updates (short freeze-frame on a violent impact: see hitStop())
  if (hitStopT > 0) {
    hitStopT = Math.max(0, hitStopT - dt);
  } else {
    if (scene === 'play' && !paused) updateMatch(dt);
    if (scene === 'menu') updateDemo(dt);
    updateEffects(dt);
  }

  // drawing (with camera shake)
  clickRegions = [];
  ctx.save();
  if (shakeT > 0) {
    const k = shakeT / shakeDur;
    ctx.translate(rand(-1, 1) * shakeMag * k, rand(-1, 1) * shakeMag * k);
  }
  ctx.clearRect(-30, -30, W + 60, H + 60);
  if (scene === 'menu') drawMenu(t);
  else if (scene === 'choose') drawChoose(t);
  else if (scene === 'settings') drawSettings(t);
  else if (scene === 'vs') drawVS(t);
  else if (scene === 'play') drawPlay(t);
  else if (scene === 'end') drawEnd(t);
  ctx.restore();

  // quick fade-in when entering any screen (menu, select, match, end...):
  // a simple black overlay that clears out, without touching the click
  // regions or the scene logic.
  if (sceneT < FADE_DUR) {
    ctx.fillStyle = 'rgba(0,0,0,' + (1 - sceneT / FADE_DUR) + ')';
    ctx.fillRect(0, 0, W, H);
  }

  // touch buttons only visible in-game (player 1)
  touchUI.classList.toggle('hidden', !(scene === 'play' && isCoarse));

  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
