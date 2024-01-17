import { createActorContext } from "@xstate/react";
import { machine } from "./game/machine";

export const GameContext = createActorContext(machine);
