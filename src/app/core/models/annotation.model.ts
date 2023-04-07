import {XYTuple} from './xy-tuple.model';

export interface Annotation {
  coordinates: XYTuple;
  size: [height: number, width: number];
  content: string;
  type?: 'text' | 'image';
}
