import { createMachine, raise, setup } from "xstate";
import { Matrix } from "./matrix.ts";
import { Tetromino } from "./tetromino.ts";
import { Move } from "./engine/types.ts";

export const machine = setup({
  actions: {
    detect_bottom: (_, params: {
      matrix: Matrix;
      tetromino: Tetromino;
    }) => {
      if (params.matrix.detect_bottom().includes(params.tetromino._id)) {
        params.matrix.tetromino_to_bottom(params.tetromino._id);
        raise({ type: "MEET_BOTTOM" });
      }
    },
    rm_full_lines: (_, params: { matrix: Matrix }) => {
      let infinite_guard = 0;
      let res = params.matrix.rm_full_lines();
      while (res.ok) {
        if (infinite_guard > 600) {
          throw new Error("infinite loop during full lines removing");
        }
        ++infinite_guard;
        res = params.matrix.rm_full_lines();
      }
    },
    place_tetromino: (
      { context },
      params: {
        matrix: Matrix;
        tetromino: Tetromino;
        seq: number[];
        start_position: number;
      },
    ) => {
      const { tetromino, ...rest } = params;
      const res = params.matrix.place_tetromino(tetromino, rest);

      if (res.ok) {
        context.current_tetromino = params.tetromino;
      } else {
        context.current_tetromino = undefined;
        raise({ type: "GAME_OVER" });
      }
    },
  },
  guards: {
    is_available_space_for_tetromino: ({ context }, params: {
      tetromino: Tetromino;
      start_position: number;
    }) => {
      const { tetromino, start_position } = params;
      const res = context.matrix.calculate_place_for_tetromino(tetromino, {
        start_position,
      });

      if (res.ok) {
        context.current_seq = res.seq;
        context.current_start_position = res.start_position;
        return true;
      }

      return false;
    },
  },
  delays: {},
  types: {
    context: {} as GameMachineContext,
  },
}).createMachine(
  {
    id: "game",
    context: {
      matrix: new Matrix({ cols: 10, rows: 20 }),
    },
    initial: "Tetromino_creation",
    states: {
      Tetromino_creation: {
        on: {
          ADD_TO_MATRIX: [
            {
              guard: {
                type: "is_available_space_for_tetromino",
                params({ context, event }) {
                  return {
                    start_position: event.start_position,
                    tetromino: event.tetromino,
                  };
                },
              },
              actions: [
                {
                  type: "place_tetromino",
                  params: ({ context }) => {
                    return {
                      matrix: context.matrix,
                      tetromino: context.current_tetromino!,
                      start_position: context.current_start_position!,
                      seq: context.current_seq!,
                    };
                  },
                },
              ],
              target: "Fly",
            },
            {
              target: "Game_over",
            },
          ],
        },
      },
      Fly: {
        entry: {
          type: "detect_bottom",
          params: ({ context }) => {
            console.log('detect bottom');
            return {
              matrix: context.matrix,
              tetromino: context.current_tetromino!,
            };
          },
        },
        on: {
          MEET_BOTTOM: {
            target: "Tetromino_creation",
            actions: {
              type: "rm_full_lines",
              params: ({ context }) => {
                return {
                  matrix: context.matrix,
                };
              },
            },
          },
          MOVE: {
            target: "Fly",
          },
        },
      },
      Game_over: {
        type: "final",
      },
    },
    types: {
      events: {} as GameMachineEvent,
    },
  },
);

export type GameMachineEvent =
  | { type: "MOVE"; direction: Move }
  | { type: "MEET_BOTTOM" }
  | { type: "ADD_TO_MATRIX"; tetromino: Tetromino; start_position: number };

export type GameMachineContext = {
  matrix: Matrix;
  current_tetromino?: Tetromino;
  current_seq?: number[];
  current_start_position?: number;
};
