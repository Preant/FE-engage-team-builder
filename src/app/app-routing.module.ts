import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomePageComponent } from '@/app/pages/home-page/home.page.component';

const routes: Routes = [
  { path: '', component: HomePageComponent, title: 'Home' },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
