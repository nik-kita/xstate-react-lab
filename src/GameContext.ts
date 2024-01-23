import { createBrowserInspector } from "@statelyai/inspect";
import { createActorContext } from "@xstate/react";
import { machine } from "./game/machine/game.machine";

const inspector = createBrowserInspector();

export const GameContext = createActorContext(
  machine,
  import.meta.env.DEV
    ? {
        inspect: inspector.inspect,
      }
    : {}
);
