'use strict';

/* ============================================================
   FACTORIES — build a car, a ball, the boost pads, a match.
   ============================================================ */

// side: 0 = left player (scores on the right), 1 = right player
function makeCar(side, isAI, charId) {
  const pl = PLAYERS[charId] || (side === 0 ? PLAYERS.classic : PLAYERS.classic2);
  return {
    side, isAI,
    char: pl.id,            // selected character (colors, flag, goal)
    x: side === 0 ? 300 : W - 300,  // outside the big corner ramps
    y: FLOOR - 18,
    vx: 0, vy: 0,
    w: 78, h: 30,           // body size (slightly bigger)
    onGround: true,
    jumps: 0,               // jumps used (max 2 = double jump / dodge)
    fly: 100,               // FLIGHT gauge ▬▬▬▬: hold W to climb, drains then recharges in ~3s
    dir: side === 0 ? 1 : -1, // which way the nose points
    rot: 0,                 // nose rotation (in air): negative = nose up
    boost: 45,              // TURBO gauge (0..100)
    boosting: false,
    wasBoosting: false,
    reversing: false,       // driving in reverse (white lights + beep)
    wheelRot: 0,            // wheel rotation
    flipT: 0,               // remaining somersault time (double jump)
    throttle: 0,            // -1..1, used for the exhaust flames
    color: pl.body,
    color2: pl.accent,
    livery: !pl.id.startsWith('classic'), // 🏁 country flag painted on the body
    shape: pl.carShape || 'speed',        // the team's car shape
    name: '',
    // ----- purely cosmetic (game feel), NEVER affects physics -----
    squashT: 0,             // landing squash (0 = normal)
    kickT: 0, kickDX: 0, kickDY: 0  // small visual recoil after a big shot
  };
}

// boost refills placed on the pitch (like Rocket League pads)
function makePads() {
  return [W * 0.26, W * 0.5, W * 0.74].map(x => ({ x, y: FLOOR - 12, active: true, t: 0 }));
}

function makeBall() {
  return {
    x: W / 2, y: 250, vx: 0, vy: 0, r: BALL_R, rot: 0,
    // ----- purely cosmetic (game feel), NEVER affects physics -----
    squashT: 0, squashNX: 0, squashNY: 1,  // contact squash (0 = perfectly round)
    trail: []                               // trail when the ball goes very fast
  };
}

function makeMatch(gameMode) {
  const p1 = makeCar(0, false, p1Char);
  const p2 = makeCar(1, gameMode === 'ai', p2Char);
  p1.name = gameMode === 'ai' ? 'YOU' : 'PLAYER 1';
  p2.name = gameMode === 'ai' ? 'AI 🤖' : 'PLAYER 2';
  return {
    cars: [p1, p2],
    ball: makeBall(),
    pads: makePads(),
    score: [0, 0],
    time: settings.timer,    // countdown when the timer is on
    sudden: false,           // sudden death (tie at full time)
    phase: 'count',          // count (3,2,1) | live | goal
    phaseT: 3.2,             // time left in the current phase
    scorer: -1,              // who just scored
    winner: -1
  };
}
