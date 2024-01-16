import { assertEquals } from "https://deno.land/std@0.211.0/assert/assert_equals.ts";
import { Matrix } from "../src/game/matrix.ts";
import { Tetromino } from "../src/game/tetromino.ts";

Deno.test("Matrix.rm_full_line()", () => {
  const m = new Matrix({ cols: 2, rows: 4 });
  const t = new Tetromino({
    shape: [
      [true],
      [true],
    ],
  });
  const place = m.calculate_place_for_tetromino(t, { start_position: 0 });
  if (!place.ok) {
    assertEquals("not to", "be here");
    return;
  }
  m.place_tetromino(t, {
    start_position: place.start_position,
    seq: place.seq,
  });
  const rm1 = m.rm_full_lines();
  assertEquals(rm1.ok, false);
  const t2 = t.clone();
  const place2 = m.calculate_place_for_tetromino(t2, { start_position: 4 });
  if (!place2.ok) {
    assertEquals("not to", "be here");
    return;
  }
  m.place_tetromino(t2, {
    start_position: place2.start_position,
    seq: place2.seq,
  });
  const bottom = m.detect_bottom();
  assertEquals(bottom.length, 1);
  const t3 = t.clone();
  const place3 = m.calculate_place_for_tetromino(t3, { start_position: 5 });
  if (!place3.ok) {
    assertEquals("not to", "be here");
    return;
  }
  m.place_tetromino(t3, {
    start_position: place3.start_position,
    seq: place3.seq,
  });
  const to_bottom_res2 = m.tetromino_to_bottom(t2._id);
  assertEquals(to_bottom_res2.ok, true);
  const to_bottom_res = m.tetromino_to_bottom(t._id);
  assertEquals(to_bottom_res.ok, true);
  const to_bottom_res3 = m.tetromino_to_bottom(t3._id);
  assertEquals(to_bottom_res3.ok, true);
  const rm_full_lines_res = m.rm_full_lines();
  assertEquals(rm_full_lines_res.ok, true);
});
