import { Matrix } from "../engine/matrix.ts";
import { Tetromino } from "../engine/tetromino.ts";

export type GameMachineContext = {
  matrix?: Matrix;
  current_tetromino?: Tetromino;
  current_seq?: number[];
  current_start_position?: number;
};
