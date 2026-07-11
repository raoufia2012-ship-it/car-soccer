'use strict';

/* ============================================================
   PLAYER FIGURE — small cartoon character in his country's kit.
   x, y = feet position; s = scale; he waves hello!
   ============================================================ */

function drawPlayerFigure(pl, x, y, s, t) {
  const skin = pl.skin || '#e0ac7e';
  const hair = pl.hair || '#1a1208';
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  // shadow
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.beginPath(); ctx.ellipse(0, 2, 16, 5, 0, 0, Math.PI * 2); ctx.fill();
  // legs
  ctx.strokeStyle = skin; ctx.lineWidth = 7; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-5, -28); ctx.lineTo(-6, -4); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(5, -28); ctx.lineTo(6, -4); ctx.stroke();
  // boots
  ctx.fillStyle = '#222';
  ctx.beginPath(); ctx.ellipse(-6, -1, 7, 4, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(7, -1, 7, 4, 0, 0, Math.PI * 2); ctx.fill();
  // shorts (country's secondary color)
  ctx.fillStyle = pl.accent;
  rr(-10, -38, 20, 12, 4); ctx.fill();
  // jersey (country's color) + number
  ctx.fillStyle = pl.body;
  rr(-11, -62, 22, 27, 6); ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.3)'; ctx.lineWidth = 1.5;
  rr(-11, -62, 22, 27, 6); ctx.stroke();
  if (pl.number) {
    ctx.font = '900 12px "Segoe UI"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.lineWidth = 2.5; ctx.strokeStyle = 'rgba(0,0,0,0.45)';
    ctx.strokeText(pl.number, 0, -48);
    ctx.fillStyle = '#fff';
    ctx.fillText(pl.number, 0, -48);
  }
  // left arm hanging along the body
  ctx.strokeStyle = pl.body; ctx.lineWidth = 6;
  ctx.beginPath(); ctx.moveTo(-10, -58); ctx.lineTo(-15, -40); ctx.stroke();
  ctx.fillStyle = skin; circle(-15, -38, 3.5); ctx.fill();
  // right arm raised: he WAVES 👋
  const wave = Math.sin(t * 5) * 4;
  ctx.strokeStyle = pl.body; ctx.lineWidth = 6;
  ctx.beginPath(); ctx.moveTo(10, -58); ctx.lineTo(17, -72); ctx.stroke();
  ctx.fillStyle = skin; circle(18 + wave * 0.3, -76, 4); ctx.fill();
  // head
  ctx.fillStyle = skin; circle(0, -71, 9.5); ctx.fill();

  // ----- each star's SIGNATURE haircut -----
  ctx.fillStyle = hair;
  const style = pl.hairStyle || 'short';
  if (style === 'buzz') {
    // very short buzz cut (Mbappé, Mané...)
    ctx.strokeStyle = hair; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(0, -72, 8.8, Math.PI * 1.02, Math.PI * 1.98); ctx.stroke();
  } else if (style === 'quiff') {
    // strict cut with a front quiff (Ronaldo, Lewandowski)
    ctx.beginPath(); ctx.arc(0, -72, 10, Math.PI * 0.98, Math.PI * 2.02); ctx.fill();
    rr(0, -84.5, 8.5, 5, 2.5); ctx.fill();
  } else if (style === 'messy') {
    // messy hair (Neymar)
    ctx.beginPath(); ctx.arc(0, -72, 10, Math.PI * 0.92, Math.PI * 2.08); ctx.fill();
    for (let i = 0; i < 4; i++) {
      const sx2 = -7 + i * 4.6;
      ctx.beginPath();
      ctx.moveTo(sx2, -79);
      ctx.lineTo(sx2 + 2, -87 - (i % 2) * 2);
      ctx.lineTo(sx2 + 4.5, -79);
      ctx.closePath(); ctx.fill();
    }
  } else if (style === 'bun') {
    // top bun (Van Dijk)
    ctx.beginPath(); ctx.arc(0, -72, 10, Math.PI * 0.95, Math.PI * 2.05); ctx.fill();
    circle(0, -84, 4); ctx.fill();
  } else if (style === 'long') {
    // shoulder-length hair (Modrić)
    ctx.beginPath(); ctx.arc(0, -72, 10.5, Math.PI * 0.85, Math.PI * 2.15); ctx.fill();
    rr(-12, -75, 4.5, 18, 2); ctx.fill();
    rr(7.5, -75, 4.5, 18, 2); ctx.fill();
  } else if (style === 'fringe') {
    // straight fringe on the forehead (Son, Mitoma)
    ctx.beginPath(); ctx.arc(0, -72, 10, Math.PI * 0.92, Math.PI * 2.08); ctx.fill();
    rr(-8.5, -80, 17, 5.5, 2); ctx.fill();
  } else if (style === 'curly') {
    // curls (Pedri)
    ctx.beginPath(); ctx.arc(0, -72, 9.8, Math.PI * 0.95, Math.PI * 2.05); ctx.fill();
    for (const [bx, by] of [[-7, -78], [-3, -82], [2, -83], [7, -79]]) {
      circle(bx, by, 3.2); ctx.fill();
    }
  } else if (style === 'mohawk') {
    // center crest, shaved sides (Shaqiri)
    ctx.strokeStyle = hair; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.arc(0, -72, 8.8, Math.PI * 1.05, Math.PI * 1.95); ctx.stroke();
    rr(-2.5, -85, 5, 9, 2.5); ctx.fill();
  } else if (style === 'toque') {
    // Mobutu's LEOPARD hat 🐆
    ctx.fillStyle = '#d8a94e';
    rr(-10, -89, 20, 13, 4); ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.3)'; ctx.lineWidth = 1;
    rr(-10, -89, 20, 13, 4); ctx.stroke();
    ctx.fillStyle = '#4a2f10'; // leopard spots
    circle(-5, -84, 1.6); ctx.fill();
    circle(1, -86, 1.6); ctx.fill();
    circle(6, -83, 1.6); ctx.fill();
    circle(-1, -81, 1.3); ctx.fill();
  } else {
    // classic short cut
    ctx.beginPath(); ctx.arc(0, -72, 10, Math.PI * 0.95, Math.PI * 2.05); ctx.fill();
  }

  // beard (Messi, Van Dijk, Hakimi...)
  if (pl.beard) {
    ctx.strokeStyle = hair; ctx.lineWidth = 3.5;
    ctx.beginPath(); ctx.arc(0, -70, 8, Math.PI * 0.15, Math.PI * 0.85); ctx.stroke();
  }
  // eyebrows + eyes + smile
  ctx.strokeStyle = hair; ctx.lineWidth = 1.4;
  ctx.beginPath(); ctx.moveTo(-4.5, -75.5); ctx.lineTo(-1.5, -76); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(1.5, -76); ctx.lineTo(4.5, -75.5); ctx.stroke();
  ctx.fillStyle = '#111';
  circle(-3, -72, 1.3); ctx.fill();
  circle(3, -72, 1.3); ctx.fill();
  // glasses (Mobutu)
  if (pl.glasses) {
    ctx.strokeStyle = '#111'; ctx.lineWidth = 1.4;
    circle(-3, -72, 3.2); ctx.stroke();
    circle(3, -72, 3.2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-0.2, -72); ctx.lineTo(0.2, -72); ctx.stroke();
  }
  ctx.strokeStyle = '#5c2a1a'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(0, -68, 4, 0.2 * Math.PI, 0.8 * Math.PI); ctx.stroke();
  ctx.restore();
}
