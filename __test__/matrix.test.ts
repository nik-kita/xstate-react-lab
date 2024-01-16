import { assertEquals } from "https://deno.land/std@0.211.0/assert/assert_equals.ts";
import { Matrix } from "../src/game/matrix.ts";
import { Tetromino } from "../src/game/tetromino.ts";

Deno.test("new Matrix one", () => {
  const m = new Matrix({ cols: 2, rows: 3 });
  assertEquals(m._bottom.length, 2);
  assertEquals(m._bottom.includes(0), false);
  assertEquals(m._bottom.includes(3), false);
  assertEquals(m._bottom.includes(6), true);
});

Deno.test("Matrix.detect_bottom one", () => {
  const m = new Matrix({ cols: 2, rows: 4 });
  const t = new Tetromino({
    shape: [
      [true, true],
      [true, true],
    ],
  });
  const tb = t.clone();
  const bottom_res = m.place_tetromino(tb, { start_position: 4 });
  const upper_res = m.place_tetromino(t, { start_position: 0 });
  if (!upper_res.ok || !bottom_res.ok) {
    assertEquals("not to be", "here");
    return;
  }
  assertEquals(m.detect_bottom().at(-1), bottom_res.tetromino_id);
  assertEquals(m.detect_bottom().length, 1);
});

Deno.test("Matrix.place_tetromino one", () => {
  const m = new Matrix({ cols: 4, rows: 3 });
  const t = new Tetromino({
    shape: [
      [true, true],
      [false, true],
    ],
  });
  const happy = m.place_tetromino(t);
  assertEquals(happy.ok, true);
  assertEquals(m.place_tetromino(t).ok, false);
  if (happy.ok) {
    assertEquals(m.rm_tetromino(happy.tetromino_id).ok, true);
  } else {
    assertEquals("not to be", "here");
  }
  assertEquals(m.place_tetromino(t).ok, true);
});

Deno.test("Matrix.place_tetromino two", () => {
  const m = new Matrix({ cols: 4, rows: 3 });
  const t = new Tetromino({
    shape: [
      [true, true],
      [false, true],
    ],
  });
  assertEquals(m.place_tetromino(t).ok, true);
  assertEquals(m.place_tetromino(t, { start_position: 2 }).ok, false);
  assertEquals(m.place_tetromino(t.clone(), { start_position: 2 }).ok, true);
});

Deno.test("Matrix.move_tetromino one", () => {
  const m = new Matrix({ cols: 4, rows: 3 });
  const t = new Tetromino({
    shape: [
      [true, true],
      [false, true],
    ],
  });
  const res = m.place_tetromino(t);
  const res2 = m.place_tetromino(t.clone(), { start_position: 4 });
  assertEquals(res2.ok, false);
  if (res.ok) {
    m.move_tetromino(res.tetromino_id, { type: "right" });
    const move_res = m.move_tetromino(res.tetromino_id, { type: "right" });
    assertEquals(move_res.ok, true);
  } else {
    assertEquals("not to be", "here");
  }
  const res3 = m.place_tetromino(t.clone(), { start_position: 4 });
  assertEquals(res3.ok, true);
});
