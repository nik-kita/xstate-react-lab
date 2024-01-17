export class Tetromino {
  static _cube = new Tetromino({
    shape: [
      [true, true],
      [true, true],
    ],
  });

  static get cube() {
    return this._cube.clone();
  }

  static _line_h = new Tetromino({
    shape: [
      [true, true, true, true],
    ],
  });

  static get line_h() {
    return this._line_h.clone();
  }

  static _line_v = new Tetromino({
    shape: [
      [true],
      [true],
      [true],
      [true],
    ],
  });

  static get line_v() {
    return this._line_v.clone();
  }

  constructor({ shape }: {
    shape: [boolean[], ...boolean[][]];
  }) {
    this._shape = shape;
    this._rows = shape.length;
    this._cols = shape[0].length;
    this._id = `tetromino${Date.now()}${
      Math.random().toString().substring(2, 4)
    }`;
  }
  _id: string;
  _rows: number;
  _cols: number;
  _shape: [boolean[], ...boolean[][]];

  get shape() {
    return this._shape;
  }

  get cols_rows() {
    return {
      cols: this._cols,
      rows: this._rows,
    };
  }

  clone() {
    return new Tetromino({ shape: this._shape });
  }
}
