import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  Input
} from '@angular/core';
import {Document} from '../../core/models/document.model';
import {Annotation} from '../../core/models/annotation.model';
import {DocumentPage} from '../../core/models/document-page.model';
import {fromEvent, takeUntil, tap} from 'rxjs';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentComponent {
  @Input() document!: Document;

  constructor(private readonly cdRef: ChangeDetectorRef) {}

  public handleRemoveAnnotation($event: Event, pageIndex: number, annotationIndex: number) {
    $event.stopPropagation();
    const newDocument = {...this.document};
    newDocument.pages[pageIndex].annotations?.splice(annotationIndex, 1);
    this.document = newDocument;
  }

  public handleAnnotationDrag($event: Event, pageIndex: number, annotationIndex: number) {
    $event.stopPropagation();
    fromEvent(document, 'pointermove')
      .pipe(takeUntil(fromEvent(document, 'mouseup').pipe(tap(()=>{
        this.cdRef.detectChanges();
      }))))
      .subscribe((event)=> {
      const newDocument = {...this.document};
      // @ts-ignore
      newDocument.pages[pageIndex].annotations[annotationIndex].coordinates = [event.offsetX, event.offsetY];
      this.document = newDocument;
    })
  }

  public calculateAnnotationNgStyle(
    page: DocumentPage,
    annotation: Annotation,
    annotationIndex: number
  ) {
    // @ts-ignore
    const annotationsCorrection = page.annotations.reduce(
      (accumulator, curAnnotation, curIndex, arr) => {
        if (curIndex >= annotationIndex) return accumulator;
        return accumulator + curAnnotation.size[0] + 16;
      },
      0
    );
    return {
      top: `${annotation.coordinates[1] - annotationsCorrection}px`,
      left: `${annotation.coordinates[0]}px`,
      height: `${annotation.size[0]}px`,
      width: `${annotation.size[1]}px`,
    };
  }

  public calculateNegativeMargin(page: DocumentPage) {
    const paddingCorrection = 16;
    const totalHeight = page?.annotations?.reduce(
      (accumulator, curAnnotation) => accumulator + (curAnnotation.size[0] + paddingCorrection),
      0
    );
    return {'margin-top': `-${totalHeight}px`};
  }
}
