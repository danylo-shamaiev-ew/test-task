import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {Document} from '../../models/document.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  constructor() {}

  public getDocument(id: string): Observable<Document> {
    // Let's pretend there is a real API call :)
    return of({
      id: +id,
      pages: [
        {
          imageUrl: '../../../../assets/example-document/1.png',
          annotations: [
            {
              coordinates: [16, 16],
              size: [50, 100],
              content: 'Test annotation 1',
              type: 'text',
            },
            {
              coordinates: [333, 430],
              size: [100, 100],
              content: 'Test annotation 2',
              type: 'text',
            },
            {
              coordinates: [460, 460],
              size: [100, 100],
              content: 'Test annotation 3',
              type: 'text',
            },
          ]
        },
        {
          imageUrl: '../../../../assets/example-document/2.png',
          annotations: [
            {
              coordinates: [30, 42],
              size: [50, 100],
              content: 'Test annotation',
              type: 'text',
            },
          ]
        },
        {
          imageUrl: '../../../../assets/example-document/3.png',
        },
        {
          imageUrl: '../../../../assets/example-document/4.png',
        },
        {
          imageUrl: '../../../../assets/example-document/5.png',
        },
      ]
    });
  }
}
