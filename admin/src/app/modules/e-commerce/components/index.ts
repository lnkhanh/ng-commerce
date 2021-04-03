import { DASHBOARD_COMPONENTS } from './dashboard';
import { PRODUCT_COMPONENTS } from './product';
import { OPTION_SET_COMPONENTS } from './option-set';

// Product
import { AddNewProductDialogComponent } from './add-new-product-dialog/add-new-product-dialog.component';
import { ComposeCategoryDialogComponent } from './compose-category-dialog/compose-category-dialog.component';
import { ComposeTableDialogComponent } from './compose-table-dialog/compose-table-dialog.component';
// Order
import { OrderSummaryComponent } from './orders/order-summary/order-summary.component';
import { ListOrderItemComponent } from './orders/list-order-item/list-order-item.component';


export const PRESENTATION_COMPONENTS = [
  ...DASHBOARD_COMPONENTS,
  ...PRODUCT_COMPONENTS,
  ...OPTION_SET_COMPONENTS,
  // Product
  ComposeTableDialogComponent,
  AddNewProductDialogComponent,
  ComposeCategoryDialogComponent,
  // Order
  ListOrderItemComponent,
  OrderSummaryComponent,
];
