import { createCanvas } from "@napi-rs/canvas";
import { ConstantClock, createEngine } from "@clockwyrks/simple-2d";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { GRID_COLS, GRID_ROWS, START_LIVES, TICK_DT } from "./constants";
import { BACKGROUND, game } from "./game";

const events = new EventTarget();
const canvas = createCanvas(1280, 720) as unknown as HTMLCanvasElement;
const engine = createEngine({
  canvas,
  width: 1280,
  height: 720,
  game,
  background: BACKGROUND,
  clock: new ConstantClock(1000 / 120),
  surface: {
    cssWidth: () => 1280,
    cssHeight: () => 720,
    dpr: () => 1,
    events: () => events,
  },
});

beforeAll(async () => {
  vi.stubGlobal("fetch", async () => new Response(new Blob(), { status: 200 }));
  vi.stubGlobal("createImageBitmap", async () => createCanvas(32, 32));
  await engine.initialize();
});

afterAll(() => {
  engine.destroy();
  vi.unstubAllGlobals();
});

describe("Fathom simulation", () => {
  it("opens with a complete maze, roster, and unread fog", () => {
    const s = engine.debug.snapshot(engine.state);
    expect(s.screen).toBe("title");
    expect(s.lives).toBe(START_LIVES);
    expect(s.tiles).toHaveLength(GRID_ROWS);
    expect(s.tiles.every((row) => row.length === GRID_COLS)).toBe(true);
    expect(s.visibility.every((row) => /^u+$/.test(row))).toBe(true);
    expect(s.predators.map((p) => p.kind)).toEqual([
      "lanternjaw",
      "gloamfin",
      "flarefish",
    ]);
    expect(s.planktonRemaining).toBeGreaterThan(200);
  });

  it("lays out connected, one tile wide corridors with no dead ends", () => {
    const { tiles } = engine.debug.snapshot(engine.state);
    const open: [number, number][] = [];
    const neighbors = (x: number, y: number) =>
      [
        [x - 1, y],
        [x + 1, y],
        [x, y - 1],
        [x, y + 1],
        ...(y === 11 && x === 0 ? [[GRID_COLS - 1, y]] : []),
        ...(y === 11 && x === GRID_COLS - 1 ? [[0, y]] : []),
      ].filter(([nx, ny]) => tiles[ny]?.[nx] === ".");
    for (let y = 0; y < GRID_ROWS; y++)
      for (let x = 0; x < GRID_COLS; x++) {
        if (tiles[y][x] !== ".") continue;
        open.push([x, y]);
        expect(
          neighbors(x, y).length,
          `dead end ${x},${y}`,
        ).toBeGreaterThanOrEqual(2);
        if (x < GRID_COLS - 1 && y < GRID_ROWS - 1)
          expect(
            tiles[y][x + 1] === "." &&
              tiles[y + 1][x] === "." &&
              tiles[y + 1][x + 1] === ".",
          ).toBe(false);
      }
    expect(
      open.length / ((GRID_COLS - 2) * (GRID_ROWS - 2)),
    ).toBeGreaterThanOrEqual(0.4);
    const found = new Set<string>();
    const queue = [open[0]];
    for (let head = 0; head < queue.length; head++) {
      const [x, y] = queue[head];
      const key = `${x},${y}`;
      if (found.has(key)) continue;
      found.add(key);
      for (const [nx, ny] of neighbors(x, y)) queue.push([nx, ny]);
    }
    expect(found.size).toBe(open.length);
    const degree = (x: number, y: number) => neighbors(x, y).length;
    const openness =
      open.reduce((sum, [x, y]) => sum + degree(x, y), 0) / open.length;
    expect(openness).toBeGreaterThanOrEqual(2);
    expect(openness).toBeLessThanOrEqual(2.8);
    const runSeen = new Set<string>();
    const runs: number[] = [];
    for (const [x, y] of open) {
      const start = `${x},${y}`;
      if (degree(x, y) !== 2 || runSeen.has(start)) continue;
      const pending: [number, number][] = [[x, y]];
      let length = 0;
      while (pending.length) {
        const [cx, cy] = pending.pop()!;
        const key = `${cx},${cy}`;
        if (runSeen.has(key) || degree(cx, cy) !== 2) continue;
        runSeen.add(key);
        length++;
        for (const [nx, ny] of neighbors(cx, cy)) pending.push([nx, ny]);
      }
      runs.push(length);
    }
    const meanRun = runs.reduce((sum, length) => sum + length, 0) / runs.length;
    expect(meanRun).toBeGreaterThanOrEqual(2);
    expect(meanRun).toBeLessThanOrEqual(8);
  });

  it("advances fixed ticks and lights nearby rock without revealing the whole maze", async () => {
    const remaining = engine.state.planktonRemaining;
    engine.apply((s) => engine.debug.setScreen(s, "playing"));
    engine.apply((s) => engine.debug.clearPredators(s));
    await engine.advance(1);
    const s = engine.debug.snapshot(engine.state);
    expect(s.simTime).toBeCloseTo(TICK_DT);
    expect(s.visibility.some((row) => row.includes("l"))).toBe(true);
    expect(s.visibility.some((row) => row.includes("u"))).toBe(true);
    expect(s.planktonRemaining).toBe(remaining - 1);
  });

  it("keeps poses pure and derives radii and sonar range", () => {
    const before = engine.debug.snapshot(engine.state);
    engine.apply((s) => engine.debug.setBrightness(s, 1));
    engine.apply((s) => engine.debug.setDepth(s, 4));
    const after = engine.debug.snapshot(engine.state);
    expect(after.visionRadius).toBe(160);
    expect(after.windowRadius).toBe(320);
    expect(after.sonar.range).toBe(6);
    expect(after.predators).toHaveLength(6);
    expect(before.depth).toBe(1);
  });

  it("honors an empty posed board and resets to title values", () => {
    engine.apply((s) => engine.debug.clearPlankton(s));
    expect(engine.debug.snapshot(engine.state).planktonRemaining).toBe(0);
    engine.apply((s) => engine.debug.reset(s));
    const s = engine.debug.snapshot(engine.state);
    expect(s.screen).toBe("title");
    expect(s.depth).toBe(1);
    expect(s.simTime).toBe(0);
    expect(s.planktonRemaining).toBeGreaterThan(200);
  });

  it("remembers revealed ground after it leaves the vision circle", async () => {
    engine.apply((s) => engine.debug.reset(s));
    engine.apply((s) => engine.debug.clearPredators(s));
    engine.apply((s) => engine.debug.setScreen(s, "playing"));
    await engine.advance(1);
    expect(engine.state.visibility[15][17]).toBe("l");
    engine.apply((s) => engine.debug.setForagerTile(s, 1, 1));
    await engine.advance(1);
    expect(engine.state.visibility[15][17]).toBe("r");
    expect(engine.state.windowRadius).toBeLessThan(800);
  });

  it("moves through a vertical connector from a held engine action", async () => {
    engine.apply((s) => engine.debug.reset(s));
    engine.apply((s) => engine.debug.clearPredators(s));
    engine.apply((s) => engine.debug.clearPlankton(s));
    engine.apply((s) => engine.debug.setForagerTile(s, 21, 15));
    engine.apply((s) => engine.debug.setScreen(s, "playing"));
    const key = new Event("keydown") as KeyboardEvent;
    Object.defineProperty(key, "code", { value: "ArrowUp" });
    events.dispatchEvent(key);
    await engine.advance(60);
    expect(engine.state.forager.y).toBeLessThan(560);
    const release = new Event("keyup") as KeyboardEvent;
    Object.defineProperty(release, "code", { value: "ArrowUp" });
    events.dispatchEvent(release);
  });

  it("sends a sonar front along corridors and creates an ink cloud", async () => {
    engine.apply((s) => engine.debug.reset(s));
    engine.apply((s) => engine.debug.clearPredators(s));
    engine.apply((s) => engine.debug.clearPlankton(s));
    engine.apply((s) => engine.debug.setScreen(s, "playing"));
    const pulse = new Event("keydown") as KeyboardEvent;
    Object.defineProperty(pulse, "code", { value: "Space" });
    events.dispatchEvent(pulse);
    await engine.advance(1);
    expect(engine.state.pulses[0]?.tint).toBe("cyan");
    expect(engine.state.sonar.ready).toBe(false);
    const pulseUp = new Event("keyup") as KeyboardEvent;
    Object.defineProperty(pulseUp, "code", { value: "Space" });
    events.dispatchEvent(pulseUp);
    await engine.advance(50);
    expect(engine.state.visibility[15][22]).toBe("l");
    const ink = new Event("keydown") as KeyboardEvent;
    Object.defineProperty(ink, "code", { value: "ShiftLeft" });
    events.dispatchEvent(ink);
    await engine.advance(1);
    expect(engine.state.inkClouds).toHaveLength(1);
    expect(engine.state.ink.ready).toBe(false);
    const inkUp = new Event("keyup") as KeyboardEvent;
    Object.defineProperty(inkUp, "code", { value: "ShiftLeft" });
    events.dispatchEvent(inkUp);
  });

  it("costs one reserve life on contact and resets the attempt", async () => {
    engine.apply((s) => engine.debug.reset(s));
    engine.apply((s) => engine.debug.clearPredators(s));
    engine.apply((s) => engine.debug.addPredator(s, "lanternjaw", 17, 15));
    engine.apply((s) => engine.debug.setPredatorMind(s, 0, false));
    engine.apply((s) => engine.debug.setScreen(s, "playing"));
    await engine.advance(1);
    expect(engine.state.lives).toBe(START_LIVES - 1);
    expect(engine.state.screen).toBe("countdown");
    expect(engine.state.predators.every((p) => !p.released)).toBe(true);
  });

  it("lets ink break a Lanternjaw's light fix", async () => {
    engine.apply((s) => engine.debug.reset(s));
    engine.apply((s) => engine.debug.clearPredators(s));
    engine.apply((s) => engine.debug.clearPlankton(s));
    engine.apply((s) => engine.debug.setForagerTile(s, 10, 15));
    engine.apply((s) => engine.debug.addPredator(s, "lanternjaw", 13, 15));
    engine.apply((s) => engine.debug.setPredatorTravel(s, 0, false));
    engine.apply((s) => engine.debug.setScreen(s, "playing"));
    await engine.advance(1);
    expect(engine.state.predators[0].state).toBe("chase");
    const ink = new Event("keydown") as KeyboardEvent;
    Object.defineProperty(ink, "code", { value: "ShiftLeft" });
    events.dispatchEvent(ink);
    await engine.advance(1);
    expect(engine.state.predators[0].state).toBe("wander");
    const inkUp = new Event("keyup") as KeyboardEvent;
    Object.defineProperty(inkUp, "code", { value: "ShiftLeft" });
    events.dispatchEvent(inkUp);
  });
});
