'use strict';

/* ============================================================
   AUDIO — everything is generated in code (no sound files):
   bounces, impacts, crowd, goal fanfare.
   ============================================================ */

let AC = null;
let crowdSrc = null, crowdGain = null;
let engines = [null, null]; // one engine oscillator per car

function ensureAC() {
  if (!AC) { try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} }
  if (AC && AC.state === 'suspended') AC.resume();
}

/* small parameterizable beep — pan (-1..1) is optional: places the
   sound left/right based on screen position (immersion, no files). */
function tone(f0, f1, dur, type, vol, pan) {
  if (!AC || muted) return;
  const o = AC.createOscillator(), g = AC.createGain(), t0 = AC.currentTime;
  o.type = type;
  o.frequency.setValueAtTime(f0, t0);
  o.frequency.exponentialRampToValueAtTime(Math.max(30, f1), t0 + dur);
  g.gain.setValueAtTime(vol || 0.12, t0);
  g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
  o.connect(g);
  if (pan && AC.createStereoPanner) {
    const p = AC.createStereoPanner();
    p.pan.value = clamp(pan, -1, 1);
    g.connect(p); p.connect(AC.destination);
  } else {
    g.connect(AC.destination);
  }
  o.start(t0); o.stop(t0 + dur);
}

/* converts a pitch x position into a stereo pan (-1 left, 1 right) */
function panOf(x) { return x === undefined ? 0 : clamp((x - W / 2) / (W / 2), -1, 1); }

/* named sound effects — x (optional) = screen position for panning */
let lastThud = 0;
function sfx(n, x) {
  if (!AC || muted) return;
  const now = performance.now();
  const pan = panOf(x);
  if (n === 'kick') {                                             // ball hit
    tone(300, 90, 0.12, 'square', 0.2, pan);
    tone(110, 45, 0.14, 'sine', 0.12, pan);                        // low layer: more "weight"
  }
  else if (n === 'kickHard') {                                     // BIG shot: deeper, more bite
    tone(260, 70, 0.16, 'square', 0.22, pan);
    tone(80, 32, 0.24, 'sine', 0.2, pan);
    tone(1400, 2200, 0.06, 'triangle', 0.06, pan);                  // small high "crack" on top
  }
  else if (n === 'bounce') tone(160, 90, 0.08, 'sine', 0.1, pan);   // ball bounce
  else if (n === 'thud') {                                          // car collision
    if (now - lastThud < 120) return;
    lastThud = now;
    tone(90, 40, 0.15, 'sawtooth', 0.22, pan);
    tone(55, 28, 0.2, 'sine', 0.15, pan);                           // low layer of the crash
  }
  else if (n === 'jump') tone(260, 480, 0.12, 'sine', 0.08, pan);
  else if (n === 'flip') tone(400, 900, 0.18, 'sawtooth', 0.08, pan);
  else if (n === 'boost') tone(150, 600, 0.3, 'sawtooth', 0.1, pan); // turbo whoosh
  else if (n === 'pad') tone(700, 1300, 0.12, 'sine', 0.12, pan);   // boost pad picked up
  else if (n === 'click') tone(500, 700, 0.08, 'square', 0.1);
  else if (n === 'count') tone(440, 440, 0.12, 'square', 0.12);
  else if (n === 'go') tone(660, 880, 0.25, 'square', 0.14);
  else if (n === 'goal') {                                         // layered goal fanfare
    tone(523, 523, 0.14, 'square', 0.14);
    tone(261, 261, 0.22, 'sine', 0.1);                              // low foundation under the first chord
    setTimeout(() => tone(659, 659, 0.14, 'square', 0.14), 130);
    setTimeout(() => {
      tone(784, 784, 0.32, 'square', 0.16);
      tone(1568, 1568, 0.3, 'sine', 0.05);                          // high sparkle on the final note
    }, 260);
  }
  else if (n === 'record') {                                       // new local record (rare, festive)
    tone(660, 660, 0.1, 'square', 0.12);
    setTimeout(() => tone(880, 880, 0.1, 'square', 0.12), 90);
    setTimeout(() => tone(1175, 1175, 0.22, 'square', 0.14), 180);
  }
  else if (n === 'whistle') { tone(2200, 2100, 0.4, 'sine', 0.12); } // final whistle
}

/* --- the robot voice was REMOVED (it talked way too much 🤖🔇) ---
   say() does nothing anymore, but is kept so callers don't break. */
function say() {}

/* --- continuous crowd noise + cheer on goal --- */
function startCrowd() {
  if (!AC || crowdSrc || muted) return;
  const len = AC.sampleRate * 2;
  const buf = AC.createBuffer(1, len, AC.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * 0.4;
  crowdSrc = AC.createBufferSource();
  crowdSrc.buffer = buf; crowdSrc.loop = true;
  const filt = AC.createBiquadFilter();
  filt.type = 'lowpass'; filt.frequency.value = 900;
  crowdGain = AC.createGain(); crowdGain.gain.value = 0.03;
  crowdSrc.connect(filt); filt.connect(crowdGain); crowdGain.connect(AC.destination);
  crowdSrc.start();
}
function stopCrowd() {
  if (crowdSrc) { try { crowdSrc.stop(); } catch (e) {} crowdSrc = null; crowdGain = null; }
}
function crowdCheer() { // the crowd erupts
  if (!AC || !crowdGain || muted) return;
  const t0 = AC.currentTime;
  crowdGain.gain.cancelScheduledValues(t0);
  crowdGain.gain.setValueAtTime(0.03, t0);
  crowdGain.gain.linearRampToValueAtTime(0.16, t0 + 0.15);
  crowdGain.gain.exponentialRampToValueAtTime(0.03, t0 + 2.2);
}

/* --- engine sounds were REMOVED (they made an annoying "zzzzzz") ---
   The functions stay as no-ops so the rest of the code doesn't break. --- */
function startEngines() {}
function setEngine() {}
function stopEngines() {
  // in case an old engine is still running
  for (let i = 0; i < 2; i++) {
    if (engines[i]) { try { engines[i].o.stop(); } catch (e) {} engines[i] = null; }
  }
}

function toggleMute() {
  muted = !muted;
  settings.sound = !muted;
  saveSettings();
  if (muted) { stopCrowd(); stopEngines(); try { speechSynthesis.cancel(); } catch (e) {} }
  else if (scene === 'play') { startCrowd(); startEngines(); }
}
