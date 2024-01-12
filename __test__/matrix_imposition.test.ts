import { assertEquals } from "https://deno.land/std@0.211.0/assert/assert_equals.ts";
import { matrix_imposition } from "../src/game/engine/matrix_imposition.ts";

Deno.test("matrix_imposition one", () => {
  const result = matrix_imposition({
    child: {
      cols: 2,
      rows: 2,
    },
    parent: {
      cols: 3,
      rows: 3,
    },
  }, {
    start_position: 1,
  });
  assertEquals(result, {
    ok: true,
    seq: [1, 2, 4, 5],
  });
});

Deno.test("matrix_imposition two", () => {
  const result = matrix_imposition({
    child: {
      cols: 2,
      rows: 2,
    },
    parent: {
      cols: 3,
      rows: 3,
    },
  }, {
    start_position: 5,
  });
  assertEquals(result, {
    ok: false,
    reason: "start is out of bounds (horizontal overflow)",
  });
});

Deno.test("matrix_imposition three", () => {
  const result = matrix_imposition({
    child: {
      cols: 2,
      rows: 2,
    },
    parent: {
      cols: 3,
      rows: 3,
    },
  }, {
    start_position: 0,
    occupied: new Set<number>().add(1),
  });
  assertEquals(result, {
    ok: false,
    reason: "occupied",
  });
});
