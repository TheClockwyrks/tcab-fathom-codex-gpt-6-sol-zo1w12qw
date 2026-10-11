import type { Game, InitApi, UpdateApi } from "@clockwyrks/simple-2d";
import type { DeepReadonly } from "ts-essentials";
import * as C from "./constants";

export const BACKGROUND = "#030b14";
type Read<T> = DeepReadonly<T>;
export type Direction = "up" | "down" | "left" | "right";
export type Screen =
  | "title"
  | "howto"
  | "countdown"
  | "playing"
  | "paused"
  | "cleared"
  | "gameover";
export type Tile = "#" | "." | "g" | "d";
export type PredatorState = "den" | "wander" | "chase" | "search";
export interface Body {
  x: number;
  y: number;
  tx: number;
  ty: number;
  dir: Direction;
}
export interface Forager extends Body {
  moving: boolean;
}
export interface Drifter {
  x: number;
  y: number;
  tx: number;
  ty: number;
  lit: boolean;
  mind: boolean;
  travel: boolean;
  dir: Direction;
}
export interface Predator extends Body {
  kind: C.PredatorKind;
  state: PredatorState;
  released: boolean;
  mind: boolean;
  travel: boolean;
  speed: number;
  alert: boolean;
  lit: boolean;
  detectRange: number | null;
  hearingRange: number | null;
  hearingLock: boolean | null;
  flareCharging: boolean | null;
  flaring: boolean | null;
  flareRadius: number | null;
  fix: { tx: number; ty: number } | null;
  linger: number;
  alertIn: number;
  pingIn: number;
  pingGap: number;
  searchIn: number;
  searchPing: boolean;
  flareIn: number;
  flarePhase: number;
  markIn: number;
  ramp: number;
}
export interface Pulse {
  source: "forager" | "gloamfin";
  tint: "cyan" | "violet" | "orange";
  ox: number;
  oy: number;
  front: number;
  range: number;
}
export interface InkCloud {
  x: number;
  y: number;
  radius: number;
  remaining: number;
}
export interface FathomState {
  version: number;
  screen: Screen;
  menuIndex: number | null;
  titleIndex: number;
  depth: number;
  score: number;
  lives: number;
  muted: boolean;
  planktonRemaining: number;
  drifterIn: number;
  brightness: number;
  brightHold: number;
  visionRadius: number;
  windowRadius: number;
  sonar: { ready: boolean; cooldown: number; range: number };
  ink: { ready: boolean; cooldown: number };
  grid: {
    cols: number;
    rows: number;
    tile: number;
    originX: number;
    originY: number;
  };
  tiles: readonly string[];
  plankton: readonly string[];
  visibility: readonly string[];
  forager: Forager;
  drifters: readonly Drifter[];
  predators: readonly Predator[];
  pulses: readonly Pulse[];
  inkClouds: readonly InkCloud[];
  simTime: number;
  accumulator: number;
  desired: Direction | null;
  playTime: number;
  screenTime: number;
  randomSeed: number;
  pointerDown: { id: number; item: number } | null;
  pendingSonar: boolean;
  pendingInk: boolean;
  images: Record<string, readonly ImageBitmap[]>;
}
export type Snapshot = ReturnType<typeof snapshot>;
export interface FathomDebugApi {
  version: number;
  reset(s: Read<FathomState>): FathomState;
  snapshot(s: Read<FathomState>): ReturnType<typeof snapshot>;
  reconcile(s: Read<FathomState>): FathomState;
  setScreen(s: Read<FathomState>, screen: Screen): FathomState;
  setMenuIndex(s: Read<FathomState>, index: number): FathomState;
  setTitleIndex(s: Read<FathomState>, index: number): FathomState;
  menuItemRect(s: Read<FathomState>, index: number): Rect | null;
  setScore(s: Read<FathomState>, points: number): FathomState;
  setLives(s: Read<FathomState>, n: number): FathomState;
  setDepth(s: Read<FathomState>, d: number): FathomState;
  setMaze(s: Read<FathomState>, rows: readonly string[]): FathomState;
  setPlankton(
    s: Read<FathomState>,
    tx: number,
    ty: number,
    present: boolean,
  ): FathomState;
  clearPlankton(s: Read<FathomState>): FathomState;
  clearFog(s: Read<FathomState>): FathomState;
  setForagerTile(s: Read<FathomState>, tx: number, ty: number): FathomState;
  setForagerDir(s: Read<FathomState>, dir: Direction): FathomState;
  setBrightness(s: Read<FathomState>, g: number): FathomState;
  setBrightHold(s: Read<FathomState>, seconds: number): FathomState;
  clearPredators(s: Read<FathomState>): FathomState;
  addPredator(
    s: Read<FathomState>,
    kind: C.PredatorKind,
    tx: number,
    ty: number,
  ): FathomState;
  setPredatorTile(
    s: Read<FathomState>,
    index: number,
    tx: number,
    ty: number,
  ): FathomState;
  setPredatorDir(
    s: Read<FathomState>,
    index: number,
    dir: Direction,
  ): FathomState;
  setPredatorState(
    s: Read<FathomState>,
    index: number,
    value: "den" | "wander" | "chase",
  ): FathomState;
  setPredatorReleased(
    s: Read<FathomState>,
    index: number,
    released: boolean,
  ): FathomState;
  setPredatorMind(
    s: Read<FathomState>,
    index: number,
    enabled: boolean,
  ): FathomState;
  setPredatorTravel(
    s: Read<FathomState>,
    index: number,
    enabled: boolean,
  ): FathomState;
  spawnDrifter(s: Read<FathomState>, tx: number, ty: number): FathomState;
  clearDrifters(s: Read<FathomState>): FathomState;
  setDrifterMind(
    s: Read<FathomState>,
    index: number,
    enabled: boolean,
  ): FathomState;
  setDrifterTravel(
    s: Read<FathomState>,
    index: number,
    enabled: boolean,
  ): FathomState;
  setDrifterIn(s: Read<FathomState>, seconds: number): FathomState;
  setSonarCooldown(s: Read<FathomState>, seconds: number): FathomState;
  setInkCooldown(s: Read<FathomState>, seconds: number): FathomState;
}
interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}
const DIRS: readonly Direction[] = ["up", "right", "down", "left"];
const delta: Record<Direction, readonly [number, number]> = {
  up: [0, -1],
  right: [1, 0],
  down: [0, 1],
  left: [-1, 0],
};
const opposite: Record<Direction, Direction> = {
  up: "down",
  down: "up",
  left: "right",
  right: "left",
};
const center = (tx: number, ty: number) => ({
  x: C.GRID_ORIGIN_X + (tx + 0.5) * C.TILE,
  y: C.GRID_ORIGIN_Y + (ty + 0.5) * C.TILE,
});
const tileAt = (x: number, y: number) => ({
  tx: Math.max(
    0,
    Math.min(C.GRID_COLS - 1, Math.floor((x - C.GRID_ORIGIN_X) / C.TILE)),
  ),
  ty: Math.max(
    0,
    Math.min(C.GRID_ROWS - 1, Math.floor((y - C.GRID_ORIGIN_Y) / C.TILE)),
  ),
});
const char = (rows: readonly string[], tx: number, ty: number) =>
  rows[ty]?.[tx] ?? "#";
const changeChar = (
  rows: readonly string[],
  tx: number,
  ty: number,
  value: string,
): string[] =>
  rows.map((row, y) =>
    y === ty ? row.slice(0, tx) + value + row.slice(tx + 1) : row,
  );
const distance = (a: { x: number; y: number }, b: { x: number; y: number }) =>
  Math.hypot(a.x - b.x, a.y - b.y);
const range = (depth: number) =>
  Math.max(C.SONAR_RANGE_MIN, C.SONAR_RANGE_BASE - (depth - 1));
const vRadius = (g: number) => C.VISION_MIN + C.VISION_GAIN * g;
const wRadius = (g: number) => C.KINDLE_VISION_MIN + C.KINDLE_VISION_GAIN * g;
const detect = (g: number) => C.LANTERN_RANGE_BASE + C.LANTERN_RANGE_GAIN * g;
const zeroLayer = (c: string) =>
  Array.from({ length: C.GRID_ROWS }, () => c.repeat(C.GRID_COLS));
const count = (rows: readonly string[], c: string) =>
  rows.reduce((n, row) => n + [...row].filter((v) => v === c).length, 0);
const menuItems = (screen: Screen): readonly string[] =>
  screen === "title"
    ? C.TITLE_ITEMS
    : screen === "paused"
      ? C.PAUSE_ITEMS
      : screen === "gameover"
        ? C.GAMEOVER_ITEMS
        : [];
const rect = (screen: Screen, index: number): Rect | null => {
  if (index < 0 || index >= menuItems(screen).length) return null;
  const y0 = screen === "title" ? 430 : screen === "paused" ? 318 : 438;
  return { x: 440, y: y0 + index * 60, w: 400, h: 48 };
};
const menuFor = (screen: Screen, titleIndex: number) =>
  screen === "title"
    ? titleIndex
    : screen === "paused" || screen === "gameover"
      ? 0
      : null;
const isDir = (v: unknown): v is Direction => DIRS.includes(v as Direction);
const integer = (n: number, min: number, max = Infinity) => {
  if (!Number.isInteger(n) || n < min || n > max)
    throw new Error("Invalid integer");
};
const seconds = (n: number, min = 0, max = Infinity) => {
  if (!Number.isFinite(n) || n < min || n > max)
    throw new Error("Invalid duration");
};
const requireTile = (
  s: Read<FathomState>,
  tx: number,
  ty: number,
  allowed: string,
) => {
  integer(tx, 0, C.GRID_COLS - 1);
  integer(ty, 0, C.GRID_ROWS - 1);
  if (!allowed.includes(char(s.tiles, tx, ty))) throw new Error("Invalid tile");
};
const requireIndex = (n: number, len: number) => integer(n, 0, len - 1);
function maze(): string[] {
  const cells = Array.from({ length: C.GRID_ROWS }, () =>
    Array(C.GRID_COLS).fill("#"),
  );
  for (const y of [1, 3, 5, 7, 9, 11, 13, 15])
    for (let x = 1; x < 35; x++) cells[y][x] = ".";
  for (const y of [2, 4, 6, 8, 10, 12, 14]) {
    const xs = [1, 7, 14, 21, 28, 34];
    for (const x of xs) cells[y][x] = ".";
  }
  for (let y = 7; y <= 9; y++) for (let x = 16; x <= 19; x++) cells[y][x] = "d";
  for (let y = 7; y <= 9; y++) {
    cells[y][15] = "#";
    cells[y][20] = "#";
  }
  cells[6][17] = "g";
  cells[5][17] = ".";
  cells[11][0] = ".";
  cells[11][35] = ".";
  return cells.map((row) => row.join(""));
}
const mazeStart = { tx: 17, ty: 15 };
function makePredator(
  kind: C.PredatorKind,
  index: number,
  g: number,
): Predator {
  const tx = 16 + (index % 4),
    ty = 7 + (Math.floor(index / 4) % 3);
  return {
    kind,
    ...center(tx, ty),
    tx,
    ty,
    dir: "up",
    state: "den",
    released: false,
    mind: true,
    travel: true,
    speed: kind === "lanternjaw" ? C.DRIFTER_SPEED : C.PREDATOR_SPEED,
    alert: false,
    lit: false,
    detectRange: kind === "gloamfin" ? null : detect(g),
    hearingRange: kind === "gloamfin" ? C.GLOAMFIN_HEAR : null,
    hearingLock: kind === "gloamfin" ? false : null,
    flareCharging: kind === "flarefish" ? false : null,
    flaring: kind === "flarefish" ? false : null,
    flareRadius: kind === "flarefish" ? 0 : null,
    fix: null,
    linger: 0,
    alertIn: 0,
    pingIn: C.GLOAMFIN_PING_INTERVAL,
    pingGap: 0,
    searchIn: 0,
    searchPing: false,
    flareIn: C.FLARE_INTERVAL,
    flarePhase: 0,
    markIn: 0,
    ramp: C.GLOAMFIN_RAMP_TIME,
  };
}
function roster(depth: number, g = 0): Predator[] {
  const kinds = [
    ...C.DEN_ORDER,
    ...C.ROSTER_ADD_ORDER.slice(0, Math.min(depth - 1, 3)),
  ];
  return kinds.map((kind, i) => makePredator(kind, i, g));
}
function initial(
  images: Record<string, readonly ImageBitmap[]> = {},
  muted = false,
): FathomState {
  const tiles = maze(),
    plankton = tiles.map((row) =>
      row.replace(/[^.]/g, "-").replace(/\./g, "*"),
    );
  return {
    version: 1,
    screen: "title",
    menuIndex: 0,
    titleIndex: 0,
    depth: 1,
    score: 0,
    lives: C.START_LIVES,
    muted,
    planktonRemaining: count(plankton, "*"),
    drifterIn: C.DRIFTER_INTERVAL,
    brightness: 0,
    brightHold: 0,
    visionRadius: vRadius(0),
    windowRadius: wRadius(0),
    sonar: { ready: true, cooldown: 0, range: range(1) },
    ink: { ready: true, cooldown: 0 },
    grid: {
      cols: C.GRID_COLS,
      rows: C.GRID_ROWS,
      tile: C.TILE,
      originX: C.GRID_ORIGIN_X,
      originY: C.GRID_ORIGIN_Y,
    },
    tiles,
    plankton,
    visibility: zeroLayer("u"),
    forager: {
      ...center(mazeStart.tx, mazeStart.ty),
      ...mazeStart,
      dir: "left",
      moving: false,
    },
    drifters: [],
    predators: roster(1),
    pulses: [],
    inkClouds: [],
    simTime: 0,
    accumulator: 0,
    desired: null,
    playTime: 0,
    screenTime: 0,
    randomSeed: 27449,
    pointerDown: null,
    pendingSonar: false,
    pendingInk: false,
    images,
  };
}
const copy = (s: Read<FathomState>): FathomState => s as unknown as FathomState;
function reconcile(s: Read<FathomState>): FathomState {
  const t = (b: { x: number; y: number }) => tileAt(b.x, b.y);
  return {
    ...copy(s),
    forager: { ...s.forager, ...t(s.forager) },
    drifters: s.drifters.map((d) => ({ ...d, ...t(d) })),
    predators: s.predators.map((p) => ({
      ...p,
      ...t(p),
      speed: speed(p),
      detectRange: p.kind === "gloamfin" ? null : detect(s.brightness),
      hearingRange: p.kind === "gloamfin" ? C.GLOAMFIN_HEAR : null,
    })),
    visionRadius: vRadius(s.brightness),
    windowRadius: wRadius(s.brightness),
    sonar: {
      cooldown: s.sonar.cooldown,
      ready: s.sonar.cooldown === 0,
      range: range(s.depth),
    },
    ink: { cooldown: s.ink.cooldown, ready: s.ink.cooldown === 0 },
    planktonRemaining: count(s.plankton, "*"),
  };
}
function speed(p: Read<Predator>): number {
  if (p.kind === "lanternjaw")
    return p.state === "chase" ? C.PREDATOR_SPEED : C.DRIFTER_SPEED;
  if (p.kind === "gloamfin" && p.state === "chase")
    return (
      C.GLOAMFIN_CORNER_SPEED +
      (C.GLOAMFIN_CHASE_SPEED - C.GLOAMFIN_CORNER_SPEED) *
        Math.min(1, p.ramp / C.GLOAMFIN_RAMP_TIME)
    );
  return C.PREDATOR_SPEED;
}
function snapshot(s: Read<FathomState>) {
  return {
    version: s.version,
    screen: s.screen,
    menuIndex: s.menuIndex,
    titleIndex: s.titleIndex,
    depth: s.depth,
    score: s.score,
    lives: s.lives,
    muted: s.muted,
    planktonRemaining: s.planktonRemaining,
    drifterIn: s.drifterIn,
    brightness: s.brightness,
    brightHold: s.brightHold,
    visionRadius: s.visionRadius,
    windowRadius: s.windowRadius,
    sonar: { ...s.sonar },
    ink: { ...s.ink },
    grid: { ...s.grid },
    tiles: [...s.tiles],
    plankton: [...s.plankton],
    visibility: [...s.visibility],
    forager: {
      x: s.forager.x,
      y: s.forager.y,
      tx: s.forager.tx,
      ty: s.forager.ty,
      dir: s.forager.dir,
      moving: s.forager.moving,
    },
    drifters: s.drifters.map((d) => ({
      x: d.x,
      y: d.y,
      tx: d.tx,
      ty: d.ty,
      lit: d.lit,
      mind: d.mind,
      travel: d.travel,
    })),
    predators: s.predators.map((p) => ({
      kind: p.kind,
      x: p.x,
      y: p.y,
      tx: p.tx,
      ty: p.ty,
      dir: p.dir,
      state: p.state,
      released: p.released,
      mind: p.mind,
      travel: p.travel,
      speed: p.speed,
      alert: p.alert,
      lit: p.lit,
      detectRange: p.detectRange,
      hearingRange: p.hearingRange,
      hearingLock: p.hearingLock,
      flareCharging: p.flareCharging,
      flaring: p.flaring,
      flareRadius: p.flareRadius,
    })),
    pulses: s.pulses.map((p) => ({ ...p })),
    inkClouds: s.inkClouds.map((c) => ({ ...c })),
    simTime: s.simTime,
  };
}
function patchPred(
  s: Read<FathomState>,
  i: number,
  fn: (p: Read<Predator>) => Predator,
): FathomState {
  requireIndex(i, s.predators.length);
  return {
    ...copy(s),
    predators: s.predators.map((p, j) => (j === i ? fn(p) : { ...p })),
  };
}
function patchDrift(
  s: Read<FathomState>,
  i: number,
  fn: (d: Read<Drifter>) => Drifter,
): FathomState {
  requireIndex(i, s.drifters.length);
  return {
    ...copy(s),
    drifters: s.drifters.map((d, j) => (j === i ? fn(d) : { ...d })),
  };
}
export const debug: FathomDebugApi = {
  version: C.FATHOM_DEBUG_VERSION,
  reset: (s) =>
    initial(s.images as Record<string, readonly ImageBitmap[]>, s.muted),
  snapshot,
  reconcile,
  setScreen: (s, screen) => {
    if (
      !(
        [
          "title",
          "howto",
          "countdown",
          "playing",
          "paused",
          "cleared",
          "gameover",
        ] as Screen[]
      ).includes(screen)
    )
      throw new Error("Invalid screen");
    return {
      ...copy(s),
      screen,
      menuIndex: menuFor(screen, s.titleIndex),
      screenTime: 0,
      playTime: screen === "playing" ? 0 : s.playTime,
    };
  },
  setMenuIndex: (s, index) => {
    requireIndex(index, menuItems(s.screen).length);
    return { ...copy(s), menuIndex: index };
  },
  setTitleIndex: (s, index) => {
    requireIndex(index, C.TITLE_ITEMS.length);
    return { ...copy(s), titleIndex: index };
  },
  menuItemRect: (s, index) => rect(s.screen, index),
  setScore: (s, points) => {
    integer(points, 0);
    return { ...copy(s), score: points };
  },
  setLives: (s, n) => {
    integer(n, 0);
    return { ...copy(s), lives: n };
  },
  setDepth: (s, d) => {
    integer(d, 1);
    return {
      ...copy(s),
      depth: d,
      sonar: { ...s.sonar, range: range(d) },
      predators: roster(d, s.brightness),
    };
  },
  setMaze: (s, rows) => {
    if (
      rows.length !== C.GRID_ROWS ||
      rows.some((row) => row.length !== C.GRID_COLS || /[^#.gd]/.test(row))
    )
      throw new Error("Invalid maze");
    const den = rows.some((row) => row.includes("d"));
    const gates = count(rows, "g");
    if ((den && gates !== 1) || (!den && gates > 1))
      throw new Error("Invalid gate");
    return { ...copy(s), tiles: [...rows] };
  },
  setPlankton: (s, tx, ty, present) => {
    requireTile(s, tx, ty, ".");
    const plankton = changeChar(s.plankton, tx, ty, present ? "*" : "-");
    return { ...copy(s), plankton, planktonRemaining: count(plankton, "*") };
  },
  clearPlankton: (s) => ({
    ...copy(s),
    plankton: zeroLayer("-"),
    planktonRemaining: 0,
  }),
  clearFog: (s) => ({ ...copy(s), visibility: zeroLayer("u") }),
  setForagerTile: (s, tx, ty) => {
    requireTile(s, tx, ty, ".");
    return {
      ...copy(s),
      forager: { ...s.forager, ...center(tx, ty), tx, ty, moving: false },
      desired: null,
    };
  },
  setForagerDir: (s, dir) => {
    if (!isDir(dir)) throw new Error("Invalid direction");
    return { ...copy(s), forager: { ...s.forager, dir, moving: false } };
  },
  setBrightness: (s, g) => {
    seconds(g, 0, 1);
    return reconcile({ ...copy(s), brightness: g });
  },
  setBrightHold: (s, n) => {
    seconds(n, 0, C.BRIGHT_HOLD);
    return { ...copy(s), brightHold: n };
  },
  clearPredators: (s) => ({ ...copy(s), predators: [] }),
  addPredator: (s, kind, tx, ty) => {
    if (!C.DEN_ORDER.includes(kind)) throw new Error("Invalid predator");
    requireTile(s, tx, ty, ".");
    const p = {
      ...makePredator(kind, s.predators.length, s.brightness),
      ...center(tx, ty),
      tx,
      ty,
      state: "wander" as const,
      released: true,
    };
    return { ...copy(s), predators: [...s.predators, p] };
  },
  setPredatorTile: (s, i, tx, ty) => {
    requireTile(s, tx, ty, ".dg");
    return patchPred(s, i, (p) => ({ ...p, ...center(tx, ty), tx, ty }));
  },
  setPredatorDir: (s, i, dir) => {
    if (!isDir(dir)) throw new Error("Invalid direction");
    return patchPred(s, i, (p) => ({ ...p, dir }));
  },
  setPredatorState: (s, i, value) => {
    if (!(["den", "wander", "chase"] as string[]).includes(value))
      throw new Error("Invalid state");
    return patchPred(s, i, (p) => {
      requireTile(s, p.tx, p.ty, value === "den" ? "dg" : ".");
      return {
        ...p,
        state: value,
        fix: value === "chase" ? { tx: s.forager.tx, ty: s.forager.ty } : null,
        ramp: value === "chase" ? C.GLOAMFIN_RAMP_TIME : p.ramp,
        speed:
          value === "chase" && p.kind === "gloamfin"
            ? C.GLOAMFIN_CHASE_SPEED
            : speed({ ...p, state: value }),
      };
    });
  },
  setPredatorReleased: (s, i, released) =>
    patchPred(s, i, (p) => ({ ...p, released })),
  setPredatorMind: (s, i, mind) => patchPred(s, i, (p) => ({ ...p, mind })),
  setPredatorTravel: (s, i, travel) =>
    patchPred(s, i, (p) => ({ ...p, travel })),
  spawnDrifter: (s, tx, ty) => {
    requireTile(s, tx, ty, ".");
    return {
      ...copy(s),
      drifters: [
        ...s.drifters,
        {
          ...center(tx, ty),
          tx,
          ty,
          dir: "up",
          lit: false,
          mind: true,
          travel: true,
        },
      ],
    };
  },
  clearDrifters: (s) => ({ ...copy(s), drifters: [] }),
  setDrifterMind: (s, i, mind) => patchDrift(s, i, (d) => ({ ...d, mind })),
  setDrifterTravel: (s, i, travel) =>
    patchDrift(s, i, (d) => ({ ...d, travel })),
  setDrifterIn: (s, n) => {
    seconds(n, 0, C.DRIFTER_INTERVAL);
    return { ...copy(s), drifterIn: n };
  },
  setSonarCooldown: (s, n) => {
    seconds(n);
    return { ...copy(s), sonar: { ...s.sonar, cooldown: n, ready: n === 0 } };
  },
  setInkCooldown: (s, n) => {
    seconds(n);
    return { ...copy(s), ink: { cooldown: n, ready: n === 0 } };
  },
};

function neighbor(
  s: Read<FathomState>,
  tx: number,
  ty: number,
  dir: Direction,
  allowed: string,
): { tx: number; ty: number } | null {
  const [dx, dy] = delta[dir];
  let nx = tx + dx;
  const ny = ty + dy;
  if (ny < 0 || ny >= C.GRID_ROWS) return null;
  if (nx < 0 || nx >= C.GRID_COLS) {
    if (
      char(s.tiles, 0, ty) !== "." ||
      char(s.tiles, C.GRID_COLS - 1, ty) !== "."
    )
      return null;
    nx = (nx + C.GRID_COLS) % C.GRID_COLS;
  }
  return allowed.includes(char(s.tiles, nx, ny)) ? { tx: nx, ty: ny } : null;
}
function openDirs(
  s: Read<FathomState>,
  tx: number,
  ty: number,
  allowed: string,
): Direction[] {
  return DIRS.filter((d) => neighbor(s, tx, ty, d, allowed) !== null);
}
function nextRandom(seed: number): number {
  return (Math.imul(seed, 1664525) + 1013904223) >>> 0;
}
function chooseDirection(
  s: Read<FathomState>,
  b: Read<Body>,
  allowed: string,
): [Direction | null, number] {
  const dirs = openDirs(s, b.tx, b.ty, allowed);
  if (!dirs.length) return [null, s.randomSeed];
  const choices = dirs.filter((d) => d !== opposite[b.dir]);
  const pool = choices.length ? choices : dirs;
  const seed = nextRandom(s.randomSeed);
  return [pool[seed % pool.length], seed];
}
function pathDirection(
  s: Read<FathomState>,
  from: { tx: number; ty: number },
  to: { tx: number; ty: number },
  allowed: string,
): Direction | null {
  if (from.tx === to.tx && from.ty === to.ty) return null;
  const key = (tx: number, ty: number) => ty * C.GRID_COLS + tx;
  const seen = new Set<number>([key(from.tx, from.ty)]);
  const queue: { tx: number; ty: number; first: Direction }[] = [];
  for (const d of DIRS) {
    const n = neighbor(s, from.tx, from.ty, d, allowed);
    if (n) {
      queue.push({ ...n, first: d });
      seen.add(key(n.tx, n.ty));
    }
  }
  for (let h = 0; h < queue.length; h++) {
    const p = queue[h];
    if (p.tx === to.tx && p.ty === to.ty) return p.first;
    for (const d of DIRS) {
      const n = neighbor(s, p.tx, p.ty, d, allowed);
      if (n && !seen.has(key(n.tx, n.ty))) {
        seen.add(key(n.tx, n.ty));
        queue.push({ ...n, first: p.first });
      }
    }
  }
  return null;
}
function pathDistances(
  s: Read<FathomState>,
  tx: number,
  ty: number,
  limit: number,
): number[][] {
  const out = Array.from({ length: C.GRID_ROWS }, () =>
    Array<number>(C.GRID_COLS).fill(Infinity),
  );
  const queue = [{ tx, ty }];
  out[ty][tx] = 0;
  for (let h = 0; h < queue.length; h++) {
    const p = queue[h],
      d = out[p.ty][p.tx];
    if (d >= limit) continue;
    for (const dir of DIRS) {
      const n = neighbor(s, p.tx, p.ty, dir, ".");
      if (n && out[n.ty][n.tx] === Infinity) {
        out[n.ty][n.tx] = d + 1;
        queue.push(n);
      }
    }
  }
  return out;
}
function lineClear(
  s: Read<FathomState>,
  a: { x: number; y: number },
  b: { x: number; y: number },
  allowLastRock = false,
): boolean {
  const steps = Math.ceil(distance(a, b) / 8);
  const last = tileAt(b.x, b.y);
  for (let i = 1; i <= steps; i++) {
    const x = a.x + ((b.x - a.x) * i) / steps,
      y = a.y + ((b.y - a.y) * i) / steps;
    const t = tileAt(x, y);
    if (allowLastRock && t.tx === last.tx && t.ty === last.ty) continue;
    if (char(s.tiles, t.tx, t.ty) === "#") return false;
  }
  return true;
}
function inkBlinds(
  s: Read<FathomState>,
  a: { x: number; y: number },
  b: { x: number; y: number },
): boolean {
  return s.inkClouds.some((c) => {
    const vx = b.x - a.x,
      vy = b.y - a.y,
      den = vx * vx + vy * vy;
    const t = den
      ? Math.max(0, Math.min(1, ((c.x - a.x) * vx + (c.y - a.y) * vy) / den))
      : 0;
    return Math.hypot(c.x - a.x - vx * t, c.y - a.y - vy * t) <= c.radius;
  });
}
function travel(
  s: Read<FathomState>,
  b: Read<Body>,
  dir: Direction | null,
  speed: number,
  dt: number,
  allowed: string,
): Body {
  if (!dir || !allowed.includes(char(s.tiles, b.tx, b.ty))) return { ...b };
  const current = center(b.tx, b.ty);
  let heading = dir;
  const target = neighbor(s, b.tx, b.ty, heading, allowed);
  if (!target) return { ...b };
  const atCenter =
    Math.abs(b.x - current.x) < 1e-5 && Math.abs(b.y - current.y) < 1e-5;
  if (!atCenter && b.dir !== heading && heading !== opposite[b.dir])
    heading = b.dir;
  const toward = neighbor(s, b.tx, b.ty, heading, allowed);
  if (!toward) return { ...b };
  const dest = center(toward.tx, toward.ty);
  const wrap = Math.abs(dest.x - current.x) > C.TILE * 2;
  const axis = heading === "left" || heading === "right" ? "x" : "y";
  const sign = axis === "x" ? delta[heading][0] : delta[heading][1];
  const pos = axis === "x" ? b.x : b.y,
    cen = axis === "x" ? current.x : current.y;
  const goal =
    atCenter || Math.sign(cen - pos) !== sign ? cen + sign * C.TILE : cen;
  const step = Math.min(speed * dt, Math.abs(goal - pos));
  let x = b.x + (axis === "x" ? sign * step : 0);
  const y = b.y + (axis === "y" ? sign * step : 0);
  if (wrap && axis === "x" && Math.abs(x - current.x) >= C.TILE / 2) {
    x +=
      heading === "left"
        ? (C.GRID_COLS - 1) * C.TILE
        : -(C.GRID_COLS - 1) * C.TILE;
  }
  x = Math.max(
    C.GRID_ORIGIN_X,
    Math.min(C.GRID_ORIGIN_X + C.GRID_COLS * C.TILE, x),
  );
  const t = tileAt(x, y);
  return { x, y, ...t, dir: heading };
}
function moveForager(s: Read<FathomState>, held: boolean): Forager {
  const f = s.forager;
  if (!held) return { ...f, moving: false };
  let dir = f.dir;
  const desired = s.desired;
  const at = center(f.tx, f.ty),
    onCenter = Math.abs(f.x - at.x) < 0.001 && Math.abs(f.y - at.y) < 0.001;
  if (desired && (onCenter || desired === opposite[f.dir])) {
    if (neighbor(s, f.tx, f.ty, desired, ".")) dir = desired;
  }
  if (onCenter && !neighbor(s, f.tx, f.ty, dir, "."))
    return { ...f, dir, moving: false };
  const moved = travel(s, { ...f, dir }, dir, C.FORAGER_SPEED, C.TICK_DT, ".");
  return { ...moved, moving: distance(moved, f) > 0.0001 };
}
function lightAndFog(s: Read<FathomState>): FathomState {
  const rows = s.visibility.map((row) => row.replace(/l/g, "r").split(""));
  const flare = s.predators.filter((p) => p.flaring && p.state !== "den");
  for (let ty = 0; ty < C.GRID_ROWS; ty++)
    for (let tx = 0; tx < C.GRID_COLS; tx++) {
      const c = center(tx, ty),
        lit =
          flare.some((p) => distance(c, p) <= C.FLARE_RADIUS) ||
          (distance(c, s.forager) <= s.visionRadius &&
            lineClear(s, s.forager, c, true));
      if (lit) rows[ty][tx] = "l";
    }
  for (const pulse of s.pulses)
    if (pulse.source === "forager") {
      const ds = pathDistances(s, pulse.ox, pulse.oy, pulse.range);
      for (let ty = 0; ty < C.GRID_ROWS; ty++)
        for (let tx = 0; tx < C.GRID_COLS; tx++)
          if (ds[ty][tx] <= pulse.front && ds[ty][tx] <= pulse.range) {
            rows[ty][tx] = "l";
            for (const dir of DIRS) {
              const [dx, dy] = delta[dir];
              if (char(s.tiles, tx + dx, ty + dy) === "#")
                rows[ty + dy][tx + dx] = "l";
            }
          }
    }
  const visible = rows.map((r) => r.join(""));
  const predators = s.predators.map((p) => ({
    ...p,
    lit:
      p.state !== "den" &&
      (p.alert ||
        p.markIn > 0 ||
        s.visibility[p.ty]?.[p.tx] === "l" ||
        (distance(p, s.forager) <= s.visionRadius &&
          lineClear(s, s.forager, p)) ||
        flare.some((f) => distance(f, p) <= C.FLARE_RADIUS)),
  }));
  const drifters = s.drifters.map((d) => ({
    ...d,
    lit:
      visible[d.ty]?.[d.tx] === "l" &&
      ((distance(d, s.forager) <= s.visionRadius &&
        lineClear(s, s.forager, d)) ||
        flare.some((f) => distance(f, d) <= C.FLARE_RADIUS)),
  }));
  return { ...copy(s), visibility: visible, predators, drifters };
}
type Emit = (cue: C.CueName) => void;
function advancePulse(s: Read<FathomState>): FathomState {
  const pulses = s.pulses
    .map((p) => ({ ...p, front: p.front + C.SONAR_WAVE_SPEED * C.TICK_DT }))
    .filter((p) => p.front <= p.range + 1);
  const predators = s.predators.map((p) => {
    if (p.kind === "lanternjaw" || p.state === "den") return { ...p };
    const marked = pulses.some((q) => {
      if (q.source !== "forager") return false;
      const d = pathDistances(s, q.ox, q.oy, q.range)[p.ty][p.tx];
      return d <= q.front && d > q.front - C.SONAR_WAVE_SPEED * C.TICK_DT;
    });
    return {
      ...p,
      markIn: marked ? C.SONAR_MARK_TIME : Math.max(0, p.markIn - C.TICK_DT),
    };
  });
  return { ...copy(s), pulses, predators };
}
function movePredators(s: Read<FathomState>, emit: Emit): FathomState {
  let seed = s.randomSeed;
  const pulses = [...s.pulses];
  const predators = s.predators.map((old, i) => {
    let p: Predator = {
      ...old,
      alertIn: Math.max(0, old.alertIn - C.TICK_DT),
      alert: old.alertIn > C.TICK_DT,
      pingGap: Math.max(0, old.pingGap - C.TICK_DT),
      pingIn: Math.max(0, old.pingIn - C.TICK_DT),
    };
    if (!p.mind) return p;
    if (p.state === "den") {
      if (!p.released && s.playTime >= i * C.DEN_RELEASE_GAP) p.released = true;
      if (p.released && p.travel && "dg".includes(char(s.tiles, p.tx, p.ty))) {
        const gy = s.tiles.findIndex((row) => row.includes("g"));
        if (gy >= 0) {
          const gate = { tx: s.tiles[gy].indexOf("g"), ty: gy };
          const d =
            p.tx === gate.tx && p.ty === gate.ty
              ? (DIRS.find((dir) => neighbor(s, p.tx, p.ty, dir, ".")) ?? null)
              : pathDirection(s, p, gate, "dg");
          const b = travel(s, p, d, C.PREDATOR_SPEED, C.TICK_DT, ".dg");
          p = { ...p, ...b };
          if (char(s.tiles, p.tx, p.ty) === ".") p.state = "wander";
        }
      }
      return {
        ...p,
        pingIn: old.pingIn,
        pingGap: old.pingGap,
        speed: speed(p),
      };
    }
    const close = distance(p, s.forager) <= C.GLOAMFIN_HEAR;
    const blind = p.kind !== "gloamfin" && inkBlinds(s, p, s.forager);
    const lightSense =
      p.kind !== "gloamfin" &&
      !blind &&
      distance(p, s.forager) <= detect(s.brightness) &&
      lineClear(s, p, s.forager);
    const hearing = p.kind === "gloamfin" && close;
    p.hearingLock = p.kind === "gloamfin" ? hearing : null;
    let pingHeard = false;
    if (p.kind === "gloamfin")
      pingHeard = pulses.some((q) => {
        const ds = pathDistances(s, q.ox, q.oy, q.range);
        const t = q.source === "forager" ? p : s.forager,
          d = ds[t.ty][t.tx];
        return d <= q.front && d > q.front - C.SONAR_WAVE_SPEED * C.TICK_DT;
      });
    if (blind) {
      if (p.state === "chase")
        p = {
          ...p,
          state: "wander",
          fix: null,
          linger: 0,
          flareIn: C.FLARE_INTERVAL,
        };
    } else if (lightSense || hearing || pingHeard) {
      if (p.state !== "chase" && p.kind !== "lanternjaw")
        p = { ...p, alert: true, alertIn: C.ALERT_TIME };
      p = {
        ...p,
        state: "chase",
        fix: { tx: s.forager.tx, ty: s.forager.ty },
        linger: C.LINGER_TIME,
        ramp: p.state === "chase" ? p.ramp : C.GLOAMFIN_RAMP_TIME,
        flaring: p.kind === "flarefish" ? false : p.flaring,
        flareCharging: p.kind === "flarefish" ? false : p.flareCharging,
        flareRadius: p.kind === "flarefish" ? 0 : p.flareRadius,
      };
    } else if (p.state === "chase" && p.kind !== "gloamfin") {
      p.linger = Math.max(0, p.linger - C.TICK_DT);
      if (p.linger === 0)
        p = { ...p, state: "wander", fix: null, flareIn: C.FLARE_INTERVAL };
    }
    if (p.kind === "gloamfin") {
      if (
        p.state === "chase" &&
        p.fix &&
        p.tx === p.fix.tx &&
        p.ty === p.fix.ty &&
        !hearing
      ) {
        p = {
          ...p,
          state: "search",
          searchIn: C.GLOAMFIN_GIVEUP,
          searchPing: false,
        };
      }
      if (p.state === "search") {
        p.searchIn = Math.max(0, p.searchIn - C.TICK_DT);
        if (p.searchIn === 0) p = { ...p, state: "wander", fix: null };
        if (
          !p.searchPing &&
          p.searchIn <= C.GLOAMFIN_GIVEUP - C.GLOAMFIN_SEARCH_DELAY &&
          p.pingGap === 0 &&
          !hearing
        ) {
          pulses.push({
            source: "gloamfin",
            tint: "orange",
            ox: p.tx,
            oy: p.ty,
            front: 0,
            range: C.GLOAMFIN_PING_RANGE,
          });
          p = {
            ...p,
            searchPing: true,
            pingIn: C.GLOAMFIN_PING_INTERVAL,
            pingGap: C.GLOAMFIN_PING_MIN_GAP,
          };
          emit(C.CUES.predatorPing);
        }
      }
      if (p.pingIn === 0 && p.pingGap === 0 && !hearing) {
        pulses.push({
          source: "gloamfin",
          tint: "violet",
          ox: p.tx,
          oy: p.ty,
          front: 0,
          range: C.GLOAMFIN_PING_RANGE,
        });
        p = {
          ...p,
          pingIn: C.GLOAMFIN_PING_INTERVAL,
          pingGap: C.GLOAMFIN_PING_MIN_GAP,
        };
        emit(C.CUES.predatorPing);
      }
      if (p.state === "chase")
        p.ramp = Math.min(C.GLOAMFIN_RAMP_TIME, p.ramp + C.TICK_DT);
    }
    if (p.kind === "flarefish" && p.state === "wander") {
      if (p.flaring) {
        p.flarePhase -= C.TICK_DT;
        if (p.flarePhase <= 0)
          p = {
            ...p,
            flaring: false,
            flareRadius: 0,
            flareIn: C.FLARE_INTERVAL,
          };
        else if (!blind && distance(p, s.forager) <= C.FLARE_RADIUS) {
          p = {
            ...p,
            state: "chase",
            fix: { tx: s.forager.tx, ty: s.forager.ty },
            alert: true,
            alertIn: C.ALERT_TIME,
            flaring: false,
            flareRadius: 0,
            linger: C.LINGER_TIME,
          };
        }
      } else if (p.flareCharging) {
        p.flarePhase -= C.TICK_DT;
        if (p.flarePhase <= 0) {
          p = {
            ...p,
            flareCharging: false,
            flaring: true,
            flareRadius: C.FLARE_RADIUS,
            flarePhase: C.FLARE_BLOOM,
          };
          emit(C.CUES.flare);
        }
      } else {
        p.flareIn = Math.max(0, p.flareIn - C.TICK_DT);
        if (p.flareIn === 0)
          p = { ...p, flareCharging: true, flarePhase: C.FLARE_CHARGE };
      }
    }
    if (p.travel) {
      let dir: Direction | null;
      if (p.state === "chase" && p.fix) dir = pathDirection(s, p, p.fix, ".");
      else if (
        p.state === "search" &&
        p.fix &&
        Math.abs(p.tx - p.fix.tx) + Math.abs(p.ty - p.fix.ty) >
          C.GLOAMFIN_SEARCH_ROAM
      )
        dir = pathDirection(s, p, p.fix, ".");
      else {
        const pick = chooseDirection({ ...copy(s), randomSeed: seed }, p, ".");
        dir = pick[0];
        seed = pick[1];
      }
      const at = center(p.tx, p.ty),
        onCenter = distance(p, at) < 0.001;
      if (!onCenter && dir !== p.dir && dir !== opposite[p.dir]) dir = p.dir;
      if (
        dir &&
        p.kind === "gloamfin" &&
        p.state === "chase" &&
        onCenter &&
        dir !== p.dir &&
        dir !== opposite[p.dir]
      )
        p.ramp = 0;
      const b = travel(s, p, dir, speed(p), C.TICK_DT, ".");
      p = { ...p, ...b };
    }
    p.speed = speed(p);
    return p;
  });
  return { ...copy(s), predators, pulses, randomSeed: seed };
}
function tick(s: Read<FathomState>, held: boolean, emit: Emit): FathomState {
  let n: FathomState = {
    ...copy(s),
    simTime: s.simTime + C.TICK_DT,
    screenTime: s.screenTime + C.TICK_DT,
  };
  if (s.screen === "countdown") {
    n = lightAndFog(n);
    return n.screenTime >= 2
      ? { ...n, screen: "playing", screenTime: 0, playTime: 0 }
      : n;
  }
  if (s.screen === "cleared")
    return n.screenTime >= 2
      ? {
          ...initial(
            s.images as Record<string, readonly ImageBitmap[]>,
            s.muted,
          ),
          screen: "countdown",
          menuIndex: null,
          depth: s.depth + 1,
          score: s.score,
          lives: s.lives,
          simTime: n.simTime,
          sonar: { ready: true, cooldown: 0, range: range(s.depth + 1) },
          predators: roster(s.depth + 1),
        }
      : n;
  if (s.screen !== "playing") return n;
  n.playTime = s.playTime + C.TICK_DT;
  const hold = Math.max(0, s.brightHold - C.TICK_DT);
  n.brightHold = hold;
  const decayTime = C.TICK_DT - Math.min(C.TICK_DT, s.brightHold);
  n.brightness = s.brightness * Math.pow(0.5, decayTime / C.BRIGHT_HALFLIFE);
  n.visionRadius = vRadius(n.brightness);
  n.windowRadius = wRadius(n.brightness);
  n.sonar = {
    ...s.sonar,
    cooldown: Math.max(0, s.sonar.cooldown - C.TICK_DT),
    ready: s.sonar.cooldown <= C.TICK_DT,
  };
  n.ink = {
    cooldown: Math.max(0, s.ink.cooldown - C.TICK_DT),
    ready: s.ink.cooldown <= C.TICK_DT,
  };
  n.inkClouds = s.inkClouds
    .map((c) => ({ ...c, remaining: c.remaining - C.TICK_DT }))
    .filter((c) => c.remaining > 0);
  if (s.pendingSonar && n.sonar.ready) {
    n.sonar = { ...n.sonar, ready: false, cooldown: C.SONAR_COOLDOWN };
    n.pulses = [
      ...n.pulses,
      {
        source: "forager",
        tint: "cyan",
        ox: n.forager.tx,
        oy: n.forager.ty,
        front: 0,
        range: n.sonar.range,
      },
    ];
    emit(C.CUES.sonar);
  }
  if (s.pendingInk && n.ink.ready) {
    n.ink = { ready: false, cooldown: C.INK_COOLDOWN };
    n.inkClouds = [
      ...n.inkClouds,
      {
        x: n.forager.x,
        y: n.forager.y,
        radius: C.INK_RADIUS,
        remaining: C.INK_LIFE,
      },
    ];
    emit(C.CUES.ink);
  }
  n.pendingSonar = false;
  n.pendingInk = false;
  n.forager = moveForager(n, held);
  if (char(n.plankton, n.forager.tx, n.forager.ty) === "*") {
    n.plankton = changeChar(n.plankton, n.forager.tx, n.forager.ty, "-");
    n.planktonRemaining--;
    n.score += C.SCORE_PLANKTON;
    n.brightness = Math.min(1, n.brightness + C.BRIGHT_PER_EAT);
    n.brightHold = C.BRIGHT_HOLD;
    n.visionRadius = vRadius(n.brightness);
    n.windowRadius = wRadius(n.brightness);
    emit(C.CUES.eat);
    if (n.planktonRemaining === 0) {
      n.score += C.SCORE_CLEAR;
      n.screen = "cleared";
      n.screenTime = 0;
      emit(C.CUES.descend);
    }
  }
  n = advancePulse(n);
  n = movePredators(n, emit);
  let seed = n.randomSeed;
  n.drifters = n.drifters.map((d) => {
    if (!d.mind || !d.travel) return { ...d };
    const at = center(d.tx, d.ty),
      onCenter = distance(d, at) < 0.001;
    const picked = onCenter
      ? chooseDirection({ ...n, randomSeed: seed }, d, ".")
      : ([d.dir, seed] as [Direction, number]);
    seed = picked[1];
    const b = travel(n, d, picked[0], C.DRIFTER_SPEED, C.TICK_DT, ".");
    return { ...d, ...b };
  });
  n.randomSeed = seed;
  n.drifters = n.drifters.filter((d) => {
    if (d.tx === n.forager.tx && d.ty === n.forager.ty) {
      n.score += C.SCORE_DRIFTER;
      return false;
    }
    return true;
  });
  n.drifterIn = Math.max(0, n.drifterIn - C.TICK_DT);
  if (
    n.drifterIn === 0 &&
    n.planktonRemaining > 0 &&
    n.drifters.length < C.DRIFTER_MAX
  ) {
    const gate = n.tiles.findIndex((row) => row.includes("g"));
    if (gate >= 0) {
      const gx = n.tiles[gate].indexOf("g");
      const near = DIRS.map((d) => neighbor(n, gx, gate, d, ".")).find(Boolean);
      if (near)
        n.drifters = [
          ...n.drifters,
          {
            ...center(near.tx, near.ty),
            ...near,
            dir: "up",
            lit: false,
            mind: true,
            travel: true,
          },
        ];
    }
    n.drifterIn = C.DRIFTER_INTERVAL;
  }
  n = lightAndFog(n);
  if (
    n.screen === "playing" &&
    n.predators.some(
      (p) =>
        p.state !== "den" && p.tx === n.forager.tx && p.ty === n.forager.ty,
    )
  ) {
    emit(C.CUES.caught);
    if (n.lives === 0)
      n = { ...n, screen: "gameover", menuIndex: 0, screenTime: 0 };
    else
      n = {
        ...n,
        lives: n.lives - 1,
        screen: "countdown",
        screenTime: 0,
        playTime: 0,
        forager: {
          ...center(mazeStart.tx, mazeStart.ty),
          ...mazeStart,
          dir: "left",
          moving: false,
        },
        brightness: 0,
        brightHold: 0,
        visionRadius: vRadius(0),
        windowRadius: wRadius(0),
        predators: roster(n.depth),
        drifters: [],
        drifterIn: C.DRIFTER_INTERVAL,
        pulses: [],
        inkClouds: [],
        sonar: { ready: true, cooldown: 0, range: range(n.depth) },
        ink: { ready: true, cooldown: 0 },
      };
  }
  return n;
}
function startDive(s: Read<FathomState>): FathomState {
  return {
    ...initial(s.images as Record<string, readonly ImageBitmap[]>, s.muted),
    screen: "countdown",
    menuIndex: null,
    simTime: s.simTime,
  };
}
function toTitle(s: Read<FathomState>): FathomState {
  return {
    ...initial(s.images as Record<string, readonly ImageBitmap[]>, s.muted),
    titleIndex: s.titleIndex,
    menuIndex: s.titleIndex,
    simTime: s.simTime,
  };
}
function confirm(s: Read<FathomState>): FathomState {
  if (s.screen === "howto") return toTitle(s);
  if (s.screen === "title") {
    const index = s.menuIndex ?? 0;
    if (index === 0) return { ...startDive(s), titleIndex: index };
    return { ...copy(s), titleIndex: index, screen: "howto", menuIndex: null };
  }
  if (s.screen === "paused") {
    if (s.menuIndex === 0)
      return { ...copy(s), screen: "playing", menuIndex: null };
    if (s.menuIndex === 1) return startDive(s);
    return toTitle(s);
  }
  if (s.screen === "gameover")
    return s.menuIndex === 0 ? startDive(s) : toTitle(s);
  return copy(s);
}
function inputUpdate(s: Read<FathomState>, api: UpdateApi): FathomState {
  let n = copy(s);
  if (api.input.pressed("mute")) api.audio.setMuted(!api.audio.muted());
  const screen = s.screen;
  if (screen === "playing") {
    if (api.input.pressed("pause"))
      return {
        ...n,
        screen: "paused",
        menuIndex: 0,
        pendingSonar: false,
        pendingInk: false,
        muted: api.audio.muted(),
      };
    if (api.input.pressed("a")) n = { ...n, pendingSonar: true };
    if (api.input.pressed("b")) n = { ...n, pendingInk: true };
    for (const dir of DIRS)
      if (api.input.value(dir) > 0) n = { ...n, desired: dir };
  } else if (screen === "paused") {
    if (api.input.pressed("pause") || api.input.pressed("back"))
      return {
        ...n,
        screen: "playing",
        menuIndex: null,
        muted: api.audio.muted(),
      };
  } else if (screen === "howto") {
    if (api.input.pressed("confirm") || api.input.pressed("back"))
      return { ...toTitle(n), muted: api.audio.muted() };
  } else if (screen === "gameover") {
    if (api.input.pressed("back"))
      return { ...toTitle(n), muted: api.audio.muted() };
  } else if (screen === "title") api.input.pressed("back");
  if (menuItems(screen).length) {
    if (api.input.pressed("up"))
      n = {
        ...n,
        menuIndex:
          ((n.menuIndex ?? 0) - 1 + menuItems(screen).length) %
          menuItems(screen).length,
      };
    if (api.input.pressed("down"))
      n = {
        ...n,
        menuIndex: ((n.menuIndex ?? 0) + 1) % menuItems(screen).length,
      };
  }
  for (const sample of api.input.pointerSamples()) {
    if (!sample.primary) continue;
    if (sample.type !== "move" && sample.button !== "primary") continue;
    const item = menuItems(screen).findIndex((_, i) =>
      inside(rect(screen, i), sample.x, sample.y),
    );
    if (item >= 0) n = { ...n, menuIndex: item };
    if (sample.type === "down")
      n = { ...n, pointerDown: { id: sample.id, item } };
    if (sample.type === "up") {
      if (n.pointerDown?.id === sample.id && n.pointerDown.item === item) {
        if (screen === "howto")
          return { ...toTitle(n), pointerDown: null, muted: api.audio.muted() };
        if (item >= 0)
          return {
            ...confirm({ ...n, menuIndex: item }),
            pointerDown: null,
            muted: api.audio.muted(),
          };
      }
      n = { ...n, pointerDown: null };
    }
  }
  if (
    (screen === "title" || screen === "paused" || screen === "gameover") &&
    api.input.pressed("confirm")
  )
    n = confirm(n);
  return { ...n, muted: api.audio.muted() };
}
function inside(r: Rect | null, x: number, y: number): boolean {
  return !!r && x >= r.x && y >= r.y && x < r.x + r.w && y < r.y + r.h;
}
function drawText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  size: number,
  color: string,
  align: CanvasTextAlign = "left",
  weight = "400",
) {
  ctx.font = `${weight} ${size}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
  ctx.textAlign = align;
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
}
function drawSprite(
  ctx: CanvasRenderingContext2D,
  s: Read<FathomState>,
  sheet: string,
  frame: number,
  x: number,
  y: number,
  w = C.TILE,
  h = C.TILE,
) {
  const img = s.images[sheet]?.[frame];
  if (img) {
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(img, x - w / 2, y - h / 2, w, h);
  }
}
const facing: Record<Direction, number> = { down: 0, up: 2, left: 4, right: 6 };
function drawGlow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  color: string,
) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, color);
  g.addColorStop(1, "transparent");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}
function drawAmber(ctx: CanvasRenderingContext2D, x: number, y: number) {
  drawGlow(ctx, x, y, 24, "rgba(255,126,51,.45)");
  ctx.fillStyle = "#ffba75";
  ctx.beginPath();
  ctx.arc(x, y, 3.5, 0, Math.PI * 2);
  ctx.fill();
}
function tileFrame(s: Read<FathomState>, tx: number, ty: number): number {
  const kind = char(s.tiles, tx, ty);
  if (kind === "g") return 18;
  if (kind !== "#") return 16;
  let bits = 0;
  for (const [d, bit] of [
    ["up", 1],
    ["right", 2],
    ["down", 4],
    ["left", 8],
  ] as const) {
    const [dx, dy] = delta[d];
    if (char(s.tiles, tx + dx, ty + dy) === "#") bits += bit;
  }
  return bits;
}
function drawTile(
  ctx: CanvasRenderingContext2D,
  s: Read<FathomState>,
  tx: number,
  ty: number,
  vis: string,
) {
  const { x, y } = center(tx, ty);
  if (vis === "u") drawSprite(ctx, s, "trench-walls", 17, x, y);
  else {
    drawSprite(ctx, s, "trench-walls", tileFrame(s, tx, ty), x, y);
    if (vis === "l") {
      ctx.fillStyle =
        char(s.tiles, tx, ty) === "#"
          ? "rgba(67,134,149,.22)"
          : "rgba(19,83,104,.25)";
      ctx.fillRect(x - 16, y - 16, 32, 32);
    }
    if (vis === "r") {
      ctx.fillStyle = "rgba(2,9,19,.69)";
      ctx.fillRect(x - 16, y - 16, 32, 32);
    }
    if (char(s.plankton, tx, ty) === "*") {
      ctx.fillStyle = vis === "l" ? "#b7fff1" : "#387878";
      if (vis === "l") drawGlow(ctx, x, y, 11, "rgba(77,255,222,.38)");
      ctx.beginPath();
      ctx.arc(x, y, C.PLANKTON_DOT / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
function drawMaze(ctx: CanvasRenderingContext2D, s: Read<FathomState>) {
  ctx.fillStyle = "#02070e";
  ctx.fillRect(
    C.GRID_ORIGIN_X,
    C.GRID_ORIGIN_Y,
    C.GRID_COLS * C.TILE,
    C.GRID_ROWS * C.TILE,
  );
  ctx.save();
  ctx.beginPath();
  ctx.arc(s.forager.x, s.forager.y, s.windowRadius, 0, Math.PI * 2);
  ctx.clip();
  drawGlow(
    ctx,
    s.forager.x,
    s.forager.y,
    s.windowRadius,
    "rgba(20,95,119,.13)",
  );
  for (let y = 0; y < C.GRID_ROWS; y++)
    for (let x = 0; x < C.GRID_COLS; x++)
      drawTile(ctx, s, x, y, char(s.visibility, x, y));
  for (const c of s.inkClouds) {
    drawGlow(ctx, c.x, c.y, c.radius, "rgba(1,2,12,.94)");
    ctx.fillStyle = "rgba(1,2,12,.4)";
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.radius * 0.68, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
  for (const p of s.predators)
    if (p.flaring && p.state !== "den") {
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      drawGlow(ctx, p.x, p.y, C.FLARE_RADIUS, "rgba(255,121,47,.25)");
      drawSprite(
        ctx,
        s,
        "flare-bloom",
        3 + Math.min(2, Math.floor((1 - p.flarePhase / C.FLARE_BLOOM) * 3)),
        p.x,
        p.y,
        C.FLARE_RADIUS * 2,
        C.FLARE_RADIUS * 2,
      );
      ctx.restore();
      ctx.save();
      ctx.beginPath();
      ctx.arc(p.x, p.y, C.FLARE_RADIUS, 0, Math.PI * 2);
      ctx.clip();
      for (let ty = 0; ty < C.GRID_ROWS; ty++)
        for (let tx = 0; tx < C.GRID_COLS; tx++)
          if (distance(center(tx, ty), p) <= C.FLARE_RADIUS)
            drawTile(ctx, s, tx, ty, "l");
      ctx.restore();
    }
  for (const d of s.drifters)
    if (d.lit)
      drawSprite(ctx, s, "drifter", Math.floor(s.simTime * 8) % 8, d.x, d.y);
  ctx.save();
  ctx.beginPath();
  ctx.arc(s.forager.x, s.forager.y, s.windowRadius, 0, Math.PI * 2);
  ctx.clip();
  for (const d of s.drifters) drawAmber(ctx, d.x, d.y);
  for (const p of s.predators)
    if (p.kind === "lanternjaw" && p.state !== "den") drawAmber(ctx, p.x, p.y);
  ctx.restore();
  for (const p of s.predators) {
    if (p.flareCharging && p.state !== "den")
      drawSprite(
        ctx,
        s,
        "flare-bloom",
        Math.min(2, Math.floor((1 - p.flarePhase / C.FLARE_CHARGE) * 3)),
        p.x,
        p.y,
        70,
        70,
      );
    if (p.lit) {
      const frame =
        p.kind === "lanternjaw" && p.state !== "chase"
          ? 8 + (Math.floor(s.simTime * 8) % 8)
          : facing[p.dir] + (Math.floor(s.simTime * 7) % 2);
      drawSprite(ctx, s, p.kind, frame, p.x, p.y);
    }
    if (p.alert) {
      drawGlow(
        ctx,
        p.x,
        p.y,
        45,
        p.kind === "gloamfin" ? "rgba(183,95,255,.4)" : "rgba(255,96,65,.43)",
      );
      ctx.strokeStyle = p.kind === "gloamfin" ? "#bd82ff" : "#ff8660";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(
        p.x,
        p.y,
        18 + 22 * (1 - p.alertIn / C.ALERT_TIME),
        0,
        Math.PI * 2,
      );
      ctx.stroke();
    }
  }
  for (const q of s.pulses) {
    const ds = pathDistances(s, q.ox, q.oy, q.range);
    const color =
      q.tint === "cyan"
        ? "#62f8f3"
        : q.tint === "violet"
          ? "#b78bff"
          : "#ff9d5a";
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.shadowColor = color;
    ctx.shadowBlur = 14;
    for (let ty = 0; ty < C.GRID_ROWS; ty++)
      for (let tx = 0; tx < C.GRID_COLS; tx++) {
        const d = ds[ty][tx];
        if (Math.abs(d - q.front) < 0.45) {
          const c = center(tx, ty);
          ctx.strokeRect(c.x - 13, c.y - 13, 26, 26);
        }
      }
    ctx.shadowBlur = 0;
  }
  drawGlow(
    ctx,
    s.forager.x,
    s.forager.y,
    55 + 28 * s.brightness,
    "rgba(70,250,231,.35)",
  );
  drawSprite(
    ctx,
    s,
    "glimmerfin",
    facing[s.forager.dir] +
      (s.forager.moving ? Math.floor(s.simTime * 9) % 2 : 0),
    s.forager.x,
    s.forager.y,
  );
  const grad = ctx.createRadialGradient(
    s.forager.x,
    s.forager.y,
    s.windowRadius - 35,
    s.forager.x,
    s.forager.y,
    s.windowRadius,
  );
  grad.addColorStop(0, "transparent");
  grad.addColorStop(1, "rgba(2,7,14,.92)");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(s.forager.x, s.forager.y, s.windowRadius, 0, Math.PI * 2);
  ctx.fill();
}
function gauge(
  ctx: CanvasRenderingContext2D,
  label: string,
  x: number,
  y: number,
  value: number,
  color: string,
) {
  drawText(ctx, label, x, y, 14, "#88aebd");
  ctx.fillStyle = "#183341";
  ctx.fillRect(x + 170, y - 13, 100, 10);
  ctx.fillStyle = color;
  ctx.fillRect(x + 170, y - 13, 100 * Math.max(0, Math.min(1, value)), 10);
}
function hud(ctx: CanvasRenderingContext2D, s: Read<FathomState>) {
  ctx.fillStyle = "#071822";
  ctx.fillRect(0, 0, C.STAGE_W, 80);
  ctx.fillRect(0, 656, C.STAGE_W, 64);
  ctx.strokeStyle = "#1a5e70";
  ctx.beginPath();
  ctx.moveTo(64, 79);
  ctx.lineTo(1216, 79);
  ctx.moveTo(64, 656);
  ctx.lineTo(1216, 656);
  ctx.stroke();
  drawText(ctx, C.DIVE_LABEL, 64, 27, 14, "#5d9da7");
  drawText(
    ctx,
    String(s.score).padStart(6, "0"),
    64,
    66,
    45,
    "#e5fff4",
    "left",
    "700",
  );
  drawText(
    ctx,
    "PLANKTON  " + s.planktonRemaining,
    1216,
    39,
    18,
    "#9ac9c8",
    "right",
  );
  for (let i = 0; i < s.lives; i++)
    drawSprite(ctx, s, "glimmerfin", 0, 78 + i * 31, 685, 25, 25);
  drawText(ctx, `DEPTH ${s.depth}`, 250, 697, 19, "#d0e9e7");
  gauge(
    ctx,
    "SONAR  [SPACE]",
    510,
    694,
    1 - s.sonar.cooldown / C.SONAR_COOLDOWN,
    "#52e6e7",
  );
  gauge(
    ctx,
    "INK  [SHIFT]",
    825,
    694,
    1 - s.ink.cooldown / C.INK_COOLDOWN,
    "#9d8bbd",
  );
}
function screenPanel(ctx: CanvasRenderingContext2D, s: Read<FathomState>) {
  if (s.screen === "title") {
    drawText(ctx, C.TITLE_TEXT, 640, 225, 98, "#d8fff1", "center", "700");
    drawText(ctx, C.TAGLINE_TEXT, 640, 269, 22, "#7ccac5", "center");
    drawText(
      ctx,
      "✦  A BIOLUMINESCENT MAZE CHASE  ✦",
      640,
      316,
      15,
      "#67959d",
      "center",
    );
  } else if (s.screen === "howto") {
    drawText(ctx, "HOW TO PLAY", 640, 138, 47, "#d9fff2", "center", "700");
    const lines = [
      "SWIM THE DARK. EAT EVERY PLANKTON TO DESCEND.",
      "WASD / ARROWS   SWIM THROUGH THE CORRIDORS",
      "SPACE           PULSE SONAR TO REVEAL THE MAZE",
      "SHIFT           RELEASE INK TO BLIND LIGHT HUNTERS",
      "ESC / P         PAUSE THE DIVE      M   MUTE",
      "LANTERNJAW  hunts your glow. Its amber bulb mimics a drifter.",
      "GLOAMFIN    hunts sound. Your pulse can give you away.",
      "FLAREFISH   lights the abyss, then races toward what it sees.",
      "Your light shows nearby rock. Sonar remembers distant passages.",
      "Outside your growing vision circle, explored ground stays dark.",
      "ENTER / SPACE / CLICK   RETURN TO MENU",
    ];
    lines.forEach((line, i) =>
      drawText(
        ctx,
        line,
        640,
        200 + i * 38,
        i > 4 && i < 10 ? 18 : 20,
        i === 10 ? "#7ce7df" : "#bedcdb",
        "center",
      ),
    );
  } else if (s.screen === "gameover") {
    drawText(
      ctx,
      "LOST IN THE ABYSS",
      640,
      242,
      53,
      "#f8bfa9",
      "center",
      "700",
    );
    drawText(
      ctx,
      `SCORE  ${s.score}     DEPTH  ${s.depth}`,
      640,
      314,
      25,
      "#b6dcd6",
      "center",
    );
  } else if (s.screen === "paused") {
    ctx.fillStyle = "rgba(2,8,16,.79)";
    ctx.fillRect(0, 80, C.STAGE_W, 576);
    drawText(ctx, "PAUSED", 640, 248, 57, "#e2fff2", "center", "700");
  } else if (s.screen === "countdown") {
    ctx.fillStyle = "rgba(3,10,17,.32)";
    ctx.fillRect(0, 80, C.STAGE_W, 576);
    drawText(ctx, "DIVE", 640, 315, 70, "#dffff5", "center", "700");
    drawText(
      ctx,
      String(Math.max(1, Math.ceil(2 - s.screenTime))),
      640,
      384,
      49,
      "#72eae1",
      "center",
    );
  } else if (s.screen === "cleared") {
    ctx.fillStyle = "rgba(3,10,17,.53)";
    ctx.fillRect(0, 80, C.STAGE_W, 576);
    drawText(
      ctx,
      `DEPTH ${s.depth} CLEARED`,
      640,
      352,
      55,
      "#dffff5",
      "center",
      "700",
    );
  }
  const items = menuItems(s.screen);
  items.forEach((item, i) => {
    const r = rect(s.screen, i);
    if (!r) return;
    const chosen = i === s.menuIndex;
    ctx.fillStyle = chosen ? "#164253" : "#0a202a";
    ctx.fillRect(r.x, r.y, r.w, r.h);
    ctx.strokeStyle = chosen ? "#69e8e0" : "#285260";
    ctx.strokeRect(r.x, r.y, r.w, r.h);
    drawText(
      ctx,
      (chosen ? "▸ " : "  ") + item,
      640,
      r.y + 32,
      22,
      chosen ? "#e8fff7" : "#95b8ba",
      "center",
      chosen ? "700" : "400",
    );
  });
}
export const game: Game<FathomState, FathomDebugApi> = {
  async initialize(api: InitApi<FathomState>) {
    for (const action of C.ACTIONS)
      api.input.register(action, { keys: [...C.BINDINGS[action]] });
    const tones: Record<C.CueName, [number, number, number, string]> = {
      [C.CUES.eat]: [770, 1190, 92, "sine"],
      [C.CUES.sonar]: [260, 700, 330, "sine"],
      [C.CUES.ink]: [160, 76, 260, "triangle"],
      [C.CUES.predatorPing]: [320, 520, 240, "triangle"],
      [C.CUES.flare]: [130, 800, 390, "sawtooth"],
      [C.CUES.caught]: [460, 90, 520, "sawtooth"],
      [C.CUES.descend]: [430, 860, 680, "sine"],
    };
    for (const cue of Object.values(C.CUES)) {
      const [freq, freqTo, durationMs, wave] = tones[cue];
      api.audio.define(cue, {
        freq,
        freqTo,
        durationMs,
        wave: wave as "sine" | "triangle" | "sawtooth",
        gain: 0.13,
      });
    }
    const sheets: Record<string, number> = {
      glimmerfin: 8,
      lanternjaw: 16,
      gloamfin: 8,
      flarefish: 8,
      drifter: 8,
      "flare-bloom": 8,
      "trench-walls": 19,
    };
    const images: Record<string, ImageBitmap[]> = {};
    await Promise.all(
      Object.entries(sheets).map(async ([sheet, length]) => {
        images[sheet] = await Promise.all(
          Array.from({ length }, (_, i) =>
            api.assets.loadImage(`${sheet}/${i}.png`),
          ),
        );
      }),
    );
    const fields: [
      string,
      (s: Read<FathomState>) => string | number | boolean,
    ][] = [
      ["screen", (s) => s.screen],
      ["depth", (s) => s.depth],
      ["score", (s) => s.score],
      ["lives", (s) => s.lives],
      ["G", (s) => s.brightness],
      ["V", (s) => s.visionRadius],
      ["R", (s) => s.windowRadius],
      ["sonar", (s) => s.sonar.cooldown],
      ["ink", (s) => s.ink.cooldown],
      ["plankton", (s) => s.planktonRemaining],
      ["forager", (s) => `${s.forager.tx},${s.forager.ty} ${s.forager.dir}`],
    ];
    fields.forEach(([name, source]) => api.diagnostics.register(name, source));
    for (let i = 0; i < 6; i++)
      api.diagnostics.register(`predator ${i}`, (s) => {
        const p = s.predators[i];
        return p
          ? `${p.kind} ${p.state} ${p.tx},${p.ty} ${p.speed.toFixed(0)} alert:${p.alert}`
          : "-";
      });
    return [initial(images), debug];
  },
  update(state, api, dt) {
    let n = inputUpdate(state, api);
    const total = n.accumulator + Math.max(0, dt);
    const ticks = Math.floor((total + 1e-10) / C.TICK_DT);
    n = { ...n, accumulator: total - ticks * C.TICK_DT };
    const held = C.ACTIONS.slice(0, 4).some(
      (action) => api.input.value(action) > 0,
    );
    for (let i = 0; i < ticks; i++) {
      const emitSet = new Set<C.CueName>();
      n = tick(n, held, (cue) => emitSet.add(cue));
      for (const cue of emitSet) api.audio.play(cue);
    }
    return { ...n, muted: api.audio.muted() };
  },
  render(s, api) {
    const ctx = api.ctx;
    ctx.fillStyle = BACKGROUND;
    ctx.fillRect(0, 0, C.STAGE_W, C.STAGE_H);
    if (
      s.screen === "title" ||
      s.screen === "howto" ||
      s.screen === "gameover"
    ) {
      drawGlow(ctx, 640, 365, 365, "rgba(23,105,116,.19)");
      ctx.strokeStyle = "#174453";
      ctx.strokeRect(64, 80, 1152, 576);
    } else {
      drawMaze(ctx, s);
      hud(ctx, s);
    }
    screenPanel(ctx, s);
  },
};
