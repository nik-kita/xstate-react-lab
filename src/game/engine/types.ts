export type Cell<T extends (unknown | boolean) = boolean> = T extends true ? {
    free: T;
  }
  : T extends false ? {
      free: T;
      tetromino_id?: string;
      position?: number;
    }
  : {
    free: boolean;
    tetromino_id?: string;
    position?: number;
  };

export type Move = "left" | "right" | "down" | "up";
