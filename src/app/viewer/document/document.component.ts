import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import {Document} from '../../core/models/document.model';
import {Annotation} from '../../core/models/annotation.model';
import {fromEvent, map, takeUntil, tap} from 'rxjs';

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

  // constructor(private readonly cdRef: ChangeDetectorRef) {}

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

  public handleSaveAnnotationAsText(pageIndex: number, annotationIndex: number) {
    const newDocument = {...this.document};
    // @ts-ignore
    newDocument.pages[pageIndex].annotations[annotationIndex].type = 'text';
    // @ts-ignore
    newDocument.pages[pageIndex].annotations[annotationIndex].content = this.newAnnotationText;
    // this.document = newDocument;
    this.documentChanged.next(newDocument);
  }

  public handleSaveAnnotationAsImage(pageIndex: number, annotationIndex: number) {
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
    this.documentChanged.next(newDocument);
  }

  public emptyHandler($event: Event) {
    $event.stopPropagation();
  }

  public handleAnnotationDrag($event: Event, pageIndex: number, annotationIndex: number) {
    $event.stopPropagation();
    const pageElement = document.getElementById(`page-${pageIndex}`) as HTMLElement;
    const pageRect = pageElement.getBoundingClientRect();
    const annotationElement = pageElement.getElementsByClassName('annotation')[
      annotationIndex
    ] as HTMLElement;
    fromEvent(document, 'mousemove')
      .pipe(
        takeUntil(
          fromEvent(document, 'mouseup').pipe(
            tap(() => {
              const newDocument = {...this.document};
              if (!newDocument.pages[pageIndex].annotations) return;
              const pageAnnotations = newDocument.pages[pageIndex].annotations as Annotation[];
              pageAnnotations[annotationIndex].coordinates = [
                parseInt(annotationElement.style.left, 10),
                parseInt(annotationElement.style.top, 10),
              ];
              this.documentChanged.next(newDocument);
            })
          )
        ),
        map((e) => e as MouseEvent)
      )
      .subscribe((event) => {
        annotationElement.style.left = `${event.clientX - pageRect.x}px`;
        annotationElement.style.top = `${event.clientY - pageRect.y}px`;
      });
  }

  public calculateAnnotationNgStyle(annotation: Annotation) {
    return {
      top: `${annotation.coordinates[1]}px`,
      left: `${annotation.coordinates[0]}px`,
      height: `${annotation.size[0]}px`,
      width: `${annotation.size[1]}px`,
    };
  }
}
