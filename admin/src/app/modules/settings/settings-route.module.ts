import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { SettingsComponent } from './settings.component';
import { BackupComponent } from './pages/backup/backup.component';

const routes: Routes = [
	{
		path: '',
		component: SettingsComponent,
		children: [
			{
				path: '',
				redirectTo: 'backup',
				pathMatch: 'full',
			},
			{
				path: 'backup',
				component: BackupComponent,
			},
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class SettingsRoutingModule { }
