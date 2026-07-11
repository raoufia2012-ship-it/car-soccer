'use strict';

/* ============================================================
   THE 16 WORLD CUP ROUND-OF-16 NATIONS 🏆
   Each nation: its star player, its car colors, its flag drawn
   in code, and the neon color of its goal.
   (Portugal/Ronaldo has his own file, ronaldo.js.)
   ============================================================ */

/* ---------- 🇫🇷 FRANCE — MBAPPÉ ---------- */
WC('mbappe', 'MBAPPÉ', '10', 'FRANCE', '#1c3fbf', '#d32f2f', '#4d79ff',
  (x, y, w, h) => vBands(x, y, w, h, ['#0055a4', '#ffffff', '#ef4135']));

/* ---------- 🇦🇷 ARGENTINA — MESSI ---------- */
WC('messi', 'MESSI', '10', 'ARGENTINA', '#7cc4e8', '#1c3f94', '#7cc4e8',
  (x, y, w, h) => {
    hBands(x, y, w, h, ['#74acdf', '#ffffff', '#74acdf']);
    // the real SUN OF MAY ☀️: golden disc + 12 rays around it
    const cx2 = x + w / 2, cy2 = y + h / 2, sr = h * 0.1;
    ctx.strokeStyle = '#f6b40e'; ctx.lineWidth = 1.6;
    for (let i = 0; i < 12; i++) {
      const a = i * Math.PI / 6;
      ctx.beginPath();
      ctx.moveTo(cx2 + Math.cos(a) * sr * 1.2, cy2 + Math.sin(a) * sr * 1.2);
      ctx.lineTo(cx2 + Math.cos(a) * sr * 2.1, cy2 + Math.sin(a) * sr * 2.1);
      ctx.stroke();
    }
    ctx.fillStyle = '#f6b40e';
    circle(cx2, cy2, sr); ctx.fill();
    ctx.strokeStyle = '#c8871a'; ctx.lineWidth = 1;
    circle(cx2, cy2, sr); ctx.stroke();
  });

/* ---------- 🇧🇷 BRAZIL — NEYMAR ---------- */
WC('neymar', 'NEYMAR', '10', 'BRAZIL', '#ffd23a', '#009c3b', '#ffe14d',
  (x, y, w, h) => {
    ctx.fillStyle = '#009c3b'; ctx.fillRect(x, y, w, h);   // green background
    ctx.fillStyle = '#ffdf00';                             // yellow diamond
    ctx.beginPath();
    ctx.moveTo(x + w / 2, y + h * 0.12);
    ctx.lineTo(x + w * 0.88, y + h / 2);
    ctx.lineTo(x + w / 2, y + h * 0.88);
    ctx.lineTo(x + w * 0.12, y + h / 2);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#002776';                             // blue globe
    circle(x + w / 2, y + h / 2, h * 0.18); ctx.fill();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5;         // white banner
    ctx.beginPath(); ctx.arc(x + w / 2, y + h * 0.62, h * 0.22, -0.8, -2.4, true); ctx.stroke();
    flagBorder(x, y, w, h);
  });

/* ---------- 🇳🇱 NETHERLANDS — VAN DIJK ---------- */
WC('vandijk', 'VAN DIJK', '4', 'NETHERLANDS', '#ff6a00', '#1c2a5e', '#ff7b1c',
  (x, y, w, h) => hBands(x, y, w, h, ['#ae1c28', '#ffffff', '#21468b']));

/* ---------- 🇺🇸 USA — PULISIC ---------- */
WC('pulisic', 'PULISIC', '10', 'USA', '#f5f5f5', '#1b2f8f', '#e63946',
  (x, y, w, h) => {
    for (let i = 0; i < 7; i++) {                          // stripes
      ctx.fillStyle = i % 2 ? '#ffffff' : '#b22234';
      ctx.fillRect(x, y + h * i / 7, w, h / 7 + 0.5);
    }
    ctx.fillStyle = '#3c3b6e';                             // blue canton
    ctx.fillRect(x, y, w * 0.42, h * 0.5);
    ctx.fillStyle = '#fff';                                // stars (dots)
    for (let r = 0; r < 3; r++) for (let c2 = 0; c2 < 4; c2++) {
      circle(x + 6 + c2 * (w * 0.42 - 10) / 3, y + 5 + r * (h * 0.5 - 9) / 2, 1.6); ctx.fill();
    }
    flagBorder(x, y, w, h);
  });

/* ---------- 🇦🇺 AUSTRALIA — RYAN ---------- */
WC('ryan', 'RYAN', '1', 'AUSTRALIA', '#ffd200', '#0a6b3d', '#ffe14d',
  (x, y, w, h) => {
    ctx.fillStyle = '#00247d'; ctx.fillRect(x, y, w, h);   // blue background
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 2;           // mini Union Jack
    ctx.beginPath();
    ctx.moveTo(x, y); ctx.lineTo(x + w * 0.4, y + h * 0.5);
    ctx.moveTo(x + w * 0.4, y); ctx.lineTo(x, y + h * 0.5);
    ctx.moveTo(x + w * 0.2, y); ctx.lineTo(x + w * 0.2, y + h * 0.5);
    ctx.moveTo(x, y + h * 0.25); ctx.lineTo(x + w * 0.4, y + h * 0.25);
    ctx.stroke();
    ctx.fillStyle = '#fff';                                // stars
    for (const [sx, sy] of [[0.7, 0.2], [0.85, 0.45], [0.7, 0.75], [0.55, 0.5], [0.25, 0.75]]) {
      circle(x + w * sx, y + h * sy, 2); ctx.fill();
    }
    flagBorder(x, y, w, h);
  });

/* ---------- 🇵🇱 POLAND — LEWANDOWSKI ---------- */
WC('lewandowski', 'LEWANDOWSKI', '9', 'POLAND', '#f5f5f5', '#d32f2f', '#ff5252',
  (x, y, w, h) => hBands(x, y, w, h, ['#ffffff', '#dc143c']));

/* ---------- 🏴 ENGLAND — KANE ---------- */
WC('kane', 'KANE', '9', 'ENGLAND', '#f5f5f5', '#1b2f8f', '#ff4545',
  (x, y, w, h) => {
    ctx.fillStyle = '#ffffff'; ctx.fillRect(x, y, w, h);
    ctx.fillStyle = '#ce1124';                             // St George's cross
    ctx.fillRect(x, y + h / 2 - h * 0.1, w, h * 0.2);
    ctx.fillRect(x + w / 2 - w * 0.08, y, w * 0.16, h);
    flagBorder(x, y, w, h);
  });

/* ---------- 🇸🇳 SENEGAL — MANÉ ---------- */
WC('mane', 'MANÉ', '10', 'SENEGAL', '#12a15a', '#ffd200', '#2eea7f',
  (x, y, w, h) => {
    vBands(x, y, w, h, ['#00853f', '#fdef42', '#e31b23']);
    ctx.fillStyle = '#00853f';                             // green star
    drawStar(x + w / 2, y + h / 2, h * 0.18);
  });

/* ---------- 🇯🇵 JAPAN — MITOMA ---------- */
WC('mitoma', 'MITOMA', '9', 'JAPAN', '#1c3fbf', '#0d1f6b', '#ff5252',
  (x, y, w, h) => {
    ctx.fillStyle = '#ffffff'; ctx.fillRect(x, y, w, h);
    ctx.fillStyle = '#bc002d';                             // red sun
    circle(x + w / 2, y + h / 2, h * 0.3); ctx.fill();
    flagBorder(x, y, w, h);
  });

/* ---------- 🇭🇷 CROATIA — MODRIĆ ---------- */
WC('modric', 'MODRIĆ', '10', 'CROATIA', '#f5f5f5', '#d32f2f', '#ff6b6b',
  (x, y, w, h) => {
    hBands(x, y, w, h, ['#ff0000', '#ffffff', '#171796']);
    // the checkerboard shield, TOP CENTER like on the real flag
    // (it starts on the red stripe and runs down onto the white one)
    const s = h * 0.11;
    const bx = x + w / 2 - 2.5 * s, by = y + h * 0.22;
    for (let r = 0; r < 4; r++) for (let c2 = 0; c2 < 5; c2++) {
      ctx.fillStyle = (r + c2) % 2 ? '#fff' : '#ff0000'; // checkerboard STARTS with red
      ctx.fillRect(bx + c2 * s, by + r * s, s, s);
    }
    ctx.strokeStyle = 'rgba(0,0,0,0.35)'; ctx.lineWidth = 1;
    ctx.strokeRect(bx, by, 5 * s, 4 * s);
  });

/* ---------- 🇰🇷 SOUTH KOREA — SON ---------- */
WC('son', 'SON', '7', 'SOUTH KOREA', '#d32f2f', '#1c2a5e', '#ff4d6d',
  (x, y, w, h) => {
    ctx.fillStyle = '#ffffff'; ctx.fillRect(x, y, w, h);
    // red/blue taegeuk
    ctx.fillStyle = '#cd2e3a';
    ctx.beginPath(); ctx.arc(x + w / 2, y + h / 2, h * 0.24, Math.PI, 0); ctx.fill();
    ctx.fillStyle = '#0047a0';
    ctx.beginPath(); ctx.arc(x + w / 2, y + h / 2, h * 0.24, 0, Math.PI); ctx.fill();
    ctx.fillStyle = '#cd2e3a';
    circle(x + w / 2 - h * 0.12, y + h / 2, h * 0.12); ctx.fill();
    ctx.fillStyle = '#0047a0';
    circle(x + w / 2 + h * 0.12, y + h / 2, h * 0.12); ctx.fill();
    // the 4 TRIGRAMS in the 4 corners (like the real flag)
    ctx.fillStyle = '#000';
    const bar = (bx2, by2, split) => { // one bar (whole, or split in two)
      if (split) {
        ctx.fillRect(bx2, by2, w * 0.055, 2.2);
        ctx.fillRect(bx2 + w * 0.075, by2, w * 0.055, 2.2);
      } else {
        ctx.fillRect(bx2, by2, w * 0.13, 2.2);
      }
    };
    // ☰ top-left: 3 solid bars
    bar(x + w * 0.08, y + h * 0.14); bar(x + w * 0.08, y + h * 0.22); bar(x + w * 0.08, y + h * 0.3);
    // ☵ top-right: split / solid / split
    bar(x + w * 0.79, y + h * 0.14, true); bar(x + w * 0.79, y + h * 0.22); bar(x + w * 0.79, y + h * 0.3, true);
    // ☲ bottom-left: solid / split / solid
    bar(x + w * 0.08, y + h * 0.66); bar(x + w * 0.08, y + h * 0.74, true); bar(x + w * 0.08, y + h * 0.82);
    // ☷ bottom-right: 3 split bars
    bar(x + w * 0.79, y + h * 0.66, true); bar(x + w * 0.79, y + h * 0.74, true); bar(x + w * 0.79, y + h * 0.82, true);
    flagBorder(x, y, w, h);
  });

/* ---------- 🇲🇦 MOROCCO — HAKIMI ---------- */
WC('hakimi', 'HAKIMI', '2', 'MOROCCO', '#c62828', '#0a6b3d', '#2eea7f',
  (x, y, w, h) => {
    ctx.fillStyle = '#c1272d'; ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = '#006233'; ctx.lineWidth = 2.5;      // green star (outline)
    strokeStar(x + w / 2, y + h / 2, h * 0.24);
    flagBorder(x, y, w, h);
  });

/* ---------- 🇪🇸 SPAIN — PEDRI ---------- */
WC('pedri', 'PEDRI', '26', 'SPAIN', '#c62828', '#ffd200', '#ffb400',
  (x, y, w, h) => {
    ctx.fillStyle = '#aa151b'; ctx.fillRect(x, y, w, h * 0.25);
    ctx.fillStyle = '#f1bf00'; ctx.fillRect(x, y + h * 0.25, w, h * 0.5);
    ctx.fillStyle = '#aa151b'; ctx.fillRect(x, y + h * 0.75, w, h * 0.25);
    ctx.fillStyle = '#aa151b';                             // small coat of arms
    ctx.fillRect(x + w * 0.28, y + h * 0.38, w * 0.1, h * 0.24);
    flagBorder(x, y, w, h);
  });

/* ---------- 🇨🇭 SWITZERLAND — SHAQIRI ---------- */
WC('shaqiri', 'SHAQIRI', '23', 'SWITZERLAND', '#d32f2f', '#8a1f1f', '#ff5252',
  (x, y, w, h) => {
    ctx.fillStyle = '#da291c'; ctx.fillRect(x, y, w, h);
    ctx.fillStyle = '#fff';                                // white cross
    ctx.fillRect(x + w / 2 - w * 0.07, y + h * 0.2, w * 0.14, h * 0.6);
    ctx.fillRect(x + w / 2 - w * 0.21, y + h / 2 - h * 0.11, w * 0.42, h * 0.22);
    flagBorder(x, y, w, h);
  });

/* ---------- 🇳🇴 NORWAY — HAALAND ---------- */
WC('haaland', 'HAALAND', '9', 'NORWAY', '#d32f2f', '#1c2a5e', '#ff3b3b',
  (x, y, w, h) => {
    ctx.fillStyle = '#ba0c2f'; ctx.fillRect(x, y, w, h);   // red background
    // Nordic cross, white then blue
    ctx.fillStyle = '#fff';
    ctx.fillRect(x + w * 0.26, y, w * 0.18, h);
    ctx.fillRect(x, y + h / 2 - h * 0.11, w, h * 0.22);
    ctx.fillStyle = '#00205b';
    ctx.fillRect(x + w * 0.3, y, w * 0.1, h);
    ctx.fillRect(x, y + h / 2 - h * 0.06, w, h * 0.12);
    flagBorder(x, y, w, h);
  });

/* ---------- 🇨🇩 ZAIRE — MOBUTU (the boss!) ---------- */
WC('mobutu', 'MOBUTU', '1', 'ZAIRE', '#2e2a26', '#d4af37', '#ffd200',
  (x, y, w, h) => {
    ctx.fillStyle = '#007749'; ctx.fillRect(x, y, w, h);   // green background
    ctx.fillStyle = '#f7d618';                             // yellow disc
    circle(x + w / 2, y + h / 2, h * 0.32); ctx.fill();
    // arm holding the torch
    ctx.strokeStyle = '#6b4226'; ctx.lineWidth = 3; ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x + w / 2 - h * 0.18, y + h / 2 + h * 0.18);
    ctx.lineTo(x + w / 2 + h * 0.08, y + h / 2 - h * 0.05);
    ctx.stroke();
    // red flame
    ctx.fillStyle = '#ce1021';
    ctx.beginPath();
    ctx.moveTo(x + w / 2 + h * 0.04, y + h / 2 - h * 0.06);
    ctx.lineTo(x + w / 2 + h * 0.14, y + h / 2 - h * 0.28);
    ctx.lineTo(x + w / 2 + h * 0.2, y + h / 2 - h * 0.08);
    ctx.closePath(); ctx.fill();
    flagBorder(x, y, w, h);
  });

/* ----- each star's look: skin, hair, beard, SIGNATURE haircut ----- */
Object.assign(PLAYERS.mbappe, { skin: '#8d5524', hair: '#17110c', hairStyle: 'buzz' });        // buzz cut
Object.assign(PLAYERS.messi, { skin: '#e0ac7e', hair: '#4a2f16', beard: true, hairStyle: 'short' }); // full beard
Object.assign(PLAYERS.neymar, { skin: '#c68f5e', hair: '#1a1208', hairStyle: 'messy' });       // messy hair
Object.assign(PLAYERS.vandijk, { skin: '#6b4226', hair: '#1a1208', beard: true, hairStyle: 'bun' }); // MAN BUN
Object.assign(PLAYERS.pulisic, { skin: '#e8b98a', hair: '#5a3a1a', hairStyle: 'short' });
Object.assign(PLAYERS.ryan, { skin: '#e8b98a', hair: '#3a2a12', hairStyle: 'buzz' });
Object.assign(PLAYERS.lewandowski, { skin: '#e8b98a', hair: '#8a5a2b', hairStyle: 'quiff' });  // slicked-back quiff
Object.assign(PLAYERS.kane, { skin: '#e8b98a', hair: '#6b4a2a', hairStyle: 'short' });
Object.assign(PLAYERS.mane, { skin: '#5c3317', hair: '#111111', hairStyle: 'buzz' });
Object.assign(PLAYERS.mitoma, { skin: '#f2cba0', hair: '#111111', hairStyle: 'fringe' });      // straight fringe
Object.assign(PLAYERS.modric, { skin: '#e8b98a', hair: '#b98a4a', hairStyle: 'long' });        // LONG hair
Object.assign(PLAYERS.son, { skin: '#f2cba0', hair: '#111111', hairStyle: 'fringe' });         // straight fringe
Object.assign(PLAYERS.hakimi, { skin: '#c68f5e', hair: '#111111', beard: true, hairStyle: 'short' });
Object.assign(PLAYERS.pedri, { skin: '#d9a066', hair: '#1a1208', hairStyle: 'curly' });        // curls
Object.assign(PLAYERS.shaqiri, { skin: '#e8b98a', hair: '#222222', beard: true, hairStyle: 'mohawk' }); // mohawk
Object.assign(PLAYERS.haaland, { skin: '#f2cba0', hair: '#e8c766', hairStyle: 'bun' });        // BLOND viking bun
Object.assign(PLAYERS.mobutu, { skin: '#7a4a21', hair: '#111111', hairStyle: 'toque', glasses: true }); // leopard hat + glasses

/* ----- PRESTIGE: the big football nations get fancier cars -----
   'legend' = underglow neon + gold rims + gold trim
   'pro'    = white racing stripe
   (none)   = regular car, like Mobutu 😄
   wc = number of world-champion stars on the roof ⭐ */
Object.assign(PLAYERS.mbappe, { tier: 'legend', wc: 2 });       // 🇫🇷 2 stars
Object.assign(PLAYERS.messi, { tier: 'legend', wc: 3 });        // 🇦🇷 3 stars
Object.assign(PLAYERS.neymar, { tier: 'legend', wc: 5 });       // 🇧🇷 5 stars!
Object.assign(PLAYERS.kane, { tier: 'pro', wc: 1 });            // 🏴 1966
Object.assign(PLAYERS.pedri, { tier: 'pro', wc: 1 });           // 🇪🇸 2010
Object.assign(PLAYERS.modric, { tier: 'pro' });
Object.assign(PLAYERS.vandijk, { tier: 'pro' });
Object.assign(PLAYERS.haaland, { tier: 'pro' });
Object.assign(PLAYERS.son, { tier: 'pro' });
Object.assign(PLAYERS.lewandowski, { tier: 'pro' });
Object.assign(PLAYERS.hakimi, { tier: 'pro' });                 // 2022 semi-finalist!
// pulisic, ryan, mane, mitoma, shaqiri, mobutu: regular cars

/* ----- fun fact shown on the character select screen ----- */
Object.assign(PLAYERS.mbappe, { fact: 'Blazing pace — outruns defenders and physics alike.' });
Object.assign(PLAYERS.messi, { fact: 'Low center of gravity, impossible to tackle.' });
Object.assign(PLAYERS.neymar, { fact: 'Can make a football disappear... and reappear in the net.' });
Object.assign(PLAYERS.vandijk, { fact: 'A defensive wall that also drives a muscle car.' });
Object.assign(PLAYERS.pulisic, { fact: 'Captain America, on and off the pitch.' });
Object.assign(PLAYERS.ryan, { fact: 'Guards the net like it\'s the Great Barrier Reef.' });
Object.assign(PLAYERS.lewandowski, { fact: 'Once scored 5 goals in 9 minutes. Not a typo.' });
Object.assign(PLAYERS.kane, { fact: 'Captain material — always finds the net.' });
Object.assign(PLAYERS.mane, { fact: 'Went from academy reject to Champions League winner.' });
Object.assign(PLAYERS.mitoma, { fact: 'Dribbles like the ball is glued to his boots.' });
Object.assign(PLAYERS.modric, { fact: 'Ballon d\'Or winner, still the smallest one on the pitch.' });
Object.assign(PLAYERS.son, { fact: 'Left foot, right foot — doesn\'t matter, it\'s going in.' });
Object.assign(PLAYERS.hakimi, { fact: 'Fastest full-back this side of the Sahara.' });
Object.assign(PLAYERS.pedri, { fact: 'Barely old enough to drive, already a Ballon d\'Or nominee.' });
Object.assign(PLAYERS.shaqiri, { fact: 'Small guy, absolute cannon of a shot.' });
Object.assign(PLAYERS.haaland, { fact: 'Built like a tank, scores like a machine.' });
Object.assign(PLAYERS.mobutu, { fact: 'Rules the pitch from the back seat of a limousine. 👑' });

/* ----- each team's car SHAPE 🏎️ -----
   speed = supercar · muscle = muscle car · formula = F1
   buggy = compact fun car · suv = 4x4 · limo = limousine */
PLAYERS.mbappe.carShape = 'speed';        // speed demon supercar
PLAYERS.son.carShape = 'speed';
PLAYERS.kane.carShape = 'speed';
PLAYERS.haaland.carShape = 'muscle';      // viking muscle car
PLAYERS.vandijk.carShape = 'muscle';
PLAYERS.lewandowski.carShape = 'muscle';
PLAYERS.messi.carShape = 'formula';       // the GOAT's Formula 1
PLAYERS.modric.carShape = 'formula';
PLAYERS.pedri.carShape = 'formula';
PLAYERS.neymar.carShape = 'buggy';        // the juggler's fun buggy
PLAYERS.shaqiri.carShape = 'buggy';
PLAYERS.pulisic.carShape = 'buggy';
PLAYERS.mitoma.carShape = 'buggy';
PLAYERS.ryan.carShape = 'suv';            // outback 4x4
PLAYERS.mane.carShape = 'suv';
PLAYERS.hakimi.carShape = 'suv';
PLAYERS.mobutu.carShape = 'limo';         // PRESIDENTIAL LIMOUSINE
