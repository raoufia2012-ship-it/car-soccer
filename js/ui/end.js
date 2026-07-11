'use strict';

/* ============================================================
   END SCREEN — winner, score, local records, replay.
   ============================================================ */

function drawEnd(t) {
  drawArena(t);
  // continuous confetti for the winner
  if (Math.random() < 0.35) {
    particles.push({
      x: rand(0, W), y: -10, vx: rand(-40, 40), vy: rand(60, 160),
      t: 0, dur: 3, r: rand(3, 6),
      color: pick(['#ffd200', '#ff5252', '#4dd0e1', '#aed581', '#ff00be']), grav: 60, conf: true
    });
  }
  drawParticlesAndFloaters();
  ctx.fillStyle = 'rgba(0,0,0,0.55)'; ctx.fillRect(0, 0, W, H);

  const win = state.cars[state.winner];
  const youWon = mode === 'ai' && state.winner === 0;
  bigText(mode === 'ai' ? (youWon ? '🏆 YOU WIN!' : '💀 YOU LOSE...') : '🏆 ' + win.name + ' WINS!',
    W / 2, 130, 70, youWon || mode === '2p' ? '#ffd200' : '#ff5252');
  bigText(state.score[0] + ' - ' + state.score[1], W / 2, 215, 60, '#fff');

  if (state.newRecord) { // drawn after the dark overlay: stays readable
    const pulse = 1 + 0.05 * Math.sin(t * 6);
    ctx.save(); ctx.translate(W / 2, 236); ctx.scale(pulse, pulse);
    bigText('✨ NEW RECORD! ✨', 0, 0, 26, '#ffd200', 3);
    ctx.restore();
  }

  // ----- small local records panel (simple, elegant: "one more game") -----
  ctx.fillStyle = 'rgba(0,0,0,0.4)';
  rr(W / 2 - 175, 258, 350, mode === 'ai' ? 66 : 40, 14); ctx.fill();
  ctx.font = 'bold 16px "Segoe UI"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffd200';
  ctx.fillText('⚽ Most goals in one match: ' + stats.bestGoalsInMatch, W / 2, 280);
  if (mode === 'ai') {
    ctx.fillStyle = '#4dd0e1';
    ctx.fillText('🏆 Best win streak vs AI: ' + stats.bestWinStreak, W / 2, 306);
  }

  // the winning car jumps for joy, its player next to it
  const dcar = makeCar(win.side, false, win.char);
  dcar.x = W / 2; dcar.y = H - 250 - Math.abs(Math.sin(t * 4)) * 45;
  dcar.onGround = false; dcar.dir = 1;
  drawCar(dcar, t);

  drawButton(W / 2 - 250, H - 150, 230, 58, '▶ REPLAY', () => startMatch(mode), true);
  drawButton(W / 2 + 20, H - 150, 230, 58, 'MENU', backToMenu);
}
