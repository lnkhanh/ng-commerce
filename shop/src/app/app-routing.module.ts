import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BaseComponent } from './layouts/base/base.component';
import { AuthGuard } from './modules/auth';

const routes: Routes = [
	{
		path: 'auth',
		component: BaseComponent,
		loadChildren: () => import('../../src/app/modules/auth/auth.module').then(m => m.AuthModule)
	},
	{
		path: 'account',
		component: BaseComponent,
		canActivate: [AuthGuard],
		children: [
			{
				path: '',
				loadChildren: () => import('../../src/app/modules/account/account.module').then(m => m.AccountModule),
			},
		]
	},
	{
		path: '',
		component: BaseComponent,
		children: [
			{
				path: '',
				loadChildren: () => import('../../src/app/modules/home/home.module').then(m => m.HomeModule),
			},
		]
	},
	{ path: '', redirectTo: 'home', pathMatch: 'full' },
	{ path: '**', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
