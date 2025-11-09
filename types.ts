
export interface ChimeData {
  id: number;
  frequency: number;
  color: string;
  x: number; // percentage from left
  y: number; // percentage from top
}

export interface Hit {
  key: number;
  chime: ChimeData;
}
