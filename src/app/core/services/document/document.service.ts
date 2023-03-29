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
          imageUrl: 'src/assets/example-document/1.png',
        },
      ]
    });
  }
}
