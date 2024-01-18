import { createActor } from "xstate";
import { machine } from "../src/game/machine/game.machine.ts";
import { assertEquals } from "https://deno.land/std@0.211.0/assert/assert_equals.ts";
import { Tetromino } from "../src/game/engine/tetromino.ts";
import { GameEvent } from "../src/game/machine/events.ts";

Deno.test("GameMachine one", () => {
  const game = createActor(machine);
  const s1 = game.getSnapshot();
  assertEquals(s1.value, "Idle");
  game.start();
  game.send({ type: "MEET_BOTTOM" } satisfies GameEvent);
  const s2 = game.getSnapshot();
  assertEquals(s2.value, "Idle");
  game.send({ type: "MOVE", direction: "down" } satisfies GameEvent);
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
    } satisfies GameEvent,
  );
  assertEquals(game.getSnapshot().value, "Idle");
  game.send(
    { type: "GENERATE_MATRIX", x: 10, y: 10 } satisfies GameEvent,
  );
  assertEquals(game.getSnapshot().value, "Tetromino_creation");
  game.send(
    {
      type: "ADD_TO_MATRIX",
      start_position: 101,
      tetromino: t,
    } satisfies GameEvent,
  );
  assertEquals(game.getSnapshot().value, "Game_over");
  game.send({ type: "REPEAT_GAME" } satisfies GameEvent);
  assertEquals(game.getSnapshot().value, "Idle");
  game.send(
    { type: "GENERATE_MATRIX", x: 10, y: 10 } satisfies GameEvent,
  );
  assertEquals(game.getSnapshot().value, "Tetromino_creation");
  game.send(
    {
      type: "ADD_TO_MATRIX",
      start_position: 0,
      tetromino: t,
    } satisfies GameEvent,
  );
  assertEquals(game.getSnapshot().value, "Fly");
  game.send({ type: "MOVE", direction: "down" } satisfies GameEvent);
  assertEquals(game.getSnapshot().value, "Fly");
  assertEquals(game.getSnapshot().context.current_start_position, 10);
});
