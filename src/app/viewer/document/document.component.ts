import {ChangeDetectionStrategy, Component, Input, OnChanges} from '@angular/core';
import {Document} from '../../core/models/document.model';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentComponent implements OnChanges {
  @Input() document!: Document;

  ngOnChanges() {}
}
