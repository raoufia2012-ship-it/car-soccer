'use strict';

/* ============================================================
   CONSTANTS — arena dimensions and physics tuning.
   Changing values here rebalances the whole game.
   ============================================================ */

/* ----- arena dimensions (internal canvas resolution) ----- */
const W = 1200, H = 675;    // BIG stadium, 16:9 = fullscreen with no black bars
const FLOOR = 600;          // y of the ground
const CEIL = 34;            // y of the ceiling
const WALL = 16;            // thickness of the left/right walls
const GOAL_W = 70;          // goal depth
const GOAL_H = 190;         // height of the goal opening
const GOAL_RAISE = 190;     // goals sit HIGH on the wall (Sideswipe style)
const RAMP_W = 95;          // width of the corner curves (narrow, not invasive)
const RAMP_H = GOAL_RAISE;  // BOTTOM curve: from the floor up to the goal's lower lip
// edges of the goal opening (computed once, used everywhere)
const GOAL_BOT = FLOOR - GOAL_RAISE;        // lower lip
const GOAL_TOP = GOAL_BOT - GOAL_H;         // upper lip
const TOPC_H = GOAL_TOP - CEIL;             // TOP curve: from the ceiling down to the goal's upper lip
// → the goal mouth stays completely OPEN between the two curves
const POST_L = WALL + GOAL_W;               // left goal plane
const POST_R = W - WALL - GOAL_W;           // right goal plane

/* ----- physics (tuned for the BIG stadium) ----- */
const GRAV_CAR = 2400;      // car gravity
const GRAV_BALL = 1100;     // ball gravity (floaty = more fun)
const CAR_ACCEL = 1750;     // acceleration
const CAR_MAX = 620;        // max speed
const CAR_JUMP = -950;      // BIG jump: W really sends you flying
const BALL_R = 33;          // ball radius
const BALL_BOUNCE = 0.86;   // the ball bounces HIGH, never glued to the floor
const BALL_MAX = 1250;      // ball max speed
