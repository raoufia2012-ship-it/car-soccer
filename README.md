# Car Soccer ⚽🚗

**Rocket League meets the World Cup — in your browser, in 2D, with zero dependencies.**

Drive a rocket-powered car for your favorite football nation, fly through the air with turbo boost, and smash the ball into a neon goal. First to 5 goals (or whoever leads at full time) wins. Play against the AI or grab a friend for local 2-player matches on the same keyboard.

No installation, no build step, no external libraries. Everything — graphics, flags, sound effects, crowd noise — is generated in code with the Canvas 2D and Web Audio APIs.

## ▶ How to play

Just open `index.html` in any modern browser. That's it.

If you prefer a local server (recommended for development):

```bash
# with Python
python -m http.server 8000

# or with Node
npx serve
```

Then visit `http://localhost:8000`.

The game also works on **mobile** (landscape only) with on-screen touch controls.

## 🎮 Controls

| Action | Player 1 | Player 2 |
|---|---|---|
| Move | `A` / `D` | `←` / `→` |
| Jump (tap) / **Fly** (hold) | `W` | `↑` |
| Dive / reverse | `S` | `↓` |
| Turbo 🔥 | `Shift` | `Ctrl` |

Extra tricks:

- **Double jump** in the air to somersault — hitting the ball mid-flip shoots it much harder.
- **Hold jump** in the air to fly. The flight gauge above your car drains in ~1 second and refills in ~3.
- **Turbo** thrusts in the direction your nose points, so you can fly across the arena. Grab the ⚡ pads on the ground to refill it.
- Cars can **climb the curved corner ramps** all the way up to the goals, and even park inside their own goal as a keeper.

Shortcuts: `P` pause · `M` mute · `Esc` back to menu · `Enter` confirm / replay. In vs-AI mode the arrow keys also control player 1.

## 🌍 The roster

18 playable characters: the stars of 17 football nations (Mbappé, Messi, Ronaldo, Neymar, Haaland, Son, Hakimi, Mobutu in his presidential limousine 👑, and more) plus two classic cars. Each nation gets:

- its **flag drawn entirely in canvas code** (no image assets),
- its own **car shape** — supercar, muscle car, F1, buggy, 4x4 or limousine,
- a **neon goal** in its colors and a driver with his signature haircut,
- a prestige tier: **⭐ Legend** cars get gold rims and underglow, **🔷 Pro** cars a racing stripe.

The stats on the select screen are purely cosmetic — every car has identical physics, so matches are always fair.

## ⚙️ Settings & progression

- Goals to win (3 / 5 / 10) and match length (1 / 2 / 3 min) — tie at full time goes to **sudden death**.
- Two local records are saved in your browser: best goals in one match and best win streak vs the AI.

## 📁 Project structure

Plain script files loaded in dependency order by `index.html` (no bundler, no modules — open the file, read the code):

```
Car Soccer/
├── index.html            page + script load order
├── style.css             page styles and touch UI
└── js/
    ├── core/
    │   ├── constants.js  arena dimensions & physics tuning
    │   ├── state.js      global state, settings, saved records
    │   ├── canvas.js     canvas setup, 16:9 scaling, rotate hint
    │   └── utils.js      math & drawing helpers
    ├── players/
    │   ├── registry.js   PLAYERS registry, classic cars, flag helpers
    │   ├── ronaldo.js    one full player file (use it as a template)
    │   └── worldcup.js   the 16 World Cup nations
    ├── game/
    │   ├── factories.js  build cars, ball, pads, matches
    │   ├── arena.js      curved corners & ramp collisions
    │   ├── car-physics.js  driving, jumps, turbo, flight
    │   ├── ball-physics.js bounces & goal detection
    │   ├── collisions.js car/ball (incl. 50-50s) & car/car
    │   ├── ai.js         the opponent driver
    │   └── match.js      kickoff, goals, timer, match flow
    ├── render/
    │   ├── stadium.js    night city background
    │   ├── goals.js      neon goals, ramps, corners
    │   ├── car.js        the 6 car shapes
    │   ├── ball.js       ball & boost pads
    │   ├── figure.js     the little waving player figure
    │   └── hud.js        scoreboard, turbo & flight gauges
    ├── ui/
    │   ├── widgets.js    shared button
    │   ├── menu.js       main menu & settings
    │   ├── choose.js     character select (1P & 2P)
    │   ├── versus.js     pre-match VS screen
    │   ├── play.js       match screen & pause panel
    │   └── end.js        end screen & records
    ├── audio.js          all sounds, synthesized live
    ├── effects.js        particles, confetti, hit-stop
    ├── input.js          keyboard, touch, mouse
    └── main.js           the 60 FPS game loop
```

## ➕ Adding your own player

1. Copy `js/players/ronaldo.js` to `js/players/yourplayer.js`.
2. Change the id, name, country, colors and draw your flag (the helpers `hBands`, `vBands`, `drawStar` in `registry.js` cover most flags).
3. Add the script to `index.html` after `registry.js`.
4. Optionally add the id to `CHOOSE_ORDER` in `js/ui/choose.js` to control where it appears in the picker — otherwise it just goes at the end.

## 🛠 Tech notes

- Fixed internal resolution of 1200×675, letterboxed to any screen without stretching, with a high-DPI backing buffer for sharp rendering on retina/mobile.
- All sounds are synthesized with the Web Audio API — oscillators for effects, filtered noise for the crowd — with stereo panning that follows the action.
- Game-feel touches (squash & stretch, hit-stop, camera shake, slow-mo on goals) are strictly cosmetic and never change the physics.

Have fun! 🏆
