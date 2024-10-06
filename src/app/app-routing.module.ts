import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from "./components/home.component";
import { ResourcesComponent } from "./components/resources.component";
import { CharacterListComponent } from "./components/character-list.component";
import { CharacterDetailComponent } from "./components/character-detail.component";

const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'teambuilder', component: HomeComponent},
    {path: 'resources', component: ResourcesComponent},
    {path: 'characters', component: CharacterListComponent},
    {path: 'characters/:name', component: CharacterDetailComponent},
    {path: '**', redirectTo: ''}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
