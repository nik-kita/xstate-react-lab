import { assertEquals } from "https://deno.land/std@0.211.0/assert/assert_equals.ts";
import { Tetromino } from "../src/game/engine/tetromino.ts";

Deno.test("Tetromino.clone", () => {
  const t = new Tetromino({ shape: [[true, true], [false, true]] });
  const t2 = t.clone();

  assertEquals(t2.shape, t.shape);
});
