import { createBrowserInspector } from "@statelyai/inspect";
import { createActorContext } from "@xstate/react";
import { machine } from "./game/machine/game.machine";

const inspector = createBrowserInspector();

export const GameContext = createActorContext(machine, {
  devTools: true,
  inspect: inspector.inspect,
});
