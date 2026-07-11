'use strict';

/* ============================================================
   CAR RENDERING — 6 body shapes, one per team!
   speed = supercar · muscle = muscle car · formula = F1
   buggy = fun compact · suv = 4x4 · limo = limousine (Mobutu 👑)
   ============================================================ */

function carBodyPath(shape) {
  ctx.beginPath();
  if (shape === 'muscle') {
    // muscle car: long hood, tall muscular rear
    ctx.moveTo(37, 5);
    ctx.quadraticCurveTo(39, -2, 29, -6);
    ctx.lineTo(14, -8);
    ctx.quadraticCurveTo(8, -16, 0, -18.5);
    ctx.quadraticCurveTo(-10, -20.5, -16, -17.5);
    ctx.quadraticCurveTo(-28, -20, -34, -12);
    ctx.lineTo(-36, -4);
    ctx.lineTo(-36, 5);
  } else if (shape === 'formula') {
    // Formula 1: ultra low, pointy nose, cockpit bump
    ctx.moveTo(39, 3);
    ctx.lineTo(39, -1.5);
    ctx.lineTo(22, -3.5);
    ctx.lineTo(10, -4.5);
    ctx.quadraticCurveTo(6, -14, -2, -14.5);
    ctx.quadraticCurveTo(-9, -14.5, -11, -5);
    ctx.lineTo(-24, -4.5);
    ctx.quadraticCurveTo(-33, -4, -35, 1);
    ctx.lineTo(-35, 3);
  } else if (shape === 'buggy') {
    // buggy: round and fun
    ctx.moveTo(33, 5);
    ctx.quadraticCurveTo(37, -4, 27, -8);
    ctx.quadraticCurveTo(18, -19, 2, -20.5);
    ctx.quadraticCurveTo(-14, -20, -22, -9);
    ctx.quadraticCurveTo(-32, -5, -33, 3);
    ctx.lineTo(-33, 5);
  } else if (shape === 'suv') {
    // 4x4: tall and boxy, sturdy
    ctx.moveTo(37, 5);
    ctx.lineTo(37, -5);
    ctx.lineTo(22, -7.5);
    ctx.lineTo(17, -19);
    ctx.lineTo(-10, -20);
    ctx.lineTo(-25, -19);
    ctx.lineTo(-29, -8);
    ctx.lineTo(-36, -6.5);
    ctx.lineTo(-36, 5);
  } else if (shape === 'limo') {
    // presidential limousine: long and flat 👑
    ctx.moveTo(38, 5);
    ctx.quadraticCurveTo(39, -2, 31, -5.5);
    ctx.lineTo(22, -6.5);
    ctx.lineTo(17, -15);
    ctx.lineTo(-16, -15.5);
    ctx.lineTo(-21, -6.5);
    ctx.lineTo(-36, -5.5);
    ctx.lineTo(-36, 5);
  } else {
    // supercar (default shape)
    ctx.moveTo(38, 5);
    ctx.quadraticCurveTo(39.5, -3, 28, -6);
    ctx.lineTo(12, -8.5);
    ctx.quadraticCurveTo(6, -18, -4, -20.5);
    ctx.quadraticCurveTo(-16, -22.5, -23, -15);
    ctx.quadraticCurveTo(-32, -12, -36, -6);
    ctx.lineTo(-36, 5);
  }
  ctx.closePath();
}

/* the canopy of each shape */
function carCanopyPath(shape) {
  ctx.beginPath();
  if (shape === 'muscle') {
    ctx.moveTo(4, -15);
    ctx.quadraticCurveTo(0, -18, -6, -18.2);
    ctx.quadraticCurveTo(-12, -17.5, -14, -11);
    ctx.lineTo(-2, -9.5);
  } else if (shape === 'formula') {
    ctx.moveTo(2, -12);
    ctx.quadraticCurveTo(-2, -15, -6, -14.5);
    ctx.quadraticCurveTo(-9, -13, -9, -7);
    ctx.lineTo(0, -6.5);
  } else if (shape === 'buggy') {
    ctx.moveTo(9, -14);
    ctx.quadraticCurveTo(4, -19, -4, -19.5);
    ctx.quadraticCurveTo(-13, -18.5, -16, -10);
    ctx.lineTo(-4, -8.5);
  } else if (shape === 'suv') {
    ctx.moveTo(13, -17);
    ctx.lineTo(-20, -18);
    ctx.lineTo(-23, -9.5);
    ctx.lineTo(11, -9);
  } else if (shape === 'limo') {
    ctx.moveTo(15, -13.5);
    ctx.lineTo(-14, -14);
    ctx.lineTo(-17, -8);
    ctx.lineTo(12, -7.5);
  } else {
    ctx.moveTo(6, -16);
    ctx.quadraticCurveTo(2, -19.5, -5, -19.8);
    ctx.quadraticCurveTo(-13, -19.6, -16, -13);
    ctx.lineTo(-3, -10.5);
  }
  ctx.closePath();
}

/* wheels [x, y, radius] and the driver's head position per shape */
const CAR_WHEELS = {
  speed: [[-19, 10, 12.5], [23, 12, 9.5]],
  muscle: [[-19, 9, 13.5], [23, 12, 10]],
  formula: [[-20, 9, 13], [25, 10, 11.5]],
  buggy: [[-17, 10, 12], [20, 11, 11]],
  suv: [[-19, 9, 13.5], [21, 9, 13.5]],
  limo: [[-24, 11, 10.5], [26, 11, 10.5]]
};
const CAR_HEAD = {
  speed: [-7, -13, 5], muscle: [-6, -13, 5], formula: [-4, -9.5, 4],
  buggy: [-5, -13, 5.2], suv: [-6, -13, 5.2], limo: [-2, -10.5, 4.2]
};
const REAR_FLAG_Y = { speed: -29, muscle: -28, formula: -25, buggy: -21, suv: -21, limo: -16 };

/* ----- one car ----- */
function drawCar(car, t) {
  ctx.save();
  // small visual recoil after a big shot: the REAL position (car.x/car.y,
  // the physics) never changes — only the drawing shifts a few pixels and
  // comes back, to sell the impact (game feel).
  const kick = (car.kickT || 0) / 0.12;
  ctx.translate(car.x + (car.kickDX || 0) * kick * 6, car.y + (car.kickDY || 0) * kick * 6);

  // ground shadow
  const airH = clamp((FLOOR - car.y) / 250, 0, 1);
  ctx.fillStyle = 'rgba(0,0,0,' + (0.3 - airH * 0.18) + ')';
  ctx.beginPath();
  ctx.ellipse(0, FLOOR - car.y - 2, (car.w / 2) * (1 - airH * 0.3), 6, 0, 0, Math.PI * 2);
  ctx.fill();

  // orientation: nose direction + air rotation (or double-jump somersault)
  ctx.scale(car.dir, 1);
  ctx.rotate(car.rot + (car.flipT > 0 ? (0.5 - car.flipT) * Math.PI * 4 : 0));
  ctx.scale(1.15, 1.15); // cars a bit bigger in-game

  // cosmetic landing squash: the car "absorbs" the shock by briefly
  // flattening (never touches the real car.w/car.h)
  const sqc = (car.squashT || 0) * 0.22;
  if (sqc > 0.001) ctx.scale(1 + sqc, 1 - sqc);

  const w = car.w, h = car.h;

  // speed lines when rolling very fast WITHOUT turbo (turbo already has
  // its own flame below): readability + sense of speed
  if (!car.boosting && Math.abs(car.vx) > CAR_MAX * 0.8) {
    ctx.save();
    ctx.strokeStyle = 'rgba(255,255,255,0.55)';
    ctx.lineWidth = 2; ctx.lineCap = 'round';
    for (let i = 0; i < 3; i++) {
      const ly = -13 + i * 11;
      ctx.globalAlpha = 0.35 + 0.25 * Math.sin(t * 25 + i * 2);
      ctx.beginPath();
      ctx.moveTo(-w / 2 - 4, ly);
      ctx.lineTo(-w / 2 - 4 - rand(10, 20), ly);
      ctx.stroke();
    }
    ctx.restore();
  }

  // BIG TURBO flame 🔥 (or small acceleration flame)
  if (car.boosting) {
    ctx.fillStyle = pick(['#ff9100', '#ffd200', '#ff5252', '#fff']);
    ctx.beginPath();
    ctx.moveTo(-w / 2 - 2, -6);
    ctx.lineTo(-w / 2 - rand(30, 55), rand(-8, 8));
    ctx.lineTo(-w / 2 - 2, 8);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    circle(-w / 2 - rand(6, 14), rand(-4, 4), rand(2, 5)); ctx.fill();
  } else if (car.throttle !== 0) {
    ctx.fillStyle = pick(['#ff9100', '#ffd200', '#ff5252']);
    ctx.beginPath();
    ctx.moveTo(-w / 2 - 2, -2);
    ctx.lineTo(-w / 2 - rand(12, 26), rand(-4, 4));
    ctx.lineTo(-w / 2 - 2, 5);
    ctx.closePath(); ctx.fill();
  }
  // white reversing lights
  if (car.reversing) {
    ctx.fillStyle = '#fff';
    ctx.fillRect(-w / 2 - 3, -8, 4, 5);
    ctx.fillRect(-w / 2 - 3, 3, 4, 5);
  }

  // ===== THE TEAM CAR (every nation has ITS shape!) 🏎️✨ =====
  const plc = PLAYERS[car.char];
  const tier = plc ? plc.tier : null;
  const neon = plc ? plc.neon : '#19c5ff';
  const shape = car.shape || 'speed';

  // UNDERGLOW NEON (stronger for legends)
  ctx.globalAlpha = (tier === 'legend' ? 0.45 : 0.25) + 0.12 * Math.sin(t * 8);
  ctx.fillStyle = neon;
  ctx.beginPath(); ctx.ellipse(0, 16, 36, 5.5, 0, 0, Math.PI * 2); ctx.fill();
  ctx.globalAlpha = 1;

  // ----- wheels (size/position per shape) -----
  const rimColor = tier === 'legend' ? '#ffd700' : neon;
  const wheel = (wx, wy, r) => {
    ctx.save();
    ctx.translate(wx, wy);
    const tg = ctx.createRadialGradient(-r * 0.3, -r * 0.3, r * 0.2, 0, 0, r);
    tg.addColorStop(0, '#2e2e2e'); tg.addColorStop(1, '#0a0a0a');
    ctx.fillStyle = tg; circle(0, 0, r); ctx.fill();
    ctx.strokeStyle = '#000'; ctx.lineWidth = 1.5; circle(0, 0, r); ctx.stroke();
    ctx.save();
    ctx.shadowColor = rimColor; ctx.shadowBlur = 7;
    ctx.strokeStyle = rimColor; ctx.lineWidth = 2.5;
    circle(0, 0, r * 0.6); ctx.stroke();
    ctx.restore();
    ctx.rotate(car.wheelRot);
    ctx.strokeStyle = '#8a8a8a'; ctx.lineWidth = 1.4;
    for (let i = 0; i < 5; i++) {
      const a = i * Math.PI * 2 / 5;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(a) * r * 0.55, Math.sin(a) * r * 0.55);
      ctx.stroke();
    }
    ctx.fillStyle = '#e8e8e8'; circle(0, 0, r * 0.16); ctx.fill();
    ctx.restore();
  };
  const wheels = CAR_WHEELS[shape] || CAR_WHEELS.speed;
  for (const [wx, wy, wr] of wheels) wheel(wx, wy, wr);

  // ----- SPOILER (per shape) -----
  if (shape === 'formula') {
    // BIG F1 rear wing
    ctx.strokeStyle = '#0d1220'; ctx.lineWidth = 3.5;
    ctx.beginPath(); ctx.moveTo(-28, -4); ctx.lineTo(-32, -22); ctx.stroke();
    ctx.fillStyle = car.color;
    rr(-42, -25, 22, 5.5, 2); ctx.fill();
    ctx.strokeStyle = tier === 'legend' ? '#ffd700' : 'rgba(0,0,0,0.45)';
    ctx.lineWidth = 1.5;
    rr(-42, -25, 22, 5.5, 2); ctx.stroke();
    ctx.fillStyle = car.color2;
    rr(-43, -29, 3, 10, 1); ctx.fill();
  } else if (shape === 'suv') {
    // 4x4 roof rails
    ctx.fillStyle = '#0d1220';
    rr(-22, -22.5, 30, 2.5, 1); ctx.fill();
  } else if (shape === 'buggy') {
    // antenna with a little ball 🎈
    ctx.strokeStyle = '#0d1220'; ctx.lineWidth = 1.8;
    ctx.beginPath(); ctx.moveTo(-20, -12); ctx.lineTo(-25, -26); ctx.stroke();
    ctx.fillStyle = neon; circle(-25, -27.5, 2.5); ctx.fill();
  } else if (shape !== 'limo') {
    // twin racing spoiler (supercar & muscle)
    ctx.strokeStyle = '#0d1220'; ctx.lineWidth = 3; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-26, -12); ctx.lineTo(-34, -26); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-19, -12); ctx.lineTo(-28, -26); ctx.stroke();
    ctx.fillStyle = car.color2;
    rr(-39, -22, 16, 3, 1.5); ctx.fill();
    ctx.save();
    ctx.translate(-31, -28);
    ctx.rotate(-0.06);
    ctx.fillStyle = car.color;
    rr(-12, -2.2, 25, 4.5, 2); ctx.fill();
    ctx.strokeStyle = tier === 'legend' ? '#ffd700' : 'rgba(0,0,0,0.45)';
    ctx.lineWidth = 1.5;
    rr(-12, -2.2, 25, 4.5, 2); ctx.stroke();
    ctx.fillStyle = car.color2;
    rr(-13.5, -5, 3, 8, 1); ctx.fill();
    ctx.restore();
  }

  // ----- BODY: paint + country livery + shine -----
  ctx.fillStyle = car.color;
  carBodyPath(shape);
  ctx.fill();
  const liveryPl = car.livery && PLAYERS[car.char];
  if (liveryPl && liveryPl.drawFlag) {
    ctx.save();
    carBodyPath(shape);
    ctx.clip();
    liveryPl.drawFlag(-37, -24, 77, 31);
    ctx.restore();
  }
  ctx.save();
  carBodyPath(shape);
  ctx.clip();
  const shine = ctx.createLinearGradient(0, -23, 0, 8);
  shine.addColorStop(0, 'rgba(255,255,255,0.4)');
  shine.addColorStop(0.35, 'rgba(255,255,255,0.08)');
  shine.addColorStop(0.75, 'rgba(0,0,0,0)');
  shine.addColorStop(1, 'rgba(0,0,0,0.3)');
  ctx.fillStyle = shine;
  ctx.fillRect(-38, -25, 80, 35);
  ctx.globalAlpha = 0.22;
  ctx.fillStyle = '#fff';
  ctx.save();
  ctx.rotate(-0.5);
  ctx.fillRect(2, -35, 7, 60);
  ctx.fillRect(14, -35, 3, 60);
  ctx.restore();
  ctx.restore();
  ctx.strokeStyle = 'rgba(0,0,0,0.5)'; ctx.lineWidth = 2;
  carBodyPath(shape);
  ctx.stroke();

  // ----- dark side skirt + neon edge -----
  if (shape !== 'formula') {
    ctx.fillStyle = '#0d1220';
    rr(-35, 2, 73, 8, 3); ctx.fill();
    ctx.save();
    ctx.shadowColor = neon; ctx.shadowBlur = 5;
    ctx.strokeStyle = neon; ctx.lineWidth = 1.6; ctx.globalAlpha = 0.9;
    ctx.beginPath(); ctx.moveTo(-31, 9.2); ctx.lineTo(33, 9.2); ctx.stroke();
    ctx.restore();
  }

  // ----- fenders (follow the wheels — except the open-wheel F1) -----
  if (shape !== 'formula') {
    ctx.strokeStyle = '#0d1220'; ctx.lineWidth = 5;
    for (const [wx, wy, wr] of wheels) {
      ctx.beginPath(); ctx.arc(wx, wy - 2, wr + 2.5, Math.PI * 1.05, Math.PI * 1.95); ctx.stroke();
    }
  }

  // ----- tinted canopy + driver + reflection -----
  ctx.fillStyle = '#0e1626';
  carCanopyPath(shape); ctx.fill();
  const pilot = PLAYERS[car.char];
  if (pilot) {
    const [hx2, hy2, hr] = CAR_HEAD[shape] || CAR_HEAD.speed;
    ctx.save();
    carCanopyPath(shape); ctx.clip();
    ctx.fillStyle = pilot.skin || '#e0ac7e';
    circle(hx2, hy2, hr); ctx.fill();
    ctx.fillStyle = pilot.hair || '#1a1208';
    ctx.beginPath(); ctx.arc(hx2, hy2 - 0.5, hr + 0.3, Math.PI * 0.9, Math.PI * 2.1); ctx.fill();
    ctx.fillStyle = '#111';
    circle(hx2 + 2, hy2, 0.9); ctx.fill();
    ctx.restore();
  }
  ctx.save();
  carCanopyPath(shape); ctx.clip();
  ctx.globalAlpha = 0.3;
  ctx.strokeStyle = '#bfe7ff'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(6, -21); ctx.lineTo(-6, -7); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(1, -21); ctx.lineTo(-11, -7); ctx.stroke();
  ctx.restore();
  ctx.strokeStyle = 'rgba(0,0,0,0.4)'; ctx.lineWidth = 1.2;
  carCanopyPath(shape); ctx.stroke();

  // ----- details: LED headlight + tail light -----
  ctx.save();
  ctx.shadowColor = '#cfffff'; ctx.shadowBlur = 8;
  ctx.fillStyle = '#eaffff';
  const lightY = shape === 'formula' ? -2.5 : (shape === 'suv' ? -6 : (shape === 'buggy' ? -6.5 : -4.5));
  rr(shape === 'buggy' ? 27 : 31, lightY, 7, 3, 1.5); ctx.fill();
  ctx.restore();
  ctx.save();
  ctx.shadowColor = '#ff3040'; ctx.shadowBlur = 6;
  ctx.fillStyle = '#ff3040';
  rr(-36.5, -4, 2.5, 7, 1); ctx.fill();
  ctx.restore();
  // roof air intake (supercar and muscle only)
  if (shape === 'speed' || shape === 'muscle') {
    ctx.fillStyle = '#0d1220';
    rr(-12, shape === 'muscle' ? -21.5 : -23.5, 9, 4, 2); ctx.fill();
  }

  // ----- small country FLAG waving at the REAR 🚩 -----
  if (plc && plc.drawFlag && !plc.id.startsWith('classic')) {
    const fy = REAR_FLAG_Y[shape] !== undefined ? REAR_FLAG_Y[shape] : -29;
    ctx.save();
    ctx.translate(-34, fy);
    ctx.strokeStyle = '#c9c9c9'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, 14); ctx.lineTo(0, -3); ctx.stroke(); // pole
    ctx.rotate(Math.sin(t * 7 + car.x * 0.01) * 0.12);                 // it flutters in the wind
    plc.drawFlag(-17, -3.5, 17, 11.5);
    ctx.restore();
    // the presidential limousine ALSO has a flag at the front 😄
    if (shape === 'limo') {
      ctx.save();
      ctx.translate(30, -14);
      ctx.strokeStyle = '#c9c9c9'; ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.moveTo(0, 8); ctx.lineTo(0, 0); ctx.stroke();
      ctx.rotate(Math.sin(t * 7 + 2) * 0.12);
      plc.drawFlag(-13, -1, 13, 9);
      ctx.restore();
    }
  }

  // ----- prestige decorations -----
  if ((tier === 'pro' || tier === 'legend') && (shape === 'speed' || shape === 'muscle')) {
    ctx.strokeStyle = tier === 'legend' ? '#ffd700' : 'rgba(255,255,255,0.75)';
    ctx.lineWidth = 2.5; ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(34, -4);
    ctx.quadraticCurveTo(14, -9, 2, -19);
    ctx.quadraticCurveTo(-10, -21.5, -20, -15);
    ctx.stroke();
  }
  // WORLD CHAMPION stars ⭐ (Brazil 5, Argentina 3, France 2...)
  if (plc && plc.wc) {
    ctx.fillStyle = '#ffd700';
    const starY = shape === 'formula' ? -7 : (shape === 'limo' ? -18 : -24.5);
    for (let i = 0; i < plc.wc; i++) {
      drawStar((shape === 'formula' ? 14 : -16) + i * 6.5, starY, 2.6);
    }
  }

  ctx.restore();
}
