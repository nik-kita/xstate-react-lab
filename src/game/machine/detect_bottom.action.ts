import { raise } from "xstate";
import { Matrix } from "../engine/matrix.ts";
import { Tetromino } from "../engine/tetromino.ts";
import { GameMachineContext } from "./context.ts";

export const detect_bottom = (_: { context: GameMachineContext }, params: {
  matrix?: Matrix;
  tetromino?: Tetromino;
}) => {
  if (!params.tetromino || !params.matrix) {
    console.warn("<detect_bottom> was called unnecessary");
    return;
  }
  if (params.matrix.detect_bottom().includes(params.tetromino._id)) {
    params.matrix.tetromino_to_bottom(params.tetromino._id);
    raise({ type: "MEET_BOTTOM" });
  }
};
