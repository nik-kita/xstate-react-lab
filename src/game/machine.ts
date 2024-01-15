import { createMachine, raise, setup } from "xstate";
import { Matrix } from "./matrix";
import { Tetromino } from "./tetromino";

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
    place_tetromino: (_, params: { matrix: Matrix; tetromino: Tetromino }) => {
      params.matrix.place_tetromino(params.tetromino);
    },
  },
  actors: {},
  guards: {
    is_available_space_for_tetromino: ({ context, event }, params: unknown) => {
      return false;
    },
    is_tetromino_placed: (
      _,
      params: { matrix: Matrix; tetromino: Tetromino | null },
    ) => {
      return !!params.tetromino &&
        params.matrix._tetrominos.has(params.tetromino._id);
    },
  },
  delays: {},
  types: {
    context: {} as Context,
  },
}).createMachine(
  {
    id: "game",
    context: {
      matrix: new Matrix({ cols: 10, rows: 20 }),
      current_tetromino: null,
    },
    initial: "Tetromino_creation",
    states: {
      Tetromino_creation: {
        on: {
          ADD_TO_MATRIX: [
            {
              actions: [
                {
                  type: "place_tetromino",
                  params: ({ context, event }) => {
                    return {
                      matrix: context.matrix,
                      tetromino: event.tetromino,
                    };
                  },
                },
              ],
              target: "Fly",
              guard: {
                type: "is_tetromino_placed",
                params: ({ context }) => {
                  return {
                    matrix: context.matrix,
                    tetromino: context.current_tetromino,
                  };
                },
              },
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
      events: {} as
        | { type: "MOVE" }
        | { type: "MEET_BOTTOM" }
        | { type: "ADD_TO_MATRIX"; tetromino: Tetromino },
    },
  },
);

type Context = {
  matrix: Matrix;
  current_tetromino: Tetromino | null;
};
