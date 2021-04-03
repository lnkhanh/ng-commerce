// Customers
import { CustomersListComponent } from './customers/customers-list/customers-list.component';
import { CustomerEditComponent } from './customers/customer-edit/customer-edit.component';
import { ChangePasswordComponent } from './customers/_subs/change-password/change-password.component';
import { CustomerGeneralComponent } from './customers/_subs/general/general.component';
import { AddNewCustomerDialogComponent } from './customers/add-new-customer-dialog/add-new-customer-dialog.component';
// Products
import { ProductsListComponent } from './products/products-list/products-list.component';
import { ProductEditComponent } from './products/product-edit/product-edit.component';
import { ProductGeneralComponent } from './products/_subs/general/general.component';
import { ProductImageComponent } from './products/_subs/product-image/product-image.component';
import { ProductOptionSetsComponent } from './products/_subs/option-sets/option-sets.component';
// Stores
import { StoreListComponent } from './stores/store-list/store-list.component';
import { StoreEditComponent } from './stores/store-edit/store-edit.component';
import { StoreGeneralComponent } from './stores/_subs/general/general.component';
import { AddNewStoreDialogComponent } from './stores/add-new-store-dialog/add-new-store-dialog.component';
import { StoreTableComponent } from './stores/_subs/table/table.component';
// Categories
import { CategoryListComponent } from './categories/category-list/category-list.component';

// Orders
import { OrderListComponent } from './orders/order-list/order-list.component';
import { ViewOrderComponent } from './orders/view-order/view-order.component';

// Option Sets
import { OptionSetListComponent } from './option-set/option-set-list/option-set-list.component';
import { AddNewOptionSetDialogComponent } from './option-set/add-new-option-set-dialog/add-new-option-set-dialog.component';
import { EditOptionSetComponent } from './option-set/edit-option-set/edit-option-set.component';

// Dashboard
import { DashboardComponent } from './/dashboard/dashboard.component';
import { OrderRevenueChartComponent } from './dashboard/order-revenue-chart/order-revenue-chart.component';
import { OrderRevenueListComponent } from './dashboard/order-revenue-list/order-revenue-list.component';
import { CustomRangeDatetimeComponent } from './dashboard/custom-range-datetime/custom-range-datetime.component';


export const E_COMMERCE_COMPONENTS = [
  // Customers
  CustomersListComponent,
  AddNewCustomerDialogComponent,
  CustomerEditComponent,
  ChangePasswordComponent,
  CustomerGeneralComponent,
  // Products
  ProductsListComponent,
  ProductEditComponent,
  ProductGeneralComponent,
  ProductImageComponent,
  ProductOptionSetsComponent,
  // Stores
  AddNewStoreDialogComponent,
  StoreListComponent,
  StoreEditComponent,
  StoreGeneralComponent,
  StoreTableComponent,
  // Stores
  CategoryListComponent,
  // Orders
  OrderListComponent,
  ViewOrderComponent,
  // Dashboard
  DashboardComponent,
  OrderRevenueChartComponent,
  OrderRevenueListComponent,
  CustomRangeDatetimeComponent,
  // Option Sets
  OptionSetListComponent,
  AddNewOptionSetDialogComponent,
  EditOptionSetComponent
];