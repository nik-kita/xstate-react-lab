import { createActorContext } from "@xstate/react";
import { machine } from "./game/machine/game.machine";

export const GameContext = createActorContext(machine);
