import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { HomeComponent } from './pages/home/home.component';
import { PosLayoutComponent } from './point-of-sale.component';
// import { PosLayoutComponent } from '@app/modules/point-of-sale/point-of-sale.component';

const routes: Routes = [
  {
    path: '',
    component: PosLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        component: HomeComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PosRoutingModule { }
