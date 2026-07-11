'use strict';

/* ============================================================
   MATCH — lifecycle (start, kickoff, goal, end) and the
   per-frame match update.
   ============================================================ */

function startMatch(gameMode) {
  mode = gameMode;
  state = makeMatch(gameMode);
  particles = []; floaters = [];
  paused = false; slowT = 0;
  scene = 'play';
  sfx('click');
  startCrowd();
  startEngines();
  say(gameMode === 'ai' ? 'You against the robot! Let the match begin!' : 'Player 1 versus Player 2!', true);
}

function backToMenu() {
  scene = 'menu';
  stopCrowd(); stopEngines();
  sfx('click');
}

/* kickoff at the center after a goal */
function kickoff() {
  const s = state;
  s.ball = makeBall();
  s.pads = makePads();
  const ai1 = s.cars[1].isAI;
  s.cars[0] = makeCar(0, false, p1Char);
  s.cars[1] = makeCar(1, ai1, p2Char);
  s.cars[0].name = mode === 'ai' ? 'YOU' : 'PLAYER 1';
  s.cars[1].name = mode === 'ai' ? 'AI 🤖' : 'PLAYER 2';
  s.phase = 'count';
  s.phaseT = 3.2;
}

/* a goal was just scored */
function onGoal(scorer) {
  const s = state;
  s.score[scorer]++;
  s.scorer = scorer;
  s.phase = 'goal';
  s.phaseT = 2.4;
  // the ball goes STRAIGHT back to its spot, top center
  s.ball = makeBall();
  shake(0.4, 8);
  slowT = 0.35; // brief cinematic slow-mo right after the goal (more punch)
  sfx('goal');
  crowdCheer();
  confettiBlast(state.ball.x, state.ball.y);
  confettiBlast(W / 2, 100);
  const who = s.cars[scorer].name;
  say('What an incredible goal by ' + (mode === 'ai' && scorer === 1 ? 'the artificial intelligence' : who) + '!', true);
}

/* end of the match */
function endMatch(winner) {
  state.winner = winner;
  scene = 'end';
  stopEngines();
  sfx('whistle');
  crowdCheer();

  // ----- local progression (a reason to replay): simple, 2 records -----
  const goalsThisMatch = Math.max(state.score[0], state.score[1]);
  const hadStreak = stats.bestWinStreak;
  const hadGoals = stats.bestGoalsInMatch;
  if (mode === 'ai') {
    stats.winStreak = winner === 0 ? stats.winStreak + 1 : 0;
    stats.bestWinStreak = Math.max(stats.bestWinStreak, stats.winStreak);
  }
  stats.bestGoalsInMatch = Math.max(stats.bestGoalsInMatch, goalsThisMatch);
  saveStats();
  // (state.newRecord is read in drawEnd(): drawn AFTER the dark overlay
  // of the end screen so it stays clearly visible, unlike regular
  // floaters which get dimmed by that overlay)
  state.newRecord = stats.bestGoalsInMatch > hadGoals || stats.bestWinStreak > hadStreak;
  if (state.newRecord) { sfx('record'); confettiBlast(W / 2, 160); }

  const win = state.cars[winner].name;
  say(mode === 'ai'
    ? (winner === 0 ? 'Victory! You crushed the robot!' : 'Defeat... the robot won, what a shame!')
    : win + ' wins!', true);
}

/* ================= PER-FRAME MATCH UPDATE ================= */
function updateMatch(dt) {
  const s = state;
  // cinematic slow motion after a goal
  const sdt = dt * (slowT > 0 ? 0.45 : 1);

  if (s.phase === 'count') {
    // 3, 2, 1, GO countdown — the cars are frozen
    const before = Math.ceil(s.phaseT);
    s.phaseT -= dt;
    const after = Math.ceil(s.phaseT);
    if (after < before && after > 0) sfx('count');
    if (s.phaseT <= 0) { s.phase = 'live'; sfx('go'); }
    return;
  }

  // inputs for both cars
  const inp1 = readPlayer(0);
  const inp2 = s.cars[1].isAI ? aiInput(s.cars[1], sdt) : readPlayer(1);

  updateCar(s.cars[0], inp1, sdt);
  updateCar(s.cars[1], inp2, sdt);
  collideCars(s.cars[0], s.cars[1]);

  if (s.phase === 'live') {
    // the ball only moves during live play (frozen after a goal)
    updateBall(sdt);
    collideCarsBall(s.cars[0], s.cars[1]); // also handles both cars touching at once
    updatePads(sdt);
  }

  // engine sounds
  setEngine(0, Math.abs(s.cars[0].vx) / CAR_MAX, s.cars[0].throttle);
  setEngine(1, Math.abs(s.cars[1].vx) / CAR_MAX, s.cars[1].throttle);

  if (s.phase === 'live') {
    // timer
    if (settings.timer > 0 && !s.sudden) {
      s.time -= sdt;
      if (s.time <= 0) {
        if (s.score[0] !== s.score[1]) { endMatch(s.score[0] > s.score[1] ? 0 : 1); return; }
        s.sudden = true; // tie → next goal wins!
        floaters.push(mkFloat(W / 2, H / 2, '⚡ SUDDEN DEATH! ⚡', '#ff5252', 40));
        say('It\'s a tie! Sudden death: next goal wins!', true);
      }
    }
    // goal?
    const scorer = checkGoal();
    if (scorer >= 0) onGoal(scorer);
  } else if (s.phase === 'goal') {
    s.phaseT -= dt;
    if (s.phaseT <= 0) {
      // match over?
      if (s.sudden || s.score[s.scorer] >= settings.goals) endMatch(s.scorer);
      else kickoff();
    }
  }
}
