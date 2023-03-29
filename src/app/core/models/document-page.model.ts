import {Annotation} from './annotation.model';

export interface DocumentPage {
  imageUrl: string;
  annotations?: Annotation[];
}
