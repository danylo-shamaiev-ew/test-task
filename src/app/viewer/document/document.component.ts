import {ChangeDetectionStrategy, Component, Input, OnChanges} from '@angular/core';
import {Document} from '../../core/models/document.model';
import {Annotation} from '../../core/models/annotation.model';
import {DocumentPage} from '../../core/models/document-page.model';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentComponent implements OnChanges {
  @Input() document!: Document;

  ngOnChanges() {}

  public calculateAnnotationNgStyle(annotation: Annotation) {
    return {
      top: `${annotation.coordinates[0]}px`,
      left: `${annotation.coordinates[1]}px`,
      height: `${annotation.size[0]}px`,
      width: `${annotation.size[1]}px`,
    };
  }

  public calculateNegativeMargin(page: DocumentPage) {
    const paddingMargin = 16;
    const totalHeight = page?.annotations?.reduce(
      (prevAnnotation, curAnnotation) => prevAnnotation + (curAnnotation.size[0] + paddingMargin),
      0
    );
    return {'margin-top': `-${totalHeight}px`};
  }
}
