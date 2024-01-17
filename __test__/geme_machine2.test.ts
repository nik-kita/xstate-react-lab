import { createActor } from "xstate";
import { machine } from "../src/game/machine.ts";

Deno.test("GameMachine two", () => {
  const actor = createActor(machine);

  actor.start();
});
