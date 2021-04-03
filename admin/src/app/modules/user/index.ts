import { UserManagementComponent } from './user-management.component';
import { UsersListComponent } from './users/users-list/users-list.component';
import { UserEditComponent } from './users/user-edit/user-edit.component';
import { RolesListComponent } from './roles/roles-list/roles-list.component';
import { RoleEditDialogComponent } from './roles/role-edit/role-edit.dialog.component';
import { ChangePasswordComponent } from './users/_subs/change-password/change-password.component';
import { UserGeneralComponent } from './users/_subs/general/general.component';
import { AddNewUserDialogComponent } from './users/add-new-user-dialog/add-new-user-dialog.component';

export const USER_COMPONENTS = [
  UserManagementComponent,
  UsersListComponent,
  UserEditComponent,
  RolesListComponent,
  RoleEditDialogComponent,
  ChangePasswordComponent,
  UserGeneralComponent,
  AddNewUserDialogComponent,
];
