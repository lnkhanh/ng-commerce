// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Components
import { BaseComponent } from './core/views/theme/base/base.component';
import { ErrorPageComponent } from './core/views/theme/content/error-page/error-page.component';
// Auth
import { AuthGuard } from './modules/auth';

const routes: Routes = [
	{ path: 'auth', loadChildren: () => import('app/modules/auth/auth.module').then(m => m.AuthModule) },
	{
		path: 'pos',
		canActivate: [AuthGuard],
		children: [
			{
				path: '',
				loadChildren: () => import('app/modules/point-of-sale/point-of-sale.module').then(m => m.PointOfSaleModule),
			},
		]
	},
	{
		path: '',
		component: BaseComponent,
		canActivate: [AuthGuard],
		children: [
			{
				path: 'user-management',
				loadChildren: () => import('app/modules/user/user-management.module').then(m => m.UserManagementModule)
			},
			{
				path: 'ecommerce',
				loadChildren: () => import('app/modules/e-commerce/e-commerce.module').then(m => m.ECommerceModule),
			},
			{
				path: 'settings',
				loadChildren: () => import('app/modules/settings/settings.module').then(m => m.SettingsModule),
			},
			{
				path: 'error/403',
				component: ErrorPageComponent,
				data: {
					type: 'error-v6',
					code: 403,
					title: '403... Access forbidden',
					desc: 'Looks like you don\'t have permission to access for requested page.<br> Please, contact administrator'
				}
			},
			{ path: 'error/:type', component: ErrorPageComponent },
			{ path: '', redirectTo: 'ecommerce/dashboard', pathMatch: 'full' },
			{ path: '**', redirectTo: 'ecommerce/dashboard', pathMatch: 'full' }
		]
	},

	{ path: '**', redirectTo: 'error/403', pathMatch: 'full' },
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes)
	],
	exports: [RouterModule]
})
export class AppRoutingModule {
}
