import { createActor } from "xstate";
import { machine } from "../src/game/machine/game.machine.ts";
import { GameEventGenerator } from "../src/game/machine/events.ts";
import { Tetromino } from "../src/game/engine/tetromino.ts";
import { assertEquals } from "https://deno.land/std@0.211.0/assert/assert_equals.ts";

Deno.test("GameMachine two", () => {
  const actor = createActor(machine);

  const subscription = actor.subscribe((state) => {
    // console.debug(state.value);
  });

  actor.start();
  actor.send(GameEventGenerator.GENERATE_MATRIX(4, 4));
  actor.send(GameEventGenerator.ADD_TO_MATRIX(Tetromino.cube, 0));
  assertEquals(actor.getSnapshot().context.matrix?._tetrominos.size, 1);
  actor.send(GameEventGenerator.MOVE_DOWN());
  actor.send(GameEventGenerator.MOVE_DOWN());
  assertEquals(actor.getSnapshot().context.matrix?._tetrominos.size, 0);
  assertEquals(actor.getSnapshot().value, "Tetromino_creation");
  const occupied_count = actor.getSnapshot().context.matrix?._occupied.size ??
    0;
  actor.send(GameEventGenerator.ADD_TO_MATRIX(Tetromino.cube, 0));
  assertEquals(
    actor.getSnapshot().context.matrix?._occupied.size,
    occupied_count * 2,
  );
  actor.send(GameEventGenerator.MOVE_DOWN()); // should be ignored
  actor.send(GameEventGenerator.MOVE_DOWN()); // should be ignored
  actor.send(GameEventGenerator.MOVE_DOWN()); // should be ignored
  assertEquals(actor.getSnapshot().value, "Tetromino_creation");
  actor.send(GameEventGenerator.ADD_TO_MATRIX(Tetromino.cube, 0));
  assertEquals(actor.getSnapshot().value, "Game_over");
  subscription.unsubscribe();
});
