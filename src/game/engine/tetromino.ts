export class Tetromino {
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
