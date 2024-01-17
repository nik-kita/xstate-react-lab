import { Matrix } from "../engine/matrix.ts";
import { GameMachineContext } from "./context.ts";

export const generate_matrix = (
  { context }: { context: GameMachineContext },
  { x, y }: { x: number; y: number },
) => {
  context.matrix = new Matrix({ cols: x, rows: y });
};
