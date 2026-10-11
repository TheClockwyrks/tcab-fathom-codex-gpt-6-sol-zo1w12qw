# Fathom

Fathom is a bioluminescent deep sea maze chase for the browser. Swim a glowing forager through a dark trench, eat every plankton mote to descend, and avoid three predators that hunt by light, sound, and flare. The Kindle dive remembers explored ground, but shows it only inside the forager's vision circle. Eating brightens the forager and expands that circle.

## Run

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. To build the static site:

```sh
npm run build
```

Serve `dist/` with any static file server. The site and its art use relative URLs, so the directory also works under a subpath.

## Controls

| Key | Action |
| --- | --- |
| Arrow keys or WASD | Swim or move a menu selection |
| Space | Send a sonar pulse |
| Left or right Shift | Release ink |
| Enter or Space | Confirm a menu choice |
| Escape or P | Pause and resume |
| M | Mute and unmute |
| Backquote | Show the engine debug overlay |

Menus also respond to pointer and touch. The on screen touch pad supplies movement, sonar, and ink on touch devices.

## Development checks

```sh
npm run typecheck
npm run lint
npm run format
npm test
```

The game is implemented in `src/game.ts` on the Simple 2D engine. The fixed simulation runs at 120 ticks per second, while the engine owns the frame loop, canvas fit, input, audio, assets, and debug overlay. The debug API returned by `game.initialize` can pose scenarios through `engine.apply` and read a JSON snapshot through `engine.debug.snapshot(engine.state)`.
