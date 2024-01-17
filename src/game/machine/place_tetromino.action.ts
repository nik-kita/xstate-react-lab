import { raise } from "xstate";
import { Tetromino } from "../engine/tetromino.ts";
import { GameMachineContext } from "./context.ts";

export const place_tetromino = (
  { context }: { context: GameMachineContext },
  params: {
    tetromino?: Tetromino;
    seq?: number[];
    start_position?: number;
  },
) => {
  const { tetromino, seq, start_position } = params;
  if (
    !tetromino || !seq || start_position === undefined || !context.matrix
  ) {
    console.warn("<place_tetromino> was called unnecessary");
    return;
  }
  const res = context.matrix.place_tetromino(tetromino, {
    seq,
    start_position,
  });

  if (res.ok) {
    context.current_tetromino = params.tetromino;
  } else {
    context.current_tetromino = undefined;
    raise({ type: "GAME_OVER" });
  }
};
