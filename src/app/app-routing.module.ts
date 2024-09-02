import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './layout/main/main.component';

const routes: Routes = [
  {
    path:"",
    component:MainComponent,
  },
  {
    path: 'biblioteca',
    component: MainComponent,
    loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule)
  },
  {path:"", redirectTo:"/biblioteca", pathMatch:"full"},
  {path:"**", redirectTo:"/biblioteca", pathMatch:"full"},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
