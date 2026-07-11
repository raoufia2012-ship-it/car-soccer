'use strict';

/* ============================================================
   STATE — global game state, settings and local progression.
   Settings and stats persist in localStorage.
   ============================================================ */

/* ----- settings (editable in the Settings menu) ----- */
let settings = { goals: 5, timer: 60, sound: true }; // each match lasts 1 minute by default
function loadSettings() {
  try {
    const s = JSON.parse(localStorage.getItem('carball-settings'));
    if (s) settings = Object.assign(settings, s);
  } catch (e) {}
  settings.sound = true;                     // sound is ALWAYS on at startup
  if (!settings.timer) settings.timer = 60;  // there is always a timer → always a winner
}
function saveSettings() {
  try { localStorage.setItem('carball-settings', JSON.stringify(settings)); } catch (e) {}
}
loadSettings();

/* ----- local progression (a reason to replay) -----
   Saved under a key SEPARATE from 'carball-settings' so existing
   settings are never touched. Deliberately minimal (3 numbers): a
   small target to beat without turning the game into a stats menu. */
let stats = { bestWinStreak: 0, winStreak: 0, bestGoalsInMatch: 0 };
function loadStats() {
  try {
    const s = JSON.parse(localStorage.getItem('carball-stats'));
    if (s) stats = Object.assign(stats, s);
  } catch (e) {}
}
function saveStats() {
  try { localStorage.setItem('carball-stats', JSON.stringify(stats)); } catch (e) {}
}
loadStats();

/* ----- global state ----- */
let scene = 'menu';         // menu | settings | choose | vs | play | end
let mode = 'ai';            // 'ai' (vs the AI) | '2p' (2 players) — a 'tournament' mode could slot in here
let state = null;           // current match state (created by makeMatch)
let paused = false;
let muted = !settings.sound;

/* global visual effects */
let shakeT = 0, shakeDur = 0.3, shakeMag = 0; // camera shake
let slowT = 0;                                 // slow motion (goal)
let hitStopT = 0;                              // short freeze-frame (hard impacts)
let particles = [], floaters = [];

/* interface */
let clickRegions = [];
let mouse = { x: -1, y: -1 };
let isCoarse = matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;

/* small UI animations (driven from main.js → loop()) */
let sceneT = 0;                              // time since the last scene change (fade-in)
let pauseT = 0;                              // time since the pause panel opened (fade-in)
let btnPressT = 0, btnPressX = -1, btnPressY = -1; // button squish on click
let choosePickT = [0, 0];                    // time since P1/P2 last changed character — animates the car sliding in
let vsPending = null;                        // game mode waiting on the "VS" preparation screen
let prepLaunchT = -1;                        // -1 = normal prep screen; ≥0 = launch animation running (cars leaving for the pitch)
