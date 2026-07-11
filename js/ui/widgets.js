'use strict';

/* ============================================================
   UI WIDGETS — the shared button, and small helpers.
   ============================================================ */

function drawButton(x, y, w, h, text, fn, hot) {
  // the clickable region ALWAYS keeps the normal size (x,y,w,h): only the
  // DRAWING squishes slightly on click, never the hit area — no risk of
  // the visuals and the hitbox drifting apart.
  clickRegions.push({ x, y, w, h, fn });
  const hover = mouse.x >= x && mouse.x <= x + w && mouse.y >= y && mouse.y <= y + h;
  const pressed = btnPressT > 0 && btnPressX >= x && btnPressX <= x + w && btnPressY >= y && btnPressY <= y + h;
  const sh = pressed ? 0.07 * (btnPressT / 0.1) : 0; // % of visual squish
  const dx = x + w * sh / 2, dy = y + h * sh / 2, dw = w * (1 - sh), dh = h * (1 - sh);
  ctx.fillStyle = hover ? '#ffe54a' : (hot ? '#ffd200' : '#f0f0f0');
  rr(dx, dy, dw, dh, 14); ctx.fill();
  ctx.strokeStyle = '#000'; ctx.lineWidth = 3; rr(dx, dy, dw, dh, 14); ctx.stroke();
  ctx.fillStyle = '#111'; ctx.font = '900 22px "Segoe UI"';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(text, x + w / 2, y + h / 2 + 1);
}

/* ----- one "KEY — action" line for the controls reminders ----- */
function drawKeyLine(x, y, key, desc, color) {
  ctx.textBaseline = 'middle';
  ctx.font = '900 13px "Segoe UI"'; ctx.textAlign = 'right'; ctx.fillStyle = color;
  ctx.fillText(key, x, y);
  ctx.font = '13px "Segoe UI"'; ctx.textAlign = 'left'; ctx.fillStyle = 'rgba(255,255,255,0.8)';
  ctx.fillText(desc, x + 10, y);
}
