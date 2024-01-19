import { Matrix } from "../engine/matrix.ts";
import { Tetromino } from "../engine/tetromino.ts";
import { GameMachineContext } from "./context.ts";

export const is_bottom = (_: { context: GameMachineContext }, params: {
  matrix?: Matrix;
  tetromino?: Tetromino;
}) => {
  if (!params.tetromino || !params.matrix) {
    console.warn("<detect_bottom> was called unnecessary");
    return false;
  }
  if (params.matrix.detect_bottom().includes(params.tetromino._id)) {
    params.matrix.tetromino_to_bottom(params.tetromino._id);

    return true;
  }

  return false;
};
