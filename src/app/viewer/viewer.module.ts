import {NgModule} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';

import {ViewerRoutingModule} from './viewer-routing.module';
import {ViewerComponent} from './viewer.component';
import { DocumentComponent } from './document/document.component';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [ViewerComponent, DocumentComponent],
  imports: [CommonModule, ViewerRoutingModule, NgOptimizedImage, FormsModule]
})
export class ViewerModule {}
