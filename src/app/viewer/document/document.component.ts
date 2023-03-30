import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component, EventEmitter,
  Input, Output
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
  @Output() documentChanged = new EventEmitter<Document>();
  public newAnnotationText = '';
  public newAnnotationImageUrl = '';

  constructor(private readonly cdRef: ChangeDetectorRef) {}

  public handleAddAnnotation($event: MouseEvent, pageIndex: number) {
    $event.stopPropagation();
    const newDocument = {...this.document};
    if (!newDocument.pages[pageIndex].annotations) {
      newDocument.pages[pageIndex].annotations = [];
    }
    // @ts-ignore
    newDocument.pages[pageIndex].annotations.push({
      coordinates: [$event.offsetX, $event.offsetY],
      size: [200, 200],
      content: '',
    });
    this.document = newDocument;
  }

  public handleSaveAnnotationAsText(pageIndex:number, annotationIndex: number) {
    const newDocument = {...this.document};
    // @ts-ignore
    newDocument.pages[pageIndex].annotations[annotationIndex].type = 'text';
    // @ts-ignore
    newDocument.pages[pageIndex].annotations[annotationIndex].content = this.newAnnotationText;
    // this.document = newDocument;
    this.documentChanged.next(newDocument);
  }

  public handleSaveAnnotationAsImage(pageIndex:number, annotationIndex: number) {
    const newDocument = {...this.document};
    // @ts-ignore
    newDocument.pages[pageIndex].annotations[annotationIndex].type = 'image';
    // @ts-ignore
    newDocument.pages[pageIndex].annotations[annotationIndex].content = this.newAnnotationImageUrl;
    // this.document = newDocument;
    this.documentChanged.next(newDocument);
  }

  public handleRemoveAnnotation($event: Event, pageIndex: number, annotationIndex: number) {
    $event.stopPropagation();
    const newDocument = {...this.document};
    newDocument.pages[pageIndex].annotations?.splice(annotationIndex, 1);
    // this.document = newDocument;
    this.documentChanged.next(newDocument);
  }

  public emptyHandler($event: Event) {
    $event.stopPropagation();
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
      // this.document = newDocument;
      this.documentChanged.next(newDocument);
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
