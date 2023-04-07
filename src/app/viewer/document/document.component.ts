import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import {Document} from '../../core/models/document.model';
import {Annotation} from '../../core/models/annotation.model';
import {fromEvent, map, takeUntil, tap} from 'rxjs';
import {XYTuple} from '../../core/models/xy-tuple.model';

const ANNOTATION_MARGIN = 16;

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentComponent {
  @Input() document!: Document;
  @Output() documentChanged = new EventEmitter<Document>();
  @ViewChild('newAnnotation') newAnnotation!: ElementRef<HTMLElement>;
  @ViewChild('newTextAnnotation') newTextAnnotation!: ElementRef<HTMLElement>;
  @ViewChild('newImageAnnotation') newImageAnnotation!: ElementRef<HTMLElement>;
  public selectedPageIndex!: number;
  public selectedPageCoordinates!: XYTuple;
  public newAnnotationCoordinates!: XYTuple;
  public newAnnotationText = '';

  public handleAddAnnotation($event: MouseEvent, pageIndex: number) {
    $event.stopPropagation();
    if (!this.newAnnotation.nativeElement.classList.contains('hidden')) return;
    this.selectedPageIndex = pageIndex;
    this.newAnnotation.nativeElement.style.top = `${$event.pageY}px`;
    this.newAnnotation.nativeElement.style.left = `${$event.pageX}px`;
    this.newAnnotation.nativeElement.classList.remove('hidden');
    this.selectedPageCoordinates = [$event.offsetX, $event.offsetY];
    this.newAnnotationCoordinates = [$event.pageX, $event.pageY];
  }

  public handleAddNewTextAnnotation($event: MouseEvent) {
    $event.stopPropagation();
    this.newAnnotation.nativeElement.classList.add('hidden');
    this.newTextAnnotation.nativeElement.style.top = `${this.newAnnotationCoordinates[1]}px`;
    this.newTextAnnotation.nativeElement.style.left = `${this.newAnnotationCoordinates[0]}px`;
    this.newTextAnnotation.nativeElement.classList.remove('hidden');
  }

  public handleAddNewImageAnnotation($event: MouseEvent) {
    $event.stopPropagation();
    this.newAnnotation.nativeElement.classList.add('hidden');
    this.newImageAnnotation.nativeElement.style.top = `${this.newAnnotationCoordinates[1]}px`;
    this.newImageAnnotation.nativeElement.style.left = `${this.newAnnotationCoordinates[0]}px`;
    this.newImageAnnotation.nativeElement.classList.remove('hidden');
  }

  public handleSaveAnnotationAsText() {
    const newDocument = {...this.document};
    if (!newDocument.pages[this.selectedPageIndex].annotations) return;
    const pageAnnotations = newDocument.pages[this.selectedPageIndex].annotations as Annotation[];
    pageAnnotations.push({
      coordinates: this.selectedPageCoordinates,
      size: [100, 100],
      content: this.newAnnotationText,
      type: 'text',
    });
    this.newTextAnnotation.nativeElement.classList.add('hidden');
    this.newTextAnnotation.nativeElement.getElementsByTagName('textarea')[0].value = '';
    this.documentChanged.next(newDocument);
  }

  public handleSaveAnnotationAsImage(base64Image: string) {
    const newDocument = {...this.document};
    if (!newDocument.pages[this.selectedPageIndex].annotations) return;
    const pageAnnotations = newDocument.pages[this.selectedPageIndex].annotations as Annotation[];
    pageAnnotations.push({
      coordinates: this.selectedPageCoordinates,
      size: [200, 200],
      content: base64Image,
      type: 'image',
    });
    this.newImageAnnotation.nativeElement.classList.add('hidden');
    this.newImageAnnotation.nativeElement.getElementsByTagName('input')[0].value = '';
    this.documentChanged.next(newDocument);
  }

  public handleImageUpload($event: Event) {
    if (!$event.target) return;
    const target = $event.target as HTMLInputElement;
    if (!target.files) return;
    const file = target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.handleSaveAnnotationAsImage(`${reader.result}`);
    };
  }

  public handleRemoveAnnotation($event: Event, pageIndex: number, annotationIndex: number) {
    $event.stopPropagation();
    const newDocument = {...this.document};
    newDocument.pages[pageIndex].annotations?.splice(annotationIndex, 1);
    this.documentChanged.next(newDocument);
  }

  public handleHideNewAnnotation($event: Event) {
    $event.stopPropagation();
    this.newAnnotation.nativeElement.classList.add('hidden');
  }

  public handleHideNewTextAnnotation($event: Event) {
    $event.stopPropagation();
    this.newTextAnnotation.nativeElement.classList.add('hidden');
  }

  public handleHideNewImageAnnotation($event: Event) {
    $event.stopPropagation();
    this.newImageAnnotation.nativeElement.classList.add('hidden');
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
            tap(() =>
              this.handleAnnotationDragFinished(pageIndex, annotationIndex, annotationElement)
            )
          )
        ),
        map((e) => e as MouseEvent)
      )
      .subscribe((event) => {
        if (
          this.checkPageBorderCollision(event, pageRect, annotationElement)
        )
          return;
        annotationElement.style.left = `${event.clientX - pageRect.x}px`;
        annotationElement.style.top = `${event.clientY - pageRect.y}px`;
      });
  }

  private checkPageBorderCollision(event: MouseEvent, pageRect: DOMRect, annotationElement: HTMLElement) {
    return event.clientX - ANNOTATION_MARGIN < pageRect.x ||
      event.clientY - ANNOTATION_MARGIN < pageRect.y ||
      event.clientX - (annotationElement.clientWidth * 2) - ANNOTATION_MARGIN > pageRect.width ||
      event.clientY + annotationElement.clientHeight > pageRect.bottom;
  }

  private handleAnnotationDragFinished(
    pageIndex: number,
    annotationIndex: number,
    annotationElement: HTMLElement
  ) {
    const newDocument = {...this.document};
    if (!newDocument.pages[pageIndex].annotations) return;
    const pageAnnotations = newDocument.pages[pageIndex].annotations as Annotation[];
    pageAnnotations[annotationIndex].coordinates = [
      parseInt(annotationElement.style.left, 10),
      parseInt(annotationElement.style.top, 10),
    ];
    this.documentChanged.next(newDocument);
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
