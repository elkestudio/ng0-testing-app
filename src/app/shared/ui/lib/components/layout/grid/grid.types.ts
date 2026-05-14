export interface GridItem {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  label?: string;
  elementId?: string;
  [key: string]: any;
}
