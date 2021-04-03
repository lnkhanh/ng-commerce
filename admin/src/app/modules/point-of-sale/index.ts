import { HomeComponent } from './pages/home/home.component';
import { OrderDetailsDialogComponent } from './pages/order-details-dialog/order-details-dialog.component';
import { OrderListDialogComponent } from './pages/order-list-dialog/order-list-dialog.component';
import { PosLayoutComponent } from './point-of-sale.component';

export const POS_PAGES = [
	PosLayoutComponent,
	HomeComponent,
	OrderListDialogComponent,
	OrderDetailsDialogComponent
];
