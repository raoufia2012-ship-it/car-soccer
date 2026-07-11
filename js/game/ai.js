'use strict';

/* ============================================================
   AI — drives the opponent car (Rocket League style).
   Idea: get behind the ball to push it toward the opponent's
   goal, fall back to defend, use TURBO to charge and even fly
   toward high balls.
   ============================================================ */

let aiState = { t: 0, plan: { left: false, right: false, jump: false, boost: false } };

function aiInput(car, dt) {
  const b = state.ball;
  const opp = state.cars[0];
  aiState.t -= dt;

  // the AI "thinks" ~8 times per second (more human, less perfect)
  if (aiState.t <= 0) {
    aiState.t = 0.12 + Math.random() * 0.08;
    const plan = { left: false, right: false, jump: false, boost: false };

    // simple ball position prediction
    const predX = b.x + b.vx * 0.25;
    const myGoalX = W - WALL - GOAL_W / 2;  // the AI defends the right goal
    const dangerSide = b.x > W * 0.55;      // ball in its half
    const dxBall = Math.abs(b.x - car.x);   // (computed early: used for defense and turbo below)

    // target position: behind the ball, to hit it toward the left
    let targetX = predX + 55;

    // if the ball is racing toward its goal and the AI is out of position →
    // fall back! Also if the ball lingers right next to its own goal (even
    // slowly): a "smart" AI must clear that dangerous situation instead of
    // keeping its normal ball-chasing position.
    const nearOwnGoal = b.x > POST_R - 130 && b.y > GOAL_TOP - 40 && b.y < GOAL_BOT + 40;
    let panic = false;
    if ((dangerSide && b.vx > 150 && car.x < b.x) || (nearOwnGoal && car.x < b.x)) {
      targetX = nearOwnGoal ? Math.max(myGoalX - 90, b.x - 60) : myGoalX - 90;
      panic = true;
    }

    const diff = targetX - car.x;
    if (Math.abs(diff) > 14) {
      if (diff > 0) plan.right = true; else plan.left = true;
    }

    // TURBO on the ground: far from the target, or defensive emergency
    const facingTarget = Math.sign(diff) === car.dir;
    if (car.onGround && facingTarget && car.boost > 15 &&
        (Math.abs(diff) > 220 || (panic && Math.abs(diff) > 80))) {
      plan.boost = true;
    }

    // ----- smart boost refills: far from the action and not in danger,
    // the AI goes for the nearest pad instead of standing around
    // (keeps it from looking "out of ideas" when the ball is far away) -----
    if (!panic && car.boost < 25 && dxBall > 220) {
      let nearestPad = null, bestD = Infinity;
      for (const p of state.pads) {
        if (!p.active) continue;
        const d = Math.abs(p.x - car.x);
        if (d < bestD) { bestD = d; nearestPad = p; }
      }
      if (nearestPad) {
        const padDiff = nearestPad.x - car.x;
        plan.right = padDiff > 14; plan.left = padDiff < -14;
        if (car.onGround && Math.sign(padDiff) === car.dir && Math.abs(padDiff) > 220 && car.boost > 15) plan.boost = true;
      }
    }

    // jump on balls at a good height
    if (dxBall < 95 && b.y < FLOOR - 90 && b.y > CEIL + 60 && Math.random() < 0.6) {
      plan.jump = true;
    }
    // dodge/double jump for very high balls
    if (!car.onGround && car.jumps < 2 && dxBall < 75 && b.y < car.y - 50 && Math.random() < 0.5) {
      plan.jump = true;
    }
    // small glide: airborne under the ball → burst of turbo toward it
    if (!car.onGround && car.boost > 25 && dxBall < 120 && b.y < car.y - 20) {
      plan.boost = true;
      // aims at the ball: pulling back lifts the nose
      if (car.rot > -0.7) { // wants to raise the nose
        if (car.dir === 1) plan.left = true; else plan.right = true;
        plan.jump = false;
      }
    }
    // FLIGHT ▬▬▬▬: hold jump to climb toward a high ball
    plan.fly = dxBall < 150 && b.y < car.y - 40 && car.fly > 15;
    // a little pressure on the opponent from time to time
    if (Math.abs(opp.x - car.x) < 90 && Math.random() < 0.05) {
      plan.right = opp.x > car.x; plan.left = !plan.right;
    }

    aiState.plan = plan;
  }

  // the jump must be a single-frame pulse (flight, however, is held)
  const out = { ...aiState.plan };
  out.holdJump = !!aiState.plan.fly;
  aiState.plan.jump = false;
  return out;
}
