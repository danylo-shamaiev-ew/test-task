import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {concatMap, take} from 'rxjs';
import {Document} from '../core/models/document.model';
import {DocumentService} from '../core/services/document/document.service';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewerComponent {
  public document!: Document;

  constructor(
    private readonly documentService: DocumentService,
    private readonly route: ActivatedRoute,
  ) {
    this.route.params.pipe(take(1), concatMap((params) => {
      if (!params['id']) throw Error('Document ID not present!');
      return this.documentService.getDocument(params['id']);
    })).subscribe((document) => {
      this.document = document;
    });
  }

  public handleDocumentChange(document: Document) {
    this.document = {...document};
  }

  public handleDocumentSave() {
    console.log('Document result: ', JSON.stringify(this.document));
  }
}
