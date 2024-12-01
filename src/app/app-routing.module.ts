import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CharacterDetailComponent } from '@/app/components/character-detail.component';
import { CharactersPageComponent } from '@/app/pages/characters-page/characters.page.component';
import { HomePageComponent } from '@/app/pages/home-page/home.page.component';
import { ResourcesPageComponent } from '@/app/pages/resources-page/resources-page.component';

const routes: Routes = [
  { path: '', component: HomePageComponent, title: 'Home' },
  { path: 'team-builder', component: HomePageComponent, title: 'Team Builder' },
  { path: 'resources', component: ResourcesPageComponent, title: 'Resources' },
  { path: 'characters', component: CharactersPageComponent, title: 'Characters' },
  { path: 'characters/:name', component: CharacterDetailComponent, title: 'Character Detail' },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
