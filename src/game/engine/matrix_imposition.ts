export function matrix_imposition({
  child,
  parent,
}: {
  child: {
    cols: number;
    rows: number;
  };
  parent: {
    cols: number;
    rows: number;
  };
}, options: {
  occupied?: Set<number>;
  shape?: [boolean[], ...boolean[][]];
  start_position: number;
}): {
  ok: false;
  reason: string;
} | { ok: true; seq: number[] } {
  const {
    occupied,
    shape,
    start_position = 0,
  } = options;
  /**
   * @see
   * and check this place in any bug-situation
   */
  const MAX_WIDTH = parent.cols - child.cols;
  if (
    (start_position % parent.cols > MAX_WIDTH) ||
    (start_position < parent.cols && start_position > MAX_WIDTH)
  ) {
    return {
      ok: false,
      reason: "start is out of bounds (horizontal overflow)",
    };
  }
  /**
   * @see
   * and check this place in any bug-situation
   */
  const MAX = parent.cols * parent.rows - (parent.cols * (child.rows - 1) + 1);
  if (start_position > MAX) {
    return {
      ok: false,
      reason: "start is out of bounds (vertical overflow)",
    };
  }
  const seq = [] as number[];
  for (let y = 0; y < child.rows; ++y) {
    for (let x = 0; x < child.cols; ++x) {
      if (shape && !shape[y][x]) {
        continue;
      }
      const candidate = start_position + x + y * parent.cols;
      if (occupied && occupied.has(candidate)) {
        return {
          ok: false,
          reason: "occupied",
        };
      }
      seq.push(candidate);
    }
  }

  return { ok: true, seq };
}
