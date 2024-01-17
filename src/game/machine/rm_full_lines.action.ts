import { Matrix } from "../engine/matrix.ts";
import { GameMachineContext } from "./context.ts";

export const rm_full_lines = (
  _: { context: GameMachineContext },
  params: { matrix?: Matrix },
) => {
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
};
