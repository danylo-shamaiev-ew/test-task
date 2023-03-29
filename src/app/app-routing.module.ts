import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {
    path: 'viewer',
    loadChildren: () => import('./viewer/viewer.module').then((m) => m.ViewerModule),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'viewer'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
