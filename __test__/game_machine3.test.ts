import { createActor } from "xstate";
import { machine } from "../src/game/machine/game.machine.ts";
import { GameEventGenerator } from "../src/game/machine/events.ts";
import { Tetromino } from "../src/game/engine/tetromino.ts";
import { assertEquals } from "https://deno.land/std@0.211.0/assert/assert_equals.ts";

Deno.test("GameMachine 3", () => {
  const actor = createActor(machine);
  actor.start();
  actor.send(GameEventGenerator.GENERATE_MATRIX(2, 4));
  actor.send(GameEventGenerator.ADD_TO_MATRIX(Tetromino.cube, 4));
  assertEquals(actor.getSnapshot().context.matrix?._occupied, new Set());
  actor.send(GameEventGenerator.ADD_TO_MATRIX(Tetromino.cube, 4));
  assertEquals(actor.getSnapshot().value, "Tetromino_creation");
  const t = Tetromino.cube;
  actor.send(GameEventGenerator.ADD_TO_MATRIX(t, 2));
  assertEquals(actor.getSnapshot().value, "Fly");
  actor.send(GameEventGenerator.MOVE_DOWN());
  assertEquals(actor.getSnapshot().value, "Tetromino_creation");
});
