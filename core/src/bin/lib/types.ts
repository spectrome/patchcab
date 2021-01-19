export type Module = {
  set: string;
  name: string;
  tags: string[];
  size: {
    w: number;
    h: number;
  };
  author: string;
  libs: string[];
};

export type Library = {
  cdn: string;
  alias: string;
};
