import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {Document} from '../../models/document.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  constructor() {}

  public getDocument(id: string): Observable<Document> {
    return of({
      id: 1,
      pages: [
        {
          imageUrl: '../../../../assets/example-document/1.png',
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
