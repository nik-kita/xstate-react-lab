import { Move } from "./types.ts";

export const MOVE_CALCULATOR = {
  down: (from: number, y: number) => from + y,
  left: (from: number) => from - 1,
  right: (from: number) => from + 1,
  up: (from: number, y: number) => from - y,
} satisfies Record<Move, unknown>;
