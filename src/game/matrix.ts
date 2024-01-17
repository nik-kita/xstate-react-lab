import { MOVE_CALCULATOR } from "./engine/const.ts";
import { matrix_imposition } from "./engine/matrix_imposition.ts";
import { Cell, Move } from "./engine/types.ts";
import { Tetromino } from "./tetromino.ts";

export class Matrix {
  constructor({ rows, cols }: {
    rows: number;
    cols: number;
  }) {
    this._cols_rows = { rows, cols };
    for (let i = 0; i < rows * cols; ++i) {
      this._cells.push({ free: true });
      if (i >= rows * cols - cols) {
        this._bottom.push(i + this._cols_rows.cols);
      }
    }
  }

  rm_full_lines() {
    const res = {
      ok: false,
    };
    const bottom = this._bottom.sort();
    for (
      let i = 0, len = this._cols_rows.rows * this._cols_rows.cols;
      i < len;
      i += this._cols_rows.rows
    ) {
      const start_line = bottom.findIndex((position) => position === i);

      if (start_line === -1) {
        continue;
      }

      let is_full = true;

      for (let j = 0; j < this._cols_rows.cols; ++j) {
        if (bottom[start_line + j] !== i + j) {
          is_full = false;
          break;
        }
      }

      if (is_full) {
        bottom.splice(start_line, this._cols_rows.cols);
        for (let j = 0; j < start_line; ++j) {
          bottom[j] += this._cols_rows.rows * 2;
        }
        res.ok = true;
      }
    }

    return res;
  }

  tetromino_to_bottom(tetromino_id: string) {
    const target = this._tetrominos.get(tetromino_id);
    if (!target) {
      return {
        ok: false,
        reason: "tetromino with such id not found",
      };
    }
    const { seq } = target;
    if (
      seq.some((position) =>
        this._bottom.includes(position + this._cols_rows.cols)
      )
    ) {
      seq.forEach((position) => {
        const cell = this._cells[position] as Cell<unknown>;
        if (cell.position === undefined) {
          throw new Error("cell.position is undefined");
        }
        this._bottom.push(seq[cell.position]);
        cell.free = false;
        cell.tetromino_id = undefined;
        cell.position = undefined;
      });
      this._tetrominos.delete(tetromino_id);

      return {
        ok: true,
      };
    } else {
      return {
        ok: false,
        reason: "tetromino is not on the bottom",
      };
    }
  }

  detect_bottom() {
    const on_bottom = [] as string[];
    this._tetrominos.forEach(({ seq, tetromino }) => {
      if (
        seq.some((position) =>
          this._bottom.includes(position + this._cols_rows.rows)
        )
      ) {
        on_bottom.push(tetromino._id);
      }
    });

    return on_bottom;
  }

  _cols_rows: { rows: number; cols: number };
  _cells: Cell[] = [];
  _bottom = new Array<number>();
  _occupied = new Set<number>();
  _tetrominos = new Map<
    string,
    { tetromino: Tetromino; seq: number[]; start_position: number }
  >();

  rm_tetromino(tetromino_id: string) {
    const target = this._tetrominos.get(tetromino_id);
    if (target) {
      const { seq } = target;
      seq.forEach((position) => {
        const cell = this._cells[position] as Cell<unknown>;
        cell.free = true;
        cell.tetromino_id = undefined;
        cell.position = undefined;
        this._occupied.delete(position);
      });
      this._tetrominos.delete(tetromino_id);

      return {
        ok: true,
      };
    }
    return {
      ok: false,
      reason: "tetromino with such id not found",
    };
  }

  move_tetromino(tetromino_id: string, { type }: {
    type: Move;
  }) {
    const target = this._tetrominos.get(tetromino_id);
    if (!target) {
      return {
        ok: false,
        reason: "tetromino with such id not found",
      };
    }
    const { tetromino, start_position } = target;
    this.rm_tetromino(tetromino_id);
    const next_position = MOVE_CALCULATOR[type](
      start_position,
      this._cols_rows.rows,
    );
    const res = this.calculate_place_for_tetromino(tetromino, {
      start_position: next_position,
    });
    if (!res.ok) {
      this.place_tetromino(tetromino, { seq: target.seq, start_position });
      return res;
    }

    this.place_tetromino(tetromino, {
      seq: res.seq,
      start_position: next_position,
    });
    return {
      ok: true,
      tetromino_id,
    };
  }

  calculate_place_for_tetromino(tetromino: Tetromino, options: {
    start_position?: number;
  } = {}): { ok: false; reason: string } | {
    ok: true;
    seq: number[];
    start_position: number;
  } {
    if (this._tetrominos.has(tetromino._id)) {
      return {
        ok: false,
        reason: "this tetromino is already placed",
      };
    }
    const {
      start_position = 0,
    } = options;
    const res = matrix_imposition({
      parent: this._cols_rows,
      child: tetromino.cols_rows,
    }, {
      start_position,
      occupied: this._occupied,
      shape: tetromino.shape,
    });

    if (res.ok) {
      return {
        ...res,
        start_position,
      };
    }

    return res;
  }

  place_tetromino(
    tetromino: Tetromino,
    { seq, start_position }: { seq: number[]; start_position: number },
  ): { ok: false; reason: string } | { ok: true; tetromino_id: string } {
    this._tetrominos.set(tetromino._id, {
      seq,
      tetromino,
      start_position,
    });
    seq.forEach((position, i) => {
      const cell = this._cells[position] as Cell<false>;
      cell.free = false;
      cell.tetromino_id = tetromino._id;
      cell.position = i;
      this._occupied.add(position);
    });

    return {
      ok: true,
      tetromino_id: tetromino._id,
    };
  }
}
