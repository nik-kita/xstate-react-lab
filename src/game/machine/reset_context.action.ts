import { GameMachineContext } from "./context.ts";

export const reset_context = ({ context }: { context: GameMachineContext }) => {
  context.matrix = undefined;
  context.current_tetromino = undefined;
  context.current_seq = undefined;
  context.current_start_position = undefined;
};
