import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
// Module components
import { AuthComponent } from './auth.component';
import { LoginComponent } from './pages/login/login.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { RegisterComponent } from './pages/register/register.component';

const routes: Routes = [
	{
		path: '',
		component: AuthComponent,
		children: [
			{
				path: '',
				redirectTo: 'login',
				pathMatch: 'full',
			},
			{
				path: 'login',
				component: LoginComponent,
				// data: { returnUrl: window.location.pathname },
			},
			{
				path: 'sign-up',
				component: RegisterComponent,
			},
			{
				path: 'forgot-password',
				component: ForgotPasswordComponent,
			},
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class AuthRoutingModule { }
