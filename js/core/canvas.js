'use strict';

/* ============================================================
   CANVAS — element, distortion-free scaling, orientation hint.
   ============================================================ */

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

/* ----- scaling WITHOUT distortion -----
   The game has a fixed internal resolution (W×H, 16:9). We compute
   the largest 16:9 size that fits the screen, center the canvas
   (letterbox), and align the touch buttons on top of it.
   Result: the image is never stretched, on any device. */
function fitCanvas() {
  const vw = innerWidth, vh = innerHeight;
  const scale = Math.min(vw / W, vh / H);
  const cw = Math.round(W * scale), ch = Math.round(H * scale);
  const left = Math.round((vw - cw) / 2), top = Math.round((vh - ch) / 2);
  canvas.style.width = cw + 'px';
  canvas.style.height = ch + 'px';
  canvas.style.left = left + 'px';
  canvas.style.top = top + 'px';

  /* HIGH-RESOLUTION internal buffer (Retina/mobile): the game always
     draws in the logical W×H space, but the physical canvas gets more
     real pixels so it stays SHARP on high-density screens (otherwise
     the browser would blurrily upscale from 1200×675). Capping at 2
     avoids a needlessly huge buffer on 3x phones, which would cost
     performance for nothing. */
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  canvas.width = Math.round(cw * dpr);
  canvas.height = Math.round(ch * dpr);
  ctx.setTransform(scale * dpr, 0, 0, scale * dpr, 0, 0);

  const touchUI = document.getElementById('touch-ui');
  if (touchUI) {
    touchUI.style.width = cw + 'px';
    touchUI.style.height = ch + 'px';
    touchUI.style.left = left + 'px';
    touchUI.style.top = top + 'px';
  }
  checkOrientation();
}

/* landscape-only game: on a phone held in portrait, we ask the player
   to rotate the device instead of showing a tiny unreadable game. */
function checkOrientation() {
  const hint = document.getElementById('rotate-hint');
  if (!hint) return;
  const portrait = innerHeight > innerWidth;
  hint.classList.toggle('hidden', !(isCoarse && portrait));
}

addEventListener('resize', fitCanvas);
addEventListener('orientationchange', fitCanvas);
fitCanvas();
