import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CharacterDetailComponent } from '@/app/components/character-detail.component';
import { CharactersPageComponent } from '@/app/components/pages/characters.page.component';
import { HomePageComponent } from '@/app/components/pages/home.page.component';
import { ResourcesPageComponent } from '@/app/components/pages/resources.page.component';

const routes: Routes = [
  // add titles to the routes
  //remove selector on page component
  { path: '', component: HomePageComponent },
  { path: 'team-builder', component: HomePageComponent },
  { path: 'resources', component: ResourcesPageComponent },
  { path: 'characters', component: CharactersPageComponent },
  { path: 'characters/:name', component: CharacterDetailComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
