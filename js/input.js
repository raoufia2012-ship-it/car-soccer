'use strict';

/* ============================================================
   INPUT — keyboard (2 players), touch, mouse.
   Player 1: A/D (move), W (jump/fly), S (dive/reverse), SHIFT turbo
   Player 2: ←/→ (move), ↑ (jump/fly), ↓ (dive/reverse), CTRL turbo
   In vs-AI mode the arrow keys also work for player 1.
   ============================================================ */

const keys = {};
// jump pulses (rising edge): detected on keydown
let jumpPress = [false, false];
const touch = { left: false, right: false, boost: false, down: false, jumpHold: false };
let touchJumpPress = false;

addEventListener('keydown', e => {
  ensureAC();
  const k = e.key.toLowerCase();
  if ([' ', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'enter'].includes(k)) e.preventDefault();
  if (!e.repeat) {
    // jumps (one pulse per press) — W (or Z on AZERTY) for player 1;
    // SPACE also works in 2-player mode as an alternate key for P1
    if (k === 'w' || k === 'z' || (mode === 'ai' && (k === 'arrowup' || k === ' ')) || (mode === '2p' && k === ' ')) jumpPress[0] = true;
    // ENTER also works as an alternate jump for player 2
    if (mode === '2p' && (k === 'arrowup' || k === 'enter')) jumpPress[1] = true;
    // shortcuts
    if (k === 'm') toggleMute();
    if (k === 'p' && scene === 'play') paused = !paused;
    if (k === 'escape' && scene === 'play') backToMenu();
    if (k === 'enter') {
      if (scene === 'menu') openChoose('ai');
      else if (scene === 'choose') chooseConfirm();
      else if (scene === 'end') startMatch(mode);
    }
    // character select navigation (P1: A/D · P2: ←/→ in 2-player mode)
    if (scene === 'choose') chooseKey(k);
  }
  keys[k] = true;
});
addEventListener('keyup', e => { keys[e.key.toLowerCase()] = false; });
addEventListener('blur', () => { for (const k in keys) keys[k] = false; });

/* reads inputs for player i (0 or 1); consumes the jump pulse */
function readPlayer(i) {
  let inp;
  if (i === 0) {
    // Player 1: W jump/FLY (hold) · A left · D right · S dive · Shift TURBO
    inp = {
      left: keys['a'] || keys['q'] || (mode === 'ai' && keys['arrowleft']) || touch.left,
      right: keys['d'] || (mode === 'ai' && keys['arrowright']) || touch.right,
      down: keys['s'] || (mode === 'ai' && keys['arrowdown']) || touch.down,
      boost: keys['shift'] || touch.boost,
      jump: jumpPress[0] || touchJumpPress,
      holdJump: keys['w'] || keys['z'] || (mode === 'ai' && (keys['arrowup'] || keys[' '])) || (mode === '2p' && keys[' ']) || touch.jumpHold
    };
    jumpPress[0] = false; touchJumpPress = false;
  } else {
    // Player 2: arrow keys + Ctrl TURBO (ENTER = alternate jump)
    inp = {
      left: keys['arrowleft'],
      right: keys['arrowright'],
      down: keys['arrowdown'],
      boost: keys['control'],
      jump: jumpPress[1],
      holdJump: keys['arrowup'] || keys['enter']
    };
    jumpPress[1] = false;
  }
  return inp;
}

/* ----- touch buttons (player 1 on mobile) ----- */
const touchUI = document.getElementById('touch-ui');
document.querySelectorAll('.tbtn').forEach(btn => {
  const k = btn.dataset.k;
  const on = e => {
    e.preventDefault(); ensureAC(); isCoarse = true;
    if (k === 'jump') { touchJumpPress = true; touch.jumpHold = true; }
    else touch[k] = true;
  };
  const off = e => {
    e.preventDefault();
    if (k === 'jump') touch.jumpHold = false;
    else touch[k] = false;
  };
  btn.addEventListener('pointerdown', on);
  btn.addEventListener('pointerup', off);
  btn.addEventListener('pointerleave', off);
  btn.addEventListener('pointercancel', off);
  btn.addEventListener('contextmenu', e => e.preventDefault());
});

/* ----- mouse / taps on the canvas (menus) ----- */
function canvasPos(e) {
  // the canvas is scaled to fit the screen: simple rule of three
  const r = canvas.getBoundingClientRect();
  return {
    x: (e.clientX - r.left) * W / r.width,
    y: (e.clientY - r.top) * H / r.height
  };
}
canvas.addEventListener('pointermove', e => { mouse = canvasPos(e); });
canvas.addEventListener('pointerdown', e => {
  ensureAC();
  const p = canvasPos(e);
  for (const rgn of clickRegions) {
    if (p.x >= rgn.x && p.x <= rgn.x + rgn.w && p.y >= rgn.y && p.y <= rgn.y + rgn.h) {
      btnPressT = 0.1; btnPressX = p.x; btnPressY = p.y; // small button squish
      rgn.fn();
      return;
    }
  }
});
