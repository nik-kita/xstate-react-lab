import { Move } from "../engine/types.ts";
import { GameMachineContext } from "./context.ts";

export const move_tetromino = (
  { context }: { context: GameMachineContext },
  { direction }: { direction: Move },
) => {
  const { matrix, current_tetromino, current_start_position } = context;
  if (!matrix || !current_tetromino || current_start_position === undefined) {
    console.warn("<move_tetromino> was called unnecessary");
    return;
  }
  const res = matrix.move_tetromino(current_tetromino._id, {
    type: direction,
  });
  if (res.ok) {
    const t = context.matrix!._tetrominos.get(current_tetromino._id)!;
    context.current_start_position = t.start_position;
  }
};
