import { assertEquals } from "https://deno.land/std@0.211.0/assert/assert_equals.ts";
import { Matrix } from "../src/game/matrix.ts";
import { Tetromino } from "../src/game/tetromino.ts";

Deno.test("Matrix.tetromino_to_bottom one", () => {
  const m = new Matrix({ rows: 4, cols: 4 });
  const t = new Tetromino({
    shape: [
      [true, true, true],
      [true, true, true],
    ],
  });
  const res = m.place_tetromino(t);
  if (!res.ok) {
    assertEquals("not to be", "here", res.toString());
    return;
  }
  assertEquals(
    m._tetrominos.get(res.tetromino_id)!.seq.some((s) => m._bottom.includes(s)),
    false,
  );
  m.move_tetromino(res.tetromino_id, { type: "down" });
  m.move_tetromino(res.tetromino_id, { type: "down" });
  assertEquals(
    m._tetrominos.get(res.tetromino_id)!.seq.some((s) => m._bottom.includes(s)),
    true,
  );
  m.tetromino_to_bottom(res.tetromino_id);
  assertEquals(m._tetrominos.get(res.tetromino_id), undefined);
});
