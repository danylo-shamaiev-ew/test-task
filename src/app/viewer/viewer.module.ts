import {NgModule} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';

import {ViewerRoutingModule} from './viewer-routing.module';
import {ViewerComponent} from './viewer.component';
import { DocumentComponent } from './document/document.component';

@NgModule({
  declarations: [ViewerComponent, DocumentComponent],
  imports: [CommonModule, ViewerRoutingModule, NgOptimizedImage]
})
export class ViewerModule {}
