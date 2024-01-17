import { Tetromino } from "../engine/tetromino.ts";
import { GameMachineContext } from "./context.ts";

export const is_available_space_for_tetromino = (
  { context }: { context: GameMachineContext },
  params: {
    tetromino: Tetromino;
    start_position: number;
  },
) => {
  if (!context.matrix) {
    console.warn(
      "<is_available> space for tetromino was called unnecessary",
    );
    return false;
  }
  const { tetromino, start_position } = params;
  const res = context.matrix.calculate_place_for_tetromino(tetromino, {
    start_position,
  });
  if (res.ok) {
    context.current_seq = res.seq;
    context.current_start_position = res.start_position;
    context.current_tetromino = tetromino;
    return true;
  }

  return false;
};
