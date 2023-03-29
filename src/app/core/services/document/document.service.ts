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
      id: 1,
      pages: [
        {
          imageUrl: '../../../../assets/example-document/1.png',
          annotations: [
            {
              coordinates: [143, 50],
              size: [50, 100],
              content: 'Test annotation',
            },
            {
              coordinates: [333, 430],
              size: [100, 100],
              content: 'Test annotation',
            },
          ]
        },
        {
          imageUrl: '../../../../assets/example-document/2.png',
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
