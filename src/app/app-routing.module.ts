import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from "./components/home.component";
import { DataBankHomepageComponent } from "./components/data-bank-homepage.component";

const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'team-builder', component: HomeComponent},
    {path: 'data-bank', component: DataBankHomepageComponent},
    {path: 'characters', component: DataBankHomepageComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
