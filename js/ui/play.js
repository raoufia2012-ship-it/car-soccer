'use strict';

/* ============================================================
   PLAY SCREEN — draws the live match + pause panel.
   ============================================================ */

function drawPlay(t) {
  ctx.save();
  drawArena(t);
  drawPads(t);
  drawCar(state.cars[0], t);
  drawCar(state.cars[1], t);
  drawBall(t);
  drawFlyBars(); // flight gauge above the cars
  drawParticlesAndFloaters();
  ctx.restore();
  drawAmbience(); // "night match" vignette over the pitch
  drawMatchButtons(); // ☰ button at the top
  // big "GOOOAL!" over the zoomed camera
  if (state.phase === 'goal') {
    const pop = 1 + Math.max(0, state.phaseT - 2.4) * 3; // small pop-in effect
    ctx.save();
    ctx.translate(W / 2, 150);
    ctx.scale(pop, pop);
    bigText('GOOOAL!', 0, 0, 68, state.cars[state.scorer].color, 8);
    ctx.restore();
  }
  drawScoreboard();
  drawBoostBars();

  // kickoff countdown
  if (state.phase === 'count') {
    const n = Math.ceil(state.phaseT);
    if (n > 0 && n <= 3) bigText('' + n, W / 2, H / 2 - 40, 110, '#fff');
    else if (n <= 0) bigText('GO!', W / 2, H / 2 - 40, 110, '#ffd200');
  }
  if (paused) {
    // pause panel: EVERYTHING is here, as simple buttons
    ctx.fillStyle = 'rgba(0,0,0,0.65)'; ctx.fillRect(0, 0, W, H);
    // the panel itself fades in (alpha only: no scaling or translation,
    // so the buttons' clickable regions stay perfectly aligned with
    // their drawing throughout the animation).
    ctx.save();
    ctx.globalAlpha = Math.min(1, pauseT / 0.18);
    ctx.fillStyle = 'rgba(10,16,40,0.95)';
    rr(W / 2 - 180, H / 2 - 160, 360, 320, 20); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 3;
    rr(W / 2 - 180, H / 2 - 160, 360, 320, 20); ctx.stroke();
    bigText('PAUSE', W / 2, H / 2 - 110, 44, '#fff');
    drawButton(W / 2 - 140, H / 2 - 60, 280, 54, '▶ CONTINUE', () => { paused = false; sfx('click'); }, true);
    drawButton(W / 2 - 140, H / 2 + 8, 280, 54, muted ? '🔇 SOUND: OFF' : '🔊 SOUND: ON', () => { toggleMute(); sfx('click'); });
    drawButton(W / 2 - 140, H / 2 + 76, 280, 54, '🏠 MENU', backToMenu);
    ctx.restore();
  }
  // keys reminder (PC)
  if (!isCoarse && !paused) {
    ctx.font = 'bold 13px "Segoe UI"'; ctx.textAlign = 'center'; ctx.lineWidth = 3;
    const hint = mode === '2p' ? 'P1: W A S D · SHIFT turbo     P2: ↑ ← ↓ → · CTRL turbo' : 'W jump · A/D move · S dive · SHIFT TURBO 🔥';
    ctx.strokeStyle = 'rgba(0,0,0,0.5)'; ctx.strokeText(hint, W / 2, H - 10);
    ctx.fillStyle = 'rgba(255,255,255,0.8)'; ctx.fillText(hint, W / 2, H - 10);
  }
}
