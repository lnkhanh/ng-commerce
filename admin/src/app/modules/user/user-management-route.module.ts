import { UserManagementComponent } from './user-management.component';
import { RouterModule, Routes } from '@angular/router';
import { UsersListComponent } from './users/users-list/users-list.component';
import { UserEditComponent } from './users/user-edit/user-edit.component';
import { RolesListComponent } from './roles/roles-list/roles-list.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    component: UserManagementComponent,
    children: [
      {
        path: '',
        redirectTo: 'roles',
        pathMatch: 'full',
      },
      {
        path: 'roles',
        component: RolesListComponent,
      },
      {
        path: 'users',
        component: UsersListComponent,
      },
      {
        path: 'users:id',
        component: UsersListComponent,
      },
      {
        path: 'users/add',
        component: UserEditComponent,
      },
      {
        path: 'users/add:id',
        component: UserEditComponent,
      },
      {
        path: 'users/edit',
        component: UserEditComponent,
      },
      {
        path: 'users/edit/:id',
        component: UserEditComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
