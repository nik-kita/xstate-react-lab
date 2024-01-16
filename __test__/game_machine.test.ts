import { createActor } from "xstate";
import { GameMachineEvent, machine } from "../src/game/machine.ts";
import { assertEquals } from "https://deno.land/std@0.211.0/assert/assert_equals.ts";
import { Tetromino } from "../src/game/tetromino.ts";

Deno.test("GameMachine one", () => {
  const game = createActor(machine);
  const s1 = game.getSnapshot();
  assertEquals(s1.value, "Idle");
  game.start();
  game.send({ type: "MEET_BOTTOM" } satisfies GameMachineEvent);
  const s2 = game.getSnapshot();
  assertEquals(s2.value, "Idle");
  game.send({ type: "MOVE", direction: "down" } satisfies GameMachineEvent);
  const s3 = game.getSnapshot();
  assertEquals(s3.value, "Idle");
  const t = new Tetromino({
    shape: [
      [true, true],
      [true, true],
    ],
  });
  game.send(
    {
      type: "ADD_TO_MATRIX",
      start_position: 100,
      tetromino: t,
    } satisfies GameMachineEvent,
  );
  assertEquals(game.getSnapshot().value, "Idle");
  game.send(
    { type: "GENERATE_MATRIX", x: 10, y: 10 } satisfies GameMachineEvent,
  );
  assertEquals(game.getSnapshot().value, "Tetromino_creation");
  game.send(
    {
      type: "ADD_TO_MATRIX",
      start_position: 101,
      tetromino: t,
    } satisfies GameMachineEvent,
  );
  assertEquals(game.getSnapshot().value, "Game_over");
});
