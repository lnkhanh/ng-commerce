import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { DashboardComponent } from './pages/dashboard/dashboard.component';

// Customers
import { CustomersListComponent } from './pages/customers/customers-list/customers-list.component';
import { CustomerEditComponent } from './pages/customers/customer-edit/customer-edit.component';
// Products
import { ProductsListComponent } from './pages/products/products-list/products-list.component';
import { ProductEditComponent } from './pages/products/product-edit/product-edit.component';

// Orders
import { OrderListComponent } from './pages/orders/order-list/order-list.component';
import { ViewOrderComponent } from './pages/orders/view-order/view-order.component';

// Stores
import { StoreListComponent } from './pages/stores/store-list/store-list.component';
import { StoreEditComponent } from './pages/stores/store-edit/store-edit.component';

// Categories
import { CategoryListComponent } from './pages/categories/category-list/category-list.component';

// Option Sets
import { OptionSetListComponent } from './pages/option-set/option-set-list/option-set-list.component';
import { EditOptionSetComponent } from './pages/option-set/edit-option-set/edit-option-set.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      // Customer
      {
        path: 'customers',
        component: CustomersListComponent,
      },
      {
        path: 'customers/edit/:id',
        component: CustomerEditComponent,
      },
      // product
      {
        path: 'products',
        component: ProductsListComponent,
      },
      {
        path: 'products/edit/:id',
        component: ProductEditComponent,
      },
      // Store
      {
        path: 'stores',
        component: StoreListComponent,
      },
      {
        path: 'stores/edit/:id',
        component: StoreEditComponent,
      },
      // Option Set
      {
        path: 'option-sets',
        component: OptionSetListComponent,
      },
      {
        path: 'option-sets/:id',
        component: EditOptionSetComponent
      },
      // Category
      {
        path: 'categories',
        component: CategoryListComponent,
      },
      // Order
      {
        path: 'orders',
        component: OrderListComponent,
      },
      {
        path: 'orders/view/:id',
        component: ViewOrderComponent
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ECommerceRoutingModule { }
