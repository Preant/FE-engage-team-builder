import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CharacterDetailComponent } from '@/app/components/character-detail.component';
import { WeaponDetailComponent } from '@/app/components/weapon-detail.component';
import { characterExistsGuard } from '@/app/guards/character-exists.guard';
import { weaponExistsGuard } from '@/app/guards/weapons-exists.guard';
import { CharactersPageComponent } from '@/app/pages/characters-page/characters.page.component';
import { EmblemsPageComponent } from '@/app/pages/emblems-page/emblems-page.component';
import { HomePageComponent } from '@/app/pages/home-page/home.page.component';
import { ResourcesPageComponent } from '@/app/pages/resources-page/resources-page.component';

const routes: Routes = [
  { path: '', component: HomePageComponent, title: 'Home' },
  { path: 'team-builder', component: HomePageComponent, title: 'Team Builder' },
  { path: 'resources', component: ResourcesPageComponent, title: 'Resources' },
  { path: 'characters', component: CharactersPageComponent, title: 'Characters' },
  { path: 'emblems', component: EmblemsPageComponent, title: 'Emblems' },
  {
    path: 'characters/:identifier',
    component: CharacterDetailComponent,
    title: 'Character Detail',
    canActivate: [characterExistsGuard]
  },
  {
    path: 'weapons/:identifier',
    component: WeaponDetailComponent,
    title: 'Weapon Detail',
    canActivate: [weaponExistsGuard]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
