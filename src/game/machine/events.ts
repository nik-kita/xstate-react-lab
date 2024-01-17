import { Tetromino } from "../engine/tetromino.ts";
import { Move } from "../engine/types.ts";

export type GameEvent =
  | { type: "MOVE"; direction: Move }
  | { type: "MEET_BOTTOM" }
  | { type: "GENERATE_MATRIX"; x: number; y: number }
  | { type: "ADD_TO_MATRIX"; tetromino: Tetromino; start_position: number }
  | { type: "REPEAT_GAME" };

export const GameEventGenerator = {
  MOVE: (direction: Move) => ({ type: "MOVE", direction } satisfies GameEvent),
  MOVE_DOWN: () => ({ type: "MOVE", direction: "down" } satisfies GameEvent),
  GENERATE_MATRIX: (
    x: number,
    y: number,
  ) => ({ type: "GENERATE_MATRIX", x, y } satisfies GameEvent),
  ADD_TO_MATRIX: (
    tetromino: Tetromino,
    start_position: number,
  ) => ({
    type: "ADD_TO_MATRIX",
    tetromino,
    start_position,
  } satisfies GameEvent),
  REPEAT_GAME: () => ({ type: "REPEAT_GAME" } satisfies GameEvent),
  MOVE_RIGHT: () => ({ type: "MOVE", direction: "right" } satisfies GameEvent),
  MOVE_LEFT: () => ({ type: "MOVE", direction: "left" } satisfies GameEvent),
  MOVE_UP: () => ({ type: "MOVE", direction: "up" } satisfies GameEvent),
} as const;

export type GameEventName = keyof typeof GameEventGenerator;
