import { setup } from "xstate";
import { Matrix } from "../engine/matrix.ts";
import { GameMachineContext } from "./context.ts";
import { detect_bottom } from "./detect_bottom.action.ts";
import { GameEvent } from "./events.ts";
import { generate_matrix } from "./generate_matrix.action.ts";
import { is_available_space_for_tetromino } from "./is_available_space_for_tetromino.guard.ts";
import { move_tetromino } from "./move_tetromino.action.ts";
import { place_tetromino } from "./place_tetromino.action.ts";
import { rm_full_lines } from "./rm_full_lines.action.ts";

export const machine = setup({
  actions: {
    move_tetromino,
    generate_matrix,
    detect_bottom,
    rm_full_lines,
    place_tetromino,
  },
  guards: {
    is_available_space_for_tetromino,
  },
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
