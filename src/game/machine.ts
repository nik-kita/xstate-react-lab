import { raise, setup } from "xstate";
import { Move } from "./engine/types.ts";
import { Matrix } from "./engine/matrix.ts";
import { Tetromino } from "./engine/tetromino.ts";
import { GameEvent } from "./events.ts";

export const machine = setup({
  actions: {
    move_tetromino: ({ context }, { direction }: { direction: Move }) => {
      const { matrix, current_tetromino, current_start_position } = context;
      if (
        !matrix || !current_tetromino || current_start_position === undefined
      ) {
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
    },
    generate_matrix: ({ context }, { x, y }: { x: number; y: number }) => {
      context.matrix = new Matrix({ cols: x, rows: y });
    },
    detect_bottom: (_, params: {
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
    },
    rm_full_lines: (_, params: { matrix?: Matrix }) => {
      if (!params.matrix) {
        console.warn("<rm_full_lines> was called unnecessary");
        return;
      }

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
    },
  },
  guards: {
    is_available_space_for_tetromino: ({ context }, params: {
      tetromino: Tetromino;
      start_position: number;
    }) => {
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
    },
  },
  delays: {},
  types: {
    context: {} as GameMachineContext,
  },
}).createMachine(
  {
    id: "game 3",
    context: {
      matrix: new Matrix({ cols: 10, rows: 20 }),
    },
    initial: "Idle",
    states: {
      Idle: {
        on: {
          GENERATE_MATRIX: {
            target: "Tetromino_creation",
            actions: [{
              type: "generate_matrix",
              params({ context, event }) {
                return {
                  x: event.x,
                  y: event.y,
                };
              },
            }],
          },
        },
      },
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
                      tetromino: context.current_tetromino,
                      start_position: context.current_start_position,
                      seq: context.current_seq,
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
            actions: [{
              type: "move_tetromino",
              params: ({ event }) => {
                return {
                  direction: event.direction,
                };
              },
            }],
            target: "Fly",
          },
        },
      },
      Game_over: {
        entry: [({ context }) => {
          context.matrix = undefined;
          context.current_tetromino = undefined;
          context.current_seq = undefined;
          context.current_start_position = undefined;
        }],
        on: {
          REPEAT_GAME: {
            target: "Idle",
          },
        },
      },
    },
    types: {
      events: {} as GameEvent,
    },
  },
);

export type GameMachineContext = {
  matrix?: Matrix;
  current_tetromino?: Tetromino;
  current_seq?: number[];
  current_start_position?: number;
};
