export interface Annotation {
  coordinates: [x: number, y: number];
  size: [height: number, width: number];
  content: string;
  type?: 'text' | 'image';
}
