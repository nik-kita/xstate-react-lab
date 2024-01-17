import { createActor } from "xstate";
import { machine } from "../src/game/machine/index.ts";
import { GameEventGenerator } from "../src/game/machine/events.ts";
import { Tetromino } from "../src/game/engine/tetromino.ts";
import { assertEquals } from "https://deno.land/std@0.211.0/assert/assert_equals.ts";

Deno.test("GameMachine two", () => {
  const actor = createActor(machine);
  actor.start();
  actor.send(GameEventGenerator.GENERATE_MATRIX(4, 4));
  actor.send(GameEventGenerator.ADD_TO_MATRIX(Tetromino.cube, 0));
  actor.send(GameEventGenerator.MOVE_DOWN());
  actor.send(GameEventGenerator.MOVE_DOWN());
  assertEquals("// TODO", "is not completed!");
});
