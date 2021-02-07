import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AttrComponent } from './attr/attr.component';

const routes: Routes = [
    { path: 'attr', component: AttrComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
